import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { MonitorService } from './monitor.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';

/**
 * 搜索参数
 */
interface SearchParams {
    shopname: string;
    shopstatus: number;
    groupid: number;
    linkstatus: number;
    status: number;
    version: boolean;
}

/**
 * 售卖机监控模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './monitor.html',
    styleUrls: [ './monitor.scss' ]
})

export class MonitorComponent extends BaseListComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
    /**
     * 店铺状态
     */
    shopStateData: Array<object>;
    /**
     * 联机状态
     */
    linkStateData: Array<object>;
    /**
     * 售卖机状态
     */
    VEMStateData: Array<object>;
    /**
     * 所属店组列表
     */
    groupList: Array<object> = [];
    /**
     * 列表配置参数
     */
    gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    gridPage: GridPage;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];
    /**
     * 是否自动刷新
     */
    isRefresh: boolean = true;
    /**
     * 自动刷新频率
     */
    refreshTime: number;
    /**
     * 自动刷新频率列表
     */
    refreshTimeList: Array<object>;
    /**
     * 自动刷新定时器
     */
    autoRefreshInterval: any;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private monitorServer: MonitorService,
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        super.requestConfigBeforePageInit([this.getGroupList()]).subscribe(data => {
            this.groupList = data[0].data.result;
            this.groupList.forEach((item, i) => {
                item['groupid'] = item['groupId'];
            })
            let all = {
                groupName: '全部',
                groupid: -1
            }
            this.groupList.unshift(all);
            this.searchParams.groupid = 0;
            setTimeout(() => {
                this.searchParams.groupid = -1;
            }, 100)
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initToolbar();

        this.loadPageInitData();

        this.option = {
            isMoreSearch: true,
            tab: this.tab
        }

        this.tools = [];

    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    private initToolbar() {
        let extraBtns = [{
            name: 'restartBatch',
            label: '强制重启',
            placeholder: '重启售卖机',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        },{
            name: 'updateBatch',
            label: '强制升级',
            placeholder: '升级售卖机',
            state: true,
            selectRecordMode: '',
            useMode: 'GRID_BAR',
            userPage: 'L'
        },{
            name: 'syncBatch',
            label: '手动同步',
            placeholder: '同步售卖机数据',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = { 'restartBatch,syncBatch,updateBatch': true, 'print,copy,add,check,del,import,export,cancel': false };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {

        this.refreshTimeList = [
            {label: '每30秒', value: 1},
            {label: '每1分钟', value: 2},
            {label: '每5分钟', value: 3}
        ]

        this.shopStateData = [
            {value: -1, label: '全部'},
            {value: 0, label: '未开业'},
            {value: 1, label: '营业中'},
            {value: 2, label: '休息中'},
            {value: 3, label: '已停业'}
        ]

        this.linkStateData = [
            {value: -1, label: '全部'},
            {value: 0, label: '在线'},
            {value: 1, label: '脱机'}
        ]

        this.VEMStateData = [
            {value: -1, label: '全部'},
            {value: 0, label: '正常'},
            {value: 1, label: '禁用'}
        ]

        this.searchParams = {
            "shopname": "",
            "shopstatus": -1,
            "groupid": -1,
            "linkstatus": -1,
            "status": -1,
            "version": false
        }

        this.refreshTime = 1;

        // this.getGroupList();
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        let extraBtns = [{
            name: 'restart',
            label: '强制重启',
            placeholder: '重启售卖机',
            state: true,
            selectRecordMode: '',
            useMode: 'GRID_BAR',
            userPage: 'L'
        },{
            name: 'sync',
            label: '手动同步',
            placeholder: '同步售卖机数据',
            state: true,
            selectRecordMode: '',
            useMode: 'GRID_BAR',
            userPage: 'L'
        }]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true ,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            rowBeforeAdd: this.rowBeforeAdd,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => this.monitorServer.getGridData(param, this.searchParams);

        // this.gridOption.tools = [toolsTemp];

       
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.restart = true;
        rowToolState.update = true;
        rowToolState.sync = true;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            shopname: '<span active="shop">【${rowdata.shopid}】${value}</span>',
            // address: '<span active="address"><div>${rowdata.areaname}</div><div>${value}</div></span>',
            // tools: '<span tabindex="1000"  active="restart" title="重启" class="sui-grid-btn">${rowdata.linkstatus === 0 ? "重启" : ""}</span>${rowdata.linkstatus === 0 ? "|" : ""}<span tabindex="1000"  active="sync" title="同步" class="sui-grid-btn ">${rowdata.linkstatus === 0 ? "同步" : ""}</span>',
            // shopstatus: '<span *ngIf="${value===0}">未开业</span><span *ngIf="${value===1}">营业中</span><span *ngIf="${value===2}">休息中</span><span *ngIf="${value===3}">已停业</span>',
            shopstatus: '<span>${value === 0 ? "未开业" : value === 1 ? "营业中" : value === 2 ? "休息中" : "已停业"}</span>',
            status: '<span>${value===1 ? "正常" : "禁用"}</span>',
            linkstatus: '<span>${value===0 ? "在线" : "脱线"}</span>'
        } ;

        let columndef = [
            {"text":"店铺", "datafield":"shopname","align":"center", "width": 200, columntype: 'template'},
            {"text":"所在区域", "datafield":"areaname","align":"center", "width": 250},
            {"text":"地址", "datafield":"address","align":"center", "minWidth": 250},
            {"text":"联系人", "datafield":"contact","align":"center", width: 100},
            {"text":"店铺状态", "datafield":"shopstatus","align":"center", "width": 80, columntype: 'template'},
            {"text":"售卖机", "datafield":"posname","align":"center", "width": 90},
            {"text":"售卖机状态", "datafield":"status","align":"center", "width": 80, columntype: 'template'},
            {"text":"联机状态", "datafield":"linkstatus","align":"center", "width": 80, columntype: 'template'},
            {"text":"VEM版本", "datafield":"version","align":"center", "width": 120},
            {"text":"最后同步时间", "datafield":"synchrotime","align":"center", "width": 170},
            {"text":"最后重启时间", "datafield":"restarttime","align":"center", "width": 170},
            {"text":"操作", "datafield":"tools","align":"center", "width": 150, columntype: 'tools'}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 获取店组列表
     */
    getGroupList() {
        return this.monitorServer.getGroupData()
        // .subscribe((data) => {
        //     this.groupList = data.data.result;
        //     let all = {
        //         groupName: '全部',
        //         groupid: -1
        //     }
        //     this.groupList.unshift(all);
        //     this.searchParams.groupid = 0;
        //     setTimeout(() => {
        //         this.searchParams.groupid = -1;
        //     }, 100)
        // })
    }

    /**
     * 是否自动刷新
     */
    doRefresh(obj) {
        setTimeout(() => {
            console.log(obj)
            let checked = this.isRefresh;
            let refreshTime = this.refreshTime === 1 ? 30*1000 : this.refreshTime === 2 ? 1*60*1000 : 5*60*1000;

            if(obj.args.checked === false) {
                this.baseService.modalService.modalToast(`已关闭监控列表自动刷新`);
            } else if(checked) {
                this.baseService.modalService.modalToast(`将于每${this.refreshTime === 1 ? '30秒' : this.refreshTime === 2 ? '1分钟' : '5分钟'}自动刷新监控列表`);
            }  

            if(checked) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = setInterval(() => {
                    this.mygrid.load();
                }, refreshTime)
            } else {
                clearInterval(this.autoRefreshInterval);
            }
        }, 100)
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        this.searchParams = {
            shopname: "",
            shopstatus: -1,
            groupid: -1,
            linkstatus: -1,
            status: -1,
            version: false
        }

        this.mygrid.load();
    }

    /**
     * 表格按钮点击
     */
    doResetart(obj) {
        let thisData = obj.param.entitys[0];
        this.baseService.modalService.modalConfirm('您是否要重启该售卖机？', '重启确认', 'info', '确认', '取消').subscribe((res) => {
            console.log(res);
            if(res === 'OK') {
                this.monitorServer.doRestart([thisData.posid]).subscribe((res) => {
                    if(res.retCode === 0) {
                        this.baseService.modalService.modalToast('重启请求发送成功！');
                        this.mygrid.load();
                    }
                });
            }
        })
    }
    doSync(obj) {
        let thisData = obj.param.entitys[0];
        this.baseService.modalService.modalConfirm('您是否要同步该售卖机？', '同步确认', 'info', '确认', '取消').subscribe((res) => {
            console.log(res);
            if(res === 'OK') {
                this.monitorServer.doSync([thisData.posid]).subscribe((res) => {
                    if(res.retCode === 0) {
                        this.baseService.modalService.modalToast('同步请求发送成功！');
                        this.mygrid.load();
                    }
                });
            }
        })
    }

    /**
     * 按钮栏按钮点击
     */
    doRestartBatch(obj) {
        let selectedData = obj.param.entitys;
        let posids;
        if(!selectedData || selectedData.length === 0) {
            this.baseService.modalService.modalToast('请选择售卖机');
            return;
        } else {
            posids = [];
            selectedData.forEach((item, i) => {
                if(item.linkstatus === 0) {
                    posids.push(item.posid);
                }
            });
            if(posids.length === 0) {
                this.baseService.modalService.modalToast('请选择联机状态为【在线】的售卖机');
                return;
            }
        }

        this.baseService.modalService.modalConfirm(`您是否要重启选中的${posids.length}台联机状态为【在线】的售卖机？`, '重启确认', 'info', '确认', '取消').subscribe((res) => {
            console.log(res);
            if(res === 'OK') {
                this.monitorServer.doRestart(posids).subscribe((res) => {
                    if(res.retCode === 0) {
                        this.baseService.modalService.modalToast('重启请求发送成功！');
                        this.mygrid.load();
                    }
                });
            }
        })
    }
    doSyncBatch(obj) {
        let selectedData = obj.param.entitys;
        let posids;
        if(!selectedData || selectedData.length === 0) {
            this.baseService.modalService.modalToast('请选择售卖机');
            return;
        } else {
            posids = [];
            selectedData.forEach((item, i) => {
                if(item.linkstatus === 0) {
                    posids.push(item.posid);
                }
            });
            if(posids.length === 0) {
                this.baseService.modalService.modalToast('请选择联机状态为【在线】的售卖机');
                return;
            }
        }

        this.baseService.modalService.modalConfirm('您是否要同步选中的' + posids.length + '台联机状态为【在线】的售卖机？', '同步确认', 'info', '确认', '取消').subscribe((res) => {
            console.log(res);
            if(res === 'OK') {
                this.monitorServer.doSync(posids).subscribe((res) => {
                    if(res.retCode === 0) {
                        this.baseService.modalService.modalToast('同步请求发送成功！');
                        this.mygrid.load();
                    }
                });
            }
        })
    }
    doUpdateBatch(obj) {
        let selectedData = obj.param.entitys;
        let posids;
        if(!selectedData || selectedData.length === 0) {
            this.baseService.modalService.modalToast('请选择售卖机');
            return;
        } else {
            posids = [];
            selectedData.forEach((item, i) => {
                if(item.linkstatus === 0) {
                    posids.push(item.posid);
                }
            });
            if(posids.length === 0) {
                this.baseService.modalService.modalToast('请选择联机状态为【在线】的售卖机');
                return;
            }
        }

        this.baseService.modalService.modalConfirm('您是否要升级选中的' + posids.length + '台联机状态为【在线】的售卖机？', '升级确认', 'info', '确认', '取消').subscribe((res) => {
            console.log(res);
            if(res === 'OK') {
                this.monitorServer.doUpdate(posids).subscribe((res) => {
                    if(res.retCode === 0) {
                        this.baseService.modalService.modalToast('升级请求发送成功！');
                        this.mygrid.load();
                    }
                });
            }
        })
    }

}