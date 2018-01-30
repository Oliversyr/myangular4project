import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    ViewChild,
    forwardRef,
    OnInit,
    HostListener,
    EventEmitter
} from '@angular/core';
import { CACHE_IDS } from '../../../../common/services/storage/cache-ids';
import { ClassUtil } from './../../../../common/services/utils/class-util';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../../common/top-common/top-common';
import { BaseListComponent } from './../../../../common/top-common/base-list.component';
import { Injectable } from '@angular/core';
import { SuiAccCustomerService } from './sui-acc-customer.service';
import { GridOption, GridPage } from '../../../components/grid/grid-option';
import { Grid } from '../../../components/grid/grid';


@Component({
    selector: 'sui-acc-customer',
    templateUrl: './sui-acc-customer.html',
    styleUrls: [
        './sui-acc-customer.scss'
    ],
})
export class SuiAccCustomerComponent extends BaseListComponent implements OnInit {
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
     * placeHolder
     */
    placeholder: string = "请输入客户编码、名称、联系电话";
    /**
     * 自动补全插件
     */
    @ViewChild('myCustomer') myCustomer;
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
        private myService: SuiAccCustomerService
    ) { 
        super()
    }

    // ngOnInit
    ngOnInit() {
        this.initAutoComplete();
        this.initGrid();
    }

    /**
     * 初始化自动补全插件
     */
    private initAutoComplete() {
        this.option = {
            isMult: false,
            cellWidths: "30%,30%,15%,25%",
            titles: "客户编码,客户名称,联系人,联系电话",
            fields: "custid,name,contact,contacttele",
            filterFileds: {mycode: "客户编码",ename: "客户名称", contacttele: "联系电话"},
            cacheId: CACHE_IDS.AC_FLITER_CUSTOMER,
            beforeSelectData: (data): boolean => {
                console.log(">>>beforeSelectData", data);
                return true;
            },
            selectData: (data) => {
                this.selectCustom.emit(data instanceof Array ? data : [data]);
            },
            loadDataInterface: (searchKey: string, filterFields: string): Observable<any> => {
                console.log("auto-complete request server", filterFields, searchKey);
                return this.myService.getCustomData(searchKey);
            },
            goToAdvanceSearch: (searchKey: string): void => {
                console.log("auto-complete goToAdvanceSearchr", searchKey);
                this.searchKey = searchKey;
                this.moreCustom.open();
                this.doSearch();
            }
        };
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true ,
            tools: null,
        };

        this.gridOption.loadDataInterface = this.gridLoadFn();

        this.gridPage = {
            pageNum: 1,
            pageSize: 10
        }
    }
     /**
     * 表格初始化完成后执行
     */
    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    } 

    /**
     * 初始化表格列表
     */
    initGridColumns() {
        let columndef = [
            {"text":"客户编号", "datafield":"custid","align":"center", "width": 180},
            {"text":"客户名称", "datafield":"name","align":"center", "width": 200},
            {"text":"联系人", "datafield":"contact","align":"center", "width": 150},
            {"text":"联系电话", "datafield":"contacttele","align":"center", "width": 180}
        ]

        this.mygrid.setColumns(columndef);
    }

    /**
     * 获取表格数据
     */
    gridLoadFn() {
        let loadFn = () => {
            this.mygrid.clearselection();
            return this.myService.getCustomList(this.searchKey);
        }
        return loadFn;
    }

    /**
     * 自动补全选择框change函数
     */
    autoChange(event) {
        let item = this.myCustomer.getSelectedItems();
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
        let selIndex = this.mygrid.selection.getSelectRows();
        this.myCustomer.setDefSelectedData(selIndex[0])
        this.moreCustom.close();
    }

    /**
     * 弹出框----取消
     */
    doClose() {
        this.moreCustom.close();
    }

}
