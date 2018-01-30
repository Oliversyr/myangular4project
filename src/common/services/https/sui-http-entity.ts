import { RequestMethod, ResponseContentType } from '@angular/http';
import { SuiResponseTranFormat } from './sui-http-response-tran';


/**
 * 请求发送信息文件上传类
 */
export interface SuiRequestUpFile {
    /**
     * 请求路径
     */
    url: string;
    /**
     * 请求根路径
     */
    rootPath?: string;
    /**
     * 上传服务器类型
     * FILE_SERVER - 文件服务器
     * 其它 -- 通用服务器
     */
    upServerType?: string;
    /**
     * 是否有业务头 默认true
     * 例如token 数据
     */
    isBusinessHeader?: boolean;
    /**
     * 是否公共请求(是否需要登录)
     * 默认true
     */
    isPublish?: boolean;
    /**
     * 其它参数
     */
    urlParam: {
            /**
             * 文件名称
             */
            fileName: string;
            /**
             * 文件类型
             */
            upFileType?: string;
            [key: string]: any;
        };
        /**
     * 其它参数
     */
    bodyParam: {
        /**
         * 文件数据
         */
        fileData: any;
        [key: string]: any;
    };
    headers?: { [key: string]: string };
}

/**
 * 请求发送信息业务类
 */
export interface SuiRequest<B, U> extends SuiRequestBase<B, U> {
    /**
     * 是否有业务头 默认true
     * 例如token 数据
     */
    isBusinessHeader?: boolean;
    /**
     * 是否公共请求(是否需要登录)
     * 默认true
     */
    isPublish?: boolean;
}

/**
 *  请求发送信息基础类
 */
export interface SuiRequestBase<B, U> {
    /**
     * 是否为FormData 表单数据
     * 1. 默认false
     */
    isFormData?: boolean,
    /**
     * 请求路径
     */
    url: string;
    /**
     * 请求根路径
     */
    rootPath?: string;
    /**
     * 请求方法
     */
    method?: RequestMethod;
    /**
     * body参数:仅仅支持 method = RequestMethod.Post
     */
    bodyParam?: B;
    /**
     * url参数,存放ulr后面xxx?key=1&key2=1
     */
    urlParam?: U;
    /**
     * 返回数据格式 默认Json
     */
    responseType?: ResponseContentType;
    /**
     * 头信息
     */
    headers?: { [key: string]: string };
    withCredentials?: boolean;

    /**
     * 返回数据转换格式  SuiResponseTranFormat
     */
    responseTranFormat?: SuiResponseTranFormat;
    /**
     * 是否显示全局加载层loading
     */
    globalLoad?: boolean;
}


/**
 * 请求接收数据类
 */
export interface SuiResponse<T> {
    /**
     * 状态码
     */
    retCode: ResponseRetCode;
    /**
     * 失败返回消息
     */
    message?: string;
    /**
     * 存储处理数据
     */
    data?: T;
}

/**
 * 请求接收数据状态码
 */
export enum ResponseRetCode {
    /**
     * 链接失败
     */
    LINKED_FAILE = 404,
    /**
     * 成功
     */
    SUCCESS = 0,
    /**
     * 失败
     */
    FAILE = 11,
    /**
     * 登录超时
     */
    LOGIN_TIMEOUT = 101,
}
