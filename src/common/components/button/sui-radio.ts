import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, ElementRef, OnInit, OnDestroy, Component, ChangeDetectionStrategy, forwardRef, ViewChild, NgModule, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxRadioButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxradiobutton';

/**
 * radio
 * 
 */

// const noop = () => { };
// declare let JQXLite: any;
@Component({
    selector: "sui-radio",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
        ,styles: [`
         
    `]
    ,providers    : [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiRadio),
            multi: true
        }
      ]
})
export class SuiRadio extends jqxRadioButtonComponent implements  OnInit, OnDestroy {

    constructor(containerElement: ElementRef) {
        super(containerElement);
    }

    ngOnDestroy() {

    }

}





/**
 * radio1
 * 不基于jqx，因为jqx的radio不支持value属性
 */


@Component({
    selector: "sui-radio-group",
    template: `<span class="radio-btn" ><label class="radio-label" [ngClass]="{actived: model==value}" (click)="clickLabel($event)"></label><input #radioinput type="radio" [name]="name" (click)="checkThis($event)"  [value]="value" [checked]="model==value"/><ng-content></ng-content></span>`,
    styleUrls: ['./style/radio.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers    : [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiRadioGroup),
            multi: true
        }
      ]
})
export class SuiRadioGroup implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() name: string;

    @Input() value: string;

    /**
     * 双向数据绑定
     */
    @Input('ngModel') model: string;

    @Output('ngModelChange') modelChange = new EventEmitter();

    /**
     * input type="radio"
     */
    @ViewChild('radioinput') radioinput: ElementRef;

    /**
     * 双向数据绑定
     * ControlValueAccessor
     */
    public onModelChange: Function = () => {};
    public onModelTouched: Function = () => {};

    constructor() {
       
    }

    ngOnInit() {
        // console.log('model==', this.model)
        // console.log('value==', this.value)
    }

    /**
     * 双向数据绑定
     * ControlValueAccessor
     */
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }
    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
    writeValue(value: any) {
        // console.log('1111',value)
        // this.model = value;
    }

    /**
     * input点击
     */
    checkThis(event) {
        // console.log(event);
        this.modelChange.emit(event.target.value);
    }

    /**
     * label点击
     */
    clickLabel(event) {
        // console.log(event);
        // console.log(this.radioinput);

        this.radioinput.nativeElement.click()

    }

    ngOnDestroy() {

    }

}
      
// export class  SuiRadio implements OnInit, ControlValueAccessor, OnChanges, OnDestroy 
// {
//     @Input('animationShowDelay') attrAnimationShowDelay: any;
//     @Input('animationHideDelay') attrAnimationHideDelay: any;
//     @Input('boxSize') attrBoxSize: any;
//     @Input('checked') attrChecked: any;
//     @Input('disabled') attrDisabled: any;
//     @Input('enableContainerClick') attrEnableContainerClick: any;
//     @Input('groupName') attrGroupName: any;
//     @Input('hasThreeStates') attrHasThreeStates: any;
//     @Input('rtl') attrRtl: any;
//     @Input('theme') attrTheme: any;
//     @Input('width') attrWidth: any;
//     @Input('height') attrHeight: any;

//     @Input('auto-create') autoCreate: boolean = true;

//     properties: string[] = ['animationShowDelay','animationHideDelay','boxSize','checked','disabled','enableContainerClick','groupName','hasThreeStates','height','rtl','theme','width'];
//     valueAttr: any;
//     host: any;
//     elementRef: ElementRef;
//     widgetObject:  jqwidgets.jqxRadioButton;

//     private onTouchedCallback: () => void = noop;
//     private onChangeCallback: (_: any) => void = noop;

//     constructor(containerElement: ElementRef) {
//         this.elementRef = containerElement;
//     }

//     ngOnInit() {
//         if (this.autoCreate) {
//             this.createComponent(); 
//         }
//     }; 

//     ngOnChanges(changes: SimpleChanges) {
//         if (this.host) {
//             for (let i = 0; i < this.properties.length; i++) {
//             let attrName = 'attr' + this.properties[i].substring(0, 1).toUpperCase() + this.properties[i].substring(1);
//             let areEqual: boolean;

//             if (this[attrName] !== undefined) {
//                 if (typeof this[attrName] === 'object') {
//                     if (this[attrName] instanceof Array) {
//                         areEqual = this.arraysEqual(this[attrName], this.host.jqxRadioButton(this.properties[i]));
//                     }
//                     if (areEqual) {
//                         return false;
//                     }

//                     this.host.jqxRadioButton(this.properties[i], this[attrName]);
//                     continue;
//                 }

//                 if (this[attrName] !== this.host.jqxRadioButton(this.properties[i])) {
//                     this.host.jqxRadioButton(this.properties[i], this[attrName]); 
//                 }
//             }
//             }
//         }
//     }

//     arraysEqual(attrValue: any, hostValue: any): boolean {
//         if (attrValue.length != hostValue.length) {
//             return false;
//         }
//         for (let i = 0; i < attrValue.length; i++) {
//             if (attrValue[i] !== hostValue[i]) {
//             return false;
//             }
//         }
//         return true;
//     }

//     manageAttributes(): any {
//         let options = {};
//         for (let i = 0; i < this.properties.length; i++) {
//             let attrName = 'attr' + this.properties[i].substring(0, 1).toUpperCase() + this.properties[i].substring(1);
//             if (this[attrName] !== undefined) {
//             options[this.properties[i]] = this[attrName];
//             }
//         }
//         return options;
//     }

//     createComponent(options?: any): void {
//         if (options) {
//             JQXLite.extend(options, this.manageAttributes());
//         }
//         else {
//         options = this.manageAttributes();
//         }
//         this.host = JQXLite(this.elementRef.nativeElement.firstChild);
//         this.__wireEvents__();
//         this.widgetObject = jqwidgets.createInstance(this.host, 'jqxRadioButton', options);

//         this.__updateRect__();
//         this.valueAttr = this.host[0].parentElement.getAttribute('value');
//         if (options.checked === true) this.onChangeCallback(this.valueAttr);
//     }

//     createWidget(options?: any): void {
//         this.createComponent(options);
//     }

//     __updateRect__() : void {
//         this.host.css({ width: this.attrWidth, height: this.attrHeight });
//     }

//     writeValue(value: any): void {
//         if(this.widgetObject) {
//         }
//     }

//     registerOnChange(fn: any): void {
//         this.onChangeCallback = fn;
//     }

//     registerOnTouched(fn: any): void {
//         this.onTouchedCallback = fn;
//     }

//     setOptions(options: any) : void {
//         this.host.jqxRadioButton('setOptions', options);
//     }

//     // jqxRadioButtonComponent properties
//     animationShowDelay(arg?: number) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('animationShowDelay', arg);
//         } else {
//             return this.host.jqxRadioButton('animationShowDelay');
//         }
//     }

//     animationHideDelay(arg?: number) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('animationHideDelay', arg);
//         } else {
//             return this.host.jqxRadioButton('animationHideDelay');
//         }
//     }

//     boxSize(arg?: jqwidgets.Size) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('boxSize', arg);
//         } else {
//             return this.host.jqxRadioButton('boxSize');
//         }
//     }

//     checked(arg?: boolean) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('checked', arg);
//         } else {
//             return this.host.jqxRadioButton('checked');
//         }
//     }

//     disabled(arg?: boolean) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('disabled', arg);
//         } else {
//             return this.host.jqxRadioButton('disabled');
//         }
//     }

//     enableContainerClick(arg?: boolean) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('enableContainerClick', arg);
//         } else {
//             return this.host.jqxRadioButton('enableContainerClick');
//         }
//     }

//     groupName(arg?: string) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('groupName', arg);
//         } else {
//             return this.host.jqxRadioButton('groupName');
//         }
//     }

//     hasThreeStates(arg?: boolean) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('hasThreeStates', arg);
//         } else {
//             return this.host.jqxRadioButton('hasThreeStates');
//         }
//     }

//     height(arg?: jqwidgets.Size) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('height', arg);
//         } else {
//             return this.host.jqxRadioButton('height');
//         }
//     }

//     rtl(arg?: boolean) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('rtl', arg);
//         } else {
//             return this.host.jqxRadioButton('rtl');
//         }
//     }

//     theme(arg?: string) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('theme', arg);
//         } else {
//             return this.host.jqxRadioButton('theme');
//         }
//     }

//     width(arg?: jqwidgets.Size) : any {
//         if (arg !== undefined) {
//             this.host.jqxRadioButton('width', arg);
//         } else {
//             return this.host.jqxRadioButton('width');
//         }
//     }


//     // jqxRadioButtonComponent functions
//     check(): void {
//         this.host.jqxRadioButton('check');
//     }

//     disable(): void {
//         this.host.jqxRadioButton('disable');
//     }

//     destroy(): void {
//         this.host.jqxRadioButton('destroy');
//     }

//     enable(): void {
//         this.host.jqxRadioButton('enable');
//     }

//     focus(): void {
//         this.host.jqxRadioButton('focus');
//     }

//     render(): void {
//         this.host.jqxRadioButton('render');
//     }

//     uncheck(): void {
//         this.host.jqxRadioButton('uncheck');
//     }

//     val(value?: boolean): any {
//         if (value !== undefined) {
//             this.host.jqxRadioButton("val", value);
//         } else {
//             return this.host.jqxRadioButton("val");
//         }
//     };


//     // jqxRadioButtonComponent events
//     @Output() onChecked = new EventEmitter();
//     @Output() onChange = new EventEmitter();
//     @Output() onUnchecked = new EventEmitter();

//     __wireEvents__(): void {
//         this.host.on('checked', (eventData: any) => { this.onChecked.emit(eventData); this.onChangeCallback(this.valueAttr); });
//         this.host.on('change', (eventData: any) => { this.onChange.emit(eventData); });
//         this.host.on('unchecked', (eventData: any) => { this.onUnchecked.emit(eventData); });
//     }

//     ngOnDestroy() {

//     }

// } 

@NgModule({
    imports: [ 
        CommonModule, FormsModule
    ],
    exports: [ 
        SuiRadio, SuiRadioGroup
    ],
    declarations: [ 
        jqxRadioButtonComponent,
        SuiRadio, SuiRadioGroup 
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiRadioModule { }