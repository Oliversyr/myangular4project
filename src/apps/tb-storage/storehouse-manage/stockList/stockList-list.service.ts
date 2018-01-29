import { GridData } from './../../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiLocalConfig } from './../../../../common/global/sui-local-config';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef, Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input, Inject } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { ModalService } from '../../../../common/components/modal/modal.service';
import { CommonServices } from '../../../../common/services/groups/common-services.module';
import { SuiCookieService } from '../../../../common/services/storage/sui-cookie.service';
import { RequestMethod } from '@angular/http';
import { SuiRequest } from '../../../../common/services/https/sui-http-entity';

/**
 * 库存清单模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-17 18:17:50
 */

@Injectable()

export class StockListService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 获取库存商品列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        console.log('param123====', param, searchParam)
        let orderField, order;

        if(param.orderField && param.orderField !== 'DEFAULT') {
            orderField = param.orderField === "stockNum" ? 1 : 2;
            order = param.orderDirect === "ASC" ? 1 : 0;
        } else {
            orderField = 0;
            order = 0;
        }
        let orderObj = {
            orderby: orderField,
            basc: order
        }

        param.params = Object.assign(searchParam, orderObj);

        console.log('param====', param)
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/inventory/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            console.log('getGridData==',data);
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
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

    /**
     * 库存调整
     */
    doAdjustStock(adjustData: Array<any>): Observable<any> {
        let thisData = [];
        adjustData.forEach((item) => {
            let data = {
                stockid: item['stockid'],
                goodsid: item['goodsid'],
                stkqty: item['qty'],
                adjustqty: item['adjustqty'],
                notes: item['notes'] || ""
            }
            thisData.push(data);
        })

        
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/inventory/adjust',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: {items: thisData}
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
            }
            console.log(data)
            return data;
        })
    }


}