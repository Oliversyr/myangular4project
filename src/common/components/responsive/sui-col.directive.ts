import {
  Directive
} from '@angular/core';
import { SuiColComponent } from './sui-col.component';

@Directive({
  selector: '[sui-col]'
})

export class SuiColDirective extends SuiColComponent {
}
