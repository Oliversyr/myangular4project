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
import { BaseListComponent } from './../../../../common/top-common/base-list.component';
import { Injectable } from '@angular/core';
import { SuiCustomerService } from './sui-customer.service';
import { GridOption, GridPage } from '../../../components/grid/grid-option';
import { Grid } from '../../../components/grid/grid';
import { SuiAutoComplete } from '../../../components/auto-complete/sui-auto-complete';

@Component({
    selector: 'sui-customer',
    templateUrl: './sui-customer.html',
    styleUrls: [
        './sui-customer.scss'
    ],
    // encapsulation: ViewEncapsulation.None,
})
export class SuiCustomerComponent extends BaseListComponent implements OnInit, AfterViewInit {
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
    @ViewChild('myCustom') myCustomer: SuiAutoComplete;
    /**
     * 更多选择弹窗
     */
    @ViewChild('moreCustom') moreCustom;
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
    @Output() selectCustom: EventEmitter<object | string> = new EventEmitter<object | string>();

    // 组件类的构造器
    constructor(
        private myService: SuiCustomerService
    ) { 
        super()
    }

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
            cellWidths: "15%,30%,30%,10%,15%",
            titles: "客户内码,客户名称,客户地址,联系人,联系电话",
            fields: "mycode,ename,address,contact,contactmobile",
            filterFileds: {mycode: "客户内码",ename: "客户名称", helpcode: "助记码", contactmobile: "联系电话"},
            cacheId: CACHE_IDS.AC_FLITER_CUSTOMER,
            beforeSelectData: (data): boolean => {
                // data.map(item => { item.id = 1000; return data});
                console.log(">>>beforeSelectData", data);
                return true;
            },
            selectData: (data) => {
                console.log(">>>selectData", data);
                this.selectCustom.emit(data instanceof Array ? data : [data]);
            },
            loadDataInterface: (searchKey: string, filterFields: string): Observable<any> => {
                console.debug("auto-complete request server", filterFields, searchKey);
                return this.myService.getCustomData({key: searchKey, filterFields: filterFields});
            },
            goToAdvanceSearch: (searchKey: string): void => {
                console.log("auto-complete goToAdvanceSearchr", searchKey);
                this.searchKey = searchKey;
                this.moreCustom.open();
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
            {"text":"客户内码", "datafield":"mycode","align":"center", "width": 100},
            {"text":"客户名称", "datafield":"ename","align":"center", "width": 150},
            {"text":"地址", "datafield":"address","align":"center"},
            {"text":"联系人", "datafield":"contact","align":"center", "width": 100},
            {"text":"价格组", "datafield":"groupname","align":"center", "width": 100},
            {"text":"联系电话", "datafield":"contactmobile","align":"center", "width": 120}
        ]

        this.mygrid.setColumns(columndef);
    }

    /**
     * 获取表格数据
     */
    gridLoadFn() {
        let loadFn = () => {
            return this.myService.getCustomList(this.searchKey);
        }
        return loadFn;
    }

    /**
     * 自动补全选择框change函数
     */
    autoChange(event) {
        let item = this.myCustomer.getSelectedItems();
        console.log(">>>>>>>>>>>>>>>>>>>>",item);
        if(item.length === 0) {
            this.selectCustom.emit([]);
        }
    }

    clearSelection() {
        this.myCustomer.clearSelection();
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
        this.myCustomer.setDefSelectedData(selData[0])
        console.log(selData)
        this.moreCustom.close();
        // this.myCustom.selectIndex(0);
    }

    /**
     * 弹出框----取消
     */
    doClose() {
        this.moreCustom.close();
    }

    /**
     * 跳转到我的客户
     */
    // customIconClick() {
    //     let rightValue = true;
    //     if(rightValue) {
    //         // super.ngOnInit();
    //         super.goToPage(this.ATTR.L, {}, 1121);
    //     }
    // }

}
