import { style } from '@angular/animations';
import { CommonServices } from './../../services/groups/common-services.module';
import { SuiCookieService } from './../../services/storage/sui-cookie.service';
import { TopCommon } from './../../top-common/top-common';
import { ModalService } from '../modal/modal.service';
import { CACHE_IDS } from '../../services/storage/cache-ids';
import { Element } from '@angular/compiler';
import { SuiAutoCompleteService } from './sui-auto-complete.service';

/**
 * 自动补全,过滤自动
 * 
 * @export
 * @class SuiAutoCompleteMult
 * @extends {TopCommon} 
 */
export class SuiAutoCompleteFilterTerm extends TopCommon {

    private cookie: SuiCookieService;
    private utils: CommonServices;
    private rootEL: HTMLElement;
    private promptEL: HTMLElement;
    private cacheId: CACHE_IDS;
    private filterFields: any;
    private myService: SuiAutoCompleteService;
    /**
     * 监听关闭事件
     */
    onClose: () => void;

    constructor(
    ) {
        super();
    }

    init(listboxRootEL: HTMLElement, filterFields: any, cacheId: CACHE_IDS, utils: CommonServices, cookie: SuiCookieService, myService: SuiAutoCompleteService) {
        this.filterFields = filterFields;
        this.cacheId = cacheId;
        this.utils = utils;
        this.cookie = cookie;
        this.myService = myService;
        if (!listboxRootEL
            || this.utils.classUtil.isEmptyObject(filterFields)
            || this.utils.classUtil.notExits(cacheId)) {
            this.utils.logs.throwError(`create choose filter term faile; becuase listboxRootEL  or CACHE_IDS[${cacheId}] is undefined or option.filterFields isn't a valid object`,
                listboxRootEL, filterFields);
        }
        this.initFilterHtml(listboxRootEL);
        this.initEvent();
    }

    /**
     * 获取选中的字段
     * 返回数组
     * 
     * @returns {string[]} 
     * @memberof SuiAutoCompleteFilterTerm
     */
    getSelectedFields(): string[] {
        let fieldStr: string = this.getSelectedFieldStr();
        if (!fieldStr) {
            return null;
        }
        return fieldStr.split(",");
    }

    /**
     * 获取选中字段
     * 返回字符串,多个逗号隔开(,)
     * @returns {string} 
     * @memberof SuiAutoCompleteFilterTerm
     */
    getSelectedFieldStr(): string {
        if (!this.cacheId) {
            return "";
        }
        if (!this.utils.classUtil.isNum(this.cacheId)) {
            this.utils.logs.throwError(" cacheId=[%s] undefined in CACHE_IDS ", this.cacheId);
        }
        let fieldStr = this.cookie.get(this.cacheId+"");
        if (fieldStr && fieldStr.length != 0) {
            return fieldStr;
        } else {
            return this.getAllFields();
        }
    }

    /**
     * 获取选中字段
     * 返回字符串,多个逗号隔开(,)
     * @returns {string} 
     * @memberof SuiAutoCompleteFilterTerm
     */
    getPlaceHolderStr(): string {
      let fields: string[] = this.getSelectedFields();
      if(this.utils.arrayUtil.isEmpty(fields)) {
          return null ;
      }
      let labels: string[]= fields.map( field => this.filterFields[field] );
      if(this.utils.arrayUtil.isEmpty(labels)) {
        return null ;
    }
      return "请输入" + labels.join(",");
    }

    

    setFiterTerm() {
        if(this.rootEL.style.display == "block") {
            this.close();
        } else {
            this.open();
        }
    };

    open() {
        this.refreshSelectState(this.getSelectedFields());
        this.rootEL.style.display = "block";
        this.togglePromptState(true);
    };

    close() {
        this.rootEL.style.display = "none";
        this.onClose();
    }

    private initFilterHtml(listboxRootEL: HTMLElement) {
        let filterRootEL: HTMLDivElement = document.createElement("div");
        filterRootEL.className = "sui-fiterterm sui-hidden";
        filterRootEL.innerHTML = this.getFilterTermHTML();
        listboxRootEL.appendChild(filterRootEL);
        this.rootEL = filterRootEL;
        this.promptEL = this.rootEL.querySelector("#prompt") as HTMLElement;
    }

    private getFilterTermHTML() {
        let fieldHtml: string = "";
        let fieldValue: string;
        //默认全选
        for (let key in this.filterFields) {
            fieldValue = this.filterFields[key];
            fieldHtml += `<span class="sui-checkbox" field="${key}">${fieldValue}</span>`;
        }
        return `
           
                <div class="sui-fiterterm-header">
                    搜索选项 <span id="prompt" class="sui-fiterterm-prompt">必须选择一个查询条件</span>
                </div>
                <div id="content" class="sui-fiterterm-content">
                    ${fieldHtml}
                </div>
                <div class="sui-fiterterm-footer">
                    <span id="cancel" class="slic-btn sui-btn-gray fr mr-xsmall">取消</span>
                    <span id="confirm" class="slic-btn sui-btn-primary fr mr-xsmall">确定</span>
                </div>
           
         `;
    }

    private initEvent() {
       /*  this.rootEL.addEventListener("click", (event) => {
            event.stopPropagation();
        }); */
        this.myService.stopElementEvent(this.rootEL);
        this.rootEL.querySelector("#content").addEventListener("click", (event) => {
            event.stopPropagation();
            let target = event.target as HTMLElement;
            this.toggleFilterState(target);
        });
        this.rootEL.querySelector("#confirm").addEventListener("click", (event) => {
            event.stopPropagation();
            this.confirm();
        });

        this.rootEL.querySelector("#cancel").addEventListener("click", (event) => {
            event.stopPropagation();
            this.cancel();
        });

    }

    private toggleFilterState(target: HTMLElement) {
        if (!target) {
            return;
        }
        if (!this.utils.domHandler.hasClass(target, "sui-checkbox")) {
            return;
        }

        if (this.utils.domHandler.hasClass(target, "sui-checkbox-selected")) {
            this.utils.domHandler.removeClass(target, "sui-checkbox-selected");
        } else {
            this.utils.domHandler.addClass(target, "sui-checkbox-selected");
        }
    }

    private refreshSelectState(selectFields: string[]) {
        selectFields = selectFields || [];
        let checkedClass: string = "sui-checkbox-selected";
        let filterELs = this.rootEL.querySelectorAll(".sui-checkbox");
        for (let index=0;index<filterELs.length; index++) {
            if (this.utils.domHandler.hasClass(filterELs[index], "sui-checkbox-selected")) {
                if (selectFields.indexOf(filterELs[index].getAttribute("field")) == -1) {
                    //不选中
                    this.utils.domHandler.removeClass(filterELs[index], "sui-checkbox-selected");
                }
                continue;
            } else {
                if (selectFields.indexOf(filterELs[index].getAttribute("field")) != -1) {
                    //选中
                    this.utils.domHandler.addClass(filterELs[index], "sui-checkbox-selected");
                }
                continue;
            }
        }
    }

    private getFieldLen() {
        let len: number = 0;
        for(let key in this.filterFields) {
            len ++ ;
        }
        return len ;
    }

    private confirm() {
        //必须选取一个条件
        let selectedFilters = this.rootEL.querySelectorAll(".sui-checkbox-selected");
        if (selectedFilters.length == 0) {
            this.togglePromptState(false);
            return;
        }
        if (selectedFilters.length == this.getFieldLen()) {
            //全部选中
            this.cookie.remove(this.cacheId+"");
        } else {
            let fields: string[] = [];
            for (let index=0;index<selectedFilters.length; index++) {
                fields.push(selectedFilters[index].getAttribute("field"));
            }
            this.cookie.put(this.cacheId+"", fields.join(","));
        }
        this.close();
    }

    private togglePromptState(isHidden: boolean) {
        if (isHidden) {
            this.promptEL.style.display = "none";
        } else {
            this.promptEL.style.display = "inline-block";
        }
    }

    /**
     * 取消放弃修改
     * 
     * @private
     * @memberof SuiAutoCompleteFilterTerm
     */
    private cancel() {
        this.close();
    }

    private getAllFields(): string {
        if (this.utils.classUtil.isEmptyObject(this.filterFields)) {
            return "";
        }
        let allFieldStr: string = "";
        for(let key in this.filterFields) {
            allFieldStr += ","+key;
        }
        return allFieldStr.substring(1);
    }



}
