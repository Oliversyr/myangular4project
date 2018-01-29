import { ClassUtil } from './../../services/utils/class-util';
import { GridPage, GridOption } from './grid-option';
import { ToolBarButton } from './../toolbar/toolbar';
import { CommonServices } from './../../services/groups/common-services.module';
import { Injectable } from '@angular/core';
import { TopCommon } from './../../top-common/top-common';

@Injectable()
export class GridUtilService extends TopCommon {

    /**
     * window 窗口 高度
     */
    private winHeight: number;

    constructor(
         private utils: CommonServices
    ) {
        super();
        this.winHeight = window.innerHeight ;
    }

    /**
     * 返回链接html标签
     * @param active 
     * @param value 
     */
    private getLinkHtml(active: string, value: string | number){
        return `<span active="${active}"  class="sui-grid-a">${value}</span>`;
    }
    
    /**
     * 返回 表格工具列的html标签
     * @param rowData 
     * @param tools 
     */
    private getToolsHtml(rowData, tools?: ToolBarButton[]){
        // console.debug(">>>>>>>>>>>>>rowdata", rowData);
        let toolsHtml = "";
        let toolsState = rowData['$$toolsState'] ;
        if(!toolsState || toolsState.length == 0 || !tools || tools.length == 0) {
            return "";
        }
        toolsState = toolsState[0];
        let toolsMoreHtml: string;;
        let i:number=0;
        tools = tools.filter( tool => toolsState[tool.name] === true);
        if(tools.length >2 ){
            toolsMoreHtml = ' | <span title="显示更多操作" class="sui-grid-btn ">...<ul class="sui-grid-more">' ;
        }
        for(let tool of tools) {
            //默认显示label
            tool.placeholder = tool.placeholder || tool.label ;
            // if(toolsState[tool.name] === true) {
            if(i < 2) {
                if(i != 0) {
                    toolsHtml += " | " ;
                }
                toolsHtml += `<span tabindex="1000"  active="${tool.name}" title="${tool.placeholder}" class="sui-grid-btn ">${tool.label}</span>`;
            } else {
                toolsMoreHtml += `<li><span tool-more="${rowData.boundindex}" tabindex="1000"  active="${tool.name}" title="${tool.placeholder}" class="sui-grid-btn ">${tool.label}</span></li>`;
            }
            
            i++;
            // }
        }
        if(toolsMoreHtml) {
            toolsHtml += toolsMoreHtml +='</ul></span>';
        }
        return toolsHtml ;
    }
   

    /**
     * 管道单元格显示内容
     * @param {array|object=} pipeData 管道数组或对象,可以对象;也可数组
     * @param {string=} valueAs ; value的别名  默认: value
     * @param {string=} labelAs ; key的别名  默认label
     */
    pipeCellsRenderer(pipeData: any, valueAs: string, labelAs: string)  {
        return  (rowIndex: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
                if(this.utils.classUtil.notExits(pipeData) || this.utils.classUtil.notExits(value))  {
                    return value + "" ;
                }
                if(Array.isArray(pipeData) && pipeData.length !=0) {
                    labelAs = labelAs || "label";
                    valueAs = valueAs || "value";
                    for(let item of pipeData) {
                        if(item[valueAs] == value) {
                            return item[labelAs] ;
                        }
                    }
                } else if(typeof pipeData === "object") {
                    return pipeData[value] ;
                }
                return value + "";
          };
    }

    // private detail(param,event) {

    // }
    /**
     * 自定义表格列显示内容
     * @param {string=}_template 模板内容;如果设置了模板则直接返回模板
     * @param {ToolBarButton[]=}tools ; 行内工具按钮 
     */
    customCellsRenderer(_template?: string, tools?: ToolBarButton[]) {
        return  (rowIndex: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
            //定义了模板则直接覆盖
            if(_template) {
                return this.utils.classUtil.dynamicTemplateStr(_template, ["rowIndex", "columnfield", "value", "defaulthtml", "columnproperties", "rowdata"])
                        (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) ;
            }
            // console.debug("cellsLinkRenderer>>>>>rowIndex=[%s], columnfield=[%s], value=[%s], columnproperties, rowdata: ", rowIndex, columnfield, value, columnproperties, rowdata);
            let active:string = columnfield;
            let columntype: string = columnproperties.columntype ;
            if(columntype.indexOf("link") != -1) {
                let columntypes = columntype.split("|");
                if(columntypes.length == 2) {
                    //第1个为类型
                    columntype = columntypes[0];
                    //第2个为执行动作
                    active = columntypes[1];
                }
            }
            switch(columntype){
                case 'tools':
                    return this.getToolsHtml(rowdata, tools);
                case 'link':
                    return this.getLinkHtml(active, value);
                default:
                    return value+"";
            }
        };
    }

    /**
     * 初始化工具栏: 表格工具栏或者顶部工具栏
     */
    getGridToolBar(tools: ToolBarButton[]) {
        if(!tools || tools.length == 0){
            return [];
        }
        let gridTools = [];
        let gridTool ;
        tools.forEach( tool => {
            tool.useMode = tool.useMode || "ALL";
            gridTool = this.getGridTools(tool) ;
            if( gridTool != null){
                gridTools.push(gridTool);
            }
            
        });
        return gridTools ;
    }

     /**
     *获取 表格工具栏
     */
    private getGridTools(tool: ToolBarButton) {
        if(['ALL','GRID_BAR'].indexOf(tool.useMode) == -1) {
            return null ;
        }
        let gridTool = {
            name: tool.name, 
            label: tool.label, 
            placeholder: tool.placeholder
        }
        return gridTool ;
    }

    /**
     * 获取表格分页默认属性
     */
     getGridDefPage(gridType?: string) {
        let defaultPage: GridPage;
        if(gridType == "M") {
            //编辑默认模式
            defaultPage = {
                pageNum: 1,
                pageSize: 10,
                pageLinks: 5,
                pageSizes: [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 50000],
                pagerMode: "simple",
                pageable: false,
                isServerPage: false
            };
        } else {
            defaultPage = {
                pageNum: 1,
                pageSize: 10,
                pageLinks: 5,
                pageSizes: [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 50000],
                pagerMode: "simple",
                pageable: true,
                isServerPage: true
            };
        } 
        defaultPage.pageSize = this.getPageSizeByWinHeight(); 
        return defaultPage ;
    }
    
    /**
     * 通过窗口高度获取每页行数
     */
    private getPageSizeByWinHeight() {
        if(this.winHeight<=550){
            return 10 ;
        }else if(this.winHeight>550 && this.winHeight<=800){
            return 20 ;
        }else if(this.winHeight>800 && this.winHeight<=1000){
            return 25 ;
        }else{
            return 30 ;
        }
    }

    /**
     * 获取表格默认属性
     * gridType: B-浏览表格;M-编辑表格 默认M
     * 
     */
    getGridDefOption(gridType?: string) {
        let defaultGridOption: GridOption<any> ;
        if(gridType == "M") {
            //编辑默认模式
            defaultGridOption = {
                selectionMode: "multiplecellsadvanced",
                loadDataInterface: null,
                isShowRowNo: true,
                isEdit: true,
                isColumnsResize: true,
                isColumnsReorder: true
            }
        } else {
            defaultGridOption = {
                selectionMode: "checkbox",
                loadDataInterface: null,
                isShowRowNo: true,
                isEdit: false,
                isColumnsResize: true,
                isColumnsReorder: true
            }
        }
        
        return defaultGridOption ;
    }

    /**
     * 获取指定列行数据;
     * @param rows : 行内容
     * @param _fields: 获取的列名 
     */
    // getRowsByFields(rows:any[], _fields?: string[]|string): any[] {
    //     //如果rows 非空,但不是数组,先转换为数组
    //     if(rows && !Array.isArray(rows)) {
    //         rows = [rows] ;
    //     }
    //     if(!_fields || !rows|| rows.length == 0) {
    //         return null ;
    //     }
    //     let fileds ;
    //     if(typeof _fields === "string") {
    //         fileds = [_fields] ;
    //     } else {
    //         fileds =  _fields;
    //     }
    //     let newRows = [], newRow;
        
    //     rows.forEach(originRow => {
    //         newRow = {};
    //         fileds.forEach(field => {
    //             newRow[field] = originRow[field] ;
    //         });
    //         newRows.push(newRow);
    //     });
    //     return newRows ;
    // }


}