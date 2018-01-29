import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule } from '@angular/core';
import { TopCommon } from './../../top-common/top-common';

/**
 * 显示内容组件
 * 
 */
@Component({
    selector: "sui-text",
    templateUrl: './text.html'
    ,styleUrls: []
})
export class SuiText extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
      
    /**
     * 标题
     */
    @Input() label: string ;
    /**
     * 显示内容
     */
    @Input() content: string ;

    /**
     * 鼠标放在内容上面,显示内容
     * 用于内容过程显示省略; 鼠标放其上面可以显示全部信息
     */
    @Input() contentTitle: string ;
    
    /**
     * 标题样式
     */
    @Input() labelClass: boolean ;
    /**
     * text样式
     */
    @Input('ngClass') textClass: boolean ;


    constructor(
    ) { 
        super();
    }

    ngOnInit() {
        
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {

    }
    

    ngOnDestroy() {

    }

}

@NgModule({
    imports: [ 
        CommonModule
     ],
    exports: [ 
        SuiText
     ],
    declarations: [ 
        SuiText
     ]
})
export class SuiTextModule { }