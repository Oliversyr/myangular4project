
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { CommonListModule } from '../../../../common/business-groups/common-list.module';

import { RoleListComponent } from './role-list.component';
import { RolePowerComponent } from './role-power/role-power.component';
import { RolePowerTreeComponent } from './role-power/role-power-tree.component';
import { RoleUserComponent } from './role-user/role-user.component';
import { RoleListService } from './role-list.service';
import { RolePowerService } from './role-power/role-power.service';
import { RoleUserService } from './role-user/role-user.service';
import { SuiCheckboxModule } from '../../../../common/components/checkbox/sui-checkbox.module'

import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';

/**
 * 角色与权限公共模块
 * @Created by: yangr 
 * @Created Date: 2017-12-11 11:56:25 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-22 12:00:27
 */

@NgModule({
    declarations: [ RoleListComponent, RolePowerComponent, RoleUserComponent, RolePowerTreeComponent ],
    imports: [ CommonModule, 
                CommonListModule,
                SuiOrganModule,
                SuiCheckboxModule,
                RouterModule.forChild([
                    {path: "", component: RoleListComponent},
                    // {path: "manageShop", component: ManageShopComponent}
                ])
            ],
    providers: [ RoleListService, RolePowerService, RoleUserService ],
    // exports: [ RolePowerComponent, RoleUserComponent ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class RoleModule { }