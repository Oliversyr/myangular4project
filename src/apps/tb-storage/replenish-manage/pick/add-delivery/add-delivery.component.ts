
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input, Output, EventEmitter} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { PickDetailService } from './../pick-detail/pick-detail.service';
import { PickDetailComponent } from './../pick-detail/pick-detail.component';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { Observable } from 'rxjs/Observable';

/**
 * 添加配送单
 * @Created by: yangr 
 * @Created Date: 2017-12-28 14:21:04 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-23 18:21:41
 */

@Component({
    selector: "sui-add-delivery",
    templateUrl: './add-delivery.html',
    styleUrls: [ './add-delivery.scss' ]
})

export class AddDeliveryComponent extends BaseListComponent implements OnInit, AfterViewInit {
    /**
     * 列表配置参数
     */
    gridOption: GridOption<any>;

    dateLabels: Array<any>;
    opLabels: Array<any>;

    searchParams: any;

    @Input('stockid') stockid: number;
    @Input('sheetid') sheetid: number;

    @Output('refreshData') refreshData: EventEmitter<any> = new EventEmitter();
    /**
     * 表格
     */
    @ViewChild('adjustgrid') mygrid;
    /**
     * 弹窗
     */
    @ViewChild('addDelModal') addDelModal;

    @ViewChild('shopSelect') shopSelect;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: PickDetailService,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initMyGrid();
        this.initParam();
        // this.tab.routerParam;

        // this.addDelModal.open();

    }

    ngAfterViewInit() {
        this.initMyGridColumns();
        this.mygrid.load();
    }

    /**
     * 初始化表格插件
     */
    private initMyGrid() {
        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true ,
            isEdit: false,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: null,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: this.sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.searchParams.stockid = this.stockid;
            console.log('this.searchParams==', this.searchParams)
            return this.myService.getAddDelivery(param, this.searchParams);
        };
        

        
    }

    /**
     * 初始化表格列表
     */
    private initMyGridColumns() {

        let columnTemplate = {
            
        } ;

        let columndef = [
            {"text":"配送单号", "datafield":"sheetid","align":"center", "width": 80, pinned: true},
            {"text":"目的店铺", "datafield":"fullname","align":"center", "width": 200, pinned: true},
            {"text":"配送仓库", "datafield":"stockname","align":"center", "width": 200, pinned: true},
            {"text":"配送商品", "datafield":"goodsnum","align":"center", width: 80},
            {"text":"制单人", "datafield":"editor","align":"center", "width": 80},
            {"text":"制单时间", "datafield":"editdate","align":"center", "width": 200},
            {"text":"审核人", "datafield":"checker","align":"center", "width": 80},
            {"text":"审核时间", "datafield":"checkdate","align":"center", "width": 200},
            // {"text":"操作", "datafield":"tools", "width": 200, columntype: 'tools'}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    private initParam() {
        this.dateLabels = [
            {label: "全部", value: -1},
            {label: "制单日期", value: 0},
            {label: "审核日期", value: 1}
        ]

        this.opLabels = [
            {label: "全部", value: -1},
            {label: "制单人", value: 0},
            {label: "审核人", value: 1}
        ]

        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.searchParams = {
            dateValue: {
                leftValue: -1,
                beginDate: toDateStr,
                endDate: toDateStr
            },
            opflag: {leftValue: -1},
            operator: "",
            shopeid: -1
        }
        
    }

    /**
     * 店铺选择
     */
    selectedShop(org) {
        console.log(org);
        this.searchParams.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.searchParams = {
            dateValue: {
                leftValue: -1,
                beginDate: toDateStr,
                endDate: toDateStr
            },
            opflag: {leftValue: -1},
            operator: "",
            shopeid: -1,
        }
        this.shopSelect.clearSelection();
        this.mygrid.load();

    }

    doAddDel() {
        setTimeout(() => {
            this.mygrid.load();
            this.addDelModal.open();
        },200)
    }

    /**
     * 表格按钮点击
     */
    doModalConfirm() {
        let data = this.mygrid.selection.getSelectRows();
        let addList = [];
        if(data.length > 0) {
            data.forEach((item) => {
                addList.push(item.sheetid);
            })
        }
        let param = {
            sheetid: this.sheetid,
            refsheetids: addList
        }

        this.baseService.modalService.modalConfirm("添加配送单后将重新汇总拣货商品，并清空录入的拣货数量，是否确认？").subscribe((data) => {
            if(data === "OK") {
                this.myService.doOprDelivery(param, 1).subscribe((res) => {
                    console.log('res.retCode === ', res.retCode)
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        this.refreshData.emit(res.data.result);
                        this.addDelModal.close();
                    }
                })
            }
        })
        
    }
    doModalClose() {
        this.addDelModal.close();
    }

}