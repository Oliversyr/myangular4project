import { SuiValidatorFormService } from './sui-validator-form.service';
import { RulesDirective } from './sui-rules.directive';
import { ValidatorRule } from './sui-validator';
import { Observable } from 'rxjs/Observable';
import { Component, ElementRef, NgModule, NO_ERRORS_SCHEMA, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit, ContentChildren, AfterContentInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
// import { jqxValidatorComponent } from '../../../apps/demos/jqwidgets/jqwidgets-ts/angular_jqxvalidator';

export interface ValidatorRule {
    input?: string;
    message?: string;
    action?: string;
    rule?: string | any;
    position?: string;
    hintRender?: any;
}

/**
 * validator
 * 
 */
@Component({
    selector: "[sui-validator],sui-validator",
    template: '<div><ng-content></ng-content></div>'
})
export class SuiValidator extends jqxValidatorComponent implements OnInit, AfterViewInit,AfterContentInit, OnDestroy {

    private passSubscribe: any;
    @ContentChildren(RulesDirective,{descendants:true}) childrenRules: QueryList<RulesDirective>;

    constructor(
        containerElement: ElementRef
    ) {
        super(containerElement);
        this.attrHintType = "label";
        this.attrAnimationDuration = 0;
    }

    /**
     * 
     * 验证是否通过
     * @returns {Observable<boolean>} 
     * @memberof SuiValidator
     */
    pass(htmlElement?: any): Observable<boolean> {
        // this.validate();
        // return new Observable(subscribe => {
        //     this.passSubscribe = subscribe;
        // })

        return new Observable(observer => {
            let isPass = this.host.jqxValidator(!!htmlElement ? 'validateInput' : 'validate', htmlElement);
            observer.next(isPass);
        })
    }

    ngAfterViewInit() {
        this.scranRules();
    }

    ngAfterContentInit() {
        // console.debug(">>>>>>>>>>>sui-validator-01-ngAfterContentInit-", this.childrenRules);
        // setTimeout(() => {
            // console.debug(">>>>>>>>>>>sui-validator-02-ngAfterContentInit-", this.childrenRules);
        // },2000);
    }

    ngOnDestroy() {

    }

    private scranRules() {
        // console.debug(">>>>>>>>>>>>>>>>>>>>scranRules-childrenRules", this.childrenRules, this.attrRules);
        let rules = [];
        this.childrenRules.map((rule: RulesDirective) => {
            rules = rules.concat(rule.getValidatorRules());
        });
        if(this.attrRules) {
            rules = rules.concat(this.attrRules);
        }
        // console.debug("all the rules....", rules);
        // console.debug("this.attrRules....", this.attrRules);
        this.setRules(rules);
    }

    /**
     * 设置验证规则,
     * 
     * @param rules 
     */
    private setRules(rules: ValidatorRule[]) {
        this.host.jqxValidator("rules", rules);
    }

    private subscribeValidateResult(isPass: boolean) {
        if (!this.passSubscribe) {
            return;
        }
        this.passSubscribe.next(isPass);
        this.passSubscribe.complete();
    }

    // private isPass: boolean ;



    __wireEvents__(): void {
        this.host.on('validationError', (eventData: any) => {
            this.onValidationError.emit(eventData);
            this.subscribeValidateResult(false);
        });
        this.host.on('validationSuccess', (eventData: any) => {
            this.onValidationSuccess.emit(eventData);
            this.subscribeValidateResult(true);
        });
    }

}


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        SuiValidator
        , RulesDirective
    ],
    declarations: [
        jqxValidatorComponent,
        SuiValidator
        , RulesDirective
    ],
    providers: [
        SuiValidatorFormService
    ]

    , schemas: [NO_ERRORS_SCHEMA]
})
export class SuiValidatorModule { }