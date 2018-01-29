/**
 * 导入开发js文件
 * @param {Array<string>} urls 
 */
function devImportJsFile(urls) {
    var jsPathStrs = "";
    urls.forEach(function(jsPath) {
        jsPathStrs += `<script src='z-config/${jsPath}'  ></script>`;
    });
    window.document.write(jsPathStrs);
}

var DEV_CONFIG_URLS = {};
//添加url映射
function devIncludeUrls(urlMap) {
    if (SUI_LOCAL_CONFIG.ENV_MODE == "ui" && urlMap) {
        //UI环境 全部显示静态数据
        for (var key in urlMap) {
            urlMap[key].isUnion = false;
        }
    }
    Object.assign(DEV_CONFIG_URLS, urlMap);
}


devImportJsFile([
    'dev/dev-config-urls.js'
]);



// //开发配置文件
// var DEV_CONFIG = {
//     //自定接口服务器路径
//     SLIC_INTERFACE_SERVER_URL: "http://192.168.10.11:3690/"
// }

// /**
//  * DEBUG
//  * LOG
//  * INFO
//  * WARN
//  * ERROR
//  */
// SUI_LOCAL_CONFIG.CONSOLE_LOG_LEVEL = "DEBUG";