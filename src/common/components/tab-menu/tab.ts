import { SafeResourceUrl } from '@angular/platform-browser';

export class Tab {
    
    /**
     * 页签内容页面加载状态
     * true -- 加载完成
     * false -- 加载未完成
     */
    tabContentLoadState?: boolean;
    /**
     * 焦点定位到该页签
     * 隐藏无效
     */
    focus?: () => void;
    /*
     * 当前页签数据是否改变
     */
    dataChangeFlag?: boolean;
    /**
     * 当前传递给页签的参数
     */
    routerParam?: any;
    moduleid: number;
    modulename: string;
    modulenameSuffix: string;
    safeUrl: any;
    //操作类型: A/B/M-详情(含浏览/编辑/新增),L-列表
    // attr: string;
    /**
     * 是否被选中
     */
    selected?:boolean ;

    get loadMessage(): string{
        let modulename = this.modulename + this.modulenameSuffix;
        return `正进入[${modulename}]页面,请稍等`;
    }

    private _attr: string;

    constructor(moduleid: number, modulename: string,safeUrl: SafeResourceUrl, attr: string) {
        this.moduleid = moduleid;
        this.modulename = modulename;
        this.safeUrl = safeUrl ;
        this.attr = attr ;
    }

    set attr(attr: string){
        switch (attr) {
            case "B":
                this.modulenameSuffix = "(详情)";
                break;
            case "M":
                this.modulenameSuffix = "(编辑)";
                break;
            case "A":
                this.modulenameSuffix = "(新增)";
                break;
            default:
                this.modulenameSuffix = "(记录)";
                break;
        }
        this._attr = attr ;
    }

    get attr(){
        return this._attr;
    }

}
