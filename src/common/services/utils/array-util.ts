import { TopCommon } from './../../top-common/top-common';
import { Injectable } from '@angular/core';


/**
 * @author liurong
 * @date 2017-11-03
 * @notes 数组管理类:
 * 包含: 
 */
@Injectable()
export class ArrayUtil extends TopCommon {

    constructor(
    ) {
        super();
    }

    /**
     * 复制指定属性的值
     * 不指定复制属性则返回空
     * @param {Array}rows 源对象
     * @param {string[]} fields 复制的属性 
     * @returns newObject 返回新对象; 如果不存在,则返回null ;
     */
    copyFields(rows: any[], fields: string[]): any[] {
        if (!rows || rows.length == 0 ||
            !fields || fields.length == 0) {
            return null;
        }
        return rows.map(row => {
            let newRow = {};
            fields.map(filed => newRow[filed] = row[filed]);
            return newRow;
        });
    }

    /**
     * 判断一个数组是否为空
     * 
     * @param {any[]} rows 
     * @returns {boolean} 
     * @memberof ArrayUtil
     */
    isEmpty(rows: any[]): boolean {
        return !rows || rows.length == 0;
    };

    /**
     * 判断一个对象是否为数组
     * 
     * @param {any[]} rows 
     * @returns {boolean} 
     * @memberof ArrayUtil
     */
    isArray(array: any[]): boolean {
        if(!array) {
            return false ;
        }
        return array.constructor === Array ;
    };

    /**
     * 判断一个对象是否为非空数组
     * 长度大于0
     * 
     * @param {*} rows 
     * @returns {boolean} 
     * @memberof ArrayUtil
     */
    isNotEmptyArray(rows: any): boolean {
        return Array.isArray(rows) && rows.length != 0;
    };

    /**
     * 判断传入的参数类型
     * 
     * @param {*} arg 
     * @returns {string} 
     */
    isClass(arg) {
        if (arg === null) return "Null";
        if (arg === undefined) return "Undefined";
        return Object.prototype.toString.call(arg).slice(8, -1);
    }

    /**
     * 数组去重
     * 
     * @param {array} array 
     * @returns {array} 
     */
    unique(array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j])
                    j = ++i;
            r.push(array[i]);
        }
        return r;
    }

}