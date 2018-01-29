/**
 * @author liurong
 * @create date 2018-01-16 02:03:31
 * @modify date 2018-01-16 02:03:33
 * @desc 通用结果集提示框
 * 例如 批量审核,删除等结果
*/
import { KeyboardDirectiveModule } from './../../../directives/keyboard/keyboard.directive';
import {GridPage }from './../../../components/grid/grid-option'; 
import {CommonModule }from '@angular/common'; 
import {Modal }from './../../../components/modal/modal'; 
import {HOTKEYS }from './../../../directives/keyboard/hotkeys'; 
import {Component, Input, AfterViewInit,Output, OnInit, ViewChild, NgModule, NO_ERRORS_SCHEMA, EventEmitter}from '@angular/core'; 
import {TopCommon }from './../../../../common/top-common/top-common'; 
import {GridOption }from '../../../components/grid/grid-option'; 
import {Grid }from '../../../components/grid/grid'; 
import {ModalModule }from '../../../components/modal/modal.module'; 
import {GridModule }from '../../../components/grid/grid.module'; 

/**
 * 
 * 示例
 * ts代码
 * cols: any[] = [
        { "text": "单号", "datafield": "sheetId"},
        { "text": "状态", "datafield": "status"},
        { "text": "内容", "datafield": "notes"},
     ];
 * @ViewChild('el_openBatchResult') el_openBatchResult: BatchResultAlertComponent;
 * //显示批量处理结果
    openBatchResult() {
        let items = [];
        let len = Math.random()*100;
        
        for(let i=0;i<len;i++) {
            items.push({
                sheetId: 1000+i,
                status: i%2==0?"成功":"失败",
                notes: "订单已处理,不允许重复处理"+i
            })
        }
        this.el_openBatchResult.open({items:items});
    }

    onClose(event) {
        console.log(">>>>after batch-result-alt close; event", event);
    }
 * 
 * html代码
 * <sui-batch-result-alert [title]="'订单审核结果'" [cols]="cols" (onClose)="onClose($event)" #el_openBatchResult></sui-batch-result-alert>
 * @export
 * @class BatchResultAlertComponent
 * @extends {TopCommon}
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component( {
    selector:'sui-batch-result-alert', 
    templateUrl:'./batch-result-alert.html'
})
export class BatchResultAlertComponent extends TopCommon implements  OnInit, AfterViewInit{
   
    /**
     * 提示框标题
     * 默认: 批量处理结果
     */
    @Input()title:string = "批量处理结果"; 
    /**
     * 提示框表格列信息
     * 可以为空
     */
    @Input()cols: any[] ; 
    @Output() onClose = new EventEmitter(); 
    
    @ViewChild('windowReference') window:Modal; 
    gridOption:GridOption < any > ; 
    @ViewChild('grid')grid:Grid; 
    page:GridPage; 

    hotkeys:any = HOTKEYS; 

    constructor(
     ) {
        super(); 
     }

     ngOnInit() {
        this.gridOption =  {
            gridType:"M"
        }; 

        this.page =  {
            pageable:false, 
            isServerPage:false
        }
     }

     ngAfterViewInit() {
        this.initGridCols(this.getCols());
     }

     private getCols(): any[] {
         if(!Array.isArray(this.cols) || this.cols.length == 0 ) {
            this.cols = [];
         }
         let defaultCols: any[] = [
            { "text": "单号", "datafield": "sheetId",  "width": '12%', "editable": false, "pinned": true },
            { "text": "状态", "datafield": "status",  "width": '12%', "editable": false, "pinned": true },
            { "text": "内容", "datafield": "notes", "width": '65%' ,"editable": false},
         ];
         for(let index in defaultCols) {
            this.cols[index] = this.cols[index] || {};
            Object.assign(defaultCols[index],this.cols[index]);
         }
         return defaultCols;
     }

     private initGridCols(cols:any[]) {
        this.grid.setColumns(cols); 
     }
 

    /**
     * 打开批量显示框
     * 1. option.items - 显示的数据
     * 1. 
     */
    open(option:any) {
        this.grid.setData(option.items);
        this.window.open(); 
    }

    confirm() {
        this.window.close(); 
    }

    close(event) {
        this.onClose.emit(event); 
    }

}


@NgModule( {
    declarations:[ BatchResultAlertComponent ], 
    exports:[ BatchResultAlertComponent ], 
    imports:[ CommonModule, ModalModule, GridModule, KeyboardDirectiveModule ], 
    providers:[  ], 
    schemas:[ NO_ERRORS_SCHEMA ]
  })
  
  export class BatchResultAlertModule {
  
  }