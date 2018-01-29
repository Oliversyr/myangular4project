import { BaseDetailService } from './../../../../../common/top-common/base-detail.service';
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, ViewChildren, QueryList, TemplateRef, Input, Output} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { TemplateDetailOption } from '../../../../../common/components/templates/template-detail';
import { RolePowerService } from './role-power.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { SuiValidator, ValidatorRule } from './../../../../../common/components/validator/sui-validator';
import { BaseDetailComponent } from '../../../../../common/top-common/base-detail.component';
import { WEIGHT_VALUE } from '../../../../../common/top-common/module-right.service';
import { Observable } from 'rxjs/Observable';

/**
 * 角色权限树模板
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    selector: 'role-power-tree',
    templateUrl: './role-power-tree.html',
    styleUrls: [ './role-power.scss' ]
})

export class RolePowerTreeComponent implements OnInit, OnChanges {

    @Input('treePowerList') treePowerList: Array<any> = [];

    @Input('parentModuleId') parentModuleId: number;

    @ViewChildren('childTree') childTree: QueryList<RolePowerTreeComponent>;

    @Output('childSelectStatus') childSelectStatus: EventEmitter<any> = new EventEmitter();

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: RolePowerService,
    ) {
        
    }

    ngOnInit() {

    }

    ngOnChanges(obj) {
        console.log('treePowerList==', obj);
        // if(obj.hasOwnProperty('treePowerList')) {

        // }
    }

    /**
     * 非权限行选择
     * @param event 
     * @param row 
     */
    firstSelect(event, row) {
        // setTimeout(() => {
            let val = event.args.checked;
            // let childTreeList = this.childTree._results
            if(val !== null) {
                row.children.forEach((item) => {
                    item.allThisPower = val;
                })
            }
            console.log(row);
            
            let data = {
                value: val,
                moduleid: this.parentModuleId
            }
            console.log(data);
            this.childSelectStatus.emit(data);
        // })
        
    }

    /**
     * 权限行全选
     * @param event 
     * @param row 
     */
    secondSelect(event, row) {
        
            let power = row.myPowerList;
            let val = event.args.checked;
            
            power.forEach((item) => {
                item.sel = val === null ? item.sel : val;
            });
            
            let data = {
                value: val,
                moduleid: this.parentModuleId
            }
            setTimeout(() => {
                this.childSelectStatus.emit(data);
            })
        
    }

    /**
     * 单个权限选择
     * @param event 
     * @param row 
     */
    thirdSelect(event, row) {
        setTimeout(() => {
            console.log(row);
            let power = row.myPowerList;
            let allSel = true;
            let noSel = true;
            
            power.forEach((item) => {
                if(item.sel) {
                    noSel = false;
                }
                if(!item.sel) {
                    allSel = false;
                }
            });
    
            row.allThisPower = allSel ? true : noSel ? false : null;
        })
        
    }

    /**
     * 子组件选择
     * @param obj 
     */
    childrenSelectStatus(obj) {
        // setTimeout(() => {
            console.log(obj, this.treePowerList);
            let power = this.treePowerList;
            let allSel = true;
            let noSel = true;

            for(let i =0; i < power.length; i++) {
                if(power[i].moduleid === obj.moduleid) {
                    if(obj.value === null) {
                        power[i].allThisPower = null;
                    } else {
                        power[i].children.forEach((item) => {
                            if(item.allThisPower === null) {
                                noSel = false;
                                allSel = false;
                            }
                            if(item.allThisPower) {
                                noSel = false;
                            }
                            if(!item.allThisPower) {
                                allSel = false;
                            }
                        })

                        power[i].allThisPower = allSel ? true : noSel ? false : null;
                        
                    }
                    break;
                }
            }
        // })
    }


    
}