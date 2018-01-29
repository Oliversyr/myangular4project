import { ResponseContentType } from '@angular/http';
import { InjectionToken, Injectable } from '@angular/core';
import { SuiResponse, ResponseRetCode } from './sui-http-entity';

/**
 * 将不同类型的数据结构
 * 转换为数据结构相同的 SuiResponse
 */
export  enum SuiResponseTranFormat {
    /**
     * {
     * data: 存储原始response数据(可以不是json对象)
     * }
     */
    ORIGIN_RESPONSE = 1,
    /**
     * 接收的数据与SuiResponse结构相同
     */
    SAME_SUIRESPONSE,
    /**
     * 常用业务格式
     * 1. 结构类型1:{
     * retCode: "", //SUCCESS- 成功,其它-失败
     * retMsg: "", //错误信息
     * ...其它参数
     * }
     * 
     * 2. 结构类型2:{
     * retCode: "", //0- 成功,其它-失败
     * message: "", //错误信息
     * ...其它参数
     * }
     * 
     */
    NORMAL_BUSINESS,
    /**
     * 无任何状态码 
     * 所有数据都存放在 data中
     * 例如:静态文本,配置文件等
     * 
     * 
     */
    ALL_JSON_DATA,
    /**
     * 文件上传格式
     * 转换后格式为:
     * {
     *   ...
     *   data: {pickCode: "", storageName: "" }
     * }
     */
    UPFILE
}

export class SuiHttpResponseTran {
    /**
     * 返回数据转换接口
     */
    responseTran = (response: any, format: SuiResponseTranFormat, responseType: ResponseContentType): SuiResponse<any> => {
        let newData: SuiResponse<any> = {
            retCode: ResponseRetCode.SUCCESS
        }
        if (responseType == ResponseContentType.Text) {
            newData.data = response.text();
            return newData;
        }
        if ([ResponseContentType.ArrayBuffer, ResponseContentType.Blob].indexOf(responseType) != -1) {
            newData.data = response;
            return newData;
        }
        //默认 ORIGIN
        if (!format) {
            format = SuiResponseTranFormat.NORMAL_BUSINESS;
        }
        let unNeedJsons = [SuiResponseTranFormat.ORIGIN_RESPONSE];
        if (unNeedJsons.indexOf(format) == -1) {
            //其它格式都需要json格式数据
            let _response = response,err: any = {} ;
            try {
                response = response.json();
            } catch (e) {
                err = e;
            }
            if(!response) {
                let responseTypeName = ResponseContentType[responseType];
                let formatName = SuiResponseTranFormat[format];
                newData.retCode = ResponseRetCode.FAILE;
                newData.message = `response.json error ,please make sure the responseType=[${responseTypeName}] is reasonable; SuiResponseTranFormat=[${formatName}] `;
                console.error(newData.message+";_response, " , _response, err.stack);
                return newData ;
            }
        }
        if (format == SuiResponseTranFormat.NORMAL_BUSINESS || format == SuiResponseTranFormat.UPFILE) {
            if(["S0000","SUCCESS", "0"].indexOf(response.retCode) != -1) {
                newData.retCode = ResponseRetCode.SUCCESS;
            } else if(["USER_NOT_LOGIN"].indexOf(response.retCode) != -1){
                newData.retCode = ResponseRetCode.LOGIN_TIMEOUT;
            }  else {
                newData.retCode = response.retCode;
            } 
            newData.message = response.retMsg || response.message || "";
            delete response.retCode;
            delete response.retMsg;
            if(format == SuiResponseTranFormat.UPFILE) {
                newData.data = response.obj || response;  
            }else {
                newData.data = response;
            }
        } if (format == SuiResponseTranFormat.SAME_SUIRESPONSE) {
            newData = response;
        } else if (format == SuiResponseTranFormat.ALL_JSON_DATA) {
            newData.retCode = ResponseRetCode.SUCCESS;
            newData.data = response;
        } else if (format == SuiResponseTranFormat.ORIGIN_RESPONSE) {
            newData.retCode = ResponseRetCode.SUCCESS;
            newData.data = response;
        } 
        return newData;
    };
}