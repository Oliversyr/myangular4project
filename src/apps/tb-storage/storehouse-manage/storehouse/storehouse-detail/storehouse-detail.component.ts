import { BaseDetailService } from './../../../../../common/top-common/base-detail.service';
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { TemplateDetailOption } from '../../../../../common/components/templates/template-detail';
import { StorehouseDetailService } from './storehouse-detail.service';
import { StorehouseService } from './../storehouse.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { SuiValidator, ValidatorRule } from './../../../../../common/components/validator/sui-validator';
import { BaseDetailComponent } from '../../../../../common/top-common/base-detail.component';
import { CUSTOM_MENUS } from '../../../common/custom-menus';

/**
 * 搜索参数
 */
interface StorehouseInfo {
    goodsnum: number;
    shopnum: number;
    stockid: any;
    parentid: number;
    contacttele: string;
    address: string;
    stocktype: number;
    ename: string;
    manager: string;
    status: number;
}


/**
 * 仓库管理模块-仓库详情
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './storehouse-detail.html',
    styleUrls: [ './storehouse-detail.scss' ]
})

export class StorehouseDetailComponent extends BaseDetailComponent implements OnInit {
    /**
     * template-list配置参数
     */
    option: TemplateDetailOption;
    /**
     * 搜索参数
     */
    storehouseInfo: StorehouseInfo;
    /**
     * 仓库类型
     */
    stocktypeData: Array<object> = [];

    rootValidators: ValidatorRule[];
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseDetailService: BaseDetailService,
        private myService: StorehouseDetailService,
        private storehouseService: StorehouseService,
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        super.requestConfigBeforePageInit([this.storehouseService.getStorehouseDetail(this.tab.routerParam.entity.stockid)]).subscribe(data => {
            console.log('getStocktypeData==',data);
            this.storehouseInfo = data[0].data.result;
            this.initToolbar();
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.initInputParam();
        
        this.loadPageInitData();

        this.option = {
            tab: this.tab
        }
        console.log('>>>>>>>>>this.tab<<<<<<<<<<', this.tab)
    }

    private initToolbar() {
        let extraBtns = [{
            name: 'forbid',
            label: '禁用',
            placeholder: '禁用',
            state: this.storehouseInfo.status === 1,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        },{
            name: 'restart',
            label: '启用',
            placeholder: '启用',
            state: this.storehouseInfo.status === 0,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = {'forbid': true, 'restart': true, 'add,copy,cancel,print,del,preNext,check': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化输入参数
     */
    private initInputParam() {
        this.storehouseInfo = {
            goodsnum: 0,
            shopnum: 0,
            stockid: "",
            parentid: -1,
            contacttele: "",
            address: "",
            stocktype: -1,
            ename: "",
            manager: "",
            status: this.tab.routerParam.entity.status
        }

    }

    /**
     * 按钮栏按钮点击
     */
    doEdit() {
        super.doEdit({stockid: this.storehouseInfo.stockid, status: this.storehouseInfo.status});
    }
    doForbid() {
        this.storehouseService.doOperate(0, [this.storehouseInfo.stockid]).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.storehouseInfo.status = 0;
                this.initToolbar();
            }
        });
    }
    doRestart() {
        this.storehouseService.doOperate(1, [this.storehouseInfo.stockid]).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.storehouseInfo.status = 1;
                this.initToolbar();
            }
        });
    }

    /**
     * 管理配送店铺
     */
    doShopmanage() {
        let param = {
            entity: {
                stockid: this.storehouseInfo.stockid
            }
        }
        super.goToPage(this.ATTR.L, param , CUSTOM_MENUS.MANAGE_SHOP);
    }
    /**
     * 查看库存清单
     */
    doStoragelist() {
        super.goToPage(this.ATTR.L, this.storehouseInfo, CUSTOM_MENUS.STOCK_LIST);
    }
    
}