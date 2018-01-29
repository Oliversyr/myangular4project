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
 * 角色与权限公共服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-22 11:25:06
 */

@Injectable()

export class RoleListService {
    userInfo: any;
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
        this.userInfo = this.globalService.clientSessionData.getUserInfo();
        console.log('this.userInfo==', this.userInfo)
    }

    /**
     * 获取角色列表
     */
    getRoleList(): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/myrole/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }

    /**
     * 新增
     */
    doAdd(obj): Observable<any> {
        let param = Object.assign({eid: this.userInfo.loginEid}, obj)
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/myrole/add',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }

    /**
     * 修改
     */
    doEdit(param): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/myrole/update',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }

    /**
     * 删除
     */
    doDelete(roleId): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/myrole/delete',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {
                roleId: roleId,
                eid: this.userInfo.loginEid
            }
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }

    /**
     * 复制
     */
    doCopy(param): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/myrole/copy',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }





}