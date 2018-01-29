import { TopCommon } from './../../top-common/top-common';
import { Injectable } from '@angular/core';
import { KEYBOARD_VALUE } from '../../directives/keyboard/keyboard-value';

@Injectable()
export class SuiAutoCompleteService extends TopCommon{
      
    constructor(
    ) { 
        super();
     }

     /**
      * 
      * 停止元素鼠标与键盘默认事件
      * @param {Element} ele 
      * @returns 
      */
     stopElementEvent(ele: Element) {
        if (!ele) {
            return;
        }
        ele.addEventListener("mousedown", (event: any) => {
            if (event.button == KEYBOARD_VALUE.MOUSELEFT || event.button == KEYBOARD_VALUE.MOUSERIGHT) {
                event.stopPropagation();
                //不执行默认事件
                event.preventDefault();
                return;
            }
        });
        ele.addEventListener("click", (event: any) => {
            event.stopPropagation();
            //不执行默认事件
            event.preventDefault();
        });
    }
}
