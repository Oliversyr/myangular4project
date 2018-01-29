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
 * 汇总拣货list模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-09 18:19:56
 */

@Injectable()

export class PickListService {
    constructor(
        private suiHttp: SuiHttpService,
        // private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    

    // getOitypeData() {
    //     let data = [
    //         {label: '全部', value: -1},
    //         {label: '采购入库', value: 101},
    //         {label: '赠品入库', value: 102},
    //         {label: '收购入库', value: 103},
    //         {label: '其他入库', value: 110},

    //         {label: '赠送出库', value: 201},
    //         {label: '批发出库', value: 202},
    //         {label: '领用出库', value: 203},
    //         {label: '其他出库', value: 210},
    //     ]
    //     return data;
    // }

    /**
     * 新增拣货单
     * @param param 
     */
    addPickData(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/pick/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
            // headers: {'Authorization': this.accessToken}
        }
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取汇总拣货单列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        let search = JSON.parse(JSON.stringify(searchParam));
        search.dateflag = searchParam.dateValue.leftValue;
        search.bdate = searchParam.dateValue.beginDate;
        search.edate = searchParam.dateValue.endDate;
        // delete search.dateValue;

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
        // console.log(searchParam)
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/pick/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            // headers: {'Authorization': this.accessToken},
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

}