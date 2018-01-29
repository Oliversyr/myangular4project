import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../common/directives/router/sui-router.sevice';
import { OutInputListService } from './outInput-list.service';
import { OutInputService } from './outInput.service';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';

/**
 * 搜索参数
 */
interface SearchParams {
    goodsid: number;
    stockid: number;
    oitype: number;
    refsheetid: any;
    status: number;
    dateValue: any;
}


/**
 * 仓库管理模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './outInput-list.html',
    styleUrls: [ './outInput-list.scss' ]
})

export class OutInputListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    hotkeys: any = HOTKEYS;
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
    /**
     * 仓库类型
     */
    stocktypeData: Array<object> = [];
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

    oitypeData: Array<any>;
    newOitypeData: Array<object>;
    /**
     * 列表排序参数
     */
    private sorts: GridSortOption[];

    pageParam: any;

    /**
     * 机构自动补全选择框
     */
    @ViewChild('goodsSelect') goodsSelect;
    @ViewChild('storehouseSelect') storehouseSelect;
    @ViewChild('addOutInput') addOutInput;
    @ViewChild('newStorehouseSelect') newStorehouseSelect;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;
    /**
     * 新增出入库单参数
     */
    newOutInput: any = {
        oitype: -1,
        stockid: -1
    };

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: OutInputListService,
        private outInputService: OutInputService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        super.requestConfigBeforePageInit([this.outInputService.getOiTypeList()]).subscribe(data => {
            console.log('getStocktypeData==',data);
            this.oitypeData = data[0].data.result;

            let oitypedata = JSON.parse(JSON.stringify(this.oitypeData));
            let all = {
                oitype: -1,
                name: '全部'
            }
            this.oitypeData.unshift(all);
            
            this.newOitypeData = oitypedata;
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initToolbar();
        // this.tab.routerParam;

        this.loadPageInitData();

        this.option = {
            isMoreSearch: true,
            tab: this.tab
        }

        //表格排序
        this.sorts = [
            { field: "purValue", label: "出入库金额" },
        ];
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight);

        let toolBarStatus = {'copy,cancel,import': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.statusData = [
            {value: -1, label: '全部'},
            {value: 0, label: '编辑中'},
            {value: 1, label: '编辑完成'},
            {value: 100, label: '已审核'}
        ]

        

        this.searchParams = {
            goodsid: -1,
            stockid: -1,
            oitype: -1,
            refsheetid: "",
            status: -1,
            dateValue: {
                beginDate: "",
                endDate: ""
            }
        }

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        // let extraBtns = [
        //     { name: "forbid", label: "禁用", placeholder: "禁用", state: true, useMode:"GRID_BAR", userPage: "A|M|B" },
        //     { name: "restart", label: "启用", placeholder: "启用", state: true, useMode:"GRID_BAR", userPage: "A|M|B" },
        //     { name: "manageShop", label: "管理配送店铺", placeholder: "管理配送店铺", state: true, useMode:"GRID_BAR", userPage: "A|M|B" }
        // ]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true ,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight),
            primaryKeyFields:["sheetid", "status", "oitypevalue"]
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.pageParam = {
                pageNum: param.pageNum,
                pageSize: param.pageSize
            }
            return this.outInputService.getGridData(param, this.searchParams)
        };

        
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.browse = true;
        rowToolState.edit = row.status !== 100;
        rowToolState.del = row.status === 0;
        rowToolState.check = row.status === 1;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            editor: '<span>${value}-${rowdata.editdate}</span>',
            status: '<span>${value===0 ? "编辑中" : value===1 ? "编辑完成" : "已审核"}</span>',
            goodsnum: '<span>${value}种</span>',
        } ;

        let columndef = [
            {"text":"单据编号", "datafield":"sheetid","align":"center", "width": 80, pinned: true, columntype: 'link|browse',
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"仓库", "datafield":"ename","align":"center", minWidth: 200, pinned: true,},
            {"text":"出入库类型", "datafield":"oitypevalue","align":"center", "width": 90, pinned: true},
            {"text":"发生日期", "datafield":"operdate","align":"center", width: 150},
            {"text":"发生对象", "datafield":"coename","align":"center", "width": 150},
            {"text":"相关单号", "datafield":"resheetid","align":"center", "width": 90},
            {"text":"出入库商品", "datafield":"goodsnum","align":"center", "width": 80, columntype: 'template', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0)  + '种</span>'
                    return renderstring;
                }
            },
            {"text":"出入库金额（元）", "datafield":"purvalue","align":"right", "width": 110, aggregates: ['sum'], cellformat: 'c2',
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">￥' + (aggregates.sum || 0.00) + '</span>'
                    return renderstring;
                }
            },
            {"text":"仓管员", "datafield":"manager","align":"center", "width": 80},
            {"text":"制单", "datafield":"editor","align":"center", "width": 200, columntype: 'template'},
            {"text":"状态", "datafield":"status","align":"center", "width": 80, columntype: 'template'},
            {"text":"操作", "datafield":"tools", "width": 150, columntype: 'tools'}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 商品选择
     */
    selectedGoods(org) {
        console.log(org)
        this.searchParams.goodsid = org.length !== 0 ? org[0].goodsid : -1;
    }

    /**
     * 仓库选择
     */
    selectedStorehouse(org) {
        this.searchParams.stockid = org.length !== 0 ? org[0].stockid : -1;
    }

    /**
     * 新增时仓库选择
     */
    selectedNewStorehouse(org) {
        this.newOutInput['stockid'] = org.length !== 0 ? org[0].stockid : -1;
    }

    /**
     * 详情
     * @param obj 
     */
    doBrowse(obj) {
        console.log(obj)
        let param = {
            searchParams: {
                pageNum: this.pageParam.pageNum || 1,
                pageSize: this.pageParam.pageSize || 10,
                params: this.searchParams
            },
            sheetid: obj.entitys[0].sheetid,
            status: obj.entitys[0].status,
            oitypevalue: obj.entitys[0].oitypevalue
        }

        super.doBrowse(param);
    }



    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        this.searchParams = {
            goodsid: -1,
            stockid: -1,
            oitype: -1,
            refsheetid: "",
            status: -1,
            dateValue: {
                beginDate: "",
                endDate: ""
            }
        }

        this.goodsSelect.clearSelection();
        this.storehouseSelect.clearSelection();

        this.mygrid.load();
    }

    /**
     * 删除操作
     * @param param 
     */
    doConfirmDel(param) {
        console.log(param);
        let sheetids = [];
        param.entitys.forEach((item) => {
            sheetids.push(item.sheetid);
        })
        this.outInputService.doOperate(sheetids, 4).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.mygrid.load();
            } 
        })
    }


    /**
     * 编辑
     */
    doEdit(obj) {
        console.log(obj);
        let selectedData = obj.entitys[0];
        let param = {
            sheetid: selectedData.sheetid,
            // oitype: selectedData.oitypevalue.indexOf('入库') === -1 ? 200 : 100
            // oitype: 100
        }
        if(selectedData.status === 1) {
            this.outInputService.doOperate([selectedData.sheetid], 0).subscribe((res) => {
                this.baseService.modalService.modalToast(res.message);
                if(res.retCode === 0) {
                    super.doEdit(param);
                } 
            })
        } else {
            super.doEdit(param);
        }
    }

    /**
     * 新增出入库单
     */
    doAdd() {
        this.newStorehouseSelect.clearSelection();
        this.newOutInput['oitype'] = undefined;
        this.addOutInput.open();
    }
    doModalConfirm() {
        if(this.newOutInput['stockid'] === -1) {
            this.baseService.modalService.modalToast('请选择所在仓库');
        } else if(!this.newOutInput['oitype']) {
            this.baseService.modalService.modalToast('请选择出入库类型');
        } else {
            this.myService.addOutInput(this.newOutInput).subscribe((res) => {
                if(res.retCode === 0) {
                    this.addOutInput.close();
                    let param = {
                        sheetid: res.data.result,
                        oitype: this.newOutInput['oitype'],
                        status: 0
                    }
                    super.doEdit(param);
                } else {
                    this.baseService.modalService.modalToast(res.message);
                }
            })
        }
    }
    doModalCancel() {
        this.addOutInput.close();
    }

    /**
     * 审核
     */
    doCheck(obj) {
        console.log(obj)
        let selectedData = obj.entitys;
        let sheetids;
        if(!selectedData || selectedData.length === 0) {
            this.baseService.modalService.modalToast('请选择单据');
            return;
        } else {
            sheetids = [];
            selectedData.forEach((item, i) => {
                // if(item.status === 1) {
                    sheetids.push(item.sheetid);
                // }
            });
            // if(sheetids.length === 0) {
            //     this.baseService.modalService.modalToast('请选择状态为【编辑完成】的单据');
            //     return;
            // }
        }

        this.baseService.modalService.modalConfirm("您正在审核" + sheetids.length + "张商品出入库单，审核成功后，出入库商品将核减/加库存！")
        .subscribe((res: string) => {
            if(res === 'OK') {
                this.outInputService.doOperate(sheetids, 100).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        this.mygrid.load();
                    } 
                })
            } 
        });

        
    }

}