import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PrintModule } from './../print/print';
import { CommonServices } from './../../services/groups/common-services.module';
import { Grid } from './../grid/grid';
import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { KeyboardDirectiveModule } from '../../directives/keyboard/keyboard.directive';
import { PreviousNextOption } from '../previous-next/previousNextOption';
import { PreviousNextModule } from '../previous-next/previous-next';
import { HostBinding } from '@angular/core';



/**
 * 事件参数对象
 */
export interface EmitOption {
    /**
     * 原事件
     */
    originalEvent: Event;
    /**
     * 执行动作
     */
    active: string ;
    /**
     * 传递参数
     */
    param?: any
}

/**
 * 工具栏按钮
 */
export interface ToolBarButton{
    /**
     * 名称 
     */
    name: string ;
    /**
     * 标题名称
     */
    label: string ;
    /**
     * 光标在上面显示信息
     */
    placeholder?: string ;
    /**
     * 按钮状态;是否显示;true-显示,false-不显示
     * 表格状态显示在 rowEntity.tools.xxx.state: rowEntity.tools.edit.state、rowEntity.tools.browse.state 控制
     */
    state?: boolean;
    /**
     * 数据状态值
     * 控制数据权限使用 列入flag=1显示，2-不显示
     */
    dataState?: boolean;
    /**
     * 选择记录模式
     * single -- 单选
     * multple -- 多选
     * 其它 -- 不用选择记录
     */
    selectRecordMode?: string;
    /**
     * 按钮使用模式; 
     *   1. 顶部工具栏区
     *   2. 行工具栏
     * TOP_BAR - 顶部工具栏使用
     * GRID_BAR: 表格工具栏使用
     * ALL: 都使用
     * 默认 ALL
     */
    useMode?: string;
    /**
     * 使用界面:
     * A-新增;B-浏览;M-编辑;L-浏览;
     * 可以在多个界面显示;如果 A|B|M 新增/浏览/编辑都显示
     * 默认值不显示
     */
    userPage?: string;
    /**
     * 所属父节点
     * BATCH - 批量操作
     * 空: 无父节点(自己是父节点)
     */
    parentNode?: string ;
    /**
     * 热键名
     */
    hotkey?:string;
}

/**
 * 工具栏数据接口
 */
export interface ToolBarData{
    /**
     * 工具栏需要实体数据 详情/编辑界面需要使用
     */
    entity: any;
    /**
     * 表格主键字段
     */
    primaryKeyFields?: string[];
}

/**
 * 单据 -- 工具栏 
 * 
 */
@Component({
    selector: "sui-toolbar",
    templateUrl: './toolbar.html'
    ,styleUrls: ['./toolbar.scss']
})
export class Toolbar extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    @HostBinding("class.slic-btn-group") rootClass: boolean = true;
    /**
     * 模块号
     */
    @Input() moduleId :number|string;
    @Input("tools") 
    set topTools(_topTools: ToolBarButton[]) {
        let _singleBtns = [] , 
            _batchBtns=[] ;
        if(Array.isArray(_topTools) && _topTools.length !=0) {
            _topTools.forEach( btn => {
                //批量放在下拉框
                if(btn.parentNode == "BATCH") {
                    _batchBtns.push(btn);
                } else {
                    //其它放在列表
                    _singleBtns.push(btn);
                }
            })
        }
        this.singleBtns = _singleBtns;
        this.batchBtns = _batchBtns ;
        this.listenBatchBtnState();
        // console.debug(">>>>_topTools", _topTools, this.singleBtns, this.batchBtns);
        // console.log(">>>>_topTools", this.singleBtns);
    }

    /**
     * 是否显示批量按钮
     */
    batchBtnState: boolean ;

    /**
     * 按钮需要的数据源
     * 1. 列表: 来源表格
     * 2. 详情: 来源单据
     * 3. 编辑: 来源单据
     * 4. 新增: 无
     */
    @Input() toolBarData: Grid|ToolBarData;

    /**
     * 上一单/下一单组件配置参数
     */
    @Input() previousNextOption: PreviousNextOption<any>;

    /**
     * 列工具按钮事件
     */
    @Output() onToolBtnClick: EventEmitter<any> = new EventEmitter();    

    //单个按钮
    singleBtns: ToolBarButton[] ;
    //批量按钮
    batchBtns: ToolBarButton[] ;

    constructor(
        private utils: CommonServices
    ) { 
        super();
     }

    ngOnInit() {
        // console.debug("Toolbar: ngOnInit", this.topTools);
    }


    ngAfterViewInit() {
    }

    ngAfterContentInit() {

    }
    
    /**
     * 点击顶部工具按钮
     * @param tool 
     * @param event 
     */
    _onTopToolBtnClick(tool: ToolBarButton,event) {
        event.stopPropagation(); 
        
        let rows = this.getRows(tool.selectRecordMode, tool.label);
        this.invokeToolBarEvent(tool.name, rows, event);
        
    }

    private getRows(selectRecordMode: string, btnLabel: string) {
        if(!this.toolBarData) {
            return null ;
        }
        let rows ;
        if(this.toolBarData instanceof Grid) {
            rows = this.toolBarData.selection.getSelectRows(this.toolBarData.gridOption.primaryKeyFields);
        } else {
            rows = [this.utils.classUtil.clone(this.toolBarData.entity, this.toolBarData.primaryKeyFields)] ;
        }
/* 
        if(selectRecordMode == "single") { 
            if(!rows || rows.length != 1) {
                alert("无法" + btnLabel+ ";原因：没有选择记录或者选择多条记录");
                return null;
            }
        } else if(selectRecordMode == "multple") {
            if(!rows || rows.length == 0) {
                alert("无法" + btnLabel+ ";原因：没有选择记录");
                return null;
            }
        } */

        return rows ;
    }

    /**
     * 打印按钮
     */
    _printClick(event: EmitOption) {
        let rows = this.getRows('multple', '打印');
        if(rows) {
            let _param = event.param;
            _param.entitys = rows ;
            let emitOption: EmitOption = {
                originalEvent: event.originalEvent,
                active: event.active, 
                param: _param
            };
            this.onToolBtnClick.emit(emitOption);
        }
    }
    
    private invokeToolBarEvent(active, entitys, event) {
        let emitOption: EmitOption = {
                originalEvent: event,
                active: active, 
                param: {
                    entitys: entitys
                }
            };
        this.onToolBtnClick.emit(emitOption);
    }

    ngOnDestroy() {
        this.toolBarData = null ;
    }

    /**
     * 监听批量按钮操作
     */
    private listenBatchBtnState () {
        this.batchBtnState = false;
        for(let item of this.batchBtns) {
            //只要有一个按钮显示则显示
            if(item.state && item.dataState !==false) {
                this.batchBtnState = true ;
                return ;
            }
        }
    }

}

// /**
//  * 表格 -- 带更多的工具栏 
//  * 例子: 
//  *  <sui-toolbar-more [tools]="tools" displayNum="3"> </sui-toolbar-more>
//  */
// @Component({
//     selector: "sui-toolbar-more",
//     template: `
//     <span>
//         <ng-template ngFor let-item let-isLast="last" [ngForOf]="displayBtns" >
//             <a href="#" (click)="_onToolBtnClick(item, $event);" title="{{item.placeholder}}">{{item.label}}</a>
//             <span *ngIf="isMore || (!isMore && !isLast)" nz-table-divider></span>
//         </ng-template>
//         <nz-dropdown *ngIf="isMore">
//             <a class="ant-dropdown-link" nz-dropdown>
//                 <i class="anticon anticon-ellipsis"></i>
//             </a>
//             <ul nz-menu> 
//                 <li nz-menu-item *ngFor="let item of moreBtns">
//                     <a href="#" (click)="_onToolBtnClick(item, $event);" title="{{item.placeholder}}">{{item.label}}</a>
//                 </li>
//             </ul>
//         </nz-dropdown>
//     </span>
//     `
//     ,styles: [
//         `
//         li>a{
//             min-width:80px;
//             text-align: center;
//         }
//         `
//     ]
// })
// export class ToolbarMore extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

//     /**
//      * 是否显示更多按钮
//      */
//     isMore: boolean ; 
//     /**
//      * 显示按钮数
//      */
//     @Input() displayNum: number;
   
//     @Input("tools") 
//     set topTools(_topTools: ToolBarButton[]) {
//         this._topTools = _topTools;
//         if(!Array.isArray(_topTools)) {
//             return ;
//         }
//         //默认显示2个按钮
//         if(!this.displayNum || this.displayNum < 1) {
//             this.displayNum = 2 ;
//         }
//         //过滤没有可以显示按钮
//         _topTools = _topTools.filter( tool => tool.state !== false) ;
//         if(_topTools.length == 0 ) {
//             return ;
//         } 
//         this.isMore = (this.displayNum < _topTools.length) ;
//         if(this.isMore) {
//             this.displayBtns = _topTools.slice(0,this.displayNum);
//             this.moreBtns = _topTools.slice(this.displayNum - _topTools.length);
//         } else {
//             this.displayBtns = _topTools;
//         }
        
//         // console.debug(">>>>_topTools", _topTools, this.displayBtns, this.moreBtns);
//     }

//     private _topTools: ToolBarButton[];

//     /**
//      * 列工具按钮事件
//      */
//     @Output() onToolBtnClick: EventEmitter<any> = new EventEmitter();    

//     //默认显示按钮
//     displayBtns: ToolBarButton[] ;
//     //更多按钮
//     moreBtns: ToolBarButton[] ;

//     constructor(
//         private utils: CommonServices
//     ) { 
//         super();
//      }

//     ngOnInit() {
//     }


//     ngAfterViewInit() {
//     }

//     ngAfterContentInit() {

//     }
    
//     /**
//      * 点击顶部工具按钮
//      * @param tool 
//      * @param event 
//      */
//     _onToolBtnClick(tool: ToolBarButton,event) {
//         try {
//             event.stopPropagation(); 
//             let emitOption: EmitOption = {
//                 originalEvent: event,
//                 active: tool.name
//             };
//             this.onToolBtnClick.emit(emitOption);
//         } catch (error) {
//             console.error("exec toolbarmore faile",tool, error.stack);
//         }
//         return false ;
//     }
 
//     ngOnDestroy() {
         
//     }

// }

@NgModule({
    imports: [ 
        CommonModule
        ,PrintModule
        ,KeyboardDirectiveModule
        ,PreviousNextModule
        // ,NgZorroAntdModule
    ],
    exports: [ 
        Toolbar
        // , ToolbarMore 
    ],
    declarations: [ 
        Toolbar
        // , ToolbarMore 
    ]
})
export class ToolbarModule { }