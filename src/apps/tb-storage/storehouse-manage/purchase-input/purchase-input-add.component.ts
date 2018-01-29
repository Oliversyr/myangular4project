import {
    Component
    , OnInit
    , Input
    , ViewChild
    , ViewEncapsulation
} from '@angular/core';
import { TopCommon } from '../../../../common/top-common/top-common';
import { Modal } from '../../../../common/components/modal/modal';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { DateRangeModel } from './../../../../common/components/input/sui-date';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { PurchaseInputListService } from './purchase-input-list.service';
import { Grid } from '../../../../common/components/grid/grid';

/*
 * 新建采购入库
 * @Author: xiahl 
 * @Date: 2017-12-27 10:06:18 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-04 19:58:01
 */
@Component({
    selector: 'purchase-input-add',
    templateUrl: './purchase-input-add.html',
    styleUrls: ['./purchase-input-add.scss']
})
export class PurchaseInputAddComponent extends TopCommon implements OnInit {
    /** 热键 */
    hotkeys: any = HOTKEYS;
    /** 查询参数 */
    searchParams: any = {
        stockid: -1,
        venderid: -1,
        refsheetid: ''
    }
    /** 下单日期 */
    dateLabels: string = '下单日期';
    dateValue: DateRangeModel;
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    /** 列表分页参数 */
    gridPage: GridPage = {};
    /** 表格实例对象 */
    @ViewChild('purchaseGrid') mygrid: Grid;

    @Input() title: string = "新建采购入库";
    @ViewChild('windowReference') window: Modal;

    constructor(
        private myService: PurchaseInputListService
    ) {
        super();
    }

    ngOnInit() {
        this.initGrid();             
    }

    /**
     * 初始化表格列表
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
            { "text": "单据编号", "datafield": "sheetid", "align": "center", "width": 80, pinned: true },
            { "text": "仓库", "datafield": "ename", "align": "center", "width": 120 },
            { "text": "发生日期", "datafield": "operdate", "align": "center", "width": 100 },
            { "text": "供应商", "datafield": "coename", "align": "center", width: 120 },
            { "text": "采购单号", "datafield": "resheetid", "align": "center", "width": 100 },
            {
                "text": "入库商品", "datafield": "goodsnum", "align": "right", "width": 100, columntype: 'template', aggregates: [{
                    '<b>小计</b>': (aggregatedValue: number, currentValue: number, column: any, record: any): number => {
                        console.log('aggregatedValue, currentValue, column, record ....>=', aggregatedValue, currentValue, column, record)
                        return aggregatedValue;
                    }
                }]
            },
            { "text": "入库金额(元)", "datafield": "purvalue", "align": "right", "width": 80 },
            { "text": "仓管员", "datafield": "manager", "align": "center", "width": 80 },
            { "text": "制单", "datafield": "editor", "align": "center", "width": 200, columntype: 'template' },
            { "text": "状态", "datafield": "status", "align": "center", "width": 80, columntype: 'template' },
            { "text": "操作", "datafield": "tools", "width": 150, columntype: 'tools' }
        ]
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 行插入表格前执行函数
     */
    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.detail = true;
        rowToolState.edit = row.status <= 1;;
        rowToolState.editComplete = row.status == 0;
        rowToolState.check = row.status == 1;
        rowToolState.delete = row.status == 0;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格配置
     */
    private initGrid() {
        this.gridOption.isShowRowNo = false;
        this.gridOption.loadDataInterface = (param) => {
            let bodyParam = {
                pageNum: param.pageNum,
                pageSize: param.pageSize,
                params: this.searchParams
            };
            return this.myService.getList(bodyParam)
        };
        this.gridOption.tools = [
            { name: "detail", label: "详情", placeholder: "详情", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "edit", label: "编辑", placeholder: "编辑", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "editComplete", label: "编辑完成", placeholder: "编辑完成", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "check", label: "审核", placeholder: "审核", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "delete", label: "删除", placeholder: "删除", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
        ];
        this.gridOption.rowBeforeAdd = this.rowBeforeAdd;
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
     * 供应商选择
     */
    selectedSupplier(obj) {
        this.searchParams.venderid = obj.mycode ? obj.mycode : -1;
    }

    /** 查询 */
    doSearch() {
        this.mygrid.load();
    }

    /** 打开弹出框 */
    open() {
        this.window.open();
    }

    /** 关闭弹出框 */
    cancel() {
        this.window.close();
    }

}