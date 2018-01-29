import { TopCommon } from './../../top-common/top-common';
import { Injectable } from '@angular/core';
import { isObject } from 'util';


/**
 * @author liurong
 * @date 2017-08-02
 * @notes 对象管理类:
 * 包含: 字符串、数字等
 */
@Injectable()
export class ClassUtil extends TopCommon {

    constructor(
    ) {
        super();
    }

    /**
     * 复制对象(可以指定某几个属性) 
     * @param origin 源对象
     * @param {string[]=} fields 复制的属性 空的话,则复制所有属性
     * @returns newObject 返回新对象; 如果不存在,则返回null ;
     */
    clone(origin: Object | Array<any>, fields?: string[]) {
        if (!origin || typeof origin !== "object") {
            return null;
        }

        let newObject;
        if (Array.isArray(origin)) {
            //数组复制
            if (origin.length == 0) {
                return origin;
            }
            //
            newObject = [];
            origin.forEach(item => {
                newObject.push(this.clone(item, fields));
            });
            return newObject
        } else {
            // 时间对象 update on 2018-01-25
            if (origin instanceof Date) {
                newObject = new Date();
                newObject.setTime(origin.getTime());
                return newObject;
            }
            //对象复制; 
            if (!fields || fields.length == 0) {
                //全部属性复制
                let originProto = Object.getPrototypeOf(origin);
                return Object.assign({}, Object.create(originProto), origin);
            }

            newObject = {};
            fields.forEach(field => {
                newObject[field] = origin[field];
            });
            return newObject;
        }
    };

    /**
     * 
     *  获取一个对象忽略属性大小写的值 ;
     * classUtil.keyIgnoreCase(value)
     * @param {Object} self - 对象
     * @param {string} key - 属性
     * @returns {Object} 返回值
     * 
     */
    keyIgnoreCase(self, key: string) {
        if (typeof self[key] !== "undefined") {
            return;
        }
        for (var orignKey in self) {
            if (orignKey.toUpperCase() == key.toUpperCase()) {
                return self[orignKey];
            }
        }
        return
    }

    /**
     * 判断值是否存在 
     * @param value 
     * @returns undefined,null 返回true; 其它false
     */
    notExits(value: any): boolean {
        return (typeof value === "undefined" || value === null)
    }

    /**
     * 空字符串
     * @param value 
     * @returns undefined,null,空串,纯空格 返回 true; 其它 false
     */
    emptyStr(value: any): boolean {
        if(typeof value === "undefined" || value === null) {
            return true ;
        }
        return /^\s*$/.test(value);
    }

    /**
     * 判断是否为整形 
     * @param value 
     * @returns 整形 返回true; 其它false
     */
    isInt(value: any, intLen?: number): boolean {
        intLen = intLen ? intLen : 9;
        let reg = new RegExp("^-?\\d{1," + intLen + "}?$");
        return /^-?\d{1,9}?$/.test(value);
    }

    /**
     * 判断是否为数字型 
     * @param value 
     * @returns 数字型 返回true; 其它false
     */
    isNum(value: any, intLen?: number, precision?: number): boolean {
        intLen = intLen ? intLen : 16;
        if (this.notExits(precision)) {
            precision = 20;
        }
        let reg ;
        if(precision == 0) {
            reg = new RegExp("^-?\\d{1," + intLen + "}$");
        } else {
            reg = new RegExp("^(-?\\d{1," + intLen + "}){1}(\\.\\d{1," + precision + "})?$");
        }
        return reg.test(value);
    }

    /**
     * 判断是否为函数
     * @param value 
     * @returns 数字型 返回true; 其它false
     */
    isFunction(functionObj: any): boolean {
        return (typeof functionObj === "function");
    }

    /**
     * 转换整形 
     * @param value 
     * @returns 整形 返回true; 其它false
     */
    toInt(value: any): number {
        if (this.isInt(value)) {
            return parseInt(value);
        }
        return null;
    }

    /**
     * 判断是否为对象
     * 
     * @param {*} object 
     * @returns 
     * @memberof ClassUtil
     */
    isObject(object: any) {
        return typeof object === "object" && object.toString() == "[object Object]";
    }

    /**
     * 空对象判断
     * 数组、无属性都是空对象
     * 
     * @param {*} object 
     * @returns 
     * @memberof ClassUtil
     */
    isEmptyObject(object: any) {
        if(this.isObject(object)) {
            for(let key in object) {
                return false ;
            }
        }
        return true ;
    }

    /**
     * 修改对象的属性命名
     * 例如: originObject = {a: 123,b: 456} changeObjAttributeName(originObject,{a: "x",b: "y"}) 后修改为 {x: 123,y: 456}
     * 
     * @param {*} object 
     * @param {*} attributeNames 
     * @memberof ClassUtil
     */
    changeObjAttributeName(object: any, attributeNames: any):void {
        if(!this.isObject(object) || !this.isObject(attributeNames)) {
            return 
        }
        for(let key in object) {
            if(attributeNames[key]) {
                object[attributeNames[key]] = object[key];
                delete object[key];
            }
        }
    }
    

    /**
     * 转化为浮点型; 默认8位小数 
     * 
     * @param value 
     * @param {number=8} precision  
     * @returns 数字型 返回true; 其它false
     */
    toNum(value: any, precision?: number): number {
        if (this.notExits(precision)) {
            //默认8未小数
            precision = 8;
        }
        if (this.isNum(value)) {
            return parseFloat((value * 1).toFixed(precision));
        }
        return null;
    }

    /**
     * 对象比较
     * 
     * @param {any} obj1 
     * @param {any} obj2 
     * @returns {boolean} 
     * @memberof ClassUtil
     */
    eqObject(obj1: any, obj2: any): boolean {
        if (obj1 == obj2) {
            return true ;
        }
        if(!this.isObject(obj1) || !this.isObject(obj2)) {
            return false ;
        }
        try {
            return JSON.stringify(obj1) == JSON.stringify(obj2);
        } catch (error) {
            return false ;
        }
    }

    /**
     * 数字比较
     * x 等于 y
     * @param x 
     * @param y 
     */
    numEQ(x: number, y: number): boolean {
        return this.toNum(x) == this.toNum(y);
    }

    /**
     * 数字比较
     * x 小于 y
     * @param x 
     * @param y 
     */
    numLT(x: number, y: number): boolean {
        return this.toNum(x) < this.toNum(y);
    }

    /**
     * 数字比较
     * x 小于或等于 y
     * @param x 
     * @param y 
     */
    numLE(x: number, y: number): boolean {
        return this.toNum(x) <= this.toNum(y);
    }

    /**
     * 数字比较
     * x 大于 y
     * @param x 
     * @param y 
     */
    numGT(x: number, y: number): boolean {
        return this.toNum(x) > this.toNum(y);
    }

    /**
     * 数字比较
     * x 大于或等于 y
     * @param x 
     * @param y 
     */
    numGE(x: number, y: number): boolean {
        return this.toNum(x) >= this.toNum(y);
    }

    /**
     * 浮点型的舍尾保留小数点
     * @param value 
     * @param precision 需要保留小数点,默认0
     * @returns 返回舍尾的数值
     */
    numberEndOffTail(value: string | number, precision: number): number {
        //默认0
        let _value: number;
        if (typeof value === "string") {
            _value = parseFloat(value);
        } else {
            _value = value;
        }
        precision = precision || 0;
        let regStr;
        if (precision == 0) {
            //整形
            regStr = "^(-?\\d{1,16})";
        } else {
            regStr = "^(-?\\d{1,16})(\\.\\d{1," + precision + "})?";
        }
        //舍尾;
        let reg = new RegExp(regStr);
        let regResults = reg.exec(_value + "");
        // console.debug(">>>> reg, regResults, _value, precision", reg, regResults, _value, precision);
        if (regResults == null) {
            return parseFloat(value + "");
        } else {
            return parseFloat(regResults[0]);
        }
    }

    firstCapital(value: string) {
        if (value.length == 0) {
            return "";
        }
        return value.charAt(0).toLocaleUpperCase() + value.substring(1);
    }

    /**
     * 动态模板字符串
     * @param {string} template 
     * @param {object} params 
     * @returns {Function}
     */
    dynamicTemplateStr(template, paramsAlias: string[]): Function {
        return new Function(...paramsAlias, "return `" + template + "`;");
        // return new Function(...paramsAlias, "return `<span>${rowIndex}</span>`;");
    }

    /**
     * 随机生成一串字符串
     * len 默认16
     * @param {number} len 
     * @returns {string} 
     * @memberof ClassUtil
     */
    uuid(len?: number): string {
        if (this.notExits(len) || len == 0) {
            len = 16;
        }
        let uuidStr: string = "";
        while (uuidStr.length < len) {
            uuidStr += Math.random().toString(36).slice(2);
        }
        return uuidStr.slice(0, len);
    }


    /**
     * 获取字符串字节长度
     * @param str 
     */
    getByteLenght(str: any): number {
        if (!str) {
            return 0;
        }
        if(typeof str !== "string") {
            str = str.toString();
        }
        var bytesLen: number = 0 ;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
            {
                bytesLen += 1;
            }
            else {
                bytesLen += 2;
            }
        }
        return bytesLen;
    }

    /**
     * 是否为电话号码
     * @param str 
     */
    isPhone(str: string): boolean {
        if (!str) {
            return false;
        }
        return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(str);
    }

    /**
     * 是否为手机号码
     * @param str 
     */
    isMobile(str: string): boolean {
        if (!str) {
            return false;
        }

        return /^1[34578]\d{9}$/.test(str);
    }

    /**
     * 是否为email
     * @param str 
     */
    isEmail(str: string): boolean {
        if (!str) {
            return false;
        }

        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str);
    }

    /**
     * 非中文
     * @param str 
     */
    isUnChinese(str: string): boolean {
        if (!str) {
            return false;
        }

        return /[^\u4e00-\u9fa5]/.test(str);
    }

    /**
     * 是否特殊字符
     * @param str 
     */
    isSpecialChar(str: string): boolean {
        if (!str) {
            return false;
        }

        return str.indexOf('`') != -1;
    }

    /*
	 *	四舍五入方法  传入2个字段 value是需要处理的值 roundDeci 四舍五入到第几位
	 */
    roundControl(value,roundDeci){
    	try{
		var roundDeciParm =  Math.pow(10,roundDeci)
		return Math.round(value*roundDeciParm)/roundDeciParm;
    	}catch(e){
    		return '数据异常';
    	}
	}

    /**
	 * 数量转为散数,件数 使用 qtyTranBulkPack(bulkQty,packUnitQty)
	 * @param {Object} bulkQty
	 * @param {Object} packUnitQty
	 * return{
	 * 	bulkQty,
	 * packQty
	 * }
	 */
	qtyTranBulkPack(bulkQty, packUnitQty) {
		bulkQty = this.roundControl(bulkQty,4);
		bulkQty = parseFloat(bulkQty.toFixed(8));
		let diret = bulkQty > 0 ? 1 : -1;
		bulkQty = Math.abs(bulkQty);
		packUnitQty = packUnitQty * 1;
		if (packUnitQty == 0) {
			console.error("数量转为散数,件数异常  err: packUnitQty 不允许为0 ");
			return;
        }
        
        interface QtyInfo {
            bulkQty: any;
            packQty: number;
            abnormalMsg?: string;
        }

		if (packUnitQty == 1) {
			let qtyInfo: QtyInfo = {
				bulkQty: 0,
                packQty: parseInt(bulkQty),
			};
			qtyInfo.bulkQty = bulkQty - qtyInfo.packQty;
			qtyInfo.bulkQty = (qtyInfo.bulkQty.toFixed(8)) * diret;
			qtyInfo.packQty = qtyInfo.packQty * diret;
			
			if(isNaN(qtyInfo.bulkQty)){
		   	 qtyInfo.abnormalMsg = '数据异常';
			}

			return qtyInfo;
		}
		let qtyInfo: QtyInfo = {
			bulkQty: bulkQty,
			packQty: 0,
        };
        
		if (bulkQty < packUnitQty) {
			qtyInfo.bulkQty = qtyInfo.bulkQty * diret;
			qtyInfo.packQty = qtyInfo.packQty * diret;

			if(isNaN(qtyInfo.bulkQty)){
		   	 qtyInfo.abnormalMsg = '数据异常';
			}
			return qtyInfo;
		}
		var myQty = qtyInfo.bulkQty * 1.00 / packUnitQty;
		myQty = parseFloat(myQty.toFixed(8));
		qtyInfo.packQty = Math.floor(myQty);
		//		var extraQty = bulkQty - qtyInfo.packQty*packUnitQty ;
		//		//如果件装数小于0;需要考虑 
		//		if(extraQty>=packUnitQty){
		//			var myQty1 = extraQty *1.00/packUnitQty ; 
		//			qtyInfo.packQty = qtyInfo.packQty*1+Math.floor(myQty1);
		//		}
		//重新计算散数
		qtyInfo.bulkQty = bulkQty * 1 - qtyInfo.packQty * packUnitQty;

		//保留精度 
		var max_preci_reg = /\.\d{9,}/;
		if (max_preci_reg.test(qtyInfo.bulkQty)) {
			qtyInfo.bulkQty = qtyInfo.bulkQty.toFixed(8);
			qtyInfo.bulkQty = parseFloat(qtyInfo.bulkQty);
		}
		qtyInfo.bulkQty = qtyInfo.bulkQty * 1.0;
		qtyInfo.packQty = qtyInfo.packQty * 1;
		//其中散数保留四位四舍五入
		qtyInfo.bulkQty =  qtyInfo.bulkQty * diret;
		qtyInfo.packQty = qtyInfo.packQty * diret;
		//异常情况下
		if(isNaN(qtyInfo.bulkQty)){
		    qtyInfo.abnormalMsg = '数据异常';
		}
		return qtyInfo;
	}


}