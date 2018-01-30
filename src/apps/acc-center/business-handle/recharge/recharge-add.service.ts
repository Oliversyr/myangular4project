/*
 @Description: 充值记录新增编辑详情模块
 * @Author: cheng
 * @Date: 2018-01-29 11:33:48
 * @Last Modified by:   cheng
 * @Last Modified time: 2018-01-29 11:33:48
 */
import { GlobalService } from './../../../../common/global/global.service';
import { SuiLocalConfig } from './../../../../common/global/sui-local-config';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import {Injectable} from '@angular/core';
import { RequestMethod } from '@angular/http';
import { SuiResponse, SuiRequest } from '../../../../common/services/https/sui-http-entity';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class RechargeAddService {
    constructor(
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
    }

    private ROOTPATH: string = this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH;
    // 列示所有的请求路径
    private SELF_URL = {
        add: '/transmgr/offrecharge/info/add',
        // POST	修改线下充值记录
        update: '/transmgr/offrecharge/info/update',
        // 	POST	查询线下充值记录详情
        detail: '/transmgr/offrecharge/info/get',
    };

    /**
     * 新建充值记录
     */
    doAdd(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: this.SELF_URL.add,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map( (data: SuiResponse<any>) => {
            console.log('新建充值记',  data);
            return data;
        });
    }
    
    /**
     * 充值记录更新
     */
    doUpdate(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: this.SELF_URL.update,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map( (data: SuiResponse<any>) => {
            console.log('充值记录更新',  data);
            return data;
        });
    }
    
    /**
     * 充值记录详情
     */
    doDetail(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: this.SELF_URL.detail,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map( (data: SuiResponse<any>) => {
            console.log('充值记录详情',  data);
            return data;
        });
    }
    
    
    /**
     * 获取账户列表
     */
    getSubAcctList(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'acctmgr/subacct/list/query',
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        });
    }
    

}
