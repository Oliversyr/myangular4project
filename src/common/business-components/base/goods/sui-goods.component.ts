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
import { SuiGoodsService } from './sui-goods.service';
import { GridOption, GridPage } from '../../../components/grid/grid-option';
import { Grid } from '../../../components/grid/grid';
import { SuiAutoComplete } from '../../../components/auto-complete/sui-auto-complete';


@Component({
    selector: 'sui-goods',
    templateUrl: './sui-goods.html',
    styleUrls: [
        './sui-goods.scss'
    ],
    // encapsulation: ViewEncapsulation.None,
})
export class SuiGoodsComponent implements OnInit, AfterViewInit {
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
    @ViewChild('myGoods') myGoods: SuiAutoComplete;
    /**
     * 更多选择弹窗
     */
    @ViewChild('moreGoods') moreGoods;
    /**
     * 表格
     */
    @ViewChild('mygrid') mygrid: Grid;

    @Input('customTabindex') customTabindex ;

    /**
     * 选中的值
     * 选中则传选中的对象
     * 清除则传空字符串
     */
    @Output() selectGoods: EventEmitter<object | string> = new EventEmitter<object | string>();
    /**
     * 定义默认值
     * 
     */
    @Input('defSelectedItem') defSelectedItem: any;
    /**
     * 是否多选
     */
    @Input('isMult') isMult = false;

    /**
     * 店铺id，若存在则走店铺商品
     */
    @Input('shopeid') shopeid;

    // 组件类的构造器
    constructor(
        private myService: SuiGoodsService
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
            isMult: this.isMult,
            cellWidths: "15%,30%,10%,5%,10%,30%",
            titles: "商品编码,商品名称,商品规格,单位,可销售数量,最新订货时间",
            fields: "barcode,goodsname,spec,uname,stockqtyMsg,hisnotes",
            filterFileds: {mygoodsid: "商品内码",goodsname: "商品名称", helpcode: "助记码", barcode: "商品条码"},
            cacheId: CACHE_IDS.AC_FLITER_GOODS,
            beforeSelectData: (data): boolean => {
                // data.map(item => { item.id = 1000; return data});
                console.log(">>>beforeSelectData", data);
                return true;
            },
            selectData: (data) => {
                console.log(">>>selectData", data);
                this.selectGoods.emit(data instanceof Array ? data : [data]);
            },
            loadDataInterface: (searchKey: string, filterFields: string): Observable<any> => {
                console.log("auto-complete request server", filterFields, searchKey);
                let filterParams = {
                    goodsname: 1,
                    mygoodsid: 2,
                    helpcode: 4,
                    barcode: 8
                };

                let filterParam = 0;

                if(filterFields) {
                    let str = '';
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
                    console.log('filterFields==', str)
                    // this.placeholder = `请输入${str}`;
                    // console.log('filterFields==', this.placeholder)
                }
                let obj = {
                    key: searchKey,
                    shopeid: null
                }

                if(this.shopeid) {
                    obj.shopeid = this.shopeid;
                    return this.myService.getShopGoodsData('auto', obj, filterParam);
                }

                return this.myService.getGoodsData('auto', obj, filterParam);
            },
            goToAdvanceSearch: (searchKey: string): void => {
                console.log("auto-complete goToAdvanceSearchr", searchKey);
                this.searchKey = searchKey;
                this.moreGoods.open();
                this.doSearch();
            }
        };
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
            let obj = Object.assign({key: this.searchKey}, param);
            if(this.shopeid) {
                obj.shopeid = this.shopeid;
                return this.myService.getShopGoodsData('grid', obj, 15);
            }
            return this.myService.getGoodsData('grid', obj, 15);
        }
        
    }

    /**
     * 初始化表格列表
     */
    initGridColumns() {

        let columndef = [
            {"text":"条码", "datafield":"barcode","align":"center", "width": 100},
            {"text":"商品名称", "datafield":"goodsname","align":"center", "width": 150},
            {"text":"规格", "datafield":"spec","align":"center"},
            {"text":"单位", "datafield":"uname","align":"center", "width": 100},
            {"text":"价格", "datafield":"bulkprice","align":"center", "width": 120},
            {"text":"库存数", "datafield":"stockqtyMsg","align":"center", "width": 120}
        ]

        this.mygrid.setColumns(columndef);

    }

    /**
     * 自动补全选择框change函数
     */
    autoChange(event) {
        let item = this.myGoods.getSelectedItems();
        console.log(">>>>>>>>>>>>>>>>>>>>",item);
        if(item.length === 0) {
            this.selectGoods.emit([]);
        }
    }

    clearSelection() {
        this.myGoods.clearSelection();
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

        if(selData.length === 1) {
            // this.defSelectedItem = selData[0];
            this.myGoods.setDefSelectedData(selData[0]);
        } else if(selData.length > 1) {
            this.selectGoods.emit(selData);
            this.mygrid.clearselection();
        }

        console.log(selData)
        this.moreGoods.close();
        // this.myGoods.selectIndex(0);
    }

    /**
     * 弹出框----取消
     */
    doClose() {
        this.moreGoods.close();
    }

}
