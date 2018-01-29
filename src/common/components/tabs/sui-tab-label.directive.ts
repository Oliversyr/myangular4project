import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[sui-tab-label]',
  host: {
    '[class.ant-tabs-tab]': 'true'
  }
})
export class SuiTabLabelDirective {

  private _disabled = false;

  @Input()
  @HostBinding('class.ant-tabs-tab-disabled')
  set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor(public elementRef: ElementRef) {
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  getOffsetTop(): number {
    return this.elementRef.nativeElement.offsetTop;
  }

  getOffsetHeight(): number {
    return this.elementRef.nativeElement.offsetHeight;
  }
}