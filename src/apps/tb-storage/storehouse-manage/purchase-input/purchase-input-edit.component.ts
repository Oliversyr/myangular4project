import {
    Component
    , OnInit
    , ElementRef
    , ViewEncapsulation
    , ViewChild
} from '@angular/core';
import { BaseEditComponent } from '../../../../common/top-common/base-edit.component';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { PurchaseInputEditService } from './purchase-input-edit.service';
import { TemplateEditOption } from './../../../../common/components/templates/template-edit';
import { ToolBarData, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { GridOption, GridEditOption } from '../../../../common/components/grid/grid-option';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { SuiValidator } from '../../../../common/components/validator/sui-validator';
import { Grid } from '../../../../common/components/grid/grid';

/**
 * 采购入库单详情信息
 */
export interface PurchaseInputInfo {
    /** 单据编号  */
    sheetid: any;
    /** 采购单号 */
    refsheetid: number;
    /** 供应商 */
    vendname: string;
    /** 供应商id */
    venderid: number;
    /** 发生日期 */
    operdate: string;
    /** 仓管员 */
    manager: string;
    /** 备注 */
    notes: string;
    /** 状态  0-编辑中 1-编辑完成 100－已审核 */
    status: number;
    /** 状态名称 */
    statusName: string;
    /** 制单人 */
    editor: string;
    /** 制单时间 */
    editdate: string;
    /** 审核人 */
    checker: string;
    /** 审核时间 */
    checkdate: string;
    /** 采购入库单货明细 */
    items?: Array<any>;
}

/**
 * 录入采购入库单货品信息
 */
export interface PurchaseInputItemInfo {
    goodsid: number;
    qty: number;
    notes: string;
}

/*
 * 采购入库模块——编辑组件
 * @Author: xiahl 
 * @Date: 2017-12-27 17:15:34 
 * @Last Modified by: xiahl
 * @Last Modified time: 2017-12-29 14:13:53
 */

@Component({
    templateUrl: './purchase-input-edit.html',
    styleUrls: ['./purchase-input-edit.scss']
})
export class PurchaseInputEditComponent extends BaseEditComponent implements OnInit {
    /** template-edit配置参数 */
    option: TemplateEditOption = {};
    /** 工具栏 */
    tools: ToolBarButton[];
    /** 额外工具栏 */
    extraBtns: ToolBarButton[];
    /** 工具栏数据 toolBarData */
    toolBarData: ToolBarData;
    /** 基本信息是否展开 */
    expanded: boolean = true;
    /** 模块ID */
    moduleId: number;
    /** 路由参数 */
    routerParam: any;
    /** 页面加载标志 */
    _load: boolean = true;
    /** 采购入库单信息 */
    purchaseInputInfo: PurchaseInputInfo;
    private purchaseInputItemInfo: PurchaseInputItemInfo = {
        goodsid: null,
        qty: null,
        notes: ''
    };
    /** 选中的供应商 */
    mySupplier: object = {};
    /** 选中的商品 */
    myGoods: Array<any> = [];
    /** 表格的表头自定义排序配置信息 */
    sorts: GridSortOption[] = [];
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    gridEditOption: GridEditOption;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 基本信息校验 */
    @ViewChild("el_mainValidator") el_mainValidator: SuiValidator;
    supplierRule: any[] = [
        {
            rule: (jqElement, comnit): boolean => {
                return this.purchaseInputInfo.venderid > -1;
            },
            message: '供应商不允许为空'
        }
    ];
    /** 商品录入信息校验 */
    @ViewChild('goods') goods;
    @ViewChild("el_itemInputValidator") el_itemInputValidator: SuiValidator;
    goodsRule: any[] = [
        {
            rule: (jqElement, comnit): boolean => {
                return Array.isArray(this.myGoods) && this.myGoods.length === 1;
            },
            message: '商品不允许为空'
        }
    ];

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseEditService: BaseEditService,
        private myService: PurchaseInputEditService,
    ) {
        super()
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        let sheetid = this.routerParam.sheetid;
        super.requestConfigBeforePageInit([
            this.myService.getDetail(sheetid)
        ]).subscribe(results => {
            // 1. 判断返回的数据是否正确
            let res = results[0];
            if (res.retCode !== 0) {
                this.myService.modalSer.modalToast(res.message);
                return;
            };
            // 2. 初始化头信息
            let head = res.data.result.head,
                items = res.data.result.items,
                data = Object.assign({}, head, {
                    items: items
                });
            this.initInputParam(data);
            // 3. 动态初始化按钮数据和状态
            this.toolBarData = {
                entity: head,
                primaryKeyFields: ['sheetid']
            };
            let states = {
                'edit': this.purchaseInputInfo.status <= 1,
                'del,editComplete': this.purchaseInputInfo.status == 0,
                'check': this.purchaseInputInfo.status == 1
            };
            this.baseService.setToolBarStates(this.tools, states);
            // 4. 初始化表格数据
            this.mygrid.setData(this.purchaseInputInfo.items);
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initTemplateEditOption();
        this.initToolbar();
        this.initGrid();
        this.initInputParam(Object.create(null));
        this.loadPageInitData();
    }

    /**
     * 主表信息展开更多内容切换
     * @param event 
     */
    mainInfoToggle(event) {
        this.expanded = event.expanded;
    }

    /**
    * 初始化TemplateList 
    * 模板配置项: Option
    * 该模块ID  : moduleId
    */
    private initTemplateEditOption() {
        this.option.tab = this.tab;
        this.moduleId = this.tab.moduleid;
        // 初始化当前页签路由参数
        if (!this.baseService.commonServices.classUtil.isObject(this.tab.routerParam)) {
            this.tab.routerParam = JSON.parse(this.tab.routerParam);
        }
        this.routerParam = this.tab.routerParam;
    }

    /**
     * 初始化表单录入参数
     */
    private initInputParam(data) {
        if (!!this.routerParam.goType && this.routerParam.goType === this.ATTR.L) {
            data.status = 0;
        }
        this.purchaseInputInfo = {
            sheetid: data.sheetid || '自动生成',
            refsheetid: data.refsheetid || '',
            vendname: data.vendname || '',
            venderid: data.venderid || '',
            operdate: data.operdate || new Date(),
            manager: data.manager || '',
            notes: data.notes || '',
            status: 0,
            statusName: '编辑中',
            editor: data.editor || '',
            editdate: data.editdate || '',
            checker: data.checker || '',
            checkdate: data.checkdate || '',
            items: data.items || []
        }
    }

    /**
     * 初始化工具栏
     * 可以设置额外的按钮: extraBtns 
     */
    private initToolbar() {
        let extraBtns: ToolBarButton[] = this.myService.getExtraBtns();
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);
        let states = { 'add,del,editComplete': false };
        this.baseService.setToolBarStates(this.tools, states);
    }

    /**
     * 初始化表格列表
     */
    private initGrid() {
        this.gridOption = {
            gridType: "M",
            tools: this.getTools(),
            rowBeforeAdd: this.rowBeforeAdd,
            columns: [this.getColumnDefs(), this.getColumnGroups(), this.getColumnTpls(), this.getGridValidators()]
        };
        this.gridEditOption = {
            submitServerFields: ["goodsid", "oiqty", "price", "notes"],
            duplicateRowFields: ["goodsid"],
            coverFields: ["oiqty", "price", "notes"],
            cumulateFields: ["oiqty"],
            promptTemplate: "商品[${row.goodsname}]已存在: ${row.oiqty+row.uname}"
        };
        this.sorts = [
            { field: "oiqty", label: "入库数量" },
            { field: "totalValue", label: "入库金额" }
        ];
    }

    private rowBeforeAdd = (row): boolean => {
        row.totalValue = this.baseService.commonServices.classUtil.toNum(row.oiqty * row.price);
        let rowToolState = {
            delItemRow: true
        }
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    private getTools(): ToolBarButton[] {
        return [{
            name: "delItemRow",
            label: "移除"
        }];
    }

    private getColumnDefs() {
        return [
            { "text": "商品内码", "datafield": "goodsid", "columntype": "Number", "width": 80, "editable": false, "pinned": true },
            { "text": "商品名称", "datafield": "goodsname", "width": 120, "editable": false, "pinned": true },
            { "text": "条码", "datafield": "barcode", "align": "center", "width": 100, "editable": false, "pinned": true },
            { "text": "销售规格", "datafield": "spec", "width": 80, "editable": false },
            { "text": "包装单位", "datafield": "uname", "width": 60, "editable": false },
            { "text": "入库数量", "datafield": "oiqty", "columntype": "numberinput", "align": "right", "width": 100 },
            { "text": "入库价格(元)", "datafield": "price", "columntype": "numberinput", "cellsformat": "c2", "align": "right", "editable": false, "width": 100 },
            { "text": "入库金额(元)", "datafield": "totalValue", "columntype": "Number", "cellsformat": "c2", "align": "right", "editable": false, "width": 120 },
            { "text": "备注", "datafield": "notes", "columntype": "textbox", "width": 120 },
            { "text": "操作", "datafield": "tools", "columntype": "tools", "align": "center", "editable": false, "width": 100 }
        ];
    }

    private getColumnGroups() {
        return [];
    }

    private getColumnTpls() {
        return {};
    }

    private getGridValidators() {
        return {};
    }

    /**
     * 页面刷新
     */
    private refresh() {
        this.clearInput();
        this.loadPageInitData();
    }

    /**
     * 供应商选择
     */
    selectedSupplier(obj) {
        this.mySupplier = obj ? obj : {};
        this.purchaseInputInfo.venderid = obj.mycode ? obj.mycode : -1;
        this.purchaseInputInfo.vendname = obj.ename ? obj.ename : '';
    }

    /**
     * 商品选择
     */
    selectedGoods(arr) {
        this.myGoods = arr ? arr : [];
    }

    /**
     * 添加商品
     * @param param 
     * @param event 
     */
    doAddToGrid(param, event) {
        // 1. 校验数据
        if (this.myGoods.length <= 0 || !this.purchaseInputItemInfo.qty) {
            this.myService.modalSer.modalToast("请录入必填信息！");
            return;
        };
        // 2. 执行插入操作
        let _myGoods = this.myGoods[0],
            _newRows = Object.assign({}, _myGoods, {
                oiqty: this.purchaseInputItemInfo.qty,
                price: _myGoods.packprice || 0,
                totalValue: this.purchaseInputItemInfo.qty * (_myGoods.packprice || 0)
            });
        this.mygrid.edit.addRows(_newRows);
        // 3. 清除录入的数据
        this.clearInput();
    }

    /**
     * 清除录入的数据
     */
    private clearInput() {
        this.goods.clearSelection();
        this.purchaseInputItemInfo.qty = null;
        this.purchaseInputItemInfo.notes = '';
        this.focus();
    }

    /**
     * 移除行
     * @param param 
     * @param event 
     */
    doDelItemRow(param, event) {
        if (!param.rowIndexs || param.rowIndexs.length == 0) {
            this.myService.modalSer.modalToast("请选择需要删除的列");
            return;
        }
        this.mygrid.edit.delRows(param.rowIndexs);
    }

    /**
     * 保存
     * @param param 
     * @param event 
     */
    private doSave(param, event) {
        let _param = {
            head: this.purchaseInputInfo,
            items: this.mygrid.edit.getSubmitServerData()
        };
        // 1. 前置判断
        if (this.purchaseInputInfo.status === 100) {
            this.myService.modalSer.modalToast("操作失败: 单据已审核不可操作！");
            return;
        }
        if (_param.items.length <= 0) {
            this.myService.modalSer.modalToast("操作失败: 采购入库单货物明细为空！");
            return;
        }
        // 2. 调用服务
        this.el_mainValidator.pass().subscribe(isPass => {
            let message: string;
            if (isPass) {
                message = "保存成功";
                let _param = {
                    head: this.purchaseInputInfo,
                    items: this.mygrid.edit.getSubmitServerData()
                };
                this.myService.update(_param).subscribe((res) => {
                    super.doBrowse({ entity: _param });
                });
            } else {
                message = "保存失败";
            }
            this.myService.modalSer.modalToast(message);
        })
    }

    /**
     * 重置取消: 取消本次修改还原到修改前
     * @param param 
     * @param event 
     */
    private doReset(param, event) {
        this.refresh();
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
        }, items = this.mygrid.edit.getSubmitServerData() || [];
        // 1. 前置判断
        if (this.purchaseInputInfo.status !== 0) {
            this.myService.modalSer.modalToast("操作失败: 仅在编辑中状态下可以操作！");
            return;
        }
        if (items.length <= 0) {
            this.myService.modalSer.modalToast("操作失败: 采购入库单货物明细为空！");
            return;
        }
        // 2. 调用服务
        this.myService.operate(_param).subscribe((res) => {
            super.doBrowse({ entity: _param });
        });
    }

    /**
     * 删除
     * @param param 
     * @param event 
     */
    protected doDel(param, event) {
        this.baseService.modalService.modalConfirm("您确定要删除该记录?").subscribe((retCode: string): void => {
            this.focus();
            if (retCode != "OK") {
                return;
            };
            // 1. 前置判断
            if (param.entitys && param.entitys[0].status > 0) {
                this.baseService.modalService.modalToast("操作失败: 仅在编辑中状态下可以操作！");
                return;
            };
            // 2. 调用服务进行后续操作
            let _param = {
                optype: 4,
                sheetid: param.entitys[0].sheetid
            };
            this.myService.operate(_param).subscribe((res) => {
                super.doList(_param);
                super.closePage();
            });
        });
    }
}