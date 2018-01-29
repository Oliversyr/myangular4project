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
import { Grid } from '../../../../common/components/grid/grid';
import { GridOption, GridPage, GridEditOption } from '../../../../common/components/grid/grid-option';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { ReplenishHandleListService } from './replenish-handle-list.service';

/**
 * 搜索参数
 */
interface SearchParams {
    /** 店铺编码 */
    shopeid?: number;
    /** 所属线路 */
    routeid?: number;
    /** 商品 */
    goodsid?: number;
    /** 所属店组 */
    groupid?: number;
    /** 品牌 */
    brandid?: number;
    /** 单据状态 */
    status?: number;
    /** 申请开始日期 */
    bdate?: string | Date;
    /** 申请结束日期 */
    edate?: string | Date;
    /** 申请人 */
    editor?: string;
    /** 排序方式	0-默认,1-商品内码,2-申请数量  */
    orderby?: number;
    /** 1-升序，0－降序 */
    basc?: number;
}

/*
 * 补货申请处理模块——列表组件
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2017-12-25 14:28:37
 */
@Component({
    templateUrl: './replenish-handle-list.html',
    styleUrls: ['./replenish-handle-list.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReplenishHandleListComponent extends BaseListComponent implements OnInit {
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
    /** 热键 */
    hotkeys: any = HOTKEYS;
    /** 搜索参数 */
    searchParams: SearchParams = {};
    /** 申请日期 */
    dateLabels: string = '申请日期';
    dateValue: DateRangeModel;
    /** 处理状态 */
    statusData: SelectItem<number>[] = [
        { value: -1, label: '全部' },
        { value: 0, label: '待处理' },
        { value: 1, label: '已处理' }
    ];
    /** 汇总信息 */
    gridSummaryInfo: any = {
        shopnum: 0,
        goodsnum: 0,
        shopselectednum: 0,
        goodsselectednum: 0,
    }
    /** 表格的表头自定义排序配置信息 */
    sorts: GridSortOption[] = [];
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    gridEditOption: GridEditOption;
    /** 列表分页参数 */
    gridPage: GridPage = {};
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 申请店铺选择 */
    @ViewChild('shopSelect') shopSelect;
    /** 所属线路选择 */
    @ViewChild('routeSelect') routeSelect;
    /** 商品选择 */
    @ViewChild('goodsSelect') goodsSelect;
    /** 所属店组选择 */
    @ViewChild('groupsSelect') groupsSelect;
    /** 配送仓设置 */
    @ViewChild('storeOrgan') storeOrgan;
    myStoreOrganId: number;
    myStoreOrganName: string;
    /** 新建补货申请单弹出框实例对象 */
    @ViewChild('el_winChooseReplenish') el_winChooseReplenish;
    /** 表格配送仓数据源适配器 */
    stocksAdapter: any;
    stocksSource: any = {
        datatype: 'array',
        datafields: [
            { name: 'stockname', type: 'string' },
            { name: 'stockid', type: 'number' }
        ],
        localdata: []
    }
    /** 品牌字符串ID */
    brandStringId: string;

    constructor(
        public rootElement: ElementRef,
        public baseService: BaseService,
        public baseListService: BaseListService,
        public myService: ReplenishHandleListService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        // super.requestConfigBeforePageInit([

        // ]).subscribe(results => {

        // });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initTemplateListOption();
        this.initSearchParam();
        this.initToolBar();
        this.initGrid();
        this.loadPageInitData();
        this.stocksAdapter = new jqx.dataAdapter(this.stocksSource, { autoBind: true });
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
     */
    private initSearchParam() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.dateValue = {
            beginDate: toDateStr,
            endDate: toDateStr
        };
        this.searchParams = {
            shopeid: -1,
            routeid: -1,
            goodsid: -1,
            groupid: -1,
            brandid: -1,
            status: -1,
            bdate: '',
            edate: '',
            editor: '',
            orderby: 0,
            basc: 0
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
                btn.label = '完成补货';
            }
        });
        let states = { 'del,copy,cancel': false };
        this.baseService.setToolBarStates(this.tools, states);
    }

    /**
     * 初始化表格列表
     * 表格列配置: columndef
     * 模板配置  : columnTemplate
     */
    private initGridColumns() {
        let columnTemplate = {
            goodsname: (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) => {
                return `【${rowdata.goodsid}】 ${rowdata.goodsname}`
            },
            qty: '<span>${value}包</span>',
            accqty: '<span>${value}包</span>',
            wayqty: '<span>${value}包</span>',
            type: '<span>${value===1 ? "手工补货" : value===2 ? "按支持天数" : "按库存阈值"}</span>',
            status: '<span>${value===0 ? "待处理" : value===1 ? "已处理" : ""}</span>',
            editor: (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) => {
                return `${rowdata.editor} ${rowdata.editdate}`
            }
        };
        let columndef = [
            { "text": "申请单号", "datafield": "sheetid", "align": "center", "width": 80, "pinned": true, "editable": false },
            { "text": "申请店铺", "datafield": "fullname", "align": "center", "width": 250, "editable": false },
            { "text": "补货商品", "datafield": "goodsname", "align": "center", "width": 200, "columntype": 'template', "editable": false },
            { "text": "条码", "datafield": "barcode", "align": "center", "width": 120, "editable": false },
            { "text": "申请数量", "datafield": "qty", "align": "right", "editable": false, "width": 100, "columntype": 'template' },
            { "text": "补货数量", "datafield": "askqty", "columntype": "numberinput", "align": "right", "width": 100 },
            {
                "text": '配送仓', "datafield": 'stockname', "columntype": 'dropdownlist', "width": 195, createeditor: (row: number, value: any, editor: any): void => {
                    console.log('aaaa')
                    editor.jqxDropDownList({ width: '99%', height: 27, source: this.stocksAdapter, displayMember: 'stockname', valueMember: 'stockid' });
                }
            },
            { "text": "仓内库存", "datafield": "accqty", "align": "right", "editable": false, "width": 100, "columntype": 'template' },
            { "text": "在途库存", "datafield": "wayqty", "align": "right", "editable": false, "width": 100, "columntype": 'template' },
            { "text": "补货类型", "datafield": "type", "align": "center", "width": 100, "columntype": 'template', "editable": false },
            { "text": "申请人", "datafield": "editor", "align": "center", "width": 200, "columntype": 'template', "editable": false },
            { "text": "状态", "datafield": "status", "align": "center", "width": 80, columntype: 'template', "editable": false }
        ]
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 初始化表格配置
     */
    private initGrid() {
        this.gridOption = {
            gridType: "M",
            isShowRowNo: false,
            selectionMode: 'checkbox',
            loadDataInterface: (param) => {
                this.mygrid.clearselection();
                this.gridSummaryInfo.shopselectednum = 0;
                this.gridSummaryInfo.goodsselectednum = 0;
                return <any>this.refreshGridData(param);
            }
        };
        this.gridEditOption = {
            submitServerFields: ["objectid", "askqty", "stockid"],
            duplicateRowFields: ["objectid"],
            coverFields: ["askqty", "stockid"],
            cumulateFields: ["askqty"],
            promptTemplate: "商品[${row.goodsname}]已存在: ${row.askqty+row.uname}"

        };
        this.gridPage = {
            pageable: false,
            isServerPage: false
        }
        this.sorts = [
            { field: "mygoodsid", label: "商品内码" },
            { field: "askqty", label: "补货数量" }
        ];
        setTimeout(() => {
            this.initGridColumns();
            this.mygrid.load();
        }, 1000);
    }

    /**
     * 刷新表格数据
     * @param data 
     */
    refreshGridData(param?) {
        if (this.dateValue.beginDate) this.searchParams.bdate = this.dateValue.beginDate;
        if (this.dateValue.endDate) this.searchParams.edate = this.dateValue.endDate;
        this.searchParams.brandid = <any>this.brandStringId * 1 || -1;
        if (!!param) {
            this.searchParams.orderby = param.orderField === 'mygoodsid' ? 1 : param.orderField === 'askqty' ? 2 : 0;
            if (this.searchParams.orderby !== 0) {
                this.searchParams.basc = param.orderDirect === 'DESC' ? 0 : 1;
            } else {
                this.searchParams.basc = 0;
            }
        }
        let bodyParam = {
            params: this.searchParams
        };
        return this.myService.getList(bodyParam).subscribe(res => {
            // 1. 判断返回的数据是否正确
            if (res.retCode !== 0) {
                this.myService.modalSer.modalToast(res.message);
                return;
            };
            // 2. 初始化表格数据
            let data = res.data.result.items;
            this.gridSummaryInfo.shopnum = res.data.result.shopnum;
            this.gridSummaryInfo.goodsnum = res.data.result.goodsnum;
            data.map((item) => {
                if (item.status === 0) {
                    item.askqty = item.qty;
                }
                return item;
            })
            this.mygrid.setData(data);
        });
    }

    /**
     * 动态设置配送仓列数据
     * @param data
     */
    setStocksAdapter(data) {
        let _data = data || [];
        this.stocksSource.localdata = _data;
        this.stocksAdapter = new jqx.dataAdapter(this.stocksSource, { autoBind: true });
    }

    /**
     * 表格行选择：用于统计
     * @param param 
     */
    gridRowselect(param) {
        let seletedRows = this.mygrid.selection.getSelectRows(['eid', 'goodsid']) || [];
        this.gridSummaryInfo.shopselectednum = 1;
        this.gridSummaryInfo.goodsselectednum = 1;
        seletedRows.map((item, index, arr) => {
            if (index >= 1 && item.eid !== arr[index - 1].eid) {
                this.gridSummaryInfo.shopselectednum++;
            }
            if (index >= 1 && item.goodsid !== arr[index - 1].goodsid) {
                this.gridSummaryInfo.goodsselectednum++;
            }
            return item;
        });
    }

    /**
     * 申请店铺选择
     * @param org 
     */
    selectedShop(org) {
        this.searchParams.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 所属线路选择
     * @param org 
     */
    selectedRoute(org) {
        this.searchParams.routeid = org.length !== 0 ? org[0].routeid : -1;
    }

    /**
     * 商品选择
     * @param org 
     */
    selectGoods(org) {
        this.searchParams.goodsid = org.length !== 0 ? org[0].goodsid : -1;
    }

    /**
     * 店组选择
     * @param org 
     */
    selectedGroups(org) {
        this.searchParams.groupid = org.length !== 0 ? org[0].groupId : -1;
    }

    /**
     * 仓库选择
     * @param org 
     */
    selectedStorehouse(org) {
        this.myStoreOrganId = org.length !== 0 ? org[0].stockid : -1;
        this.myStoreOrganName = org.length !== 0 ? org[0].ename : '';
    }

    /**
     * 批量设置配送仓
     */
    batchSetStock(event) {
        // 1. 判断配送仓是否选择
        if (!this.myStoreOrganId || this.myStoreOrganId === -1) {
            this.myService.modalSer.modalToast("请选择配送仓！");
            return;
        }
        // 2. 判断是否选择要修改的记录
        let selectedRows = this.mygrid.selection.getSelectRows();
        if (selectedRows.length <= 0) {
            this.myService.modalSer.modalToast("请先选择记录！");
            return;
        }
        // 3. 设置配送仓
        let filterSelectedRows = selectedRows.filter(item => item.status <= 0),
            settingRows = filterSelectedRows.map(item => {
                item.stockid = this.myStoreOrganId;
                item.stockname = this.myStoreOrganName;
                let data = {
                    stockname: this.myStoreOrganName,
                    stockid: this.myStoreOrganId
                }
                this.setStocksAdapter(data);
                return item;
            });
        if (selectedRows.length !== filterSelectedRows.length) {
            this.myService.modalSer.modalConfirm("选择的记录存在已处理单据，确认后会跳过这些记录，是否确认？").subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.updateRows(settingRows);
            });
        } else {
            this.updateRows(settingRows);
        }
    }

    /**
     * 修改表格数据
     * @param rows 
     */
    updateRows(rows) {
        this.mygrid.edit.updateRows(rows);
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
        this.shopSelect.clearSelection();
        this.goodsSelect.clearSelection();
        this.groupsSelect.clearSelection();
        this.mygrid.load();
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
     * @param  $event
     */
    doConfirmAdd($event) {
        let param = $event;
        this.myService.add(param).subscribe((res) => {
            this.goToPage('A', res, 2001);
            this.el_winChooseReplenish.cancel();
        });
    }

    /**
     * 完成补货
     * @param param 
     * @param event 
     */
    protected doCheck(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        let filterSelectedRows = param.entitys.filter(item => item.status <= 0);
        if (param.entitys.length !== filterSelectedRows.length) {
            this.myService.modalSer.modalConfirm("选择的记录存在已处理单据，确认后只会提交未处理的单据，是否确认？").subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.doHandleReplenish(filterSelectedRows);
            });
        } else {
            this.doHandleReplenish(filterSelectedRows);
        }
    }

    /**
     * 补货处理
     * @param handleItems 处理详情
     */
    private doHandleReplenish(handleItems) {
        let submitServerItems = this.mygrid.utils.arrayUtil.copyFields(handleItems, ["objectid", "askqty", "stockid"]);
        this.myService.handle(submitServerItems).subscribe((res) => {
            this.doSearch();
        });
    }
}