import { GlobalService } from './../../global/global.service';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, ChangeDetectionStrategy, forwardRef, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { KeyboardService } from '../../directives/keyboard/keyboard.service';


/**
 * 弹出框组件
 * 
 */
@Component({
    selector: "sui-modal",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
    , styles: [`
         
    `]
    , providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => Modal),
            multi: true
        }
    ]
})
export class Modal extends jqxWindowComponent implements OnInit, OnDestroy {


    constructor(
        private globalService: GlobalService,
        private keyboardService: KeyboardService,
        containerElement: ElementRef
    ) {
        
        super(containerElement);
    }

    ngOnDestroy() {

    }

    __wireEvents__(): void {
        this.host.on('close', (eventData: any) => {
            this.onClose.emit(eventData);
            this.globalService.focusInCurrentPage();
        });

        this.host.on('open', (eventData: any) => {
            this.onOpen.emit(eventData);
            setTimeout(() => {
                let element = this.host[0];
                let defaultFocusEL: HTMLElement = element.querySelector("[defaultFocus]") as HTMLElement;
                //如果有默认元素;焦点定位的默认元素上;没有则按弹出框原来默认方式处理
                if (defaultFocusEL && this.keyboardService) {
                    this.keyboardService.fucos(defaultFocusEL);
                } 
            }, 10);
        });
        this.host.on('collapse', (eventData: any) => { this.onCollapse.emit(eventData); });
        this.host.on('created', (eventData: any) => { this.onCreated.emit(eventData); });
        this.host.on('expand', (eventData: any) => { this.onExpand.emit(eventData); });
        this.host.on('moving', (eventData: any) => { this.onMoving.emit(eventData); });
        this.host.on('moved', (eventData: any) => { this.onMoved.emit(eventData); });
        // this.host.on('open', (eventData: any) => { this.onOpen.emit(eventData); });
        this.host.on('resizing', (eventData: any) => { this.onResizing.emit(eventData); });
        this.host.on('resized', (eventData: any) => { this.onResized.emit(eventData); });
    }


}