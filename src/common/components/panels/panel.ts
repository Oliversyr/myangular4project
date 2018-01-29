import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, Input, Output, EventEmitter } from '@angular/core';

/**
 * 面板 
 * beforeTitleIcon:  标题前面的图标,empty-空,不显示;其它-显示竖线
 * title: 标题
 * expanded: 内容是否展开
 * isShowToggleIcon: 是否显示收缩按钮
 * 
 */
@Component({
    selector: "sui-panel",
    templateUrl: './panel.html'
    ,styleUrls: ['./panel.scss']
})
export class Panel extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    /**
     * 标题前面的图标,empty-空,不显示;其它-显示竖线
     */
    @Input() beforeTitleIcon: string ;
    /**
     * 标题
     */
    @Input() title: string ;
    /**
     * 内容是否展开
     */
    @Input() expanded: boolean ;
    /**
     * 是否显示收缩按钮 
     * 默认 true 
     */
    @Input() isShowToggleIcon: boolean ;

    @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

    
    constructor(
    ) { 
        super();
    }

    ngOnInit() {
        console.debug("Panel: ngOnInit");
        if(!this.beforeTitleIcon) {
            this.beforeTitleIcon = "vertical-line";
        }

        //默认显示
        if(typeof this.isShowToggleIcon === "undefined"){
            this.isShowToggleIcon = true ;
        } else if(typeof this.isShowToggleIcon === "string" && this.isShowToggleIcon=="false") {
            this.isShowToggleIcon = false;
        }
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {

    }
    
    _toggle(event) {
        this.expanded = !this.expanded ;
        this.toggle.emit({
            originalEvent: event,
            expanded: this.expanded
        });
    }

    ngOnDestroy() {

    }

}

@NgModule({
    imports: [ 
        CommonModule 
    ],
    exports: [ 
        Panel 
    ],
    declarations: [
         Panel 
    ]
})
export class SuiPanelModule { }