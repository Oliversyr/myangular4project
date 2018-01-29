/** 
 * 自定义指令: Transclude 用来设置模板内容生成视图
 * TemplateRef类: 表示内嵌的 template 模板元素
 * ViewContainerRef类: 表示一个视图容器，可添加一个或多个视图
 * @notes: 定义组件的时候对内对外的命名
 */
import {Directive, TemplateRef, ViewContainerRef, Input} from '@angular/core';

@Directive({selector: '[transclude]'})
export class TranscludeDirective {
  private _myTransclude: TemplateRef<any>;

  constructor(public viewRef: ViewContainerRef) {
  }

  @Input()
  private set transclude(templateRef: TemplateRef<any>) {
    this._myTransclude = templateRef;
    if (templateRef) {
      this.viewRef.createEmbeddedView(templateRef);
    }
  }

  private get transclude() {
    return this._myTransclude;
  }
}
