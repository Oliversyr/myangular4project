import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    ViewChild,
    OnInit,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CACHE_IDS } from '../../../../common/services/storage/cache-ids';
import { TopCommon } from './../../../../common/top-common/top-common';
import { GridOption, GridPage } from '../../../components/grid/grid-option';
import { Grid } from '../../../components/grid/grid';
import { SuiGroupsService } from './sui-groups.service';

/*
 * 业务组件: 所属店组
 * @Author: xiahl 
 * @Date: 2018-01-09 10:32:04 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-22 14:53:48
 */
@Component({
    selector: 'sui-groups',
    templateUrl: './sui-groups.html',
    styleUrls: ['./sui-groups.scss']
})
export class SuiGroupsComponent implements OnInit {
    /** 自动补全配置参数 */
    option: object;
    /** grid配置参数 */
    gridOption: GridOption<any>;
    /** grid分页配置参数 */
    gridPage: GridPage;
    /** grid选择弹窗搜索参数 */
    searchKey: any;
    /** 自动补全插件 */
    @ViewChild('myGroups') myGroups;
    /** 更多选择弹窗 */
    @ViewChild('moreGroups') moreGroups;
    /** 表格 */
    @ViewChild('mygrid') mygrid: Grid;
    /** 组件Tab序号 */
    @Input('customTabindex') customTabindex;
    /** 选中的值 */
    @Output() selectGroups: EventEmitter<object | string> = new EventEmitter<object | string>();

    constructor(
        private myService: SuiGroupsService
    ) {

    }

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
            cellWidths: "15%,15%,10%,30%,10%",
            titles: "店组编码,店组名称,拥有店铺,备注,状态",
            fields: "groupId,groupName,storeNum,notes,statusName",
            filterFileds: { groupName: "店组名称" },
            cacheId: CACHE_IDS.AC_FLITER_GROUPS,
            beforeSelectData: (data): boolean => {
                console.log(">>>beforeSelectData", data);
                return true;
            },
            selectData: (data) => {
                console.log(">>>selectData", data);
                this.selectGroups.emit(data instanceof Array ? data : [data]);
            },
            loadDataInterface: (searchKey: string, filterFields: string): Observable<any> => {
                console.debug("auto-complete request server", filterFields, searchKey);
                return this.myService.getAutoCompleteData({ groupName: searchKey, keyValue: '', status: 1 });
            },
            // goToAdvanceSearch: (searchKey: string): void => {
            //     console.log("auto-complete goToAdvanceSearchr", searchKey);
            //     this.searchKey = searchKey;
            //     this.moreGroups.open();
            //     this.doSearch();
            // }
        };
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true,
            tools: null
        };
        this.gridOption.loadDataInterface = this.gridLoadFn();
        setTimeout(() => {
            this.initGridColumns();
            this.mygrid.load();
        }, 1000)
    }

    /**
     * 初始化表格列表
     */
    initGridColumns() {
        let columndef = [
            { "text": "店组编码", "datafield": "groupId", "align": "center", "width": 100 },
            { "text": "店组名称", "datafield": "groupName", "align": "center", "width": 100 },
            { "text": "拥有店铺", "datafield": "storeNum", "align": "center", "width": 150 },
            { "text": "备注", "datafield": "notes", "align": "center" },
            { "text": "状态", "datafield": "statusName", "align": "center", "width": 100 }
        ]
        this.mygrid.setColumns(columndef);
    }

    /**
     * 获取表格数据
     */
    gridLoadFn() {
        let loadFn = () => {
            return this.myService.getList(this.searchKey);
        }
        return loadFn;
    }

    /**
     * 自动补全选择框change函数
     */
    autoChange(event) {
        let item = this.myGroups.getSelectedItems();
        if (item.length === 0) {
            this.selectGroups.emit([]);
        }
    }

    /**
     * 清除控件的显示值
     */
    clearSelection() {
        this.myGroups.clearSelection();
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
        let selIndex = this.mygrid.getselectedrowindex();
        let selData = this.mygrid.getrowdata(selIndex);
        this.selectGroups.emit(selData);
        this.moreGroups.close();
    }

    /**
     * 弹出框----取消
     */
    doClose() {
        this.moreGroups.close();
    }

}
