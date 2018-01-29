import { ObserversModule } from '@angular/cdk/observers';
// import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SuiTabBodyComponent } from './sui-tab-body.component';
import { SuiTabLabelDirective } from './sui-tab-label.directive';
import { SuiTabComponent } from './sui-tab.component';
import { SuiTabsInkBarDirective } from './sui-tabs-ink-bar.directive';
import { SuiTabsNavComponent } from './sui-tabs-nav.component';
import { SuiTabSetComponent } from './sui-tabset.component';

@NgModule({
  declarations: [ SuiTabComponent, SuiTabSetComponent, SuiTabsNavComponent, SuiTabLabelDirective, SuiTabsInkBarDirective, SuiTabBodyComponent ],
  exports     : [ SuiTabComponent, SuiTabSetComponent, SuiTabsNavComponent, SuiTabLabelDirective, SuiTabsInkBarDirective, SuiTabBodyComponent ],
  imports     : [ CommonModule, ObserversModule ]
})
export class SuiTabsModule {
}