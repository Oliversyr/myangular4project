import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseEditComponent } from "../../../../../common/top-common/base-edit.component";
import { TemplateEditOption } from '../../../../../common/components/templates/template-edit';
import { GridOption, GridPage, GridEditOption } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { OutInputEditService } from './outInput-edit.service';
import { OutInputService } from './../outInput.service';
import { GridSortOption } from './../../../../../common/components/grid/grid-sort';
import { StyleCompiler } from '@angular/compiler';
import { Observable } from 'rxjs/Observable';
import { Grid } from '../../../../../common/components/grid/grid';

/**
 * 搜索参数
 */
interface OutInputInfo {
    coename: string;
    editdate: any;
    editor: string;
    ename: string;
    goodsnum: number;
    manager: string;
    notes: string;
    oitypevalue: number;
    operdate: any;
    purvalue: number;
    resheetid: number;
    sheetid: number;
    status: number;
    coeid?: any;
}




/**
 * 商品出入库单编辑模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './outInput-edit.html',
    styleUrls: [ './outInput-edit.scss' ]
})

export class OutInputEditComponent extends BaseEditComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateEditOption;
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    private gridEditOption: GridEditOption;
    private gridPage: GridPage;
    private gridGoodsData: Array<any>;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    outInputInfo: OutInputInfo;

    /**
     * 发生对象默认值
     */
    defSelectedItem: any = {};

    oitypeObj: any;

    addGoods: any = {
        num: '',
        price: '',
        notes: ''
    };

    /**
     * 机构自动补全选择框
     */
    // @ViewChild('customerSelect') customerSelect;
    // @ViewChild('supplierSelect') supplierSelect;
    @ViewChild('goodsSelect') goodsSelect;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid: Grid;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: OutInputEditService,
        private outInputService: OutInputService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        super.requestConfigBeforePageInit([this.outInputService.getOutInputDetail(this.tab.routerParam.entity.sheetid)]).subscribe(data => {
            console.log('getStocktypeData==',data);
            this.outInputInfo = data[0].data.result.head;
            this.gridGoodsData = data[0].data.result.items;

            this.defSelectedItem = {
                ename: this.outInputInfo.coename,
                coeid: this.outInputInfo.coeid
            }
      });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initHeadParam();
        this.loadPageInitData();
        this.initGrid();
        this.initToolbar();

        this.option = {
            tab: this.tab
        }

        this.oitypeObj = this.outInputService.getOitypeObj();

        console.log(5555555555555, this.tab)
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight);

        let toolBarStatus = {'add,del,print,reset,editComplete': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initHeadParam() {
        this.outInputInfo = {
            coename: "",
            editdate: "",
            editor: "",
            ename: "",
            goodsnum: -1,
            manager: "",
            notes: "",
            oitypevalue: -1,
            operdate: "",
            purvalue: -1,
            resheetid: -1,
            sheetid: -1,
            status: -1,
        }

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            gridType: "M",
            // selectionMode: "singlerow",
            isShowRowNo: true ,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight),
            isEdit: true,

            // primaryKeyFields:["stockid"]
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]

        };

        this.gridPage = {
            pageable: false
        }

        this.gridEditOption = {
            submitServerFields: ["barcode", "goodsid", "goodsname", "mygoodsid", "notes", "objectid", "oiqty", "price", "purvalue", "spec", "uname"],
            duplicateRowFields: ["goodsid"],
            coverFields: ["oiqty", "price", "notes"],
            cumulateFields: ["oiqty"],
            promptTemplate: "商品[${row.goodsname}]已存在: 出入库数量：${row.oiqty + row.uname}，出入库价格：${row.price}"
        };

        
        this.gridOption.loadDataInterface = (param) => {
            
            return new Observable<any>((observable) => {
                if(this.gridGoodsData) {
                    let data = {
                        rows: this.gridGoodsData,
                        footer: {
                            totalCount: this.gridGoodsData.length
                        }
                    }
                    console.log(777777777777, this.gridGoodsData);
                    observable.next(data);
                }
                observable.complete();
            } )
        };

      
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.del = true;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            purvalue: '<span>${(rowdata.oiqty * rowdata.price) || 0}</span>',
        } ;

        let columndef = [
            {"text":"商品内码", "datafield":"mygoodsid","align":"center", "width": 80, pinned: true, editable: false},
            {"text":"商品名称", "datafield":"goodsname","align":"center", minWidth: 200, pinned: true, editable: false},
            {"text":"条码", "datafield":"barcode","align":"center", "width": 90, editable: false},
            {"text":"销售规格", "datafield":"spec","align":"center", width: 90, editable: false},
            {"text":"包装单位", "datafield":"uname","align":"center", "width": 80, editable: false},
            {"text":"出入库数量", "datafield":"oiqty","align":"center", "width": 110, editable: true},
            {"text":"出入库价格（元）", "datafield":"price","align":"right", "width": 110, editable: true},
            {"text":"出入库金额（元）", "datafield":"purvalue","align":"right", "width": 110, editable: false,  columntype: 'template'},
            {"text":"备注", "datafield":"notes","align":"center", "width": 150, editable: false},
            {"text":"操作", "datafield":"tools", "width": 80, columntype: 'tools', editable: false}
        ]

        //设置表格验证
        let getGridValidation = {
            oiqty: "required,number_8_0",
            price: "required,number_8_2"
        }

        this.mygrid.setColumns(columndef, [], columnTemplate, getGridValidation);
    }

    

    /**
     * 客户选择
     */
    selectedCustomer(org) {
        this.outInputInfo.coeid = org.length !== 0 ? org[0].coeid : -1;
    }

    /**
     * 供应商选择
     */
    selectedSupplier(org) {
        console.log(org)
        this.outInputInfo.coeid = org.length !== 0 ? org[0].coeid : -1;
    }


    /**
     * 商品选择
     */
    selectedGoods(org) {
        console.log(org)
        if(org.length === 1) {
            this.addGoods.goodsData = org[0];
        } else if(org.length > 1) {
            // this.addGoods.goodsData = org;
            this.mygrid.edit.addRows(org);
            this.addGoods.num = "";
            this.addGoods.notes = "";
            this.addGoods.price = "";
            this.addGoods.goodsData = null;
            this.goodsSelect.clearSelection();
        }
        
        // this.searchParams.goodsid = org.length !== 0 ? org[0].goodsid : -1;
    }

    /**
     * 添加按钮
     */
    doAddToGrid(obj, event) {
        // this.mygrid.load();
        console.log(this.addGoods)
        if(!this.addGoods.goodsData) {
            return ;
        }
        if(this.addGoods.num && !this.baseService.commonServices.classUtil.isNum(this.addGoods.num)) {
            this.baseService.modalService.modalToast('数量必须为数字');
            return ;
        }
        if(this.addGoods.price && !this.baseService.commonServices.classUtil.isNum(this.addGoods.price)) {
            this.baseService.modalService.modalToast('单价必须为数字');
            return ;
        }

        let goodsData = this.addGoods.goodsData;
        goodsData.oiqty = this.addGoods.num;
        goodsData.notes = this.addGoods.notes;
        goodsData.price = this.addGoods.price;
        
        this.mygrid.edit.addRows(goodsData);

        this.addGoods.num = "";
        this.addGoods.notes = "";
        this.addGoods.price = "";
        this.addGoods.goodsData = null;
        this.goodsSelect.clearSelection();
    }


    /**
     * 确认删除
     */
    doConfirmDel(obj) {
        console.log(obj);
        this.mygrid.edit.delRows(obj.rowIndexs[0]);
    }
    
    /**
     * 保存
     */
    doSave(obj) {
        let goodsList = this.mygrid.selection.getAllRows();
        let goodsitems = [];
        let isOK = true;

        for(let i = 0; i < goodsList.length; i++) {
            let item = goodsList[i];
            if(!item.oiqty || !item.price) {
                this.baseService.modalService.modalToast('商品数量和售价不能为空！');
                isOK = false;
                break;
            }

            let data: any = {
                goodsid:  item.goodsid,
                mygoodsid:  item.mygoodsid,
                goodsname:  item.goodsname,
                barcode:  item.barcode,
                spec:  item.spec,
                uname:  item.uname,
                oiqty:  parseInt(item.oiqty),
                price:  parseFloat(item.price),
                purvalue: parseInt(item.oiqty) * parseFloat(item.price),
                notes:  item.notes,
                objectid:  item.objectid
            }

            goodsitems.push(data);

        }

        if(!isOK) {
            return ;
        }

        this.outInputInfo.operdate = this.outInputInfo.operdate + " 00:00:00";
        let param = {
            head: this.outInputInfo,
            items: goodsitems
        }

        this.myService.saveOrUpdate(param).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if(res.retCode === 0) {
                // this.doBrowse({sheetid: this.outInputInfo.sheetid, status: this.outInputInfo.status});
            }
        });
    }
    doCancel(obj) {
        console.log(obj);
    }

}