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
 * 售卖机监控模块服务
 * @Created by: yangr 
 * @Created Date: 2017-12-06 17:18:33 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-15 17:58:55
 */

@Injectable()

export class MonitorService {
    constructor(
        private suiHttp: SuiHttpService,
        private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }

    private URL_PATH = 'api/devicem/pos/monitor';

    /**
     * 获取店组列表
     */
    getGroupData(): Observable<any> {
        let myParam = {
            url: 'api/devicem/group/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            // headers: {'Authorization': this.accessToken}
            urlParam: {
                keyValue: '',
                status: -1
            }
        }
        return this.suiHttp.request(myParam).map((data) => {
            console.log(data);
            return data;
        })
    }

    /**
     * 获取监控列表数据
     */
    getGridData(param, searchParam): Observable<GridData<any>> {
        param.params = searchParam;
        // console.log(searchParam)
        let myParam = {
            url: this.URL_PATH + '/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            mothod: RequestMethod.Post,
            // headers: {'Authorization': this.accessToken},
            bodyParam: param
        }

        return this.suiHttp.request(myParam).map((data) => {
            console.log(data);
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.modalSer.modalToast(data.message);
                return ;
            }
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
     * 重启
     */
    doRestart(posids: Array<string>): Observable<any> {
        let myParam = {
            url: this.URL_PATH + '/restart',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            type: 'POST',
            // headers: {'Authorization': this.accessToken},
            param: posids
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.modalSer.modalToast(data.message);
            }
            return data;
        })
    }

    /**
     * 同步
     */
    doSync(posids: Array<string>): Observable<any> {
        let myParam = {
            url: this.URL_PATH + '/synchro',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            type: 'POST',
            // headers: {'Authorization': this.accessToken},
            param: posids
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.modalSer.modalToast(data.message);
                // return data;
            }
            return data;
        });
    }

    /**
     * 升级
     */
    doUpdate(posids: Array<string>): Observable<any> {
        let myParam = {
            url: this.URL_PATH + '/upgrade',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            type: 'POST',
            // headers: {'Authorization': this.accessToken},
            param: posids
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.modalSer.modalToast(data.message);
                // return data;
            }
            return data;
        });
    }

}