import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    ViewChild,
    forwardRef,
    OnInit,
    HostListener,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import { CACHE_IDS } from '../../../../common/services/storage/cache-ids';
import { ClassUtil } from './../../../../common/services/utils/class-util';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../../common/top-common/top-common';
import { Injectable } from '@angular/core';
import { SuiSupplierService } from './sui-supplier.service';
import { GridOption, GridPage } from '../../../components/grid/grid-option';
import { Grid } from '../../../components/grid/grid';
import { SuiAutoComplete } from '../../../components/auto-complete/sui-auto-complete';


@Component({
    selector: 'sui-supplier',
    templateUrl: './sui-supplier.html',
    styleUrls: [
        './sui-supplier.scss'
    ],
    // encapsulation: ViewEncapsulation.None,
})
export class SuiSupplierComponent implements OnInit, AfterViewInit {
    /**
     * 自动补全配置参数
     */
    option: object;
    /**
     * grid配置参数
     */
    gridOption: GridOption<any>;
    /**
     * grid分页配置参数
     */
    gridPage: GridPage;
    /**
     * grid选择弹窗搜索参数
     */
    searchKey: any;
    /**
     * 自动补全插件
     */
    @ViewChild('mySupplier') mySupplier: SuiAutoComplete;
    /**
     * 更多选择弹窗
     */
    @ViewChild('moreSupplier') moreSupplier;
    /**
     * 表格
     */
    @ViewChild('mygrid') mygrid: Grid;

    @Input('customTabindex') customTabindex ;

    /**
     * 定义默认值
     * 
     */
    @Input('defSelectedItem') defSelectedItem: object;

    /**
     * 选中的值
     * 选中则传选中的对象
     * 清除则传空字符串
     */
    @Output() selectSupplier: EventEmitter<object | string> = new EventEmitter<object | string>();

    // 组件类的构造器
    constructor(
        private myService: SuiSupplierService
    ) { }

    // ngOnInit
    ngOnInit() {
        this.initAutoComplete();
        this.initGrid();
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    /**
     * 初始化自动补全插件
     */
    private initAutoComplete() {
        this.option = {
            isMult: false,
            cellWidths: "15%,30%,10%,15%,30%",
            titles: "供应商内码,供应商名称,联系人,联系电话,供应商地址",
            fields: "mycode,ename,contact,contacttele,address",
            filterFileds: {mycode: "内码",ename: "名称", helpcode: "助记码"},
            cacheId: CACHE_IDS.AC_FLITER_VENDER,
            beforeSelectData: (data): boolean => {
                // data.map(item => { item.id = 1000; return data});
                console.log(">>>beforeSelectData", data);
                return true;
            },
            selectData: (data) => {
                console.log(">>>selectData", data);
                this.selectSupplier.emit(data instanceof Array ? data : [data]);
            },
            loadDataInterface: (searchKey: string, filterFields: string): Observable<any> => {
                console.debug("auto-complete request server", filterFields, searchKey);
                return this.myService.getSupplierData({key: searchKey, filterFields: filterFields});
            },
            goToAdvanceSearch: (searchKey: string): void => {
                console.log("auto-complete goToAdvanceSearchr", searchKey);
                this.searchKey = searchKey;
                this.moreSupplier.open();
                this.doSearch();
            }
        };

        // console.debug(">>>>>>>>>>>>>>>>>>>>", this.baseService.commonServices.classUtil.isEmptyObject(this.option.filterFileds));
        // console.debug(">>>>>>>>>>>>>>>>>>>>", this.baseService.commonServices.classUtil.isObject(this.option.filterFileds));
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true ,
            tools: null,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = this.gridLoadFn();

    }

    /**
     * 初始化表格列表
     */
    initGridColumns() {

        let columndef = [
            {"text":"供应商内码", "datafield":"mycode","align":"center", "width": 100},
            {"text":"供应商名称", "datafield":"ename","align":"center", "width": 150},
            {"text":"地址", "datafield":"address","align":"center"},
            {"text":"联系人", "datafield":"contact","align":"center", "width": 100},
            {"text":"联系电话", "datafield":"contacttele","align":"center", "width": 120}
        ]

        this.mygrid.setColumns(columndef);
    }

    /**
     * 获取表格数据
     */
    gridLoadFn() {
        let loadFn = () => {
            return this.myService.getSupplierList(this.searchKey);
        }
        return loadFn;
    }

    /**
     * 自动补全选择框change函数
     */
    autoChange(event) {
        let item = this.mySupplier.getSelectedItems();
        console.log(">>>>>>>>>>>>>>>>>>>>",item);
        if(item.length === 0) {
            this.selectSupplier.emit([]);
        }
    }

    clearSelection() {
        this.mySupplier.clearSelection();
    }

    /**
     * 弹出框----搜索
     */
    doSearch() {
        console.log(this.searchKey)
        this.mygrid.load();
    }

    /**
     * 弹出框----确定
     */
    doConfirm() {
        let selData = this.mygrid.selection.getSelectRows();
        this.mySupplier.setDefSelectedData(selData[0])
        this.moreSupplier.close();
        // this.mySupplier.selectIndex(0);
    }

    /**
     * 弹出框----取消
     */
    doClose() {
        this.moreSupplier.close();
    }

}
