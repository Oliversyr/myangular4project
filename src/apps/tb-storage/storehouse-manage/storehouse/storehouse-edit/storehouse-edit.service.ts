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

/**
 * 仓库编辑/新增服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-26 11:59:00
 */

@Injectable()

export class StorehouseEditService {
    constructor(
        private suiHttp: SuiHttpService,
        // private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }

    /**
     * 新建仓库
     */
    doAddNew(stockDetail: object): Observable<any> {
        let myParam = {
            url: 'api/orgm/stockm/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            // headers: {'Authorization': this.accessToken},
            bodyParam: stockDetail
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.globalService.modalService.modalToast(data.message);
            }
            console.log(data)
            return data;
        })
    }

    /**
     * 修改仓库
     */
    doUpdate(stockDetail: object): Observable<any> {
        let myParam = {
            url: 'api/orgm/stockm/update',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            // headers: {'Authorization': this.accessToken},
            bodyParam: stockDetail
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.globalService.modalService.modalToast(data.message);
            }
            console.log(data)
            return data;
        })
    }
}