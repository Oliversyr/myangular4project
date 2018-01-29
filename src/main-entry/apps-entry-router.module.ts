import { ErrorComponent } from './error/error.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { RootRouterModule as FpfNewRouterModule } from './../apps/fpf-new/root-router.module';
// import { RootRouterModule as FpfRouterModule } from './../apps/fpf/root-router.module';
// import { RootRouterModule as AppsCenterRouterModule } from './../apps/apps-center/root-router.module';
// import { RootRouterModule as DemosRouterModule } from './../apps/demos/root-router.module';
import { RootRouterModule as LoginRouterModule } from './../apps/login/root-router.module';
import { RootRouterModule as TbSystemRouterModule } from './../apps/tb-system/root-router.module';
import { RootRouterModule as TbStorageRouterModule } from './../apps/tb-storage/root-router.module';
import { RootRouterModule as AccCenterRouterModule} from './../apps/acc-center/root-router.module'

// import { StorageModule } from '../common/services/storage/storage.module';
/**
 * @author liurong
 * @create date 2017-11-29 10:48:40
 * @modify date 2017-11-29 10:48:43
 * @desc 所有应用路由入口模块
*/

@NgModule({
    declarations:[
        
    ],
    imports: [
        RouterModule.forChild([ 
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'error', component:ErrorComponent }
        ])
        // , FpfNewRouterModule
        // , FpfRouterModule
        // , AppsCenterRouterModule
        // , DemosRouterModule
        , LoginRouterModule
        , TbSystemRouterModule
        , TbStorageRouterModule
        , AccCenterRouterModule
        // ,StorageModule        

    ]
    ,providers: [

    ]
})
export class AppsEntryRouterModule { }


