import { SuiSelect, SuiSelectModule } from './sui-select';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from './../entitys/selectitem';
import { CommonModule } from '@angular/common';
import {
    Component, Input, OnInit, AfterViewInit, AfterContentInit, OnDestroy, NgModule, ViewChild,
    forwardRef, NO_ERRORS_SCHEMA, ElementRef, TemplateRef, ContentChild
} from '@angular/core';
import { TopCommon } from './../../top-common/top-common';

/**
 * 输入框内容组件
 *  布局为: left content right 
 *  left,right 支持 1. 单个标题,下拉框标题,自定义内容通过
 *  ng-content 模板为: .sui-cell-left .sui-cell-content .sui-cell-right
 * 例子: <sui-cell></sui-cell>
 */


/**
 * 输入框组件模型
 */
export interface CellModel {
    /**
     * 左边有下拉框返回的值
     */
    leftValue?: string | number;
    /**
     * 右边边有下拉框返回的值
     */
    rightValue?: string | number;
}
@Component({
    selector: "sui-cell",
    templateUrl: './cell.html'
    , styleUrls: ['./cell.scss']
    , providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiCell),
            multi: true
        }
    ]
})
export class SuiCell extends TopCommon implements OnInit, AfterViewInit, OnDestroy {

    /**
     * 左边选择可宽度
     */
    @Input() leftClass;
    @Input() leftPlaceHolder: string;
    @Input() rightPlaceHolder: string;
    /**
     * 左边标题
     */
    @Input()
    set leftLabel(_leftLabel: string | SelectItem<string>[]) {
        this.isSelectLeft = Array.isArray(_leftLabel);
        this._leftLabel = _leftLabel;
        // console.log("this.leftValue-2", this.leftValue);
    }
    _leftLabel: string | SelectItem<string>[]
    /**
     * 输入框左边label多选情况下,选择项目值
     */
    set leftValue(leftValue) {
        this.value.leftValue = leftValue;
        this._updateValue();
    };

    get leftValue() {
        return this.value.leftValue;
    }
    /**
     *左边是否下拉框
        */
    isSelectLeft: boolean;

    /**
     * 右边选择可宽度
     */
    @Input() rightClass;
    /**
     * 右边标题
     */
    @Input()
    set rightLabel(_rightLabel: string | SelectItem<string>[]) {
        this.isSelectRight = Array.isArray(_rightLabel);
        this._rightLabel = _rightLabel;
    }
    _rightLabel: string | SelectItem<string>[]
    /**
     * 输入框右边label多选情况下,选择项目值
     */
    set rightValue(rightValue) {
        this.value.rightValue = rightValue;
        this._updateValue();
    };

    get rightValue() {
        return this.value.rightValue;
    }
    /**
     *右边是否下拉框
        */
    isSelectRight: boolean;


    value: CellModel = {};
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    @Input() customTabindexs: number[];
    @ViewChild("el_leftSelect") el_leftSelect: SuiSelect;
    @ViewChild("el_rightSelect") el_rightSelect: SuiSelect;

    @ContentChild('cellLeft') _cellLeft: TemplateRef<any>;
    @ContentChild('cellContent') _cellContent: TemplateRef<any>;
    @ContentChild('cellRight') _cellRight: TemplateRef<any>;


    constructor(
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
        let tabindexs: number[] = [0, 0];
        Object.assign(tabindexs, this.customTabindexs);
        let _leftTabindex: number = tabindexs[0];
        if (_leftTabindex > 0 && this.el_leftSelect && this.el_leftSelect.elementRef) {
            this.el_leftSelect.elementRef.nativeElement.setAttribute("customTabindex", _leftTabindex);
        }
        let rightTabindex: number = tabindexs[1];
        if (rightTabindex > 0 && this.el_rightSelect && this.el_rightSelect.elementRef) {
            this.el_rightSelect.elementRef.nativeElement.setAttribute("customTabindex", rightTabindex);
        }

    }



    /**
     * 左边标题值变化事件
     * @param event 
     */
    onLeftChange(event) {
        let args = event.args;
        let item: SelectItem<string> = this._leftLabel[args.index] as SelectItem<string>;
        this.value.leftValue = item.value;
        this._updateValue();
    }

    /**
     * 右边值变化事件
     * @param event 
     */
    onRightChange(event) {
        let args = event.args;
        let item: SelectItem<string> = this._rightLabel[args.index] as SelectItem<string>;
        this.value.rightValue = item.value;
        this._updateValue();
    }

    writeValue(value: CellModel): void {
        if (!value) {
            return;
        }

        this.leftValue = value.leftValue; 
        if(this.el_leftSelect) {
            this.el_leftSelect.setSelectItem(value.leftValue);
        }
        this.rightValue = value.rightValue;
        if(this.el_rightSelect) {
            this.el_rightSelect.setSelectItem(value.rightValue);
        }

    }

    private _updateValue() {
        this.onModelChange(this.value);
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    ngOnDestroy() {

    }

}


@NgModule({
    imports: [
        CommonModule
        , SuiSelectModule
    ],
    exports: [
        SuiCell
    ],
    declarations: [
        SuiCell
    ]
    , schemas: [NO_ERRORS_SCHEMA]
})
export class SuiCellModule { }