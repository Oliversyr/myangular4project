import { Observable } from 'rxjs/Observable';
import { CACHE_IDS } from '../../services/storage/cache-ids';

/**
 * 自动补全参数接口
 * 
 * @export
 * @interface SuiAutoCompleteOption
 */
export interface SuiAutoCompleteOption {
    /**
     * 单元宽度多个用逗号(,)隔开;例如: 10%,12%, 15px
     */
    cellWidths: string;
    /**
     * 下拉标题多个用逗号隔开(,) 例如:商品编码, 商品名称
     */
    titles: string;
    /**
     * 显示列属性
     */
    fields: string;
    /**
     *是否允许多选 默认false -单选
     */
    isMult?: boolean;
    /**
     * 过滤自动
     * 例如 {goodsid: "编码",goodsname: "名称",barcode: "条码"};
    */
    filterFileds?: any;
    /**
     * 过滤条件缓存id
     * num CACHE_IDS 值
     */
    cacheId?: CACHE_IDS;
    minTags?: number;
    maxTags?: number;
    /**
     * searchKey: 搜索值
     * filterFileds: 过滤自动,多个使用逗号(,)隔开
     */
    loadDataInterface?: (searchKey: string, filterFileds: string) => Observable<Array<any>>;
    /**
     * 选择前执行;可以对数据进行验证或格式化
     * ,如果返回false-不执行选择数据回调函数; true-执行选择数据回调函数
     * data: isMult=true 数组 false-单个对象
     */
    beforeSelectData?: (data: any) => boolean;
    /**
     * 选择数据回调函数;
     * data: isMult=true 数组 false-单个对象
     */
    selectData: (data: any) => void;
    /**
     * 跳整到高级搜索界面
     * 如果不实现,则不显示更多按钮
     */
    goToAdvanceSearch?: (searchKey: string) => void;
    
}
 