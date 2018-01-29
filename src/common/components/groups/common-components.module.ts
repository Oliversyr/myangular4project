import { SuiAutoCompleteModule } from './../auto-complete/sui-auto-complete.module';
import { SuiSpinModule } from './../spin/sui-spin.module';
import { SuiComboBoxModule } from './../input/sui-combobox';
import { SuiSwitchModule } from './../button/sui-switch';
import { SuiRadioModule } from './../button/sui-radio';
import { SuiCheckBoxModule } from './../button/sui-checkbox';
import { SuiSelectModule } from './../input/sui-select';
import { SuiInputModule } from './../input/sui-input';
import { SuiDateModule } from './../input/sui-date';
import { SuiPanelModule } from './../panels/panel';
import { ModalModule } from './../modal/modal.module';
import { SuiText, SuiTextModule } from './../input/text';
import { SuiCellModule } from './../input/cell';
import { SuiResponsiveModule } from './../responsive/sui-responsive.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiTransferModule } from '../transfer/sui-transfer.module';


/**
 * 常用组件模块
 */
@NgModule({
  imports: [
    //响应式布局
    SuiResponsiveModule
    //单元格布局
    , SuiCellModule
    //text显示
    , SuiTextModule
    //提出或提示框
    , ModalModule
    //面板信息
    , SuiPanelModule
    //日期模块
    , SuiDateModule
    //输入框组件
    , SuiInputModule
    //下拉框
    , SuiSelectModule
    //组合下拉框
    , SuiComboBoxModule
    //自动补全
    , SuiAutoCompleteModule
    //checkbox
    , SuiCheckBoxModule
    //radio
    , SuiRadioModule
    //开关控件
    , SuiSwitchModule
    //加载层
    , SuiSpinModule
    //穿梭框
    , SuiTransferModule
  ],
  exports: [
    //响应式布局
    SuiResponsiveModule
    //单元格布局
    , SuiCellModule
    //text显示
    , SuiTextModule
    //提出或提示框
    , ModalModule
    //面板信息
    , SuiPanelModule
    //日期模块
    , SuiDateModule
    //输入框组件
    , SuiInputModule
    //下拉框
    , SuiSelectModule
    //组合下拉框
    , SuiComboBoxModule
    //自动补全
    , SuiAutoCompleteModule
    //checkbox
    , SuiCheckBoxModule
    //radio
    , SuiRadioModule
    //开关控件
    , SuiSwitchModule
    //加载层
    , SuiSpinModule
    //穿梭框
    , SuiTransferModule
  ],
  declarations: [

  ]
  , schemas: [NO_ERRORS_SCHEMA]
})
export class CommonComponentsModule { }