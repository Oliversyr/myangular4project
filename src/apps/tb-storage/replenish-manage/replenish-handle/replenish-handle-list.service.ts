import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from './../../../../common/services/groups/common-services.module';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { SuiHttpService } from './../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { ReplenishHandleService } from './replenish-handle.service';

/*
 * 补货申请处理模块列表服务
 * @Author: xiahl 
 * @Date: 2017-12-26 10:57:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-22 15:06:56
 */
@Injectable()
export class ReplenishHandleListService extends ReplenishHandleService {

    constructor(
        modalSer: ModalService,
        suiHttp: SuiHttpService,
        util: CommonServices,
        globalService: GlobalService
    ) {
        super(modalSer, suiHttp, util, globalService);
    }

    /**
     * 获取补货处理单列表数据
     */
    getList(bodyParam: any): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/replenish/handle/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: bodyParam
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
     * 新建补货申请单
     */
    add(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/replenish/add',
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
     * 处理补货申请单
     */
    handle(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/replenish/handle',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: {
                handleitems: param
            }
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            };
            return data;
        })
    }

}
