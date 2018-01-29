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
 * 商品出入库单公共服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-17 18:23:40
 */

@Injectable()

export class OutInputService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 出入库单操作
     * 0-编辑中 1-编辑完成 4－删除 100－审核
     */
    doOperate(sheetids, optype): Observable<any> {
        let myParam = {
            url: 'api/storagem/outinput/operate',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: {sheetids: sheetids, optype: optype}
        }
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取出入库单详情
     */
    getOutInputDetail(sheetid): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/outinput/detail',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {sheetid: sheetid}
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取出入库单列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        let search = JSON.parse(JSON.stringify(searchParam));
        search.bdate = search.dateValue.beginDate;
        search.edate = search.dateValue.endDate;
        delete search.dateValue;

        let orderField, order;
        if(param.orderField && param.orderField !== 'DEFAULT') {
            orderField = 1;
            order = param.orderDirect === "ASC" ? 1 : 0;
        } else {
            orderField = 0;
            order = 0;
        }

        let orderObj = {
            orderby: orderField,
            basc: order
        }

        param.params = Object.assign(search, orderObj);
        console.log('param===', param)
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/outinput/list',
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

    /**
     * 出入库类型对象
     */
    getOitypeObj() {
        let data = {
            101: '采购入库',
            102: '赠品入库',
            103: '收购入库',
            110: '其他入库',

            201: '赠送出库',
            202: '批发出库',
            203: '领用出库',
            210: '其他出库',
        }
        
        return data;
    }

    /**
     * 获取出入库类型
     */
    getOiTypeList() {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/outinput/type',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {oitype: -1}
        }

        return this.suiHttp.request(myParam).map((data) => {
            
            
            return data.data.result.items;
        })
    }




}