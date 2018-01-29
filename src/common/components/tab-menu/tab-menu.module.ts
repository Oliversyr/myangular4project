import { SuiSpinModule } from './../spin/sui-spin.module';
import { ModalService } from './../modal/modal.service';
import { SuiRouterModule } from './../../directives/router/sui-router.module';
import { SuiTagModule } from './../tag/sui-tag.module';
import { SuiMenuModule } from './../menu/sui-menu.module';
import { SuiTabsModule } from './../tabs/sui-tabs.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { TabContentPage } from './tab-content-page';
import { TabUtil } from './tab-util';
import { TabOuterUtil } from './tab-outer-util';
import { SuiHttpModule } from './../../services/https/sui-http.module';
import { NgModule } from '@angular/core' ;
import {CommonModule} from '@angular/common';

import { TabMenuComponent } from './tab-menu.component' ;
import { CommonServicesModule } from "../../services/groups/common-services.module";

@NgModule({
    imports: [ 
        CommonModule, 
        RouterModule,
        CommonServicesModule, 
        SuiHttpModule
        ,SuiTabsModule
        ,SuiMenuModule
        ,SuiTagModule
        ,NgZorroAntdModule
        ,SuiRouterModule
        ,SuiSpinModule
     ],
    exports: [ TabMenuComponent ],
    declarations: [ TabMenuComponent ],
    providers: [
        TabOuterUtil,
        TabUtil,
        TabContentPage,
        ModalService
    ]

})
export class TabMenuMdule {}