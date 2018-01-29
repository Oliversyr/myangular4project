import { HOTKEYS } from './../../directives/keyboard/hotkeys';
import { ResponseContentType, RequestMethod } from '@angular/http';
import { SuiRequestBase, ResponseRetCode } from './../../services/https/sui-http-entity';
import { TopCommon } from './../../top-common/top-common';
import { ViewChild, ElementRef } from '@angular/core';
import { BaseService } from '../../top-common/base.service';
import { Response } from '@angular/http';


export class TemplateTop extends TopCommon {

    hotkeys: any = HOTKEYS;
    /**
     * 面包屑菜单名称
     */
    crumbMenuNames: any[];

    helpHover: boolean;
    /**
     * 0-加载中
     * 99-加载失败
     * 100 - 加载成功
     */
    private helpLoadState: number;
    @ViewChild("el_helpContent") el_helpContent: ElementRef;
    helpContentHtml: string;

    constructor(
        protected baseService: BaseService
    ) {
        super();
    }

    showHelpContent() {
        this.helpHover = true;
        this.requestHelpContent();
    }

    protected requestHelpContent() {
        if (this.helpLoadState == 100 || this.helpLoadState == 0) {
            return;
        }
        let appName: string = this.baseService.globalService.clientSessionData.getSuiSiteConfig().currentApp.appname;
        this.helpLoadState = 0;
        let param: SuiRequestBase<any,any> = {
            responseType: ResponseContentType.Text,
            method: RequestMethod.Get,
            url: this.baseService.getHelpUrlByTab(this["option"].tab, appName),
            rootPath: this.baseService.globalService.getSuiLocalConfig().RESOURCE_SERVER_ROOTPATH,
        }
        this.baseService.suiHttpService.requestBase(param).subscribe(data => {

            if (data.retCode == ResponseRetCode.SUCCESS) {
                this.helpLoadState = 100;
                this.helpContentHtml = data.data;
                this.el_helpContent.nativeElement.innerHTML = this.helpContentHtml;
            } else {
                this.helpLoadState = 99;
                this.el_helpContent.nativeElement.innerHTML = "帮助信息加载失败,稍后重试";
            }
        });
    }
}