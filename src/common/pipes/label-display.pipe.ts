import { Pipe, PipeTransform, NgModule } from '@angular/core';
/*
 *  通过值显示标签管道()
 * Usage:
 *   value | getLabelByvalue:items|object
 * Example:
 * 1. {{ 1 | getLabelByvalue: [{value: 0, label: "加工单"}, {value: 1, label: "分解单"}] }}
 *   返回值为: 分解单
 * 2. {{ 1 | getLabelByvalue: {"0":  "加工单", "1":  "分解单"} }}
 *   返回值为: 分解单
*/
@Pipe({name: 'labelDisplay', pure: true})
export class LabelDisplayPipe implements PipeTransform {
  transform(value: number, items) {
    if(!items) {
      return value ;
    }
    let label ;
    if(items instanceof Array) {
      //如果为数组则遍历每个对象
      let _item = items.filter( (item) => item.value == value )[0];
      if(_item) {
        label = (_item as any).label ;
      }
    } else {
      //为对象则直接取key的值
      label = items[value];
    }
    return label ;
  }
}

@NgModule({
  imports: [  
    
  ],
  exports: [ 
    LabelDisplayPipe
  ],
  declarations: [ 
    LabelDisplayPipe
  ]
})
export class LabelDisplayPipeModule { }