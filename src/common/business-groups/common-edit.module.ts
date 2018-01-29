import { FormsModule } from '@angular/forms';
import { GridModule } from './../components/grid/grid.module';
import { BaseEditService } from './../top-common/base-edit.service';
import { SuiFormsModule } from './../components/groups/sui-forms.module';
import { CommonPipesModule } from './../pipes/groups/common-pipes.module';
import { BaseServiceModule } from './../top-common/base.service.module';
import { ToolbarModule } from './../components/toolbar/toolbar';
import { TemplateEditModule } from './../components/templates/template-edit';
import { CommonComponentsModule } from './../components/groups/common-components.module';
import { CommonDirectivesModule } from './../directives/groups/common-directives.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * 通用编辑模块
 * 编辑常用的模块
 */
@NgModule({
    imports: [ 
        CommonPipesModule,
        SuiFormsModule
        // ,CommonServicesModule
        ,CommonDirectivesModule
        ,CommonComponentsModule
        ,GridModule
        ,TemplateEditModule
        ,ToolbarModule
        ,BaseServiceModule
     ],
     exports: [
        FormsModule
        ,CommonPipesModule
        ,SuiFormsModule
        // ,CommonServicesModule
        ,CommonDirectivesModule
        ,CommonComponentsModule
        ,GridModule
        ,TemplateEditModule
        ,ToolbarModule
        ,BaseServiceModule
     ]
     ,
     providers: [
        BaseEditService
     ]
     ,schemas: [ NO_ERRORS_SCHEMA ]
}) export class CommonEditModule {}