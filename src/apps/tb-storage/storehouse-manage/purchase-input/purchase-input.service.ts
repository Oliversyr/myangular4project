import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../../common/top-common/top-common';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from './../../../../common/services/groups/common-services.module';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { SuiHttpService } from './../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from './../../../../common/services/https/sui-http-entity';
import { ToolBarButton } from './../../../../common/components/toolbar/toolbar';


/**
 * 采购入库模块基本服务
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:08:13
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-15 10:40:20
 */
@Injectable()
export class PurchaseInputService extends TopCommon {
    constructor(
        public modalSer: ModalService,
        public suiHttp: SuiHttpService,
        public util: CommonServices,
        public globalService: GlobalService
    ) {
        super();
    }

    /**
     * 获取工具栏额外的功能按钮
     */
    getExtraBtns(): ToolBarButton[] {
        let extraBtns: ToolBarButton[] = [
            // {
            //     name: "editComplete",
            //     label: "编辑完成",
            //     placeholder: "编辑完成",
            //     state: true,
            //     useMode: "GRID_BAR",
            //     userPage: "A|M|B"
            // }
        ];
        return extraBtns;
    }

    /**
     * 采购入库单新建: 列表、编辑、详情页面都需要使用
     */
    add(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/purchase/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            };
            return data;
        })
    }

    /**
     * 采购入库单列表数据操作: 列表、编辑、详情页面都需要使用
     */
    operate(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/purchase/operate',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            }
            return data;
        })
    }
}