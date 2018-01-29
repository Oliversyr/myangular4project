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
import { DeliveryService } from './delivery.service';

/*
 * 新建配送单
 * @Author: xiahl 
 * @Date: 2017-12-27 10:06:18 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 17:28:05
 */

@Component({
    selector: 'delivery-add',
    templateUrl: './delivery-add.html',
    styleUrls: ['./delivery-add.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeliveryAddComponent extends TopCommon implements OnInit {

    hotkeys: any = HOTKEYS;
    /** 店铺编码 */
    shopeid?: number;
    /** 仓库编码 */
    stockid?: number;
    @Input() title: string = "新建配送单";
    @Output() addDelivery: EventEmitter<Object> = new EventEmitter<Object>();
    @ViewChild('windowReference') window: Modal;
    @ViewChild('shopOrgan') shopOrgan;
    @ViewChild('storeOrgan') storeOrgan;

    constructor(
        private myService: DeliveryService
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
        this.shopOrgan.clearSelection();
        this.storeOrgan.clearSelection();
    }

    /**
     * 目的店铺选择
     * @param org 
     */
    selectedShop(org) {
        this.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 配送仓库选择
     * @param org 
     */
    selectedStorehouse(org) {
        this.stockid = org.length !== 0 ? org[0].stockid : -1;
    }

    /** 新建配送单 */
    confirm() {
        // 1. 校验数据
        if (!this.stockid || !this.shopeid || !~this.stockid || !~this.shopeid) {
            this.myService.modalSer.modalToast('目的店铺、配送仓库必填！');
            return;
        }
        // 2. 提交数据
        let param = {
            shopeid: this.shopeid,
            stockid: this.stockid,
        }
        this.addDelivery.emit(param);
    }

}