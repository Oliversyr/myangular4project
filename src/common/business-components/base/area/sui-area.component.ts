import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  ViewChild,
  forwardRef,
  OnInit,
  AfterContentInit,
  EventEmitter,
  HostListener,
  ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getAreaList } from './areaList';

@Component({
  selector: 'sui-area',
  templateUrl: './sui-area.html',
  styleUrls: [
    './sui-area.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SuiAreaComponent),
      multi: true
    }
  ]
})
export class SuiAreaComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  // 区域选择框是否激活
  _isOpen: boolean = false;

  // 组件与外界双向绑定的值
  _value: number;

  // 所有省市区街道数据
  _areaList: Array<any> = [];

  // tab页签分类展示省市区街道数据
  _tabs = {
    selectedIndex: 0,
    isLastTab: false,
    list: [
      {
        type: 'province',
        name: '请选择',
        value: '',
        index: 0,
        disabled: false,
        contentList: [],
        selectClick: ($event, item) => {
          this._selectClick($event, item, 0);
        }
      },
      {
        type: 'city',
        name: '请选择',
        value: '',
        index: 1,
        disabled: false,
        contentList: [],
        selectClick: ($event, item) => {
          this._selectClick($event, item, 1);
        }
      },
      {
        type: 'district',
        name: '请选择',
        value: '',
        index: 2,
        disabled: false,
        contentList: [],
        selectClick: ($event, item) => {
          this._selectClick($event, item, 2);
        }
      },
      {
        type: 'street',
        name: '请选择',
        value: '',
        index: 3,
        disabled: false,
        contentList: [],
        selectClick: ($event, item) => {
          this._selectClick($event, item, 3);
        }
      }
    ]
  };

  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

  // ViewChild
  @ViewChild('areaNameInput') areaNameInputElementRef;

  // 输入属性:
  @Input() areaPrependName = '请选择';
  @Input() areaName = '';
  @Input()
  get areaOpen(): boolean {
    return this._isOpen;
  };
  set areaOpen(value: boolean) {
    if (this._isOpen === value) {
      return;
    }
    this._isOpen = value;
    this.areaOpenChange.emit(this._isOpen);
  }
  @Input('customTabindex') customTabindex = 1;

  // 输出属性:
  @Output() areaOpenChange: EventEmitter<any> = new EventEmitter();

  // HostListener 是属性装饰器，用来为宿主元素添加事件监听。
  @HostListener('click', ['$event'])
  onHostClick(event: Event) {
    event.stopPropagation();
    return false;
  }

  // HostListener 是属性装饰器，也可以监听宿主元素外，其它对象产生的事件，如 window 或 document 对象
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.hiddenAreacontainer(false);
    }
  }

  // 组件类的构造器
  constructor(private el: ElementRef) { }

  // ng 生命周期: OnInit
  ngOnInit() {
    // 获取省市区街道数据
    this._areaList = getAreaList();
    // 初始化省份数据
    this._tabs.list[0].contentList = this._areaList;
  }

  // ng 生命周期: AfterContentInit
  ngAfterContentInit() {

  }

  // 区域input输入框点击事件
  areaNameInputClick(e) {
    e.preventDefault();
    this.areaOpen = !this.areaOpen;
    this.areaNameInputElementRef.nativeElement.focus();
  }

  // 设置区域input输入框值
  _setAreaName(index, value) {
    let areaNameSplit = this.areaName.split('/').splice(0, index);
    areaNameSplit[index] = value;
    this.areaName = areaNameSplit.join('/');
  }

  // 设置当前tab的下级是否可用
  _setTabsListDisabled(isDisabled, nextIndex, numOfLeaver) {
    if (nextIndex < numOfLeaver) this._tabs.list[nextIndex].disabled = isDisabled;
  }

  // 选择省市区街道数据
  _selectClick($event, item, index) {
    console.log('选择省市区街道数据=>点击事件参数', $event, item, index);
    // 设置当前tab的value,name
    this._tabs.list[index].value = item.value;
    this._tabs.list[index].name = item.label;
    // 判断是否有下级数据
    this._tabs.isLastTab = item.hasOwnProperty('children') && item.children.length > 0;
    let
      // 下级序号
      nextIndex = index + 1,
      // 几级联动
      numOfLeaver = this._tabs.list.length;
    if (this._tabs.isLastTab) {
      // 重新获取下级数据并清除下级tab的name值
      this._tabs.list[nextIndex].contentList = item.children;
      for (let i = index; i < numOfLeaver - 1; i++) {
        this._tabs.list[i + 1].name = '请选择';
      }
      // 激活下级tab页签
      this._tabs.selectedIndex = nextIndex;
      // 有下级设置disabled为false
      this._setTabsListDisabled(false, nextIndex, numOfLeaver);
    } else {
      // 没有下级设置disabled为true
      this._setTabsListDisabled(true, nextIndex, numOfLeaver);
    }
    // 设置区域input输入框值
    this._setAreaName(index, item.label);
    // 输出组件选择的areaId
    this._value = item.value;
    this.onChange(this._value);
  }

  // 切换是否显示省市区tab内容
  hiddenAreacontainer(isOpen: boolean) {
    this._isOpen = isOpen;
  }

  // 切换tab页签
  selectTab(tabIndex) {
    this._tabs.selectedIndex = tabIndex;
  }

  // 关闭tab内容
  closeTab() {
    this.hiddenAreacontainer(false);
  }

  // 自定义实现ControlValueAccessor
  writeValue(value: any): void {
    this._value = value;
    if (this._value === -1) {
      this.areaName = '';
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

}
