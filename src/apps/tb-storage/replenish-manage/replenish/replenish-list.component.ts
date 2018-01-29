import {
    Component
    , OnInit
    , ElementRef
    , ViewChild
    , ViewEncapsulation
} from '@angular/core';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { SelectItem } from './../../../../common/components/entitys/selectitem';
import { DateRangeModel } from './../../../../common/components/input/sui-date';
import { TemplateListOption } from './../../../../common/components/templates/template-list';
import { EmitOption, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { SuiExportService } from '../../../../common/components/export/sui-export.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { ReplenishListService } from './replenish-list.service';
import { Grid } from '../../../../common/components/grid/grid';

/**
 * 搜索参数
 */
interface SearchParams {
    /** 申请店铺 */
    shopeid?: number;
    /** 申请人 */
    editor?: string;
    /** 申请开始日期 */
    bdate?: string | Date;
    /** 申请结束日期 */
    edate?: string | Date;
    /** 申请状态 */
    status?: number;
}

/*
 * 补货申请模块——列表组件
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2017-12-25 14:28:37
 */
@Component({
    templateUrl: './replenish-list.html',
    styleUrls: ['./replenish-list.scss']
})
export class ReplenishListComponent extends BaseListComponent implements OnInit {
    /** template-list配置参数 */
    option: TemplateListOption = {};
    /** 工具栏 */
    tools: ToolBarButton[];
    /** 额外工具栏 */
    extraBtns: ToolBarButton[];
    /** 打印数据 */
    printData: any;
    /** 模块ID */
    moduleId: number;
    /** 搜索参数 */
    searchParams: SearchParams = {};
    /** 申请日期 */
    dateLabels: string = '申请日期';
    dateValue: DateRangeModel;
    /** 状态 */
    statusData: SelectItem<number>[] = [
        { value: -1, label: '全部' },
        { value: 0, label: '待提交' },
        { value: 1, label: '已提交' }
    ];
    /** 表格的表头自定义排序配置信息 */
    sorts: GridSortOption[] = [];
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    /** 列表分页参数 */
    gridPage: GridPage = {};
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 申请店铺 */
    @ViewChild('shopSelect') shopSelectOrgan;
    /** 新建补货申请单弹出框实例对象 */
    @ViewChild('el_winChooseReplenish') el_winChooseReplenish;

    constructor(
        public rootElement: ElementRef,
        public baseService: BaseService,
        public baseListService: BaseListService,
        public myService: ReplenishListService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        /** TODO 保留该方法，不要删除 */
    }

    ngOnInit() {
        super.ngOnInit();
        this.initTemplateListOption();
        this.initSearchParam();
        this.initToolBar();
        this.initGrid();
        this.loadPageInitData();
    }

    /**
     * 初始化TemplateList 
     */
    private initTemplateListOption() {
        this.option.isMoreSearch = false;
        this.option.tab = this.tab;
        this.moduleId = this.tab.moduleid;
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.dateValue = {
            beginDate: toDateStr,
            endDate: toDateStr
        };
        this.searchParams = {
            shopeid: -1,
            editor: '',
            bdate: toDateStr,
            edate: toDateStr,
            status: -1
        };
    }

    /**
     * 初始化工具栏
     * 可以设置额外的按钮: extraBtns 
     */
    private initToolBar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.extraBtns);
        this.tools.map((btn) => {
            if (btn.name === "check") {
                btn.selectRecordMode = 'single';
            }
        });
        let states = { 'copy,cancel': false };
        this.baseService.setToolBarStates(this.tools, states);
    }

    /**
     * 初始化表格列表
     * 表格列配置: columndef
     * 模板配置  : columnTemplate
     */
    private initGridColumns() {
        let columnTemplate = {
            goodsnum: '<span>${value}种</span>',
            askgoodsnum: '<span>${value}种</span>',
            type: '<span>${value===1 ? "手工补货" : value===2 ? "按支持天数" : "按库存阈值"}</span>',
            status: '<span>${value===0 ? "待提交" : value===1 ? "已提交" : ""}</span>',
        };
        let columndef = [
            { "text": "申请单号", "datafield": "sheetid", "align": "center", "columntype": "link|browse", "width": 80, "pinned": true },
            { "text": "店铺", "datafield": "fullname", "align": "center", "width": 250, "pinned": true },
            { "text": "申请人", "datafield": "editor", "align": "center", "width": 120 },
            { "text": "申请时间", "datafield": "editdate", "align": "center", "width": 180 },
            {
                "text": "补货商品", "datafield": "goodsnum", "align": "right", "width": 100, "columntype": 'template', "aggregates": [{
                    '<b>小计</b>': (aggregatedValue: number, currentValue: number, column: any, record: any): number => {
                        console.log('aggregatedValue, currentValue, column, record ....>=', aggregatedValue, currentValue, column, record)
                        return aggregatedValue;
                    }
                }]
            },
            {
                "text": "已处理", "datafield": "askgoodsnum", "align": "right", "width": 100, "columntype": 'template', "aggregates": [{
                    '<b>小计</b>': (aggregatedValue: number, currentValue: number, column: any, record: any): number => {
                        console.log('aggregatedValue, currentValue, column, record ....>=', aggregatedValue, currentValue, column, record)
                        return aggregatedValue;
                    }
                }]
            },
            { "text": "补货类型", "datafield": "type", "align": "center", "width": 120, "columntype": 'template' },
            { "text": "过期时间", "datafield": "overduedate", "align": "center", "width": 120 },
            { "text": "状态", "datafield": "status", "align": "center", "width": 80, "columntype": 'template' },
            { "text": "操作", "datafield": "tools", "width": 150, "columntype": 'tools' }
        ]
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 初始化表格配置
     * 排序：
     * 默认按照申请时间逆序排列。
     */
    private initGrid() {
        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            if (this.dateValue.beginDate) this.searchParams.bdate = this.dateValue.beginDate;
            if (this.dateValue.endDate) this.searchParams.edate = this.dateValue.endDate;
            let bodyParam = {
                pageNum: param.pageNum,
                pageSize: param.pageSize,
                params: this.searchParams
            };
            return this.myService.getList(bodyParam)
        };
        this.gridOption.tools = this.baseService.getGridToolBar(this.mRight, this.extraBtns);
        this.gridOption.rowBeforeAdd = (row: any) => {
            let rowToolState: any = {};
            rowToolState.browse = true;
            rowToolState.edit = row.status == 0;
            rowToolState.check = row.status == 0;
            rowToolState.del = row.status == 0;
            this.mygrid.setRowToolState(row, rowToolState);
            return true;
        };
        setTimeout(() => {
            this.initGridColumns();
            this.mygrid.load();
        }, 1000);
    }

    /**
     * 申请店铺选择
     * @param org 
     */
    selectedShop(org) {
        this.searchParams.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 查询
     * @param event 
     */
    private doSearch(event?) {
        this.mygrid.reload(this.searchParams);
    }

    /**
     * 重置
     * @param event 
     */
    private doReset(event) {
        this.initSearchParam();
        this.shopSelectOrgan.clearSelection();
        this.mygrid.load();
    }

    /**
     * 列表行编辑
     * @param param 
     * @param originalEvent 
     */
    protected doEdit(param, originalEvent?) {
        let _param = {
            sheetid: param.entitys[0].sheetid
        }
        this.goToPage(this.ATTR.M, _param);
    }

    /**
     * 新增
     * @param param 
     * @param event 
     */
    protected doAdd(param, event) {
        this.el_winChooseReplenish.open();
    }

    /**
     * 确认新建
     * 新建的补货申请均为手工补货。
     * 只有手工补货可编辑，自动补货申请状态直接置为已提交。
     * @param  $event
     */
    doConfirmAdd($event) {
        let param = $event;
        this.myService.add(param).subscribe((res) => {
            let _param = {
                sheetid: res.data.result || -1
            };
            this.goToPage(this.ATTR.A, _param, this.tab.moduleid);
            this.el_winChooseReplenish.cancel();
        });
    }

    /**
     * 确定审核
     * @param param 
     * @param event 
     */
    private doConfirmCheck(param, event) {
        let _param = {
            optype: 1,
            sheetid: param.entitys[0].sheetid
        };
        // 1. 前置判断
        if (this.unChooseRecord(param)) {
            return;
        }
        // 2. 调用服务
        this.myService.operate(_param).subscribe((res) => {
            this.mygrid.load();
        });
    }

    /**
     * 确定删除
     * @param param 
     * @param event 
     */
    private doConfirmDel(param, event) {
        let _param = {
            optype: 4,
            sheetid: param.entitys[0].sheetid
        };
        // 1. 前置判断
        if (this.unChooseRecord(param)) {
            return;
        }
        // 2. 调用服务
        this.myService.operate(_param).subscribe((res) => {
            this.mygrid.load();
        });
    }
}