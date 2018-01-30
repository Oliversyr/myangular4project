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
import { RoleUserService } from './role-user.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { SuiValidator, ValidatorRule } from './../../../../../common/components/validator/sui-validator';
import { BaseEditComponent } from '../../../../../common/top-common/base-edit.component';
import { BaseEditService } from '../../../../../common/top-common/base-edit.service';
import { Grid } from '../../../../../common/components/grid/grid';
// import { CUSTOM_MENUS } from '../../../common/custom-menus';

/**
 * 角色用户
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    selector: 'sui-role-user',
    templateUrl: './role-user.html',
    styleUrls: [ './role-user.scss' ]
})

export class RoleUserComponent extends BaseListComponent implements OnInit, AfterViewInit, OnChanges {
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    private gridPage: GridPage;

    keyValue: string = "";

    /**
     * 列表配置参数
     */
    private gridModalOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    private gridModalPage: GridPage;

    searchKey: string = "";

    @Input('roleId') roleId: number = -1;
    /**
     * 表格
     */
    @ViewChild('grid') mygrid: Grid;
    /**
     * 表格
     */
    @ViewChild('modalgrid') mymodalgrid: Grid;

    /**
     * 弹窗
     */
    @ViewChild('moreUser') moreUser;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListervice: BaseListService,
        private myService: RoleUserService,
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        // if(this.tab.attr === "M") {
        //     super.requestConfigBeforePageInit([this.storehouseService.getStocktypeData(), this.storehouseService.getStorehouseDetail(this.tab.routerParam.entity.stockid)]).subscribe(data => {
        //         let [stocktype, storehouseDetail] = data;
        //         this.stocktypeData = stocktype.data.result;

        //         this.storehouseInfo = storehouseDetail.data.result;
        //         this.storehouseInfo.ostatus = this.storehouseInfo.status === 0 ? "禁用" : "正常";
        //     });
        // } else {
        //     super.requestConfigBeforePageInit([this.storehouseService.getStocktypeData()]).subscribe(data => {
        //         this.stocktypeData = data[0].data.result;
        //     });
        // }

        
    }

    ngOnInit() {
        super.ngOnInit();

        this.initGrid();

        this.initModalGrid();

        // this.loadPageInitData();
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.initModalGridColumns();
        // this.mygrid.load();
        // this.mymodalgrid.load();
    }

    ngOnChanges(obj) {
        if(obj.hasOwnProperty('roleId') && !obj.roleId.firstChange) {
            this.mygrid.load();
        }
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {

        let extraBtns = [
            { name: "delete", label: "移除", placeholder: "移除", state: true, useMode: "GRID_BAR", userPage: "L" },
            // { name: "myedit", label: "修改", placeholder: "复制", state: true, useMode: "GRID_BAR", userPage: "L" },
            
        ]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true,
            rowBeforeAdd: this.rowBeforeAdd,
            isEdit: false,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            // primaryKeyFields: ["roleId", "roleName"],
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            let obj = {
                keyValue: this.keyValue,
                roleId: this.roleId
            }
            return this.myService.getGridData(param, obj);
        };
        
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.delete = true;
        // rowToolState.mycopy = true;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {
        let columnTemplate = {
        };

        let columndef = [
            { "text": "用户姓名", "datafield": "realname", "align": "center", "width": 80 },
            { "text": "用户手机", "datafield": "mobilephone", "align": "center", "width": 110 },
            { "text": "登录账号", "datafield": "loginname", "align": "center", "width": 100 },
            { "text": "上次登录", "datafield": "lastloginStr", "align": "center", "minWidth": 200 },
            { "text": "操作", "datafield": "tools", "width": 80, columntype: 'tools' }
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
        
    }


    /**
     * 初始化弹窗表格插件
     */
    private initModalGrid() {

        this.gridModalOption = {
            selectionMode: "checkbox",
            isShowRowNo: true,
            // rowBeforeAdd: this.rowBeforeAdd,
            isEdit: false,
            tools: this.baseService.getGridToolBar(this.mRight),
            // primaryKeyFields: ["roleId", "roleName"],
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridModalOption.loadDataInterface = (param) => {
            let obj = {
                keyValue: this.searchKey,
                roleId: this.roleId
            }
            // this.mymodalgrid.clearselection();
            return this.myService.getAddGridData(param, obj);
        };
        
    }

    /**
     * 初始化弹窗表格列表
     */
    private initModalGridColumns() {
        let columnTemplate = {
        };

        let columndef = [
            { "text": "用户姓名", "datafield": "realname", "align": "center", "width": 80 },
            { "text": "用户手机", "datafield": "mobilephone", "align": "center", "width": 90 },
            { "text": "登录账号", "datafield": "loginname", "align": "center", "width": 100 },
            { "text": "上次登录", "datafield": "lastloginStr", "align": "center", "minWidth": 200 },
            { "text": "状态", "datafield": "status", "align": "center", "width": 80 },
        ]

        this.mymodalgrid.setColumns(columndef, [], columnTemplate);
        
    }
    
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        this.keyValue = "";
        this.mygrid.load();
    }
    doAddUsers() {
        this.moreUser.open();
        setTimeout(() => {
            this.mymodalgrid.load();
        }, 10)
        
    }
    doRemoveUsers() {
        let data = this.mygrid.selection.getSelectRows();
        if(data.length === 0) {
            this.baseService.modalService.modalToast("请选择用户！");
            return ;
        }
        this.baseService.modalService.modalConfirm("确定删除选择的用户？").subscribe((sel) => {
            if(sel === "OK") {
                let userIds = "";
                data.forEach((item) => {
                    if(!userIds) {
                        userIds = item.userid
                    } else {
                        userIds = userIds + ',' + item.userid
                    }
                })
                this.myService.doOperate(2, userIds, this.roleId).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        this.mygrid.load();
                    }
                })
            }
        })
        
    }
    
    doDelete(obj) {
        let userId = obj.entitys[0].userid;
        this.baseService.modalService.modalConfirm("确定删除选择的用户？").subscribe((sel) => {
            if(sel === "OK") {
                this.myService.doOperate(2, userId, this.roleId).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        this.mygrid.load();
                    }
                })
            }
        })
    }

    doModalSearch() {
        this.mymodalgrid.load();
    }

    doModalConfirm() {
        let data = this.mymodalgrid.selection.getSelectRows();
        if(data.length === 0) {
            this.baseService.modalService.modalToast("请选择用户！");
            return ;
        }
        let userIds = "";
        data.forEach((item) => {
            if(!userIds) {
                userIds = item.userid
            } else {
                userIds = userIds + ',' + item.userid
            }
        })
        this.myService.doOperate(1, userIds, this.roleId).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.doModalClose();
                this.mygrid.load();
            }
        })
    }

    doModalClose() {
        this.mymodalgrid.clearselection();
        this.searchKey = "";
        this.moreUser.close();
    }
    
}