import { NgModule, Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from '../../../../common/services/groups/common-services.module';
import { ModalService } from '../../../../common/components/modal/modal.service';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from './../../../../common/services/https/sui-http-entity';
import { DeliveryService } from './delivery.service';

/*
 * 配送单编辑模块服务
 * @Author: xiahl 
 * @Date: 2017-12-27 17:18:11 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-16 17:09:19
 */
@Injectable()
export class DeliveryEditService extends DeliveryService {
    constructor(
        modalSer: ModalService,
        suiHttp: SuiHttpService,
        util: CommonServices,
        globalService: GlobalService
    ) {
        super(modalSer, suiHttp, util, globalService);
    }

    /**
     * 配送单详情信息查询
     */
    getDetail(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/delivery/detail',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: { sheetid: param }
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            }
            return data;
        })
    }

    /**
     * 配送单列表数据更新
     */
    update(param): Observable<any> {
        let myParam = {
            url: 'api/storagem/delivery/update',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: param
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