import { BaseService } from './../../top-common/base.service';
import { Tab } from './../tab-menu/tab';
import { SuiBreadCrumbModule } from './../breadcrumb/sui-breadcrumb.module';
import { TextRemotePipeModule } from './../../pipes/text.remote.pipe';
import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { CommonServices } from './../../services/groups/common-services.module';
import { Component, ViewContainerRef, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, Input, Output, EventEmitter, ContentChild } from '@angular/core';
import { TemplateTop } from './template-top';


/**
 * 模板列表组件参数
 */
 export interface TemplateDetailOption{
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
    selector: "template-detail",
    templateUrl: './template-detail.html'
    ,styleUrls: ['./template-detail.scss']
})
export class TemplateDetail extends TemplateTop implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    
    /**
     * 模板列表参数
     */
    @Input() option: TemplateDetailOption ;
    
    
    
    @ContentChild('suiHelpContent') suiHelpContent: any;     
    @ContentChild('suiMain') suiMain: any;
    @ContentChild('suiTopToolbar') suiTopToolbar: any;
    @ContentChild('suiTotal') suiTotal: any;
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

    ngAfterContentInit() {
        console.debug("TemplateDetail: ngAfterContentInit");
    }

    ngAfterViewInit() {
        console.debug("TemplateDetail: ngAfterViewInit");
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
        TemplateDetail 
    ],
    declarations: [ 
        TemplateDetail 
    ]
})
export class TemplateDetailModule { }