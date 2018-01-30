import { SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GridData } from './../../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { Injectable } from '@angular/core';

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
        // param.params = searchParam;
        searchParam.pageSize = param.pageSize;
        searchParam.pageNum = param.pageNum;
        searchParam.totalCount = param.totalCount;
        const myParam = {
            url: 'transmgr/offwithdraw/list/query',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            isFormData: true,
            bodyParam: searchParam
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
    getDetail(sheetid: number): Observable<any> {
        const myParam = {
            url: 'transmgr/offwithdraw/info/get',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            isFormData: true,
            bodyParam: { sheetid: sheetid }
        };
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        });
    }

    /**
     * 查询提现配置
     */
    getOffwithdrawCfginfo(): Observable<any> {
        const myParam = {
            url: 'transmgr/offwithdraw/cfginfo/get',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            }
            return data.data.result;
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
            isFormData: true,
            globalLoad: true,
            bodyParam: {
                sheetid: sheetid
            },
            // urlParam: { sheetid: sheetid }
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
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
            isFormData: true,
            bodyParam: {
                sheetid: sheetid
            }
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            }
            return data;
        });
    }

    /**
     * 新增
     */
    doAdd(param): Observable<any> {
        const myParam: SuiRequest<any, any> = {
            url: 'transmgr/offwithdraw/info/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            isFormData: true,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            }
            console.log(data);
            return data;
        });
    }

    /**
     * 修改
     */
    doUpdate(param): Observable<any> {
        const myParam: SuiRequest<any, any> = {
            url: 'transmgr/offwithdraw/info/update',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            isFormData: true,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            }
            console.log(data);
            return data;
        });
    }

    /**
     * 获取账户列表
     */
    getSubAcctList(param): Observable<GridData<any>> {
        const myParam = {
            url: 'acctmgr/subacct/list/query',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            isFormData: true,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            }
            return data.data.result;
        });
    }

}