import { CookieModule } from 'ngx-cookie';
import { NgModule } from '@angular/core';
import { SuiCookieService } from './sui-cookie.service';

/**
 * 存储模块
 */
@NgModule({
    imports: [ 
        CookieModule.forRoot()
     ],
    providers: [  
        SuiCookieService
    ]
}) export class StorageModule {}
