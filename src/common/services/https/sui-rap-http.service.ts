import {startWith }from 'rxjs/operator/startWith'; 
import {SuiHttpConfig }from './sui-http-config'; 
import {BaseRequestOptions }from '@angular/http'; 
import {SuiSpinService }from './../../components/spin/sui-spin.service'; 
import {map }from 'rxjs/operator/map'; 
import {TopCommon }from './../../top-common/top-common'; 
import {Injectable }from '@angular/core'; 
import {Observable }from 'rxjs/Observable'; 
import {ResponseRetCode }from './sui-http-entity'; 
import { GlobalService } from '../../global/global.service';
import { SuiLocalConfig } from '../../global/sui-local-config';
import { RequestMethod } from '@angular/http';

/**
 * 正式环境需要去掉
 */
declare var $; 
declare var DEV_CONFIG; 
declare var DEV_CONFIG_URLS:any; 


interface DevConfigUrl {
    mapUrl:string; 
    server:string; 
    isUnion:boolean; 
}
/**
 * @author liurong
 * @date 2017-08-02
 * @notes Rap接口类
 */
@Injectable()
export class SuiRapSuiHttpService extends TopCommon {

    private devConfigUrls:any; 
    private devUrls:string[]; 
    private suiLocalConfig: SuiLocalConfig ;
    private isInitFlag ;

    constructor(
        private suiSpin:SuiSpinService,
        private globalService: GlobalService
    ) {
        super(); 
        this.suiLocalConfig = this.globalService.getSuiLocalConfig();
        
    }

    private init() {
        this.devConfigUrls = DEV_CONFIG_URLS; 
        this.devUrls = []; 
        for (let key in this.devConfigUrls) {
            this.devUrls.push(key); 
        }
        this.isInitFlag = true ;
    }



    /**
     * rap 接口平台拦截器
     * 如果返回null则不使用rap拦截;
     * @param param 
     */
    rapInterceptRequest(param:any, reqOptions:BaseRequestOptions, suiHttpConfig:SuiHttpConfig) {
        if ( ! (window as any).RAP) {
            return null; 
        }
        if(!this.isInitFlag) {
            this.init(); 
        }


        
        let pathName:string; 
        if (param.url && /^http:\/\//.test(param.url)) {
            pathName = new URL(param.url).pathname.substring(1); 
        }else {
            pathName = param.url; 
        }
        //帮助文件不需要接口服务器
        if (pathName.endsWith("-help.htm")) {
            return null; 
        }
        if(pathName == "api/orgm/module/list") {
            pathName +="-"+param.urlParam.appName;
            // console.log(">>>>>>>pathName",pathName);
            //特殊处理
        }
        
        //看看是否有映射别名
        let devConfigUrl:DevConfigUrl =  {
            mapUrl:pathName, 
            server:"RAP", 
            isUnion:false
        }; 
        Object.assign(devConfigUrl, this.devConfigUrls[pathName]); 
        let urlMap:string = devConfigUrl.mapUrl; 
        param.url = urlMap?urlMap:param.url; 
        //联调测试
        if (devConfigUrl.isUnion) {
            return null; 
        }
        
        //默认RAP
        let server:string = devConfigUrl.server; 
        if (server == "RAP") {
            if(reqOptions.method =  RequestMethod.Get) {
                param.type = "GET"; 
            } else {
                param.type = "POST"; 
            }

        }else {
            let orignUrl:string = param.url; 
            if (orignUrl.indexOf(".json") !== -1) {
                param.type = "GET"; 
            }
            param.url = this.suiLocalConfig["SLIC_INTERFACE_SERVER_URL"] + orignUrl; 
            // console.debug(">>>slicInterfaceRequest-url", param, orignUrl); 
        }
        console.log(`请求${pathName}发送的参数 bodyParam:`, param.bodyParam, " urlParam:" , param.urlParam, );
        return this.rapRequest(param, reqOptions, suiHttpConfig); 
    }


    /**
     * 临时使用 rap请求; rap请求仅仅支持ajax;后续会研究对angular4的支持
     * @param param 
     */
    private rapRequest(param:any, reqOptions:BaseRequestOptions, suiHttpConfig:SuiHttpConfig):Observable < any >  {
        let bodyParam: string;
        if(param.type=="POST" && param.bodyParam) {
            bodyParam = JSON.stringify(param.bodyParam);
        }
        // console.debug(">>>> this's rap request: param, orignUrl", param, orignUrl);
        return new Observable < any > (observable =>  {
            $.ajax( {
                type: param.type, 
                // type: param.type || "get",
                url:param.url, 
                body:bodyParam,
                data: param.urlParam,
                success:(data) =>  {
                    observable.next(suiHttpConfig.suiHttpResponseTran.responseTran(data, param.responseTranFormat, reqOptions.responseType)); 
                    observable.complete(); 
                }, 
                error:(err) =>  {
                    observable.next( {
                        retCode:ResponseRetCode.LINKED_FAILE, 
                        message:"链接失败"
                    }); 
                    observable.complete(); 
                }
            }); 
        }); 
    }



}







