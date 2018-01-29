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
    OnChanges,
    AfterViewInit
} from '@angular/core';
import { CACHE_IDS } from '../../../../common/services/storage/cache-ids';
import { ClassUtil } from './../../../../common/services/utils/class-util';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../../common/top-common/top-common';
import { Injectable } from '@angular/core';
import { SuiOrganService } from './sui-organ.service';
import { GridOption, GridPage } from '../../../components/grid/grid-option';
import { Grid } from '../../../components/grid/grid';
import { SuiAutoComplete } from '../../../components/auto-complete/sui-auto-complete';


@Component({
    selector: 'sui-organ',
    templateUrl: './sui-organ.html',
    styleUrls: [
        './sui-organ.scss'
    ],
    // encapsulation: ViewEncapsulation.None,
})
export class SuiOrganComponent implements OnInit, AfterViewInit {
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
    placeholder: string = "请输入名称、助记码、联系电话";
    /**
     * 自动补全插件
     */
    @ViewChild('myOrgan') myOrgan: SuiAutoComplete;
    /**
     * 更多选择弹窗
     */
    @ViewChild('moreOrgan') moreOrgan;
    /**
     * 表格
     */
    @ViewChild('mygrid') mygrid: Grid;

    /**
     * 选中的值
     * 选中则传选中的对象
     * 清除则传空字符串
     */
    @Output() selectOrgan: EventEmitter<Array<object>> = new EventEmitter<Array<object>>();

    /**
     * 机构类型
     * 所有机构：-1；
     * 店铺(shop)： 1；
     * 非店铺仓库(stock)： 33
     * 店内仓(shopStock): 1
     * 所有仓库(allStock): -1
     */
    private orgTypeNum: number;
    private _orgType: number = -1;

    @Input('orgType') 
    set orgType (val: any) {
        if(val === "shop") {
            this._orgType = 1;
        } else if(val === "stock") {
            this._orgType = 33;
            this.orgTypeNum = 33;
        } else if(val === "allStock") {
            this._orgType = 33;
            this.orgTypeNum = -1;
        } else if(val === "shopStock") {
            this._orgType = 33;
            this.orgTypeNum = 1;
        } else {
            this._orgType = -1;
        }
    }

    get orgType(): any {
        return this._orgType;
    }
    @Input('customTabindex') customTabindex ;
    /**
     * 是否多选
     * @param isMulit
     */
    @Input('isMult') isMult = false;

    /**
     * 定义默认值
     * 
     */
    @Input('defSelectedItem') defSelectedItem: any;

    // 组件类的构造器
    constructor(
        private myService: SuiOrganService,
    ) { 
    }

    // ngOnInit
    ngOnInit() {
        this.initAutoComplete();
        this.initGrid();
        // this.moreOrgan.open();
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    /**
     * 初始化自动补全插件
     */
    private initAutoComplete() {
        let opt = {
            titles: this.orgType == 33 ? "仓库编码,仓库名称,仓管员,联系电话,地址" : "机构编码,机构名称,联系人,联系电话,地址",
            fields: this.orgType == 33 ? "stockid,ename,manager,contacttele,address" : "eid,ename,manager,contacttele,address",
            filterFileds: this.orgType == 33 ? {ename: "仓库名称", helpcode: "助记码", contacttele: "联系电话"} : {ename: "机构名称", helpcode: "助记码", contacttele: "联系电话"}
        }  
        this.option = {
            isMult: this.isMult,
            cellWidths: "15%,25%,10%,15%,35%",
            titles: opt.titles,
            fields: opt.fields,
            filterFileds: opt.filterFileds,
            cacheId: CACHE_IDS.AC_FLITER_ORGAN,
            beforeSelectData: (data): boolean => {
                // data.map(item => { item.id = 1000; return data});
                console.log(">>>beforeSelectData", data);
                return true;
            },
            selectData: (data) => {
                console.log(">>>selectData", data);
                this.selectOrgan.emit(data instanceof Array ? data : [data]);
            },
            loadDataInterface: (searchKey: string, filterFields: string): Observable<any> => {
                console.debug("auto-complete request server", filterFields, searchKey);
                console.log('filterFields==', filterFields)
                let filterParams = {
                    ename: 1,
                    helpcode: 2,
                    contacttele: 4
                };

                let filterParam = 0;

                if(filterFields) {
                    // let str = '';
                    if(filterFields.indexOf(',') != -1) {
                        let myfilterArr = filterFields.split(',');
                        myfilterArr.forEach((item, i) => {
                            // str = str ? str + '、' + opt.filterFileds[item] : opt.filterFileds[item];
                            filterParam += filterParams[item];
                        })
                    } else {
                        filterParam = filterParams[filterFields];
                        // str = filterFields;
                    }
                    // console.log('filterFields==', str)
                    // this.placeholder = `请输入${str}`;
                    // console.log('filterFields==', this.placeholder)
                }

                if(this.orgType == 33) {
                    return this.myService.getStorehouseList(searchKey, filterParam, this.orgTypeNum);
                }
                return this.myService.getOrganList(searchKey, filterParam, this.orgType);
            },
            goToAdvanceSearch: (searchKey: string): void => {
                console.log("auto-complete goToAdvanceSearchr", searchKey);
                this.searchKey = searchKey;
                
                this.moreOrgan.open();
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
            selectionMode: this.isMult ? "checkbox" : "singlerow",
            isShowRowNo: true ,
            tools: null,
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            if(this.orgType == 33) {
                return this.myService.getStorehouseData(param, this.searchKey, this.orgType);
            }
            return this.myService.getOrganData(param, this.searchKey, this.orgType)
        };
        
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {
        let columnTemplate = {
            stockid: '<span>${value || rowdata.eid}</span>'
        };

        let columndef = [
            {"text":"机构编码", "datafield":"stockid","align":"center", "width": 100, columntype: 'template'},
            {"text":"机构名称", "datafield":"ename","align":"center", "width": 150},
            {"text":"地址", "datafield":"address","align":"center"},
            {"text":"联系人", "datafield":"manager","align":"center", "width": 100},
            {"text":"联系电话", "datafield":"contacttele","align":"center", "width": 120}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);

    }

    /**
     * 获取表格数据
     */
    // gridLoadFn() {
    //     let loadFn = () => {
    //         // return this.myService.getOrganList(this.searchKey);
    //     }
    //     return loadFn;
    // }

    clearSelection() {
        this.myOrgan.clearSelection();

    }

    /**
     * 自动补全选择框change函数
     */
    autoChange(event) {
        let item = this.myOrgan.getSelectedItems();
        console.log(">>>>>>>>>>>>>>>>>>>>",item);
        if(item.length === 0) {
            this.selectOrgan.emit([]);
        }
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
console.log(selData);
        if(selData.length === 1) {
            // this.defSelectedItem = selData[0];

            this.myOrgan.setDefSelectedData(selData[0]);

        } else if(selData.length > 1) {
            this.selectOrgan.emit(selData);
            this.mygrid.clearselection();
        }

        this.moreOrgan.close();
    }

    /**
     * 弹出框----取消
     */
    doClose() {
        this.moreOrgan.close();
    }

}
