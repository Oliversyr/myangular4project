import { HttpModule } from '@angular/http';
import { SuiHttpUpfileService } from './sui-http-upfile.service';
import { SuiHttpService } from './sui-http.service';
import { SuiRapSuiHttpService } from './sui-rap-http.service';
import { NgModule } from '@angular/core';
import { SuiSpinService } from '../../components/spin/sui-spin.service';




@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        SuiSpinService
        , SuiHttpService
        , SuiRapSuiHttpService
        , SuiHttpUpfileService
    ]

}) export class SuiHttpModule {

}






