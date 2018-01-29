import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../top-common/top-common';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from '../../../services/https/sui-http-entity';
import { CommonServices } from '../../../services/groups/common-services.module';
import { GlobalService } from '../../../global/global.service';

/**
 * @author xiahl
 * @date 2017-11-13
 * @notes 获取品牌树数据服务
 */
@Injectable()
export class SuiBrandService extends TopCommon {
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
        private uitls: CommonServices,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
        super();
    }

    /**
     * 获取品类列表树数据
     */
    public getBrandList() {
        let myParam: SuiRequest<any, any> = {
            url: 'api/goods/brand/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: {
                "pageNum": 1,
                "pageSize": 9999,
                "totalRecord": 0,
                "totalPage": 0,
                "params": {
                    "brandName": "",
                    "status": -1
                }
            }
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            };
            let res: any[] = !data.data.result ? [] : data.data.result;
            this.data = res;
            return res;
        });
    }
}