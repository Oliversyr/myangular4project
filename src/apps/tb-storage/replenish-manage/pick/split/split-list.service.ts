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
 * 汇总拣货list模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-22 15:02:17
 */

@Injectable()

export class SplitListService {
    constructor(
        private suiHttp: SuiHttpService,
        // private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }


    /**
     * 保存
     * @param param 
     */
    saveSplit(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/delivery/setoutqty',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
            // headers: {'Authorization': this.accessToken}
        }
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取分货单列表数据
     */
    getGridData(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/storagem/pick/getdelv',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

}