import { SuiSelectModule } from './sui-select';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { CommonServices, CommonServicesModule } from './../../services/groups/common-services.module';
import { DateUtil } from './../../services/utils/date-util';
import { FormsModule } from '@angular/forms';
import { SelectItem } from './../entitys/selectitem';
import { CommonModule } from '@angular/common';
import {
    Component, Input, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, forwardRef, OnChanges, SimpleChanges,
    ViewChild, NO_ERRORS_SCHEMA, ChangeDetectionStrategy, ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TopCommon } from './../../top-common/top-common';


export interface DateRangeModel {
    /**
     * 左边有下拉框返回的值
     */
    leftValue?: string | number;
    /**
     * 开始日期
     */
    beginDate?: string | Date;
    /**
     * 结束日期
     */
    endDate?: string | Date;
}

/**
 * 日期范围选择
 * 
 */
@Component({
    selector: "sui-date-range",
    template: `
    <sui-select [ngClass]="leftClass"  *ngIf="isSelectLeft" [(ngModel)]="leftValue" 
    [displayMember]="'label'" [valueMember]="'value'" [source]="_label" (onChange)="onLeftChange($event)">
    </sui-select>
    <span class="sui-lefeLabel" [ngClass]="leftClass" *ngIf="!isSelectLeft" >{{_label}}</span>

    <sui-date class="sui-dates-begin" [(ngModel)]="beginDate" [placeHolder]="'开始日期'" [width]="120" (onValueChanged)="onBeginDateChange($event)">
    </sui-date>
    <sui-date class="sui-dates-end" [(ngModel)]="endDate" [placeHolder]="'结束日期'" [width]="120"  (onValueChanged)="onEndDateChange($event)" >
    </sui-date>
    `
    , styles: [`
    sui-select, sui-date {
            display: inline-block;
        }
    `]
    , providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiDateRange),
            multi: true
        }
    ]
})
export class SuiDateRange extends TopCommon implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {

    /**
     * 左边选择可宽度
     */
    @Input() leftClass;
    @Input() customTabindexs: number[];
    // leftTabindex: number;
    // beginDateTabindex: number;
    // endDateTabindex: number;

    /** 
     * 左边标题
     */
    @Input()
    set leftLabel(_label: string | SelectItem<string>[]) {
        this.isSelectLeft = Array.isArray(_label);
        this._label = _label;
    }

    _label: string | SelectItem<string>[]
    /**
     * 输入框左边label多选情况下,选择项目值
     */
    leftValue: string;
    beginDate: string;
    endDate: string;


    /**
     *左边是否下拉框
     */
    isSelectLeft: boolean;

    value: DateRangeModel = {};

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };


    constructor(
        private dateUtil: DateUtil,
        private el_root: ElementRef
    ) {
        super();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.initCustomTabindex();
    }

    //初始化定位元素
    private initCustomTabindex() {
        let tabindexs: number[] = [0, 0, 0];
        if (this.isSelectLeft !== true) {
            if (Array.isArray(this.customTabindexs)) {
                this.customTabindexs.unshift(0);
            }
        }
        Object.assign(tabindexs, this.customTabindexs);
        let leftTabindex: number = tabindexs[0];
        if (leftTabindex > 0) {
            let el_select = this.el_root.nativeElement.querySelector("sui-select");
            if (el_select) {
                el_select.setAttribute("customTabindex", leftTabindex);
            }
        }

        let el_sui_dates = this.el_root.nativeElement.querySelectorAll("sui-date");
        let beginDateTabindex: number = tabindexs[1];
        if (beginDateTabindex > 0) {
            el_sui_dates[0].setAttribute("customTabindex", beginDateTabindex);
        }
        let endDateTabindex: number = tabindexs[2];
        if (endDateTabindex > 0) {
            el_sui_dates[1].setAttribute("customTabindex", endDateTabindex);
        }
    }

    /**
     * 左边标题值变化事件
     * @param event 
     */
    onLeftChange(event) {
        let args = event.args;
        let item: SelectItem<string> = this._label[args.index] as SelectItem<string>;
        this.value.leftValue = item.value;
        this._updateValue();
    }

    /**
     * 开始日期值变化
     * @param event 
     */
    onBeginDateChange(event) {
        let beginDate: string = this.dateUtil.toStr(event.args.date);
        this.value.beginDate = beginDate;
        this._updateValue();
    }
    /**
     * 结束日期值变化
     * @param event 
     */
    onEndDateChange(event) {
        let endDate: string = this.dateUtil.toStr(event.args.date);
        this.value.endDate = endDate;
        this._updateValue();
    }

    /**
     * 写入默认值(外部ngModel传入的默认值)
     * @param value 
     */
    writeValue(value: any): void {
        if (!value) {
            return;
        }

        if (value.leftValue) {
            this.leftValue = value.leftValue;
            this.value.leftValue = value.leftValue;
        }
        if (value.beginDate) {
            this.beginDate = value.beginDate;
            this.value.beginDate = value.beginDate;
        }

        if (value.endDate) {
            this.endDate = value.endDate;
            this.value.endDate = value.endDate;
        }
        // console.debug(">>>>the default value..", value);
    }

    private _updateValue() {
        // console.debug(">>>>the _updateValue..", this.value);
        this.onModelChange(this.value);
    }

    /**
     * 值更新到外部的ngModel
     * @param fn 
     */
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    ngOnDestroy() {

    }

}


@Component({
    selector: 'sui-date',
    template: '<input [(ngModel)]="ngValue">',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiDate),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SuiDate extends jqxDateTimeInputComponent implements OnInit, OnDestroy {


    constructor(
        private dateUtil: DateUtil,
        containerElement: ElementRef
    ) {
        super(containerElement);

        
    }

    ngOnInit() {
        this.attrShowFooter = true;
         this.attrFormatString = "yyyy-MM-dd";
        this.attrCulture  = "zh-CN";
        this.attrTodayString  = "今天";
        this.attrClearString  = "清空";
        super.ngOnInit();
    }

    writeValue(value: any): void {
        if (typeof value === "string" && this.dateUtil.isDate(value)) {
            value = this.dateUtil.toDate(value);
            //仅仅支持日期(Date)对象
            // super.writeValue(value);
        }
        super.writeValue(value);
    }

    //暂不使用
    //  private setDefault() {
    //     this.formatString("yyyy-MM-dd");
    //     this.showFooter(true);
    //  }

    ngOnDestroy() {

    }
}


@NgModule({
    imports: [
        CommonModule,
        FormsModule
        , CommonServicesModule
        , SuiSelectModule
    ],
    exports: [
        SuiDate,
        SuiDateRange,
        jqxDateTimeInputComponent
    ],
    declarations: [
        jqxDateTimeInputComponent,
        SuiDateRange,
        SuiDate
    ]
    , schemas: [NO_ERRORS_SCHEMA]
})
export class SuiDateModule { }