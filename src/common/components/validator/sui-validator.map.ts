
/**
 * 验证规则接口
 */
export interface SuiValidatorRule {
    /**
     * 验证规则
     * fn 表示函数,ruleValue-函数名 
     * map 表示映射, ruleValue-SUI_VALIDATOR_MAP 键值或者其它验证器名
     * regular 表示正则表达式,ruleValue-正则表达式
     */
    ruleType: string;
    ruleValue: string;
    /**
     * 错误提示信息
     */
    message: string;
}

export const SUI_VALIDATOR_MAP = {
    required: { ruleType: "map", ruleValue: "len_1_999999", message: "不允许为空" },
    phone: { ruleType: "fn", ruleValue: "utils.classUtil.isPhone", message: "请输入正确的固定电话" },
    mobile: { ruleType: "fn", ruleValue: "utils.classUtil.isMobile", message: "请输入正确的手机号码" },
    email: { ruleType: "fn", ruleValue: "utils.classUtil.isEmail", message: "请输入正确的电子邮箱" },
    date: { ruleType: "fn", ruleValue: "utils.dateUtil.isDate", message: "请输入正确的日期格式;例如:2016-01-01" },
    unChinese: { ruleType: "fn", ruleValue: "utils.classUtil.isUnChinese", message: "请录入非中文的字符" },
    specialChar: { ruleType: "fn", ruleValue: "utils.classUtil.isSpecialChar", message: "不允许录入特殊字符" },
    packPrice: { ruleType: "map", ruleValue: "number_8_2", message: "件价录入不合理;整形不允许超8位,小数不允许超2位" },
    packQty: { ruleType: "map", ruleValue: "number_8_2", message: "件数录入不合理;整形不允许超8位,小数不允许超2位" },
    bulkPrice: { ruleType: "map", ruleValue: "number_8_4", message: "散价录入不合理;整形不允许超8位,小数不允许超4位" },
    bulkQty: { ruleType: "map", ruleValue: "number_8_4", message: "散数录入不合理;整形不允许超8位,小数不允许超4位" },
    money: { ruleType: "map", ruleValue: "number_8_2", message: "金额不合理;整形不允许超10位,小数不允许超2位" },
    cost: { ruleType: "map", ruleValue: "number_8_2", message: "进价不合理;整形不允许超8位,小数不允许超4位" }
}

/**
 * 验证提示模板
 */
export const SUI_VALIDATOR_PROMPT_TEMPLATE = {
    NUMBER: "数字录入错误:整形部分长度不允许超过${intLen},小数不能超过${precision}" ,
    LEN: "长度最小为${min},最大为${max}" 
}