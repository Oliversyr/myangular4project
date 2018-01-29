/**
 * 元素获取焦点激活添加active样式指令
 */
import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({selector: '[activeClass]'})
export class ActiveClassDirective {
  constructor(private el: ElementRef) {
  }

  @Input('activeClass') hostElement: string;

  @HostListener('focus') onFocus() {
    this.activeClass(true);
  }

  @HostListener('blur') onBlur() {
    this.activeClass(false);
  }

  private activeClass(isFocus: boolean) {
    const elements = this.hostElement === 'parent' ? this.el.nativeElement.parentNode : this.el.nativeElement,
      cName = 'active';
    if (isFocus) {
      this.addClass(elements, cName);
    }else {
      this.removeClass(elements, cName);
    }
  }

  private hasClass(elements, cName) {
    // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    return !!elements.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
  };

  private addClass(elements, cName) {
    if (!this.hasClass(elements, cName)) {
      elements.className += ' ' + cName;
    }
  };

  private removeClass(elements, cName) {
    if (this.hasClass(elements, cName)) {
      elements.className = elements.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' '); // replace方法是替换
    }
  };
}
