import { GridData } from './grid-data-entity';
import { SuiValidatorGridService } from './../validator/sui-validator-grid.service';
import { GridValidator } from './grid-validator';
import { GridDuplicatrowAlert } from './grid-duplicatrow-alert';
import { GridSelection } from './grid-selection';
import { GridEdit } from './grid-edit';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { GridColumnDef } from './grid-column';
import { GridPage, GridOption, GridEditOption } from './grid-option';
import { GridUtilService } from './grid-util.service';
import { ToolBarButton, EmitOption } from './../toolbar/toolbar';
import { GridSort } from './grid-sort';
import { CommonServices, CommonServicesModule } from './../../services/groups/common-services.module';
import { Observable } from 'rxjs/Observable';
import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { getLocalization } from './localization-grid';

import {
    Component, OnInit, OnDestroy, NgModule, Input, Output, EventEmitter, ElementRef, ViewChild,
    TemplateRef, ViewContainerRef, EmbeddedViewRef, AfterContentInit, AfterViewInit,
    ViewChildren, ContentChild, ContentChildren, QueryList, Directive
} from '@angular/core';
import { SuiResponse } from '../../services/https/sui-http-entity';
/**
 * 非编辑表格
 */
// @Component({
//     selector: "sui-grid",
//     templateUrl: './grid.html',
//     styleUrls: ['./grid.scss']
// })
@Component({
    selector: 'sui-grid',
    template: `<div [suiSpin]="loading" class="sui-grid" ><ng-content></ng-content></div>
    <sui-grid-duplicatrow-alert #el_alert *ngIf="gridOption.isEdit" ></sui-grid-duplicatrow-alert>
    `
})
export class Grid extends jqxGridComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    /**
     * 分页参数
     */
    @Input() page: GridPage;
    @Input() gridOption: GridOption<any>;
    @Input() gridEditOption: GridEditOption;


    @Output() onPage: EventEmitter<any> = new EventEmitter();
    /**
     * 列工具按钮事件
     */
    @Output() onToolBtnClick: EventEmitter<any> = new EventEmitter();

    // @ViewChild("myGrid") grid: jqxGridComponent;

    emptyMessage: string = "记录为空";
    edit: GridEdit;
    selection: GridSelection;
    validator: GridValidator;

    @ViewChild("el_alert") el_alert: GridDuplicatrowAlert;
    loading: boolean;
    footer: any;
    /**
     * 数据行
     */
    rows: any[];

    /**
     * 表格工具栏
     */
    gridTools: any[];

    // private _selectRows ;

    dataAdapter: any;
    customSource: any;

    private searchParam;


    constructor(
        public utils: CommonServices,
        public validatorService: SuiValidatorGridService,
        private gridUtil: GridUtilService,
        private containerElement: ElementRef

    ) {
        super(containerElement);

    }


    ngOnInit() {
        this.gridOption = this.gridOption || {};
        this.initGrid();
        //仅仅编辑表格才需要初始化编辑方法
        if (this.gridOption.isEdit == true) {
            this.edit = new GridEdit(this);
            this.validator = new GridValidator(this);
        }
        this.selection = new GridSelection(this);
        if (this.gridOption.columns) {
            this.setColumns(this.gridOption.columns[0], this.gridOption.columns[1], this.gridOption.columns[2], this.gridOption.columns[3]);
        }
    }

    private initGrid() {
        this.gridTools = this.gridUtil.getGridToolBar(this.gridOption.tools);
        this.initGridOption();
        this.initColumnsGroup();
        this.initPage();
        this.initAdapter();
        this.initCommonGrid();
        this.footer = {
            totalCount: 0
        };
        super.ngOnInit();

    }

    /**
     * 初始化公共属性
     */
    private initCommonGrid() {
        this.attrWidth = '100%';
        this.attrHeight = '100%';
        // this.attrAutoheight = true;
        this.attrSortable = true;
        this.attrAltrows = true;
        this.attrEnabletooltips = true;
        this.attrEditable = this.gridOption.isEdit;
        this.attrLocalization = getLocalization("zh-CN");
        this.attrSelectionmode = this.gridOption.selectionMode;
        this.attrAutoloadstate = true;
        this.attrColumnsresize = this.gridOption.isColumnsResize;
        this.attrShowpinnedcolumnbackground = false;
        this.attrColumnsreorder = this.gridOption.isColumnsReorder;
        this.attrVirtualmode = this.page.isServerPage;
        if(this.attrVirtualmode) {
            //服务器分页 不支持本地过滤
            this.attrFiltermode = false ;
        } 
        this.attrPagesize = this.page.pageSize;
        this.attrPagesizeoptions = this.page.pageSizes;
        this.attrPageable = this.page.pageable;
        this.attrPagermode = this.page.pagerMode;
        this.attrRendergridrows = this._rendergridrows;
        this.attrFilterable = true;
        
        if(this.showstatusbar && !this.attrStatusbarheight) {
            //默认底部状态栏高度
            this.attrStatusbarheight = 30;
        }
    }

    /**
     * 初始化浏览表格属性
     */
    private initBrowseGrid() {

    }
    /**
     * 初始化编辑表格属性
     */
    private initEditGrid() {

    }

    private initPage() {
        this.page = Object.assign(this.gridUtil.getGridDefPage(this.gridOption.gridType), this.page);
    }

    /**
     * 初始化表格默认参数
     */
    private initGridOption() {
        this.gridOption = Object.assign(this.gridUtil.getGridDefOption(this.gridOption.gridType), this.gridOption);
    }

    /**
     * 设置列分组
     */
    private initColumnsGroup() {
        if (this.utils.arrayUtil.isNotEmptyArray(this.gridOption.columns) && this.utils.arrayUtil.isNotEmptyArray(this.gridOption.columns[1])) {
            this.attrColumngroups = this.gridOption.columns[1];
        }
        // this.columngroups(this.gridOption.columngroups);
    }

    /**
     * 设置表格的列信息
     * columngroups 暂时不支持  请在gridOption  中设置columngroups
     * @param {Array} columnDefs 
     * @param {Array} columngroups 暂时不支持
     * @param {object} columnTemplates 
     * @param {object} validators 设置验证器
     */
    setColumns(columnDefs: GridColumnDef[], columnGroups?: any[], columnTemplates?: any, validators?: any) {
        this.setColumnsCommon(columnDefs, columnGroups, columnTemplates, validators);
        this.columns(columnDefs as any);
        
    }  

    private setColumnsCommon(columnDefs: GridColumnDef[], columnGroups?: any[], columnTemplates?: any, validators?: any) {
        if (!columnDefs || columnDefs.length == 0) {
            return;
        }
        // this.initDemoColumns();

        this.setColumnDefTypes(columnDefs);
        this.setLineNumColumn(columnDefs);
        if (columnTemplates) {
            this.setCustomColumnTemplates(columnDefs, columnTemplates);
        }
        if (this.gridOption.isEdit == true) {
            this.validator.setColumnsValidator(columnDefs, validators);
            this.edit.setColumnEditSigns(columnDefs);
        }

        columnDefs.map((columnDef) => {
            if (typeof columnDef.cellsrenderer === 'function') {
                let theFn = columnDef.cellsrenderer;
                let divClass = columnDef.align === 'center' ? 'jqx-grid-cell-middle-align' : columnDef.align === 'left' ? 'jqx-grid-cell-left-align' : columnDef.align === 'right' ? 'jqx-grid-cell-right-align' : '';
                // console.log(columnDef.align);
                columnDef.cellsrenderer = (rowIndex: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any) => {
                    return `<div class="${divClass}" style="line-height: 28px; padding:0 1px">${theFn(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata)}</div>`
                }
            }
        })
    }

    /**
     * 设置表格默认类型 tools ,link等
     * @param columnDefs 
     */
    private setColumnDefTypes(columnDefs: GridColumnDef[]) {
        columnDefs.map(columnDef => {
            //仅仅使用cellsalign与align设置相同的值
            if (columnDef.align) {
                columnDef.cellsalign = columnDef.align;
            }
            if (columnDef.columntype == 'tools') {
                //行内工具栏初始化
                columnDef.cellsrenderer = this.gridUtil.customCellsRenderer(null, this.gridTools);
            } else if (columnDef.columntype && (columnDef.columntype as any).indexOf('link') != -1) {
                //行内链接初始化
                columnDef.cellsrenderer = this.gridUtil.customCellsRenderer();
            }
        });
    }

    /**
     * 设置表格行号
     * @param columnDefs 
     */
    private setLineNumColumn(columnDefs: GridColumnDef[]) {
        if (this.gridOption.isShowRowNo === true) {
            //显示序号
            let lineNumColumn: any = {
                text: '序号', enabletooltips: false, sortable: false, filterable: false, editable: false, groupable: false, draggable: false, resizable: false, pinned: true,
                datafield: '$$rowIndex', columntype: 'number', width: 50, align: 'center',
                cellsrenderer: (row: number, column: any, value: number): string => {
                    return '<div>' + (value + 1) + '</div>';
                }
            }
            columnDefs.unshift(lineNumColumn);
        }
    }

    /**
     * 设置表格的模板 ;优先级最高 columntype 必须为: template
     * @param {object} columnTemplates ;格式为{key: value...} key-表格列属性名称; value-列模板内容
     */
    setCustomColumnTemplates(columnDefs: GridColumnDef[], columnTemplates: any) {
        if (!columnTemplates
            || !columnDefs || columnDefs.length == 0) {
            return;
        }
        columnDefs.map(columnDef => {
            if (['template', 'pipe'].indexOf(columnDef.columntype + "") != -1) {
                //模板
                let templateData = columnTemplates[columnDef.datafield];
                if (templateData) {
                    if (typeof templateData === "string") {
                        columnDef.cellsrenderer = this.gridUtil.customCellsRenderer(templateData);
                    } else if (typeof templateData === "function") {
                        columnDef.cellsrenderer = templateData;
                    } else if (typeof templateData === "object") {
                        columnDef.cellsrenderer = this.gridUtil.pipeCellsRenderer(templateData.pipeData, templateData.valueAs, templateData.labelAs);
                    }
                }
            }
        });
    }

    private initAdapter() {
        if(this.attrSource) {
            //如果已经有,则使用配置的
            return ;
        }
        this.customSource =
            {
                datatype: 'array',
                localdata: [],
                totalrecords: 0
            }
        this.dataAdapter = new jqx.dataAdapter(this.customSource);
        this.attrSource = this.dataAdapter;
    }

    ngAfterViewInit() {
        
    }

    ngAfterContentInit() {
    }

    /**
     * 
     * @param active 执行方法 格式 "do" + actvie(第一个字符大小)
     * @param _param  参数 entitys-实体对象(仅仅返回primaryKeyFields字段); rowIndexs-行号, cellIndexs: 列号;
     * @param event 
     */
    private invokeToolBarEvent(active, _param: { entitys: object[], rowIndexs: number[], cellIndexs?: number[], }, event) {
        this.onToolBtnClick.emit({
            originalEvent: event,
            active: active,
            param: {
                entitys: _param.entitys,
                rowIndexs: _param.rowIndexs,
                cellIndexs: _param.cellIndexs,
            }

        });
    }

    /**
     * 点击单元格触发事件
     * @param event 
     */
    _cellclick(event) {
        // console.debug(">>>>>>>>>>>>>>event", event);
        let args = event.args;
        let originalEvent = args.originalEvent;
        let field = args.datafield;
        let rowIndex = args.rowindex;
        let columnindex = args.columnindex;
        let rowData = args.row.bounddata;
        // let jq_target = args.target;
        // let value = args.value;
        // console.debug("cellclick>>>>.event, args, originalEvent: ", event, args, originalEvent);
        // console.debug("cellclick>>>>.field, rowIndex, rowData: ", field, rowIndex, rowData);
        let active: string = originalEvent.target.getAttribute("active");
        let toolMoreValue: string = originalEvent.target.getAttribute("tool-more");
        if (toolMoreValue) {
            rowIndex = toolMoreValue;
            field = "tools";
            //最后一列
            columnindex = this.columns.length - 1;
            rowData = this.getboundrows()[rowIndex];
        }
        if (active) {
            // console.debug("cellclick>>>>invoke the tool mehtod=[%s],rowIndex=[%s],field=[%s], rowData: ", active, rowIndex, field, rowData,originalEvent);
            let entitys: any[];
            if (this.utils.arrayUtil.isNotEmptyArray(this.gridOption.primaryKeyFields)) {
                entitys = this.utils.arrayUtil.copyFields([rowData], this.gridOption.primaryKeyFields);
            } else {
                entitys = [rowData];
            }
            // console.debug("cellclick>>>>.entitys, rowData: ", Object.assign({},entitys[0]), rowData);
            this.invokeToolBarEvent(active, { entitys: entitys, rowIndexs: [rowIndex], cellIndexs: [columnindex] }, originalEvent);
        }
    }

    /**
     * 排序
     * @param {string} pageType pageSize-页大小变化,pageNum-页码变化
     * @param event 
     */
    _onSort(event: any) {
        let args = event.args;
        let sortinformation = args.sortinformation;
        let sortcolumn = sortinformation.sortcolumn;
        let sortdirection = sortinformation.sortdirection;
        let ascending = sortdirection.ascending;
        let descending = sortdirection.descending;
        console.debug("...  _onSort ..", event.args);
        //pagenum
        // this.page.pageNum = args.pagenum + 1;
        // if(this.initFinishFlag === false) {
        //     this.initFinishFlag = true ;
        // } else {
        //     this.load();
        // }
    }

    /**
     * 分页或者页面改变事件
     * 不允许外部调用
     * @param {string} pageType pageSize-页大小变化,pageNum-页码变化
     * @param event 
     */
    _pagechanged(pageType: string, event: any) {
        let args = event.args;
        this.page.pageNum = args.pagenum + 1;
        this.load();
    }

    /**
     * 追加查询条件搜索
     * 页码重置为1
     * param : 查询参数
     */
    reloadByAddParam(param) {
        if (typeof this.searchParam !== "object") {
            this.searchParam = {};
        }
        Object.assign(this.searchParam, param);
        if (this.page.pageNum != 1) {
            this.page.pageNum = 1;
            this.gotopage(0);
        } else {
            this.load();
        }
    }

    /**
     * 重新加载数据 可以重置查询参数
     * 页码重置为1
     * param : 查询参数
     * 
     */
    reload = (param) => {
        if (typeof param === "object") {
            this.searchParam = this.utils.classUtil.clone(param);
        } else {
            this.searchParam = {};
        }
        if (this.page.pageNum != 1) {
            this.page.pageNum = 1;
            this.gotopage(0);
        } else {
            this.load();
        }

        //重新搜索后 重置排序
        // if(this.gridSort) {
        //     this.gridSort.resetTopSort();
        // }

    };

    /**
     * 加载数据: 不允许重置查询参数
     * 查询参数修改
     * 
     */
    load = () => {
        this.searchParam = this.searchParam || {};
        this.searchParam.pageSize = this.page.pageSize;
        this.searchParam.pageNum = this.page.pageNum;
        this.searchParam.totalCount = this.footer.totalCount;
        this.gridLoadData();
    };

    private gridLoadData() {
        try {
            this.loading = true;
            this.gridOption.loadDataInterface(this.searchParam).subscribe((data: any) => this.handleServerData(data));
        } catch (e) {
            this.loading = false;
            console.error(".....grid load error;e", e.stack);
            console.trace();
        }
    }

    private handleServerData(gridData: GridData<any>) {
        this.loading = false;
        /* if (res.retCode != 0) {
            return;
        } */
        if (!gridData || !gridData.footer || !this.utils.arrayUtil.isArray(gridData.rows) || this.utils.classUtil.notExits(gridData.footer.totalCount)) {
            console.info("sui-grid: the received data invalid, miss some propertys; current receive data is:", gridData);
            return;
        }
        this.rows = gridData.rows || [];
        if (this.page.pageNum == 1) {
            this.footer = gridData.footer;
            this.customSource.totalrecords = this.footer.totalCount;
        }
        // if(this.rows.length > 0) {
        //     let index = 0 ;
        //     this.rows.map( (row) => {
        //         row["$$identityId"] = index++ ;
        //         row.tools = this.getRowTool(row);
        //         // console.debug(">>>row",row);
        //     });
        // }

        this.setData(this.rows);
    }

    /**
     * 设置表格数据
     * @param rows 
     */
    setData(rows: any[]) {
        if (rows && typeof this.gridOption.rowBeforeAdd === "function") {
            rows = rows.filter(row => this.gridOption.rowBeforeAdd(row));
        }
        if (this.utils.arrayUtil.isEmpty(rows)) {
            rows = [];
        }
        this.customSource.localdata = rows;
        this.dataAdapter.dataBind();
    }

    /**
     * 
     * @param row 获取行工具
     */
    private getRowTool(row) {
        return this.utils.classUtil.clone(this.gridTools);
    }

    /**
     * 设置表格工具栏按钮状态
     * @param row 
     * @param rowToolState 
     */
    setRowToolState(row, rowToolState) {
        if (!rowToolState || !row || !this.gridTools || this.gridTools.length == 0) {
            return;
        }
        row['$$toolsState'] = [this.utils.classUtil.clone(rowToolState)];
    }

    _rendergridrows = (data) => {
        return data.data;
    }


    __wireEvents__(): void {
        this.host.on('bindingcomplete', (eventData: any) => { this.onBindingcomplete.emit(eventData); });
        this.host.on('columnresized', (eventData: any) => { this.onColumnresized.emit(eventData); });
        this.host.on('columnreordered', (eventData: any) => { this.onColumnreordered.emit(eventData); });
        this.host.on('columnclick', (eventData: any) => { this.onColumnclick.emit(eventData); });
        // this.host.on('cellclick', (eventData: any) => { this.onCellclick.emit(eventData); });
        this.host.on('celldoubleclick', (eventData: any) => { this.onCelldoubleclick.emit(eventData); });
        this.host.on('cellselect', (eventData: any) => { this.onCellselect.emit(eventData); });
        this.host.on('cellunselect', (eventData: any) => { this.onCellunselect.emit(eventData); });
        this.host.on('cellvaluechanged', (eventData: any) => { this.onCellvaluechanged.emit(eventData); });
        this.host.on('cellbeginedit', (eventData: any) => { this.onCellbeginedit.emit(eventData); });
        this.host.on('cellendedit', (eventData: any) => { this.onCellendedit.emit(eventData); });
        this.host.on('filter', (eventData: any) => { this.onFilter.emit(eventData); });
        this.host.on('groupschanged', (eventData: any) => { this.onGroupschanged.emit(eventData); });
        this.host.on('groupexpand', (eventData: any) => { this.onGroupexpand.emit(eventData); });
        this.host.on('groupcollapse', (eventData: any) => { this.onGroupcollapse.emit(eventData); });
        // this.host.on('pagechanged', (eventData: any) => { this.onPagechanged.emit(eventData); });
        // this.host.on('pagesizechanged', (eventData: any) => { this.onPagesizechanged.emit(eventData); });
        this.host.on('rowclick', (eventData: any) => { this.onRowclick.emit(eventData); });
        this.host.on('rowdoubleclick', (eventData: any) => { this.onRowdoubleclick.emit(eventData); });
        this.host.on('rowselect', (eventData: any) => { this.onRowselect.emit(eventData); });
        this.host.on('rowunselect', (eventData: any) => { this.onRowunselect.emit(eventData); });
        this.host.on('rowexpand', (eventData: any) => { this.onRowexpand.emit(eventData); });
        this.host.on('rowcollapse', (eventData: any) => { this.onRowcollapse.emit(eventData); });
        // this.host.on('sort', (eventData: any) => { this.onSort.emit(eventData); });
        this.host.on('sort', (eventData: any) => { this._onSort(eventData); });
        this.host.on('cellclick', (eventData: any) => { this._cellclick(eventData); });
        this.host.on('pagechanged', (eventData: any) => { this._pagechanged('pageNum', eventData); });
        this.host.on('pagesizechanged', (eventData: any) => { this._pagechanged('pageSize', eventData); });
    }

    ngOnDestroy() {
        this.edit = null;
        this.selection = null;
        this.validator = null;
    }

}