import { TopCommon } from './../../top-common/top-common';
import { ClassUtil } from './class-util';
import {  Injectable } from '@angular/core';


/**
 * @author liurong
 * @date 2017-08-02
 * @notes 日期管理工具
 */
@Injectable()
export class DateUtil extends TopCommon {
    
    constructor(
        private classUtil: ClassUtil
    ) {
        super();
    }
    
        /**
     *   判断字符串是否为日期格式
     *  DateUtilisDate(value)
     * @param {Object} value - 需要判断的值
     * @returns {boolean} 返回值 - true-是,false- 否 ;
     */
    isDate(dateStr ): boolean {
        if(!dateStr){
            return false ;
        }
        
        if(dateStr instanceof Date) {
            return true ;
        }
        
        if(/\d{8}/g.test(dateStr)){
            //纯数字 20161212
            dateStr = dateStr.substring(0,4)+"/"+dateStr.substring(4,6)+"/"+dateStr.substring(6);
        }
        
        var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
        if(r == null){
            return false; 
        }
        var d = new Date(r[1],r[3]-1,r[4]);   
        return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
        // var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
        // return (num != 0);
    }
    
    /**
     *  字符串转正为日期
     * DateUtil.toDate(value)
     * @param {string} value -  需要转换的字符串
     * @returns {date} 日期对象 不存在则返回空null
     */
    toDate(value) {
        if(!value){
            return null ;
        }
        if(value instanceof Date) {
            return value ;
        }
        var newValue ;
        if(/\d{8}/g.test(value)){
            //纯数字 20161212
            newValue = value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6);
        } else {
            newValue = value.replace(/-/g,"/") ;
        }
        return new Date(newValue) ;
        
    }
    
    /**
     *  日期对象(或者日期字符串)转为为指定格式的字符串
     *  DateUtil.toStr(dateStr,fmt)
     * @param {Date|string} date -  需要转换的日期或字符串
     * @param {string} fmt - 返回的日期字符串格式;默认: yyyy-MM-dd  
     * @returns {string} 日期字符串  非法日期返回空串
     */
    toStr(dateStr,fmt?: string) {
        if(!dateStr){
            return "" ;
        }
        
        let date: Date ;
        if(typeof dateStr === "string"){
            date =  this.toDate(dateStr);
        } else {
            date = dateStr;
        }
        
        fmt = fmt || "yyyy-MM-dd" ;
        var o = {           
        "M+" : date.getMonth()+1, //月份           
        "d+" : date.getDate(), //日           
        "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时           
        "H+" : date.getHours(), //小时           
        "m+" : date.getMinutes(), //分           
        "s+" : date.getSeconds(), //秒           
        "q+" : Math.floor((date.getMonth()+3)/3), //季度           
        "S" : date.getMilliseconds() //毫秒           
        };           
        var week = {           
        "0" : "/u65e5",           
        "1" : "/u4e00",           
        "2" : "/u4e8c",           
        "3" : "/u4e09",           
        "4" : "/u56db",           
        "5" : "/u4e94",           
        "6" : "/u516d"          
        };           
        if(/(y+)/.test(fmt)){           
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));           
        }           
        if(/(E+)/.test(fmt)){           
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);           
        }           
        for(var k in o){           
            if(new RegExp("("+ k +")").test(fmt)){           
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
            }           
        }           
        return fmt;           
    }
    
    /**
     *  日期比较:date1 是否大于date2 ;如果date2为空;则默认跟当天比较
     * DateUtil.greater(date1,date2)
     * @param {Date|string} date1 -  需要比较的日期1
     * @param {Date|string=} [date2=当天] - 需要比较的日期2
     * @returns {boolean} true-date1大于date2
     */
    greater(date1,date2){
        if(!date2){
            //默认当天
            date2 = new Date();
            //不需要比较时间
            date2.setHours(0);
            date2.setSeconds(0);
            date2.setMinutes(0);
        }
        
        var extra = this.calculate(date1,date2,'MILI-SECOND');
        return extra > 0;
        
    }
    
    /**
     * 
     *  日期比较:date1 是否大于等于date2 ;如果date2为空;则默认跟当天比较
     *  DateUtil.greaterEqual(date1,date2)
     * @param {Date|string} date1 -  需要比较的日期1
     * @param {Date|string=} [date2=当天] - 需要比较的日期2
     * @returns {boolean} true-date1大于date2
     */
    greaterEqual(date1,date2){
        if(!date2){
            //默认当天
            date2 = new Date();
            //不需要比较时间
            date2.setHours(0);
            date2.setSeconds(0);
            date2.setMinutes(0);
        }
        
        var extra = this.calculate(date1,date2,'MILI-SECOND');
        return extra >= 0;
    }
    
    /**
     * 
     *  DateUtil.calculate
     *   日期计算:date1,date2相差多少天(小时/分钟/秒/毫秒)
     *  DateUtil.calculate(date1,date2)
     * @param {Date|string} date1 -  需要比较的日期1
     * @param {Date|string=} [date2=当天] - 需要比较的日期2
     * @param {string=} [returnType=DAY] - 返回数据类型:DAY-天数;HOUR-小时;MINUTE-分;SECOND-秒;MILI-SECOND-毫秒;
     * @returns {int} 相差的天数
     */
    calculate(date1,date2,returnType){
        if(!returnType){
            //默认当天
            returnType = "DAY" ;
        }
        
        if(typeof date1 === "string"){
            date1 = this.toDate(date1);
        }
        if(typeof date2 === "string"){
            date2 = this.toDate(date2);
        }
        
        var extra = date1.getTime() - date2.getTime();
        
        if(returnType == "MILI-SECOND") {
            
        } else if(returnType == "HOUR") {
            extra = extra/3600000;
        } else if(returnType == "MINUTE") {
            extra = extra/60000;
        } else if(returnType == "SECOND") {
            extra = extra/1000;
        } else {
            //默认返回天数
            extra = Math.ceil(extra/86400000);
        }
        
        return extra ;
        
    }
    /**
     * 
     *  DateUtil.calculateDate
     *   计算多少天或月或年后的日期
     *  DateUtil.calculateDate(date1,value,calculateType)
     * @param {Date|string=} [date1=当天] -  开始日期
     * @param {int} value - 增加的值(天/月/年) 支持正负数 
     * @param {string=} [calculateType=DAY] - 计算类型:DAY-天,MONTH-月,YEAR-年;
     * @returns {string} 返回计算后的日期(字符串形式);
     */
    calculateDate(date1,value,calculateType){
        if(!date1) {
            //默认当天
            date1 = new Date();
        } else {
            date1 = this.toDate(date1)
            if(date1 == "") {
                console.error("计算多少天或周或月或年后的日期[DateUtil.calculateDate],错误;date1日期不合理",date1,value,calculateType)
                return "" ;
            }
        }
        
        var afterDate = this.classUtil.clone(date1) as Date;
        if(calculateType == "MONTH") {
            afterDate.setMonth(date1.getMonth()+value*1);
            afterDate.setDate(afterDate.getDate()-1);
        } else if(calculateType == "YEAR") {
            afterDate.setFullYear(date1.getFullYear()+value*1);
            afterDate.setDate(afterDate.getDate()-1);
        } else {
            afterDate.setDate(date1.getDate()+value*1);
        }
        return this.toStr(afterDate) ;
    
    }
    /**
     * 
     *  DateUtil.getGetRangeDatesByType
     *   通过类型(本日,本周,上周,本月,上月,本年等)获取日期方法
     *  DateUtil.getGetRangeDatesByType(date1,value,calculateType)
     * @param {Date|string=} [date1=当天] -  开始日期
     * @param {string=} [dateType=DAY] - 类型:DAY-天,WEEK-周,MONTH-月,YEAR-年;
     * @param {int=} [value=0] - 值 0-表示(本日/本周/本月/本年),负数N表示(前N日/前N周/前N月/前N年),整数N  表示(后N日/下N周/下N月/下N年)
     * @returns {Object} dates 返回日期范围 dates.beginDate-开始日期(字符串),dates.endDate-结束日期(字符串)
     */
    getGetRangeDatesByType(date1,dateType,value){
        var dates = {
            beginDate:undefined,
            endDate:undefined,
        };
        if(!date1) {
            //默认当天
            date1 = new Date();
        } else {
            date1 = this.toDate(date1)
            if(date1 == "") {
                console.error("通过类型获取日期方法[DateUtil.getGetRangeDatesByType],错误;date1日期不合理",date1,dateType,value)
                return dates;
            }
        }
        value = isNaN(value)?0:value*1;
        
        if(dateType === "WEEK") {
            //按周
            // date1.setDate(date1.getDate()+value*7);
            
            // dates.beginDate = this.classUtil.clone(date1) as Date;
            // //国外的星期天 为0
            // var _day = date1.getDay() === 0 ? 7 : date1.getDay();
            // dates.beginDate.setDate(date1.getDate() - _day + 1);
            // dates.endDate = this.classUtil.clone(dates.beginDate) as Date; 
            // dates.endDate.setDate(dates.beginDate.getDate() + 6);

            // update on 2018-01-25
            dates.beginDate = this.classUtil.clone(date1) as Date;
            if (value === 0) {
                // 本周
                // getDay() 从 Date 对象返回一周中的某一天 (0 ~ 6)
                // setDate() 设置 Date 对象中月的某一天 (1 ~ 31)
                let dayOfWeek = date1.getDay() === 0 ? 7 : date1.getDay();
                dates.beginDate.setDate(date1.getDate() - dayOfWeek + 1);
                dates.endDate = this.classUtil.clone(dates.beginDate) as Date;
                dates.endDate.setDate(dates.beginDate.getDate() + 6);
            } else {
                // 按周为单位计算 注意间隔
                let dayOfWeek = date1.getDay() === 0 ? 7 : date1.getDay();
                if (value > 0) {
                    dates.beginDate.setDate(date1.getDate() - dayOfWeek + 8);
                    let rangeDay = dates.beginDate.getDate() + value*7 - 1;
                    dates.endDate = this.classUtil.clone(dates.beginDate) as Date;
                    dates.endDate.setDate(rangeDay);
                } else {
                    dates.endDate = this.classUtil.clone(date1) as Date;
                    dates.endDate.setDate(date1.getDate() - dayOfWeek);
                    let rangeDay = dates.endDate.getDate() + value*7 + 1;
                    dates.beginDate.setDate(rangeDay);
                }
            }
            
        } else if(dateType === "MONTH") {
            date1.setMonth(date1.getMonth()+value);
            //按月
            dates.beginDate = this.classUtil.clone(date1) as Date;
            dates.beginDate.setDate(1);
            dates.endDate = new Date(dates.beginDate.getFullYear(),dates.beginDate.getMonth()+1,0);
        } else if(dateType === "YEAR") {
            //按年
            var currentYear = date1.getFullYear()+value;
            dates.beginDate = new Date(currentYear,0,1);
            dates.endDate = new Date(currentYear,12,0);
        } else if(dateType === "30Days") {
            date1.setMonth(date1.getMonth()+value);
            //最近30天
            dates.beginDate = this.classUtil.clone(date1) as Date;
            var today = date1.getDate();
            dates.beginDate.setDate(today);

            var date2 = new Date();
            dates.endDate = this.classUtil.clone(date2) as Date;
            dates.endDate.setDate(dates.endDate.getDate());
        } else if(dateType === "7Days") {
            var thisDate = new Date();
            dates.beginDate = this.classUtil.clone(thisDate) as Date;
            date1.setMonth(date1.getMonth()+value);
            //最近7天
            let today = thisDate.getDate();
            if(today>=8){
                // dates.beginDate.setDate(today-7);
                // update on 2018-01-25
                // 包括当天的，间隔6天
                dates.beginDate.setDate(today-6);
            } else {
                // var dayDiff = 7 - today; 
                // update on 2018-01-25
                // 包括当天，间隔6天
                var dayDiff = 6 - today;
                var lastMonth = date1.getMonth()+1;
                var thisYear = date1.getFullYear();
                var date3 = new Date(thisYear,lastMonth,0);
                dates.beginDate = this.classUtil.clone(date3) as Date;
                dates.beginDate.setDate(date3.getDate() - dayDiff);
            }

            var date2 = new Date();
            dates.endDate = this.classUtil.clone(date2) as Date;
            dates.endDate.setDate(dates.endDate.getDate());
        } else {
            //按天
            dates.beginDate = this.classUtil.clone(date1) as Date;
            dates.endDate = this.classUtil.clone(date1) as Date;
            dates.endDate.setDate(dates.endDate.getDate()+value);
        }
        dates.beginDate = this.toStr(dates.beginDate);
        dates.endDate = this.toStr(dates.endDate);
        return dates ;
        
    }

}