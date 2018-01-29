import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { toBoolean } from '../utils/convert';
import { TransferItem, TreeItem } from './item';

export interface TransferCanMove {
    direction: string;
    list: TreeItem[];
}

export interface TransferChange {
    from: string;
    to: string;
    list: TreeItem[];
}

export interface TransferSearchChange {
    direction: string;
    value: string;
}

export interface TransferSelectChange {
    direction: string;
    checked: boolean;
    list: TreeItem[];
    item: TreeItem;
}

/**
 * Transfer: 穿梭框组件
 *
 */
@Component({
    selector: 'sui-transfer',
    templateUrl: './sui-transfer.html',
    styleUrls: []
})
export class SuiTransfer implements OnChanges {
    private _showSearch = false;

    @Input() dataSource: TreeItem[] = [];
    @Input() titles: string[] = ['', ''];

    @Input()
    set showSearch(value: boolean) {
        this._showSearch = toBoolean(value);
    }
    get showSearch(): boolean {
        return this._showSearch;
    }
    @Input() searchPlaceholder = '请输入搜索条件';
    @Input() canMove: (arg: TransferCanMove) => Observable<TreeItem[]> = (arg: TransferCanMove) => of(arg.list);

    @Output() change: EventEmitter<TransferChange> = new EventEmitter();
    @Output() searchChange: EventEmitter<TransferSearchChange> = new EventEmitter();
    @Output() selectChange: EventEmitter<TransferSelectChange> = new EventEmitter();

    leftDataSource: TreeItem[] = [];
    rightDataSource: TreeItem[] = [];

    leftActive = false;
    rightActive = false;

    /**
     * 切割数据源为左右数据
     */
    private splitDataSource(): void {
        this.leftDataSource = [];
        this.rightDataSource = [];
        this.dataSource.forEach(record => {
            if (record.direction === 'right') {
                this.rightDataSource.push(record);
            } else {
                this.leftDataSource.push(record);
            }
        });
    }

    /**
     * 获取选中的数据
     * @param direction 
     */
    private getCheckedData(direction: string): TreeItem[] {
        return this[direction === 'left' ? 'leftDataSource' : 'rightDataSource'].filter(w => w.checked);
    }

    /**
     * 处理选择的数据
     * @param direction 
     * @param checked 
     * @param item 
     */
    handleSelect(direction: 'left' | 'right', checked: boolean, item?: TreeItem): void {
        const list = this.getCheckedData(direction);
        this.updateOperationStatus(direction, list.length);
        this.selectChange.emit({ direction, checked, list, item });
    }

    handleLeftSelectAll = (checked: boolean) => this.handleSelect('left', checked);
    handleRightSelectAll = (checked: boolean) => this.handleSelect('right', checked);

    handleLeftSelect = (item: TreeItem) => this.handleSelect('left', item.checked, item);
    handleRightSelect = (item: TreeItem) => this.handleSelect('right', item.checked, item);

    /**
     * 处理过滤条件的筛选
     * @param ret 
     */
    handleFilterChange(ret: { direction: string, value: string }): void {
        this.searchChange.emit(ret);
        this.cd.detectChanges();
    }

    /**
     * 更新操作按钮状态
     * @param direction 
     * @param count 
     */
    private updateOperationStatus(direction: string, count?: number): void {
        this[direction === 'right' ? 'leftActive' : 'rightActive'] = (typeof count === 'undefined' ? this.getCheckedData(direction).filter(w => !w.disabled).length : count) > 0;
        this.cd.detectChanges();
    }

    /**
     * 移动
     * @param direction 
     */
    moveTo(direction: string): void {
        const oppositeDirection = direction === 'left' ? 'right' : 'left';
        this.updateOperationStatus(oppositeDirection, 0);
        const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
        const moveList = datasource.filter(item => item.checked === true && !item.disabled);
        this.canMove({ direction, list: moveList })
            .subscribe(
            newMoveList => this.truthMoveTo(direction, newMoveList.filter(i => !!i)),
            () => moveList.forEach(i => i.checked = false)
            );
    }

    private truthMoveTo(direction: string, list: TreeItem[]): void {
        const oppositeDirection = direction === 'left' ? 'right' : 'left';
        const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
        const targetDatasource = direction === 'left' ? this.leftDataSource : this.rightDataSource;
        for (const item of list) {
            const idx = datasource.indexOf(item);
            if (idx === -1) continue;
            item.checked = false;
            targetDatasource.push(item);
            datasource.splice(idx, 1);
        }
        this.updateOperationStatus(oppositeDirection);
        this.change.emit({
            from: oppositeDirection,
            to: direction,
            list
        });
    }

    moveToLeft = () => this.moveTo('left');
    moveToRight = () => this.moveTo('right');

    constructor(
        private el: ElementRef,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('dataSource' in changes) {
            this.splitDataSource();
            this.updateOperationStatus('left');
            this.updateOperationStatus('right');
        }
        this.cd.detectChanges();
    }
}