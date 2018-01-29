import { map } from 'rxjs/operator/map';
import { SuiRouterService } from './../directives/router/sui-router.sevice';
import { KeyboardService } from './../directives/keyboard/keyboard.service';
import { SuiSpinService } from './../components/spin/sui-spin.service';
import { SuiHttpService } from './../services/https/sui-http.service';
import { ModalService } from './../components/modal/modal.service';
import { ToolBarButton } from './../components/toolbar/toolbar';
import { ModuleRightService, ModuleFeatureRight } from './module-right.service';
import { TabOuterUtil } from './../components/tab-menu/tab-outer-util';
import { CommonServices } from './../services/groups/common-services.module';
import { TopCommon } from './top-common';
import { ElementRef, Injectable, NgModule } from '@angular/core';
import { Tab } from './../components/tab-menu/tab';
import { GlobalService } from '../global/global.service';


/**
 * @author liurong
 * @date 2017-08-02
 * @notes 应用模块基础服务器类 : 列表、详情、编辑界面都同享的服务类
 */
@Injectable()
export class BaseService extends TopCommon {


    constructor(
        public commonServices: CommonServices,
        public tabOuterUtil: TabOuterUtil,
        public router: SuiRouterService,
        public moduleRightService: ModuleRightService,
        public modalService: ModalService,
        public globalService: GlobalService,
        public keyboardService: KeyboardService,
        public suiSpinService: SuiSpinService,
        public suiHttpService: SuiHttpService
    ) {
        super();
    }

    /**
     * 通过模块号,获取模块与上级模块的模块命名
     * @param tab 页签 
     * @returns string[] 返回模块名称数组[父级模块名称,模块名称] 
     */
    getCrumbMenuNamesByMid(tab: Tab): any[] {
        let crumbMenuNames = [];
        try {
            if (!tab || !tab.moduleid) {
                return crumbMenuNames;
            }
            let menu = this.globalService.tabManager.getLeftMenuByModuleId(tab.moduleid);
            if (menu) {
                ``
                crumbMenuNames.push({ label: menu.modulename + tab.modulenameSuffix });
            }
            let pMenu = this.globalService.tabManager.getParentMenuByModuleId(tab.moduleid);
            if (pMenu) {
                crumbMenuNames.unshift({ label: pMenu.modulename });
            }
            return crumbMenuNames;
        } catch (e) {
            console.error("通过模块号,获取模块与上级模块的模块命名失败", e.stack);
            return [];
        }


    }

    /**
     * 通过模块号,获取页面帮助文件的路径
     * @param {Tab} tab 页签 
     * @returns {string[]} 返回模块名称数组[父级模块名称,模块名称] 
     */
    getHelpUrlByTab(tab: Tab, appName: string): string {
        let helpUrl: string;
        if (!tab || !tab.moduleid) {
            return null;
        }
        //暂时不处理,预留接口
        helpUrl = `${tab.safeUrl}${tab.attr == 'L' ? '/list' : ''}-help.htm`;
        return helpUrl;
    }

    /**
     * 获取工具栏 按钮组;
     * 默认配有 新增、浏览、编辑、打印、删除、取消、审核等常用按钮
     * @param {ModuleFeatureRight} mRight - 当前模块的权限
     * @param {ToolBarButton[]=} extraBtns  - 额外按钮 
     * @returns {ToolBarButton[]} 返回工具栏按钮组 
     */
    getToolBar(mRight: ModuleFeatureRight, extraBtns?: ToolBarButton[]): ToolBarButton[] {

        let columnTools: ToolBarButton[] = [
            { name: "list", label: "列表", placeholder: "返回列表", state: mRight.isBrowse, useMode: "TOP_BAR", userPage: "A|M|B", hotkey: "BACK_LIST" },
            { name: "add", label: "新增", placeholder: "新增记录", state: mRight.isAdd, useMode: "TOP_BAR", userPage: "M|B|L", hotkey: "NEW" },
            { name: "browse", label: "浏览", placeholder: "浏览详情", state: mRight.isBrowse, useMode: "GRID_BAR", selectRecordMode: 'single', userPage: "L" },
            { name: "edit", label: "编辑", placeholder: "编辑记录", state: mRight.isEdit, useMode: "GRID_BAR", selectRecordMode: 'single', userPage: "B|L", hotkey: "EDIT" },
            { name: "editComplete", label: "编辑完成", placeholder: "完成记录的编辑", state: mRight.isEdit, useMode: "GRID_BAR", selectRecordMode: 'single', userPage: "M|B|L", hotkey: "EDIT_COMPLETE" },
            { name: "print", label: "打印", placeholder: " 打印记录", state: mRight.isPrint, selectRecordMode: 'multple', userPage: "M|B|L" },
            { name: "del", label: "删除", placeholder: "删除记录", state: mRight.isDel, parentNode: "BATCH", selectRecordMode: 'multple', userPage: "M|B|L", hotkey: "DELETE" },
            { name: "copy", label: "复制", placeholder: "复制记录", state: mRight.isAdd, selectRecordMode: 'single', userPage: "B|L", hotkey: "COPY" },
            { name: "save", label: "保存", placeholder: "保存记录", state: (mRight.isAdd || mRight.isEdit), useMode: "TOP_BAR", selectRecordMode: '', userPage: "A|M", hotkey: "SAVE" },
            { name: "reset", label: "重置", placeholder: "还原数据", state: (mRight.isAdd || mRight.isEdit), useMode: "TOP_BAR", selectRecordMode: '', userPage: "A|M", hotkey: "RESET" },
            { name: "cancel", label: "取消", placeholder: "取消记录", state: mRight.isCheck, parentNode: "BATCH", selectRecordMode: 'multple', userPage: "B|L", hotkey: "CANCEL_RECORD" },
            { name: "check", label: "审核", placeholder: "审核记录", state: mRight.isCheck, parentNode: "BATCH", selectRecordMode: 'multple', userPage: "B|L", hotkey: "CHECK" },
            { name: "export", label: "导出", placeholder: "导出记录", state: mRight.isExport, parentNode: "BATCH", useMode: 'TOP_BAR', selectRecordMode: 'multple', userPage: "L", hotkey: "EXPORT" },
            { name: "import", label: "导入", placeholder: "导入记录", state: mRight.isImport, parentNode: "BATCH", useMode: 'TOP_BAR', selectRecordMode: '', userPage: "L", hotkey: "IMPORT" },
            { name: "preNext", label: "上一单/下一单", placeholder: "查看上一条/下一条记录", state: mRight.isBrowse, useMode: "TOP_BAR", selectRecordMode: 'multple', userPage: "B", hotkey: "NEXT_RECORD" },
            // { name: "pre", label: "上一单", placeholder: "查看下一条记录", state: mRight.isBrowse, useMode: "TOP_BAR", selectRecordMode: '', userPage: "B", hotkey: "PRE_RECORD" }
        ];
        if (extraBtns && extraBtns.length) {
            columnTools = columnTools.concat(extraBtns);
            /*  let extraBtnsMap: any = {};
             extraBtns.map(btn => extraBtnsMap[btn.name]=btn);
             columnTools.map(btn => {
                 if(extraBtnsMap[btn.name]) {
                     Object.assign(btn,extraBtnsMap[btn.name]);
                     delete extraBtnsMap[btn.name] ;
                 }
             });
             for(let key in extraBtnsMap) {
                 if(extraBtnsMap[key]) {
                     //新增的按钮
                     columnTools.push(extraBtnsMap[key]);
                 }
             } */
        }
        return columnTools;
    }

    /**
     * 获取表格内
     * @param extraBtns 
     */
    getGridToolBar(mRight: ModuleFeatureRight, extraBtns?: ToolBarButton[]) {
        let tools = this.getToolBar(mRight, extraBtns);
        return tools.filter(tool => ['ALL', 'GRID_BAR'].indexOf((tool.useMode || "ALL")) != -1);
    }

    /**
     * 获取顶部工具栏
     * @param {string} attr - A-新增;B-浏览;M-编辑;L-浏览;
     * @param {ToolBarButton[]} extraBtns - 额外的按钮
     */
    getTopToolBar(attr: string, mRight: ModuleFeatureRight, extraBtns?: ToolBarButton[], extraOption?: { states: { [key: string]: boolean } }): ToolBarButton[] {
        let tools = this.getToolBar(mRight, extraBtns);
        let attrTools = tools.filter(tool => tool.userPage.indexOf(attr) != -1);

        if (attr != "L") {
            //详情或者编辑界面无批量操作
            tools.map(btn => {
                delete btn.parentNode;
            });
            if(extraOption) {
                this.setToolBarStates(attrTools,extraOption.states);
            }
            return attrTools;
        }

        //列表还需要过滤表格的按钮
        return attrTools.filter(tool => {
            return ['ALL', 'TOP_BAR'].indexOf((tool.useMode || "ALL")) != -1;
        });
    }

    /**
     * 设置工具栏按钮的状态值
     * 1. tools -  工具按钮
     * 1. states 状态值 {btn.name: boolean}  btn.name 支持多个
     * 1. 例如:{'edit,del': true,"print": false, "add":true}
     * @param tools 
     * @param states 
     */
    setToolBarStates(tools: ToolBarButton[], states: { [key: string]: boolean }) {
        if (!states || this.commonServices.arrayUtil.isEmpty(tools)) {
            return;
        }
        let sameKeys: string[];
        for(let key in states) {
            sameKeys = key.split(",");
            //多个按钮同一权限值
            if(sameKeys.length != 1) {
                sameKeys.map(newKey => states[newKey] = states[key]);
                delete states[key];
            }
        }

        //设置状态值
        tools.map(btn => {
            if(!this.commonServices.classUtil.notExits(states[btn.name])) {
                btn.dataState = states[btn.name];
            }
        });

    }
}

