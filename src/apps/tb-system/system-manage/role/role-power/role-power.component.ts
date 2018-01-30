import { BaseDetailService } from './../../../../../common/top-common/base-detail.service';
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { TemplateDetailOption } from '../../../../../common/components/templates/template-detail';
import { RolePowerService } from './role-power.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { SuiValidator, ValidatorRule } from './../../../../../common/components/validator/sui-validator';
import { BaseDetailComponent } from '../../../../../common/top-common/base-detail.component';
import { WEIGHT_VALUE } from '../../../../../common/top-common/module-right.service';
import { Observable } from 'rxjs/Observable';


/**
 * 角色权限
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    selector: 'sui-role-power',
    templateUrl: './role-power.html',
    styleUrls: [ './role-power.scss' ]
})

export class RolePowerComponent extends BaseListComponent implements OnInit, OnChanges {

    /**
     * 权限列表
     */
    allPowerList: Array<any>;
    /**
     * 模块列表
     */
    allModuleList: Array<any>;
    /**
     * 树形列表
     */
    treePowerList: Array<any>;
    /**
     * 一级菜单
     */
    firstMenus: Array<any> = [];
    /**
     * 当前选择一级菜单模块Id
     */
    firstModuleId: number = -1;
    /**
     * 全选状态
     */
    allSelected: any = false;

    @Input('roleId') roleId: number = -1;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: RolePowerService,
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        // super.requestConfigBeforePageInit([this.storehouseService.getStorehouseDetail(this.tab.routerParam.entity.stockid)]).subscribe(data => {
        //     console.log('getStocktypeData==',data);
        //     this.storehouseInfo = data[0].data.result;
        //     this.initToolbar();
        // });
    }

    ngOnInit() {
        super.ngOnInit();

        // this.loadPageInitData();

        // this.initPowerList();

        console.log('>>>>>>>>>this.tab<<<<<<<<<<', this.tab)
    }

    ngOnChanges(obj) {
        console.log('ngOnChanges==', obj)
        if(obj.hasOwnProperty('roleId') && !obj.roleId.firstChange) {
            this.allSelected = false;
            this.initPowerList();
            
        }
    }

    /**
     * 找子节点
     * @param dataList 
     * @param currentId 
     */
    private findChildNode(dataList, currentId) {
        let arr = [];
        dataList.forEach((item) => {
            if(item.parentmoduleid == currentId) {
                let _obj = Object.assign({}, item);
                _obj.children = this.findChildNode(dataList, _obj.moduleid);
                arr.push(_obj);
            }
        })
        return arr;
    }

    private initPowerList() {
        this.myService.getModuleList(-1, '').subscribe((res) => {
            if(res.retCode !== 0) {
                this.baseService.modalService.modalToast('模块列表获取错误： ', res.message);
                return ;
            }
            let moduleList = res.data.result.moduleList;
            this.firstMenus = [];
            moduleList.forEach((item) => {
                if(item.parentmoduleid < 1) {
                    item.active = false;
                    this.firstMenus.push(item);
                }
            })

            let all = {
                active: true,
                "moduleid": -1,
                "modulename": "全部",
                "parentmoduleid": 0,
                "displayorder": 1,
                "rightvalue": 1,
                "levelcode": null,
                "icon": null,
                "url": null,
                "notes": null,
                "moduletype": null,
                "plugtype": null,
                "plugname": null,
                "dataversion": 0,
                "appid": "-1",
                "parentModuleName": "null"
            }

            this.firstMenus.unshift(all);

        })
        

        this.refresh(-1);

    }


    /**
     * 模块页签切换
     * @param obj 
     */
    moduleChange(obj) {
        for(let i = 0; i < this.firstMenus.length; i++) {
            if(this.firstMenus[i].active) {
                this.firstMenus[i].active = false;
                break;
            }
        }
        obj.active = true;
        this.refresh(obj.moduleid);
        this.firstModuleId = obj.moduleid;
        
    }

    /**
     * 刷新模块和权限
     */
    refresh(moduleId) {

        let moduleList = this.myService.getModuleList(moduleId, '');
        let powerlist = this.myService.getPowerList(this.roleId, '');

        
        Observable.forkJoin(moduleList, powerlist).subscribe((res) => {
            // for(let i = 0; i < res.length; i++) {
            //     if(res[i].retCode !== 0) {
            //         this.initPowerList();
            //         return ;
            //     }
            // }
            let firstMenus = [];

            // let allPowerList = this.myService.getTestData();
            // this.allModuleList = this.myService.getTestData();

            let allPowerList = res[1].data.result;
            this.allModuleList = res[0].data.result.moduleList;

            
            this.allModuleList.forEach((item) => {
                item.isExpend = false;
                if(item.rightvalue) {
                    let moduleValue = item.rightvalue;
                    let childrenPowerList = [];

                    let mydpower = {
                        isBrowse: {value: 1, sel: false, name: '浏览'},
                        isEdit: {value: 2, sel: false, name: '修改'},
                        isAdd: {value: 4, sel: false, name: '新增'},
                        isDel: {value: 8, sel: false, name: '删除'},
                        isPrint: {value: 16, sel: false, name: '打印'},
                        isSetting: {value: 32, sel: false, name: '设置'},
                        isExport: {value: 64, sel: false, name: '导出'},
                        isCheck: {value: 128, sel: false, name: '审核'},
                        isFinCheck: {value: 256, sel: false, name: '财审'},
                        isImport: {value: 512, sel: false, name: '导入'},
                        isModifyPrice: {value: 1024, sel: false, name: '修改价格'}
                        
                    }

                    let moduleObj = {
                        isBrowse : ((moduleValue & WEIGHT_VALUE.BROWSE) != 0) , //浏览
                        isEdit : ((moduleValue & WEIGHT_VALUE.EDIT) != 0) ,  //编辑
                        isAdd : ((moduleValue & WEIGHT_VALUE.ADD) != 0) ,   //新增
                        isDel : ((moduleValue & WEIGHT_VALUE.DEL) != 0) ,   //删除
                        isPrint : ((moduleValue & WEIGHT_VALUE.PRINT) != 0) ,  //打印
                        isExport : ((moduleValue & WEIGHT_VALUE.EXPORT) != 0) ,  //导出
                        isImport : ((moduleValue & WEIGHT_VALUE.IMPORT) != 0) ,  //导入
                        isCheck : ((moduleValue & WEIGHT_VALUE.CHECK) != 0) ,  //审核
                        isFinCheck : ((moduleValue & WEIGHT_VALUE.FINCHECK) != 0),  //财务审核 
                        isModifyPrice : ((moduleValue & WEIGHT_VALUE.MODIFYPRICE) != 0)  //改价 
                    }

                    for(let myRight in mydpower) {
                        if(moduleObj[myRight]) {
                            // if(rightObj[myRight]) {
                            //     mydpower[myRight].sel = true;
                            // }
                            childrenPowerList.push(mydpower[myRight]);
                        }
                    }

                    item.myPowerList = childrenPowerList;

                    item.allThisPower = false;
                }
            })

            let treePowerList = []
            this.allModuleList.forEach((item) => {
                if(moduleId === -1) {
                    if (item.parentmoduleid < 1) {
                        // let data = JSON.parse(JSON.stringify(this.allModuleList));
                        let data = this.allModuleList;
                        item.children = this.findChildNode(data, item.moduleid);
                        item.isFirstGrade = true;
                        treePowerList.push(item);
                    }
                } else if(item.parentmoduleid === moduleId) {
                    let data = this.allModuleList;
                    item.children = this.findChildNode(data, item.moduleid);
                    item.isFirstGrade = true;
                    treePowerList.push(item);
                } 
            })

            this.treePowerList = treePowerList;


            setTimeout(() => {
                this.allModuleList.forEach((item) => {
                    allPowerList.forEach((right) => {
                        if(right.moduleid === item.moduleid) {
                            let rightValue = right.rightvalue;
    
                            let mydpower = {
                                isBrowse: {value: 1, sel: false, name: '浏览'},
                                isEdit: {value: 2, sel: false, name: '修改'},
                                isAdd: {value: 4, sel: false, name: '新增'},
                                isDel: {value: 8, sel: false, name: '删除'},
                                isPrint: {value: 16, sel: false, name: '打印'},
                                isSetting: {value: 32, sel: false, name: '设置'},
                                isExport: {value: 64, sel: false, name: '导出'},
                                isCheck: {value: 128, sel: false, name: '审核'},
                                isFinCheck: {value: 256, sel: false, name: '财审'},
                                isImport: {value: 512, sel: false, name: '导入'},
                                isModifyPrice: {value: 1024, sel: false, name: '修改价格'}
                                
                            }
    
                            let rightObj = {
                                isBrowse : ((rightValue & WEIGHT_VALUE.BROWSE) != 0) , //浏览
                                isEdit : ((rightValue & WEIGHT_VALUE.EDIT) != 0) ,  //编辑
                                isAdd : ((rightValue & WEIGHT_VALUE.ADD) != 0) ,   //新增
                                isDel : ((rightValue & WEIGHT_VALUE.DEL) != 0) ,   //删除
                                isPrint : ((rightValue & WEIGHT_VALUE.PRINT) != 0) ,  //打印
                                isExport : ((rightValue & WEIGHT_VALUE.EXPORT) != 0) ,  //导出
                                isImport : ((rightValue & WEIGHT_VALUE.IMPORT) != 0) ,  //导入
                                isCheck : ((rightValue & WEIGHT_VALUE.CHECK) != 0) ,  //审核
                                isFinCheck : ((rightValue & WEIGHT_VALUE.FINCHECK) != 0),  //财务审核 
                                isModifyPrice : ((rightValue & WEIGHT_VALUE.MODIFYPRICE) != 0)  //改价 
                            }
    
                            if(item.myPowerList) {
                                item.myPowerList.forEach((power) => {
                                    for(let myRight in mydpower) {
                                        if(power.value === mydpower[myRight].value) {
                                            power.sel = rightObj[myRight]
                                        }
                                    } 
                                })
                            }
                            
                        }
                    })
                })
            }, 500)

            
                
        })
    }

    doSave(isUpdateLow) {
        let allPowerModuleList = JSON.parse(JSON.stringify(this.allModuleList));

        allPowerModuleList.forEach((item) => {
            if(item.myPowerList) {
                item.rightvalue = 0;
                item.myPowerList.forEach((val) => {
                    if(val.sel) {
                        item.rightvalue += val.value;
                    }
                })
            }
        })

        let data = {
            roleId: this.roleId,
            list: allPowerModuleList,
            flag: isUpdateLow ? 1 : 0
        }

        this.myService.savePowerModule(data).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
        })
    }

    doCancel() {
        this.refresh(this.firstModuleId);
    }


    /**
     * 子树选择
     */
    childrenSelectStatus(obj) {
        console.log('childrenSelectStatus==', obj);
        let allSel = true;
        let noSel = true;
        if(obj.value === null) {
            this.allSelected = null;
        } else {
            this.treePowerList.forEach((item) => {
                if(item.rightvalue > 0) {
                    if(item.allThisPower === null) {
                        noSel = false;
                        allSel = false;
                    }
                    if(item.allThisPower) {
                        noSel = false;
                    }
                    if(!item.allThisPower) {
                        allSel = false;
                    }
                }
            })

            if(allSel) {
                this.allSelected = true;
            } else if(noSel) {
                this.allSelected = false;
            } else {
                this.allSelected = null;
            }
        }
        
    }

    /**
     * 全选
     * @param obj 
     */
    allSelect(obj) {
        let val = obj.args.checked;
        if(val !== null) {
            this.treePowerList.forEach((item) => {
                if(item.rightvalue > 0) {
                    item.allThisPower = val;
                }
            })
        }
    }



    
}

