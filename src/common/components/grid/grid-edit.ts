import { GridColumnDef } from './grid-column';
import { GridOption } from './grid-option';
import { Grid } from './grid';
import { TopCommon } from './../../top-common/top-common';

/**
 * 编辑表格信息
 */
export class GridEdit extends TopCommon {


    constructor(
        private grid: Grid
    ) {
        super();
    }

    /**
     * 设置列的编辑标志
     * @param columnDefs 
     */
    setColumnEditSigns(columnDefs: GridColumnDef[]) {
        columnDefs.map( col => {
            if(col.editable !== false) {
                // col.classname = "sui-grid-edit-title";
                col.text = '<span class="sui-grid-edit-title"></span>' + col.text ;
            }
        })
    }

    /**
     * 获取提交到服务端数据
     */
    getSubmitServerData() {
        return this.grid.selection.getAllRows(this.grid.gridEditOption.submitServerFields);
    }

    /**
     * 添加行
     * 如果需要表格中间插入行,选中需要插入行的第一列就行
     * @param {Array|object} data  - 出入数据,可以为数组或者行对象
     * @param {number=} rowPosition - 插入位置
     */
    addRows(data: any): void {
        console.log(" grid add row", data);
        this.chooseAddRowMode(data, this.getAddPosition());
    }

    /**
     * 修改行
     * @param {Array|object} data  - 需要修改的行数据
     */
    updateRows(data: any): void {
        this._updateRows(data);
    }

    /**
      * 通过rowid 删除 行;
      * @param rowIds 
      */
    delRowsByRowIds(rowIds: String | number | Array<String | number>): void {
        this._delRowsByRowIds(rowIds);
    }

    /**
      * 通过 rowIndex 删除行;
      * @param rowIndexs 
      */
    delRows(rowIndexs: number | Array<number>): void {
        this._delRows(rowIndexs);
    }

    private getAddPosition(): number {
        let selectcells = this.grid.getselectedcells();
        let rowindex: number ;
        //选中首行的才允许中间插入;
        if(selectcells.length !=0 ) {
            let selectFirstCells = selectcells.filter( _cell => _cell.datafield == "$$rowIndex");
            if(selectFirstCells.length !=0 ) {
                 //存在多列选中第一列,取第一个列的行号
                rowindex = selectFirstCells[0].rowindex ;
            }
        }
        return rowindex ;
    }

    private chooseAddRowMode(data: any, beforeInsertRowIndex?: number | string): void {
        if (!data || typeof data !== "object"
            || (Array.isArray(data) && data.length == 0)) {
            //无数据
            return;
        }

        let rows: any[] = Array.isArray(data) ? data : [data];
        if (rows.length != 1) {
            //插入多行
            this.addMultRows(rows, beforeInsertRowIndex);
        } else {
            //单行插入
            this.addSingleRow(rows[0], beforeInsertRowIndex);
        }
    }

    private addMultRows(rows: any[], beforeInsertRowIndex: number | string): void {
        let _newRows = this.filterDuplicateRow(rows);
        if (!_newRows || _newRows.length == 0) {
            return;
        }
        this.execAddRow(_newRows, beforeInsertRowIndex);
    }

    /**
     * 过滤重复的行
     */
    private filterDuplicateRow(newRows: any[]): any[] {
        if (newRows.length == 0) {
            return null;
        }
        let rows: any[] = this.grid.getboundrows();
        if (!Array.isArray(rows) || rows.length == 0) {
            return newRows;
        }
        return newRows.filter(newRow => !this.checkItemIsExists(newRow, rows));
    }

    private checkItemIsExists(newRow: any, rows: any[]): boolean {
        return this.getExistsRow(newRow, rows);
    }

    private getExistsRow(newRow: any, rows: any[]): any {
        if (!this.grid.gridEditOption.duplicateRowFields || this.grid.gridEditOption.duplicateRowFields.length == 0) {
            //不定义重复列; 返回空
            return null;
        }
        let oldRow: any;
        checkRow: for (let row of rows) {
            for (let filed of this.grid.gridEditOption.duplicateRowFields) {
                if (row[filed] != newRow[filed]) {
                    continue checkRow;
                }
            }
            oldRow = row;
            break;
        }
        return oldRow;
    }

    private addSingleRow(newRow: any, beforeInsertRowIndex: number | string) {
        let rows = this.grid.getboundrows();
        if (!Array.isArray(rows) || rows.length == 0) {
            this.execAddRow(newRow, beforeInsertRowIndex);
            return;
        }
        let oldRow: any = this.getExistsRow(newRow, rows);
        //行不重复
        if (!oldRow) {
            this.execAddRow(newRow, beforeInsertRowIndex);
            return ;
        }
        //处理重复行
        this.dealDuplicateRow(newRow, oldRow, beforeInsertRowIndex);
    }

    private dealDuplicateRow(newRow: any, oldRow: any, beforeInsertRowIndex: number | string) {
        let promptTemplate = this.grid.utils.classUtil.dynamicTemplateStr(this.grid.gridEditOption.promptTemplate, ["row"])(oldRow);
        this.grid.el_alert.open(promptTemplate).subscribe((resultCode: string) => {
                console.debug(">>>> the modal duplicate goods resultCode=>", resultCode);
                this.duplicateRowCallBack(resultCode, newRow, oldRow, beforeInsertRowIndex);
            });
    }

    private duplicateRowCallBack(dealCode: string, newRow: any, oldRow: any, beforeInsertRowIndex: number | string) {
        switch (dealCode) {
            case 'NONE':
            default:

                break;
            case 'ADD':
                this.addItem(newRow, beforeInsertRowIndex);
                break;
            case 'COVER':
                this.coverItem(newRow, oldRow);
                break;
            case 'CUMULATE':
                this.cumulateItem(newRow, oldRow);
                break;
        }
    }

    private addItem(newRow: any, beforeInsertRowIndex: number | string) {
        this.execAddRow(newRow, beforeInsertRowIndex);
    }

    private coverItem(newRow: any, oldRow: any) {
        this.grid.gridEditOption.coverFields.map(field => oldRow[field] = newRow[field]);
        this.updateRows(oldRow);
    }
    private cumulateItem(newRow: any, oldRow: any) {
        this.grid.gridEditOption.cumulateFields.map(field => oldRow[field] = this.grid.utils.classUtil.toNum(oldRow[field] * 1 + newRow[field] * 1));
        this.updateRows(oldRow);
    }

    private execAddRow(rows: any[], beforeInsertRowIndex?: number | string): void {
        console.log(" grid - execAddRow add row", rows,beforeInsertRowIndex);
        
        if (beforeInsertRowIndex > 0) {
            //中间插入行
            this.addRowsInMiddle(rows, beforeInsertRowIndex);
            return;
        }
        rows = !Array.isArray(rows) ? [rows] : rows;
         let rowBeforeAddFlag: boolean;
        this.grid.beginupdate();
        let rowPosition: string = beforeInsertRowIndex == 0 ? "first" : "last";
        for (let row of rows) {
            //插入前处理;如果返回false 不插入;
            if (typeof this.grid.gridOption.rowBeforeAdd === "function") {
                rowBeforeAddFlag = this.grid.gridOption.rowBeforeAdd(row);
                if (rowBeforeAddFlag !== false) {
                    this.grid.addrow(null, row, rowPosition);
                }
            } else {
                this.grid.addrow(null, row, rowPosition);
            }
        }
        this.grid.endupdate();
        setTimeout(() => {
            console.log(" grid - onafter add rows-->", this.getSubmitServerData());
        }, 1000);
    }

    private _updateRows(data: any): void {
        if (!data) {
            return;
        }
        let rows: any[];
        rows = !Array.isArray(data) ? [data] : data;
        if (rows.length == 0) {
            return;
        }
        rows.map(row => {
            this.grid.updaterow(row.uid, row);
        });
    }

    private _delRowsByRowIds(rowIds: String | number | Array<String | number>): void {
        if (rowIds == null || typeof rowIds == "undefined") {
            return;
        }
        this.grid.deleterow(rowIds as any);
    }


    private _delRows(rowIndexs: number | Array<number>): void {
        if (rowIndexs == null || typeof rowIndexs == "undefined") {
            return;
        }
        if (!Array.isArray(rowIndexs)) {
            rowIndexs = [rowIndexs];
        }
        let rowids = rowIndexs.map(rowIndex => this.grid.getrowid(rowIndex));
        this.grid.deleterow(rowids);
    }

    /**
     * 中间插入行
     * @param data 
     * @param beforeInsertRowIndex 
     */
    private addRowsInMiddle(data: any, beforeInsertRowIndex?: number | string) {
        let _beforeInsertRowIndex: number = (typeof beforeInsertRowIndex == "string") ? parseInt(beforeInsertRowIndex) : beforeInsertRowIndex;
        let rows = this.grid.getboundrows();
        Array.prototype.splice.apply(rows, [beforeInsertRowIndex, 0].concat(data));
        this.grid.setData(rows);
    }

}