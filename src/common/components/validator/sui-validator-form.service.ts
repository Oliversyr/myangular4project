import { SuiValidatorCommonService } from './sui-validator-common.service';
import { SUI_VALIDATOR_MAP, SuiValidatorRule } from './sui-validator.map';
import { TopCommon } from './../../top-common/top-common';
import { ValidatorRule } from './sui-validator';
import { CommonServices } from './../../services/groups/common-services.module';
import { Injectable } from '@angular/core';


/**
 * 表单验证服务
 * 
 * @export
 * @class SuiValidatorService
 * @extends {TopCommon}
 */
@Injectable()
export class SuiValidatorFormService extends SuiValidatorCommonService {

    constructor(
         utils: CommonServices
    ) {
        super(utils);
    }

    getValidatorRuleByNameStr(validatorNameStrs: string): ValidatorRule[] {
        if (!validatorNameStrs) {
            return null;
        }
        let ruleMethods: [string,Function][] = super.getRuleMethodsByNames(validatorNameStrs);
        let rules: ValidatorRule[] = [];
        for( let rule of ruleMethods) {
            rules.push(this.getNewValidatorRule(rule));
            
        }
        // console.debug(">>>>>",validatorNameStrs,ruleMethods, rules);
        return rules;
    }
    
    private getNewValidatorRule(rule: [string,Function]): ValidatorRule {
        let [message, ruleMethod]  = rule;
        let validatorRule: ValidatorRule = {
            rule: (jqElement, commit): boolean => {
                let value = jqElement.val();
                let flag: boolean = ruleMethod(value) ;
                // console.debug(">>>>>form valid..",flag, ruleMethod,value,ruleMethod.toString);
                if(!flag){
                    return false;
                }
                return true ;
            },
            message: message
        };
        return validatorRule;
    }


}
