import { KeyboardDirectiveModule } from './../../directives/keyboard/keyboard.directive';
import { SuiValidatorGridService } from './../validator/sui-validator-grid.service';
import { ModalModule } from './../modal/modal.module';
import { GridDuplicatrowAlert } from './grid-duplicatrow-alert';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { GridUtilService } from './grid-util.service';
import { ToolbarModule } from './../toolbar/toolbar';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GridSort } from './grid-sort';
import { Grid } from './grid';
import { CommonServicesModule } from './../../services/groups/common-services.module';
import { CommonPipesModule } from './../../pipes/groups/common-pipes.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SuiSpinModule } from '../spin/sui-spin.module';

@NgModule({
    imports: [
        CommonModule,
        CommonPipesModule,
        NgZorroAntdModule,
        ToolbarModule,
        CommonServicesModule,
        ModalModule,
        KeyboardDirectiveModule,
        SuiSpinModule
    ],
    exports: [
        Grid,
        GridSort,
        jqxGridComponent
    ],
    providers: [
        GridUtilService
        ,SuiValidatorGridService
    ],
    declarations: [
        Grid,
        GridSort,
        jqxGridComponent,
        GridDuplicatrowAlert
    ]
})
export class GridModule { }