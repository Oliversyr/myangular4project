import { Grid } from './grid';
import { CommonServices, CommonServicesModule } from './../../services/groups/common-services.module';
import { Observable } from 'rxjs/Observable';
import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { Component, OnInit, OnDestroy, NgModule, Input, Output, EventEmitter, ElementRef, ViewChild,
     TemplateRef, ViewContainerRef, EmbeddedViewRef, AfterContentInit, AfterViewInit, 
     ViewChildren, ContentChild, ContentChildren, QueryList, Directive } from '@angular/core';

/**
 * 表格排序
 */
export interface GridSortOption{
    /**
     * 字段名称 
     */
    field: string ;
    /**
     * 显示名称
     */
    label: string ;
    /**
     * 排序方向: 1-降序(ASC); -1-升序(DESC)
     */
    direction?: number;
}


/**
 * 非编辑表格
 */
@Component({
    selector: "sui-grid-sort",
    templateUrl: './grid-sort.html',
    styleUrls: ['./grid-sort.scss']
})
export class GridSort extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    
    @Input() grid: Grid;
    @Input() sorts: GridSortOption[];

    currentSortIndex: number ;

    constructor(
    ) { 
        super();
        // console.debug("gridSort: constructor.......");
     }
 

    ngOnInit() {
        // console.debug(">>>>>>>>>>>>>>>gridSort.ngOnInit");
        this.initSort();
    }
    
    /**
     * 初始化排序
     */
    private initSort() {
         if(!this.sorts || this.sorts.length == 0) {
            return ;
        }
        
        let defaultSort: GridSortOption = {
            field: "DEFAULT" ,
            label: "默认"
        }
        this.sorts.unshift(defaultSort);
        
    }

    ngAfterContentInit() {
        // console.debug(">>>>>>>>>>>>>>>gridSort.ngAfterContentInit");
    }

    ngAfterViewInit() {
        // console.debug(">>>>>>>>>>>>>>>gridSort.ngAfterViewInit");
    }


    /**
     * 顶部排序按钮
     * @param sort 
     * @param event 
     */
    _topSort(sort: GridSortOption, index, event) {
        event.stopPropagation();
        this.currentSortIndex = index ;
        sort.direction = -1 * (sort.direction||-1) ;


        let orderStr = "";
        let directStr;
        if(sort.field != "DEFAULT") {
            directStr = sort.direction  == 1 ? "ASC" : "DESC" ;
            orderStr = sort.field + " " + directStr ;
        }
        if(this.grid) {
            this.grid.reloadByAddParam({orderField: sort.field, orderDirect: directStr});
        } else {
            console.error("can't use grid sort; err: grid undefined");
            console.trace();
        }
         
    } 

    /**
     * 重置顶部排序
     */
    resetTopSort() {
        this.currentSortIndex = -1;
    }

    ngOnDestroy() {
        this.grid = null ;
    }

}