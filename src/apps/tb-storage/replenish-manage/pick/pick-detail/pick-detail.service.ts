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
 * 商品出入库单编辑模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-18 11:31:41
 */

@Injectable()

export class PickDetailService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 获取仓库列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        return null ;
    }

    getOitypeData() {
        let data = [
            {label: '全部', value: -1},
            {label: '采购入库', value: 101},
            {label: '赠品入库', value: 102},
            {label: '收购入库', value: 103},
            {label: '其他入库', value: 110},

            {label: '赠送出库', value: 201},
            {label: '批发出库', value: 202},
            {label: '领用出库', value: 203},
            {label: '其他出库', value: 210},
        ]
        return data;
    }

    /**
     * 配送单操作
     * 1--增加  2--移除
     */
    doOprDelivery(param, optype) {
        let params = {
            sheetid: param.sheetid,
            refsheetids: param.refsheetids,
            optype: optype
        }

        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/pick/sheetop',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: params
        }
        
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })

    }

    /**
     * 获取可添加的配送单
     */
    getAddDelivery(param, searchParam) {
        let params = {
            shopeid: searchParam.shopeid,
            status: 100,
            stockid: searchParam.stockid,
            delvstatus: 0,
            dateflag: searchParam.dateValue.leftValue,
            bdate: searchParam.dateValue.beginDate,
            edate: searchParam.dateValue.endDate,
            operator: searchParam.operator,
            opflag: searchParam.opflag.leftValue,
            goodsid: -1,
            picktype: 0,
            orderby: 0,
            basc: 1
        }
        param.params = params;

        console.log(param);

        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/delivery/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            if(data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            let res = {
                rows: data.data.result,
                footer: {
                    totalCount: data.data.totalRecord,
                    pageNum: data.data.pageNum,
                    pageSize: data.data.pageSize
                }
            }
            return res;
        })
        
    }

}