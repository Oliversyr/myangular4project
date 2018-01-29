export const getLocalization = (culture?: string): any => {
    let localization = null;
    switch (culture) {
        case 'zh-CN':
        default:
            localization =
                {
                    // separator of parts of a date (e.g. '/' in 11/05/1955)
                    '/': '/',
                    // separator of parts of a time (e.g. ':' in 05:44 PM)
                    ':': ':',
                    // the first day of the week (0 = Sunday, 1 = Monday, etc)
                    firstDay: 0,
                    days: {
                        names: ["日", "一", "二", "三", "四", "五", "六"],
                        namesAbbr: ["日", "一", "二", "三", "四", "五", "六"],
                        namesShort: ["日", "一", "二", "三", "四", "五", "六"]
                    },
                    months: {
                        // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
                        names: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""],
                        namesAbbr: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ""]
                    },
                    // AM and PM designators in one of these forms:
                    // The usual view, and the upper and lower case versions
                    //      [standard,lowercase,uppercase]
                    // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
                    //      null
                    AM: ["上午", "上午", "上午"],
                    PM: ["下午", "下午", "下午"],
                    eras: [{ "name": "公历", "start": null, "offset": 0 }],
                    twoDigitYearMax: 2029,
                    patterns: {
                        // short date pattern
                        d: 'yyyy-MM-dd',
                        // long date pattern
                        D: 'dddd, MMMM dd, yyyy',
                        // short time pattern
                        t: 'h:mm tt',
                        // long time pattern
                        T: 'h:mm:ss tt',
                        // long date, short time pattern
                        f: 'dddd, MMMM dd, yyyy h:mm tt',
                        // long date, long time pattern
                        F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
                        // month/day pattern
                        M: 'MMMM dd',
                        // month/year pattern
                        Y: 'yyyy MMMM',
                        // S is a sortable format that does not vary by culture
                        S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
                        // formatting of dates in MySQL DataBases
                        ISO: 'yyyy-MM-dd hh:mm:ss',
                        ISO2: 'yyyy-MM-dd HH:mm:ss',
                        d1: 'dd.MM.yyyy',
                        d2: 'dd-MM-yyyy',
                        d3: 'dd-MMMM-yyyy',
                        d4: 'dd-MM-yy',
                        d5: 'H:mm',
                        d6: 'HH:mm',
                        d7: 'HH:mm tt',
                        d8: 'dd/MMMM/yyyy',
                        d9: 'MMMM-dd',
                        d10: 'MM-dd',
                        d11: 'MM-dd-yyyy'
                    },
                    percentsymbol: '%',
                    currencysymbol: '¥',
                    currencysymbolposition: 'before',
                    decimalseparator: '.',
                    thousandsseparator: ',',
                    pagergotopagestring: ' 跳至 ',
                    pagershowrowsstring: '页   每页行数:',
                    pagerrangestring: ' / ',
                    pagerpreviousbuttonstring: '上一页',
                    pagernextbuttonstring: '下一页',
                    pagerfirstbuttonstring: '第一页',
                    pagerlastbuttonstring: '最后一页',
                    groupsheaderstring: '拖动一个列并将其拖放到该分组',
                    sortascendingstring: '排序 升序',
                    sortdescendingstring: '排序 降序',
                    sortremovestring: '移除 排序',
                    groupbystring: '按此列分组',
                    groupremovestring: '删除组',
                    filterclearstring: '清空',
                    filterstring: '过滤',
                    filtershowrowstring: '过滤数据:',
                    filterorconditionstring: '或',
                    filterandconditionstring: '与',
                    filterselectallstring: '(选择所有)',
                    filterchoosestring: '请选择:',
                    filterstringcomparisonoperators: ['空字符', '非空字符', '等于', '等于(区分大小写)',
                        '不包含', '不包含(区分大小写)', '开始是', '开始是(区分大小写)',
                        '结尾是', '结尾是(区分大小写)', '等于', '等于(区分大小写)', '空', '非空'],
                    filternumericcomparisonoperators: ['等于', '不等于', '小于', '小于 或 等于', '大于', '大于 或 等于', '空', '非空'],
                    filterdatecomparisonoperators: ['等于', '不等于', '小于', '小于 或 等于', '大于', '大于 或 等于', '空', '非空'],
                    filterbooleancomparisonoperators: ['等于', '不等于'],
                    validationstring: '输入值不合理',
                    emptydatastring: '记录为空',
                    filterselectstring: '选择过滤条件',
                    loadtext: '加载中...',
                    clearstring: '清空',
                    todaystring: '今天',
                    //平均值显示
                    aggregate: {
                        min: '最小值',
                        max: '最大值',
                        count: '总数',
                        avg: '平均值',
                        product: '乘积',
                        stdevp: 'stdevp',
                        stdev: 'stdev',
                        varp: 'varp',
                        sum: '合计'
                    }
                }
            break;
    }
    return localization;
}