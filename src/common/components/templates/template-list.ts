import { BaseService } from './../../top-common/base.service';
import { TextRemotePipeModule } from './../../pipes/text.remote.pipe';
import { SuiBreadCrumbModule } from './../breadcrumb/sui-breadcrumb.module';
import { EmitOption } from './../toolbar/toolbar';
import { CommonModule } from '@angular/common';
import { TopCommon } from './../../top-common/top-common';
import { CommonServices } from './../../services/groups/common-services.module';
import { ElementRef, Component, ViewContainerRef, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, Input, Output, EventEmitter, ViewChild, ContentChild } from '@angular/core';
import { Tab } from '../tab-menu/tab';
import { SuiSpinModule } from '../spin/sui-spin.module';
import { TemplateTop } from './template-top';


/**
 * 模板列表组件参数
 */
export interface TemplateListOption {
    /**
     * 是否有更多搜索条件 false-没有,其它-有
     */
    isMoreSearch?: boolean;
    /**
     * 当前页签
     */
    tab?: Tab,
    /**
     * 暂时不需要
     * 是否有面包屑 false-没有,其它-有
     */
    // isCrumb?: boolean ;
    /**
      * 暂时不需要
      * 面包屑的帮助显示帮助内容在服务器的url地址
      */
    //  helpUrl?: string ;
    /**
     * 面包屑菜单名称数组(含父级名称)
     */
    //   crumbMenuNames?: any[];
}
/**
 * 列表模板
 */
@Component({
    selector: "template-list",
    templateUrl: './template-list.html'
    , styleUrls: ['./template-list.scss']
})
export class TemplateList extends TemplateTop implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    /**
     * 切换更多条件标志
     */
    searchMoreFlag: boolean;

    /**
     * 模板列表参数
     */
    @Input() option: TemplateListOption;

    @Output() pageBtnClick: EventEmitter<any> = new EventEmitter<any>();

    /**
     * 面包屑菜单名称
     */
    crumbMenuNames: any[];


    @ContentChild('suiHelpContent') suiHelpContent: any;
    @ContentChild('suiShowContent') suiShowContent: any;
    @ContentChild('suiSearchNormal') suiSearchNormal: any;
    @ContentChild('suiTopToolbar') suiTopToolbar: any;
    @ContentChild('suiSearchMore') suiSearchMore: any;
    @ContentChild('suiTotal') suiTotal: any;
    @ContentChild('suiGridSort') suiGridSort: any;
    @ContentChild('suiGrid') suiGrid: any;

    
    


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
     * 更多搜索条件的切换
     */
    private toggleMoreCondition(event) {
        this.searchMoreFlag = !this.searchMoreFlag;
    }

    ngAfterContentInit() {
        // console.debug("templateList: ngAfterContentInit");
    }

    ngAfterViewInit() {
        // console.debug("templateList: ngAfterViewInit");
    }

    /**
     * 搜索工具栏 search-搜索按钮, reset-重置按钮, toggleMore-切换跟多条件
     * @param active search-搜索按钮, reset-重置按钮, toggleMore-切换跟多条件
     * @param event 
     */
    _pageBtnClick(active, event, param?: any) {
        event.stopPropagation();
        if (active == "toggleMore") {
            this.toggleMoreCondition(event);
            return;
        }
        let emitOption: EmitOption = {
            originalEvent: event,
            active: active,
            param: param
        };
        this.pageBtnClick.emit(emitOption);

    }


    ngOnDestroy() {

    }

}

@NgModule({
    imports: [
        CommonModule,
        TextRemotePipeModule
        , SuiBreadCrumbModule
        , SuiSpinModule
    ],
    exports: [
        TemplateList
    ],
    declarations: [
        TemplateList
    ]
})
export class TemplateListModule { }