/*
@Description: 新增盘点单
 * @Author: cheng
 * @Date: 2017-12-28 17:43:02
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-18 16:11:27
 */
import { NgModule, Component, ElementRef, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, EventEmitter} from '@angular/core';
// tslint:disable-next-line:max-line-length
import { OnChanges, OnInit, AfterContentChecked, AfterContentInit, AfterViewInit, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopCommon } from '../../../../common/top-common/top-common';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { Modal } from '../../../../common/components/modal/modal';


// 自定义服务
import { StockPdykAddService } from './stockpdyk-add.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { filter } from 'rxjs/operators/filter';
import { SuiResponse } from '../../../../common/services/https/sui-http-entity';
import { SuiOrganComponent } from '../../../../common/business-components/base/organ/sui-organ.component';
import { SuiBrandComponent } from '../../../../common/business-components/base/brand/sui-brand.component';
import { SuiCategoryComponent } from '../../../../common/business-components/base/category/sui-category.component';

/**
* 要发送的接口参数
* @field bcheck:int  0:忽略检查  1:要求检查
* @field pdtype:int  0:全场盘点  4:按品牌  5:按品类
* @field stockid:int   仓库编码
* @field pdvalues?:List<int>  品牌列表、品类列表 部分盘点必填
*/
const OK = 'OK';
const SUCC = 0;

interface AddParams {
   bcheck: number;
   pdtype: number;
   stockid: number;
   pdvalues: Array<string | number>;
   brands: any;
   cates: any;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'sui-stock-add',
    templateUrl: './stockpdyk-add.html',
    styleUrls: [ './stockpdyk.scss' ]
})

export class StockPdykAddComponent extends TopCommon implements OnInit, AfterViewInit{

    constructor(
        private baseService: BaseService,
        private stockPdykAddService: StockPdykAddService
    ) {
        super();
    }

    // 是否非正常盘点
    private isCheckedStockpd: boolean[];

    // 盘点机构
    private selectedStock: {stockid: number, ename: string};
    
    // 盘点类型
    private pdTypeData: Array<Object>;
    private pdTypeObj: any;
    
    // 选择的盘点类型
    private selectedPdtype: any;
    
    // 选择的品牌
    private selectedBrand: {brandid: string | number};
    
    // 选择的品类
    private selectedCate: {catid: number};
    
    // 新增盘点数据
    public addParams: AddParams;
    /**
     * 弹窗
     */
    @ViewChild('addPdykModal') addPdykModal: Modal;
    @Output() callback = new EventEmitter<{sheetid: number}>();
    @ViewChild('organSelect') organSelect: SuiOrganComponent ;
    @ViewChild('brandSelect') brandSelect: SuiBrandComponent;
    @ViewChild('categorySelect') categorySelect: SuiCategoryComponent;
    
    /**
     * 初始化
     */
    ngOnInit() {
        this.initAddParams();
        this.initSelectedStock();
        this.initPdTypeData();
        this.initSelectedBrand();
        this.initSelectedCate();
        let res1 = this.organSelect && this.organSelect.clearSelection();
        this.selectedPdtype = {pdtype: -1};
        this.addPdykModal.focus();
    }
    
    ngAfterViewInit() {
        
    }

    /**
     * 重置新增弹出框数据
     */
    private initAddParams(): void {
        this.addParams = {
            bcheck: 1,
            pdtype: -1,
            stockid : -1,
            pdvalues: [],
            brands: {length: 0},
            cates: {length: 0}
        };
        this.isCheckedStockpd = [false, false];
    }

    /**
     * 重置选择的仓库
     */
    private initSelectedStock(): void {
        this.selectedStock = {stockid: -1, ename: ''};
    }

    /**
     * 初始化盘点类型
     */
    private initPdTypeData(): void {
        this.pdTypeData = [
            {value: 0, label: '全场盘点'},
            {value: 4, label: '按品牌'},
            {value: 5, label: '按品类'},
        ];
        this.pdTypeObj = {
            0: '全场盘点',
            4: '按品牌',
            5: '按品类',
            '全场盘点': 0,
            '按品牌': 4,
            '按品类': 5
        };
    }

    /**
     * 清空品牌
     */
    private initSelectedBrand(): void {
        this.selectedBrand = {brandid: -1};
    }

    /**
     * 清空品类
     */
    private initSelectedCate(): void {
        this.selectedCate = {catid: -1};
    }


    /**
     * 选择盘点机构
     */
    private selectStock(stock: Array<{stockid: number, ename: string}>): void {
        console.log('仓库选择', stock);
        let newStock = stock[0];

        if (!this.selectedStock || !this.selectedStock.stockid ||  newStock.stockid === this.selectedStock.stockid) {
            return ;
        }
        if (this.selectedStock.stockid == -1){
            this.selectedStock = newStock;
        } else {
            // 确定是否要切换
            let message = `您确定要切换为【${newStock['ename']}】`;
            let title = '盘点提示';
            let msgType = 'warning';
            
            this.baseService.modalService.modalConfirm(message, title, msgType).subscribe( (data: string) => {
                if (data === OK) {
                    this.selectedStock = newStock;
                    this.initAddParams();
                    this.initSelectedBrand();
                    this.initSelectedCate();
                }
            });
        }
    }


    /**
     * 选择盘点类型
     */
    private selectPdType(event): void {
        let res = this.addParams.pdtype;
        let val = this.pdTypeObj[event.target.textContent];

        console.log('选择盘点类型', res, val);

        if (val == 'undefined' ||  res ===  val) {
            return;
        }

        if (res == -1){
            this.changePdtype(val);
        }else{
            // 确定是否要切换盘点类型
            let msg = val === 0 ? '全场盘点' : val === 4 ? '按品牌盘点' : '按品类盘点';
            let message = `您确定要切换为【${msg}】`;
            let title = '盘点提示';
            let msgType = 'warning';
            
            this.baseService.modalService.modalConfirm(message, title, msgType).subscribe( (data: string) => {
                if (data === OK) {
                    this.changePdtype(val);
                }
            });
        }
    }


    /**
     * 切换盘点类型
     */
    private changePdtype(val: number){
        this.initAddParams();
        this.initSelectedBrand();
        this.initSelectedCate();
        this.addParams.pdtype = val;
    }
    
    /** 
     * 打开弹出框
     */
     open(): void {
        this.addPdykModal.open();
    } 

    /** 
     * 关闭弹出框
     */
    cancel(): void {
        this.ngOnInit();
        this.addPdykModal.close();
    }

    /**
     * 新建盘点
     */
    doSure(): void {
        if (!this.checkAddParam()) {
            return ;
        }
        let message = `您确定要开始盘点吗？`;
        let title = '盘点提示';
        let msgType = 'info';
        
        this.baseService.modalService.modalConfirm(message, title, msgType).subscribe( (data: string) => {
            if (data === OK) {
                this.commitAddParams();
            }
        });
    }

    /**
     * 检查盘点条件
     */
    private checkAddParam(): boolean {
        // 盘点机构
        let stockid = this.selectedStock.stockid;
        let msg = '请选择盘点机构!';
        if (stockid === -1) {
            this.baseService.modalService.modalToast(msg);
            return false;
        }
        this.addParams.stockid = stockid;
        // 盘点类型
        let pdtype =  this.addParams.pdtype;
        if (pdtype === 0) {
            // 全场盘点
            return true;
        } else if (pdtype === 4){
            // 品牌盘点 品类盘点
            let brandid = this.selectedBrand.brandid.toString().split(',');
            console.log('添加品牌', this.selectedBrand,  this.selectedCate);
            if (brandid.length <= 0) {
                msg = '请选择要盘点的品牌!';
                this.baseService.modalService.modalToast(msg);
                return false;
            }else{
                brandid.forEach( val => {
                    this.addParams.brands[val] = val;
                });
                this.addParams.brands.length = brandid.length;
            }
        }else if (pdtype === 5 ) {
            let catid = this.selectedCate.catid.toString().split(',');
            console.log('添加品类', this.selectedBrand,  this.selectedCate);
            if (catid.length <= 0) {
                msg = '请选择要盘点的品类!';
                this.baseService.modalService.modalToast(msg);
                return false;
            }else{
                catid.forEach( val => {
                    this.addParams.cates[val] = val;
                });
                this.addParams.cates.length = 1;
            }
        } else {
            msg = '请选择盘点类型';
            this.baseService.modalService.modalToast(msg);
            return false;
        }
        return true;
    }

    /**
     * 提交盘点条件数据
     */
    private commitAddParams(): void {
        // 将类别和品牌对象转成数组
        delete this.addParams.brands.length;
        delete this.addParams.cates.length;
        let field = this.addParams.pdtype == 4 ? 'brands' : 'cates';
        // tslint:disable-next-line:forin
        for (let item in this.addParams[field]){
            this.addParams.pdvalues.push(item);
        }
        this.isCheckedStockpd[0] = false;
        this.isCheckedStockpd[1] = false;
        
        this.stockPdykAddService.doAddStockPd(this.addParams).subscribe( (data: SuiResponse<any>) => {
            console.log('新建盘点单', this.addParams, data);
            
            let retCode = data.retCode;
            if ( retCode == SUCC) {
                let newSheetid = data.data.sheetid;
                // 开始盘点 生成快照
                this.doSnapshot(newSheetid);
            } else if ( retCode.toString() == 'CHECKEXIST') {
                let pdyknum = data.data.pdyknum;
                let inputoutnum = data.data.inputoutnum;
                // true : 需要提示
                this.isCheckedStockpd[0] = (pdyknum > 0);
                this.isCheckedStockpd[1] = (inputoutnum > 0);
                this.warnUncheckedPdSheet(pdyknum, inputoutnum);
            } else {
                this.baseService.modalService.modalToast('盘点单创建失败:' + data.message);
            }
        });
       
    }

    /**
     * 提示有未确认的盘点单
     */
    private warnUncheckedPdSheet( pdyknum: number, inputoutnum: number) {
        let message = `盘点地点【${this.selectedStock.ename}】存在未确认的盘点单，重复盘点可能会造成库存不准！请确认是否需要盘点？`;
        // 提示第一个
        if ( this.isCheckedStockpd[0]) {
            // 提示未审核的盘点单
            this.baseService.modalService.modalConfirm(message, '盘点提示', 'warning').subscribe( (data: string) => {
                if (data === OK) {
                    this.isCheckedStockpd[0] = false;
                    if (this.isCheckedStockpd[1]){
                        this.warnUncheckedIOSheet(inputoutnum);
                    }else {
                        this.startPdAfterWarn(0);
                    }
                } else {
                    this.isCheckedStockpd[0] = true;
                }
            });
        } else if (this.isCheckedStockpd[1]){
            this.warnUncheckedIOSheet(inputoutnum);
        }else{
            this.startPdAfterWarn(0);
        }
    }

    /**
     * 提示有未审核的出入库单
     */
    private warnUncheckedIOSheet(inputoutnum: number) {
        // 提示未审核的出入库单
        let message = `盘点所在地【${this.selectedStock.ename}】有待审核的出入库单据，请审核完毕后再进行盘点，否则盘点结果可能会不正确！请确认是否需要盘点？`;
        this.baseService.modalService.modalConfirm(message, '盘点提示', 'warning').subscribe( (data: string) => {
            this.isCheckedStockpd[1] = false;
            if (data === OK) {
                // 确认之后生成快照
                this.startPdAfterWarn(0);
            }
        });
    }
    
    /**
     * 非法盘点
     */
    private startPdAfterWarn(val: number){
        this.addParams.bcheck = val;
        this.commitAddParams();
    }
    
    /**
     * 生成盘点单 跳转到详情界面
     */
    private doSnapshot(newSheetid: number): void {
        if (Number.isInteger(newSheetid) && newSheetid > 0 ) {
            
        }else{
            newSheetid = -1;
        }
        this.callback.emit({sheetid: newSheetid});
        this.doClose();
    }

    /**
     * 取消盘点
     */
    doClose(): void {
        this.ngOnInit();
        this.addPdykModal.close();
    }
    
}
