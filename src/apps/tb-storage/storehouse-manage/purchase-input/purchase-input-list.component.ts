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
import { Grid } from '../../../../common/components/grid/grid';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { PurchaseInputListService } from './purchase-input-list.service';

/**
 * 搜索参数
 */
interface SearchParams {
    /** 商品编码 -1:全部 */
    goodsid?: number;
    /** 仓库编码 -1:全部 */
    stockid?: number;
    /** 出入库类型 -1:全部 101-采购入库 */
    oitype?: number;
    /** 相关单号 */
    refsheetid?: string;
    /** 状态 -1-全部 0-编辑中 1-编辑完成 100－已审核 */
    status?: number;
    /** 开始日期 */
    bdate?: string | Date;
    /** 结束日期 */
    edate?: string | Date;
}

/**
 * 采购入库模块——列表组件
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:27:05
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 17:23:11
 */
@Component({
    templateUrl: './purchase-input-list.html',
    styleUrls: ['./purchase-input-list.scss']
})
export class PurchaseInputListComponent extends BaseListComponent implements OnInit {
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
    /** 发生日期 */
    dateLabels: string = '发生日期';
    dateValue: DateRangeModel;
    /** 状态 */
    statusData: Array<SelectItem<number>> = [
        { value: -1, label: '全部' },
        { value: 0, label: '编辑中' },
        { value: 1, label: '编辑完成' },
        { value: 100, label: '已审核' }
    ];
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    /** 列表分页参数 */
    gridPage: GridPage = {};
    /** 表格的表头自定义排序配置信息 */
    sorts: GridSortOption[] = [];
    /** 表格 */
    @ViewChild('grid') mygrid: Grid;
    /** 仓库选择 */
    @ViewChild('storeOrgan') storeOrgan;
    /** 商品选择 */
    @ViewChild('goods') goods;
    /** 新建采购入库单弹出框 */
    @ViewChild('el_winChoosePurchase') el_winChoosePurchase;
    /** 审核采购入库单弹出框 */
    @ViewChild('el_winCheckPurchaseInput') el_winCheckPurchaseInput;
    myCheckedSheetid: number;

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseListService: BaseListService,
        private myService: PurchaseInputListService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        /** 暂时不要删掉，可能要执行该函数请求配置 */
        // super.requestConfigBeforePageInit([]).subscribe(results => {
        //     console.debug("requestConfigBeforePageInit", ">>>>>>>>>>>>>>>>results", results);
        // });
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
     * 模板配置项: Option
     * 该模块ID  : moduleId
     */
    private initTemplateListOption() {
        this.option.isMoreSearch = true;
        this.option.tab = this.tab;
        this.moduleId = this.tab.moduleid;
    }

    /**
     * 初始化搜索参数
     * 状态下拉项: statusData
     * 查询参数  : searchParams
     * 日期区间项: dateLabels、dateValue
     */
    private initSearchParam() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.dateValue = {
            beginDate: toDateStr,
            endDate: toDateStr
        };
        this.searchParams = {
            goodsid: -1,
            stockid: -1,
            oitype: 101,
            refsheetid: '',
            status: -1,
            bdate: toDateStr,
            edate: toDateStr
        };
    }

    /**
     * 初始化工具栏
     */
    private initToolBar() {
        this.extraBtns = this.myService.getExtraBtns();
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.extraBtns);
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
            editor: (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) => {
                return `${rowdata.editor} ${rowdata.editdate}`
            },
            status: '<span>${value===0 ? "编辑中" : value===1 ? "编辑完成" : "已审核"}</span>',
        };
        let columndef = [
            { "text": "单据编号", "datafield": "sheetid", "align": "center", "columntype": "link|browse","width": 80, pinned: true },
            { "text": "仓库", "datafield": "ename", "align": "center", "width": 150 },
            { "text": "发生日期", "datafield": "operdate", "align": "center", "width": 100 },
            { "text": "供应商", "datafield": "coename", "align": "left", width: 150 },
            { "text": "采购单号", "datafield": "resheetid", "align": "center", "width": 120 },
            {
                "text": "入库商品", "datafield": "goodsnum", "align": "right", "width": 100, columntype: 'template', aggregates: [{
                    '<b>小计</b>': (aggregatedValue: number, currentValue: number, column: any, record: any): number => {
                        console.log('aggregatedValue, currentValue, column, record ....>=', aggregatedValue, currentValue, column, record)
                        return aggregatedValue;
                    }
                }]
            },
            { "text": "入库金额(元)", "datafield": "purvalue", "align": "right", "width": 80,aggregates:['sum'] },
            { "text": "仓管员", "datafield": "manager", "align": "center", "width": 80 },
            { "text": "制单", "datafield": "editor", "align": "center", "width": 200, columntype: 'template' },
            { "text": "状态", "datafield": "status", "align": "center", "width": 80, columntype: 'template' },
            { "text": "操作", "datafield": "tools", "width": 150, columntype: 'tools' }
        ]
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 初始化表格配置
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
            rowToolState.edit = row.status <= 1;;
            rowToolState.editComplete = row.status == 0;
            rowToolState.check = row.status == 1;
            rowToolState.del = row.status == 0;
            this.mygrid.setRowToolState(row, rowToolState);
            return true;
        };;
        this.sorts = [
            { field: "purvalue", label: "入库金额" }
        ];
        setTimeout(() => {
            this.initGridColumns();
            this.mygrid.load();
        }, 1000);
    }

    /**
     * 仓库选择
     */
    selectedStorehouse(org) {
        this.searchParams.stockid = org.length !== 0 ? org[0].stockid : -1;
    }

    /**
     * 商品选择
     */
    selectedGoods(org) {
        this.searchParams.goodsid = org.length !== 0 ? org[0].goodsid : -1;
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
        this.storeOrgan.clearSelection();
        this.goods.clearSelection();
        this.mygrid.load();
    }

    /**
     * 列表行编辑
     * @param param 
     * @param originalEvent 
     */
    protected doEdit(param, originalEvent?) {
        let _param = {
            sheetid: param.entitys[0].sheetid,
            goType: this.ATTR.L
        }
        this.goToPage(this.ATTR.M, _param);
    }

    /**
     * 新增
     * @param param 
     * @param event 
     */
    protected doAdd(param, event) {
        this.el_winChoosePurchase.open();
        // TODO 根据采购单新建入库单，采购单需求待定
    }

    /**
     * 编辑完成
     * @param param 
     * @param event 
     */
    private doEditComplete(param, event) {
        let _param = {
            optype: 1,
            sheetid: param.entitys[0].sheetid
        };
        this.myService.operate(_param).subscribe((res) => {
            this.mygrid.load();
        });
    }

    /**
     * 确定审核
     * @param param 
     * @param event 
     */
    protected doCheck(param, event) {
        this.myCheckedSheetid = param.entitys[0].sheetid;
        this.el_winCheckPurchaseInput.open();
    }

    /**
     * 审核采购入库单：完全入库；部分入库
     * @param param 
     */
    doMyConfirmCheck(param) {
        this.myService.operate(param).subscribe((res) => {
            this.mygrid.load();
            this.el_winCheckPurchaseInput.cancel();
        });
    }

    /**
     * 取消审核
     * @param param 
     */
    doCancelCheck(param) {
        let _param = {
            entity: {
                sheetid: param
            }
        };
        this.goToPage('B', _param, this.tab.moduleid);
        this.el_winCheckPurchaseInput.cancel();
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
        this.myService.operate(_param).subscribe((res) => {
            this.mygrid.load();
        });
    }
}