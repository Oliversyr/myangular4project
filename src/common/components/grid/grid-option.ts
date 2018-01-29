import { GridData } from './grid-data-entity';
import { ToolBarButton } from './../toolbar/toolbar';
import { Observable } from 'rxjs/Observable';
import { GridColumnDef } from './grid-column';
/**
 * 表格属性配置
 */
export interface GridOption<T>{
    /**
     * 表格类型 默认 B
     * M - 编辑表格
     * B - 浏览
     */
    gridType?: string;
    /**
     * 加载数据接口;
     * 必须返回Observable
     */
    loadDataInterface?: (param) => Observable<GridData<T>>; 
    /**
     * 选择模式: single-单选; multiple-多选; checkbox-checkbox按钮; none或其它-无
     */
    selectionMode?: string;

    /**
     * 行插入表格前执行函数
     * 返回false 不插入; true或其他则插入
     */
    rowBeforeAdd?: (rows: Array<T>) => boolean;

    /**
     * 列分组
     */
    // columngroups?: any[];
    /**
     * 是否显示行号 默认显示
     */
    isShowRowNo?: boolean;

        /**
     * 工具栏
     * 用户工具栏,或者页面跳转
     */
    tools?: ToolBarButton[]; 
    /**
     * 表格主键字段; 传递给其它界面的参数
     */
    primaryKeyFields?: string[];
    /**
     * 按钮显示顺序
     * 例如: ['browse','edit','del']
     */
    toolsOrders?: string[];

    /**
     * 是否允许编辑
     */
    isEdit?: boolean;
    
    /**
     * 列是否允许改变宽度
     */
    isColumnsResize?: boolean;

    /**
     * 列是否允许改变顺序
     */
    isColumnsReorder?: boolean ;

    /**
     * 设置表格的列信息
     * 1. {Array<GridColumnDef>} columnDefs - 列数据
     * 2. {Array}  columngroups 列分组 
     * 3. {object}  columnTemplates 列模板 
     * 4. {object}  validators 列验证器 
     * @param {Array} columnDefs 
     * @param {Array} columngroups 暂时不支持
     * @param {object} columnTemplates 
     * @param {object} validators 设置验证器
     */
    columns?: any[];
}


/**
 * 表格分页参数
 */
export interface GridPage{
    pageNum?: number;
    pageSize?: number;
    /**
     * 分页栏显示页码数量
     */
    pageLinks?: number;
    pageSizes?: number[];

    /**
     * 分页模式 支持:
     * 1. defualt
     * 2. simple
     */
    pagerMode?: string;
    /**
     * 是否支持分页(包含本地与服务端分页)
     * 1. true -支持
     * 1. false - 不支持 
     */
    pageable?: boolean;
    /**
     * 是否支持服务端分页 
     * 1. true -支持 ;需要实现 rendergridrows函数
     * 1. false - 不支持
     */
    isServerPage?: boolean;
}

/**
 * 编辑表格参数
 */
export interface GridEditOption{
    /**
     * 判断重复行字段
     */
    duplicateRowFields: string[];
    /**
     * 提交服务器字段
     */
    submitServerFields: string[];
    /**
     * 需要累加的字段
     */
    cumulateFields: string[];
    /**
     * 需要覆盖的字段
     */
    coverFields: string[];
    /**
     * 记录重复提示模板
     */
    promptTemplate: string;
}