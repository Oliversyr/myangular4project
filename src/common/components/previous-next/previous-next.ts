import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { ElementRef, OnInit, OnDestroy, OnChanges, Component, ChangeDetectionStrategy, forwardRef, ViewChild, NgModule, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PreviousNextOption } from './previousNextOption'; 
import { Observable } from 'rxjs/Observable';
import { EmailValidator } from '@angular/forms/src/directives/validators';

@Component({
    selector: 'sui-previous-next',
    template: `<span><button class="slic-btn" (click)="goToPrevious()" [ngClass]="{'slic-btn-theme4': firstSheet && firstPage, 'slic-btn-theme3': !(firstSheet && firstPage)}">上一单</button>
                <button class="slic-btn" (click)="goToNext()" [ngClass]="{'slic-btn-theme4': lastSheet && lastPage, 'slic-btn-theme3': !(lastSheet && lastPage)}">下一单</button></span>`,
    styleUrls: ['./previous-next.scss']
   
})

export class SuiPreviousNext implements OnInit {

    @Input('previousNextOption') option: PreviousNextOption<any>;

    // @Output('preClick') preClick: EventEmitter<any> = new EventEmitter();

    // @Output('nextClick') nextClick: EventEmitter<any> = new EventEmitter();
    
    /**
     * 第一/最后 页
     */
    firstPage: boolean = false;
    lastPage: boolean = false;

    /**
     * 当前页 第一/最后 单
     */
    firstSheet: boolean = false;
    lastSheet: boolean = false;

    /**
     * 当前单顺序
     */
    private currentIndex: number;

    /**
     * 搜索参数
     */
    private searchParams: any;

    /**
     * 当前列表
     */
    private currentList: Array<any>;
    /**
     * 分页参数
     */
    private pageParam: any;

    constructor(
        
    ) {}

    ngOnInit() {
        this.initPreviousNext();
    }

    initPreviousNext() {
        if(typeof this.option.loadDataInterface !== "function") {
            console.error("previousNextOption.loadDataInterface is not a function");
            return ;
        }
        
        this.searchParams = JSON.parse(JSON.stringify(this.option.searchParams));
        let keyWord = this.option.keyWord;
        let currentSheet = this.option.currentSheet;
        this.option.loadDataInterface(this.searchParams).subscribe((res) => {
            this.firstPage = false;
            this.lastPage = false;
            this.firstSheet = false;
            this.lastSheet = false;
            this.currentIndex = undefined;
            this.currentList = res.rows;
            this.pageParam = res.footer;

            if(this.pageParam.pageNum === 1) {
                this.firstPage = true;
            }
            if(this.pageParam.pageNum === Math.ceil(this.pageParam.totalCount/this.pageParam.pageSize)) {
                this.lastPage = true;
            }

            if(this.currentList.length === 1) {
                this.firstSheet = true;
                this.lastSheet = true;
            } else if(this.currentList.length > 1) {
                for(let i = 0; i < this.currentList.length; i++) {
                    if(this.currentList[i][keyWord] == currentSheet) {
                        this.currentIndex = i;
                        break;
                    }
                }
                if(this.currentIndex == undefined) {
                    console.error("当前单据不在列表数据中....");
                    return ;
                }
                if(this.currentIndex === 0) {
                    this.firstSheet = true;
                }
                if(this.currentIndex === this.currentList.length - 1) {
                    this.lastSheet = true;
                }

            }
        })
    }

    /**
     * 获取列表
     */
    getList(searchParams) {
        let keyWord = this.option.keyWord;
        let currentSheet = this.option.currentSheet;

        return new Observable<any>((observable) => {
            this.option.loadDataInterface(searchParams).subscribe((res) => {
                this.firstPage = false;
                this.lastPage = false;
                this.currentList = res.rows;
                this.pageParam = res.footer;
    
                if(this.pageParam.pageNum === 1) {
                    this.firstPage = true;
                }
                if(this.pageParam.pageNum === Math.ceil(this.pageParam.totalCount/this.pageParam.pageSize)) {
                    this.lastPage = true;
                }
    
                if(this.currentList.length === 1) {
                    this.firstSheet = true;
                    this.lastSheet = true;
                }

                observable.next(true);
            })
            observable.complete();
        })
        
    }

    /**
     * 上一单
     */
    goToPrevious() {
        if(!this.firstSheet) {
            this.option.refreshDetailFn(this.currentList[this.currentIndex - 1]).subscribe((res) => {
                if(res) {
                    this.currentIndex = this.currentIndex - 1;
                    this.firstSheet = this.currentIndex === 0;
                    this.lastSheet = false;
                }
            })
        } else if(this.firstSheet && !this.firstPage) {
            this.searchParams.pageNum = this.searchParams.pageNum - 1;
            this.getList(this.searchParams).subscribe((res) => {
                if(res) {
                    this.option.refreshDetailFn(this.currentList[this.currentList.length - 1]).subscribe((res) => {
                        if(res) {
                            this.currentIndex = this.currentList.length;
                            this.lastSheet = true;
                            this.firstSheet = false;
                        }
                    })
                }
            });
        } 
    }

    /**
     * 下一单
     */
    goToNext() {
        if(!this.lastSheet) {
            this.option.refreshDetailFn(this.currentList[this.currentIndex + 1]).subscribe((res) => {
                if(res) {
                    this.currentIndex = this.currentIndex + 1;
                    this.lastSheet = (this.currentList.length - 1) === this.currentIndex;
                    this.firstSheet = false;
                }
            })
        } else if(this.lastSheet && !this.lastPage) {
            this.searchParams.pageNum = this.searchParams.pageNum + 1;
            this.getList(this.searchParams).subscribe((res) => {
                if(res) {
                    this.option.refreshDetailFn(this.currentList[0]).subscribe((res) => {
                        if(res) {
                            this.currentIndex = 0;
                            this.firstSheet = true;
                            this.lastSheet = this.currentList.length === 1;
                        }
                    })
                }
            });
        } 
    }

    
}

@NgModule({
    declarations: [ SuiPreviousNext ],
    imports: [ CommonModule, FormsModule ],
    exports: [ SuiPreviousNext ],
    providers: [ ]
})

export class PreviousNextModule { }