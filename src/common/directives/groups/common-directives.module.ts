import { SuiRouterModule } from './../router/sui-router.module';
import { KeyboardDirectiveModule } from './../keyboard/keyboard.directive';
import { NgModule } from '@angular/core';
import { ActiveClassDirective } from '../activeClass.directive';
import { TranscludeDirective } from '../transclude.directive';
import { StopPropagationDirective } from '../stop-propagation.directive';

/**
 * 常用指令模块
 */
@NgModule({
  declarations: [
    ActiveClassDirective,
    TranscludeDirective,
    StopPropagationDirective
  ],
  imports: [ 
    KeyboardDirectiveModule,
    SuiRouterModule
   ],
   exports: [
    KeyboardDirectiveModule
    ,SuiRouterModule
    ,ActiveClassDirective
    ,TranscludeDirective
    ,StopPropagationDirective
   ]
  
})
export class CommonDirectivesModule { }