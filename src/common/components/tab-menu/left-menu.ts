export class LeftMenu {
    moduleid: number;
    modulename: string;
    iconUrl: string;
    url: string;
    isExpand: boolean;
    rightvalue: number;
    childrens?: LeftMenu[];
    isLeftMenuHiden: boolean;

    constructor(moduleid: number, modulename: string, iconUrl: string, url: string, rightvalue: number, childrens?: LeftMenu[],isLeftMenuHiden?: boolean) {
        this.moduleid = moduleid;
        this.modulename = modulename;
        this.iconUrl = iconUrl;
        this.url = url;
        this.rightvalue = rightvalue;
        this.childrens = childrens;
        this.isLeftMenuHiden = isLeftMenuHiden;
    }

}