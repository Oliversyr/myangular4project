import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../top-common/top-common';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from '../../../services/https/sui-http-entity';
import { CommonServices } from '../../../services/groups/common-services.module';
import { GlobalService } from '../../../global/global.service';
import { ModalService } from '../../../components/modal/modal.service';

/**
 * @author xiahl
 * @date 2017-11-13
 * @notes 获取品类树数据服务
 */
@Injectable()
export class SuiCategoryService extends TopCommon {
    _data: Array<any> = [];

    get data(): any {
        return this._data;
    };

    set data(data: any) {
        if (data === null) {
            return;
        }
        this._data = data;
    }

    constructor(
        private modalSer: ModalService,
        private uitls: CommonServices,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
        super();
    }

    /**
     * 获取品类列表树数据
     */
    public getCategoryList(): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/goods/category/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: {
                "catName": "",
                "type": 1,
                "levelid": 3
            }
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            };
            let res: any[] = !data.data.result ? [] : data.data.result;
            this.transData(res);
            this.data = res;
            return res;
        });
    }

    /**
     * 转换后台树形结构数据的字段属性名称
     * @param data 
     */
    public transData(data): any {
        let attributeNames = {
            catId: 'id',
            catName: 'label',
            lowerCatList: 'items'
        }
        for (let i = 0; i < data.length; i++) {
            this.uitls.classUtil.changeObjAttributeName(data[i], attributeNames);
            let _items = data[i].items;
            if (!!_items && _items.length > 0) {
                this.transData(_items);
            }
        }
    }

    /**
     * 将树形结构数据转换成平级
     * @param tree Array
     * @param flatArr 
     */
    public treeToFlat(tree, flatArr) {
        var flatArr = flatArr || [];
        for (let i = 0; i < tree.length; i++) {
            let items = tree[i].items;
            flatArr.push(tree[i]);
            if (!!items && Array.isArray(items) && items.length > 0) {
                this.treeToFlat(items, flatArr);
            }
        }
        return flatArr;
    }

    /**
     * 将后台数据转换成树形结构数据
     * @param data 
     */
    public transTreeData(data, curData?: any[]) {
        let pid = -1; //根据业务规则定：pid=-1，为最上层节点 ，即无父节点
        curData = data.slice(0);
        if (curData.length > 0) {
            var curPid = pid;
            var parent = this.findChildNode(curData, curPid);
            return parent;
        } else {
            return [];
        }
    }

    /**
     * 找子节点
     * @param data 
     * @param curPid 
     */
    public findChildNode(data, curPid) {
        let _arr = [],
            items = data,
            length = items.length;
        for (let i = 0; i < length; i++) {
            if (items[i].parentId == curPid) {
                var _obj = Object.assign({}, items[i]);
                _obj.items = this.findChildNode(data, _obj.id);
                _arr.push(_obj);
            }
        }
        return _arr;
    }

    /**
     * 寻找本节点以及父节点id集合
     * @param data 
     * @param curNode 
     */
    public findParentNodes(data, curNode) {
        let _arr = [],
            items = data,
            length = items.length,
            curId = curNode.id,
            curPid = curNode.parentId;
        _arr.push(curId);
        for (let i = 0; i < length; i++) {
            let _obj = items[i],
                _objId = _obj.id;
            if (curPid !== -1 && _objId == curPid) {
                _arr.push(_objId);
                let _temp = this.findParentNodes(data, _obj);
                _arr = _arr.concat(_temp);
                break;
            }
        }
        return _arr;
    }
}