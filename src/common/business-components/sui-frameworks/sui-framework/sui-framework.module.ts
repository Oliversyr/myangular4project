import { ModalModule } from './../../../components/modal/modal.module';
import { TabMenuMdule } from './../../../components/tab-menu/tab-menu.module';
import { SuiFrameworkService } from './sui-framework.service';
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiFrameworkComponent } from './sui-framework.component';
import { SuiHttpModule } from '../../../services/https/sui-http.module';
import { SuiCookieService } from '../../../services/storage/sui-cookie.service';
import { ModalService } from '../../../components/modal/modal.service';
import { SuiRouterService } from '../../../directives/router/sui-router.sevice';
import { TabOuterUtil } from '../../../components/tab-menu/tab-outer-util';
import { SuiFrameworkHeaderComponent } from './sui-framework-header.component';
import { StorageModule } from '../../../services/storage/storage.module';
import { LoginService } from '../../../../apps/login/login.service';

/**
 * @author liurong
 * @create date 2017-11-29 11:58:00
 * @modify date 2017-11-29 11:58:00
 * @desc 基础框架模块;包含组件、服务等
*/
@NgModule({
    imports: [
        CommonModule,
        SuiHttpModule,
        TabMenuMdule,
        StorageModule,
        ModalModule
    ],
    exports: [
        SuiFrameworkComponent
    ],
    declarations: [
        SuiFrameworkComponent,
        SuiFrameworkHeaderComponent
    ],
    providers:[
        SuiFrameworkService,
        // ModalService,
        SuiRouterService,
        TabOuterUtil,
        LoginService
    ]
    , schemas: [NO_ERRORS_SCHEMA]
})
export class SuiFrameworkModule { }