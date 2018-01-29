import { GridData } from './../../../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../../../../../common/global/global.service';
import { SuiLocalConfig } from './../../../../../common/global/sui-local-config';
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef, Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input, Inject } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { ModalService } from '../../../../../common/components/modal/modal.service';
import { CommonServices } from '../../../../../common/services/groups/common-services.module';
import { SuiCookieService } from '../../../../../common/services/storage/sui-cookie.service';
import { RequestMethod } from '@angular/http';
import { SuiRequest } from '../../../../../common/services/https/sui-http-entity';

/**
 * 库存流水模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-22 10:23:10
 */

@Injectable()

export class BookListService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 获取库存流水列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        console.log('param123====', param, searchParam)
        let opt = {
            bdate: searchParam.dateValue.beginDate,
            edate: searchParam.dateValue.endDate,
            directflag: searchParam.directflag,
            sheettype: searchParam.sheettype,
            sheetid: searchParam.sheetid || -1,
            stockid: searchParam.stockid,
            goodsid: searchParam.goodsid
        }
        param.params = opt;

        console.log('param====', param)
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/inventory/booklist',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            console.log('getGridData==',data);
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

    getBusinessData() {
        let data = [
            {label: '全部', value: -1},
            {label: 'pos销售', value: 1071},
            {label: '盘点', value: 4002},
            {label: '库存调整', value: 4001},
            {label: '调拨入库', value: 5001},
            {label: '调拨出库', value: 5002},
            {label: '补偿单', value: 2004},
            {label: '采购收货', value: 1001},
            {label: '采购退货', value: 1002},
            {label: '销售退货', value: 2002},
            {label: '一般出库', value: 3001},
            {label: '一般入库', value: 3002},
            {label: '配送出库', value: 3101},
            {label: '配送入库', value: 3102},
        ]
        return data;
    }

    getBusinessObj() {
        let data = {
            1071: 'pos销售',
            4002: '盘点',
            4001: '库存调整',
            5001: '调拨入库',
            5002: '调拨出库',
            2004: '补偿单',
            1001: '采购收货',
            1002: '采购退货',
            2002: '销售退货',
            3001: '一般出库',
            3002: '一般入库',
            3101: '配送出库',
            3102: '配送入库'
        }
        return data;
    }

    /**
     * 库存调整
     */
    // doAdjustStock(adjustData: Array<object>): Observable<any> {
    //     let myParam = {
    //         url: 'api/storagem/inventory/adjust',
    //         rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
    //         method: RequestMethod.Post,
    //         // headers: {'Authorization': this.accessToken},
    //         bodyParams: {
    //             stockid: adjustData['stockid'],
    //             goodsid: adjustData['goodsid'],
    //             stkqty: adjustData['stkqty'],
    //             adjustqty: adjustData['adjustqty'],
    //             notes: adjustData['notes']
    //         }
    //     }
    //     return this.suiHttp.request(myParam).map((data) => {
    //         if (data.retCode !== 0) {
    //             // alert("请求供应商数据失败;" + (data.retMsg || ""));
    //             this.globalService.modalService.modalToast(data.message);
    //         }
    //         console.log(data)
    //         return data;
    //     })
    // }


}