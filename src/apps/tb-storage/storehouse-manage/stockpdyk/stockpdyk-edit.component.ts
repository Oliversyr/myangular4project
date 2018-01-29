import { FormsModule } from '@angular/forms';
import { NgModule, Component, ElementRef,  Injectable, Inject, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { Modal } from '../../../../common/components/modal/modal';
import { BaseEditComponent } from "../../../../common/top-common/base-edit.component";
import { TemplateEditOption } from './../../../../common/components/templates/template-edit';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { Grid } from './../../../../common/components/grid/grid';
import { GridOption, GridPage, GridEditOption} from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { DateUtil } from '../../../../common/services/utils/date-util';

// 自定义服务
import { StockPdykEditService } from './stockpdyk-edit.service';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { SuiResponse } from '../../../../common/services/https/sui-http-entity';
import { TemplateDetailOption } from '../../../../common/components/templates/template-detail';
import { BatchResultAlertComponent } from '../../../../common/business-components/base/batch-result-alert/batch-result-alert';
import { SuiGoodsComponent } from '../../../../common/business-components/base/goods/sui-goods.component';

const SUCC = 0;
/**
 * 详情请求参数
 */
interface ReqParam {
    // -1:全部
    goodsid: number;
    sheetid: number;
    // -1-全部  1-有库存未盘点  2-无库存有盘点  3-只看盘盈  4-只看盘亏
    optype?: number;
}

@Component({
    templateUrl: './stockpdyk-edit.html',
    styleUrls: ['./stockpdyk.scss']
})

export class StockPdykEditComponent extends BaseEditComponent implements OnInit {
    option: TemplateDetailOption = {};

    /** 基本信息是否展开 */
    expanded: Boolean = true;
    // 请求参数
    reqParam: ReqParam;
    // 路由参数
    routerParam: {sheetid: number, [propName: string]: any}; 
    // 单头信息
    headInfo: any;
    // 选择的商品
    selectedGoods: {goodsid: number, [propName: string]: any};
    // 表格信息
    gridData: Array<{goodsid: number}>;

    /** 工具栏数据 toolBarData */
    toolBarData: ToolBarButton[];
    tools: ToolBarButton[];

    // 表格
    @ViewChild('grid') mygrid: Grid;
    @ViewChild('goodsSelect') goodsInput: SuiGoodsComponent;
    @ViewChild('el_openBatchResult') el_openBatchResult: BatchResultAlertComponent;
    
    // 列表配置参数
    gridOption: GridOption<any>;
    gridEditOption: GridEditOption;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    // 列表本地分页
    gridPage: any;
    isChanged: boolean;
    
    // 静态数据
    pdTypeObj: object;
    statusObj: object;
    pdQty: any;
    pdNotes: any;
    cols: any[];

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseEditService: BaseEditService,
        private stockPdykEditService: StockPdykEditService,
        private dateUtil: DateUtil
    ){
        super();
    }

    /**
     * 初始化
     */
    ngOnInit(){
        super.ngOnInit();
        
        this.selectedGoods = {goodsid: -1, pdqty: '', notes: ''};
        this.isChanged = false;
        this.option = {
            tab: this.tab
        };
        this.pdTypeObj = this.stockPdykEditService.getPdTypeObj();
        this.statusObj = this.stockPdykEditService.getStatusObj();
        
        this.getRouteParam();
        this.initTools();
        this.initGrid();
        
        this.pdQty = '';
        this.pdNotes = '';
        this.initAlertCol();
    }

    /**
     * 初始化批量提示框
     */
    private initAlertCol(){
        this.cols = [
            { "text": "商品名称", "datafield": "goodsname",  "width": '12%', "editable": false, "pinned": true },
            { "text": "商品编码", "datafield": "goodsid",  "width": '12%', "editable": false, "pinned": true },
            { "text": "失败原因", "datafield": "retmsg", "width": '65%' , "editable": false},
         ];
    }
    
    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData(): void {
        if (this.reqParam.sheetid == -1){
            this.baseService.modalService.modalToast('盘点单详情加载失败，请刷新重试！');
            return ;
        }
        super.requestConfigBeforePageInit([
            // this.stockPdykEditService.getSheetDetail(this.reqParam),
            this.stockPdykEditService.getSheetDetailHead(this.reqParam),
        ]).subscribe(results => {
            let res1 = results[0];
            if (res1.retCode !== 0) {
                this.baseService.modalService.modalToast(res1.message);
                return;
            }
            // 1. 初始化头信息
            let head = res1.data.result;
            this.headInfo = res1.data.result || {};
            
            this.setHeadInfo();
            
        }); 
    }
    
    /**
     * 设置头部部分信息
     */
    private setHeadInfo(){
        this.headInfo.pdtypeName = this.pdTypeObj[this.headInfo.pdtype];
        this.headInfo.statusName = this.statusObj[this.headInfo.status];
        this.headInfo.editdate = this.dateUtil.toStr(new Date(this.headInfo.editdate));
        // 设置按钮状态
        this.setToolsStatus();
    }

    /**
     * 初始化按钮
     */
    private initTools(){
        this.toolBarData = [
            {
                name: 'back',
                label: '返回',
                placeholder: '返回',
                state: true,
                selectRecordMode: '',
                useMode: 'TOP_BAR',
                userPage: 'A|B|M'
            }
        ];
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.toolBarData);

        this.setToolsStatus();
    }

    /**
     * 设置按钮状态
     */
    private setToolsStatus(){
        let flag = true;
        
        let toolBarStatus = {
            'back': flag,
            'save': flag,
            'print': false,
            'list': false,
            'del': false,
            'reset': false,
            'add': false
        };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 获取传递过来的参数
     */
    private getRouteParam(): void {
        this.routerParam = this.tab.routerParam.entity || this.tab.routerParam || {sheetid: -1};
         // 设置查询参数
         this.reqParam = {
            goodsid: -1,
            sheetid:  this.routerParam.sheetid,
            optype: -1
        };
        this.loadPageInitData();
    }


    /**
     * 表格数据插入前
     */
    private rowBeforeAdd = (row): boolean => {
        let rowToolState = {
            remove: true
        };
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGrid() {

        let tools = [{
            name: "remove",
            label: "移除"
        }];

        this.gridOption = {
            selectionMode: 'none',
            isShowRowNo: true ,
            gridType: 'M',
            tools: tools,
            rowBeforeAdd: this.rowBeforeAdd,
            isEdit: true,
            // primaryKeyFields: ["goodsid"]
        };
        this.gridEditOption = {
            submitServerFields: ['mygoodsid', 'goodsname', 'barcode', 'spec', 'uname', 
                "goodsid", "pdqty", "editor", "notes", 'editdate'],
            duplicateRowFields: ["goodsid"],
            coverFields: ["pdqty",  "notes"],
            cumulateFields: ["pdqty"],
            promptTemplate: "商品[${row.goodsname}]已存在: ${row.pdqty+row.uname}"
        };
        this.gridOption.rowBeforeAdd = this.rowBeforeAdd;

        this.gridPage = {
            pageable: true,
            isServerPage: false
        };

        this.initGridColumns();

    }

    /**
     * 
     */
    private getGridValidation(){
        return {
            notes: "len_0_120",
            editor: 'len_0_16',
            pdqty: (cell, value) => {
                if (value < 0 || value > 10000000 ) {
                    return { results: false, message: "散数范围: 0 到 10,000,000 " };
                }
                return true;
            },
        };
    }

    /**
     * 表格初始化
     */
    private initGridColumns() {
        let columnDefs = [
            { text: "商品内码", datafield: "mygoodsid", align: "left", width: '12%', "editable": false, pinned: true },
            { text: "商品名称", datafield: "goodsname", align: "left", width: '12%', "editable": false, pinned: true },
            { text: "条码", datafield: "barcode", align: "left", "width": '12%', "editable": false, pinned: true},
            { text: "销售规格", datafield: "spec", align: "left", width: '6%', "editable": false },
            { text: "包装单位", datafield: "uname", align: "left", width: '6%', "editable": false },
            { text: "盘点数量", datafield: "pdqty", columntype: "numberinput", "align": "right", "editable": true, "width": '10%' },
            { text: "备注", datafield: "notes", columntype: "string", "align": "left", "editable": true },
/*             { text: "录入人", datafield: "editor", columntype: "combobox",  "align": "left", "editable": true, "width": '10%',
                createeditor: function (row, column, editor) {
                    // assign a new data source to the combobox.
                    let list = ['Stuttgart', 'Rio de Janeiro', 'Strasbourg'];
                    editor.jqxComboBox({ autoDropDownHeight: true, source: list, promptText: "Please Choose:" });
                },
                // update the editor's value before saving it.
                cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
                    // return the old value, if the new value is empty.
                    if (newvalue == "") {
                        return oldvalue;
                    }
                },
                cellsrenderer  : function(row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    return  `<div>${rowdata.editor}&nbsp;${rowdata.editdate}</div>`;
                }

            }, */
            { text: "录入人", datafield: "editor", columntype: "string",  "align": "left", "editable": true, "width": '10%'},
            { text: "操作", datafield: "tools", columntype: "tools", "editable": false, "width": '70' },
        ], 
        columnGroups = [];

        this.mygrid.setColumns(columnDefs, null, columnGroups, this.getGridValidation());
    }


    /**
     * 显示基本信息
     */
    private showHead(event) {
        this.expanded = !this.expanded;
    }
    
    /**
     * 单元格编辑
     */
    cellEndEditEvent(){
        this.isChanged = true;
    }
    
    /**
     * 选择商品
     */
    private selectGoods(data: Array<{ goodsid }>): void {
        if (data[0] && data[0].goodsid){
            this.selectedGoods = data[0];
        }
    }

    /**
     * 添加商品
     */
    doAddToGrid(){
        if (Number.isInteger(this.selectedGoods.goodsid) && this.selectedGoods.goodsid > 0){
            this.isChanged = true;
            this.selectedGoods.pdqty =  this.pdQty;
            this.selectedGoods.notes =  this.pdNotes;
            this.mygrid.edit.addRows(this.selectedGoods);
        }else{
            this.baseService.modalService.modalToast('请选择商品');
        }
        this.clearInput();
    }

    /**
     * 
     */
    private clearInput(){
        this.pdQty = '';
        this.pdNotes = '';
        this.selectedGoods = {goodsid: -1};
        this.goodsInput.clearSelection();
        this.focus();
    }

    /**
     * 从表格移除商品
     */
    doRemove(param: any){
        let goods = param.entitys && param.entitys[0] || {};
        if (goods.goodsid){
            this.isChanged = true;
            this.mygrid.edit.delRows(goods.boundindex);
        }
    }
    
    doBack() {
        // 返回列表
        this.finishInput();
    }
    
    doFinishInput() {
        // 返回列表
        this.finishInput();
    }


    /**
     * 保存
     */
    doSave(){
        if (!this.isChanged){
            this.baseService.modalService.modalToast('您未修改数据!');
            return ;
        }
        this.baseService.modalService.modalConfirm('确认数据已经录入完成并提交数据？',
            '盘点录入', 'warning', '确认', '取消').subscribe( data => {
                if (data == "OK"){
                    // 确认盘点
                    this.commitData();
                } else {
                    // 取消确认盘点
                }
            });
    }

    /**
     * 提交数据
     */
    private commitData(){
        let param = {
            stockid: this.headInfo.stockid,
            sheetid: this.headInfo.sheetid,
            items: this.mygrid.edit.getSubmitServerData()
        };
        this.stockPdykEditService.doSave(param).subscribe( (data: SuiResponse<any>) => {
            console.log('提交数据', data);
            if (data.retCode == SUCC){
                this.isChanged = false;
                this.finishInput(this.headInfo);
            }else if ( data.retCode.toString() == 'PART_SUCCESS' ){
                // 部分失败 提示失败原因
                let items = data.data.result;
                this.showBatchResult(items);
            } else {
                this.baseService.modalService.modalToast(data.message);
            }
        });
    }

    /**
     * 录入完成
     */
    private finishInput(param: any = {}) {
        if (!this.isChanged){
            this.doCancel({entity: this.headInfo});
            return ;
        }
        this.baseService.modalService.modalConfirm('您还有数据未提交，是否要保存？',
            '盘点录入', 'warning', '确认', '取消').subscribe( data => {
                if (data == "OK"){
                    // 确认
                    this.doSave(); 
                } else {
                    // 取消
                    this.doCancel();
                }
            });
    }

    /**
     * 取消
     */
    doCancel(param: any = {}){
        this.closePage();
        this.goToPage(this.ATTR.B, param, this.tab.moduleid);
    }
    
    onClose(event){
        this.el_openBatchResult.close(event);
    }
    
    /**
     * 显示批量失败
     */
    private showBatchResult(arr: Array<any>){
        let items = [];
        arr.forEach(item => {
            item.refinfo.retmsg = item.retmsg;
            items.push(item.refinfo);
        });
        console.log('显示批量失败', items);
        
        this.el_openBatchResult.open({items: items});
    }
}
