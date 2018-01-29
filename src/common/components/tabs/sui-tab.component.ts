import {
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SuiTabSetComponent } from './sui-tabset.component';

@Component({
  selector: 'sui-tab',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles  : [],
  host: {
    '[class.ant-tabs-tabpane]': 'true'
  }
})
export class SuiTabComponent implements OnDestroy, OnInit {
  private disabled = false;

  position: number | null = null;
  origin: number | null = null;

  @Input()
  set nzDisabled(value: boolean) {
    this.disabled = value;
  }

  get nzDisabled(): boolean {
    return this.disabled;
  }

  @Output() nzSelect = new EventEmitter();
  @Output() nzClick = new EventEmitter();
  @Output() nzDeselect = new EventEmitter();
  @ContentChild('nzTabHeading') _tabHeading: TemplateRef<void>;
  @ViewChild(TemplateRef) _content: TemplateRef<void>;

  get content(): TemplateRef<void> | null {
    return this._content;
  }

  constructor(private nzTabSetComponent: SuiTabSetComponent) {
  }

  ngOnInit(): void {
    this.nzTabSetComponent._tabs.push(this);
  }

  ngOnDestroy(): void {
    this.nzTabSetComponent._tabs.splice(this.nzTabSetComponent._tabs.indexOf(this), 1);
  }

}