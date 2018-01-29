import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef, Injectable, Inject, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { RoleListService } from './role-list.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../common/directives/router/sui-router.sevice';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { ResponseContentType, RequestMethod } from '@angular/http';
import { SuiRequestBase, ResponseRetCode } from './../../../../common/services/https/sui-http-entity';
import { Grid } from '../../../../common/components/grid/grid';

/**
 * 仓库管理模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-22 11:56:51
 */

@Component({
    templateUrl: './role-list.html',
    styleUrls: ['./role-list.scss']
})

export class RoleListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    hotkeys: any = HOTKEYS;
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    keyValue: any;
    /**
     * 角色列表
     */
    roleListData: Array<any>;
    /**
     * 状态
     */
    statusData: Array<object>;
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    private gridPage: GridPage;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    /**
     * 当前选择的角色
     */
    currentRoleId: number = -1;

    /**
     * 机构自动补全选择框
     */
    @ViewChild('addRole') addRoleModal;
    // @ViewChild('storehouseSelect') storehouseSelect;
    // @ViewChild('shopSelect') shopSelect;

    addNewRole: any;

    myTabs: any;

    currentTab: number;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid: Grid;

    onStart(param) { };

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseListService: BaseListService,
        private myService: RoleListService,
    ) {
        super();


    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        super.requestConfigBeforePageInit([this.myService.getRoleList()]).subscribe(data => {
            console.log('getStocktypeData==', data);
            this.roleListData = data[0].data.result;
            this.mygrid.setData(this.roleListData);
            // let all = {
            //     stocktypename: '全部',
            //     stocktype: -1
            // }
            // this.stocktypeData.unshift(all);
            // this.searchParams.stocktype = 0;
            // setTimeout(() => {
            //     this.searchParams.stocktype = -1;
            // }, 100)
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.initSearchParam();
        this.initGrid();
        
        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }

        this.initToolbar();
    }

    ngAfterViewInit() {
        this.loadPageInitData();
        this.initGridColumns();
        
    }

    private initToolbar() {
        let extraBtns = [{ name: "addRole", label: "新增角色", placeholder: "新增角色", state: true, useMode: "TOP_BAR", userPage: "L" }]

        this.tools = this.baseService.getTopToolBar(this.option.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = { 'addRole': true, 'print,copy,add,check,del,import,export,cancel': false };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.statusData = [
            { value: -1, label: '全部' },
            { value: 0, label: '禁用' },
            { value: 1, label: '正常' }
        ]

        this.addNewRole = {
            roleName: "",
            notes: "",
            isUpdate: false
        }

        this.myTabs = [
            {label: '角色用户', active: true, value: 1},
            {label: '角色权限', active: false, value: 2}
        ]

        

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {

        let extraBtns = [
            { name: "delete", label: "删除", placeholder: "删除", state: true, useMode: "GRID_BAR", userPage: "L" },
            // { name: "myedit", label: "修改", placeholder: "复制", state: true, useMode: "GRID_BAR", userPage: "L" },
            { name: "mycopy", label: "复制", placeholder: "复制", state: true, useMode: "GRID_BAR", userPage: "L" },
            
        ]

        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: false,
            rowBeforeAdd: this.rowBeforeAdd,
            isEdit: true,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            primaryKeyFields: ["roleId", "roleName"],
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        // this.gridOption.loadDataInterface = (param) => {
        //     this.mygrid.clearselection();
        //     return this.myService.getGridData(param, this.searchParams)
        // };

        this.gridPage = {
            pageable: false
        }

        
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.delete = true;
        rowToolState.mycopy = true;
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
            { "text": "角色", "datafield": "roleName", "align": "center", "minWidth": 100, editable: true },
            { "text": "操作", "datafield": "tools", "width": 110, columntype: 'tools', editable: false }
        ]

        //设置表格验证
        let getGridValidation = {
            roleName: "required,len_1_13",
        }

        this.mygrid.setColumns(columndef, [], columnTemplate, getGridValidation);

        setTimeout(() => {
            this.mygrid.selectrow(0);
        }, 500)
        
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        console.log(this.keyValue);
        let filterData = [];
        
        this.roleListData.forEach((item, i) => {
            console.log(item.roleName.indexOf(this.keyValue));
            if(item.roleName.indexOf(this.keyValue) !== -1) {
                filterData.push(item);
            }
        })
        this.mygrid.setData(filterData);

    }

    /**
     * 刷新数据
     */
    refreshGridData() {
        this.myService.getRoleList().subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if (res.retCode === 0) {
                this.roleListData = res.data.result;
                this.mygrid.setData(this.roleListData);
            }
        })
    }

    /**
     * 编辑
     */
    cellEndEditEvent(obj) {
        console.log(obj);
        let param = {
            roleId: obj.args.row.roleId,
            value: obj.args.value,
            oldvalue: obj.args.oldvalue
        }

        if(param.value !== param.oldvalue) {
            let opt = {
                roleId: param.roleId,
                roleName: param.value,
                notes: ""
            }
            this.myService.doEdit(opt).subscribe((res) => {
                this.baseService.modalService.modalToast(res.message);
                if (res.retCode !== 0) {
                    this.refreshGridData();
                }
            })
        }
    }

    /**
     * 修改
     */
    // doMyedit(obj, event) {
    //     this.mygrid.setcolumnproperty('roleName', 'editable', true);
    //     console.log(obj, event)
    //     event.target.parent
    //     // event
    // }

    /**
     * 角色选择
     */
    doSelect(obj) {
        console.log(obj)
        let data = obj.args.row;
        this.currentRoleId = data.roleId;
    }

    /**
     * 删除
     */
    doDelete(obj) {
        this.baseService.modalService.modalConfirm('确认删除该角色？').subscribe((result) => {
            if(result === "OK") {
                this.myService.doDelete(obj.entitys[0].roleId).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if (res.retCode === 0) {
                        this.refreshGridData();
                    }
                })
            }
        })
    }

    /**
     * 复制
     */
    doMycopy(obj) {
        console.log(obj)
        let opt = {
            roleId: obj.entitys[0].roleId,
            roleName: obj.entitys[0].roleName + '-副本',
            notes: ""
        }
        this.myService.doCopy(opt).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if (res.retCode === 0) {
                this.refreshGridData();
            }
        })
    }

    /**
     * 新增
     */
    doAddRole() {
        this.addNewRole = {
            roleName: "",
            notes: "",
            isUpdate: false
        }
        this.addRoleModal.open();
    }
    doModalConfirm() {
        if(!this.addNewRole.roleName) {
            this.baseService.modalService.modalToast('请输入角色名称');
            return ;
        }

        let param = {
            roleName: this.addNewRole.roleName,
            notes: this.addNewRole.notes,
            type: this.addNewRole.isUpdate
        }

        this.myService.doAdd(param).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if (res.retCode === 0) {
                this.refreshGridData();
                this.addRoleModal.close();
            }
        })
    }
    doModalCancel() {
        this.addRoleModal.close();
    }

    /**
     * 页签切换
     */
    tabClick(obj) {
        this.myTabs.forEach((item) => {
            item.active = false;
        });
        obj.active = true;
        this.currentTab = obj.value;
    }




}