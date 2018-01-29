import { FormsModule } from '@angular/forms';
import { BaseServiceModule } from './../top-common/base.service.module';
import { GridModule } from './../components/grid/grid.module';
import { BaseService } from './../top-common/base.service';
import { ModalService } from './../components/modal/modal.service';
import { ModuleRightService } from './../top-common/module-right.service';
import { TabOuterUtil } from './../components/tab-menu/tab-outer-util';
import { BaseListService } from './../top-common/base-list.service';
import { ToolbarModule } from './../components/toolbar/toolbar';
import { TemplateListModule } from './../components/templates/template-list';
import { CommonDirectivesModule } from './../directives/groups/common-directives.module';
import { CommonServicesModule } from './../services/groups/common-services.module';
import { CommonComponentsModule } from './../components/groups/common-components.module';
import { CommonPipesModule } from './../pipes/groups/common-pipes.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * 通用列表模块
 * 列表常用的模块
 */
@NgModule({
    imports: [ 
        CommonPipesModule
        // ,CommonServicesModule
        ,CommonDirectivesModule
        ,CommonComponentsModule
        ,GridModule
        ,TemplateListModule
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
        ,TemplateListModule
        ,ToolbarModule
        ,BaseServiceModule
     ]
     ,
     providers: [
        BaseListService
     ]
     ,schemas: [ NO_ERRORS_SCHEMA ]
}) export class CommonListModule {}