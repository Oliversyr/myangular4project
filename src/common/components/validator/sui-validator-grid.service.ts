import { SuiValidatorCommonService } from './sui-validator-common.service';
import { SUI_VALIDATOR_MAP, SuiValidatorRule, SUI_VALIDATOR_PROMPT_TEMPLATE } from './sui-validator.map';
import { TopCommon } from './../../top-common/top-common';
import { ValidatorRule } from './sui-validator';
import { CommonServices } from './../../services/groups/common-services.module';
import { Injectable } from '@angular/core';

/**
 * 
 * 表格验证器
 * @export
 * @class SuiValidatorGridService
 * @extends {TopCommon}
 */
@Injectable()
export class SuiValidatorGridService extends SuiValidatorCommonService {

    constructor(
        utils: CommonServices,
    ) {
        super(utils);
    }

    /**
     * 通过验证器名获取验证器
     * @param validatorNameStrs 
     */
    getValidatorRuleByNames(validatorNameStrs: string): ((cell: any, value: number) => any) {
        let ruleMethods: [string,Function][] = super.getRuleMethodsByNames(validatorNameStrs);
        if(this.utils.arrayUtil.isEmpty(ruleMethods)) {
            this.utils.logs.throwError(`create the grid validatorRule faile, because rule menthod is empty the name=${validatorNameStrs} `);
        }
        return (cell: any, value: any): any => {
            for( let rule of ruleMethods) {
                let [message, ruleMethod]  = rule;
                let flag =  ruleMethod(value) ;
                // console.debug("<<<<<>>",flag,ruleMethod);
                if(!flag){
                    return { result: false, message: message};
                }
            }
            return true ;
        } ;
    }
}
