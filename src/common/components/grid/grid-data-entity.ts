/**
 * 表格接收数据实体
 */
export interface GridData<T> {
    rows: Array<T>;
    footer: {
        totalCount: number;
        [key: string]: any;
    }
}