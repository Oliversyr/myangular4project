import { SuiRequest } from './../../../common/services/https/sui-http-entity';
import { GridData } from './../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../../../common/global/global.service';
import { SuiHttpService } from '../../../common/services/https/sui-http.service';
import { Injectable } from '@angular/core';
import { ModalService } from '../../../common/components/modal/modal.service';
import { CommonServices } from '../../../common/services/groups/common-services.module';
import { RequestMethod } from '@angular/http';

/**
 * 账户资料列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-23
 */

@Injectable()

export class AcctInfoListService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }
    /**
     * 获取账户资料列表
     */
    getGridData(): Observable<any> {
        var param = {
            params : {}
        }
        let myParam = {
            url: 'acctmgr/subacct/predefine/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            return {
                rows: data.data.result
            };
        })
    }

}