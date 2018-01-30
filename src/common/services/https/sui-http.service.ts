import { SuiMap } from './../../top-common/common.class';
import { GlobalService } from './../../global/global.service';
import { SuiSpinService } from './../../components/spin/sui-spin.service';
import { SuiBaseHttp } from './sui-base-http';
import { SuiHttpUpfileService } from './sui-http-upfile.service';
// import { SuiHttpService1 } from './sui-http.service1';
import { Params } from '@angular/router';
import { SuiRapSuiHttpService } from './sui-rap-http.service';
import { TopCommon } from './../../top-common/top-common';
import { Injectable, Inject } from '@angular/core';
import { HttpModule, Http, Response, URLSearchParams } from '@angular/http';
import { RequestOptions, Request, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { SuiRequest, SuiResponse, SuiRequestBase, SuiRequestUpFile } from './sui-http-entity';
import { SuiHttpConfig, SUI_HTTP_CONFIG } from './sui-http-config';

export interface TestPer {
    name: string;
}

/**
 * @author liurong
 * @date 2017-08-02
 * @notes 协议工具类
 */
@Injectable()
export class SuiHttpService extends SuiBaseHttp {

    private businessHeaders: { [key: string]: string };


    constructor(
        http: Http
        , rap: SuiRapSuiHttpService
        , suiSpin: SuiSpinService
        , globalService: GlobalService
        , private suiHttpUpfile: SuiHttpUpfileService
        , @Inject(SUI_HTTP_CONFIG) suiHttpConfig: SuiHttpConfig
    ) {
        super(http, rap, suiSpin, suiHttpConfig, globalService);
        this.businessHeaders = suiHttpConfig.businessHeaders;
    }


    /**
     * 基础请求;
     * 配置文件、静态页面等数据请求
     * 
     * @param {SuiRequestBase} option 
     * @returns {Observable<SuiResponse>} 
     * @memberof SuiHttpService
     */
    requestBase(option: SuiRequestBase<any, any>): Observable<SuiResponse<any>> {
        return super.requestOrigin(option);
    }

    /**
     * 业务数据请求
     * 自动添加businessHeaders
     * @param {SuiRequest} option 
     * @returns {Observable<SuiResponse>} 
     * @memberof SuiHttpService
     */
    request(option: SuiRequest<any, any>): Observable<SuiResponse<any>> {
        //默认需要增加 content-type
        // if (!option.headers['content-type']) {
            //liurong modify 2018-01-29 增加FormData支持
        if (option.isFormData == true) {
            option.bodyParam = super.paramToURLSearchParams(option.bodyParam).toString();
            option.headers = Object.assign({"content-type":"application/x-www-form-urlencoded; charset=UTF-8"},option.headers);
        } else {
            option.headers = Object.assign({}, option.headers);
        }
        // }
        if (option.isBusinessHeader !== false && this.businessHeaders) {
            //添加业务头
            option.headers = Object.assign({}, this.businessHeaders, option.headers);

        }
        return super.requestOrigin(option);
    }

    /**
     * 上传文件
     * 
     * @param {SuiRequestUpFile} option 
     * @returns {Observable<SuiResponse>} 
     * @memberof SuiHttpService
     */
    requestUpFile(option: SuiRequestUpFile): Observable<SuiResponse<any>> {
        /* this.suiHttpUpfile.getUpFileRequest(option).map( (suiRequest: SuiRequest) => {
           return this.request2(suiRequest).subscribe(data =>{ return data});
       }); */
        return new Observable<any>(observable => {
            this.suiHttpUpfile.getUpFileRequest(option).subscribe((suiRequest: SuiRequest<any, any>) => {
                super.requestOrigin(suiRequest).subscribe(res => {
                    observable.next(res);
                    observable.complete();
                });
            });

        });
    }

    // /**
    // * 封装请求
    // * option.url: 请求url;
    // * option.type: 请求类型 GET、POST等;
    // * option.param: 请求参数 
    // *    GET请求,放在自动放在url后面、
    // *    POST请求,放在body;
    // * 返回结果 results
    // * results.retCode - 状态码; 0-成功, 其它都是失败; 如果url不存在或者serve请求失败retCode=-1;
    // * results.message - 错误信息:  retCode=0的情况下,返回错误信息
    // * @param option 
    // */
    // request(option: any): Observable<any> {
    //     return this.suiHttp.request(option);
    // }


    // /**
    // * 原始请求;,特殊场景使用
    // * 封装请求
    // * option.url: 请求参数;
    // * option.type: 请求类型 GET、POST等;
    // * option.param: 请求参数 
    // *    GET请求,放在自动放在url后面、
    // *    POST请求,放在body;
    //  * 封装了rap
    //  * @param param 
    //  * @param param.url 请求地址
    //  */
    // requestOrigin(option: any): Observable<any> {
    //     return this.suiHttp.requestOrigin(option);
    // }

    // /**
    //  * 文件上传
    //  * @param param 
    //  * @param param.url 请求地址
    //  */
    // upFile(option: any): Observable<any> {
    //     return this.suiHttpUpfile.upFile(option);
    // }

    // /**
    // * 文件上传 到文件服务器
    // * @param param 
    // * @param param.url 请求地址
    // */
    // upFileToFileServe(option: any): Observable<any> {
    //     option.type = "POST";
    //     return this.suiHttpUpfile.upFileToFileServe(option);
    // }


}






