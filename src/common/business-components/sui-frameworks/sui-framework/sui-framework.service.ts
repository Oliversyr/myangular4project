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

    getMenus(param: any, appMenuType?: string): Observable<SuiResponse<any>> {
        switch (appMenuType) {
            case 'PLATFORM_OPERATE':
                return this.getPlatformOperateMenus(param);
            default:
                return this.getDefaultMenus(param);
        }
    }

     /**
     * 获取用户模块
     */
    getDefaultMenus(param): Observable<any> {
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

    getPlatformOperateMenus(param: any): Observable<SuiResponse<any>> {
        let myParam = {
            url: 'common/menu/get',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            isFormData:true,
            method: RequestMethod.Get,
        }
        return this.suiHttp.request(myParam).map((data) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            if(Array.isArray(data.data.result)){
                data.data.result.forEach(element => {
                    element.moduleid = element.funcId;//模块ID
                    element.modulename = element.funcName;//模块名称
                    element.parentmoduleid = "0";//父模块ID（二级菜单默认为0）
                    element.rightvalue = "0";//权值（默认为0）
                    element.modList.forEach((element2,index) => {
                        var urlArr = element.funcNo.split("_");
                        element2.moduleid = element2.funcId;//模块ID
                        element2.modulename = element2.funcName;//模块名称
                        element2.parentmoduleid = element2.funcId;//父模块ID
                        element2.rightvalue = "0";//权值（默认为0）
                        element2.url = urlArr[0]+"/"+urlArr[1];
                        if(index == element.modList.length-1){
                            element.childrens = element.modList;//三级菜单
                        }
                    });
                });
            }
            return {
                data: data.data.result,
                retCode:data.retCode,
                message:data.message
            };
        })

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


}