import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../../../../common/global/global.service';
import { CommonServices } from './../../../../common/services/groups/common-services.module';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { SuiHttpService } from './../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { PurchaseInputService } from './purchase-input.service';

/*
 * 采购入库模块列表服务
 * @Author: xiahl 
 * @Date: 2017-12-26 10:57:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-16 11:45:14
 */
@Injectable()
export class PurchaseInputListService extends PurchaseInputService {

    constructor(
        modalSer: ModalService,
        suiHttp: SuiHttpService,
        util: CommonServices,
        globalService: GlobalService
    ) {
        super(modalSer, suiHttp, util, globalService);
    }

    /**
     * 获取采购入库单列表数据
     */
    getList(bodyParam: any): Observable<GridData<any>> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/purchase/list',
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
