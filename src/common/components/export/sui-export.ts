import {
    Component,
    ChangeDetectionStrategy,
    NgModule,
    NO_ERRORS_SCHEMA,
    Output,
    EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Data Export: 数据导出
 * 
 */
@Component({
    selector: "sui-export",
    template: `
    <div class="sui-export">
        <button class="slic-btn slic-btn-theme3 sui-dropdown-btn">
            <span>导出</span> 
            <i class="anticon anticon-down" style="display: inline-block;"></i>
            <ul class="sui-dropdown animated fadeIn">
               <li *ngFor="let item of exportBtns" (click)="item.click(item, $event)">{{item.label}}
               </li>
            </ul>
        </button>
    </div>`,
    styleUrls: [
        './sui-export.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class SuiExport {
    // 导出相关按钮
    exportBtns: Array<any> = [
        {
            name: 'all',
            label: '全部',
            disabled: false,
            click: (item, $event) => {
                console.log('>......all', item, $event);
                this.doExport.emit(item.name);
            }
        },
        {
            name: 'selected',
            label: '已选项',
            disabled: false,
            click: (item, $event) => {
                console.log('>......selected', item, $event);
                this.doExport.emit(item.name);
            }
        },
        {
            name: 'current',
            label: '当前页',
            disabled: false,
            click: (item, $event) => {
                console.log('>......current', item, $event);
                this.doExport.emit(item.name);
            }
        }
    ];

    @Output() doExport: EventEmitter<string> = new EventEmitter();

    constructor() {

    }
}


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        SuiExport
    ],
    declarations: [
        SuiExport
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SuiExportModule { }