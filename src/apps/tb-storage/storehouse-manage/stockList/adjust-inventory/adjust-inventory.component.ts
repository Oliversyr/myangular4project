
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { StockListService } from './../stockList-list.service';
import { StockListComponent } from './../stockList-list.component';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { Observable } from 'rxjs/Observable';
import { GridColumnDef } from '../../../../../common/components/grid/grid-column';

/**
 * 库存调整
 * @Created by: yangr 
 * @Created Date: 2017-12-28 14:21:04 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-16 11:19:08
 */

@Component({
    selector: "sui-adjust-inventory",
    templateUrl: './adjust-inventory.html',
    styleUrls: [ './adjust-inventory.scss' ]
})

export class AdjustInventoryComponent extends BaseListComponent implements OnInit {
    /**
     * 列表配置参数
     */
    gridOption: GridOption<any>;
    /**
     * 表格
     */
    @ViewChild('adjustgrid') mygrid;
    /**
     * 弹窗
     */
    @ViewChild('adjustModal') adjustModal;
    /**
     * 弹窗打开
     */
    @Input('adjustHandle') adjustHandle = false;
    /**
     * 待调整数据
     */
    @Input('selectedGridData') selectedGridData = [];
    

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: StockListService,
        private stockListComponent: StockListComponent
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initMyGrid();
        this.initMyGridColumns();
        // this.tab.routerParam;

        // this.adjustModal.open();

    }

    /**
     * 初始化表格插件
     */
    private initMyGrid() {
        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true ,
            isEdit: true,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: null,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: this.sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            return new Observable((observable) => {
                if(this.selectedGridData) {
                    this.selectedGridData.forEach((item, i) => {
                        item.adjustqty = item.qty;
                        item.stkqty = item.qtystr;
                    })
                }
                
                let data = {
                    rows: this.selectedGridData,
                    footer: {totalCount: this.selectedGridData ? this.selectedGridData.length : 0}
                }
                console.log('data==', data)
                observable.next(data);
                observable.complete();
            })
        };
    }

    /**
     * 初始化表格列表
     */
    private initMyGridColumns() {

        let columnTemplate = {
            qtynum: '<span>${rowdata.adjustqty - rowdata.qty}${rowdata.uname}</span>'
        } ;

        let columndef: GridColumnDef = [
            {"text":"所在仓库", "datafield":"stockname","align":"center", "width": 150, pinned: true, editable: false},
            {"text":"商品内码", "datafield":"mygoodsid","align":"center", "width": 100, pinned: true, editable: false},
            {"text":"商品名称", "datafield":"goodsname","align":"center", "width": 200, pinned: true, editable: false},
            {"text":"销售规格", "datafield":"spec","align":"center", "width": 100, editable: false},
            {"text":"调整前库存", "datafield":"stkqty","align":"center", "width": 90, editable: false},
            {"text":"调整后库存", "datafield":"adjustqty","align":"center", "width": 90, editable: true},
            {"text":"调整数", "datafield":"qtynum","align":"center", "width": 90, columntype: "template", editable: false},
            {"text":"商品条码", "datafield":"barcode","align":"center", width: 100, editable: false},
            {"text":"备注", "datafield":"notes","align":"center", width: 150, editable: true},
        ]

        //设置表格验证
        let getGridValidation = {
            adjustqty: "required,number_8_2",
            notes: "len_0_24"
        }

        // this.mygrid.setColumns(columndef, [], columnTemplate, getGridValidation);
        this.gridOption.columns = [columndef, [], columnTemplate, getGridValidation];
    }

    doAdjust() {
        setTimeout(() => {
            this.mygrid.load();
            this.adjustModal.open();
        },200)
        
    }


    /**
     * 表格按钮点击
     */
    doModalConfirm() {
        // let data = this.mygrid.selection.getAllRows();
        let data = this.mygrid.getrows();
        console.log('res.retCode === ', data)
        this.myService.doAdjustStock(data).subscribe((res) => {
            console.log('res.retCode === ', res.retCode)
            if(res.retCode === 0) {
                this.baseService.modalService.modalToast(res.message);
                setTimeout(() => {
                    this.stockListComponent.mygrid.load();
                    this.stockListComponent.mygrid.clearselection();
                    this.adjustModal.close();
                }, 500)
                
            }
        })
    }
    doModalClose() {
        this.adjustModal.close();
    }

}