/**
 * 开发环境配置
 */
(function () {
    'use strict'

    SUI_LOCAL_CONFIG.RESOURCE_SERVER_ROOTPATH = 'http://192.168.10.11:3690/';
    SUI_LOCAL_CONFIG.CONSOLE_LOG_LEVEL = "DEBUG";
    let RAP_URL = 'http://192.168.20.72:8010/rap.plugin.js?projectId=5';
    let JQUERY_URL = 'assets/libs/jquery-2.2.1.js';
    let EVN_CSS_URL ='z-config/dev-config.css';
    let DEV_CONFIG_URL = "z-config/dev-config.js";

    
    //配置信息
    let cfgEles = {
        ENV_MODE: { type: "select", width: "", label: "选择环境", items: ['-1:选择环境', 'dev:前端开发环境', 'ui:UI环境', 'union:联调环境'], value: "dev" },
        CONSOLE_LOG_LEVEL: { type: "select", width: "", label: "日志级别", items: ['-1:选择日志级别', 'DEBUG', 'LOG', 'INFO', 'WARN', 'ERROR'], value: "DEBUG" },
        BUSINESS_ROOTPATH: { type: "input", width: "500px", label: "网关地址" },
        DEVELOPER_ADDR: { type: "input", width: "500px", label: "后端服务器地址" },
        RESOURCE_SERVER_ROOTPATH: { type: "input", width: "500px", label: "静态资源地址" },
        SLIC_INTERFACE_SERVER_URL: { type: "input", width: "500px", label: "自定接口平台地址", value: SUI_LOCAL_CONFIG.RESOURCE_SERVER_ROOTPATH }
    }

    /**
     * 环境处理
     */
    class EnvManager {

        init() {
            this.initCfgValue();

            //默认UI环境
            switch (SUI_LOCAL_CONFIG.ENV_MODE) {
                case "ui":
                    this.initUiEnv();
                    break;
                case "union":
                    this.initUnionEnv();
                    break;
                case "dev":
                default:
                    this.initDevEnv();
                    break;
            };
        }

        /** 设置默认值 */
        initCfgValue() {
            let cfgEle;
            for (let key in cfgEles) {
                cfgEle = cfgEles[key];
                if (localStorage.getItem(key)) {
                    SUI_LOCAL_CONFIG[key] = localStorage.getItem(key);
                } else if (cfgEle.value) {
                    SUI_LOCAL_CONFIG[key] = cfgEle.value;
                }

            }
        }

        initUiEnv() {
            window.document.write(`<script src='${JQUERY_URL}'  ></script>`);
            window.document.write(`<script src='${RAP_URL}'  ></script>`);
            window.document.write(`<script src='${DEV_CONFIG_URL}'  ></script>`);
        }
        initUnionEnv() {

        }
        initDevEnv() {
            window.document.write(`<script src='${JQUERY_URL}'  ></script>`);
            window.document.write(`<script src='${RAP_URL}'  ></script>`);
            window.document.write(`<script src='${DEV_CONFIG_URL}'  ></script>`);
        }
    }

    /**
     * dom管理 
     */
    class DomManager {
        init() {
            this.addRootEle();
            this.addBtnsEvent();
            this.initEles();
            
        }
        /** 设置默认值 */
        initEles() {
            let cfgEle;
            for (let key in cfgEles) {
                cfgEle = cfgEles[key];
                cfgEle.value = SUI_LOCAL_CONFIG[key] || "";
                this.addEle(cfgEle, key);
            }
        }
        /** 添加跟元素 */
        addRootEle() {
            let union_env_html = `
                <div class="sui-fixed-btn-wrap">
                    <div class="sui-fixed-btn-wrap-left">切换环境</div> 
                    <div class="sui-fixed-btn-wrap-right" id="content">
                        <div class="sui-fixed-btn-wrap-right-mt"> <span class="c-red">(修改完后,刷新生效)</span> 
                        <button id="reflush" class="sui-btn sui-btn-primary">刷新</button> </div>
                    </div>    
                </div>
                `;
            let divElement = document.createElement('div'); //1、创建元素
            document.body.appendChild(divElement);
            // document.appendChild(divElement);
            var shadow = divElement.attachShadow({ mode: 'open' });//D:\ydxl\angular4\slic-main\src\z-config\dev-config.scss
            shadow.innerHTML = union_env_html; //_suspension-btn.scss
            shadow.innerHTML += `   <link rel="stylesheet" href="${EVN_CSS_URL}" type="text/css" />`;
            this.el_content = shadow.querySelector("#content");
        }
        addBtnsEvent() {
            //刷新
            this.el_content.querySelector("#reflush").addEventListener("click", () => {
                window.location.reload();
            });
        }

        /** 添加input元素 */
        addEle(cfg, field) {
            let tpl = ` <span class="span-til">${cfg.label}: </span>
                        <${cfg.type} id="${field}" value="${cfg.value}" class="sui-inputText" style="width:${cfg.width}" />
                    `;
            //<div class="sui-fixed-btn-wrap-right-mt"> 
            let divElement = document.createElement('div'); //1、创建元素
            divElement.className = "sui-fixed-btn-wrap-right-mt";
            divElement.innerHTML = tpl;
            this.el_content.appendChild(divElement);
            if (cfg.type == "select") {
                this.addSelectItems(cfg, field);
            }
            this.addEvent(cfg, field);
        }

        addSelectItems(cfg, field) {
            let selectEL = this.el_content.querySelector(`#${field}`);
            if (!selectEL) {
                return;
            }
            cfg.items.forEach((item, index) => {
                let optEle = document.createElement("option");
                let values = item.split(":");
                optEle.value = values[0];
                optEle.text = values[1]||values[0];
                optEle.selected = values[0] == cfg.value;
                selectEL.add(optEle, null);
            });
        }

        addEvent(cfg, field) {
            let ele = this.el_content.querySelector(`#${field}`);
            if (!ele) {
                return;
            }
            ele.addEventListener("change", (event) => {
                this.onchange(event);
            });
        }

        onchange(event) {
            let target = event.target;
            let _type = target.tagName;
            let value;
            let field = target.id;
            if (_type == 'SELECT') {
                let item = target.options[target.selectedIndex];
                value = item.value;
            } else {
                value = target.value;
            }
            console.debug("change===>field, value", field, value);
            localStorage.setItem(field, value);
        }
    }
    new EnvManager().init();
    
    window.onload = function () {
        new DomManager().init();
    }

})();
