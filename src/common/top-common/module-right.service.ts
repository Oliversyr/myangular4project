import { TopCommon } from './top-common';
import { Injectable } from '@angular/core';


/**
 * 模块功能权限二进制值
 */
export enum WEIGHT_VALUE{
    BROWSE=1,     //浏览
    EDIT=2,     //修改
    ADD=4,     //新增
    DEL=8,     //删除
    PRINT =16,    //打印
    SETTING=32,    //设置
    EXPORT=64,    //导出
    CHECK=128,   //审核
    FINCHECK=256,    //财审
    IMPORT=512,    //导入
    MODIFYPRICE=1024 //修改价格
}

/**
 * 模块功能权限值
 */
export interface ModuleFeatureRight {
    isBrowse : boolean , //浏览
    isEdit : boolean ,  //编辑
    isAdd : boolean ,   //新增
    isDel : boolean ,   //删除
    isPrint : boolean ,  //打印
    isExport : boolean ,  //导出
    isImport : boolean ,  //导入
    isCheck : boolean ,  //审核
    isFinCheck : boolean,  //财务审核
    isModifyPrice: boolean // 改价
}

/**
 * @author liurong
 * @date 2017-08-02
 * @notes 模块权限 
 */
@Injectable()
export class ModuleRightService extends TopCommon{

    constructor(
     ) {
         super();
     }

     /**
      * 通过模块权限值获取模块权限
      * @param rightValue 模块权限值
      * @returns mRight 模块功能权限
      */
     getMRights(rightValue: number): ModuleFeatureRight{
        let mRighs: ModuleFeatureRight = {
            isBrowse : false , //浏览
            isEdit : false ,  //编辑
            isAdd : false ,   //新增
            isDel : false ,   //删除
            isPrint : false ,  //打印
            isExport : false ,  //导出
            isImport : false ,  //导入
            isCheck : false ,  //审核
            isFinCheck : false,  //财务审核
            isModifyPrice: false // 改价
        }
        if(rightValue < 0) {
            return mRighs;
        }
        if(rightValue == 0){
            //权限值为0 不设置权限
            for(let key in mRighs){
                mRighs[key] = true ;
            }
            return mRighs ;
        }
        mRighs = {
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
        //有编辑或新增权限就有导入权限
        //mRighs.isImport = (mRighs.isAdd === true || mRighs.isEdit === true) ;
        //导出权限暂时没有设置,有浏览权限就可以导出
        mRighs.isExport = (mRighs.isBrowse === true) ;
        //导入权限未定义,使用新增
        mRighs.isImport = (mRighs.isAdd === true) ;
        return mRighs ;
    }
  
}