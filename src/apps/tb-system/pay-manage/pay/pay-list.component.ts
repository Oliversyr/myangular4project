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
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { PayListService } from './pay-list.service';
import { Grid } from '../../../../common/components/grid/grid';
import { CellModel } from '../../../../common/components/input/cell';

/**
 * 搜索参数
 */
interface SearchParams {
    /** 商品编码 -1:全部 */
    goodsid?: number;
    /** 调出仓	-1：全部 */
    outstockid?: number;
    /** 调入仓	-1:全部 */
    instockid?: number;
    /** 调拨状态 -1:全部 0-调拨待出库 1-调拨已出库 2-调拨已入库 */
    flag?: number;
    /** 单据状态 -1:全部 0-编辑中 1-编辑完成 100－已审核 */
    status?: number;
    /** 发生开始日期 格式：yyyy-MM-dd */
    bdate?: string | Date;
    /** 发生结束日期 格式：yyyy-MM-dd */
    edate?: string | Date;
    /** 日期类型 1 ：制单日期 2：审核日期 3：调出日期 4：调入日期 */
    datetype?: string | number;
    /** 操作人 */
    operator?: string;
    /** 操作人方式 1-制单人 2-审核人 3-调出人 4-调入人*/
    opflag?: string | number;
    /** 调拨业务分类 非必填(保留) 默认全部 0-普通调拨 1-退货调拨*/
    subtype?: number;
    /** 排序方式 0-默认 1-调出时间  2-调入时间 */
    orderby?: number;
    /** 1- 升序 0-降序 */
    basc?: number;
}

/**
 * 仓库调出调入方向
 */
export enum TansferDirection {
    Out = 1,
    In = 2
}

/*
 * 支付管理模块——列表组件
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2017-12-25 14:28:37
 */
@Component({
    templateUrl: './pay-list.html',
    styleUrls: ['./pay-list.scss']
})
export class PayListComponent extends BaseListComponent implements OnInit {
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
    /** 选中的商品 */
    myGoods: Array<any> = [];
    /** 状态 */
    statusData: SelectItem<number>[] = [
        { value: -1, label: '全部' },
        { value: 0, label: '编辑中' },
        { value: 1, label: '编辑完成' },
        { value: 100, label: '已审核' }
    ];
    /** 调拨状态 */
    flagStatusData: SelectItem<number>[] = [
        { value: -1, label: '全部' },
        { value: 0, label: '调拨待出库' },
        { value: 1, label: '调拨已出库' },
        { value: 2, label: '调拨已入库' }
    ];
    /** 制单日期/审核日期/调出日期/调入日期 */
    dateLabels: SelectItem<number>[] = [
        { value: 1, label: "制单日期" },
        { value: 2, label: "审核日期" },
        { value: 3, label: "调出日期" },
        { value: 4, label: "调入日期" }
    ];
    dateValue: DateRangeModel;
    /** 制单人/审核人/调出人/调入人 */
    opflagLabels: SelectItem<number>[] = [
        { value: 1, label: "制单人" },
        { value: 2, label: "审核人" },
        { value: 3, label: "调出人" },
        { value: 4, label: "调入人" }
    ];
    opflagValue: CellModel;
    /** 表格的表头自定义排序配置信息 */
    sorts: GridSortOption[] = [];
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    /** 列表分页参数 */
    gridPage: GridPage;
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 调出仓库选择 */
    @ViewChild('storeOutOrgan') storeOutOrgan;
    /** 调入仓库选择 */
    @ViewChild('storeInOrgan') storeInOrgan;
    /** 商品选择 */
    @ViewChild('goods') goods;
    /** 新建采购入库单弹出框实例对象 */
    @ViewChild('el_winChooseTransfer') el_winChooseTransfer;

    constructor(
        public rootElement: ElementRef,
        public baseService: BaseService,
        public baseListService: BaseListService,
        public myService: PayListService
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
            leftValue: 1,
            beginDate: toDateStr,
            endDate: toDateStr
        };
        this.opflagValue = {
            leftValue: 1
        };
        this.searchParams = {
            goodsid: -1,
            outstockid: -1,
            instockid: -1,
            flag: -1,
            status: -1,
            bdate: '',
            edate: '',
            operator: '',
            opflag: 1,
            subtype: -1,
            orderby: 0,
            basc: 0
        };
    }

    /**
     * 初始化工具栏
     * 可以设置额外的按钮: extraBtns 
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
            status: '<span>${value===0 ? "编辑中" : value===1 ? "编辑完成" : "已审核"}</span>',
            flag: '<span>${value===0 ? "调拨待出库" : value===1 ? "调拨已出库" : "调拨已入库"}</span>'
        };
        let columndef = [
            { "text": "调拨单号", "datafield": "sheetid", "align": "center", "columntype": "link|browse","width": 80, pinned: true },
            { "text": "调出仓库", "datafield": "outstockname", "align": "center", "width": 120, pinned: true },
            { "text": "调入仓库", "datafield": "instockname", "align": "center", "width": 120, pinned: true },
            {
                "text": "调拨商品", "datafield": "goodsnum", "align": "right", "width": 100, columntype: 'template', aggregates: [{
                    '<b>小计</b>': (aggregatedValue: number, currentValue: number, column: any, record: any): number => {
                        console.log('aggregatedValue, currentValue, column, record ....>=', aggregatedValue, currentValue, column, record)
                        return aggregatedValue;
                    }
                }]
            },
            { "text": "制单人", "datafield": "editor", "align": "center", "width": 100 },
            { "text": "制单时间", "datafield": "editdate", "align": "center", "width": 200 },
            { "text": "审核人", "datafield": "checker", "align": "center", "width": 100 },
            { "text": "审核时间", "datafield": "checkdate", "align": "center", "width": 200 },
            { "text": "单据状态", "datafield": "status", "align": "center", "width": 80, columntype: 'template' },
            { "text": "调拨状态", "datafield": "flag", "align": "center", "width": 120, columntype: 'template' },
            { "text": "操作", "datafield": "tools", "width": 150, columntype: 'tools' }
        ]
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 初始化表格配置
     * 排序：
     * 默认按照制单时间逆序排列
     * 支持按调出时间手工排序
     * 支持按调入时间手工排序
     */
    private initGrid() {
        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            if (this.dateValue.beginDate) this.searchParams.bdate = this.dateValue.beginDate;
            if (this.dateValue.endDate) this.searchParams.edate = this.dateValue.endDate;
            this.searchParams.datetype = this.dateValue.leftValue;
            this.searchParams.opflag = this.opflagValue.leftValue;
            this.searchParams.orderby = param.orderField === 'outcheckdate' ? 1 : param.orderField === 'incheckdate' ? 2 : 0;
            if (this.searchParams.orderby !== 0) {
                this.searchParams.basc = param.orderDirect === 'DESC' ? 0 : 1;
            } else {
                this.searchParams.basc = 0;
            }
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
            { field: "outcheckdate", label: "调出日期" },
            { field: "incheckdate", label: "调入日期" }
        ];
        this.gridPage = {
            pageNum: 1,
            pageSize: 10
        }
        setTimeout(() => {
            this.initGridColumns();
            this.mygrid.load();
        }, 1000);
    }

    /**
     * 仓库选择
     * @param org 
     * @param tansferDirection 
     */
    selectedStorehouse(org, tansferDirection) {
        if (TansferDirection.Out === tansferDirection) {
            this.searchParams.outstockid = org.length !== 0 ? org[0].stockid : -1;
        } else {
            this.searchParams.instockid = org.length !== 0 ? org[0].stockid : -1;
        }
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
        this.storeOutOrgan.clearSelection();
        this.storeInOrgan.clearSelection();
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
     * 详情
     * @param obj 
     */
    doBrowse(obj) {
        let param = {
            searchParams: {
                pageNum: this.gridPage.pageNum,
                pageSize: this.gridPage.pageSize,
                params: this.searchParams
            },
            sheetid: obj.entitys[0].sheetid,
        }
        super.doBrowse(param);
    }

    /**
     * 新增
     * @param param 
     * @param event 
     */
    protected doAdd(param, event) {
        this.el_winChooseTransfer.open();
    }

    /**
     * 确认新建
     * @param  $event
     */
    doConfirmAdd($event) {
        let param = $event;
        this.myService.add(param).subscribe((res) => {
            let _param = {
                sheetid: res.data.result
            }
            this.goToPage('A', _param, this.tab.moduleid);
            this.el_winChooseTransfer.cancel();
        });
    }

    /**
     * 编辑完成
     * @param param 
     * @param event 
     */
    private doEditComplete(param, event) {
        let _param = {
            optype: 1,
            status: 1,
            sheetid: param.entitys[0].sheetid
        };
        this.myService.operate(_param).subscribe((res) => {
            this.mygrid.load();
        });
    }

    /**
     * 审核
     * @param param 
     * @param event 
     */
    protected doCheck(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        this.myService.modalSer.modalConfirm("审核后将无法修改，您是否确认审核该调拨单？").subscribe((retCode: string): void => {
            this.focus();
            if (retCode != "OK") {
                return;
            };
            let _param = {
                optype: 1,
                status: 100,
                sheetid: param.entitys[0].sheetid
            };
            this.myService.operate(_param).subscribe((res) => {
                this.mygrid.load();
            });
        });
    }

    /**
     * 确定删除
     * @param param 
     * @param event 
     */
    private doConfirmDel(param, event) {
        let _param = {
            optype: 1,
            status: 4,
            sheetid: param.entitys[0].sheetid
        };
        this.myService.operate(_param).subscribe((res) => {
            this.mygrid.load();
        });
    }
}