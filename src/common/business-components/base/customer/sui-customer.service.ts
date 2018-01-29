import { Injectable, ViewChild } from '@angular/core';
import { TopCommon } from './../../../top-common/top-common';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { CommonServices } from '../../../services/groups/common-services.module';
import { Observable } from 'rxjs/Observable';
import { ModalService } from '../../../components/modal/modal.service';
import { RequestMethod } from '@angular/http';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiRequest } from './../../../../common/services/https/sui-http-entity';

/**
 * @author yangr
 * @date 2017-11-20
 * @notes 获取供应商数据服务
 */
@Injectable()
export class SuiCustomerService extends TopCommon {

    constructor(
        private utils: CommonServices,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
        super();
    }

    /**
     * 获取客户列表树数据
     */
    public getCustomData(obj) {
        let myParam: SuiRequest<any,any> = {
            url: 'acctmgr/acct/cust/list/query',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    // shopeid: this.userInfo.eid,
                    // keyflag: filterFields,
                    // keyvalue: key
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }

            return data.data.result;

        });
    }

    /**
     * 获取客户列表树数据
     */
    public getCustomList(key): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'acctmgr/acct/cust/list/query',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    // shopeid: this.userInfo.eid,
                    // keyflag: filterFields,
                    // keyvalue: key
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }

            let res = data.data;

            return {
                rows: res.result,
                footer: {
                    totalCount: res.totalRecord,
                    pageNum: res.pageNum,
                    pageSize: res.pageSize
                }
            }
        });
    }
}