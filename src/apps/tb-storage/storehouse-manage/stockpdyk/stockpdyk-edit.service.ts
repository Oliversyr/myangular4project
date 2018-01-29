import { GridData } from './../../../../common/components/grid/grid-data-entity';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiLocalConfig } from './../../../../common/global/sui-local-config';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';

import { NgModule, Component, ElementRef, Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input, Inject } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { ModalService } from '../../../../common/components/modal/modal.service';
import { CommonServices } from '../../../../common/services/groups/common-services.module';
import { SuiCookieService } from '../../../../common/services/storage/sui-cookie.service';
import { RequestMethod } from '@angular/http';
import { SuiResponse, SuiRequest } from '../../../../common/services/https/sui-http-entity';
import { GridPage } from '../../../../common/components/grid/grid-option';

/**
 * cheng
 * 库存盘点模块
 * 2017/12/25
 */

@Injectable()

export class StockPdykEditService {
    constructor(
        private suiHttp: SuiHttpService,
        private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }

    private  ROOTPATH: string = this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH;
    // 列示所有的请求路径
    private SELF_URL = {
        // 盘点单详情 获取快照单
        detail:  '/api/storagem/pdyk/detail',
        // 录入单保存
        input:  '/api/storagem/pdyk/input',
        head: '/api/storagem/pdyk/head'
    };

    getPdTypeObj(): object {
        return  {
            0: '全场盘点',
            1: '单品盘点',
            2: '按仓盘点',
            3: '货位盘点',
            4: '按品牌',
            5: '按品类'
        };
    } 
    
    getStatusObj(): object  {
        return  {
            0: '盘点中',
            1: '已确认',
            3: '待确认',
            4: '已取消',
        };
    } 
    
   
    /**
     *  查询盘点头信息(/api/storagem/pdyk/head)
     */
    getSheetDetailHead(param) {
        let myParam: SuiRequest<any, any> = {
            url: this.SELF_URL.head,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        };
        return this.suiHttp.request(myParam).map( (data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                // alert("请求供应商数据失败;" + (data.retMsg || ""));
                this.modalSer.modalToast(data.message);
                return ;
            } 
            return data;
        });
    }
    
    /**
     * 录入保存
     */
    doSave(param){
        let myParam: SuiRequest<any, any> = {
            url: this.SELF_URL.input,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };
        return this.suiHttp.request(myParam).map( (data: SuiResponse<any>) => {
            return data;
        }); 
    }
}
