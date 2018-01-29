import { Injectable, ViewChild } from '@angular/core';
import { TopCommon } from './../../../top-common/top-common';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { CommonServices } from '../../../services/groups/common-services.module';
import { Observable } from 'rxjs/Observable';
import { ModalService } from '../../../components/modal/modal.service';
import { RequestMethod } from '@angular/http';
import { SuiRequest } from './../../../../common/services/https/sui-http-entity';
import { GlobalService } from './../../../../common/global/global.service';



/**
 * @author yangr
 * @date 2017-11-20
 * @notes 获取供应商数据服务
 */
@Injectable()
export class SuiOrganService extends TopCommon {
    private userInfo: any;
    constructor(
        private utils: CommonServices,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
        super();
        this.userInfo = this.globalService.clientSessionData.getUserInfo();
    }

    /**
     * 获取机构列表
     * for autocomplete
     */
    public getOrganList(key, filterFields, orgType): Observable<any> {
        console.log('key, filterFields, orgType==', key, filterFields, orgType)

        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/org/juniororg/page',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: 1,
                pageSize: 10,
                totalRecord: 0,
                params: {
                    eid: -1,
                    groupId: -1,
                    parentId: -1,
                    ename: '',
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: [],
                    orgType: orgType,
                    keyvalue: key,
                    keyflag: filterFields
                }
                
            }
        }

        this.globalService.clientSessionData.getUserInfo()
        
        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            return data.data.result;
        });
    }

    /**
     * 获取机构列表
     * for grid
     */
    public getOrganData(page, key, orgType) {

        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/org/juniororg/page',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: page['pageNum'] || 1,
                pageSize: page['pageSize'] || 10,
                totalRecord: 0,
                params: {
                    eid: -1,
                    groupId: -1,
                    parentId: -1,
                    ename: '',
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: [],
                    orgType: orgType,
                    keyvalue: key,
                    // keyflag: filterFields
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            
            let res = data.data;

            return {
                rows: res.result,
                footer: {
                    totalCount: res.totalRecord,
                    pageNum: res.pageNum,
                    pageSize: res.pageSize
                }
            }
        });
    }

    /**
     * 获取仓库列表
     * for autocomplete
     */
    public getStorehouseList(key, filterFields, orgType): Observable<any> {
        console.log('key, filterFields, orgType==', key, filterFields, orgType)

        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/stockm/junior/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: 1,
                pageSize: 10,
                totalRecord: 0,
                params: {
                    orgtype: orgType,
                    keyvalue: key,
                    keyflag: filterFields,
                    status: -1
                } 
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            return data.data.result;
        });
    }

    /**
     * 获取仓库列表
     * for grid
     */
    public getStorehouseData(page, key, orgType) {
        let url = "api/orgm/stockm/junior/list";

        let myParam: SuiRequest<any,any> = {
            url: 'api/orgm/stockm/junior/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: page['pageNum'] || 1,
                pageSize: page['pageSize'] || 10,
                totalRecord: 0,
                params: {
                    orgtype: orgType,
                    keyvalue: key,
                    // keyflag: filterFields
                    status: -1
                } 
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }

            let res = data.data;
            console.log('>>>>>>data.data<<<<<',data);
            return {
                rows: res.result,
                footer: {
                    totalCount: res.totalRecord,
                    pageNum: res.pageNum,
                    pageSize: res.pageSize
                }
            }
        });
    }

    
}