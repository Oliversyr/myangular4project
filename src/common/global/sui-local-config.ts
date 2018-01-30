//配置文件
export interface SuiLocalConfig {

   
   /**
     * 环境模式
     * 1. ui--ui环境
     * 2. union --联调环境
     * 3. dev -- 前端开发环境
     * 4. prod -- 正式环境
     */
    ENV_MODE: string;
    /**
     * 超时时间 秒
     */
    TIMEOUT: number;
    //资源根目录
    /**
     * 如果项目部署不是根目录,有二级目录名,则需要填写
     * 例如 http://127.0.0.1/xxx/xxxx ;则 RESOURCE_ROOTPATH='xxx/xxxx'
     */
    RESOURCE_ROOTPATH: string;
    /**
     * 业务根路径
     */
    BUSINESS_ROOTPATH: string;
    /**
     * 开发者地址
     */
    DEVELOPER_ADDR: string ;
    /**
     * 资源服务器路径
     * 例如: 帮助文件、配置文件等
     */
    RESOURCE_SERVER_ROOTPATH: string;
    /**
     * 有静态菜单的应用列表
     *
     */
    HAS_STATICMENU_APPS:Array<string>,
    /**
     * 多用户标志
     * true-支持
     * false-不支持
     */
    MULT_USER_FLAG: boolean;
    /*     LOG_LEVEL: "debug",
        LOGTRACE_FLAG: true */
    /**
     * 企业信息
     */
    ENTERPRISE_INFO: EnterpriseInfo;

    /**
     * 基础应用配置
     */
    BASE_FRAMEWORK_CONFIG: any;
    /**
     * 控制台日志显示级别 正式环境为WARN ,开发环境为DEBUG
     * DEBUG
     * LOG
     * INFO
     * WARN
     * ERROR
     */
    CONSOLE_LOG_LEVEL:  string;
}

export enum ConsoleLogLevel {
    DEBUG = 1 ,
    LOG,
    INFO,
    WARN,
    ERROR,
} 
/**
 * 企业信息
 */
export interface EnterpriseInfo {
    productName: string;
    logo: string;
    loginBackgroundImg: string;
    loginBannerImg: string;
    enterpriseName: string;
    hotline: string;
    qq: string
}

/**
 * 基础应用配置
 */
export interface BaseFrameworkConfig {
    /**
     * 是否显示头信息
     */
    showHeader: boolean ;
    headerBgClass: string ;
    defaultAppUrl: string ;
}
