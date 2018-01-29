import { map } from 'rxjs/operator/map';
import { RequestMethod } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../top-common/top-common';
import { GlobalService } from '../../../global/global.service';
import { CommonServices } from '../../../services/groups/common-services.module';
import { ModalService } from '../../../components/modal/modal.service';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from '../../../services/https/sui-http-entity';

/* 
 * 所属店组组件服务
 * @Author: xiahl 
 * @Date: 2018-01-09 10:28:32 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-16 14:35:33
 */
@Injectable()
export class SuiGroupsService extends TopCommon {

    constructor(
        private utils: CommonServices,
        private suiHttp: SuiHttpService,
        private modalSer: ModalService,
        private globalService: GlobalService
    ) {
        super();
    }

    /**
     * 获取店组自动完成列表数据
     */
    public getAutoCompleteData(param) {
        let myParam: SuiRequest<any, any> = {
            url: 'api/devicem/group/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            }
            let _data = data.data.result;
            if(_data.length > 0){
                _data.map((item)=>{
                    item.statusName = item.status === 0 ? '禁用' : '启用';
                    return item;
                })
            }            
            return _data;
        })
    }

    /**
     * 获取店组自动完成更多表格数据
     */
    public getList(param): Observable<any> {
        let myParam: SuiRequest<any, any> = {
            url: 'api/devicem/group/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            urlParam: param
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.modalSer.modalToast(data.message);
                return;
            }
            let _data = data.data.result;
            if(_data.length > 0){
                _data.map((item)=>{
                    item.statusName = item.status === 0 ? '禁用' : '启用';
                    return item;
                })
            }   
            return {
                rows: _data,
                footer: {
                    pageNum: data.data.pageNum,
                    pageSize: data.data.pageSize,
                    totalCount: data.data.totalRecord
                }
            };
        })
    }
}