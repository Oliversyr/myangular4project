import { GridColumnDef } from './grid-column';
import { GridOption } from './grid-option';
import { Grid } from './grid';
import { TopCommon } from './../../top-common/top-common';


/**
 * 编辑表格信息
 */
export class GridValidator extends TopCommon {


    constructor(
        private grid: Grid
    ) {
        super();
    }

    /**
     * 设置列的验证规则
     * validators 格式: {datafied: string|(cell: any, value: number) => boolean) }
     * 
     * @param {GridColumnDef[]} columnDef 
     * @param {*} validators 
     * @returns 
     * @memberof GridValidator
     */
    setColumnsValidator(columnDefs: GridColumnDef[], validators: any) {
        if (!columnDefs) {
            return;
        }
        validators = validators ? validators : {} ;
        let _validator;
        columnDefs.map(col => {
            //优先validators的验证器
            _validator = validators[col.datafield];
            //不存在,则取列验证器
            _validator = _validator ? _validator : col.validation ;
            if (_validator) {
                this.setColumnValidator(col, _validator);
            }
        });
    }

    private setColumnValidator(columnDef: GridColumnDef, validator: ((cell: any, value: number) => any) | string) {
        if (typeof validator === "string") {
            columnDef.validation = this.grid.validatorService.getValidatorRuleByNames(validator);
        } else if (typeof validator === "function") {
            columnDef.validation = validator;
        }
    }



}