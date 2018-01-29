import { NgModule, Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from '../../../../common/services/groups/common-services.module';
import { ModalService } from '../../../../common/components/modal/modal.service';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from './../../../../common/services/https/sui-http-entity';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { PayEditService } from './pay-edit.service';

/*
 * 支付管理详情模块服务
 * @Author: xiahl 
 * @Date: 2017-12-27 17:11:56 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-25 14:55:53
 */
@Injectable()
export class PayDetailService extends PayEditService {
    constructor(
        modalSer: ModalService,
        suiHttp: SuiHttpService,
        util: CommonServices,
        globalService: GlobalService
    ) {
        super(modalSer, suiHttp, util, globalService);
    }

    /**
     * 获取调拨单列表数据
     */
    getList(bodyParam: any): Observable<GridData<any>> {        
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/transfer/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: bodyParam
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
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
        })
    }
}