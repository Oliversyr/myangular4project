import { FormsModule } from '@angular/forms';
import { BaseServiceModule } from './../top-common/base.service.module';
import { GridModule } from './../components/grid/grid.module';
import { BaseService } from './../top-common/base.service';
import { ModalService } from './../components/modal/modal.service';
import { ModuleRightService } from './../top-common/module-right.service';
import { TabOuterUtil } from './../components/tab-menu/tab-outer-util';
import { BaseDetailService } from './../top-common/base-detail.service';
import { ToolbarModule } from './../components/toolbar/toolbar';
import { TemplateDetailModule } from './../components/templates/template-detail';
import { CommonDirectivesModule } from './../directives/groups/common-directives.module';
import { CommonServicesModule } from './../services/groups/common-services.module';
import { CommonComponentsModule } from './../components/groups/common-components.module';
import { CommonPipesModule } from './../pipes/groups/common-pipes.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * 通用详情模块
 * 详情常用的模块
 */
@NgModule({
    imports: [ 
        CommonPipesModule
        // ,CommonServicesModule
        ,CommonDirectivesModule
        ,CommonComponentsModule
        ,GridModule
        ,TemplateDetailModule
        ,ToolbarModule
        ,BaseServiceModule
     ],
     exports: [
        FormsModule
        ,CommonPipesModule
        // ,CommonServicesModule
        ,CommonDirectivesModule
        ,CommonComponentsModule
        ,GridModule
        ,TemplateDetailModule
        ,ToolbarModule
        ,BaseServiceModule
     ]
     ,
     providers: [
        BaseDetailService
     ]
     ,schemas: [ NO_ERRORS_SCHEMA ]
}) export class CommonDetailModule {}