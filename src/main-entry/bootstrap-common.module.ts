// import { DemosModule } from './demos.module';
import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { environment } from '../../config/environments/environment';

/**
 * @author liurong
 * @date 2017-08-17
 * @notes 应用启动通用模块
 */
@NgModule({
    // imports: [RouterModule.forRoot([])],//不支持html5模式
    imports: [RouterModule.forRoot([], { useHash: true })],
    // exports: [ RouterModule, DemosModule ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy }//正式环境需要设置为Hash模式,解决有项目名称情况,开发环境去掉(解决多级iframe问题)
    ]

})
export class BootstrapCommonModule { }