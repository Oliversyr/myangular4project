import { CommonServices } from './../../services/groups/common-services.module';
import { HotkeyElement } from './hotkey-manager';
import { Renderer } from '@angular/core';
import { HOTKEYS } from './hotkeys';
import { KEYBOARD_VALUE } from './keyboard-value';
import { KeyboardDirective } from './keyboard.directive';
import { TopCommon } from './../../top-common/top-common';

export interface HotkeyElement {
    element: Element,
    keybardValues: string[]
}

/**
 * 热键管理类
 * 
 * @export
 * @class HotkeyManager
 * @extends {TopCommon}
 */
export class HotkeyManager extends TopCommon {

    private hotkeyQueue: HotkeyElement[];

    constructor(
    ) {
        super();
    }

    /**
     * 初始化热键
     * @param hotKeyDirectives 
     * @param event 
     */
    trigger(event, renderer: Renderer, utils: CommonServices) {
        //获取合理的热键元素
        let validateHotkeyEl: Element = this.getValidateHotkeyEle(event, utils);
        // console.debug(">>>>>the keydown the hotkey=[%s]", this.hotkeyName, this.isHidden);
        if (validateHotkeyEl) {
            event.stopPropagation();
            //不执行默认事件
            event.preventDefault();
            //执行热键绑定元素的事件 
            renderer.invokeElementMethod(validateHotkeyEl, "click");
        }
    }

    private getValidateHotkeyEle(event, uitls: CommonServices): Element {
        if (!this.hotkeyQueue || this.hotkeyQueue.length == 0) {
            return null;
        }
        let vailidateEle: Element;
        for (let ele of this.hotkeyQueue) {
            if(uitls.domHandler.checkKeyboardValuesIsTrigger(event, ele.keybardValues)) {
                vailidateEle = ele.element;
                break ;
            }
        }
        if(vailidateEle) {
            //判断权限
           let isUnRight: boolean = vailidateEle.hasAttribute("hidden");
           if(isUnRight === true) {
               return null ;
           } else {
               return vailidateEle ;
           }

        }
        return null;
    }

    init(rootEl: HTMLElement, utils: CommonServices) {
        this.scanHotkeys(rootEl, utils);
    }

    private scanHotkeys(rootEl: HTMLElement, utils: CommonServices) {
        this.hotkeyQueue = [];
        let hotkeyEls: NodeListOf<Element> = rootEl.querySelectorAll("[suiHotKey]");
        //无热键处理
        if (!hotkeyEls || hotkeyEls.length == 0) {
            return;
        }
        let ele: Element, hotkeyEl: HotkeyElement, hotkeyValue: string;
        for (let index = 0; index < hotkeyEls.length; index++) {
            ele = hotkeyEls[index];
            // ele = hotkeyEls.item(index);
            hotkeyValue = this.getHotKeyValue(ele);
            if (!hotkeyValue) {
                continue;
            }
            hotkeyEl = this.getHotkeyElement(ele, hotkeyValue, utils);
            if (!hotkeyEl) {
                continue;
            }
            this.setTitle(ele, hotkeyValue);
            this.hotkeyQueue.push(hotkeyEl);
        }
        // console.debug(">>>>hotkey-manager.hotkeyQueue", this.hotkeyQueue);
    }

    private getHotkeyElement(ele: Element, hotkeyValue: string, utils: CommonServices): HotkeyElement {
        let keybardValues: string[]   = utils.domHandler.getKeyboardValuesByHotkey(hotkeyValue);
        if(!keybardValues) {
            return null ;
        }
        let hotkeyElement: HotkeyElement = {
            element: ele,
            keybardValues: keybardValues
        }

        return hotkeyElement;
    }

    private setTitle(hotkeyEl: Element, keybardValue: string) {
        if (keybardValue && keybardValue.length != 0) {
            let title: string = hotkeyEl.getAttribute("title");
            if (title && title.length != 0) {
                title += "(热键:" + keybardValue + ")";
            } else {
                title = "热键:" + keybardValue;
            }
            hotkeyEl.setAttribute("title", title);
        }
    }

    private getHotKeyValue(hotkeyEl: Element): string {
        let hotkeyName: string = hotkeyEl.getAttribute("suiHotKey");
        if (!hotkeyName || hotkeyName.length == 0) {
            return null;
        }
        let hotkeyValue: string = HOTKEYS[hotkeyName];
        if (!hotkeyValue || hotkeyValue.length == 0) {
            console.error(" undefined the hotkey name=[%s] in HOTKEYS, can't use hotkey ;", hotkeyName);
            return null;
        }
        return hotkeyValue;
    }

}