import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    ViewChild,
    forwardRef,
    OnInit,
    AfterContentInit,
    AfterViewInit,
    EventEmitter,
    HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArrayUtil } from './../../../services/utils/array-util';
import { USERTYPE } from './sui-user-type';
import { SuiUserService } from './sui-user.service';
import { SuiComboBox } from '../../../components/input/sui-combobox';

@Component({
    selector: 'sui-user',
    templateUrl: './sui-user.html',
    styleUrls: [
        './sui-user.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SuiUserService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiUserComponent),
            multi: true
        }
    ]
})
export class SuiUserComponent implements ControlValueAccessor, OnInit, AfterContentInit, AfterViewInit {
    // combobox是否打开
    isOpen: boolean = false;

    // 组件与外界双向绑定的值
    _value: number;

    // user label 显示值
    get userLabel(): string {
        return !!this.customUserLabel ? this.customUserLabel : USERTYPE[this.userType];
    };

    // ngModel Access
    onChange: any = Function.prototype;
    onTouched: any = Function.prototype;

    // ViewChild
    @ViewChild('myComboBox') myComboBox: SuiComboBox;

    // 输入属性：
    @Input() userType: number = 0;
    @Input() customUserLabel: string = '';
    @Input() dataSource: any[] = [];
    @Input() displayMember: string = 'userName';
    @Input() valueMember: string = 'userId';
    @Input('customTabindex') customTabindex = 1;

    // HostListener 是属性装饰器，也可以监听宿主元素外，其它对象产生的事件，如 window 或 document 对象
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        this.isOpen = this.myComboBox.isOpened();
    }

    // 组件类的构造器
    constructor(private arrayUtil: ArrayUtil, private userService: SuiUserService) { }

    // ngOnInit
    ngOnInit() {
        this.userService.getUserList(this.userType).subscribe(res => {
            this.dataSource = this.userService.data;
        });
    }

    // ngAfterContentInit
    ngAfterContentInit() {

    }

    // ngAfterViewInit
    ngAfterViewInit(): void {

    }

    // 处理箭头图标选择事件
    handleArrowSelect() {
        this.isOpen = !this.isOpen;
        this.isOpen ? this.myComboBox.open() : this.myComboBox.close();
    }

    // 处理选择项改变事件
    selectItemChange(event: any): void {
        this.isOpen = false;
        if (event.args) {
            let item = event.args.item;
            if (item) {
                // 输出组件选择的areaId
                this._value = item.value;
                this.onChange(this._value);
            }
        } else {
            // 输出组件选择的areaId
            this._value = -1;
            this.onChange(this._value);
        }
    }

    // 自定义实现ControlValueAccessor
    writeValue(value: any): void {
        this._value = value;
        if(this._value === -1){
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
