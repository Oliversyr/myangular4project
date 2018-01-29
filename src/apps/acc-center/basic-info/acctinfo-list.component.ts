
import { BaseService } from '../../../common/top-common/base.service';
import { NgModule, Component, ViewChild,ElementRef } from '@angular/core';
import { OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'
import { BaseListComponent } from "../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../common/components/templates/template-list';
import { AcctInfoListService } from './acctinfo-list.service';
import { GridOption, GridPage } from '../../../common/components/grid/grid-option';


/**
 * 账户资料列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-23
 */


@Component({
    templateUrl: './acctinfo-list.html',
    styleUrls: ['./acctinfo-list.scss']
})

export class AcctInfoComponent extends BaseListComponent implements OnInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    private gridPage: GridPage;
    /**
     * 表格
     */
    @ViewChild('grid') mygrid;

    onStart(param) { };

    constructor(private rootElement: ElementRef,private baseService: BaseService,private myService: AcctInfoListService) {

            super();
    }
    ngOnInit() {
        super.ngOnInit();
        this.initGrid();
        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }
    }
    /**
     * 表格初始化完成后执行
     */
    ngAfterViewInit() {
        this.initGridColumns();
    } 
    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridPage = {
            pageable: false
        };
        this.gridOption = {
            selectionMode: "checkbox",
            gridType:"B",
            isShowRowNo: true,
            tools: this.baseService.getGridToolBar(this.mRight),
            primaryKeyFields: ["definecode","subacctname","subaccttype","name","purpose"]
        };
    }

    /**
     * 初始化表格列
     */
    private initGridColumns() {
        let columnTemplate = {
            subaccttype: '<span>${value=="universal" ? "基本账户" : value=="special" ? "专用账户" :value=="temp" ?'+
             '"临时账户" :value=="liabilities" ? "负债类账户" :value=="assets" ? "资产类账户" :"未知账户"}</span>',
        };

        let columndef = [
            { "text": "账户", "datafield": "definecode", "align": "center", "width": 200, pinned: true },
            { "text": "名称", "datafield": "subacctname", "align": "center", "width": 200, pinned: true },
            { "text": "分类", "datafield": "subaccttype", "align": "center", "width": 180,columntype: 'template'},
            { "text": "用途", "datafield": "purpose", "align": "center", width: 180 },
            { "text": "描述", "datafield": "notes", "align": "center", width: 877 },
        ];
        this.mygrid.setColumns(columndef, [], columnTemplate);
        this.myService.getGridData().subscribe((data)=>{
            this.mygrid.setData(data.rows)
        })
    }

}