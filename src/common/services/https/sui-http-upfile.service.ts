import { SuiResponse, SuiRequestUpFile, SuiRequest } from './sui-http-entity';
import { SUI_HTTP_CONFIG, SuiHttpConfig } from './sui-http-config';
import { GlobalService } from './../../global/global.service';
import { SuiBaseHttp } from './sui-base-http';
import { Params } from '@angular/router';
import { TopCommon } from './../../top-common/top-common';
import { Injectable, Inject } from '@angular/core';
import { HttpModule, Http, Response, URLSearchParams } from '@angular/http';
import { RequestOptions, Request, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { SuiSpinService } from '../../components/spin/sui-spin.service';
import { SuiResponseTranFormat } from './sui-http-response-tran';

declare var Buffer: any;

/**
* @author liurong
* @date 2017-10-25
* @notes 
* 文件上传请求
* 
*/
@Injectable()
export class SuiHttpUpfileService /* extends SuiBaseHttp */ {



    /**
     * 获取文件上传请求参数
     * @param option 
     */
    getUpFileRequest(option: SuiRequestUpFile): Observable<SuiRequest<any,any>> {
        if (option.upServerType == "FILE_SERVER") {
            return this.getUpFileRequestByFileServer(option);
        } else {
            return this.getUpFileRequestCommon(option);
        }
    }

    getUpFileRequestCommon(option: SuiRequestUpFile): Observable<SuiRequest<any,any>> {
        let suiRequest: SuiRequest<any,any> = this.getSuiRequest(option);
        suiRequest.urlParam = option.urlParam;
        let formData = new FormData();
        formData.append('file', option.bodyParam.fileData);
        suiRequest.bodyParam = formData;
        return new Observable<any>(observable => {
            observable.next(suiRequest);
            observable.complete();
        });
    }

    private getSuiRequest(option: SuiRequestUpFile) {
        let suiRequest: SuiRequest<any,any> = {
            url: option.url,
            rootPath: option.rootPath,
            method: RequestMethod.Post,
            isBusinessHeader: option.isBusinessHeader,
            isPublish: option.isPublish,
            responseTranFormat: SuiResponseTranFormat.UPFILE,
            headers: option.headers
        };
        return suiRequest;
    }

    /**
    * 获取文件上传请求参数
    * @param option 
    */
    private getUpFileRequestByFileServer(option: SuiRequestUpFile): Observable<SuiRequest<any,any>> {
        return new Observable<any>(observable => {
            if (option.bodyParam.fileData instanceof File) {
                //文件转换为Buffer 
                this.fileToBuffer(option.bodyParam.fileData).subscribe((fileBuffer) => {
                    option.bodyParam.fileData = fileBuffer;
                    observable.next(this._getUpFileRequestByFileServer(option));
                    observable.complete();
                });
            } else {
                //直接数据流
                observable.next(this._getUpFileRequestByFileServer(option));
                observable.complete();
            }
        });
    }

    private _getUpFileRequestByFileServer(option: SuiRequestUpFile): SuiRequest<any,any> {
        let _param = {
            fileName: option.urlParam.fileName,
            fileData: option.bodyParam.fileData,
            fileDataEncode: "",
            thumbnails: ""
        }
        if (option.urlParam.upFileType != "FILE") {
            //图片类型 默认: 450x450:jpg;240x240;
            _param.thumbnails = option.urlParam.thumbnails || "450x450:jpg;240x240;";
            _param.fileDataEncode = option.urlParam.fileDataEncode || "base64";
            //dataUrl处理
            if (typeof _param.fileData == "string") {
                //如果图片为dataUrl;则去掉头信息data:image/xxx;base64,...
                let fileDatas = _param.fileData.split(",");
                if (fileDatas.length == 2) {
                    _param.fileData = fileDatas[1];
                }
            }
        } else {
            //非图片上传,设置为空
            _param.thumbnails = "";
            // _param.fileDataEncode = option.param.fileDataEncode || "utf-8";
        }
        let param = this.buildUploadParam(_param);
        let paramStr = JSON.stringify(param);
        
        let suiRequest: SuiRequest<any,any> = this.getSuiRequest(option);
        suiRequest.bodyParam = paramStr;
        delete option.urlParam.thumbnails;
        delete option.urlParam.fileDataEncode;
        suiRequest.urlParam = option.urlParam;
        suiRequest.method = RequestMethod.Post;
        return suiRequest;
    }



    // /**
    //  * 文件上传
    //  * @param option 
    //  */
    // upFile(option: any): Observable<any> {
    //     let formData = new FormData();
    //     formData.append('file', option.fileData);
    //     let param = option.param;
    //     option.urlParam = param;
    //     option.bodyParam = formData;
    //     delete option.fileData;
    //     delete option.param;
    //     option.method = RequestMethod.Post;
    //     return super._requestOrigin2(option);
    // }


    // /**
    // * 文件上传 到文件服务器
    // * @param option 
    // */
    // upFileToFileServe(option: SuiRequestUpFile): Observable<SuiResponse> {
    //     return new Observable<any>(observable => {
    //         if (option.fileData instanceof File) {
    //             //文件转换为Buffer 
    //             this.fileToBuffer(option.fileData).subscribe((fileBuffer) => {
    //                 option.fileData = fileBuffer;
    //                 this._upFileToFileServe(option).subscribe(data => {
    //                     observable.next(data);
    //                     observable.complete();
    //                 });
    //             });
    //         } else {
    //             //直接数据流
    //             this._upFileToFileServe(option).subscribe(data => {
    //                 observable.next(data);
    //                 observable.complete();
    //             });
    //         }
    //     });
    // }

    // private _upFileToFileServe(option: any): Observable<any> {

    //     let _param = {
    //         fileName: option.param.fileName,
    //         fileData: option.fileData,
    //         fileDataEncode: "",
    //         thumbnails: ""
    //     }
    //     if (option.param.upFileType != "FILE") {
    //         //图片类型 默认: 450x450:jpg;240x240;
    //         _param.thumbnails = option.param.thumbnails || "450x450:jpg;240x240;";
    //         _param.fileDataEncode = option.param.fileDataEncode || "base64";
    //         //dataUrl处理
    //         if (typeof _param.fileData == "string") {
    //             //如果图片为dataUrl;则去掉头信息data:image/xxx;base64,...
    //             let fileDatas = _param.fileData.split(",");
    //             if (fileDatas.length == 2) {
    //                 _param.fileData = fileDatas[1];
    //             }
    //         }
    //     } else {
    //         //非图片上传,设置为空
    //         _param.thumbnails = "";
    //         // _param.fileDataEncode = option.param.fileDataEncode || "utf-8";
    //     }
    //     delete option.param.fileName;
    //     delete option.param.thumbnails;
    //     delete option.param.upFileType;
    //     delete option.param.fileDataEncode;
    //     let param = this.buildUploadParam(_param);
    //     let paramStr = JSON.stringify(param);
    //     option.bodyParam = paramStr;
    //     option.urlParam = option.param;
    //     delete option.fileData;
    //     delete option.param;

    //     option.method = RequestMethod.Post;
    //     return super._requestOrigin2(option);
    // }

    /**
     * File转正为Buffer流
     * @param file 
     */
    private fileToBuffer(file: File): Observable<any> {

        return new Observable<any>(observable => {
            let reader = new FileReader();
            reader.onload = (e) => {
                let arrayBufferFileData = reader.result;
                let bufferFileData = this.arrayBufferToBuffer(arrayBufferFileData);
                observable.next(bufferFileData);
                observable.complete();
            }
            reader.readAsArrayBuffer(file);
        });
    }

    private arrayBufferToBuffer(ab): any {
        let isArrayBufferSupported = (new Buffer(new Uint8Array([1]).buffer)[0] === 1);
        if (isArrayBufferSupported) {
            return new Buffer(ab);
        } else {
            let buffer = new Buffer(ab.byteLength);
            let view = new Uint8Array(ab);
            for (let i = 0; i < buffer.length; ++i) {
                buffer[i] = view[i];
            }
            return buffer;
        }
    }

    private buildUploadParam(_param: any): any {
        _param.thumbnails = _param.thumbnails || "";
        _param.encoding = _param.encoding || "hex";

        if (typeof _param.fileData === "string") {
            _param.fileData = new Buffer(_param.fileData, _param.fileDataEncode);
        }
        let param = {
            "storage": {
                "owner": 'zdb@skylink',
                "sign": '123456',
                "ssoToken": ''
            },
            "file": {
                "name": _param.fileName,
                "format": _param.encoding,
                "data": _param.fileData.toString(_param.encoding),
                "thumbnails": _param.thumbnails
            }
        };
        return param;
    }


}






