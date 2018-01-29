import { KeyboardDirectiveModule } from './../../directives/keyboard/keyboard.directive';
import { EmitOption } from './../toolbar/toolbar';
import { CommonModule } from '@angular/common';
import { SuiHttpModule } from './../../services/https/sui-http.module';
import { SuiHttpService } from './../../services/https/sui-http.service';
import { CommonServices, CommonServicesModule } from './../../services/groups/common-services.module';
import { TopCommon } from './../../top-common/top-common';
import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, Input, Output, EventEmitter, ViewChild, HostBinding } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrintSet } from './print-set';
import { ModalModule } from '../modal/modal.module';
import { SuiRadioModule } from '../button/sui-radio';
import { SuiProgressBarModule } from '../progress-bar/sui-progress-bar';
import { ModalService } from '../modal/modal.service';

import { PreviousNextModule } from '../previous-next/previous-next';

/**
 * 打印机
 */
export interface Printer {
    /**
     * 打印机名称
     */
    name: string;
}

/**
 * 打印模板
 */
export interface PrintTemplate{
    eid: number;
    /**
     * 是否默认模板 1- 是, 0-不是
     */
    isdefault: number;
    moduleid: number;
    modulename: string;
    ptlid: number;
    rptid: number;
    rptname: string;
    rpturl: string;
    printType: string;
}

/**
 * 打印参数缓存
 */
export interface PrintParam {
    tpl: any,
    printer: string,
    printServer: string
}

/**
 * 
 * 打印组件
 * 输入属性
 * 1. data -- 打印数据
 * 2. moduleId -- 模块号
 */
@Component({
    selector: "sui-print",
    templateUrl: './print.html'
    ,styleUrls: ['./print.scss']
})
export class Print extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    @HostBinding('class.sui-print') _rootClassName = true;
    // @HostBinding('class.sui-print') _rootClassName = true;
    @HostBinding('class.slic-btn') _rootClassName1 = true;
    @HostBinding('class.slic-btn-theme3') _rootClassName2 = true;
    // @HostBinding('class.slic-btn ') _rootClassName1 = true;
    /**
     * 打印机设置窗口
     */
    @ViewChild('windowReference') printwindow;
    /**
     * 打印服务器选择窗口
     */
    @ViewChild('printServerWindow') printserverwindow;
    /**
     * Node服务下载窗口
     */
    @ViewChild('printNode') printNode;
    /**
     * 模块号
     */
    @Input() moduleId: number;
    /**
     * 打印事件
     */
    @Output() printClick: EventEmitter<EmitOption> = new EventEmitter<EmitOption>();
    /**
     * 打印数据
     */
    @Input() printData: Array<any>;

    @ViewChild('msgtoast') msgToast;

    @ViewChild('msgalert') msgAlert;

    PRINT_TYPE_PRINT = "PRINT";//打印
    PRINT_TYPE_PREVIEW = "PREVIEW";//打印预览
    PRINT_TYPE_EXPORT = "EXPORT";//导出

    printTpls: PrintTemplate[];
    printers: Printer[];
    printParam: PrintParam = {
        tpl: '',
        printer: '',
        printServer: ''
    };

    /**
     * node服务下载进度
     */
    downloadNode: number = 0;
    
    /**
     * 显示打印
     */
    showPrintBody: boolean ;
    /**
     * 是否显示打印机
     */
    showPrinter: boolean;
    /**
     * 选中打印模板序号
     */
    selectTplIndex: number=0;

    autodata: Array<object> = [];

    PNlist: Array<object> = [];

    constructor(
        private uitls: CommonServices,
        private plHttp: SuiHttpService,
        private modalSer: ModalService
        
    ) { 
        super();
        // console.debug("Print: constructor");
    }

    ngOnInit() {
        this.loadTplAndPrinter();

        this.getPNList();
    }

    /**自动补全**/
    // getCustomList(key) {
    //     // let key = event.target.value;
    //     console.log(key);
    //     this.autocompleteSer.searchList(key).subscribe((res) => {
    //         console.log(res);
    //         if(res['retCode'] === 'SUCCESS') {
    //             this.autodata = res['result'];
    //         }
            
    //     })
    // }


    /**
     * 加载打印模板与打印机信息
     */
    private loadTplAndPrinter() {
         let url = "assets/testdata/print.json";
         this.plHttp.request({url: url}).subscribe( data => {
            if(data.retCode != 0) {
                console.warn("request the print template faile ,can't use print ");
                return ;
            }   
            // console.log(">.............data", data)
            this.printTpls = data.data.printTemplates;
            this.printers = data.data.printers;
            let les = data.data.printTemplates;
            // console.debug(">.............data", data, les, this.printTpls);
         });
        
    }

    /**
     * 获取默认打印模板
     */
    private getDefaultPrintTpl() {
        //第一列为默认打印模板
        return this.printTpls[0];
    }

    /**
     * 打印区域移除后重置状态
     */
    printMoveOut() {
        this.showPrintBody=false; 
        this.showPrinter=false ;
        this.selectTplIndex = 0 ;
        // console.debug(">>>>>>>>>>>>>>>");
    } 

    doPrint(printTpl: PrintTemplate|string, printerName: string, event) {
        event.stopPropagation();
        
        if(typeof printTpl== "string" /* && printTpl == "DEFAULT" */) {
            printTpl = this.getDefaultPrintTpl();
        }

        let printSer = printTpl.printType;

        if(printerName === 'DEFAULT') {
            // this.getPrinterdef();
        }

        if(printSer === 'NODE_SERVER') {
            this.nodeServerPrint(printTpl, printerName);
            // this.printserverwindow.close();
        } else if(printSer === 'WEB') {
            this.webPrint(printTpl, printerName);
        } else {
            this.printserverwindow.open();
        }

        this.printParam = {
            tpl: printTpl,
            printer: printerName,
            printServer: !!printSer ? printSer : 'NODE_SERVER'
        }

        // this.invokePrintFace(printTpl,printerName, this.PRINT_TYPE_PRINT);
    }  

    /**
     * 打印服务器选择
     */
    printServerSelect(sel) {

        // if(event.args.checked && this.printParam) {
            // this.printParam.printServer = sel;
        // }
        
        console.log(sel);
    }

    /**
     * 打印服务器选择确定
     */
    selectPrintServer() {

console.log(this.printParam);
        let tpl = this.printParam.tpl;
        let printer = this.printParam.printer;
        let printSer = this.printParam.printServer;
        
        if(printSer === 'NODE_SERVER') {
            this.nodeServerPrint(tpl, printer);
            this.printserverwindow.close();
        } else if(printSer === 'WEB') {
            this.webPrint(tpl, printer);
        } 

    }


    /**
     * 打印服务器选择取消
     */
    cancelPrintServer() {
        this.printserverwindow.close();
    }

    /**
     * Node_server执行打印
     * @param tpl----打印模板
     * @param printer----打印机
     */
    nodeServerPrint(printTpl, printerName) {
        console.log('开始打印');
        console.log('模板：', printTpl, '打印机：', printerName);

        this.invokePrintFace(printTpl,printerName, this.PRINT_TYPE_PRINT);
        // this.nodePrintAlert.open();
    }

    /**
     * node服务下载
     */
    doDownloadNode() {
        if(this.downloadNode>0 && this.downloadNode<100) {

        } else {
            if(this.downloadNode === 100) {
                this.downloadNode = 0;
            }

            let down = setInterval(() => {
                if(this.downloadNode >= 100) {
                    clearInterval(down);
                    return;
                }
                this.downloadNode++;
            }, 50)
        }
        
        // this.printNode.close();
    }

    /**
     * Web执行打印
     * @param tpl----打印模板
     * @param printer----打印机
     */
    webPrint(printTpl, printerName) {
        this.msgToast.open('调用Web打印，接口开发中')
    }
    
    selectPrintTpl(tplIndex: number,event:Event) {
        event.stopPropagation();
        this.selectTplIndex = tplIndex ;
    }

    setPrinter(event) {
        event.stopPropagation();
        this.showPrinter = false;
        this.showPrintBody = false;

        this.printwindow.open();
        // document.body.innerHTML = document.body.innerHTML + htmlstr;
    }

    /**
     * 关闭默认打印机设置窗口
     */
    closeWindow(val: boolean) {
        if(!val) {
            this.printwindow.close();
        }
    }

    choosePrinter(event) {
        event.stopPropagation();
        this.showPrinter = !this.showPrinter ;
    }

    doPreview(printTpl: PrintTemplate, event) {
        event.stopPropagation();
        if(!printTpl) {
            printTpl = this.getDefaultPrintTpl();
        }
        this.invokePrintFace(printTpl, null, this.PRINT_TYPE_PREVIEW);
    }

    doExport(printTpl: PrintTemplate, event) {
        if(!printTpl) {
            printTpl = this.getDefaultPrintTpl();
        }
        this.invokePrintFace(printTpl, null, this.PRINT_TYPE_EXPORT);
        event.stopPropagation();
    }

    /**
     * 调打印接口
     * @param {PrintTemplate} printTpl - 打印模板
     * @param {string} printerName - 打印机名
     * @param printType - 打印类型; 
     */
    private invokePrintFace(printTpl: PrintTemplate,printerName: string,printType){
        let _printTple: any = this.uitls.classUtil.clone(printTpl);

        // let printer = {name: null};
        //只有打印才能选择打印机; 预览与导出无此功能
        // if(printType == this.PRINT_TYPE_PRINT && printerName != "DEFAULT") {
        //     printer.name =  printerName;
        // }
        
        // var printCfg = {
        //     printTpl : _printTple,
        //     printer: printer,
        //     printType : printType
        //     // rptParam : this.formatPrintData()
        // };

        // let emitOption: EmitOption = {
        //     originalEvent: event,
        //     active: 'print', 
        //     param: printCfg
        // };
        // this.printClick.emit(emitOption);

        let obj = {
            url: 'uis/print',
            param: {
                printer: printerName,
                printTpl: _printTple,
                printerType: printType,
                rptParam: this.formatPrintData()
            },
            type: 'POST'
        }
        console.log('obj==', JSON.parse(JSON.stringify(obj)))
        this.plHttp.request(obj).subscribe( data => {
            // this.printNode.open();
            if(data.retCode == 0) {
                this.msgToast.open('打印已发送！')
            } else if(data.retCode === 404) {
                this.downloadNode = 0;
                this.printNode.open();
            } else {
                this.modalSer.modalAlert(data.message, '调用打印接口失败', 'info').subscribe(res => {

                });
            }  
         });
    }

    private formatPrintData(){
        console.log('this.printData==', this.printData)
        let rptParamFields = [] ;
        
        let data = {datalist_HeadFields: rptParamFields, datalist: []} ;

        let rows = this.printData['rows'];
        let newRow: any;
        let fieldMap = this.printData['rptParamFieldMap'] ;
        rows.forEach( row => {
            newRow = {} ;
            for(let rptField in fieldMap) {
                rptParamFields.push(rptField);
                newRow[rptField] = row[fieldMap[rptField]] ;
            }
            data.datalist.push(newRow);
        });
        return data ;
    }

    toDetail(obj, index) {
        obj.index = index;
        console.log(obj)
        
        sessionStorage.setItem('currentobj', JSON.stringify(obj) );
        window.open("http://localhost:8085/demos/uis/previous-next");
        // this.currentObj = obj;
    }

    getPNList() {
        // this.autocompleteSer.searchList({pageNum: 1}).subscribe((res) => {
        //     console.log(res);
        //     if(res['retCode'] === 'SUCCESS') {
        //         this.PNlist = res['result'];
        //     }
            
        // })
        /* let footer = {
            pageNum: 1,
            pageSize: 10,
            totalrecord: 18
        }

        let hp = new HttpParams();

        

        let obj = {
            type: 'POST',
            param: new HttpParams().set('pageNum', '1' ).set('pageSize', '10'),
            url: 'http://127.0.0.1:8082/autocomplete/customlist/'
        }

        this.myHttp.post(obj.url, obj.param).subscribe( res => {
            console.log(res);
            if(res['retCode'] === 'SUCCESS') {
                this.PNlist = res['result'];
            }
         }); */

    }


    ngAfterViewInit() {
    }

    ngAfterContentInit() {

    }
    
    ngOnDestroy() {
    }

}

@NgModule({
    imports: [ CommonModule, CommonServicesModule, SuiHttpModule, FormsModule, ModalModule, SuiRadioModule, SuiProgressBarModule,KeyboardDirectiveModule ],
    exports: [ Print ],
    declarations: [ Print, PrintSet ],
    providers: [ ]
})
export class PrintModule { }