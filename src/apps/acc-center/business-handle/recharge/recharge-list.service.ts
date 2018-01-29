/*
@Description: 账户中心 - 充值记录列表
 * @Author: cheng
 * @Date: 2018-01-26 10:35:31
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-26 20:23:27
 */
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiLocalConfig } from './../../../../common/global/sui-local-config';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { Injectable } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonServices } from '../../../../common/services/groups/common-services.module';
import { SuiCookieService } from '../../../../common/services/storage/sui-cookie.service';
import { RequestMethod } from '@angular/http';
import { SuiResponse, SuiRequest, ResponseRetCode } from '../../../../common/services/https/sui-http-entity';
import { GridPage } from '../../../../common/components/grid/grid-option';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { Request } from '@angular/http/src/static_request';
import { ModalService } from '../../../../common/components/modal/modal.service';

@Injectable()
export class RechargeListService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private modalSer: ModalService,
        private globalService: GlobalService
    ) {

    }

    private ROOTPATH: string = this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH;
    // 列示所有的请求路径
    private SELF_URL = {
        // POST	查询线下充值记录列表
        list: '/transmgr/offrecharge/list/query',
        // POST	新增线下充值记录
        add: '/transmgr/offrecharge/info/add',
        // POST	修改线下充值记录
        update: '/transmgr/offrecharge/info/update',
        // 	POST	查询线下充值记录详情
        detail: '/transmgr/offrecharge/info/get',
        // POST	审核线下充值记录
        check: '/transmgr/offrecharge/info/check',
        // POST	删除线下充值记录
        delete: '/transmgr/offrecharge/info/del'
    };
    
    /**
     * 获取充值列表
     */
    getSheet(param, searchParam): Observable<GridData<any>>{
        console.log('获取充值列表',  param, searchParam);
        if (!param.orderDirect){
            searchParam.sorttype = 'desc';
        }else{
            searchParam.sorttype = param.orderDirect.toString().toLowerCase();
        }
        if (!param.orderField){
            searchParam.sortby = 'createtime';
        }else{
            searchParam.sortby = param.orderField.toString().toLowerCase();
        }
        Object.assign(param, searchParam);
        let httpParam: SuiRequest<any, any> = {
            url: this.SELF_URL.list,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        
        return this.suiHttp.request(httpParam).map( (data: SuiResponse<any>) => {
            console.log('获取充值列表',  data);
            if (data.retCode != ResponseRetCode.SUCCESS){
                this.modalSer.modalToast(data.message);
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
     * 审核
     */
    doCheck(param){
        let httpParam: SuiRequest<any, any> = {
            url: this.SELF_URL.check,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(httpParam).map( (data: SuiResponse<any>) => {
            console.log('审核',  data);
            return data;
        });
    }

    /**
     * 删除
     */
    doDelete(param){
        let httpParam: SuiRequest<any, any> = {
            url: this.SELF_URL.delete,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(httpParam).map( (data: SuiResponse<any>) => {
            console.log('删除',  data);
            return data;
        });
    }

}
