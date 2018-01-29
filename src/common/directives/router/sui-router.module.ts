import { SuiRouterService } from './sui-router.sevice';
import { NgModule } from '@angular/core';
import {  SuiRouterLinkDirective, SuiRouterLinkWithHrefDirective } from './sui-router.directive';
/**
 * @author liurong
 * @create date 2017-11-28 09:59:14
 * @modify date 2017-11-28 10:01:24
 * @desc 
 * 自定义路由模块
 * 1. 包含路由相关的指令、组件等
*/

/**
 * 常用指令模块
 */
@NgModule({
    imports: [ 
      
      
     ],
     declarations:[
      SuiRouterLinkDirective,
      SuiRouterLinkWithHrefDirective
     ],
     exports: [
        SuiRouterLinkDirective,
        SuiRouterLinkWithHrefDirective
     ],
     providers: [
        SuiRouterService
     ]
    
  })
  export class SuiRouterModule { }