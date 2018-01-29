import {
    Component
    , OnInit
    , ElementRef
    , ViewEncapsulation
    , ViewChild
} from '@angular/core';
import { BaseDetailComponent } from '../../../../common/top-common/base-detail.component';
import { BaseDetailService } from '../../../../common/top-common/base-detail.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { ReplenishDetailService } from './replenish-detail.service';
import { TemplateDetailOption } from './../../../../common/components/templates/template-detail';
import { ToolBarData, ToolBarButton } from './../../../../common/components/toolbar/toolbar';
import { GridOption, GridEditOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { ReplenishInfo } from './replenish-edit.component';
import { Grid } from '../../../../common/components/grid/grid';

/*
 * 补货申请模块——详情组件
 * @Author: xiahl 
 * @Date: 2017-12-27 17:10:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-22 16:47:53
 */
@Component({
    templateUrl: './replenish-detail.html',
    styleUrls: ['./replenish-detail.scss']
})
export class ReplenishDetailComponent extends BaseDetailComponent implements OnInit {
    /** template-edit配置参数 */
    option: TemplateDetailOption = {};
    /** 工具栏 */
    tools: ToolBarButton[];
    /** 额外工具栏 */
    extraBtns: ToolBarButton[];
    /** 工具栏数据 toolBarData */
    toolBarData: ToolBarData;
    /** 基本信息是否展开 */
    expanded: boolean = true;
    /** 模块ID */
    moduleId: number;
    /** 路由参数 */
    routerParam: any;
    /** 补货申请单信息 */
    replenishInfo: ReplenishInfo;
    /** 表格配置信息 */
    gridOption: GridOption<any>;
    page: GridPage;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];
    /** 表格实例对象 */
    @ViewChild('grid') mygrid: Grid;

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseDetailService: BaseDetailService,
        private myService: ReplenishDetailService,
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        let sheetid = this.routerParam.entity.sheetid;
        super.requestConfigBeforePageInit([
            this.myService.getDetail(sheetid)
        ]).subscribe(results => {
            // 1. 判断返回的数据是否正确
            let res = results[0];
            if (res.retCode !== 0) {
                this.myService.modalSer.modalToast(res.message);
                return;
            };
            // 2. 初始化头信息
            let head = res.data.result.head,
                items = res.data.result.items,
                data = Object.assign({}, head, {
                    items: items
                });
            this.initInputParam(data);
            // 3. 动态初始化按钮数据和状态
            this.toolBarData = {
                entity: head,
                primaryKeyFields: ['sheetid']
            };
            let states = {
                'edit': this.replenishInfo.status <= 0,
                'del,check,editComplete': this.replenishInfo.status == 0
            };
            this.baseService.setToolBarStates(this.tools, states);
            // 4. 初始化表格数据
            this.mygrid.setData(this.replenishInfo.items);
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initTemplateDetailOption();
        this.initToolbar();
        this.initGrid();
        this.initInputParam(Object.create(null));
        this.loadPageInitData();
    }

    /**
     * 主表信息展开更多内容切换
     * @param event 
     */
    mainInfoToggle(event) {
        this.expanded = event.expanded;
    }

    /**
     * 初始化表单录入参数
     */
    private initInputParam(data) {
        this.replenishInfo = {
            sheetid: data.sheetid || '自动生成',
            editor: data.editor || '',
            editdate: data.editdate || '',
            checker: data.checker || '',
            checkdate: data.checkdate || '',
            overduedate: data.overduedate || '',
            shopeid: data.shopeid || -1,
            fullname: data.fullname || '',
            status: data.status || 0,
            statusName: data.status === 0 ? '待提交' : '已提交',
            type: data.type || 1,
            typeName: data.type === 1 ? "手工补货" : data.type === 2 ? "按支持天数" : "按库存阈值",
            items: data.items || []
        }
    }

    /**
    * 初始化TemplateList 
    * 模板配置项: Option
    * 该模块ID  : moduleId
    */
    private initTemplateDetailOption() {
        this.option.tab = this.tab;
        this.moduleId = this.tab.moduleid;
        // 初始化当前页签路由参数
        if (!this.baseService.commonServices.classUtil.isObject(this.tab.routerParam)) {
            this.tab.routerParam = JSON.parse(this.tab.routerParam);
        }
        this.routerParam = this.tab.routerParam;
    }

    /**
     * 初始化工具栏
     * 可以设置额外的按钮: extraBtns 
     */
    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight);
        let states = { 'add,copy,cancel': false };
        this.baseService.setToolBarStates(this.tools, states);
    }

    /**
     * 初始化表格列表
     */
    private initGrid() {
        this.gridOption = {
            gridType: "B",
            tools: this.getTools(),
            rowBeforeAdd: this.rowBeforeAdd,
            columns: [this.getColumnDefs(), this.getColumnGroups(), this.getColumnTpls(), this.getGridValidators()]
        };
        this.page = {
            pageable: false,
            isServerPage: false
        };
    }

    private rowBeforeAdd = (row): boolean => {
        row.totalValue = this.baseService.commonServices.classUtil.toNum(row.oiqty * row.price);
        let rowToolState = {
            delItemRow: true
        }
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    private getTools(): ToolBarButton[] {
        return [{
            name: "delItemRow",
            label: "移除"
        }];
    }

    private getColumnDefs() {
        return [
            { "text": "商品内码", "datafield": "goodsid", "columntype": "Number", "width": 80, "editable": false, "pinned": true },
            { "text": "商品名称", "datafield": "goodsname", "width": 120, "editable": false, "pinned": true },
            { "text": "条码", "datafield": "barcode", "align": "center", "width": 100, "editable": false, "pinned": true },
            { "text": "销售规格", "datafield": "spec", "width": 80, "editable": false },
            { "text": "包装单位", "datafield": "uname", "width": 60, "editable": false },
            { "text": "补货数量", "datafield": "qty", "align": "right", "editable": false, "width": 100 },
            { "text": "当前库存", "datafield": "accqty", "align": "right", "editable": false, "width": 100 },
            { "text": "在途库存", "datafield": "wayqty", "align": "right", "editable": false, "width": 100 }
        ];
    }

    private getColumnGroups() {
        return [];
    }

    private getColumnTpls() {
        return {};
    }

    private getGridValidators() {
        return {};
    }

    /**
     * 页面刷新
     */
    private refresh() {
        this.loadPageInitData();
    }

    /**
     * 编辑
     * @param param 
     * @param originalEvent 
     */
    protected doEdit(param, originalEvent?) {
        // 1. 前置判断
        if (this.replenishInfo && this.replenishInfo.status > 1) {
            this.baseService.modalService.modalToast("操作失败: 仅在待提交状态下可以操作！");
            return;
        };
        // 2. 进入编辑模式
        let _param = {
            sheetid: this.replenishInfo.sheetid
        }
        this.goToPage(this.ATTR.M, _param, this.tab.moduleid);
    }

    /**
    * 确定审核
    * @param param 
    * @param event 
    */
    private doConfirmCheck(param, event) {
        let _param = {
            optype: 1,
            sheetid: param.entitys[0].sheetid
        };
        this.myService.operate(_param).subscribe((res) => {
            this.refresh();
        });
    }

    /**
     * 确定删除
     * @param param 
     * @param event 
     */
    private doConfirmDel(param, event) {
        let _param = {
            optype: 4,
            sheetid: param.entitys[0].sheetid
        };
        this.myService.operate(_param).subscribe((res) => {
            super.doList(_param);
            super.closePage();
        });
    }

}