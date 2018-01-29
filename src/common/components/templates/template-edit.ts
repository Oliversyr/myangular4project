import { TemplateTop } from './template-top';
import { Tab } from './../tab-menu/tab';
import { SuiBreadCrumbModule } from './../breadcrumb/sui-breadcrumb.module';
import { TextRemotePipeModule } from './../../pipes/text.remote.pipe';
import { EmitOption } from './../toolbar/toolbar';
import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { CommonServices } from './../../services/groups/common-services.module';
import { Component, ViewContainerRef, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, Input, Output, EventEmitter, ContentChild } from '@angular/core';
import { BaseService } from '../../top-common/base.service';


/**
 * 模板列表组件参数
 */
 export interface TemplateEditOption{
     /**
     * 当前页签
     */
    tab?: Tab,
      /**
      * 是否有面包屑 false-没有,其它-有
      */
    //isCrumb?: boolean ;
    /**
      * 面包屑的帮助显示帮助内容在服务器的url地址
      */
     //helpUrl?: string ;
     /**
      * 面包屑菜单名称数组(含父级名称)
      */
      //crumbMenuNames?: any[];
 }
/**
 * 列表模板
 */
@Component({
    selector: "template-edit",
    templateUrl: './template-edit.html'
    ,styleUrls: ['./template-edit.scss']
})
export class TemplateEdit extends TemplateTop implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    
    /**
     * 模板列表参数
     */
    @Input() option: TemplateEditOption ;

    @Output() pageBtnClick: EventEmitter<EmitOption> = new EventEmitter<EmitOption>();    
    
    /**
     * 面包屑菜单名称
     */
    crumbMenuNames: any[];

    @ContentChild('suiHelpContent') suiHelpContent: any;     
    @ContentChild('suiMain') suiMain: any;
    @ContentChild('suiTopToolbar') suiTopToolbar: any;
    @ContentChild('suiTotal') suiTotal: any;
    @ContentChild('suiItemInputContent') suiItemInputContent: any;
    @ContentChild('suiGrid') suiGrid: any;
    @ContentChild('suiFooter') suiFooter: any;
    
     
    
    constructor(
        private utils: CommonServices,
        baseService: BaseService,
        private viewContainerRef: ViewContainerRef
    ) { 
        super(baseService);
    }

    ngOnInit() {
        this.option = this.option || {};
        this.crumbMenuNames = this.baseService.getCrumbMenuNamesByMid(this.option.tab);
    }

    
    
    /**
    * 页面按钮点击事件
    * @param active search-搜索按钮, reset-重置按钮, toggleMore-切换跟多条件
    * @param event 
    */
    _pageBtnClick(active: string, event: Event, param?: any) {
        event.stopPropagation();
        let emitOption: EmitOption = {
            originalEvent: event,
            active: active,
            param: param
        };
        this.pageBtnClick.emit(emitOption);
    }   
    ngAfterContentInit() {
        console.debug("TemplateEdit: ngAfterContentInit");
    }

    ngAfterViewInit() {
        console.debug("TemplateEdit: ngAfterViewInit");
    }


    ngOnDestroy() {

    }

}

@NgModule({
    imports: [ 
        CommonModule, 
        TextRemotePipeModule
        ,SuiBreadCrumbModule 
    ],
    exports: [ 
        TemplateEdit
    ],
    declarations: [ 
        TemplateEdit 
    ]
})
export class TemplateEditModule { }