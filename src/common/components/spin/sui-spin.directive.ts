import { SuiSpinService } from './sui-spin.service';
import {
  Directive,
  ElementRef,
  Input,
  OnInit, AfterViewInit, OnDestroy
} from '@angular/core';


/**
 * @author liurong
 * @create date 2017-12-06 05:59:00
 * @modify date 2017-12-06 05:59:00
 * @desc  加载层指令
 * 注意使用该指令 根元素样式位置布局必须为position=relative
*/
@Directive({
  selector: '[suiSpin]'
})

export class SuiSuiDirective {

  @Input("suiSpin") set load(load: boolean) {
    this.toggleSpinState(load);
  };
  @Input() set message(message: string) {
    this.setMessage(message);
  };

  private rootEL: HTMLElement;
  private sui_id: string ;

  constructor(
    _rootEL: ElementRef,
    private spinService: SuiSpinService
  ) {
    this.rootEL = _rootEL.nativeElement;
  }


  private setMessage(message: string) {
    let spinEle = this.getSpinElement(false);
    if (!spinEle) {
      return;
    }
    message = message ? message : "";
    spinEle.querySelector(".ant-spin-text").innerHTML = message;
  }

  private getSpinElement(generaterElIfNull: boolean): HTMLDivElement {
    let sui_id = this.sui_id ;
    let spinEle = this.rootEL.querySelector(`#${sui_id}`) as HTMLDivElement;
    
    if (!spinEle) {
      if (generaterElIfNull !== true) {
        return null;
      }
      spinEle = this.generaterSpinElement();
    }
    return spinEle;
  }

  private generaterSpinElement(): HTMLDivElement {
    let spinElement: HTMLDivElement = this.spinService.getSpinElement(this.message);
    this.sui_id = "sui-spin-"+ Math.random().toString(16).substr(2);
    spinElement.id = this.sui_id;
    this.rootEL.insertBefore(spinElement,this.rootEL.firstElementChild);
    // this.rootEL.appendChild(spinElement);
    return spinElement;
  }

  private toggleSpinState(loadState: boolean) {
    if (loadState === true) {
      this.showSpin();
    } else {
      this.hideSpin();
    }
  }

  private showSpin() {
    let spinEle = this.getSpinElement(true);
    spinEle.style.display = "block";
  }

  private hideSpin() {
    let spinEle = this.getSpinElement(false);
    if (!spinEle) {
      return;
    }
    spinEle.style.display = "none";
  }


}
