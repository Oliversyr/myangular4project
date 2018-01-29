import { LoginService } from './login.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** 导入SUI框架: 相关模块 */
import { SuiValidatorModule } from '../../common/components/validator/sui-validator';
import { CommonDirectivesModule } from '../../common/directives/groups/common-directives.module';
import { StorageModule } from '../../common/services/storage/storage.module';
import { SuiCheckboxModule } from './../../common/components/checkbox/sui-checkbox.module';
import { SuiTooltipModule } from './../../common/components/tooltip/sui-tooltip';
import { BaseServiceModule } from '../../common/top-common/base.service.module';
import { Modal } from '../../common/components/modal/modal';
import { SuiSpinModule } from '../../common/components/spin/sui-spin.module';

/** 导入登录模块: 路由模块 */
import { LoginRouterModule } from './login-router.module';

/** 导入登录模块: 包含的组件 */
import { LoginComponent } from './login.component';
import { LoginHeaderComponent } from './login-header.component';
import { LoginBodyComponent } from './login-body.component';
import { LoginModeComponent } from './login-mode.component';
import { LoginModeMobileComponent } from './login-mode-mobile.component';
import { LoginModeAcctComponent } from './login-mode-acct.component';
import { ForgetMobilePasswordComponent } from './forget-mobile-password.component';
import { ModalModule } from '../../common/components/modal/modal.module';


/**
 * 登录模块
 */
@NgModule({
    declarations: [
        LoginComponent,
        LoginHeaderComponent,
        LoginBodyComponent,
        LoginModeComponent,
        LoginModeMobileComponent,
        LoginModeAcctComponent,
        ForgetMobilePasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        SuiValidatorModule,
        CommonDirectivesModule,
        StorageModule,
        SuiCheckboxModule,
        SuiTooltipModule,
        SuiSpinModule,
        BaseServiceModule,
        LoginRouterModule,
        ModalModule
    ],
    exports: [
        
    ],
    providers: [
        LoginService
    ],
    entryComponents: [LoginModeMobileComponent, LoginModeAcctComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class LoginModule { }