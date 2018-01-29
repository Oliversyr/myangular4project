import { SuiRequest } from './../../../../common/services/https/sui-http-entity';
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

/**
 * 仓库管理模块公共服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-15 11:02:52
 */

@Injectable()

export class StorehouseService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 获取仓库类型列表
     */
    getStocktypeData(): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/stockm/typelist',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }

    /**
     * 获取仓库详情
     */
    getStorehouseDetail(stockid): Observable<any> {
        let myParam = {
            url: 'api/orgm/stockm/detail',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {stockid: stockid}
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 禁/启用
     */
    doOperate(operateType: number, stockids: Array<string>): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/stockm/operate',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: {
                optype: operateType,
                stockids: stockids
            }
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