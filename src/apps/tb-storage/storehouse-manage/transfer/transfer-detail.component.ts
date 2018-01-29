import {
    Component
    , OnInit
    , ElementRef
    , ViewEncapsulation
    , ViewChild
} from '@angular/core';
import { BaseDetailComponent } from '../../../../common/top-common/base-detail.component';
import { BaseDetailService } from '../../../../common/top-common/base-detail.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { TransferDetailService } from './transfer-detail.service';
import { TemplateDetailOption } from './../../../../common/components/templates/template-detail';
import { ToolBarData, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { GridOption, GridEditOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { TransferInfo } from './transfer-edit.component';
import { TansferDirection } from './transfer-list.component';
import { Grid } from '../../../../common/components/grid/grid';
import { PreviousNextOption } from './../../../../common/components/previous-next/previousNextOption';
import { Observable } from 'rxjs/Observable';

/*
 * 调拨单模块——详情组件
 * @Author: xiahl 
 * @Date: 2017-12-27 17:10:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-24 10:32:37
 */
@Component({
    templateUrl: './transfer-detail.html',
    styleUrls: ['./transfer-detail.scss']
})
export class TransferDetailComponent extends BaseDetailComponent implements OnInit {
    /** template-edit配置参数 */
    option: TemplateDetailOption = {};
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
    /** 表格配置信息 */
    gridOption: GridOption<any>;
    page: GridPage;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    /** 调拨单信息 */
    transferInfo: TransferInfo;
    /** 上一单，下一单配置 */
    preNextOption: PreviousNextOption<any>;
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;
    /** 新建采购入库单弹出框实例对象 */
    @ViewChild('el_winChooseTransfer') el_winChooseTransfer;

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseDetailService: BaseDetailService,
        private myService: TransferDetailService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        let sheetid = this.routerParam.entity.sheetid;
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
        console.log('TransferDetail Components Init >>>>>>>>', 'ngOnInit');
        super.ngOnInit();
        this.initTemplateDetailOption();
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
    private initTemplateDetailOption() {
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
        this.preNextOption = {
            currentSheet: this.routerParam.entity.sheetid,
            keyWord: 'sheetid',
            searchParams: this.routerParam.entity.searchParams,
            loadDataInterface: (param) => {
                let bodyParam = {
                    pageNum: param.pageNum,
                    pageSize: param.pageSize,
                    params: param.params
                };
                return this.myService.getList(bodyParam)
            },
            refreshDetailFn: (param) => {
                return this.refreshData(param.sheetid)
            }
        };
        let extraBtns: ToolBarButton[] = this.myService.getExtraBtns();
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);
        let states = {
            'add,copy,cancel': false
        };
        this.baseService.setToolBarStates(this.tools, states);
    }

    /**
     * 更新页面数据
     */
    refreshData(sheetid) {
        return new Observable<any>((observable) => {
            this.myService.getDetail(sheetid).subscribe((res) => {
                if (res.retCode === 0) {
                    // 1. 初始化头信息
                    let head = res.data.result.head,
                        items = res.data.result.items,
                        data = Object.assign({}, head, {
                            items: items
                        });
                    this.initInputParam(data);
                    this.toolBarData = {
                        entity: head,
                        primaryKeyFields: ['sheetid']
                    };
                    let states = {
                        'edit,del,check,editComplete': this.transferInfo.status < 100
                    };
                    this.baseService.setToolBarStates(this.tools, states);
                    // 2. 初始化表格数据
                    this.mygrid.setData(this.transferInfo.items);
                    observable.next(true);
                } else {
                    this.baseService.modalService.modalToast(res.message);
                }
                observable.complete();
            })
        })
    }

    /**
     * 初始化表格列表
     */
    private initGrid() {
        this.gridOption = {
            gridType: "B",
            tools: this.getTools(),
            rowBeforeAdd: this.rowBeforeAdd,
            columns: [this.getColumnDefs(), this.getColumnGroups(), this.getColumnTpls(), this.getGridValidators()]
        };
        this.page = {
            pageable: false,
            isServerPage: false
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
            { "text": "条码", "datafield": "barcode", "align": "center", "width": 100, "editable": false, "pinned": true },
            { "text": "销售规格", "datafield": "spec", "width": 80, "editable": false },
            { "text": "包装单位", "datafield": "uname", "width": 60, "editable": false },
            { "text": "调拨数量", "datafield": "qty", "align": "right", "editable": false, "width": 100 },
            { "text": "当前库存", "datafield": "accqty", "align": "right", "editable": false, "width": 100 },
            { "text": "调出数量", "datafield": "outqty", "align": "right", "editable": false, "width": 100 },
            { "text": "调入数量", "datafield": "inqty", "align": "right", "editable": false, "width": 100 },
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
        this.loadPageInitData();
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
     * 编辑
     * @param param 
     * @param originalEvent 
     */
    protected doEdit(param, originalEvent?) {
        // 1. 前置判断
        if (this.transferInfo && this.transferInfo.status > 1) {
            this.baseService.modalService.modalToast("操作失败: 仅在编辑中或编辑完成状态下可以操作！");
            return;
        };
        // 2. 进入编辑模式
        let _param = {
            sheetid: this.transferInfo.sheetid
        }
        this.goToPage(this.ATTR.M, _param, this.tab.moduleid);
    }

    /**
     * 编辑完成
     * @param param 
     * @param event 
     */
    private doEditComplete(param, event) {
        let _param = Object.assign({}, param, {
            entity: this.transferInfo
        })
        // 1. 前置判断
        if (_param.entity && _param.entity.status > 0) {
            this.baseService.modalService.modalToast("操作失败: 仅在编辑中状态下可以操作！");
            return;
        };
        // 2. 调用服务进行后续操作
        let _operateParam = {
            optype: 1,
            status: 1,
            sheetid: _param.entity.sheetid
        };
        this.myService.operate(_operateParam).subscribe((res) => {
            this.refresh();
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
                this.refresh();
            });
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
            sheetid: this.transferInfo.sheetid,
            transferDirectives: type
        };
        if (type === TansferDirection.Out) {
            if (this.transferInfo.status !== 100 || this.transferInfo.flag !== 0) {
                this.myService.modalSer.modalToast('单据状态为已审核，调拨状态为调拨待出库时可操作！');
                return;
            }
        } else {
            if (this.transferInfo.status !== 100 || this.transferInfo.flag !== 1) {
                this.myService.modalSer.modalToast('单据状态为已审核，调拨状态为调拨已出库时可操作！');
                return;
            }
        };
        this.goToPage(this.ATTR.M, param, this.tab.moduleid);
    }
}