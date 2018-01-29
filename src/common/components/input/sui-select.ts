import { Component, ChangeDetectionStrategy, forwardRef, OnInit, OnDestroy, ElementRef, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
// import { jqxDropDownListComponent } from '../../../apps/demos/jqwidgets/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonServices } from '../../services/groups/common-services.module';

 
/**
 * 下拉框
 * 
 */
@Component({
    selector: "sui-select",
    template: '<div ><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
    ,styles: [`
    `]
    ,providers    : [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiSelect),
            multi: true
        }
      ]
})
export class SuiSelect extends jqxDropDownListComponent implements  OnInit,  OnDestroy {
      
    /**
     * 提示显示
     */
     private _onChangeCallback: (_: any) => void = () => { };
 
    constructor(
        private utils: CommonServices,
        containerElement: ElementRef
    ) { 
        super(containerElement);
     }

    ngOnInit() {
        this.attrItemHeight = 29;
        
        super.ngOnInit();
        this.width("100%");
    }

    writeValue(value: any): void {
        if(this.widgetObject) {
            this["onChangeCallback"](this.host.val());
        }
        this.setSelectItem(value);
    }

    
    setSelectItem(value: any) {
        if(this.utils.classUtil.notExits(value)) {
            return ;
        }

        let selectIndex: number;
        let valueAs: string = this.attrValueMember || "value" ;
        let labelAs: string = this.attrDisplayMember || "label" ;
        if(Array.isArray(this.attrSource) && this.attrSource.length !=0 ){
            let item;
            for(let i=0; i < this.attrSource.length; i++) {
                item = this.attrSource[i];
                if(typeof item === "string" || typeof item === "number") {
                    if(value == item) {
                        //获取值对应的下拉框序号
                        selectIndex = i;
                        break;
                    }
                } else {
                    if(!valueAs) {
                        //未设置显示值对象
                        break;
                    }
                    if(item && item[valueAs] == value){
                        //获取值对应的下拉框序号
                        selectIndex = i;
                    }
                }
            }
        }
        if(selectIndex >= 0) {
            this.selectedIndex(selectIndex);
        }
    }

    

    /**
     * 重写父类方法; _onChangeCallback 返回为值value(原来是label)
     */
    registerOnChange(fn: any): void {
        this._onChangeCallback = fn;
    }

    /**
     * 重写父类方法; _onChangeCallback 返回为值value(原来是label)
     */
    __wireEvents__(): void {
        this.host.on('bindingComplete', (eventData: any) => { this.onBindingComplete.emit(eventData); });
        this.host.on('close', (eventData: any) => { this.onClose.emit(eventData); });
        this.host.on('checkChange', (eventData: any) => { this.onCheckChange.emit(eventData); });
        this.host.on('change', (eventData: any) => { this.onChange.emit(eventData); if (eventData.args) this._onChangeCallback(eventData.args.item.value); });
        this.host.on('open', (eventData: any) => { this.onOpen.emit(eventData); });
        this.host.on('select', (eventData: any) => { this.onSelect.emit(eventData); });
        this.host.on('unselect', (eventData: any) => { this.onUnselect.emit(eventData); });
     }
  
    ngOnDestroy() {

    }

}


@NgModule({
    imports: [ 
        CommonModule
    ],
    exports: [ 
        SuiSelect
    ],
    declarations: [ 
        jqxDropDownListComponent,
        SuiSelect 
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiSelectModule { }