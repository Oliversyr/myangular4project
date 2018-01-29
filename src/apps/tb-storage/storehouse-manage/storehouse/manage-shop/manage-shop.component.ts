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
import { TemplateListOption } from '../../../../../common/components/templates/template-list';
import { ManageShopService } from './manage-shop.service';
import { StorehouseService } from './../storehouse.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';


/**
 * 管理配送店铺
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-17 18:53:56
 */

 /**
 * 搜索参数
 */
interface SearchParams {
    shopName: string;
    groupId: number;
}

@Component({
    templateUrl: './manage-shop.html',
    styleUrls: [ './manage-shop.scss' ]
})

export class ManageShopComponent extends BaseListComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
    /**
     * 列表配置参数
     */
    gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    gridPage: GridPage;
    /**
     * 列表配置参数
     */
    shopGridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    shopGridPage: GridPage;
    /**
     * 更多店铺弹窗搜索关键词
     */
    searchKey: string;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];
    /**
     * 仓库信息
     */
    storehouseInfo: object;
    /**
     * 店组列表
     */
    groupList: Array<object> = [];
    /**
     * 表格
     */
    @ViewChild('grid') mygrid;
    /**
     * 表格
     */
    @ViewChild('shopgrid') shopgrid;
    /**
     * 弹窗
     */
    @ViewChild('moreShop') shopModal;
    

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: ManageShopService,
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
        super.requestConfigBeforePageInit([this.myService.getGroupData(), this.storehouseService.getStorehouseDetail(this.tab.routerParam.entity.stockid)]).subscribe(data => {
            console.log('getStocktypeData==',data);
            let [grouplist, storehousedetail] = data;
            this.storehouseInfo = storehousedetail.data.result;
            this.groupList = grouplist.data.result;
            let all = {
                groupName: '全部',
                groupId: -1
            }
            
            this.groupList.unshift(all);
            this.searchParams.groupId = 0;
            console.log('getStocktypeData121==',this.groupList);
            setTimeout(() => {
                this.searchParams.groupId = -1;
            }, 100)
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        console.log(">>>>>this.tab<<<<<", this.tab)
        this.initGrid();

        this.loadPageInitData();
        this.initToolbar();

        
       
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }

        this.searchParams = {
            shopName: '',
            groupId: -1
        }

        this.storehouseInfo = {
            parentid: -1,
            parentname: "",
            stockid: -1,
            ename: "",
            status: -1,
            address: "",
            stocktypename: "",
            manager: "",
            contacttele: 0
        }

    }

    private initToolbar() {
        let extraBtns = [{
            name: 'addShop',
            label: '添加配送店铺',
            placeholder: '添加配送店铺',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        },{
            name: 'removeShop',
            label: '移除配送店铺',
            placeholder: '移除配送店铺',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = {'addShop': true, 'removeShop': true, 'print,copy,add,del,check,import,export,cancel': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true ,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: null,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            let searchParams = Object.assign({stockid: this.tab.routerParam.entity.stockid}, this.searchParams);
            return this.myService.getGridData(param, searchParams)
        };

        
    }

    /**
     * 初始化表格插件
     */
    private initShopGrid() {
        this.shopGridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true ,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: null,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.shopGridOption.loadDataInterface = (param) => {
            // let searchParams = Object.assign({ename: this.storehouseInfo['stockid']}, this.searchParams);
            return this.myService.getShopGridData(param, {ename: this.searchKey})
        };

        setTimeout(() => {
            this.initGridColumns();
            this.shopgrid.load();
        }, 1000);
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            coeid: '<span active="shopDetail">${value}</span>',
            status: '<span>${value===0 ? "禁用" : "正常"}</span>',
            contact: '<span>${value}-${rowdata.contacttele}</span>'
        } ;

        let columndef = [
            {"text":"店铺编码", "datafield":"coeid","align":"center", "width": 100, "pinned": true,},
            {"text":"店铺名称", "datafield":"ename","align":"center", "width": 200, "pinned": true,},
            {"text":"上级机构", "datafield":"parentname","align":"center", "width": 200},
            {"text":"地址", "datafield":"address","align":"center"},
            {"text":"联系人", "datafield":"contact","align":"center", "width": 200, columntype: 'template'},
            // {"text":"联系电话", "datafield":"contacttele","align":"center", "width": 100},
            {"text":"店铺状态", "datafield":"status","align":"center", "width": 80, "pinned": true, columntype: 'template'},
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 初始化表格列表
     */
    private initShopGridColumns() {

        let columnTemplate = {
            coeid: '<span active="shopDetail">${value}</span>',
            status: '<span>${value===0 ? "禁用" : "正常"}</span>',
        } ;

        let columndef = [
            {"text":"店铺编码", "datafield":"eid","align":"center", "width": 80, "pinned": true,},
            {"text":"店铺名称", "datafield":"ename","align":"center", "width": 200, "pinned": true,},
            {"text":"上级机构", "datafield":"parentname","align":"center", "width": 200},
            {"text":"地址", "datafield":"address","align":"center", "width": 200},
            {"text":"联系人", "datafield":"contact","align":"center", "width": 90},
            {"text":"联系电话", "datafield":"contactmobile","align":"center", "width": 80},
            {"text":"店铺状态", "datafield":"status","align":"center", "width": 80, "pinned": true, columntype: 'template'},
        ]

        this.shopgrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        this.searchParams = {
            shopName: '',
            groupId: -1
        }

        this.mygrid.load();
    }



    /**
     * 表格按钮点击
     */
    doShopDetail(obj) {
        console.log(obj)
        let thisData = obj.entitys[0];
        
    }

    /**
     * 按钮栏按钮点击
     */
    doAddShop() {
        this.initShopGrid();
        this.initShopGridColumns();
        this.shopModal.open();
    }
    doRemoveShop(obj) {
        let selectedData = obj.entitys;
        let coeids;
        if(!selectedData || selectedData.length === 0) {
            this.baseService.modalService.modalToast('请选择店铺');
            return;
        } else {
            coeids = [];
            selectedData.forEach((item, i) => {
                coeids.push(item.coeid);
            });
        }

        this.baseService.modalService.modalConfirm('确定移除选中的店铺？', '移除确认', 'info', '确认', '取消').subscribe((res) => {
            if(res === 'OK') {
                this.myService.doOperate(this.storehouseInfo['stockid'], 0, coeids).subscribe((res) => {
                    if(res.retCode === 0) {
                        this.baseService.modalService.modalToast('操作成功！');
                        this.mygrid.load();
                        this.mygrid.clearselection();
                    }
                });
            }
        })
    }

    /**
     * 弹窗查询按钮
     */
    doModalSearch() {
        this.shopgrid.load();
    }

    /**
     * 弹窗确定按钮
     */
    doModalConfirm() {
        let coeids = [];
        let selIndex = this.shopgrid.selection.getSelectRows();
        console.log(selIndex);
        if(selIndex.length === 0) {
            this.baseService.modalService.modalToast('请选择店铺！');
            return ;
        }

        selIndex.forEach((item, i) => {
            coeids.push(item.eid);
        });
        console.log(coeids);
        this.myService.doOperate(this.storehouseInfo['stockid'], 1, coeids).subscribe((res) => {
            if(res.retCode === 0) {
                this.baseService.modalService.modalToast(res.message);
                this.mygrid.load();
                this.shopModal.close();
            }
        });
        // this.selectOrgan.emit(selData);
        this.shopgrid.clearselection();
    }

    /**
     * 弹窗取消按钮
     */
    doModalClose() {
        this.shopgrid.clearselection();
        this.shopModal.close();
    }

}