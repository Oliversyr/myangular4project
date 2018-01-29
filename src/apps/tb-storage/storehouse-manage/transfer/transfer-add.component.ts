import {
    Component
    , OnInit
    , Input
    , Output
    , ViewChild
    , ViewEncapsulation
    , ElementRef
    , EventEmitter
} from '@angular/core';
import { TopCommon } from '../../../../common/top-common/top-common';
import { Modal } from '../../../../common/components/modal/modal';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { TansferDirection } from './transfer-list.component';
import { TransferService } from './transfer.service';

/*
 * 新建调拨单
 * @Author: xiahl 
 * @Date: 2017-12-27 10:06:18 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-03 10:05:41
 */

@Component({
    selector: 'transfer-add',
    templateUrl: './transfer-add.html',
    styleUrls: ['./transfer-add.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TransferAddComponent extends TopCommon implements OnInit {
    /** 热键 */
    hotkeys: any = HOTKEYS;
    /** 调出仓库 */
    outstockid?: number;
    /** 调入仓库 */
    instockid?: number;
    @Input() title: string = "新建调拨单";
    @Output() addTransfer: EventEmitter<Object> = new EventEmitter<Object>();
    @ViewChild('windowReference') window: Modal;
    @ViewChild('outStoreOrgan') outStoreOrgan;
    @ViewChild('inStoreOrgan') inStoreOrgan;

    constructor(
        private myService: TransferService
    ) {
        super();
    }

    ngOnInit() {

    }

    /** 打开弹出框 */
    open() {
        this.window.open();
        this.clearSelection();
    }

    /** 关闭弹出框 */
    cancel() {
        this.window.close();
        this.clearSelection();
    }

    /** 清除选择仓库数据 */
    clearSelection() {
        this.outStoreOrgan.clearSelection();
        this.inStoreOrgan.clearSelection();
    }

    /**
     * 仓库选择
     * @param org 
     * @param tansferDirection 
     */
    selectedStorehouse(org, tansferDirection) {
        if (TansferDirection.Out === tansferDirection) {
            this.outstockid = org.length !== 0 ? org[0].stockid : -1;
        } else {
            this.instockid = org.length !== 0 ? org[0].stockid : -1;
        }
    }

    /** 新建调拨单 */
    confirm() {
        // 1. 校验数据
        if (!this.instockid || !this.outstockid || !~this.instockid || !~this.outstockid) {
            this.myService.modalSer.modalToast('调入仓库、调出仓库必填！');
            return;
        }
        // 2. 提交数据
        let param = {
            instockid: this.instockid,
            outstockid: this.outstockid,
        }
        this.addTransfer.emit(param);
    }

}