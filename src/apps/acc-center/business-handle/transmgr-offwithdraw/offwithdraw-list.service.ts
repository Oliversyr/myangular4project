import { SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GridData } from './../../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { Injectable} from '@angular/core';

import { ModalService } from '../../../../common/components/modal/modal.service';
import { RequestMethod } from '@angular/http';

/**
 * 线下提现列表模块
 * @Created by: lizw
 * @Created Date: 2018-01-24
 */

@Injectable()

export class OffwithdrawListService {
    constructor(
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
    }
    /**
     * 获取列表
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        param.params = searchParam;
        const myParam = {
            url: 'transmgr/offwithdraw/list/query',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            }
            return {
                rows: data.data.result,
                footer: {
                    pageNum: data.data.pageNum,
                    pageSize: data.data.pageSize,
                    totalCount: data.data.totalRecord
                }
            };
        });
    }

    /**
     * 获取详情
     */
    getStorehouseDetail(stockid): Observable<any> {
        const myParam = {
            url: 'api/orgm/stockm/detail',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: { stockid: stockid }
        };
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        });
    }

    /**
     * 删除
     */
    doDel(sheetid: number): Observable<any> {
        const myParam: SuiRequest<any, any> = {
            url: 'transmgr/offwithdraw/info/del',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: {
                sheetid: sheetid
            }
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            return data;
        });
    }

    /**
     * 审核
     */
    doCheck(sheetid: number): Observable<any> {
        const myParam: SuiRequest<any, any> = {
            url: 'transmgr/offwithdraw/info/check',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: {
                sheetid: sheetid
            }
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            return data;
        });
    }

    /**
     * 转账
     */
    doTransfer(param): Observable<any> {
        const myParam: SuiRequest<any, any> = {
            url: 'transmgr/transferacct/info/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            console.log(data);
            return data;
        });
    }

}