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
 * 管理配送店铺模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-17 18:59:30
 */

@Injectable()

export class ManageShopService {
    userInfo: any;
    constructor(
        private suiHttp: SuiHttpService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
        this.userInfo = this.globalService.clientSessionData.getUserInfo();
    }


    /**
     * 获取店组列表
     */
    getGroupData(): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/devicem/group/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: {
                keyValue: '',
                status: -1
            }
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log('getStocktypeData==',data);
            return data;
        })
    }

    /**
     * 获取配送店铺列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        console.log(searchParam)
        param.params = searchParam;
        let myParam: SuiRequest<any, any> = {
            url: 'api/orgm/stockm/shopm/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: {
                pageNum: param.pageNum,
                pageSize: param.pageSize,
                params: {
                    stockid: searchParam.stockid,
                    ename: searchParam.shopName,
                    groupid: searchParam.groupId,
                    routeid: -1
                }
            }
        }

        return this.suiHttp.request(myParam).map((data) => {
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

    /**
     * 获取店铺列表数据
     */
    getShopGridData(param, searchParam): Observable<GridData<any>> {
        param.params = searchParam;

        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/org/juniororg/page',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: param.pageNum,
                pageSize: param.pageSize,
                totalRecord: 0,
                params: {
                    eid: -1,
                    groupId: -1,
                    parentId: -1,
                    ename: '',
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: [],
                    orgType: 1,
                    keyvalue: searchParam.ename,
                    keyflag: 7
                }
                
            }
        }

        return this.suiHttp.request(myParam).map((data) => {
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

    /**
     * 增/删配送店铺
     */
    doOperate(stockid: number, operateType: number, coeids: Array<string>): Observable<any> {
        let myParam: SuiRequest<any, any> = {
                url: 'api/orgm/stockm/shopm/operate',
                rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
                method: RequestMethod.Post,
                bodyParam: {
                    stockid: stockid,
                    optype: operateType,
                    coeids: coeids
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