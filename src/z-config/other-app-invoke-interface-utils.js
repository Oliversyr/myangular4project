/**
 * 其它应用调用接口工具
 */
(function () {
    'use strict'
    window.otherAppInvokeInterfaceUtils = {
        /**
        * 加密字符串参数
        * @param str 
        */
        encryp: function (str) {
            if (str) {
                return btoa(encodeURIComponent(str));
            }
            return null;
        },

        /**
        * 加密参数
        1. 先把参数JSON序列号为字符串
        2. 然后加密
        * @param str 
        */
        encrypParam: function (param) {
            if (param) {
                return btoa(encodeURIComponent(JSON.stringify((param))));
            }
            return null;
        },
        /**
         * 解密字符串参数
         * 1. 返回参数字符串
         * @param encrypStr
         */
        decrypt: function (encrypStr) {
            if (encrypStr) {
                return decodeURIComponent(atob(encrypStr));
            }
            return null;
        },
        /**
         * 解密字符串参数
         * 1. 返回参数对象
         */
        decryptParam: function (encrypStr) {
            if (!encrypStr) {
                return null;
            }
            try {
                return JSON.parse(this.decrypt(encrypStr));
            } catch (err) {
                console.error('解析用户参数异常', "encrypStr=" + encrypStr, err.stack);
                return null;
            }
        },
        /**
         * 获取url参数 (param)
         * 1. url为空,则默认当前路径
         * 1. 返回参数对象
         */
        getUrlParam: function (url) {
            if(!url) {
                url = window.location.href ;
            }
            var parsedUrl = new URL(url);
            return this.decryptParam(parsedUrl.searchParams.get("param"));
        }
    };

})();
//?param = {user: {}}