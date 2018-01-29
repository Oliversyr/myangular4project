import { LabelDisplayPipeModule } from './../label-display.pipe';
import { SuiNumberPipeModule } from './../number.pipe';
import { SuiNumPipe, NumberEndOffTailPipe } from '../number.pipe';
import { Pipe, PipeTransform, NgModule } from '@angular/core';
 

/**
 * 常用管道模块
 */
@NgModule({
  imports: [ 
     LabelDisplayPipeModule
    ,SuiNumberPipeModule
   ],
  exports: [ 
    LabelDisplayPipeModule
    ,SuiNumberPipeModule
  ],
  declarations: [ 
    
  ]
})
export class CommonPipesModule { }