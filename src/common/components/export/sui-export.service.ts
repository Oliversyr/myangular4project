import { Injectable } from '@angular/core';
import { TopCommon } from './../../top-common/top-common';

/**
 * @author xiahl
 * @date 2017-11-20
 * @notes 数据导出服务
 */

declare var jqx;

declare var jqxBaseFramework;

@Injectable()
export class SuiExportService extends TopCommon {
    constructor() {
        super();
    }

    /**
     * 生成不重复的ID
     * 引入时间戳 随机数前置 36进制 加入随机数长度控制
     * @param {number} randomLength
     * @returns {string} 
     */
    public genNonDuplicateID(randomLength) {
        return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
    }

    /**
     * 导出各种类型的数据
     * 
     * @param {array} exportData: 导出的数据
     * @param {string} exportType: 导出类型 => xls, xml, csv, tsv, html, json, pdf
     * @param {string} exportName: 导出的文件名字
     * @param {array} exportFields: 导出的字段信息
     * @returns {} 
     */
    public exportData(exportData, exportType, exportName, exportFields) {
        // 前置判断
        if (exportData.length <= 0) {
            console.error('>......exportData', '没有导出的数据');
            return false;
        };
        // 准备数据源
        let source = {
            localdata: exportData,
            datatype: "array",
            datafields: exportFields.map((item, index) => {
                return {
                    name: item.datafield,
                    type: item.type || 'string'
                }
            })
        };
        let dataAdapter = new jqx.dataAdapter(source);
        // 向文档添加导出的子节点
        let _exportId = this.genNonDuplicateID(4);
        let bodyLastChildNode = jqxBaseFramework('<div id="' + _exportId + '" style="position: absolute;opacity: 0;"></div>')[0];
        document.body.appendChild(bodyLastChildNode);
        // 生成表格数据
        let $exportId = jqxBaseFramework('#' + _exportId);
        $exportId.jqxGrid({
            width: 0,
            height: 0,
            source: dataAdapter,
            columns: exportFields
        });
        // 导出数据
        $exportId.jqxGrid('exportdata', exportType, exportName);
        // 销毁导出文档
        document.body.removeChild(bodyLastChildNode);
    }
}