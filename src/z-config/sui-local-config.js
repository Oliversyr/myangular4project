//配置文件
var SUI_LOCAL_CONFIG = {
    /**
     * 超时时间 秒
     */
    TIMEOUT: null,
    //资源根目录
    /**
     * 如果项目部署不是根目录,有二级目录名,则需要填写
     * 例如 http://127.0.0.1/xxx/xxxx/ ;则 RESOURCE_ROOTPATH='xxx/xxxx/'
     */
    RESOURCE_ROOTPATH: "",
    //业务根路径
    BUSINESS_ROOTPATH: "http://tvpn.myimpos.com:19090/vem/",
    /**
     * 资源服务器路径
     * 例如: 帮助文件、配置文件等
     */
    RESOURCE_SERVER_ROOTPATH: "http://127.0.0.1:3690/",
    /**
     * 多用户标志 默认 true
     * true-支持
     * false-不支持
     */
    MULT_USER_FLAG: false,
    /**
     * 有静态菜单的应用列表
     *
     */
    HAS_STATICMENU_APPS: ['demos', 'tb-storage'],
    /**
     * 控制台日志显示级别 正式环境为WARN ,
     * 开发环境为DEBUG(开发环境修改dev-config.js文件参数 SUI_LOCAL_CONFIG.CONSOLE_LOG_LEVEL )
     * DEBUG
     * LOG
     * INFO
     * WARN
     * ERROR
     */
    CONSOLE_LOG_LEVEL: "WARN"
        // LOGTRACE_FLAG: true
}



/**
 * 企业信息
 */
SUI_LOCAL_CONFIG.ENTERPRISE_INFO = {
    "productName": "三只熊业务管理",
    "logo": "assets/imgs/login/logo.png",
    "loginBackgroundImg": "assets/imgs/login/login_bg.png",
    "loginBannerImg": "assets/imgs/login/login_banner.png",
    "enterpriseName": "云端信联科技有限公司",
    "hotline": "0775-88888888",
    "qq": "232857155"
};

/**
 * 基础应用配置信息 
 */
SUI_LOCAL_CONFIG.BASE_FRAMEWORK_CONFIG = {
    "headerBgClass": "theme-dark",
    "defaultAppUrl": "tb-storage"
}