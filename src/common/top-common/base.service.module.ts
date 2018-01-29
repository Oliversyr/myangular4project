import { SuiRouterService } from './../directives/router/sui-router.sevice';
import { KeyboardService } from './../directives/keyboard/keyboard.service';
import { SuiHttpModule } from './../services/https/sui-http.module';
import { CommonServices } from './../services/groups/common-services.module';
import { BaseService } from './base.service';
import { ModalService } from './../components/modal/modal.service';
import { ModuleRightService } from './module-right.service';
import { TabOuterUtil } from './../components/tab-menu/tab-outer-util';
import { NgModule } from '@angular/core';
import {  } from '../directives/router/sui-router.sevice';
import { SuiSpinService } from '../components/spin/sui-spin.service';

/**
 * 通用列表模块
 * 基础通用服务
 * 列表、详情、编辑均使用
 */
@NgModule({
    imports: [ 
        SuiHttpModule
     ],
     exports: [
        
     ]
     ,
     providers: [
        CommonServices,
        TabOuterUtil,
        ModuleRightService,
        ModalService,
        KeyboardService,
        SuiRouterService,
        SuiSpinService,
        BaseService
     ]
}) export class BaseServiceModule {}