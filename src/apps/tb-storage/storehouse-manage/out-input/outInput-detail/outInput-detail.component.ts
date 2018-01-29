import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseDetailService } from '../../../../../common/top-common/base-detail.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseDetailComponent } from "../../../../../common/top-common/base-detail.component";
import { TemplateDetailOption } from '../../../../../common/components/templates/template-detail';
import { GridOption, GridPage, GridEditOption } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { OutInputDetailService } from './outInput-detail.service';
import { OutInputService } from './../outInput.service';
import { GridSortOption } from './../../../../../common/components/grid/grid-sort';
import { Observable } from 'rxjs/Observable';
import { PreviousNextOption } from './../../../../../common/components/previous-next/previousNextOption';

/**
 * 搜索参数
 */
interface OutInputInfo {
    coename: string;
    editdate: any;
    editor: string;
    ename: string;
    goodsnum: number;
    manager: string;
    notes: string;
    oitypevalue: number;
    operdate: any;
    purvalue: number;
    resheetid: number;
    sheetid: number;
    status: number;
    dateValue?: any;
}




/**
 * 商品出入库单详情模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './outInput-detail.html',
    styleUrls: [ './outInput-detail.scss' ]
})

export class OutInputDetailComponent extends BaseDetailComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateDetailOption;
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    private gridPage: GridPage;
    private gridGoodsData: Array<any>;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    outInputInfo: OutInputInfo;

    addGoods: any = {
        num: '',
        price: '',
        notes: ''
    };

    preNextOption: PreviousNextOption<any>;

    oitypeObj: any;

    /**
     * 列表排序参数
     */
    // private sorts: GridSortOption[];

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseDetailService: BaseDetailService,
        private myService: OutInputDetailService,
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
        super.requestConfigBeforePageInit([this.outInputService.getOutInputDetail(this.tab.routerParam.entity.sheetid)]).subscribe(data => {
            console.log('getStocktypeData==',data);
            this.outInputInfo = data[0].data.result.head;
            this.gridGoodsData = data[0].data.result.items;
            this.initToolbar();
      });
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPageInitData();
        this.initHeadParam();
        this.initGrid();

        this.option = {
            tab: this.tab
        }

        this.oitypeObj = this.outInputService.getOitypeObj();

        console.log("this.tab》》》》》》", this.tab)

    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.setData(this.gridGoodsData);
    }

    private initToolbar() {
        console.log('this.preNextOption===', this.preNextOption)
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight);
        let toolBarStatus = {
            'editComplete': this.outInputInfo.status === 0,
            "edit": this.outInputInfo.status !== 100, 
            "check": this.outInputInfo.status === 1,
            "preNext": !!this.tab.routerParam.entity.searchParams,
            "add,copy,cancel": false
        };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initHeadParam() {

        this.preNextOption = {
            currentSheet: this.tab.routerParam.entity.sheetid,
            keyWord: 'sheetid',
            searchParams: this.tab.routerParam.entity.searchParams,
            loadDataInterface: (param) => {return this.outInputService.getGridData(param, param.params)},
            refreshDetailFn: (param) => {return this.refreshData(param.sheetid)}
        }

        this.outInputInfo = {
            coename: "",
            editdate: "",
            editor: "",
            ename: "",
            goodsnum: -1,
            manager: "",
            notes: "",
            oitypevalue: -1,
            operdate: "",
            purvalue: -1,
            resheetid: -1,
            sheetid: -1,
            status: -1,
            
        }

    }



    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true ,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight),
            isEdit: false,
            primaryKeyFields:["sheetid", "status"],
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]

        };

        this.gridPage = {
            pageable: false
        }
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.del = true;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            purvalue: '<span>${rowdata.oiqty * rowdata.purvalue}</span>',
        } ;

        let columndef = [
            {"text":"商品内码", "datafield":"mygoodsid","align":"center", "width": 90, pinned: true,
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"商品名称", "datafield":"goodsname","align":"center", minWidth: 200, pinned: true},
            {"text":"条码", "datafield":"barcode","align":"center", "width": 100},
            {"text":"销售规格", "datafield":"spec","align":"center", width: 100},
            {"text":"包装单位", "datafield":"uname","align":"center", "width": 80},
            {"text":"出入库数量", "datafield":"oiqty","align":"center", "width": 100, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"出入库价格（元）", "datafield":"price","align":"right", "width": 110, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">￥' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"出入库金额（元）", "datafield":"purvalue","align":"right", "width": 110,  columntype: 'template', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">￥' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"备注", "datafield":"notes","align":"center", "width": 200},
        ]

        
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 更新页面数据
     */
    refreshData(sheetid) {
        return new Observable<any>((observable) => {
            this.outInputService.getOutInputDetail(sheetid).subscribe((res) => {
                
                if(res.retCode === 0) {
                    this.outInputInfo = res.data.result.head;
                    this.gridGoodsData = res.data.result.items;
                    this.mygrid.setData(this.gridGoodsData);
                    this.initToolbar();
                    observable.next(true);
                } else {
                    this.baseService.modalService.modalToast(res.message);
                    observable.next(false);
                }
                observable.complete();
            })
        })
    }
    
    
    /**
     * 编辑完成
     * 
     */
    doEditComplete() {
        this.outInputService.doOperate([this.outInputInfo.sheetid], 1).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                this.outInputInfo.status = 1;
                this.initToolbar();
            }
        })
    }

    /**
     * 编辑
     */
    doEdit() {
        if(this.outInputInfo.status === 1) {
            this.outInputService.doOperate([this.outInputInfo.sheetid], 0).subscribe((res) => {
                this.baseService.modalService.modalToast(res.message);
                if(res.retCode === 0) {
                    super.doEdit({sheetid: this.outInputInfo.sheetid, status: 0});
                }
            })
        } else {
            super.doEdit({sheetid: this.outInputInfo.sheetid, status: 0});
        }
    }

    /**
     * 删除
     */
    doDel() {
        this.baseService.modalService.modalConfirm('确定删除当前出入库单？').subscribe((res) => {
            if(res === "OK") { 
                this.outInputService.doOperate([this.outInputInfo.sheetid], 4).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        super.closePage();
                        super.doList(null);
                    }
                })
            }
        })
    }


}