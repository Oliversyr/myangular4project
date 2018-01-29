import { RequestMethod, ResponseContentType } from '@angular/http';
import { SuiHttpService } from './../services/https/sui-http.service';
import { SuiHttpModule } from './../services/https/sui-http.module';
import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { SuiRequest, SuiResponse } from '../services/https/sui-http-entity';
/*
 * 获取服务器文本信息
 * Usage:
 *   url 服务器url地址
 * Example:
 * 1. {{ 1 | textRemote: [{value: 0, label: "加工单"}, {value: 1, label: "分解单"}] }}
 *   返回值为: 分解单
 * 2. {{ 1 | getLabelByvalue: {"0":  "加工单", "1":  "分解单"} }}
 *   返回值为: 分解单
*/
@Pipe({name: 'textRemote', pure: false})
export class TextRemotePipe implements PipeTransform {

  private cachedData: string = null;
  private cachedUrl: string;

  constructor(
    private plHttp: SuiHttpService
  ){

  }
 
  transform(url: string): string {
    if (url !== this.cachedUrl) {
      this.cachedData = null;
      this.cachedUrl = url;
      let request: SuiRequest<any,any> = {
        url: url,
        method: RequestMethod.Get,
        responseType: ResponseContentType.Text
    }
      this.plHttp.requestBase(request).subscribe((res: SuiResponse<any>) => {
        this.cachedData = res.data;
      });
      
    }
 
    return this.cachedData;
  }
}

/**
 * 远程数据管道;需要http请求模块
 */
@NgModule({
  imports: [  ],
  exports: [ 
    TextRemotePipe
   ],
  declarations: [ 
    TextRemotePipe
   ]
})
export class TextRemotePipeModule { }