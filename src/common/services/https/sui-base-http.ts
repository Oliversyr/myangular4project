import { SuiHttpConfig } from './sui-http-config';
import { GlobalService } from './../../global/global.service';
import { Observable } from 'rxjs/Observable';
import { SuiRapSuiHttpService } from './sui-rap-http.service';
import { Http, RequestMethod, ResponseContentType, RequestOptions, Request, URLSearchParams, Headers } from '@angular/http';
import { TopCommon } from './../../top-common/top-common';
import { SuiSpinService } from '../../components/spin/sui-spin.service';
import { BaseRequestOptions } from '@angular/http';
import { SuiRequest, SuiResponse, ResponseRetCode } from './sui-http-entity';
import { SuiHttpResponseTran } from './sui-http-response-tran';
import { SuiLocalConfig } from '../../global/sui-local-config';

/**
* @author liurong
* @date 2017-10-25
* @notes 
* 协议请求基类
* 所有请求都是基于该类;
* 不允许随便修改
*/
export class SuiBaseHttp extends TopCommon {

    /**
     * 超时时间
     */
    protected suiLocalConfig: SuiLocalConfig ;

    constructor(
        private http: Http
        , private rap: SuiRapSuiHttpService
        , private suiSpin: SuiSpinService
        , private suiHttpConfig: SuiHttpConfig
        , private globalService: GlobalService
    ) {
        super();
        this.initSuiHttpConfig();
    }

    private initSuiHttpConfig() {
        if (!this.suiHttpConfig) {
            this.suiHttpConfig = new SuiHttpConfig();
        }
        if (!this.suiHttpConfig.suiHttpResponseTran) {
            this.suiHttpConfig.suiHttpResponseTran = new SuiHttpResponseTran();
        }

       this.suiLocalConfig = this.globalService.getSuiLocalConfig();
    }

    /**
     * 获取默认的请求类型 GET、POST...
     * 1. 如果指定请求类型,则使用该类型
     * 2. 未指定类型的,如果是包含.txt,.json,.html 则使用GET请求;其它默认POST请求
     * 3. 
     * @param option 
     */
    protected getDefaultRequestType(option: any) {
        if (option.type) {
            return option.type;
        }
        //不指定类型; 以下后缀默认使用GET
        if (option.url.indexOf(".json") != -1
            || option.url.indexOf(".html") != -1
            || option.url.indexOf(".txt") != -1) {
            return "GET";
        }
        return "POST";
    }

    /**
     * 原始请求;未封装的,特殊场景使用
     * @param option 
     * @param option.url 请求地址
     */
    protected requestOrigin(option: SuiRequest<any,any>): Observable<SuiResponse<any>> {
        let isPublish: boolean = option.isPublish;
        delete option.isPublish;;
        if (isPublish !== true) {
            //非公共请求需要验证登录
            if (!this.globalService.checkLogin()) {
                return;
            }
        }
        let spinObject = this.openSpin(option.globalLoad);
        return this._requestOrigin(option).map((data: SuiResponse<any>) => {
            this.closeSpin(spinObject);
            // this.globalService.checkLogin(data);
            if (isPublish !== true) {
                this.globalService.checkLogin(data);
            }
            return data;
        });
    }

    /**
     * 原始请求;未封装的,特殊场景使用
     * @param option 
     * @param option.url 请求地址
     */
    private _requestOrigin(option: SuiRequest<any,any>): Observable<SuiResponse<any>> {

        let url: string;
        if (option.rootPath) {
            url = option.rootPath + option.url;
        } else {
            url = option.url;
        }

        let reqOptions: BaseRequestOptions = new BaseRequestOptions();
        
        //默认post
        if (!RequestMethod[option.method]) {
            reqOptions.method = RequestMethod.Post;
        } else {
            reqOptions.method = option.method;
        }

        //默认Json
        if (!ResponseContentType[option.responseType]) {
            reqOptions.responseType = ResponseContentType.Json;
        } else {
            reqOptions.responseType = option.responseType;
        }
        reqOptions.body = this.paramToBody(option.bodyParam);
        reqOptions.params = this.paramToURLSearchParams(option.urlParam);
        if(!(reqOptions.method == RequestMethod.Get && url.endsWith('.json'))){
            //静态资源不允许增加头信息
            reqOptions.headers = this.getHeader(option.headers);
            
            //联调模式
            if(this.suiLocalConfig["ENV_MODE"] === "union") {
                 if(this.suiLocalConfig.DEVELOPER_ADDR) {
                    reqOptions.headers.append("debugRemoteUrl", this.suiLocalConfig.DEVELOPER_ADDR);
                }
            }
        }

        if (reqOptions.method == RequestMethod.Get && reqOptions.body) {
            console.error("request faile; request.get  can't has bodyParam", option);
            throw new Error(" request faile; request.get  can't has bodyParam");
        }

        let interceptResult = this.rap.rapInterceptRequest(option, reqOptions, this.suiHttpConfig);
        if (interceptResult != null) {
            return interceptResult;
        }

        return new Observable<SuiResponse<any>>(observable => {
            this.http.request(url, reqOptions)
                .subscribe(
                (data) => {
                    observable.next(this.suiHttpConfig.suiHttpResponseTran.responseTran(data, option.responseTranFormat, reqOptions.responseType));
                    observable.complete();
                },
                (err) => {
                    observable.next({
                        retCode: ResponseRetCode.LINKED_FAILE,
                        message: "链接失败"
                    });
                    observable.complete();
                },
                () => {
                    // finish
                }
                )
        });
    }

    /**
     * json对象转换为 URLSearchParams 
     * 仅仅支持第一级属性转换; 
     * 如果第一级属性值为,对象,则把转换为字符串
     * @param param 
     */
    protected paramToURLSearchParams(param: object): URLSearchParams {
        if (!param) {
            return null;
        }
        let urlParam: URLSearchParams = new URLSearchParams();
        for (let key in param) {
            if (typeof param[key] === "object") {
                urlParam.set(key, JSON.stringify(param[key]));
            } else {
                urlParam.set(key, param[key]);
            }
        }
        return urlParam;
    }

    /**
     * js对象转换为body 
     * @param param 
     */
    protected   paramToBody(param: object): any {
        if (!param) {
            return null;
        }
        // console.debug(">>>>>>>>>>>>>>> param instanceof ", ( param instanceof FormData));
        if (typeof param === "string" || typeof param === "number"
            || param instanceof Blob || param instanceof ArrayBuffer
            || param instanceof FormData || param instanceof URLSearchParams) { 
            return param;
        }
        return JSON.stringify(param);
    }

    /**
     * 获取请求头信息 
     * @param param 
     */
    protected getHeader(headerCfg): any {
        if (!headerCfg) {
            return null;
        }
        let headers: Headers = new Headers();
        for (let header in headerCfg) {
            headers.append(header, headerCfg[header]);
        }
        return headers;
    }

    private openSpin(globalLoad: string | boolean): any {
        let loadMessage: string = "";
        let isGlobalLoad: boolean;
        if (typeof globalLoad === "string") {
            loadMessage = globalLoad;
            isGlobalLoad = true;
            this.suiSpin.createSpin(globalLoad);
        } else if (typeof globalLoad === "boolean") {
            isGlobalLoad = globalLoad;
            loadMessage = "";
        }
        let spinObject;
        //显示全局加载层
        if (isGlobalLoad) {
            spinObject = this.suiSpin.createSpin(loadMessage);
        }
        return spinObject;
    }

    private closeSpin(spinObject) {
        if (!spinObject) {
            return;
        }
        this.suiSpin.closeSpin(spinObject);
    }


}






