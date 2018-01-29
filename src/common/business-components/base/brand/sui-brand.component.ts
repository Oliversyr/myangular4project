import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    ViewChild,
    forwardRef,
    OnInit,
    HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArrayUtil } from './../../../services/utils/array-util';
import { SuiBrandService } from './sui-brand.service';
import { SuiComboBox } from '../../../components/input/sui-combobox';

@Component({
    selector: 'sui-brand',
    templateUrl: './sui-brand.html',
    styleUrls: [
        './sui-brand.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SuiBrandService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiBrandComponent),
            multi: true
        }
    ]
})
export class SuiBrandComponent implements ControlValueAccessor, OnInit {
    // combobox是否打开
    isOpen: boolean = false;

    // 组件与外界双向绑定的值
    _value: string;

    // ngModel Access
    onChange: any = Function.prototype;
    onTouched: any = Function.prototype;

    // ViewChild
    @ViewChild('myComboBox') myComboBox: SuiComboBox;

    // 输入属性：
    @Input() brandPrependName: string = '品牌';
    @Input() dataSource: any[] = [];
    @Input('customTabindex') customTabindex = 1;
    /** 选择模式: single-单选; multiple-多选; */
    @Input('selectionMode') selectionMode: string = 'multiple';

    // HostListener 是属性装饰器，也可以监听宿主元素外，其它对象产生的事件，如 window 或 document 对象
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        this.isOpen = this.myComboBox.isOpened();
    }

    // 组件类的构造器
    constructor(private arrayUtil: ArrayUtil, private brandService: SuiBrandService) { }

    // ngOnInit
    ngOnInit() {
        this.brandService.getBrandList().subscribe(res => {
            this.dataSource = this.brandService.data;
        });
    }

    // 处理箭头图标选择事件
    handleArrowSelect(event: any) {
        this.isOpen = !this.isOpen;
        this.isOpen ? this.myComboBox.open() : this.myComboBox.close();
    }

    // 处理选择项改变事件
    selectItemChange(event: any, selectionMode: string): void {
        this.isOpen = false;
        if (event.args) {
            let _valueIds = '';
            if (this.selectionMode === 'single') {
                let item = event.args.item;
                if (item != null) {
                    _valueIds += item.value + ',';
                }
            } else {
                let items = this.myComboBox.getCheckedItems();
                for (let obj of items) {
                    _valueIds += obj.value + ',';
                }
            }
            // 输出组件选择的areaId
            this._value = _valueIds.substr(0, _valueIds.length - 1);
            this.onChange(this._value);
        } else {
            // 输出组件选择的areaId
            this._value = -1 + '';
            this.onChange(this._value);
        }
    }

    // 自定义实现ControlValueAccessor
    writeValue(value: any): void {
        this._value = value;
        if (this._value === '-1') {
            this.myComboBox.clearSelection();
        }
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

}
