import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Application } from './application';
import { GlobalService } from '../../../global/global.service';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { SuiHttpService } from './../../../../common/services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from './../../../../common/services/https/sui-http-entity';

/**
 * @author liurong
 * @create date 2017-11-29 11:57:54
 * @modify date 2017-11-29 11:57:54
 * @desc 基础框架服务
*/
@Injectable()
export class SuiFrameworkService {

    constructor(
        private modalSer: ModalService,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService,
    ) {

    }

    getApps(param: any): Observable<SuiResponse<any>> {
        return this.suiHttp.request(param);

    }

    getMenus(param: any): Observable<SuiResponse<any>> {
        return this.suiHttp.request(param);
    }

    /**
     * 获取静态菜单
     * @param param 
     */
    getStaticMenus(param: any): Observable<SuiResponse<any>> {
        return this.suiHttp.request(param);
    }

    /**
     * 获取用户应用
     */
    getAppList(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/orgm/app/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            };
            return data;
        })
    }

    /**
     * 获取用户模块
     */
    getModuleList(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/orgm/module/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            };
            return data;
        })
    }

}