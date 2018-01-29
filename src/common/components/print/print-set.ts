import { Component, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter, QueryList, ViewContainerRef  } from '@angular/core';
import { SuiHttpModule } from './../../services/https/sui-http.module';
import { SuiHttpService } from './../../services/https/sui-http.service';
import { SuiRadioGroup } from '../button/sui-radio';

/**
 * 打印机
 */
export interface Printer {
    /**
     * 打印机名称
     */
    name: string;
}

@Component({
    selector: 'sui-print-set',
    templateUrl: './print-set.html'
})

export class PrintSet implements OnInit {
    /**
     * 关闭打印机选择弹窗
     */
    @Output() closeWindow: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('msgtoast') msgToast;

    @ViewChildren(SuiRadioGroup) printerSel:  QueryList<SuiRadioGroup>;

    printers: Printer[];

    /**
     * 默认打印机类型
     */
    printerType: string = 'SYSTEM_DEFAULT';

    /**
     * 默认打印机名称
     */
    printerName: string;

    constructor(
        private http: SuiHttpService
    ) { }

    ngOnInit() {
        this.getPrinterList();
    }

    /**
     * 获取打印机列表
     */
    getPrinterList() {
        let url = "assets/testdata/print.json";
        this.http.request({url: url}).subscribe(res => {
            // console.log(res);
            this.printers = res['printers'];
        },
            error => {

            })
    }

    /**
     * 确定
     */
    doConfirm() {
        this.closeWindow.emit(false);
    }

    /**
     * 关闭
     */
    doClose() {
        this.closeWindow.emit(false);
    }

    /**
     * 默认打印机类型选择
     * @param 'SYSTEM_DEFAULT' ---- '系统默认打印机'
     * @param 'CUSTOM' ---- '自定义默认打印机'
     */
    changePrinterType() {
        // console.log(this.printerType);
        if (this.printerType === 'SYSTEM_DEFAULT') {
            this.saveDefaultPrinter(this.printerType);
            this.printerName = '';
        } else if(this.printerType === 'CUSTOM') {
            // console.log(this.printerSel)
            if(!this.printerName) {
                this.printerSel.map((item, i) => {
                    if(i === 2) {
                        // console.log(item)
                        // item.modelChange.emit(item.value);
                        item.radioinput.nativeElement.click();
                    }
                });
            }
        }
    }

    /**
     * 默认打印机选择
     */
    changePrint(obj: Printer) {
        // console.log(obj);
        this.printerName = obj.name;
        this.saveDefaultPrinter(obj.name);
    }

    /**
     * 保存默认打印机
     */
    saveDefaultPrinter(printer) {
        // console.log('保存成功');
        // console.log(this.msgToast);
        this.msgToast.open('设置成功,printer=' + printer);
    }
}
