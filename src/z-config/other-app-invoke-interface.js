/**
 * 其它应用调用接口
 * http://xxx?param=JTdCJTIydXNlciUyMiUzQSU3QiUyMnRlbGVQaG9uZSUyMiUzQSUyMjE4ODIzNDY0Mjg1JTIyJTJDJTIycmVhbE5hbWUlMjIlM0ElMjIlRTclQUUlQTElRTclOTAlODYlRTUlOTElOTglMjIlMkMlMjJmaWxlU2VydmVyQWRkciUyMiUzQSUyMmh0dHAlM0ElMkYlMkYxOTIuMTY4LjIwLjE3NiUzQTgwJTJGJTIyJTJDJTIycXElMjIlM0ElMjIxMjM0NTY3OTgyJTIyJTJDJTIyZW1haWwlMjIlM0ElMjJsZWclNDAxNjMuY29tJTIyJTJDJTIybG9naW5FaWQlMjIlM0ExMDAwMDAwMCUyQyUyMnVzZXJJZCUyMiUzQTEwMDAwMDExMDAlMkMlMjJmdWxsbmFtZSUyMiUzQSUyMiVFNCVCOCU4OSVFNSU4RiVBQSVFNyU4NiU4QSVFNiU4MCVCQiVFOSU4MyVBOCUyMiUyQyUyMmVuYW1lJTIyJTNBJTIyJUU0JUI4JTg5JUU1JThGJUFBJUU3JTg2JThBJUU2JTgwJUJCJUU5JTgzJUE4JTIyJTdEJTdE
 */
(function () {
    'use strict'
/* 
    //示例 获取应用参数,并加入到url的参数
    var myParam = {
        a:123,
        user: {
            "telePhone": "18823464285",
            "realName": "管理员",
            "loginname": "admin",
            "fileServerAddr": "http://192.168.20.176:80/",
            "qq": "1234567982",
            "email": "leg@163.com",
            "loginEid": 10000000,
            "userId": 1000001100,
            "fullname": "三只熊总部",
            "idToken": "没有,传随机数",
            "ename": "三只熊总部"
        }
    }
    var myUrlParam = otherAppInvokeInterfaceUtils.encrypParam(myParam);
    console.log("encrypParam-myUrlParam", myUrlParam); 
    // 加入浏览器的url参数param:  http://xxx?param = myUrlParam
    */

    //解析路径参数
    var param = otherAppInvokeInterfaceUtils.getUrlParam();
    console.log("the param", param);
    //参数不存在
    if (!param) {
        return;
    }
    var user = param.user;
    console.log("the user", user);
    //用户不存在
    if (user) {
        return;
    }

    SUI_LOCAL_CONFIG.OTHER_APP_INVOKE_USER = user;
    SUI_LOCAL_CONFIG.APP_MENU_TYPE = "PLATFORM_OPERATE"; 
    //不显示头信息
    SUI_LOCAL_CONFIG.BASE_FRAMEWORK_CONFIG.showHeader = false;
    /** 本地静态应用列表 */
    SUI_LOCAL_CONFIG.LOCAL_STATIC_APPS = {
        "result": [{
            "appid": "120",
            "appname": "tb-base",
            "apptitle": "基础资料",
            "description": "三只熊-基础资料-描述",
            "target": "",
            "appurl": ""
        }]
    }

})();
//?param = {user: {}}