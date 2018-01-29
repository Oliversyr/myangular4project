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
import { RequestMethod } from '@angular/http';

/**
 * 角色与权限公共服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-15 11:02:52
 */

@Injectable()

export class RoleUserService {
    userInfo: any;
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
        this.userInfo = globalService.clientSessionData.getUserInfo();
        console.log('this.userInfo==' ,this.userInfo)
    }

    /**
     * 获取表格数据
     * @param key 
     */
    public getGridData(param, obj): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/user/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: {
                pageNum: param.pageNum,
                pageSize: param.pageSize,
                params: {
                    eid: this.userInfo.loginEid,
                    keyValue: obj.keyValue,
                    notinroleid: -1,
                    roleId: obj.roleId,
                    type: "YES"
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }

            let res = data.data;

            return {
                rows: res.result,
                footer: {
                    totalCount: res.totalRecord,
                    pageNum: res.pageNum,
                    pageSize: res.pageSize
                }
            }
        });
    }

    /**
     * 获取待添加用户表格数据
     * @param key 
     */
    public getAddGridData(param, obj): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/user/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: true,
            bodyParam: {
                pageNum: param.pageNum,
                pageSize: param.pageSize,
                params: {
                    eid: this.userInfo.loginEid,
                    keyValue: obj.keyValue,
                    notinroleid: obj.roleId,
                    roleId: -1,
                    type: "YES"
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }

            let res = data.data;

            return {
                rows: res.result,
                footer: {
                    totalCount: res.totalRecord,
                    pageNum: res.pageNum,
                    pageSize: res.pageSize
                }
            }
        });
    }
 

    /**
     * 添加/移除用户
     */
    doOperate(opType: number, userIdList: string, roleId: number): Observable<any> {
        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/myrole/operateuser',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: {
                opType: opType,
                userIdList: userIdList,
                eid: this.userInfo.loginEid,
                roleId: roleId
            }
        }
        return this.suiHttp.request(myParam).map((data) => {
            return data;
        })
    }
}