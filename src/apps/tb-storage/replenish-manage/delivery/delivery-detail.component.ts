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
import { DeliveryDetailService } from './delivery-detail.service';
import { TemplateDetailOption } from './../../../../common/components/templates/template-detail';
import { ToolBarData, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { GridOption, GridEditOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { DeliveryInfo } from './delivery-edit.component';
import { Grid } from '../../../../common/components/grid/grid';
import { SuiRouterService } from '../../../../common/directives/router/sui-router.sevice';

/*
 * 配送单模块——详情组件
 * @Author: xiahl 
 * @Date: 2017-12-27 17:10:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-22 16:44:21
 */
@Component({
    templateUrl: './delivery-detail.html',
    styleUrls: ['./delivery-detail.scss']
})
export class DeliveryDetailComponent extends BaseDetailComponent implements OnInit {
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
    /** 配送单信息 */
    deliveryInfo: DeliveryInfo;
    /** 表格配置信息 */
    gridOption: GridOption<any>;
    page: GridPage;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseDetailService: BaseDetailService,
        private suiRouter: SuiRouterService,
        private myService: DeliveryDetailService,
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
                'edit': this.deliveryInfo.status <= 1,
                'del,editComplete': this.deliveryInfo.status == 0,
                'check': this.deliveryInfo.status == 1
            };
            this.baseService.setToolBarStates(this.tools, states);
            // 4. 初始化表格数据
            this.mygrid.setData(this.deliveryInfo.items);
        });
    }

    ngOnInit() {
        console.log('DeliveryDetail Components Init >>>>>>>>', 'ngOnInit');
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
     * 初始化表单录入参数
     */
    private initInputParam(data) {
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
     * 初始化工具栏
     * 可以设置额外的按钮: extraBtns 
     */
    private initToolbar() {
        let extraBtns: ToolBarButton[] = this.myService.getExtraBtns();
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);
        let states = { 'add,del,copy,cancel': false };
        this.baseService.setToolBarStates(this.tools, states);
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
            { "text": "配送数量", "datafield": "qty", "align": "right", "editable": false, "width": 100 },
            { "text": "当前库存", "datafield": "accqty", "align": "right", "editable": false, "width": 100 },
            { "text": "出库数量", "datafield": "outqty", "align": "right", "editable": false, "width": 100 },
            { "text": "到店数量", "datafield": "toqty", "align": "right", "editable": false, "width": 100 },
            { "text": "收货数量", "datafield": "recvqty", "align": "right", "editable": false, "width": 100 }
        ]
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
     * 编辑
     * @param param 
     * @param originalEvent 
     */
    protected doEdit(param, originalEvent?) {
        // 1. 前置判断
        if (this.deliveryInfo && this.deliveryInfo.status > 1) {
            this.baseService.modalService.modalToast("操作失败: 仅在编辑中或编辑完成状态下可以操作！");
            return;
        };
        // 2. 进入编辑模式
        let _param = {
            sheetid: this.deliveryInfo.sheetid
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
            entity: this.deliveryInfo
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
     * 配送出入库操作
     * @param type 配送指令
     */
    doDeliveryDirection(type) {
        let param = {
            sheetid: this.deliveryInfo.sheetid,
            deliveryDirectives: type
        };
        if (type === 1 && (this.deliveryInfo.status !== 100 || this.deliveryInfo.delvstatus !== 0)) {
            this.myService.modalSer.modalToast('单据状态为已审核，配送状态为配送待出库时可操作！');
            return;
        }
        if (type === 2 && (this.deliveryInfo.status !== 100 || this.deliveryInfo.delvstatus !== 1)) {
            this.myService.modalSer.modalToast('单据状态为已审核，配送状态为配送已出库时可操作！');
            return;
        }
        if (type === 3 && (this.deliveryInfo.status !== 100 || this.deliveryInfo.delvstatus !== 2)) {
            this.myService.modalSer.modalToast('单据状态为已审核，配送状态为到店已确认时可操作！');
            return;
        }
        this.goToPage(this.ATTR.M, param, this.tab.moduleid);
    }

}