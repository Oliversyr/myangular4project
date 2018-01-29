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

export class StockPdykListService {
    constructor(
        private suiHttp: SuiHttpService,
        private modalSer: ModalService,
        private utils: CommonServices,
        private globalService: GlobalService
    ) {
    }

    private ROOTPATH: string = this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH;
    // 列示所有的请求路径
    private SELF_URL = {
        // 盘点单列表
        list:  '/api/storagem/pdyk/list',
        // 盘点单详情 获取快照单
        detail:  '/api/storagem/pdyk/detail',
        // 查询商品录入明细
        goodslist:  '/api/storagem/pdyk/input/goodslist',
        // 录入单保存
        input:  '/api/storagem/pdyk/input',
        // 盘点单操作: 生成报告 确认盘点 终止盘点
        operate: '/api/storagem/pdyk/oprate',
        // 新增盘点单
        add: '/api/storagem/pdyk/add',
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
     * 获取盘点单列表
     */
    getSheet(param, searchParam): Observable<GridData<any>> {
        
        searchParam.orderby = param.orderField == "1" ? 1 : 0;
        searchParam.basc = param.orderDirect == 'ASC' ? 1 : 0;
        param.params = searchParam;
        
        let myParam: SuiRequest<any, any> = {
            url: this.SELF_URL.list,
            rootPath: this.ROOTPATH,
            method: RequestMethod.Post,
            bodyParam: param
        };

        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            console.log('获取盘点单列表',  data);
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
        });
    }
}
