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
 * 仓库管理模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-17 16:37:56
 */

@Injectable()

export class StorehouseListService {
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
        param.params = searchParam;
        
        let myParam = {
            url: 'api/orgm/stockm/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            // headers: {'Authorization': this.accessToken},
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            console.log('getGridData==',data);
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
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