import { SuiRequest } from './../../../../../common/services/https/sui-http-entity';
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
 * 角色权限服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-15 11:02:52
 */

@Injectable()

export class RolePowerService {
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }

    /**
     * 获取权限列表
     */
    getPowerList(roleId, modelName): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/orgm/myrole/modulelist',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: {roleId: roleId, modelName: modelName}
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 获取模块列表
     */
    getModuleList(moduleId, modelName) {
        let myParam: SuiRequest<any, any> = {
            url: 'api/orgm/module/sys/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: {appid: -1, moduleId: moduleId, modelName: modelName}
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 保存
     */
    savePowerModule(param) {
        let myParam: SuiRequest<any, any> = {
            url: 'api/orgm/myrole/modulelist/operate',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }

    /**
     * 假数据
     */
    getTestData() {
        let data = [
            {
                "moduleid" : 1,
                "modulename" : "基础应用",
                "parentmoduleid" : null,
                "displayorder" : 1,
                "rightvalue" : null,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              },
              {
                "moduleid" : 2,
                "modulename" : "基础应用二",
                "parentmoduleid" : null,
                "displayorder" : 1,
                "rightvalue" : null,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              },
              {
                "moduleid" : 3,
                "modulename" : "基础应用三",
                "parentmoduleid" : null,
                "displayorder" : 1,
                "rightvalue" : null,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              },
            {
                "moduleid" : 11,
                "modulename" : "商品管理",
                "parentmoduleid" : 1,
                "displayorder" : 1,
                "rightvalue" : 207,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              }, {
                "moduleid" : 21,
                "modulename" : "基础管理",
                "parentmoduleid" : 2,
                "displayorder" : 1,
                "rightvalue" : null,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              }, {
                "moduleid" : 22,
                "modulename" : "物业协议管理",
                "parentmoduleid" : 2,
                "displayorder" : 1,
                "rightvalue" : null,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              }, {
                "moduleid" : 31,
                "modulename" : "组织机构管理",
                "parentmoduleid" : 3,
                "displayorder" : 1,
                "rightvalue" : 135,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              }, {
                "moduleid" : 211,
                "modulename" : "用户管理",
                "parentmoduleid" : 21,
                "displayorder" : 2,
                "rightvalue" : 199,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              }, {
                "moduleid" : 221,
                "modulename" : "商品变更",
                "parentmoduleid" : 22,
                "displayorder" : 2,
                "rightvalue" : 143,
                "levelcode" : null,
                "icon" : "",
                "url" : null,
                "notes" : "",
                "moduletype" : null,
                "plugtype" : null,
                "plugname" : null,
                "dataversion" : 1,
                "appid" : "120",
                "parentModuleName" : null
              }
        ]

        return data;

    }




}