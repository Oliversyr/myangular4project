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
 * 汇总拣货模块公共服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-22 16:36:53
 */

@Injectable()

export class PickService {
    constructor(
        private suiHttp: SuiHttpService,
        // private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 拣货单操作
     * 1-拣货完成 4-删除
     */
    doOperate(sheetid, optype): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/pick/operate',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {sheetid: sheetid, status: optype}
            // headers: {'Authorization': this.accessToken}
        }
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取汇总拣货详情
     */
    getPickDetail(sheetid): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/pick/detail',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {sheetid: sheetid}
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取配送单列表
     */
    getDeliveryList(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/delivery/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    




}