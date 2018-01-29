import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from './../../../../common/services/groups/common-services.module';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { SuiHttpService } from './../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { PayService } from './pay.service';

/*
 * 支付模块列表服务
 * @Author: xiahl 
 * @Date: 2017-12-26 10:57:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-26 11:26:53
 */
@Injectable()
export class PayListService extends PayService {

    constructor(
        modalSer: ModalService,
        suiHttp: SuiHttpService,
        util: CommonServices,
        globalService: GlobalService
    ) {
        super(modalSer, suiHttp, util, globalService);
    }

    /**
     * 支付账号列表查询
     */
    getList(bodyParam: any): Observable<any> {       
        let myParam: SuiRequest<any, any> = {
            url: 'api/salem/payaccountm/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: bodyParam
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
