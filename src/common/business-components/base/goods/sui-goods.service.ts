import { Injectable, ViewChild } from '@angular/core';
import { TopCommon } from './../../../top-common/top-common';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { CommonServices } from '../../../services/groups/common-services.module';
import { Observable } from 'rxjs/Observable';
import { ModalService } from '../../../components/modal/modal.service';
import { RequestMethod } from '@angular/http';
import { GlobalService } from './../../../../common/global/global.service';
import { SuiRequest } from './../../../../common/services/https/sui-http-entity';

/**
 * @author yangr
 * @date 2017-11-20
 * @notes 获取供应商数据服务
 */
@Injectable()
export class SuiGoodsService extends TopCommon {
    userInfo: any;
    constructor(
        private utils: CommonServices,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
        super();
        this.userInfo = this.globalService.clientSessionData.getUserInfo();
    }

    /**
     * 获取商品列表数据
     */
    public getGoodsData(type, param, filterFields) {

        let myParam: SuiRequest<any,any> = {
            url: 'api/goods/goods/page/simple',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: param.pageNum || 1,
                pageSize: param.pageSize || 10,
                params: {
                    shopeid: -1,
                    keyflag: filterFields,
                    keyvalue: param.key
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }

            let res = data.data;

            if(type === 'auto') {
                return res.result;
            } else {
                return {
                    rows: res.result,
                    footer: {
                        totalCount: res.totalRecord,
                        pageNum: res.pageNum,
                        pageSize: res.pageSize
                    }
                }
            }
        });
    }

    /**
     * 获取商品列表数据
     */
    public getShopGoodsData(type, param, filterFields) {

        let myParam: SuiRequest<any,any> = {
            url: 'api/storagem/inventory/shop/goodslist',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Post,
            globalLoad: false,
            bodyParam: {
                pageNum: param.pageNum || 1,
                pageSize: param.pageSize || 10,
                params: {
                    shopeid: param.shopeid,
                    keyflag: filterFields,
                    keyvalue: param.key
                }
            }
        }

        return this.suiHttp.request(myParam).map(data => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return ;
            }
            let res = data.data;

            if(type === 'auto') {
                return res.result;
            } else {
                return {
                    rows: res.result,
                    footer: {
                        totalCount: res.totalRecord,
                        pageNum: res.pageNum,
                        pageSize: res.pageSize
                    }
                }
            }
        });
    }

}