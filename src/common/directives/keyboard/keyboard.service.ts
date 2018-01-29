import { TopCommon } from './../../top-common/top-common';
import { DomHandler } from './../../services/dom/domhandler';
import { Injectable, QueryList } from '@angular/core';



@Injectable()
export class KeyboardService extends TopCommon {

    constructor(
        private domHandler: DomHandler
    ) {
        super();
    }

    fucos(element: HTMLElement) {
        let tagName: string = element.tagName;
        switch(tagName){
            case "SUI-COMBOBOX":
            case "SUI-AUTO-COMPLETE":
            case "SUI-SELECT":
            case "SUI-CHECKBOX":
            case "SUI-RADIO":
                this.suiSelectFocus(element);
                break;
            case "SUI-DATE":
                this.suiDateFocus(element);
                break;
            case "SUI-INPUT":
                this.nzInputFocus(element);
                break;
            default:
                element.focus();
                break;
        }
    }

    private suiSelectFocus(element: HTMLElement) {
        (element.querySelector("div[tabindex],input") as any).focus() ;
    }

    private suiDateFocus(element: HTMLElement) {
        (element.querySelector("input[class*=jqx-input-content]") as any).focus() ;
    }
    
    private nzInputFocus(element: HTMLElement) {
        (element.querySelector("input[class*='ant-input']") as any).focus() ;
    }

    /**
     * 元素特殊处理
     * 焦点元素存储父节点在队列中的index
     * @param element 
     */
    eleSpecialHandle(element: HTMLElement, eleQueueIndex: number) {
        let tagName: string = element.tagName;
        switch(tagName){
            case "SUI-SELECT":
            case "SUI-COMBOBOX":
            case "SUI-AUTO-COMPLETE":
            case "SUI-CHECKBOX":
            case "SUI-RADIO":
                this.suiSelectSpecialHandle(element, eleQueueIndex);
                break;
            case "SUI-DATE":
                this.suiDateSpecialHandle(element, eleQueueIndex);
                break;
            case "SUI-INPUT":
                this.nzInputSpecialHandle(element, eleQueueIndex);
                break;
        }
    }

    private suiSelectSpecialHandle(element: HTMLElement, eleQueueIndex: number) {
        element.querySelector("div[tabindex],input").setAttribute("parentQueueIndex", eleQueueIndex + "");
    }

    private suiDateSpecialHandle(element: HTMLElement, eleQueueIndex: number) {
        (element.querySelector("input[class*=jqx-input-content]") as any).setAttribute("parentQueueIndex", eleQueueIndex + "");
    }
    
    private nzInputSpecialHandle(element: HTMLElement, eleQueueIndex: number) {
        (element.querySelector("input[class*='ant-input']") as any).setAttribute("parentQueueIndex", eleQueueIndex + "");
    }

   /**
     * 判断元素是否隐藏;
     * 如果元素不存在,则返回true
     * @param {HTMLElement} element 
     * @returns {boolean} true-隐藏 ,false-不隐藏
     */
    elementIsHide(element: HTMLElement): boolean {
        let tagName: string = element.tagName;
        switch(tagName){
            
            case "SUI-DATE":
                return this.suiDateIsHide(element);
            case "SUI-SELECT":
            case "SUI-COMBOBOX":
            case "SUI-AUTO-COMPLETE":
            case "SUI-CHECKBOX":
            case "SUI-RADIO":
                // this.suiSelectSpecialHandle(element, eleQueueIndex);
                // break;
                return this.domHandler.elementIsHide(element.querySelector("div[tabindex],input") as any);    
            case "SUI-INPUT":
                // this.nzInputSpecialHandle(element, eleQueueIndex);
                // break;
            default:
                return this.domHandler.elementIsHide(element);    
        }
    }

    private suiDateIsHide(element: HTMLElement): boolean {
        return this.domHandler.elementIsHide(element.querySelector("input[class*=jqx-input-content]") as any);    
    }

    


}