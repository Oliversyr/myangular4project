import { SuiValidatorFormService } from './sui-validator-form.service';
import { ValidatorRule } from './sui-validator';
import { TopCommon } from './../../top-common/top-common';
import { Directive, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';


/**
 * validator
 * 
 */
@Directive({
    selector: '[suiRules]'
})
export class RulesDirective extends TopCommon implements OnInit, AfterViewInit, OnDestroy {

    @Input("suiRules") rules: ValidatorRule[] | ValidatorRule | string | string[];

    constructor(
        private suiValidatorService: SuiValidatorFormService,
        private containerElement: ElementRef
    ) {
        super();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
    }

    getValidatorRules(): ValidatorRule[] | ValidatorRule {
        if (!this.rules) {
            return null;
        }
        let orginRules: any[];
        if (!Array.isArray(this.rules)) {
            orginRules = [this.rules];
        } else if (this.rules.length == 0) {
            return null;
        } else {
            orginRules = this.rules;
        }
        let validatorRules: ValidatorRule[] = [];
        let validatorRuleByNames: ValidatorRule[];
        orginRules.map((rule: ValidatorRule | string) => {
            if (typeof rule == "string") {
                validatorRuleByNames = this.suiValidatorService.getValidatorRuleByNameStr(rule);
                if (validatorRuleByNames) {
                    validatorRules = validatorRules.concat(validatorRuleByNames);
                }
            } else {
                if (rule.rule && rule.message) {
                    validatorRules.push(rule);
                } else {
                    console.error(" can't use sui-validator ; rule isn't ValidatorRule; validRule, valiElement", rule, this.containerElement.nativeElement);
                    throw new Error(" error stack");
                }
            }
        })
        this.setValidatorRulesId(validatorRules);
        return validatorRules;
    }

    private getValidatorRulesBName(validatorNameStrs: string): ValidatorRule[] {
        let validatorNames: string[] = validatorNameStrs.split(",");
        return null;
    }

    /**
     * 给验证器设置ID; 
     * 1. 如果没有则设置
     * 2. 如果元素没有id则随机生成一个id sui_validator_xxxx
     * @param validatorRules 
     */
    private setValidatorRulesId(validatorRules: ValidatorRule[]) {
        let rootLE: Element = this.containerElement.nativeElement;
        let id: string;
        if (['SUI-INPUT-ZORRO', 'SUI-INPUT'].indexOf(rootLE.tagName) !== -1) {
            rootLE = rootLE.querySelector("input");
        } else if (['SUI-SELECT'].indexOf(rootLE.tagName) != -1) {
            rootLE = rootLE.querySelector("div");
        }
        id = rootLE.getAttribute("id");
        if (!id) {
            id = "sui_validator_" + Math.random().toString(36).slice(2);
            rootLE.setAttribute("id", id);
        }
        if (validatorRules && validatorRules.length != 0) {
            validatorRules.map(rule => {
                rule.input = "#" + id;
                if (!rule.action) {
                    rule.action = "keyup, blur";
                }
            });
        }
    }


}