import { SuiHttpResponseTran } from './sui-http-response-tran';
import { ResponseContentType } from '@angular/http';
import { InjectionToken, Injectable } from '@angular/core';

export const SUI_HTTP_CONFIG = new InjectionToken<SuiHttpConfig>('suiHttpConfig');

export class SuiHttpConfig{
    /**
     * 业务需要添加头信息
     */
    businessHeaders: { [key: string]: string };
    /**
     * 返回数据转换接口
     */
    suiHttpResponseTran: SuiHttpResponseTran;
}