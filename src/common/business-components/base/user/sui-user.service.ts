import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../../top-common/top-common';
import { SuiHttpService } from '../../../services/https/sui-http.service';
import { SuiResponse, SuiRequest, ResponseRetCode } from '../../../services/https/sui-http-entity';
import { CommonServices } from '../../../services/groups/common-services.module';
import { GlobalService } from '../../../global/global.service';
import { USERTYPE } from './sui-user-type';

/**
 * @author xiahl
 * @date 2017-11-15
 * @notes 获取用户数据服务
 */
@Injectable()
export class SuiUserService extends TopCommon {
    _data: Array<any> = [];

    get data(): any {
        return this._data;
    };

    set data(data: any) {
        if (data === null) {
            return;
        }
        this._data = data;
    }

    constructor(
        private uitls: CommonServices,
        private suiHttp: SuiHttpService,
        private globalService: GlobalService
    ) {
        super();
    }

    /**
     * 获取各种类型的用户数据
     * 
     * @param {number} userType 
     * @returns {array} 
     */
    public getUserList(userType) {
        let myParam: SuiRequest<any, any> = {
            url: 'api/user/list',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            method: RequestMethod.Get,
            globalLoad: true,
            urlParam: userType
        }
        return this.suiHttp.request(myParam).map((data: SuiResponse<any>) => {
            if (data.retCode !== 0) {
                this.globalService.modalService.modalToast(data.message);
                return;
            };
            let res: any[] = !data.data.result ? [] : data.data.result;
            this.data = res.filter((item) => {
                return item.userType === userType;
            });
        })
    }
}