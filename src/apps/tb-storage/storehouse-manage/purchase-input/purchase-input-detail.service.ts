import { NgModule, Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from '../../../../common/services/groups/common-services.module';
import { ModalService } from '../../../../common/components/modal/modal.service';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from './../../../../common/services/https/sui-http-entity';
import { PurchaseInputEditService } from './purchase-input-edit.service';

/*
 * 采购入库详情模块服务
 * @Author: xiahl 
 * @Date: 2017-12-27 17:11:56 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-15 10:42:20
 */
@Injectable()
export class PurchaseInputDetailService extends PurchaseInputEditService {
    constructor(
        modalSer: ModalService,
        suiHttp: SuiHttpService,
        util: CommonServices,
        globalService: GlobalService
    ) {
        super(modalSer, suiHttp, util, globalService);
    }
}