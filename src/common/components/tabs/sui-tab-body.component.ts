import {
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector     : 'sui-tab-body',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-template [ngTemplateOutlet]="content"></ng-template>
  `,
})
export class SuiTabBodyComponent {
  @Input() content: TemplateRef<void>;
}