import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 监控模块入口路由
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:46 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-25 11:59:22
 */

let currentCatalogPath = "../monitor-manage/";
@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "monitor", loadChildren: currentCatalogPath + "monitor/monitor.module#MonitorModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexModule {}