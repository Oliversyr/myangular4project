import { TopCommon } from './../../top-common/top-common';
import { ContentPageParam } from './tab-content-page';
import { Injectable } from '@angular/core';
import { Menu } from "./menu";


/**
 * @author liurong
 * @date 2017-08-17
 * @notes 页签工具;外部调用
 */
@Injectable()
export class TabOuterUtil extends TopCommon{
    
    constructor() {
        super();
    }

     /**
     * 获取页签内容界面数据ID;用于数据传递
     * @param moduleId 
     * @param attr 
     */
    getTabContentPageDataId(moduleId: number,attr: string) {
        const TAB_MANAGE_PREFIX = "tab-invoke_" ; 
        return TAB_MANAGE_PREFIX + this.getRouterType(attr) +"_" + moduleId; ;
    }

    /**
     * 获取路由类型 
     * @param attr 操作类型
     * @returns 返回页面类型 B-详情 A/M-编辑/新增(相同);L-浏览
     */
    getRouterType(attr: string){
        // let pageType;
        // switch (attr) {
        //     case "B":
        //         pageType = "B" ;
        //         break;
        //     case "M":
        //     case "A":
        //         pageType = "M" ;
        //         break;
        //     default:
        //         pageType = "L" ;
        //         break;
        // }
        // return pageType ;

        return this.getPageType(attr);
    }

    /**
     * 通过操作类型获取界面类型
     * @param attr 操作类型
     * @returns 返回页面类型 B-详情/编辑/新增;L-浏览
     */
    getPageType(attr: string){
        let pageType;
        switch (attr) {
            case "B":
            case "M":
            case "A":
                pageType = "B" ;
                break;
            default:
                pageType = "L" ;
                break;
        }
        return pageType ;
    }

     /**
     * 通过操作类型获取界面路由后缀
     * @param attr 
     * @returns 返回页面类型 B-detail;L-空串
     */
    getPageRouterSuffix(attr: string){
        // let pageType = this.getPageType(attr);
        if(attr == "B") {
            return "/detail";
        } else if(attr == "A" ){
            return "/add" ;
        }else if(attr == "M"){
            return "/edit" ;
        }else {
            return "" ;
        }
    }

    /**
     * 通过url或者界面类型
     * @param url
     * @returns attr 返回页面类型 L A B M
     */
    getAttrByUrl(menuUrl: string): string{
        let attr: string = "L";
        if(menuUrl.endsWith("/detail")) {
            attr = "B" ;
        } else if(menuUrl.endsWith("/edit")){
            attr = "M" ;
        }else if(menuUrl.endsWith("/add")){
            attr = "A" ;
        }
        return attr ;
    }

    /**
     * 获取菜单url 去掉 后缀 /detail、/edit、/add
     * @param url 
     * @param appName  应用名称
     */
    getMenuUrlByUrl(url: string, appName: string): string{
        //去掉应用名称; 仅仅获取二级以下路径
        let fragmentUrl: string[] = new RegExp(`^\/*${appName}\/*([\\S]*)`).exec(url); 
        if(!fragmentUrl) {
            return ;
        }
        let menuUrl: string = fragmentUrl[1]; 
        menuUrl = menuUrl.replace(/\/detail$/,"");
        menuUrl = menuUrl.replace(/\/edit$/,"");
        menuUrl = menuUrl.replace(/\/add$/,"");
        return menuUrl;
    }
    
    


    /**
     * 地址格式为详情或者列表
     * edit/add/detail 为同一个详情页面 
     * 其它为同一个列表
     * @param url1 
     * @param url2 
     */
    urlFormatToDetailOrList(url: string) {
        if(url.endsWith("edit")) {
            url = url.replace(/(.*)edit/, '$1detail');
        } else if(url.endsWith("add")){
            url = url.replace(/(.*)add/, '$1detail');
        }

        return  url;
    }

    /**
     * 焦点定位
     * @param docEL 
     * @param moduleId 
     * @param attr 
     */
    focus(docEL: HTMLElement, moduleId: number, attr: string) {
        let contentPageParam: ContentPageParam = {
                active: "FOCUS", 
                attr: attr,
                moduleId: moduleId
        };
        this.invokeContentPage(contentPageParam,docEL);
    }


    /**
     * 调用内容界面接口 ;传递参数、刷新界面、切换界面等
     * <pre>
     *  invokeContentPage(contentPageParam: ContentPageParam, myFrame_doc?: HTMLElement) 
     * </pre>
     * @param{ContentPageParam} contentPageParam 
     * @param{HTMLElement} myFrame_doc - 当前条用的界面
     */
    invokeContentPage(contentPageParam: ContentPageParam, myFrame_doc?: HTMLElement) {
        try {
            if(!myFrame_doc) {
                myFrame_doc = window.document.body;
            }
            let tabElId = this.getTabContentPageDataId(contentPageParam.moduleId, contentPageParam.attr)  ;
            let param = {
                param: contentPageParam.param ,
                active: contentPageParam.active || "DELIVER_PARAM" 
            };
            var event = new CustomEvent(tabElId, { detail: param });
             let div_el =  myFrame_doc.querySelector('#'+tabElId);
             if(div_el) {
                 div_el.dispatchEvent(event);
             }
        } catch (e) {
            console.error(this.CLASS_NAME,"invokeContentPage",e.stack);
        }
        //重置为空,否则引起内存泄漏
    }

}