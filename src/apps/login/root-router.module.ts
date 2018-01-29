import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appName = 'login';
const root = `apps/${appName}/`;
const routers: Routes = [
    { path: appName, loadChildren: root + 'login.module#LoginModule' }
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routers)
    ],
    exports: [
    ],
    providers: []
})
export class RootRouterModule { }  