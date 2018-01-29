import { HotkeyManager } from './hotkey-manager';
import { KEYBOARD_VALUE } from './keyboard-value';
import { KeyboardService } from './keyboard.service';
import { CommonServices } from './../../services/groups/common-services.module';
import { TopCommon } from './../../top-common/top-common';

import { Directive, ElementRef, HostListener, AfterViewInit, OnInit, OnDestroy, EventEmitter, NgModule, Renderer, Input } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { SuiHotKeyDirective } from './sui-hot-key.directive';


export interface KeyBoardElement {
    element: HTMLElement,
    customTabindex: number,
    /**
     * 下一个自定义节点的序号
     * -1: 无自定义
     */
    nextCustomIndex: number;

    /**
     * 元素位置;如果只有一个元素,则设置为LAST
     * FIRST-第一个
     * LAST-最后一个
     * 其它中间
     */
    elementPosition: string;
}
/*
 *  键盘操作指令
 * Usage:
 *    <div suikeyboard></div>
*/
@Directive({
    selector: '[suikeyboard]'
})
export class KeyboardDirective extends TopCommon implements OnInit, AfterViewInit, OnDestroy {

    /**
     * 元素队列
     */
    private eleQueue: KeyBoardElement[];
    private hotkeyManager: HotkeyManager;
    @Input("suikeyboard") options: any;

    constructor(
        private utils: CommonServices,
        private keyboardService: KeyboardService,
        private renderer: Renderer,
        private rootEL: ElementRef
    ) {
        super();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        // setTimeout(() => {
        this.initValidateEles();
        // console.debug(this.CLASS_NAME, ">>>>>>>>>>>>>>..keyboard.ngAfterViewInit: this.eleQueue", this.eleQueue);
        // },2000);


        let _rootEL: HTMLElement = this.rootEL.nativeElement;
        if (this.options == "sui-modal") {
            //弹出框特殊处理
            _rootEL = _rootEL.parentElement;
        }
        this.hotkeyManager = new HotkeyManager();
        this.hotkeyManager.init(_rootEL, this.utils);
        this.setRootELTabindex(_rootEL);
        this.initKeydown(_rootEL);
        this.setDefaultFocusEle();
        // }, 1000);
        
    }

    private setRootELTabindex(rootEL: HTMLElement) {
        let tabindex = rootEL.getAttribute("tabindex");
        if (!this.utils.classUtil.isNum(tabindex)) {
            rootEL.setAttribute("tabindex", "0");
        }
    }

    /*  @HostListener('keydown', ['$event']) onkeydown(event) {
         if (event.shiftKey && event.keyCode == KEYBOARD_VALUE.TAB) {
             this.backLocation(event);
         } else if (event.keyCode == KEYBOARD_VALUE.ENTER || event.keyCode == KEYBOARD_VALUE.TAB) {
             this.forwardLocation(event);
         }
         this.hotkeyManager.trigger(event, this.renderer);
     } */

    ngOnDestroy() {
        this.hotkeyManager = null;
    }

    private initKeydown(rootEL: HTMLElement) {
        rootEL.addEventListener("keydown", (event) => {
            if (event.shiftKey && event.keyCode == KEYBOARD_VALUE.TAB) {
                this.backLocation(event);
            } else if (event.keyCode == KEYBOARD_VALUE.ENTER || event.keyCode == KEYBOARD_VALUE.TAB) {
                this.forwardLocation(event);
            }
            this.hotkeyManager.trigger(event, this.renderer, this.utils);
        });

    }


    /**
     * 向前定位
     */
    private forwardLocation(event) {
        let _eles = this.rootEL.nativeElement.querySelectorAll("[customTabindex]");
        // let currentCustomTabindex = event.target.getAttribute("customTabindex") ;
        let currentEL: KeyBoardElement = this.getKeyBoardElementByTarget(event.target);
        if (!currentEL) {
            return;
        }
        let nextFocusEL: KeyBoardElement = this.getCustomNextFocusKBEle(currentEL);
        if (nextFocusEL) {
            //优先处理自定义焦点元素
            this.focusEle(nextFocusEL.element, event);
        } else {
            nextFocusEL = this.getNextKBEle(this.eleQueue.indexOf(currentEL) + 1);
            if (nextFocusEL) {
                this.focusEle(nextFocusEL.element, event);
            }
        }

    }

    /**
     * 向后定位
     */
    private backLocation(event) {
        // let currentCustomTabindex = event.target.getAttribute("customTabindex") ;
        let currentEL: KeyBoardElement = this.getKeyBoardElementByTarget(event.target);
        if (!currentEL) {
            return;
        }
        let preFocusEL: KeyBoardElement = this.getPreKBEle(this.eleQueue.indexOf(currentEL) - 1);
        if (preFocusEL) {
            this.focusEle(preFocusEL.element, event);
        }

    }

    private getKeyBoardElementByTarget(target: HTMLElement) {
        let parentQueueIndex = target.getAttribute("parentQueueIndex");
        if (this.utils.classUtil.isNum(parentQueueIndex)) {
            return this.eleQueue[parentQueueIndex];
        }
        let currentCustomTabindex = target.getAttribute("customTabindex");
        if (!this.utils.classUtil.isNum(currentCustomTabindex)) {
            return null;
        }
        return this.getKeyBoardElementByCustomTabindex(parseFloat(currentCustomTabindex));
    }

    private getKeyBoardElementByCustomTabindex(customTabindex: number) {
        for (let ele of this.eleQueue) {
            if (ele.customTabindex == customTabindex) {
                return ele;
            }
        }
        return null;
    }

    private getCustomNextFocusKBEle(currentKBEle: KeyBoardElement): KeyBoardElement {
        if (currentKBEle.nextCustomIndex != -1) {
            //自定义下一个元素焦点
            let nextFocusEl = this.eleQueue[currentKBEle.nextCustomIndex]
            //自定义下一个元素焦点不隐藏;返回;否则使用下一个
            if (!this.keyboardService.elementIsHide(nextFocusEl.element)) {
                return nextFocusEl;
            }
        }
        return null;
    }

    /**
     * 通过序号获取下一个焦点元素
     * @param nextIndex 
     */
    private getNextKBEle(nextIndex: number): KeyBoardElement {
        if (nextIndex >= this.eleQueue.length) {
            //大于最后一个序号,从0开始找
            nextIndex = 0;
        }
        let ele: KeyBoardElement;
        for (let i = nextIndex; i < this.eleQueue.length; i++) {
            ele = this.eleQueue[i];
            if (!this.keyboardService.elementIsHide(ele.element)) {
                return ele;
            }
        }
        //从nextIndex开始遍历后,如果没有符合条件的元素
        //则从0-nextIndex开始遍历
        if (nextIndex != 0) {
            for (let i = 0; i < nextIndex; i++) {
                ele = this.eleQueue[i];
                if (!this.keyboardService.elementIsHide(ele.element)) {
                    return ele;
                }
            }
        }
        //队列全部遍历,还是没有,则返回空
        console.warn("don't find the focus element; because can't find the display element in eleQueue", this.eleQueue);
        return null;
    }

    /**
     * 通过序号获取上一个焦点元素
     * @param{number} preIndex 
     */
    private getPreKBEle(preIndex: number): KeyBoardElement {
        if (preIndex < 0) {
            //小于第一个则取最后一个
            preIndex = this.eleQueue.length - 1;
        }
        let ele: KeyBoardElement;
        for (let i = preIndex; i >= 0; i--) {
            ele = this.eleQueue[i];
            if (!this.keyboardService.elementIsHide(ele.element)) {
                return ele;
            }
        }
        //从nextIndex开始遍历后,如果没有符合条件的元素
        //则从0-nextIndex开始遍历
        if (preIndex != this.eleQueue.length - 1) {
            for (let i = this.eleQueue.length - 1; i > preIndex; i--) {
                ele = this.eleQueue[i];
                if (!this.keyboardService.elementIsHide(ele.element)) {
                    return ele;
                }
            }
        }
        //队列全部遍历,还是没有,则返回空
        console.warn("don't find the focus element; because can't find the display element in eleQueue,preIndex=[%s]", preIndex, this.eleQueue);
        return null;
    } v


    /**
     * 该方法对外不可能,当页面元素结构发生变化,需要使用例如: 添加,删除元素等
     * 初始化合理元素
     */
    initValidateEles() {
        let eles = this.rootEL.nativeElement.querySelectorAll("[customTabindex]");
        eles = [].slice.call(eles);
        //根据 customTabindex 过滤 范围 1-999
        eles = eles.filter(ele => (ele.getAttribute("customTabindex") * 1 < 1000 && ele.getAttribute("customTabindex") * 1 > 0));
        //按照 customTabindex 排序
        eles = eles.sort(function (currentEL, nextEL) {
            let currentTabindex = currentEL.getAttribute("customTabindex") * 1;
            let nextTabindex = nextEL.getAttribute("customTabindex") * 1;
            return currentTabindex - nextTabindex;
        });
        this.setElementQueue(eles);
    }

    private setElementQueue(eles: HTMLElement[]) {
        this.eleQueue = [];
        let ele: HTMLElement, elementPosition: string;
        for (let i = 0; i < eles.length; i++) {
            ele = eles[i];
            //处理特殊元素
            this.keyboardService.eleSpecialHandle(ele, i);
            elementPosition = "";
            if (i == 0) {
                elementPosition = "FIRST";
            }
            //如果只有一个元素,则设置为LAST
            if (i == eles.length - 1) {
                elementPosition = "LAST";
            }
            this.eleQueue.push({
                element: ele,
                customTabindex: parseFloat(ele.getAttribute("customTabindex")),
                nextCustomIndex: this.getEleIndexByNextfocus(eles, ele.getAttribute("nextfocus")),
                elementPosition: elementPosition
            });
        }
    }

    /**
     * 通过customTabindex 获取元素位置
     * @param eles 
     * @param tabindex 
     */
    private getEleIndexByNextfocus(eles: HTMLElement[], nextfocus: string): number {
        if (this.utils.classUtil.isNum(nextfocus)) {
            return this.getEleIndexByTabindex(eles, parseFloat(nextfocus));
        } else {
            return this.getEleIndexByEleName(eles, nextfocus);
        }
    }
    /**
     * 通过元素name值 获取元素位置
     * @param {HTMLElement[]} eles 
     * @param {string} nextfocusName 
     */
    private getEleIndexByEleName(eles: HTMLElement[], nextfocusName: string): number {
        if (!nextfocusName) {
            return -1;
        }
        let ele: HTMLElement;

        for (let i = 0; i < eles.length; i++) {
            ele = eles[i];
            //根据那么获取序号
            if (ele.getAttribute("name") == nextfocusName) {
                return i;
            }
        }
        //不存在则返回-1
        return -1;
    }
    /**
     * 通过customTabindex 获取元素位置
     * @param {HTMLElement[]} eles 
     * @param {number} customTabindex 
     */
    private getEleIndexByTabindex(eles: HTMLElement[], customTabindex: number): number {
        if (customTabindex <= 0) {
            return -1;
        }
        let ele: HTMLElement;

        for (let i = 0; i < eles.length; i++) {
            ele = eles[i];
            if (parseFloat(ele.getAttribute("customTabindex")) == customTabindex) {
                return i;
            }
        }
        //不存在则返回-1
        return -1;
    }

    /**
     * 设置默认的焦点元素
     */
    private setDefaultFocusEle() {
        let defaultFoucsEle: HTMLElement = this.rootEL.nativeElement.querySelector("[defaultFocus]");
        if (!defaultFoucsEle) {
            //如果不存在,则设置第一个
            if (!this.eleQueue || this.eleQueue.length == 0) {
                this.rootEL.nativeElement.focus();
                return;
            }
            defaultFoucsEle = this.eleQueue[0].element;
            defaultFoucsEle.setAttribute("defaultFocus", "");
        }
        defaultFoucsEle.focus();
        // console.debug("the keyboard focus info...,defaultFoucsEle,eleQueue", defaultFoucsEle, this.eleQueue);
    }

    private focusEle(ele: HTMLElement, event) {
        if (event.keyCode == KEYBOARD_VALUE.TAB) {
            event.preventDefault();
        }
        this.keyboardService.fucos(ele);
    }
}

/**
 * 常用管道模块
 */
@NgModule({
    imports: [

    ],
    exports: [
        KeyboardDirective,
        SuiHotKeyDirective
    ],
    declarations: [
        KeyboardDirective,
        SuiHotKeyDirective
    ],
    providers: [
        KeyboardService
        , CommonServices
    ]
})
export class KeyboardDirectiveModule {
    constructor(
        keyboardService: KeyboardService,
        globalService: GlobalService
    ) {
        globalService.keyboardService = keyboardService;
    }
}