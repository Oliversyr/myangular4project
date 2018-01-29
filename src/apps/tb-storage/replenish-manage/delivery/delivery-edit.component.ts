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
import { DeliveryEditService } from './delivery-edit.service';
import { TemplateEditOption } from './../../../../common/components/templates/template-edit';
import { ToolBarData, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { GridOption, GridEditOption } from '../../../../common/components/grid/grid-option';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { Grid } from '../../../../common/components/grid/grid';
import { SuiValidator } from '../../../../common/components/validator/sui-validator';

/**
 * 配送单详情头信息
 */
export interface DeliveryInfo {
    /** 单据编号 */
    sheetid?: any;
    /** 上级机构+店铺名称 */
    fullname?: string;
    /** 仓库上级机构+仓库名称 */
    stockname?: string;
    /** 商品品种数 */
    goodsnum?: number;
    /** 申请人 */
    editor?: string;
    /** 申请时间 */
    editdate?: string;
    /** 审核人 */
    checker?: string;
    /** 审核时间 */
    checkdate?: string;
    /** 状态 0-编辑中 1-编辑完成 2-审核未通过 100－已审核 */
    status?: number;
    statusName?: string;
    /** 配送状态 0-配送待出库 1-配送已出库 2-到店已确认 3-收货已确认 */
    delvstatus?: number;
    delvstatusName?: string;
    /** 到店备注 */
    tonotes: string;
    /** 收货备注 */
    recvnotes: string;
    /** 出库人 */
    outchecker?: string;
    /** 配送出库时间 */
    outcheckdate?: string;
    /** 配送人 */
    delvchecker?: string;
    /** 到店确认时间 */
    delvcheckdate?: string;
    /** 收货人 */
    receiver?: string;
    /** 收货确认时间 */
    recvcheckdate?: string;
    /** 调拨单货明细 */
    items?: Array<object>;
}

/**
 * 录入配送单货品信息
 */
export interface DeliveryItemInfo {
    goodsid: number;
    qty: number;
    notes: string;
}

/*
 * 配送单模块——编辑组件
 * @Author: xiahl 
 * @Date: 2017-12-27 17:15:34 
 * @Last Modified by: xiahl
 * @Last Modified time: 2017-12-29 14:13:53
 */
@Component({
    templateUrl: './delivery-edit.html',
    styleUrls: ['./delivery-edit.scss']
})
export class DeliveryEditComponent extends BaseEditComponent implements OnInit {
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
    /** 配送单信息 */
    deliveryInfo: DeliveryInfo;
    deliveryItemInfo: DeliveryItemInfo = {
        goodsid: null,
        qty: null,
        notes: ''
    };
    /** 配送指令：配送出库 1; 到店确认 2; 收货盘点 3; */
    deliveryDirectives: number = 0;
    /** 表格配置信息 */
    gridOption: GridOption<any> = {};
    gridEditOption: GridEditOption;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 选中的供应商 */
    mySupplier: any = {};
    /** 选中的商品 */
    myGoods: Array<any> = [];
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
        private myService: DeliveryEditService,
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
                'edit': this.deliveryInfo.status <= 1,
                'del,editComplete': this.deliveryInfo.status == 0,
                'check': this.deliveryInfo.status == 1,
                'save': this.deliveryInfo.delvstatus !== 3
            };
            this.baseService.setToolBarStates(this.tools, states);
            // 4. 初始化表格数据
            this.mygrid.setData(this.deliveryInfo.items);
        });
    }

    ngOnInit() {
        console.log('DeliveryEdit Components Init >>>>>>>>', 'ngOnInit');
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
     * 初始化表单录入参数
     */
    private initInputParam(data) {
        if (!!this.routerParam.goType && this.routerParam.goType === this.ATTR.L) {
            data.status = 0;
        }
        this.deliveryInfo = {
            sheetid: data.sheetid || '自动生成',
            fullname: data.fullname || '',
            stockname: data.stockname || '',
            status: data.status || 0,
            statusName: data.status === 0 ? "编辑中" : data.status === 1 ? "编辑完成" : data.status === 2 ? "审核未通过" : data.status === 100 ? "已审核" : "",
            delvstatus: data.delvstatus || 0,
            delvstatusName: data.delvstatus === 0 ? "配送待出库" : data.delvstatus === 1 ? "配送已出库" : data.delvstatus === 2 ? "到店已确认" : data.delvstatus === 3 ? "收货已确认" : "",
            outchecker: data.outchecker || '',
            outcheckdate: data.outcheckdate || '',
            delvchecker: data.delvchecker || '',
            delvcheckdate: data.delvcheckdate || '',
            receiver: data.receiver || '',
            recvcheckdate: data.recvcheckdate || '',
            tonotes: data.tonotes || '',
            recvnotes: data.recvnotes || '',
            editor: data.editor || '',
            editdate: data.editdate || '',
            checker: data.checker || '',
            checkdate: data.checkdate || '',
            items: data.items || []
        }
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
        // 初始化配送指令参数
        if (!!this.routerParam.deliveryDirectives) {
            this.deliveryDirectives = this.routerParam.deliveryDirectives;
        }
    }

    /**
     * 初始化工具栏
     * 可以设置额外的按钮: extraBtns 
     */
    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.extraBtns);
        let states = { 'add,copy,cancel': false };
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
            submitServerFields: ["goodsid", "qty", "outqty", "toqty", "recvqty"],
            duplicateRowFields: ["goodsid", "qty", "outqty", "toqty", "recvqty"],
            coverFields: ["qty", "outqty", "toqty", "recvqty"],
            cumulateFields: ["qty", "outqty", "toqty", "recvqty"],
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
            { "text": "配送数量", "datafield": "qty", "align": "right", "editable": this.deliveryDirectives === 0, "width": 100 },
            { "text": "当前库存", "datafield": "accqty", "align": "right", "editable": false, "width": 100 },
            { "text": "出库数量", "datafield": "outqty", "align": "right", "editable": this.deliveryDirectives === 1, "width": 100 },
            { "text": "到店数量", "datafield": "toqty", "align": "right", "editable": this.deliveryDirectives === 2, "width": 100 },
            { "text": "收货数量", "datafield": "recvqty", "align": "right", "editable": this.deliveryDirectives === 3, "width": 100 },
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
                    this.baseService.modalService.modalConfirm(`仓库库存不足，是否确认配送${value}包？`).subscribe((retCode: string): any => {
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
                        message: "出库数量不能大于配送数量！"
                    };
                }
                if (value > rowData.accqty) {
                    this.baseService.modalService.modalConfirm(`仓库库存不足，是否确认出库${value}包？`).subscribe((retCode: string): any => {
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
            toqty: (cell, value) => {
                let rowData = this.mygrid.selection.getAllRows()[cell.row];
                if (value > rowData.outqty) {
                    // rowData.toqty = cell.value;
                    // this.mygrid.edit.updateRows(rowData);
                    return {
                        results: false,
                        message: "到店数量不能大于出库数量！"
                    }
                }
                return true;
            },
            recvqty: (cell, value) => {
                let rowData = this.mygrid.selection.getAllRows()[cell.row];
                if (value > rowData.outqty) {
                    // rowData.recvqty = cell.value;
                    // this.mygrid.edit.updateRows(rowData);
                    return {
                        results: false,
                        message: "收货数量不能大于出库数量！"
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
        if (this.myGoods.length <= 0 || !this.deliveryItemInfo.qty) {
            this.myService.modalSer.modalToast("操作失败: 请录入必填信息！");
            return;
        };
        // 2. 执行插入操作
        let _myGoods = this.myGoods[0],
            _newRows = Object.assign({}, _myGoods, {
                qty: this.deliveryItemInfo.qty
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
        this.deliveryItemInfo.qty = null;
        this.focus();
    }

    /**
     * 移除行
     * @param param 
     * @param event 
     */
    doDelItemRow(param, event) {
        if (!param.rowIndexs || param.rowIndexs.length == 0) {
            this.myService.modalSer.modalToast("操作失败: 请选择需要删除的列");
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
            tonotes: this.deliveryInfo.tonotes || '',
            recvnotes: this.deliveryInfo.recvnotes || '',
            sheetid: this.deliveryInfo.sheetid,
            items: this.mygrid.edit.getSubmitServerData() || []
        };
        // 1. 前置判断
        if (this.deliveryInfo.delvstatus === 3) {
            this.myService.modalSer.modalToast("操作失败: 收货已确认不可操作！");
            return;
        }
        if (_param.items.length <= 0) {
            this.myService.modalSer.modalToast("操作失败: 配送单货物明细为空！");
            return;
        }
        // 2. 调用服务  
        this.el_mainValidator.pass().subscribe(isPass => {
            let message: string;
            if (isPass) {
                message = "保存成功";
                this.myService.update(_param).subscribe((res) => {
                    if (this.deliveryDirectives === 0) {
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
        if (this.deliveryInfo.status !== 0) {
            this.myService.modalSer.modalToast("操作失败: 仅在编辑中状态下可以操作！");
            return;
        }
        if (items.length <= 0) {
            this.myService.modalSer.modalToast("操作失败: 配送单货物明细为空！");
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
     * 单元格编辑
     * @param event 
     */
    cellEndEditEvent(event: any): void {
        let args: any = event.args,
            datafield: string = args.datafield,
            newvalue: number = args.value,
            oldvalue: number = args.oldvalue,
            row: any = args.row,
            rowindex: number = args.rowindex,
            boundrows = this.mygrid.getboundrows()[rowindex];
        // 调整 配送数量
        if (['qty'].indexOf(datafield) != -1) {
            if (newvalue > row.accqty) {
                this.baseService.modalService.modalConfirm(`仓库库存不足，是否确认配送${newvalue}包？`).subscribe((retCode: string): void => {
                    this.focus();
                    if (retCode != "OK") {
                        boundrows.qty = oldvalue;
                        this.mygrid.edit.updateRows(boundrows);
                        return;
                    };
                });
            }
        }
        // 调整 出库数量
        if (['outqty'].indexOf(datafield) != -1) {
            if (newvalue > row.qty) {
                this.myService.modalSer.modalToast('出库数量不能大于配送数量！');
                boundrows.outqty = oldvalue;
                this.mygrid.edit.updateRows(boundrows);
                return;
            }
            if (newvalue > row.accqty) {
                this.baseService.modalService.modalConfirm(`仓库库存不足，是否确认出库${newvalue}包？`).subscribe((retCode: string): void => {
                    this.focus();
                    if (retCode != "OK") {
                        boundrows.outqty = oldvalue;
                        this.mygrid.edit.updateRows(boundrows);
                        return;
                    };
                });
            }
        }
        // 调整 到店数量
        if (['toqty'].indexOf(datafield) != -1) {
            if (newvalue > row.outqty) {
                this.myService.modalSer.modalToast('到店数量不能大于出库数量！');
                boundrows.inqty = oldvalue;
                this.mygrid.edit.updateRows(boundrows);
                return;
            }
        }
        // 调整 收货数量
        if (['recvqty'].indexOf(datafield) != -1) {
            if (newvalue > row.outqty) {
                this.myService.modalSer.modalToast('收货数量不能大于出库数量！');
                boundrows.inqty = oldvalue;
                this.mygrid.edit.updateRows(boundrows);
                return;
            }
        }
    }

    /**
     * 配送出入库操作
     * @param type 配送指令
     */
    doDeliveryDirection(type) {
        let param = {
            entity: this.deliveryInfo,
            deliveryDirectives: type
        };
        if (type === 1) {
            if (this.deliveryInfo.status !== 100 || this.deliveryInfo.delvstatus !== 0) {
                this.myService.modalSer.modalToast('单据状态为已审核，配送状态为配送待出库时可操作！');
                return;
            }
            this.doDelivery({
                type: type,
                optype: 2,
                msg: '配送出库后将不能修改出库数量，是否确认？'
            })
        }
        if (type === 2) {
            if (this.deliveryInfo.status !== 100 || this.deliveryInfo.delvstatus !== 1) {
                this.myService.modalSer.modalToast('单据状态为已审核，配送状态为配送已出库时可操作！');
                return;
            }
            this.doDelivery({
                type: type,
                optype: 3,
                msg: '到店确认后将不能修改到店数量，是否确认？'
            })
        }
        if (type === 3) {
            if (this.deliveryInfo.status !== 100 || this.deliveryInfo.delvstatus !== 2) {
                this.myService.modalSer.modalToast('单据状态为已审核，配送状态为到店已确认时可操作！');
                return;
            }
            this.doDelivery({
                type: type,
                optype: 4,
                msg: '收货确认后将不能修改收货数量，是否确认？'
            })
        }

        // this.goToPage(this.ATTR.M, param, this.tab.moduleid);
    }

    doDelivery(params) {
        let param = {
            entity: this.deliveryInfo,
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