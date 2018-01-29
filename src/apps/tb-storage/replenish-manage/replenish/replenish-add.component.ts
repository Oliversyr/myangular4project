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
import { ReplenishService } from './replenish.service';

/*
 * 新建补货申请单
 * @Author: xiahl 
 * @Date: 2017-12-27 10:06:18 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-08 17:59:31
 */
@Component({
    selector: 'replenish-add',
    templateUrl: './replenish-add.html',
    styleUrls: ['./replenish-add.scss']
})
export class ReplenishAddComponent extends TopCommon implements OnInit {

    hotkeys: any = HOTKEYS;
    /** 申请店铺 */
    shopeid?: number; 
    @Input() title: string = "新建补货申请单";
    @Output() addReplenish: EventEmitter<Object> = new EventEmitter<Object>();
    @ViewChild('windowReference') window: Modal;
    @ViewChild('shopSelect') shopSelect;

    constructor(
        private myService: ReplenishService
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

    /** 清除选择店铺数据 */
    clearSelection() {
        this.shopSelect.clearSelection();
    }

    /**
     * 申请店铺选择
     * @param org 
     */
    selectedShop(org) {
        this.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    /** 新建补货申请单 */
    confirm() {
        // 1. 校验数据
        if (!this.shopeid || !~this.shopeid) {
            this.myService.modalSer.modalToast('申请店铺必填！');
            return;
        }
        // 2. 提交数据
        let param = {
            shopeid: this.shopeid
        }
        this.addReplenish.emit(param);
    }

}