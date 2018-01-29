export class Menu {

    moduleid: number;
    modulename: string;
    parentmoduleid: number;
    rightvalue: number;
    displayorder: number;
    url: string;
    /**
     * 是否默认打开; 仅仅允许一个
     */
    isDefOpen: boolean;
    childrens: Menu[];
    isLeftMenuHiden: boolean;
    
    constructor() {

    }

}