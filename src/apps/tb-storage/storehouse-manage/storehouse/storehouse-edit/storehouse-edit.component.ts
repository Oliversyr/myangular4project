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
import { TemplateEditOption } from '../../../../../common/components/templates/template-edit';
import { StorehouseEditService } from './storehouse-edit.service';
import { StorehouseService } from './../storehouse.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { SuiValidator, ValidatorRule } from './../../../../../common/components/validator/sui-validator';
import { BaseEditComponent } from '../../../../../common/top-common/base-edit.component';
import { BaseEditService } from '../../../../../common/top-common/base-edit.service';
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
    ostatus: string;
    status: number;
}

interface Valid {
    parentid: any;
    stocktype: any;
}


/**
 * 仓库管理模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './storehouse-edit.html',
    styleUrls: [ './storehouse-edit.scss' ]
})

export class StorehouseEditComponent extends BaseEditComponent implements OnInit {
    /**
     * template-list配置参数
     */
    option: TemplateEditOption;
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

    @ViewChild("el_validator") el_validator: SuiValidator;
    /**
     * 校验规则
     */
    private valid: Valid;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseEditService: BaseEditService,
        private myService: StorehouseEditService,
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
        if(this.tab.attr === "M") {
            super.requestConfigBeforePageInit([this.storehouseService.getStocktypeData(), this.storehouseService.getStorehouseDetail(this.tab.routerParam.entity.stockid)]).subscribe(data => {
                let [stocktype, storehouseDetail] = data;
                this.stocktypeData = stocktype.data.result;

                this.storehouseInfo = storehouseDetail.data.result;
                this.storehouseInfo.ostatus = this.storehouseInfo.status === 0 ? "禁用" : "正常";

                this.initToolbar();
            });
        } else {
            super.requestConfigBeforePageInit([this.storehouseService.getStocktypeData()]).subscribe(data => {
                this.stocktypeData = data[0].data.result;

                this.initToolbar();
            });
        }

        
        
    }

    ngOnInit() {
        super.ngOnInit();

        this.initInputParam();

        this.loadPageInitData();

        this.initValidator();

        this.option = {
            tab: this.tab
        }

    }

    private initToolbar() {
        let extraBtns = [{
            name: 'forbid',
            label: '禁用',
            placeholder: '禁用',
            state: this.storehouseInfo.status == 1,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'M'
        },{
            name: 'restart',
            label: '启用',
            placeholder: '启用',
            state: this.storehouseInfo.status == 0,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'M'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = {'forbid,restart': true, 'add,print,reset,del': false};
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
            ostatus: "正常",
            status: 1
        }

    }
    
    private initValidator(): void {
        this.rootValidators = [
            // { input: '#phone', action: 'keyup, blur', rule: 'required', message: '不允许为空' },
            // { input: '#phone', action: 'keyup, blur', rule: 'phone', message: '请输入正确电话' }
        ];
        this.valid = {
            parentid: [
                {
                    rule: (jqElement, comnit): boolean => {
                        return this.storehouseInfo.parentid !== -1;
                    }, message: '上级机构不能为空'
                }
            ],
            stocktype: [
                {
                    rule: (jqElement, comnit): boolean => {
                        return this.storehouseInfo.stocktype !== -1;
                    }, message: '仓库类型不能为空'
                }
            ]
        }
    }

    /**
     * 上级机构选择
     */
    selectedOrgan(org) {
        this.storehouseInfo.parentid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 按钮栏按钮点击
     */
    doForbid() {
        this.storehouseService.doOperate(0, [this.storehouseInfo.stockid]).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.storehouseInfo.status = 0;
                this.storehouseInfo.ostatus = '禁用';
                this.initToolbar()
            }
        });
    }
    doRestart() {
        this.storehouseService.doOperate(1, [this.storehouseInfo.stockid]).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.storehouseInfo.status = 1;
                this.storehouseInfo.ostatus = '正常';
                this.initToolbar()
            }
        });
    }
    doSave() {
        this.el_validator.pass().subscribe(isPass => {
            console.log(isPass);
            console.log(this.storehouseInfo)
            if (isPass) {
                let storehouseInfo = Object.assign({}, this.storehouseInfo);
                delete storehouseInfo.ostatus;

                if(this.tab.attr === "A") {

                    console.log('this.storehouseInfo==', storehouseInfo)
                    this.myService.doAddNew(storehouseInfo).subscribe((res) => {
                        if(res.retCode === 0) {
                            this.storehouseInfo.stockid = res.data.result;
                            this.doBrowse({stockid: this.storehouseInfo.stockid}, null);
                        }
                    });

                } else if(this.tab.attr === "M") {
                    this.myService.doUpdate(this.storehouseInfo).subscribe((res) => {
                        if(res.retCode === 0) {
                            this.doBrowse({stockid: this.storehouseInfo.stockid}, null);
                        }
                    });
                } 
            }
        })
    }
    
    
    doShopmanage() {
        let param = {
            entity: {
                stockid: this.storehouseInfo.stockid
            }
        }
        super.goToPage(this.ATTR.L, param , CUSTOM_MENUS.MANAGE_SHOP);
    }
    doStoragelist() {
        super.goToPage(this.ATTR.L, this.storehouseInfo, CUSTOM_MENUS.STOCK_LIST);
    }
    
}