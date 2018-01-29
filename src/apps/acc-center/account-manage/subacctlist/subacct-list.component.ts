import { NgModule, ElementRef,Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { BaseService } from '../../../../common/top-common/base.service';
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { SubAcctListService } from './subacct-list.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { ACCT_MENUS } from '../common/acct-center-menus'

/**
 * 搜索参数
 */
interface SearchParams {
    acctno: string;
    subaccttype: string;
    subacctid: string;
    status: number;
}
/**
 * 账户列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-17
 */

@Component({
    templateUrl: './subacct-list.html',
    styleUrls: ['./subacct-list.scss']
})

export class SubAcctListComponent extends BaseListComponent implements OnInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
    /**
     * 账户类型
     */
    accttypeData: Array<any> = [];
    /**
     * 客户默认值
     */
    defSelectedItem: any = {};
    /**
     * 状态
     */
    statusData: Array<object>;
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    private gridPage: GridPage;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    /**
     * 客户自动补全选择框
     */
    @ViewChild('customerSelect') customerSelect;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;
    /** 转账弹出框 */
    @ViewChild('el_winTransfer') el_winTransfer;

    onStart(param) { };

    constructor(private rootElement: ElementRef, private baseService: BaseService,private myService: SubAcctListService,
        private modalService:ModalService) {
            super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
       
    }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initToolbar();

        this.loadPageInitData();

        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }

    }
    /**
     * 表格初始化完成后执行
     */
    ngAfterViewInit() {
        this.initGridColumns();
    } 

    private initToolbar() {
        let extraBtns = [
            {
            name: 'forbid',
            label: '禁用',
            placeholder: '批量禁用',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
           },
           {
            name: 'restart',
            label: '启用',
            placeholder: '批量启用',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
          }
        ]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = { 'forbid': true,'restart': true,'print,copy,add,del,cancel,import,check':false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.statusData = [
            { value: -1, label: '全部' },
            { value: 2, label: '禁用' },
            { value: 1, label: '正常' }
        ]
        this.accttypeData = [
            { value: 'all', label: '全部' },
            { value: 'universal', label: '基本账户' },
            { value: 'special', label: '专用账户' },
            { value: 'temp', label: '临时账户' },
            { value: 'liabilities', label: '负债类账户' },
            { value: 'assets', label: '资产类账户' }
        ]
        this.searchParams = {
            acctno: '',
            subaccttype: 'all',
            status: -1,
            subacctid: '',
        }
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        let extraBtns = [
            { name: "forbid", label: "禁用", placeholder: "禁用", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "restart", label: "启用", placeholder: "启用", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "detail", label: "明细", placeholder: "明细", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "transfer", label: "转账", placeholder: "转账", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
        ]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            primaryKeyFields: ["acctno","acctid","custid","name","subacctid","subacctname","balance","usablevalue","status"]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            return this.myService.getGridData(param, this.searchParams)
        };
    }

    private rowBeforeAdd = (row) => {
        //临时账户、负债类账户、资产类账户不能进行启用，禁用，转账
        let rowToolState: any = {};
        rowToolState.detail = true;
        rowToolState.forbid = row.status == 1 && !(row.subaccttype == 'temp'|| row.subaccttype == 'liabilities' || row.subaccttype == 'assets');
        rowToolState.restart = row.status == 2 && !(row.subaccttype == 'temp'|| row.subaccttype == 'liabilities' || row.subaccttype == 'assets');
        rowToolState.transfer = row.status == 1 && !(row.subaccttype == 'temp'|| row.subaccttype == 'liabilities' || row.subaccttype == 'assets');
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列
     */
    private initGridColumns() {
        let columnTemplate = {
            status: '<span>${value==2 ? "禁用" : "正常"}</span>',
            subacctid:'<span active="goToAcctInfo">${value}</span>'
        };

        let columndef = [
            { "text": "资金账号", "datafield": "acctid", "align": "center", "width": 200, columntype: 'link|browse', pinned: true },
            { "text": "客户编号", "datafield": "custid", "align": "center", "width": 180, pinned: true },
            { "text": "客户名称", "datafield": "name", "align": "center", "width": 180 },
            { "text": "账户", "datafield": "subacctid", "align": "center", width: 180 ,columntype: 'template'},
            { "text": "账户名称", "datafield": "subacctname", "align": "center", width: 180 },
            { "text": "账户余额", "datafield": "balance", "align": "center", "width": 180 },
            { "text": "可用余额", "datafield": "usablevalue", "align": "center", "width": 180},
            { "text": "状态", "datafield": "status", "align": "center", "width": 130,columntype: 'template'},
            { "text": "操作", "datafield": "tools", "width": 230, columntype: 'tools'}
        ];
        this.mygrid.setColumns(columndef, [], columnTemplate);
        this.mygrid.load();
    }

    /**
     * 客户选择
     */
    selectedCustomer(org) {
        this.searchParams.acctno = org.length !== 0 ? org[0].acctno : -1;
    }
    /**
     * 账户类型选择
     */
    selectedAcctType(org) {
        this.searchParams.subaccttype = org.length !== 0 ? org[0].value : -1;
    }

    /**
     * 状态
     */
    selectedStatus(org) {
        this.searchParams.status = org.length !== 0 ? org[0].value : -1;
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }

    /**
     * 重置
     */
    doReset() {
        this.searchParams = {
            acctno: '',
            subaccttype: 'all',
            status: -1,
            subacctid: '',
        }
        this.customerSelect.clearSelection();
        this.mygrid.load();
    }


    /**
     * 禁用
     * @param obj 
     */
    doForbid(obj) {
        let param = {
            title:"禁用",
            items: obj.entitys || [],
            method:'doStop'

        }
        this.doOperateSubAcct(param);
    }
    /**
     * 启用
     * @param obj 
     */
    doRestart(obj) {
        let param = {
            title:"启用",
            items: obj.entitys || [],
            method:'doStart'

        }
        this.doOperateSubAcct(param);
       
    }
    /**
     * 操作账户(启用/禁用)
     * @param param 
    */
    doOperateSubAcct(param){
        let thisData = param.items;
        let arr = [];
        if(thisData.length == 0){
            this.modalService.modalToast("请选择要"+param.title+"的账户！","info",2000);
            return;
        }
        thisData.forEach((element,index) => {
            if(param.method == 'doStart' && element.status == 2){
                arr.push({acctid:element.acctid,subacctid:element.subacctid});
            }else if(param.method == 'doStop' && element.status == 1){
                arr.push({acctid:element.acctid,subacctid:element.subacctid});
            }
            if(index == thisData.length - 1){
                if(arr.length == 0){
                    this.modalService.modalToast("请选择可"+param.title+"的账户！","info",2000);
                    return;
                }else{
                    let message = '您确定'+param.title+'账户？',
                    title = '操作确认',
                    msgType = 'info';
                    this.modalService.modalConfirm(message, title, msgType).subscribe((retCode: string): void => {
                        if(retCode === 'OK'){
                            this.myService[param.method](arr).subscribe((res) => {
                                if (res.retCode === 0) {
                                    this.baseService.modalService.modalToast(res.message);
                                    this.mygrid.load();
                                }
                            });
                        }
                    });
                }
            }
        });
        

    }
    /**
     * 详情
     * @param obj 
     */
    doDetail(obj) {
        let _param = {
            subacctid: obj.entitys[0].subacctid,
            acctno:obj.entitys[0].acctno
        }
        this.goToPage(this.ATTR.B, _param);
    }
    /**
     * 跳转账户资料
     */
    doGoToAcctInfo(){
        super.goToPage(this.ATTR.L, {},ACCT_MENUS.ACCTINFO);
    }
    /**
     * 转账
     * @param obj 
     */
    doTransfer(obj) {
        let thisData = obj.entitys[0];
        //先获取转入列表再打开弹出框
        this.getReceiveAccList(thisData);
        
    }
     /**
      * 请求转入账户列表 
      */
     getReceiveAccList(thisData){
        var param = {
            pageNum : 1,
            pageSize : 2147483647,
            totalCount : 0
            
        }
        var searchParam = {
            acctid:thisData.acctid
        }
        let items: any[]=[];
        this.myService.getGridData(param, searchParam).subscribe((data: any) => {
            data.rows.forEach((element,index) => {
                if(element.subacctid != thisData.subacctid){
                    var acc = {
                        value:element.subacctid,
                        label:element.subacctid+'-'+element.subacctname,
                        subAcc:element                  
                    }
                    items.push(acc)
                }
                if(index == data.rows.length-1){
                    thisData.items = items;
                    this.el_winTransfer.open(thisData);
                }
            });
        });
    }

}