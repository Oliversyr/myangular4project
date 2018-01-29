import { SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GridData } from './../../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { Injectable} from '@angular/core';

import { ModalService } from '../../../../common/components/modal/modal.service';
import { RequestMethod } from '@angular/http';

/**
 * 账户列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-17
 */

@Injectable()

export class SubAcctListService {
    constructor(
        private suiHttp: SuiHttpService,private globalService: GlobalService
    ) {
    }
    /**
     * 获取账户列表
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        searchParam.pageSize=param.pageSize
        searchParam.pageNum=param.pageNum
        searchParam.totalCount=param.totalCount
        let myParam = {
            url: 'acctmgr/subacct/list/query',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            urlParam : searchParam
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            return {
                rows: data.data.result,
                footer: {
                    pageNum: data.data.pageNum,
                    pageSize: data.data.pageSize,
                    totalCount: data.data.totalRecord
                }
            };
        })
    }


    /**
     * 禁用
     */
    doStop(subacctids: Array<any>): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'acctmgr/subacct/status/stop',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: subacctids
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            return data;
        })
    }
    /**
     * 启用
     */
    doStart(subacctids: Array<any>): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'acctmgr/subacct/status/start',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: subacctids
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            return data;
        })
    }
    /**
     * 转账
     */
    doTransfer(param): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'transmgr/transferacct/info/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            return data;
        })
    }



}