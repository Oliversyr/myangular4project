import {
    Component
    , OnInit
    , AfterViewInit
    , ElementRef
    , ViewEncapsulation
    , ViewChild
} from '@angular/core';
import { BaseEditComponent } from '../../../../common/top-common/base-edit.component';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { TransferEditService } from './transfer-edit.service';
import { TemplateEditOption } from './../../../../common/components/templates/template-edit';
import { ToolBarData, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { GridOption, GridEditOption } from '../../../../common/components/grid/grid-option';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { SuiValidator } from '../../../../common/components/validator/sui-validator';
import { TansferDirection } from './transfer-list.component';
import { Grid } from '../../../../common/components/grid/grid';

/**
 * 调拨单详情头信息
 */
export interface TransferInfo {
    /** 单据编号 */
    sheetid: any;
    /** 调出仓库 */
    outstockname: string;
    /** 调入仓库 */
    instockname: string;
    /** 单据状态  0-编辑中 1-编辑完成 100－已审核; */
    status: number;
    /** 状态名称 */
    statusName: string;
    /** 调拨状态 0-调拨待出库 1-调拨已出库 2-调拨已入库*/
    flag: number;
    /** 调出人 */
    outchecker: string;
    /** 调出时间 */
    outcheckdate: string;
    /** 调入人 */
    inchecker: string;
    /** 调入时间 */
    incheckdate: string;
    /** 制单人 */
    editor: string;
    /** 制单时间 */
    editdate: string;
    /** 审核人 */
    checker: string;
    /** 审核时间 */
    checkdate: string;
    /** 备注  */
    notes: string;
    /** 调拨单货明细  */
    items?: Array<any>;
}

/**
 * 录入调拨单货品信息
 */
export interface TransferItemInfo {
    goodsid: number;
    qty: number;
    notes?: string;
}

/*
 * 调拨单模块——编辑组件
 * @Author: xiahl 
 * @Date: 2017-12-27 17:15:34 
 * @Last Modified by: xiahl
 * @Last Modified time: 2017-12-29 14:13:53
 */
@Component({
    templateUrl: './transfer-edit.html',
    styleUrls: ['./transfer-edit.scss']
})
export class TransferEditComponent extends BaseEditComponent implements OnInit {
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
    /** 调拨单单信息 */
    transferInfo: TransferInfo;
    transferItemInfo: TransferItemInfo = {
        goodsid: null,
        qty: null
    };
    /** 调拨指令：调出 1; 调入 2; */
    transferDirectives: number = 0;
    /** 选中的商品 */
    myGoods: Array<any> = [];
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    gridEditOption: GridEditOption;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 基本信息校验 */
    @ViewChild("el_mainValidator") el_mainValidator: SuiValidator;
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
        private myService: TransferEditService,
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
                'edit': this.transferInfo.status <= 1,
                'del,editComplete': this.transferInfo.status == 0,
                'check': this.transferInfo.status == 1
            };
            this.baseService.setToolBarStates(this.tools, states);
            // 4. 初始化表格数据
            this.mygrid.setData(this.transferInfo.items);
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
        // 初始化调拨指令参数
        if (!!this.routerParam.transferDirectives) {
            this.transferDirectives = this.routerParam.transferDirectives;
        }
    }

    /**
     * 初始化表单录入参数
     */
    private initInputParam(data) {
        if (!!this.routerParam.goType && this.routerParam.goType === this.ATTR.L) {
            data.status = 0;
        }
        this.transferInfo = {
            sheetid: data.sheetid || '自动生成',
            outstockname: data.outstockname || '',
            instockname: data.instockname || '',
            status: data.status || 0,
            statusName: data.status === 0 ? "编辑中" : data.status === 1 ? "编辑完成" : data.status === 100 ? "已审核" : "",
            flag: data.flag || 0,
            outchecker: data.outchecker || '',
            outcheckdate: data.outcheckdate || '',
            inchecker: data.inchecker || '',
            incheckdate: data.incheckdate || '',
            editor: data.editor || '',
            editdate: data.editdate || '',
            checker: data.checker || '',
            checkdate: data.checkdate || '',
            notes: data.notes || '',
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
        let states = { 'add,del,editComplete': false, };
        this.baseService.setToolBarStates(this.tools, states);
    }

    /**
     * 初始化表格列表
     */
    private initGrid() {
        this.gridOption = {
            gridType: "M",
            isEdit: true,
            tools: this.getTools(),
            rowBeforeAdd: this.rowBeforeAdd,
            columns: [this.getColumnDefs(), this.getColumnGroups(), this.getColumnTpls(), this.getGridValidators()]
        };
        this.gridEditOption = {
            submitServerFields: ["goodsid", "qty", "outqty", "inqty"],
            duplicateRowFields: ["goodsid"],
            coverFields: ["qty", "outqty", "inqty"],
            cumulateFields: ["qty", "outqty", "inqty"],
            promptTemplate: "商品[${row.goodsname}]已存在: ${row.qty+row.uname}"

        };
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
            { "text": "条码", "datafield": "barcode", "align": "center", "width": 100, "editable": false },
            { "text": "销售规格", "datafield": "spec", "width": 80, "editable": false },
            { "text": "包装单位", "datafield": "uname", "width": 60, "editable": false },
            { "text": "调拨数量", "datafield": "qty", "columntype": "numberinput", "align": "right", "width": 100, "editable": this.transferDirectives === 0 },
            { "text": "当前库存", "datafield": "accqty", "align": "right", "editable": false, "width": 100 },
            { "text": "调出数量", "datafield": "outqty", "columntype": "numberinput", "align": "right", "width": 100, "editable": this.transferDirectives === 1 },
            { "text": "调入数量", "datafield": "inqty", "columntype": "numberinput", "align": "right", "width": 100, "editable": this.transferDirectives === 2 },
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
        return {
            qty: (cell, value) => {
                let rowData = this.mygrid.selection.getAllRows()[cell.row];
                if (value > rowData.accqty) {
                    this.baseService.modalService.modalConfirm(`仓库库存不足，是否确认调拨${value}包？`).subscribe((retCode: string): any => {
                        this.focus();
                        if (retCode != "OK") {
                            // rowData.qty = cell.value;
                            // this.mygrid.edit.updateRows(rowData);
                        };
                    });
                    // return {
                    //     results: false,
                    //     message: "仓库库存不足！"
                    // };
                }
                return true;
            },
            outqty: (cell, value) => {
                let rowData = this.mygrid.selection.getAllRows()[cell.row];
                if (value > rowData.qty) {
                    // rowData.outqty = cell.value;
                    // this.mygrid.edit.updateRows(rowData);
                    return {
                        results: false,
                        message: "调出数量不能大于调拨数量！"
                    };
                }
                if (value > rowData.accqty) {
                    this.baseService.modalService.modalConfirm(`仓库库存不足，是否确认调出${value}包？`).subscribe((retCode: string): any => {
                        this.focus();
                        if (retCode != "OK") {
                            // rowData.qty = cell.value;
                            // this.mygrid.edit.updateRows(rowData);
                            return {
                                results: false,
                                message: "仓库库存不足！"
                            };
                        };
                    });
                }
                return true;
            },
            inqty: (cell, value) => {
                let rowData = this.mygrid.selection.getAllRows()[cell.row];
                if (value > rowData.outqty) {
                    // rowData.inqty = cell.value;
                    // this.mygrid.edit.updateRows(rowData);
                    return {
                        results: false,
                        message: "调入数量不能大于调出数量！"
                    }
                }
                return true;
            }
        };
    }

    /**
     * 页面刷新
     */
    private refresh() {
        this.clearInput();
        this.loadPageInitData();
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
        if (this.myGoods.length <= 0 || !this.transferItemInfo.qty) {
            this.myService.modalSer.modalToast("请录入必填信息！");
            return;
        };
        // 2. 执行插入操作
        let _myGoods = this.myGoods[0],
            _newRows = Object.assign({}, _myGoods, {
                qty: this.transferItemInfo.qty
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
        this.transferItemInfo.qty = null;
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
            sheetid: this.transferInfo.sheetid,
            notes: this.transferInfo.notes,
            items: this.mygrid.edit.getSubmitServerData()
        };
        // 1. 前置判断
        if (this.transferInfo.flag === 2) {
            this.myService.modalSer.modalToast("操作失败: 调拨已入库不可操作！");
            return;
        }
        if (_param.items.length <= 0) {
            this.myService.modalSer.modalToast("操作失败: 调拨单货物明细为空！");
            return;
        }
        // 2. 调用服务
        this.el_mainValidator.pass().subscribe(isPass => {
            let message: string;
            if (isPass) {
                message = "保存成功";
                this.myService.update(_param).subscribe((res) => {
                    if (this.transferDirectives === 0) {
                        super.doBrowse({ entity: _param });
                    } else {
                        this.loadPageInitData();
                    }
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
            status: 1,
            sheetid: param.entitys[0].sheetid
        }, items = this.mygrid.edit.getSubmitServerData() || [];
        // 1. 前置判断
        if (this.transferInfo.status !== 0) {
            this.myService.modalSer.modalToast("操作失败: 仅在编辑中状态下可以操作！");
            return;
        }
        if (items.length <= 0) {
            this.myService.modalSer.modalToast("操作失败: 调拨单货物明细为空！");
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
                optype: 1,
                status: 4,
                sheetid: param.entitys[0].sheetid
            };
            this.myService.operate(_param).subscribe((res) => {
                super.doList(_param);
                super.closePage();
            });
        });
    }

    /**
     * 调拨出入库操作
     * @param type 调出、调入指令
     */
    doTransferDirection(type) {
        let param = {
            entity: this.transferInfo,
            transferDirectives: type
        };
        if (type === TansferDirection.Out) {
            if (this.transferInfo.status !== 100 || this.transferInfo.flag !== 0) {
                this.myService.modalSer.modalToast('单据状态为已审核，调拨状态为调拨待出库时可操作！');
                return;
            }
            this.doTransfer({
                type: type,
                optype: 2,
                msg: '调拨出库后将不能修改调出数量，是否确认？'
            })
        } else {
            if (this.transferInfo.status !== 100 || this.transferInfo.flag !== 1) {
                this.myService.modalSer.modalToast('单据状态为已审核，调拨状态为调拨已出库时可操作！');
                return;
            }
            this.doTransfer({
                type: type,
                optype: 3,
                msg: '调拨入库后将不能修改调入数量，是否确认？'
            })
        };
        // this.goToPage(this.ATTR.M, param, this.tab.moduleid);
    }

    doTransfer(params) {
        let param = {
            entity: this.transferInfo,
            deliveryDirectives: params.type
        };
        this.baseService.modalService.modalConfirm(params.msg).subscribe((retCode: string): void => {
            this.focus();
            if (retCode != "OK") {
                return;
            };
            let _param = {
                optype: params.optype,
                status: param.entity.status || 100,
                sheetid: param.entity.sheetid
            };
            this.myService.operate(_param).subscribe((res) => {
                super.doList(_param);
                super.closePage();
            });
        });
    }
}