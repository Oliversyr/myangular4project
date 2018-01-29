import { HOTKEYS } from './../../directives/keyboard/hotkeys';
import { Observable } from 'rxjs/Observable';
import { Modal } from './../modal/modal';
import { TopCommon } from './../../top-common/top-common';

import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

/**
 * 重复商品提示框
 */
@Component({
    selector: "sui-grid-duplicatrow-alert",
    template: `
    <sui-modal #windowReference [autoOpen]="false" (onClose)="close($event)" [width]="500" [height]="300" [maxHeight]="400" 
        [minHeight]="200" [maxWidth]="700" [minWidth]="200" [showCollapseButton]="true" [isModal]="true">
        <div  class="alert-box" [suikeyboard]  #windowContent>
            <div class="alert-content">
                {{content}}
            </div>
            <div  class="alert-foot" >
                <button  class="sui-btn sui-btn-primary mr-xsmall" suiHotKey="ENTER" (click)="dealGoods('ADD',$event)">添加{{hotkeys.ENTER}}</button>
                <button  class="sui-btn sui-btn-primary mr-xsmall" suiHotKey="ITEM_REPLACE" (click)="dealGoods('COVER',$event)">替换{{hotkeys.ITEM_REPLACE}}</button>
                <button  class="sui-btn sui-btn-primary mr-xsmall" suiHotKey="ITEM_CUMULATE" (click)="dealGoods('CUMULATE',$event)">累加{{hotkeys.ITEM_CUMULATE}}</button>
            </div>
        </div>
    </sui-modal>
    `
    // ,styleUrls: ['./modal-demo.scss']
})
export class GridDuplicatrowAlert extends TopCommon implements  OnInit,  OnDestroy {

    @ViewChild('windowReference') window: Modal;
    content: string ;

    private subscriber: any;
    private dealType: string ;
    hotkeys: any = HOTKEYS;
    
    
    
    
    constructor(
     ) {
        super();
     }

     ngOnInit() {
    }  

    /**
     * 打开弹出框
     */
    open(content: string, title?: string): Observable<string>{
        //默认关闭
        this.dealType = 'NONE' ;
        this.content = content;
        title = title || "商品重复提示" ;
        this.window.setTitle(title);
        this.window.open();
        return new Observable<any>( subscriber => {
            this.subscriber = subscriber;
        });
    }

    dealGoods(dealType: string, event) {
        this.dealType = dealType ;
        this.window.close();
    }

    close(event) {
        this.subscriber.next(this.dealType);
        this.subscriber.complete();
        this.subscriber = null ;
    }

    ngOnDestroy() {
        this.subscriber = null ;
    }

}
