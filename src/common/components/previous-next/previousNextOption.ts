import { GridData } from './../grid/grid-data-entity';
import { ToolBarButton } from './../toolbar/toolbar';
import { Observable } from 'rxjs/Observable';
/**
 * 表格属性配置
 */
export interface PreviousNextOption<T>{
    /**
     * 当前关键字段数据
     */
    currentSheet: any;
    /**
     * 加载数据接口;
     * 必须返回Observable
     */
    loadDataInterface: (param) => Observable<GridData<T>>; 
    /**
     * 比较参数（关键字段）
     */
    keyWord: string;
    /**
     * 搜索参数
     * {
     *   pageNum: 
     *   pageSize: 
     *   params: {}
     * }
     */
    searchParams: any;
    /**
     * 刷新详情页面的函数
     * 返回true 表示页面刷新成功，false 失败
     */
    refreshDetailFn: (param) => Observable<boolean>;
    
}

