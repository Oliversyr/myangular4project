import {
    Component
    , OnInit
    , Input
    , Output
    , ViewChild
    , ViewEncapsulation
    , EventEmitter
} from '@angular/core';
import { TopCommon } from '../../../../common/top-common/top-common';
import { Modal } from '../../../../common/components/modal/modal';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { PurchaseInputService } from './purchase-input.service';

/*
 * 审核采购入库单
 * @Author: xiahl 
 * @Date: 2017-12-27 10:06:18 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-04 19:57:43
 */

@Component({
    selector: 'purchase-input-check',
    templateUrl: './purchase-input-check.html',
    styleUrls: ['./purchase-input-check.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PurchaseInputCheckComponent extends TopCommon implements OnInit {

    hotkeys: any = HOTKEYS;

    @Input() title: string = "采购入库单审核";

    @Input() sheetid: number;

    @Output() confirmCheck: EventEmitter<any> = new EventEmitter<any>();

    @Output() cancelCheck: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('windowReference') window: Modal;

    constructor(
        private myService: PurchaseInputService
    ) {
        super();
    }

    ngOnInit() {

    }

    /**
     * 审核采购入库单
     * @param type 
     */
    doConfirmCheck(type) {
        if (!this.sheetid) {
            this.myService.modalSer.modalToast('审核的采购入库单不存在！');
            return;
        };
        let _param = {
            optype: type,
            sheetid: this.sheetid
        };
        this.confirmCheck.emit(_param);
    }

    /**
     * 取消本次操作
     * 跳转到详情页面
     */
    doCancelCheck() {
        if (!this.sheetid) {
            this.myService.modalSer.modalToast('审核的采购入库单不存在！');
            return;
        };
        this.cancelCheck.emit(this.sheetid);
    }

    /** 打开弹出框 */
    open() {
        this.window.open();
    }

    /** 关闭弹出框 */
    cancel() {
        this.window.close();
    }

}