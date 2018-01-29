import { SUI_VALIDATOR_MAP, SuiValidatorRule, SUI_VALIDATOR_PROMPT_TEMPLATE } from './sui-validator.map';
import { TopCommon } from './../../top-common/top-common';
import { ValidatorRule } from './sui-validator';
import { CommonServices } from './../../services/groups/common-services.module';

/**
 * 
 * 验证器通用类
 * @export
 * @class SuiValidatorCommonService
 * @extends {TopCommon}
 */
export class SuiValidatorCommonService extends TopCommon {

    constructor(
        protected utils: CommonServices
    ) {
        super();
    }

    protected getRuleMethodsByNames(validatorNameStrs: string): [string, Function][] {
        let validatorNames: string[] = validatorNameStrs.split(",");
        let rules: [string, Function][] = [];
        validatorNames.map((validatorName: string) => {
            if (this.utils.classUtil.emptyStr(validatorName)) {
                return;
            }
            rules.push(this.getRuleMethodByName(validatorName, null));
        });
        return rules;
    }

    private getRuleMethodByName(validatorName: string, message: string): [string, Function] {
        let ruleMethod: Function;
        if (validatorName.startsWith("number")) {
            return this.getNumberRuleMethod(validatorName, message);
        } else if (validatorName.startsWith("len")) {
            return this.getLengthRuleMethod(validatorName, message);
        } else {
            return this.getRuleMethod(validatorName, message);
        }
    }

    /**
     * 获取动态数字验证
     * 
     * @private
     * @param {string} numberStr 
     * @param {string} message 
     * @returns {[string, Function]} 
     * @memberof SuiValidatorGridService
     */
    private getNumberRuleMethod(numberStr: string, message: string): [string, Function] {
        let numberStrs: any[] = numberStr.split("_");
        if (numberStrs.length == 1) {
            numberStrs = numberStrs.concat(0, 0);
            // this.utils.logs.throwError(`create the validatorRule faile, because len validator format must be len_min_max not rul=${numberStr}`);
        } else if (numberStrs.length == 2) {
            numberStrs = numberStrs.concat(0);
        }
        let [lenName, intLen, precision] = numberStrs;
        if (!message) {
            message = this.utils.classUtil.dynamicTemplateStr(SUI_VALIDATOR_PROMPT_TEMPLATE.NUMBER, ['intLen', 'precision'])(intLen, precision);
        }
        let ruleMethod: Function = (value: any): boolean => {
            if(this.utils.classUtil.emptyStr(value)) {
                return true;
            }
            return this.utils.classUtil.isNum(value, intLen, precision);
        }
        return [message, ruleMethod];
    }

    /**
     * 获取长度验证规则,字符串byte长度
     * numberStr格式为: len_min_max
     * @param numberStr 
     * @param message 
     */
    private getLengthRuleMethod(lengthStr: string, message: string): [string, Function] {
        let lengthStrs: any[] = lengthStr.split("_");
        if (lengthStrs.length != 3) {
            this.utils.logs.throwError(`create the validatorRule faile, because len validator format must be len_min_max not rul=${lengthStr}`);
        }
        let [lenName, min, max] = lengthStrs;
        if (!message) {
            message = this.utils.classUtil.dynamicTemplateStr(SUI_VALIDATOR_PROMPT_TEMPLATE.LEN, ['min', 'max'])(min, max);
        }
        let ruleMethod: Function = (value: any): boolean => {
            let byteLen = this.utils.classUtil.getByteLenght(value);
            return byteLen >= min && byteLen <= max;
        }
        return [message, ruleMethod];
    }

    private getRuleMethod(validatorName: string, message: string): [string, Function] {
        let suiValidatorRule: SuiValidatorRule = SUI_VALIDATOR_MAP[validatorName];
        if (!suiValidatorRule) {
            this.utils.logs.throwError(`create the validatorRule faile, because can't the rule of the name=${validatorName} in SUI_VALIDATOR_MAP `);
        }
        //如果没有则,取默认的消息提示
        message = message ? message : suiValidatorRule.message;
        if (!message) {
            this.utils.logs.throwError(`create the validatorRule faile, because undefined the message=${message};`);
        }
        if (suiValidatorRule.ruleType == "fn") {
            //函数验证 
            let fnInstance = this.getInvokeMethodByName(suiValidatorRule.ruleValue);
            if (!fnInstance) {
                this.utils.logs.throwError(`create the validatorRule faile, because InvokeMethod is null ; ruleValue=${suiValidatorRule.ruleValue}`, suiValidatorRule);
            }
            return [message, fnInstance];
        } else if (suiValidatorRule.ruleType == "map") {
            //取验证器名
            return this.getRuleMethodByName(suiValidatorRule.ruleValue, suiValidatorRule.message);
        } else if (suiValidatorRule.ruleType == "regular") {
            //正则表达式
            return this.getRegExpRuleMethod(suiValidatorRule.ruleValue, message);
        } else {
            this.utils.logs.throwError(`create the validatorRule faile, because undefined the ruleType=${suiValidatorRule.ruleType} deal code `, suiValidatorRule);
        }
    }

    private getRegExpRuleMethod(regExp: any, message: string): [string, Function] {
        let ruleMethod: Function = (value: any): boolean => {
                if(this.utils.classUtil.emptyStr(value)) {
                    return true;
                }
                return regExp.test(value);
            }
        return [message, ruleMethod];
    }

    private getInvokeMethodByName(methodNameStr: string): Function {
        let methodNames: string[] = methodNameStr.split('.');
        let methodObject: any = this;
        for (let methodName of methodNames) {
            methodObject = methodObject[methodName];
            if (!methodObject) {
                return null;
            }
        }
        if (typeof methodObject === "function") {
            return (value: any):boolean => {
                    if(this.utils.classUtil.emptyStr(value)) {
                        return true;
                    }
                    return methodObject(value);
                };
        }
        return null;
    }

    private unEmptyStr = (value: any):boolean => {
        return !this.utils.classUtil.emptyStr(value);
    }

}
