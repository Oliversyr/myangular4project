import { GridOption } from './grid-option';
import { Grid } from './grid';
import { TopCommon } from './../../top-common/top-common';

/**
 * 编辑表格信息
 */
export class GridSelection extends TopCommon {

    
    constructor(
        private grid: Grid
    ) {
        super();
    }

    /**
     * 获取表格所有行数据;
     * fields - 返回特定列值;为空则返回所有数据
     * 
     * @param {string[]} fields 
     * @returns {any[]} 
     * @memberof GridSelection
     */
    getAllRows(fields?: string[]): any[] {
        let rows = this.grid.getboundrows();
        if(!Array.isArray(fields) || fields.length == 0) {
            return rows ;
        } else {
            return this.grid.utils.arrayUtil.copyFields(rows, fields) ; 
        }
    }

    /**
     * 获取选中行数据
     * fields - 返回特定列值;为空则返回所有数据
     * @param {string[]} [fields] 
     * @returns {any[]} 
     * @memberof GridSelection
     */
    getSelectRows(fields?: string[]): any[] {
        let rowIndexs: Number[]= this.grid.getselectedrowindexes();
        let selectRows: any[] = [];
        let rows = this.grid.getboundrows();
        rowIndexs.map( rowIndex =>{
            selectRows.push(rows[rowIndex as number]);
        })
        if(!Array.isArray(fields) || fields.length == 0) {
            return selectRows ;
        } else {
            return this.grid.utils.arrayUtil.copyFields(selectRows, fields) ; 
        }
    }

    /**
     * 通过选中的单元格获取选中行号
     * fields - 返回特定列值;为空则返回所有数据
     * @returns {number[]} 
     * @memberof GridSelection
     */
    getSelectRowIndexsByCell(): number[] {
        let selectcells = this.grid.getselectedcells();
        let rowIndexs = selectcells.map(cell => cell.rowindex );
        //去重复
        return Array.from(new Set(rowIndexs)) ;
    }
    
     
}