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
    HostListener,
    ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SuiCategoryService } from './sui-category.service';
import { ArrayUtil } from './../../../services/utils/array-util';
import { SuiTree } from '../../../components/tree/sui-tree';

export interface TreeItem {
    // TreeItem properties
    id?: number;
    label?: string;
    value?: string;
    disabled?: boolean;
    checked?: boolean;
    element?: any;
    parentElement?: any;
    isExpanded?: boolean;
    selected?: boolean;
}// TreeItem

@Component({
    selector: 'sui-category',
    templateUrl: './sui-category.html',
    styleUrls: [
        './sui-category.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SuiCategoryService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiCategoryComponent),
            multi: true
        }
    ]
})
export class SuiCategoryComponent implements ControlValueAccessor, OnInit, AfterViewInit {
    /** 类别树是否激活 */
    _isOpen: boolean = false;
    /** 组件与外界双向绑定的值 */
    _value: string;
    /** ngModel Access */
    onChange: any = Function.prototype;
    onTouched: any = Function.prototype;
    /** ViewChild */
    @ViewChild('treeReference') myTree: SuiTree;
    @ViewChild('searchInput') searchInputElementRef;
    @ViewChild('treeNameInput') treeNameInputElementRef;
    /** 输入属性： */
    @Input() addOnName: string = '品类';
    @Input() treeName: string = '';
    @Input() treeFilterValue: string = '';
    @Input() treeSource: any[] = [];
    @Input() noTreeSourceText: string = '无匹配数据';
    @Input()
    get treeOpen(): boolean {
        return this._isOpen;
    };
    set treeOpen(value: boolean) {
        if (this._isOpen === value) {
            return;
        }
        this._isOpen = value;
        if (value) this.myTree.refresh();
        this.treeOpenChange.emit(this._isOpen);
    };
    @Input()
    get treeFilterInputValue(): any {
        return this.treeFilterValue;
    };

    set treeFilterInputValue(value: any) {
        if ((this.treeFilterValue === value) || (((this.treeFilterValue === undefined) || (this.treeFilterValue === null)) && ((value === undefined) || (value === null)))) {
            return;
        }
        this.treeFilterValue = value;
        if (!this._isOpen) {
            this.onChange(value);
        }
    };
    @Input()
    get myTreeSource(): any[] {
        return this.treeSource;
    };
    set myTreeSource(value: any[]) {
        if ((this.treeSource === value) || (((this.treeSource === undefined) || (this.treeSource === null)) && ((value === undefined) || (value === null)))) {
            return;
        }
        this.treeSource = value;
    };
    @Input('customTabindex') customTabindex = 1;
    /** 选择模式: single-单选; multiple-多选; */
    @Input('selectionMode') selectionMode = 'multiple';
    /** 输出属性: */
    @Output() treeOpenChange: EventEmitter<any> = new EventEmitter();
    /** HostListener 是属性装饰器，也可以监听宿主元素外，其它对象产生的事件，如 window 或 document 对象 */
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (!this.el.nativeElement.contains(event.target)) {
            this.treeOpen = false;
        }
    }

    constructor(
        private el: ElementRef,
        private categoryService: SuiCategoryService,
        private arrayUtil: ArrayUtil
    ) {

    }

    ngOnInit() {
        this.refresh();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.myTree.selectItem(null);
        });
    }

    /**
     * 刷新数据
     */
    refresh() {
        this.categoryService.getCategoryList().subscribe((res) => {
            this.myTreeSource = res;
        });
    }

    /**
     * 类别输入框点击事件
     * @param e 
     */
    treeNameInputClick(e) {
        e.preventDefault();
        this.treeOpen = !this.treeOpen;
        setTimeout(() => {
            this.searchInputElementRef.nativeElement.focus();
        });
    }

    /**
     * 类别树选中事件处理
     * @param event 
     */
    myTreeOnSelect(event: any): void {
        let args = event.args;
        let checkedItem = this.myTree.getCheckedItems();
        if (checkedItem.length <= 0) {
            this.treeName = '';
            // 输出组件选择的areaId
            this._value = '-1';
            this.onChange(this._value);
            return;
        }
        if (this.selectionMode === 'single') {
            this.selectSingle(checkedItem);
        } else {
            this.selectMultiple(checkedItem);
        }
    };

    /**
     * 单选模式选择方法
     * @param checkedItem 
     */
    selectSingle(checkedItem) {
        if (checkedItem.length === 1) {
            let item: TreeItem = checkedItem[0];
            this.treeName = item.label;
            // 输出组件选择的areaId
            this._value = item.id + '';
            this.onChange(this._value);
        } else if (checkedItem.length >= 2) {
            let _uncheckItem = checkedItem.filter((item, index) => {
                return item.label === this.treeName;
            });
            this.myTree.uncheckItem(_uncheckItem[0])
        }
    }

    /**
     * 多选模式选择方法
     * @param checkedItem 
     */
    selectMultiple(checkedItem) {
        let _treeName = '',
            _valueIds = '';
        for (let i = 0; i < checkedItem.length; i++) {
            let _checked: TreeItem = checkedItem[i];
            _treeName += _checked.label + ',';
            _valueIds += _checked.id + ',';
        }
        this.treeName = _treeName.substr(0, _treeName.length - 1);
        // 输出组件选择的areaId
        this._value = _valueIds.substr(0, _valueIds.length - 1);
        this.onChange(this._value);
    }

    // 根据输入的条件进行类别树数据的筛选
    onSearchChange(searchValue) {
        let treeFlatSource = this.categoryService.treeToFlat(this.categoryService.data, null);
        this.treeSourceFilter(treeFlatSource, searchValue, 'label');
    }

    /**
     * treeSource 过滤
     * @param treeSource 
     * @param searchValue 
     * @param key 
     */
    treeSourceFilter(treeSource: any[], searchValue: string, key: string) {
        let _myTreeSource = treeSource.slice(0) || [];
        if (!searchValue) {
            this.myTreeSource = this.categoryService.transTreeData(_myTreeSource);
            return;
        };
        // 过滤最终符合类别树的ids集合
        let _treeIdList = [];
        _myTreeSource.forEach((item) => {
            if (item[key].indexOf(searchValue) !== -1) {
                let _curIdList = this.categoryService.findParentNodes(_myTreeSource, item);
                _treeIdList = _treeIdList.concat(_curIdList);
            }
        });
        _treeIdList = this.arrayUtil.unique(_treeIdList);
        // 重新生成树节点
        let _treeSource = _myTreeSource.filter((item) => {
            let flag: boolean = true;
            _treeIdList.indexOf(item['id']) !== -1 ? item.expanded = true : flag = false;
            return flag;
        });
        this.myTreeSource = this.categoryService.transTreeData(_treeSource);
        this.myTree.refresh();
    }

    /**
     * 清除类别树过滤条件
     */
    clearFilterValue() {
        this.treeFilterInputValue = '';
        this.onSearchChange(this.treeFilterInputValue);
    }

    // 自定义实现ControlValueAccessor
    writeValue(value: any): void {
        this._value = value;
        if (this._value === '-1') {
            this.treeName = '';
        }
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

}
