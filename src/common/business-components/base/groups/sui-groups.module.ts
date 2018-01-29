import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiAutoCompleteModule } from '../../../components/auto-complete/sui-auto-complete.module';
import { ModalModule } from '../../../components/modal/modal.module';
import { GridModule } from '../../../components/grid/grid.module';
import { SuiGroupsComponent } from './sui-groups.component';
import { SuiGroupsService } from './sui-groups.service';

/*
 * 所属店组业务组件模块
 * @Author: xiahl 
 * @Date: 2018-01-09 10:33:40 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 12:27:36
 */
@NgModule({
  declarations: [SuiGroupsComponent],
  imports: [
    CommonModule
    , FormsModule
    , SuiAutoCompleteModule
    , ModalModule
    , GridModule
  ],
  exports: [SuiGroupsComponent],
  providers: [SuiGroupsService],
  schemas: [NO_ERRORS_SCHEMA]
})

export class SuiGroupsModule { }
