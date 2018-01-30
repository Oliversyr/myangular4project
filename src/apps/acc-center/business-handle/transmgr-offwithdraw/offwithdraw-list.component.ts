import { BaseService } from '../../../../common/top-common/base.service';
import { NgModule, Component, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { OffwithdrawListService } from './offwithdraw-list.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { Grid } from '../../../../common/components/grid/grid';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { DateRangeModel } from './../../../../common/components/input/sui-date';
import { SelectItem } from './../../../../common/components/entitys/selectitem';

/**
 * 搜索参数
 */
interface SearchParams {
    querydatetype?: string | number;
    bdate?: string | Date;
    edate?: string | Date;
    checkstatus: number;
    acctno: string;
    querykey: string;
    sorttype: string;
    sortby: string;
}

/**
 * 账户列表模块
 * @Created by: lizw
 * @Created Date: 2018-01-24
 */
@Component({
    templateUrl: './offwithdraw-list.html',
    styleUrls: ['./offwithdraw-list.scss']
})

export class OffwithdrawListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
    /**
     * 客户默认值
     */
    defSelectedItem: any = {};
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    /**
     * 表格的表头自定义排序配置信息
     */
    sorts: GridSortOption[] = [];
    /**
     * 提现配置
     */
    offwithdrawCfginfo: any = {};
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];
    /**
     *  日期类型
     * */
    dateLabels: SelectItem<string>[];
    dateValue: DateRangeModel;
    /**
     *  状态类型
     * */
    checkstatus: SelectItem<number>[];
    /**
     * 客户自动补全选择框
     */
    @ViewChild('customerSelect') customerSelect;
    /**
     * 表格
     */
    @ViewChild('grid') mygrid: Grid;
    /** 转账弹出框 */
    @ViewChild('el_winOffwithdrawAdd') el_winOffwithdrawAdd;
    // onStart(param) { };
    constructor(private baseService: BaseService, private myService: OffwithdrawListService, private modalService: ModalService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initToolbar();
        this.getOffwithdrawCfginfo();
        this.option = {
            isMoreSearch: false,
            tab: this.tab
        };

    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    /**
     * 查询并设置提现配置
     */
    private getOffwithdrawCfginfo() {
        this.myService.getOffwithdrawCfginfo().subscribe((res) => {
            this.offwithdrawCfginfo = res;
        });
    }

    /**
     * 顶部操作按钮设置
     */
    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, []);
        const toolBarStatus = { 'copy,forbid,del,cancel,import,check,restart': false };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.dateLabels = [
            { value: 'createtime', label: '创建时间' },
            { value: 'checktime', label: '审核时间' }
        ];
        this.checkstatus = [
            { value: -1, label: '全部' },
            { value: 0, label: '待审核' },
            { value: 1, label: '已审核' }
        ];
        const toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.dateValue = {
            leftValue: 'createtime',
            beginDate: toDateStr,
            endDate: toDateStr
        };
        this.searchParams = {
            querydatetype: 'createtime',
            bdate: toDateStr,
            edate: toDateStr,
            checkstatus: -1,
            acctno: '',
            querykey: '',
            sorttype: 'DESC',
            sortby: 'createtime'
        };
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.sorts = [
            { field: 'amount', label: '提现金额' }
        ];
        this.gridOption = {
            selectionMode: 'checkbox',
            isShowRowNo: true,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, []),
            primaryKeyFields: ['sheetid', 'acctno', 'acctid', 'name', 'subacctid', 'amount', 'paymentno', 'notes']
        };
        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            if (this.dateValue.beginDate) { this.searchParams.bdate = this.dateValue.beginDate }
            if (this.dateValue.endDate) { this.searchParams.edate = this.dateValue.endDate }
            this.searchParams.querydatetype = this.dateValue.leftValue;
            if (param.orderDirect) { this.searchParams.sorttype = param.orderDirect }
            this.searchParams.sorttype = param.orderDirect ? param.orderDirect : 'DESC';
            this.searchParams.sortby = param.orderField && param.orderField !== 'DEFAULT' ? param.orderField : 'createtime';
            return this.myService.getGridData(param, this.searchParams);
        };
    }

    /**
     * 控制每行操作按钮展示
     */
    private rowBeforeAdd = (row) => {
        const rowToolState: any = {};
        rowToolState.check = row.checkstatus === 0;
        rowToolState.edit = row.checkstatus === 0;
        rowToolState.del = row.checkstatus === 0;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列
     */
    private initGridColumns() {
        const columnTemplate = {
            checkstatus: '<span>${ value===0 ? "待审核" : "已审核" }</span>'
        };
        const columndef = [
            { 'text': '客户编号', 'datafield': 'custid', 'align': 'center', 'width': 120, pinned: true },
            { 'text': '客户名称', 'datafield': 'name', 'align': 'left', 'width': 150 },
            { 'text': '资金账号', 'datafield': 'acctid', 'align': 'center', 'width': 120 },
            { 'text': '资金账户', 'datafield': 'subacctid', 'align': 'center', width: 120 },
            { 'text': '提现金额(元)', 'datafield': 'amount', 'align': 'right', width: 120 },
            { 'text': '提现凭证号', 'datafield': 'paymentno', 'align': 'center', 'width': 140 },
            { 'text': '备注', 'datafield': 'notes', 'align': 'left', 'width': 230 },
            { 'text': '创建人', 'datafield': 'creator', 'align': 'left', 'width': 100 },
            { 'text': '创建日期', 'datafield': 'createtime', 'align': 'center', 'width': 120 },
            { 'text': '审核人', 'datafield': 'checker', 'align': 'left', 'width': 100 },
            { 'text': '审核日期', 'datafield': 'checktime', 'align': 'center', 'width': 120 },
            { 'text': '状态', 'datafield': 'checkstatus', 'align': 'center', 'width': 100, columntype: 'template' },
            { 'text': '操作', 'datafield': 'tools', 'width': 150, columntype: 'tools' }
        ];
        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 客户选择
     */
    selectedCustomer(org) {
        this.searchParams.acctno = org.length !== 0 ? org[0].acctno : '';
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        console.info(' ======== sssssss=========');
        this.mygrid.load();
    }

    /**
     * 重置
     */
    doReset() {
        this.initSearchParam();
        this.customerSelect.clearSelection();
        this.mygrid.load();
    }

    /**
     * 审核
     */
    doCheck(obj) {
        const param = {
            title: '审核',
            items: obj.entitys || [],
            method: 'doCheck'
        };
        this.doOperateSubAcct(param);
    }

    /**
     * 删除
     */
    doDel(obj) {
        const param = {
            title: '删除',
            items: obj.entitys || [],
            method: 'doDel'
        };
        this.doOperateSubAcct(param);
    }

    /**
     * 按钮操作(审核/删除)
     * @param param
    */
    doOperateSubAcct(param) {
        const arr = param.items;
        let sheetid: number;
        if (arr.length === 0) {
            this.modalService.modalToast('请选择要' + param.title + '的账户！', 'info', 2000);
            return;
        }
        if (arr.length === 1) {
            sheetid = arr[0].sheetid;
        }
        const message = '您确定' + param.title + '账户？',
            title = '操作确认',
            msgType = 'info';
        this.modalService.modalConfirm(message, title, msgType).subscribe((retCode: string): void => {
            if (retCode === 'OK') {
                this.myService[param.method](sheetid).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    this.mygrid.load();
                });
            }
        });

    }

    /**
     * 新增
     */
    doAdd() {
        const obj = {
            subacctid: 1212455,
            subacctname: '帐号名称',
            acctid: 110112,
            acctno: '11220001',
            name: '客户名是你吧'
        };
        this.el_winOffwithdrawAdd.open('ADD', this.offwithdrawCfginfo, obj);
    }

    /**
     * 确认新建
     * @param  $event
     */
    doConfirm($event) {
        const param = $event;
        if (param.type === 'ADD') {
            this.myService.doAdd(param).subscribe((res) => {
                console.info(res, ' ======== res 333444=========');
                this.baseService.modalService.modalToast(res.message);
                this.mygrid.load();
                this.el_winOffwithdrawAdd.cancel();
            });
        } else if (param.type === 'EDIT') {
            this.myService.doUpdate(param).subscribe((res) => {
                this.baseService.modalService.modalToast(res.message);
                this.mygrid.load();
                this.el_winOffwithdrawAdd.cancel();
            });
        }
    }

    /**
     * 编辑
     */
    doEdit(obj) {
        this.el_winOffwithdrawAdd.open('EDIT', this.offwithdrawCfginfo, obj.entitys[0]);
    }

}