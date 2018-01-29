import { CommonModule } from '@angular/common';
import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    TemplateRef,
    ElementRef,
    Renderer2,
    EventEmitter,
    ContentChild,
    forwardRef,
    AfterContentInit,
    HostListener,
    AfterViewInit,
    ViewChild,
    NgModule, NO_ERRORS_SCHEMA
  } from '@angular/core';
  import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

  import { NzUtilModule } from 'ng-zorro-antd';
import { SuiInputZorro } from './sui-input-zorro';
  declare var calculateNodeHeight;
//   import calculateNodeHeight from 'ng-zorro-antd/src/util/calculate-node-height';
//   d:\ydxl\angular4\slic-main\node_modules\ng-zorro-antd\src\util\calculate-node-height.d.ts
  export interface AutoSizeType {
    minRows?: number;
    maxRows?: number;
  }
  
  @Component({
    selector     : 'sui-input',
    encapsulation: ViewEncapsulation.None,
    template     : `
      <span class="ant-input-group-addon" *ngIf="_addOnContentBefore">
        <ng-template [ngTemplateOutlet]="_addOnContentBefore">
        </ng-template>
      </span>
      <span class="ant-input-prefix" *ngIf="_prefixContent">
        <ng-template [ngTemplateOutlet]="_prefixContent">
        </ng-template>
      </span>
      <ng-template [ngIf]="nzType!='textarea'">
        <input
          (blur)="_emitBlur($event)"
          (focus)="_emitFocus($event)"
          [attr.id]="nzId"
          [disabled]="nzDisabled"
          [readonly]="nzReadonly"
          [attr.type]="nzType"
          class="ant-input"
          [class.ant-input-search]="nzType==='search'"
          [ngClass]="_classMap"
          [attr.placeholder]="placeHolder"
          [(ngModel)]="nzValue">
      </ng-template>
      <ng-template [ngIf]="nzType=='textarea'">
        <textarea
          (blur)="_emitBlur($event)"
          (focus)="_emitFocus($event)"
          (input)="textareaOnChange($event)"
          [attr.id]="nzId"
          #inputTextarea
          [disabled]="nzDisabled"
          [readonly]="nzReadonly"
          type="textarea"
          [attr.rows]="nzRows"
          [attr.cols]="nzCols"
          class="ant-input"
          [ngClass]="_classMap"
          [attr.placeholder]="placeHolder"
          [(ngModel)]="nzValue"></textarea>
      </ng-template>
      <span class="ant-input-suffix" *ngIf="(nzType==='search')||(_suffixContent)">
        <i class="anticon anticon-search ant-input-search-icon" *ngIf="nzType==='search'"></i>
        <ng-template [ngTemplateOutlet]="_suffixContent">
        </ng-template>
      </span>
      <span class="ant-input-group-addon" *ngIf="_addOnContentAfter">
        <ng-template [ngTemplateOutlet]="_addOnContentAfter">
        </ng-template>
      </span>`,
    providers    : [
      {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SuiInput),
        multi      : true
      }
    ],
    styleUrls    : [
        './style/index.less',
        './style/patch.less'
    ]
  })
  export class SuiInput extends SuiInputZorro {
  
  }
  
  
  @NgModule({
    imports: [ 
        CommonModule,
        FormsModule
     ],
    exports: [ 
      SuiInput
    ],
    declarations: [ 
      SuiInput
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiInputModule { }