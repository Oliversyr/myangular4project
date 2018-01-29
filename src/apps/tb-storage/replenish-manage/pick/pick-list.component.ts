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
import { PickListService } from './pick-list.service';
import { PickService } from './pick.service';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { SelectItem } from './../../../../common/components/entitys/selectitem';

/**
 * 搜索参数
 */
interface SearchParams {
    goodsid: number;
    stockid: number;
    shopeid: number;
    checker: string;
    status: number;
    dateValue: any;
}


/**
 * 汇总拣货模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './pick-list.html',
    styleUrls: [ './pick-list.scss' ]
})

export class PickListComponent extends BaseListComponent implements OnInit, AfterViewInit {
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

    /**
     * 列表排序参数
     */
    private sorts: GridSortOption[];

    dateLabels: SelectItem<any>[];

    /**
     * 机构自动补全选择框
     */
    @ViewChild('goodsSelect') goodsSelect;
    @ViewChild('storehouseSelect') storehouseSelect;
    @ViewChild('shopSelect') shopSelect;
    @ViewChild('addPick') addPick;
    @ViewChild('newStorehouseSelect') newStorehouseSelect;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;
    /**
     * 新增出入库单参数
     */
    newPickData: any = {
        picktype: 0,
        stockid: 0
    };

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: PickListService,
        private pickService: PickService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    // loadPageInitData() {
    //     super.requestConfigBeforePageInit([this.storehouseService.getStocktypeData()]).subscribe(data => {
    //         console.log('getStocktypeData==',data);
    //         this.stocktypeData = data[0].data.result;
    //         let all = {
    //             stocktypename: '全部',
    //             stocktype: -1
    //         }
    //         this.stocktypeData.unshift(all);
    //         this.searchParams.stocktype = 0;
    //         setTimeout(() => {
    //             this.searchParams.stocktype = -1;
    //         }, 100)
    //     });
    // }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initToolbar();
        // this.tab.routerParam;

        // this.loadPageInitData();

        this.option = {
            isMoreSearch: true,
            tab: this.tab
        }

        //表格排序
        this.sorts = [
            { field: "finishTime", label: "拣货完成时间" },
        ];
    }

    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight);

        let toolBarStatus = {'copy,cancel,check,import': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.statusData = [
            {value: -1, label: '全部'},
            {value: 0, label: '拣货中'},
            {value: 1, label: '拣货完成'},
        ]

        this.dateLabels = [
            {value: -1, label: '全部'},
            {value: 0, label: '汇总日期'},
            {value: 1, label: '拣货完成日期'},
        ]

        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());

        this.searchParams = {
            goodsid: -1,
            stockid: -1,
            shopeid: -1,
            status: -1,
            checker: "",
            dateValue: {
                leftValue: -1,
                beginDate: toDateStr,
                endDate: toDateStr
            }
        }

        this.searchParams.dateValue.leftValue = -1;
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            gridType: "B",
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight),
            primaryKeyFields:["sheetid", "status", "oitypevalue"],
            loadDataInterface: (param) => {
                return this.myService.getGridData(param, this.searchParams)
            },
            columns: [this.getColumndef(),null,this.getColumnTemplate()]
        };
    }

    ngAfterViewInit() {
        this.mygrid.load();
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.browse = true;
        rowToolState.edit = row.status === 0;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    private getColumndef() {
       return  [
            {"text":"拣货批次号", "datafield":"sheetid","align":"center", "width": 80, pinned: true, columntype: 'link|browse',
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"拣货仓库", "datafield":"stockname","align":"center", "minWidth": 200, pinned: true,},
            {"text":"配送单", "datafield":"sheetnum","align":"center", "width": 120, columntype: 'template', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '张</span>'
                    return renderstring;
                }
            },
            {"text":"配送商品", "datafield":"goodsnum","align":"center", width:120, columntype: 'template', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '种</span>'
                    return renderstring;
                }
            },
            {"text":"配送店铺", "datafield":"shopnum","align":"center", "width": 120, columntype: 'template', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '家</span>'
                    return renderstring;
                }
            },
            {"text":"汇总人", "datafield":"editor","align":"center", "width": 90},
            {"text":"汇总时间", "datafield":"editdate","align":"center", "width": 200
            },
            {"text":"拣货人", "datafield":"checker","align":"center", "width": 80},
            {"text":"拣货完成时间", "datafield":"checkdate","align":"center", "width": 200},
            {"text":"拣货状态", "datafield":"status","align":"center", "width": 80, pinned: true, columntype: 'template'},
            {"text":"汇总方式", "datafield":"picktype","align":"center", "width": 120, pinned: true, columntype: 'template'},
            {"text":"操作", "datafield":"tools", "width": 120, columntype: 'tools'}
        ]
    }

    private getColumnTemplate() {
        return  {
            sheetnum: '<span>${value}张</span>',
            shopnum: '<span>${value}家</span>',
            status: '<span>${value===0 ? "拣货中" : "拣货完成"}</span>',
            picktype: '<span>${value===0 ? "按商品" : "按店铺商品"}</span>',
            goodsnum: '<span>${value}种</span>'
        };
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
     * 店铺选择
     */
    selectedShop(org) {
        console.log(org);
        this.searchParams.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 仓库选择
     */
    selectedNewStorehouse(org) {
        this.newPickData.stockid = org.length !== 0 ? org[0].stockid : -1;
    }

    /**
     * 详情
     * @param obj 
     */
    // doBrowse(obj) {
    //     console.log(obj)
    //     let param = {
    //         searchParams: {
    //             pageNum: 1,
    //             pageSize: 10,
    //             params: this.searchParams
    //         },
    //         sheetid: obj.entitys[0].sheetid,
    //         status: obj.entitys[0].sheetid,
    //         oitypevalue: obj.entitys[0].oitypevalue
    //     }

    //     super.doBrowse(param);
    // }



    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.searchParams = {
            goodsid: -1,
            stockid: -1,
            shopeid: -1,
            status: -1,
            checker: "",
            dateValue: {
                leftValue: -1,
                beginDate: toDateStr,
                endDate: toDateStr
            }
        }

        this.goodsSelect.clearSelection();
        this.storehouseSelect.clearSelection();
        this.shopSelect.clearSelection();

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
        this.pickService.doOperate(sheetids, 4).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.mygrid.load();
            } 
        })
    }


    /**
     * 表格按钮点击
     */
    // doEdit(obj) {
    //     console.log(obj);
    //     let selectedData = obj.entitys[0];
    //     let param = {
    //         sheetid: selectedData.sheetid,
    //         oitype: selectedData.oitypevalue.indexOf('入库') === -1 ? 200 : 100
    //     }
    //     if(selectedData.status === 1) {
    //         this.pickService.doOperate(selectedData.sheetid, 0).subscribe((res) => {
    //             this.baseService.modalService.modalToast(res.message);
    //             if(res.retCode === 0) {
    //                 super.doEdit(param);
    //             } 
    //         })
    //     } else {
    //         super.doEdit(param);
    //     }
    // }

    /**
     * 新增出入库单
     */
    doAdd() {
        this.newStorehouseSelect.clearSelection();
        this.newPickData.picktype = '0';
        this.addPick.open();
    }
    doModalConfirm() {
        if(!this.newPickData.stockid) {
            this.baseService.modalService.modalToast('请选择拣货仓库');
        } else {
            this.myService.addPickData(this.newPickData).subscribe((res) => {
                if(res.retCode === 0) {
                    this.addPick.close();
                    let param = {
                        sheetid: res.data.result,
                        picktype:  this.newPickData.picktype
                    }
                    super.doEdit(param);
                } else {
                    this.baseService.modalService.modalToast(res.message);
                }
            })
        }
    }
    doModalCancel() {
        this.addPick.close();
    }

}