import { Directive, Input, HostBinding } from '@angular/core';
import { TopCommon } from './../../top-common/top-common';

/*
 *  热键绑定指令
 * Usage:
 *    <button [suiHotKey]="'COPY'"></button>
 *   或者
 *    <button suiHotKey="COPY"></button>
*/
@Directive({
    selector: '[suiHotKey],suiHotKey'
})
export class SuiHotKeyDirective extends TopCommon {


    @HostBinding("attr.suiHotKey") @Input("suiHotKey")  hotkeyName: string;

    constructor(
    ) {
        super();
    }
}