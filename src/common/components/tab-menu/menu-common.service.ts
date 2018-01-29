import { SuiHttpService } from './../../services/https/sui-http.service';
import { TopCommon } from './../../top-common/top-common';



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CommonServices } from "../../services/groups/common-services.module";
import { Menu } from './menu';

@Injectable()
export class MenuCommonService extends TopCommon{
    
    constructor(
        private httpService: SuiHttpService,
        private utils: CommonServices
    ) {
        super();
     }

   
    getMenus(url):Observable<Menu[]>{
        return this.httpService.request({url:url}).map( req => {
            if(req.retCode == 0) {
                return req.data ;
            }
            return [];
        })
        
    }

}