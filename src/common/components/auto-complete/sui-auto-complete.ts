import { SuiAutoCompleteFilterTerm } from './sui-auto-complete-filter-term';
import { SuiCookieService } from './../../services/storage/sui-cookie.service';
import { ModalService } from './../modal/modal.service';
import { KEYBOARD_VALUE } from './../../directives/keyboard/keyboard-value';
import { CommonServices } from './../../services/groups/common-services.module';
import { Component, ChangeDetectionStrategy, forwardRef, OnDestroy, Input, Output, Renderer, ElementRef, AfterViewInit, OnInit, HostBinding, OnChanges, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SuiComboBox } from '../input/sui-combobox';
import { SuiAutoCompleteMult } from './sui-auto-complete-mult';
import { SuiAutoCompleteOption } from './sui-auto-complete-option';
import { HOTKEYS } from '../../directives/keyboard/hotkeys';
import { SuiAutoCompleteService } from './sui-auto-complete.service';
import { SuiSpinService } from '../spin/sui-spin.service';
/**
 * 自动补全组件
 * 
 */
@Component({
    selector: "sui-auto-complete",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
    , styles: [`
    `]
    , providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiAutoComplete),
            multi: true
        }
    ]
})
export class SuiAutoComplete extends SuiComboBox implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() option: SuiAutoCompleteOption;
    mutl: SuiAutoCompleteMult;
    filterTerm: SuiAutoCompleteFilterTerm;


    private uuid: string;
    private selectItems: any;

    private confirmBtnEl: Element;
    private cancelBtnEl: Element;
    private searchMoreEL: Element;
    private listboxRootEL: HTMLDivElement;
    private listboxInputEL: HTMLInputElement;
    private listBoxContentinnerListBoxEL: HTMLElement;
    //监听器
    private mutationObserver: MutationObserver;

    private headerHeight = 30;
    private headerHTML: HTMLDivElement;
    private footerHeight = 35;
    private footerHTML: HTMLDivElement;
    private listBoxTop: string;

    private fieldArray: string[];
    private cellWidthArray: string[];
    private dataAdapter: any;
    private customSource: any;
    private loading: boolean = false;

    /**
     * 加载层
     */
    spinDev: HTMLDivElement;
    /**
     * 空记录提示信息层
     */
    emptyDataDiv: HTMLDivElement ;

    @Input('customTabindex') set customTabindex(customTabindex: number) {
        if (!this.containerElement) {
            return;
        }
        this.containerElement.nativeElement.setAttribute("customTabindex", customTabindex);
    };

    @Output('moreIconEl') moreIconEl: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private utils: CommonServices,
        private modalService: ModalService,
        private suiSpinService: SuiSpinService,
        private cookie: SuiCookieService,
        private myService: SuiAutoCompleteService,
        private containerElement: ElementRef,
        private rendererObj: Renderer
    ) {
        super(containerElement);
    }

    ngOnInit() {

        this.initDefaultOption();
        super.ngOnInit();
        this.initCellWidths();
        this.initAdapter();
        this.renderer(this.rendererItem);
    }

    ngAfterViewInit() {
        // console.debug(">>>>>>>>>this.attrDropDownHeight", this.attrDropDownHeight, this.attrItemHeight);
        this.initAutoComplete();
    }
    
    ngOnDestroy() {
        super.ngOnDestroy();
        this.mutationObserver = null;
        this.mutl = null;
        this.filterTerm = null;
    }

    /**
     * 设置默认选中的数据
     * 
     */
    setDefSelectedData(defSelectedItem) {
        this.setData([defSelectedItem]);
        this.selectItem(defSelectedItem[this.displayMember()]);
        this.onAfterChooseItems([defSelectedItem], 0);
    }

    /**
     * 初始化默认参数
     * 
     * @private
     * @memberof SuiAutoComplete
     */
    private initDefaultOption() {
        this.attrRemoteAutoComplete = true;
        this.attrRemoteAutoCompleteDelay = 200;
        this.attrMinLength = 1;
        this.attrRemoteAutoComplete = true;
        this.attrMultiSelect = true;
        // this.attrShowCloseButtons=true;
        this.attrShowArrow = false;
        this.attrOpenDelay = 1;
    }

    private initAdapter() {
        this.customSource =
            {
                datatype: 'array',
                localdata: []
            }
        this.dataAdapter = new jqx.dataAdapter(this.customSource);
        this.source(this.dataAdapter);
    }

    private initAutoComplete() {
        //添加验证触发的元素
        this.containerElement.nativeElement.querySelector("input.jqx-combobox-input").setAttribute("validatorTriggerElement", "");
        let firstAriaWwns = this.containerElement.nativeElement.querySelector("div[aria-owns]");
        let listBoxId: string = firstAriaWwns.getAttribute("aria-owns");
        this.uuid = listBoxId.replace("listBoxjqxWidget", "");
        this.listboxRootEL = document.querySelector("#listBoxjqxWidget" + this.uuid) as HTMLDivElement;
        this.utils.domHandler.addClass(this.listboxRootEL, "sui-ac-listbox");
        this.listboxInputEL = this.containerElement.nativeElement.querySelector(".jqx-combobox-input");
        if (!this.listboxRootEL || !this.listboxInputEL) {
            this.utils.logs.throwError("create auto-complent faile; listboxInputEL or listboxRootEL is undefined");
        }
        this.listBoxContentinnerListBoxEL = this.listboxRootEL.querySelector("#listBoxContentinnerListBoxjqxWidget" + this.uuid) as HTMLDivElement;

        this.initInputKBEvent();
        this.initListbox();
        this.initRemote();
        this.addSpinDiv();
        this.addEmptyDataPromptDiv();
        this.initMoreIcon();
    }

    /**
     * 输入框中的更多按钮...
     */
    private initMoreIcon() {
        let ele = this.containerElement.nativeElement.querySelector("div.jqx-combobox");

        let moreIcon = document.createElement("span");
        this.utils.domHandler.addClass(moreIcon, "sui-autocomplete-more-icon");
        moreIcon.innerHTML = '<svg class="svgicon icon-ellipsis "><use xlink:href="#icon-ellipsis"></use></svg>'

        ele.appendChild(moreIcon);

        let self = this;
        moreIcon.addEventListener("click", function() {
            self.searchMoreItem();
        })
    }


    /**
     * 增加加载层
     */
    private addSpinDiv() {
        this.spinDev = this.suiSpinService.getSpinElement("");
        this.spinDev.id = `lb-spin-` + this.uuid;
        //预防多个重复
        this.listboxRootEL.appendChild(this.spinDev);
        //停止默认事件,否点焦点丢失
        this.myService.stopElementEvent(this.spinDev);
    }

    private setSpinState(loading: boolean, data?: any[]) {
        this.emptyDataDiv.style.display = "none" ;
        
        if (loading === true) {
            // 打开弹出框,显示加载层; 如果已经显示,则不需要
            //自动触发计算位置
            if (this.listboxRootEL.style.display == "none") {
                this.setData([""]);
                setTimeout(() => {
                    this.setData([]);
                    this.listboxRootEL.style.display = "block" ;
                }, 10);
            }
            this.spinDev.style.display = "block";
        } else {

            //列表是否有数据
            let listIsHasData: boolean = true ;
            if(this.getItems().length == 0 || !this.getItems()[0].originalItem) {
                //下拉框没有数据
                listIsHasData = false ;
            }
            /**
             * 显示空记录的提示条件
             * 1. 返回组为空数组
             * 2. 返回非数组(返回错误,如:网络链接失败等),并且列表没有数据
             */
            if((this.utils.arrayUtil.isArray(data) && data.length ==0) 
                || (!this.utils.arrayUtil.isArray(data) && listIsHasData === false)) {
                this.emptyDataDiv.style.display = "block" ;
            } 
            this.spinDev.style.display = "none";

        }
    }

    
    /**
     * 增加空记录提示层
     */
    private addEmptyDataPromptDiv() {
        this.emptyDataDiv = this.getEmptyDataDiv() ;
        this.listboxRootEL.appendChild(this.emptyDataDiv);
        //停止默认事件,否点焦点丢失
        this.myService.stopElementEvent(this.emptyDataDiv);
    }

    private getEmptyDataDiv(): HTMLDivElement {
        let emptyDataDiv: HTMLDivElement = document.createElement('div');
        emptyDataDiv.className="sui-list-box-empty-data";
        emptyDataDiv.innerHTML = ` <svg class="svgicon icon-warning mr-xs"><use xlink:href="#icon-warning"></use></svg> 记录为空`;
        return emptyDataDiv;
    }


    private initRemote() {
        this.search((searcKey: any) => {
            this.selectItems = {};
            this.initLoadData(searcKey);
        });
    }

    private initLoadData(searcKey: any) {
        if (!this.utils.classUtil.isFunction(this.option.loadDataInterface)) {
            this.utils.logs.throwError("auto-complete init remote interface error: loadDataInterface isn't a function ");
        }

        try {
            this.setSpinState(true);
            let filterFileds: string;
            if (this.filterTerm) {
                filterFileds = this.filterTerm.getSelectedFieldStr();
            }
            this.option.loadDataInterface(searcKey, filterFileds).subscribe((data) => {
                this.handleServerData(data);
            });
        } catch (e) {
            this.setSpinState(false);;
            this.utils.logs.throwError("auto-complete remote load data error", e);
        }
    }

    private handleServerData(data) {
        this.setSpinState(false, data);;
        if (!this.utils.arrayUtil.isArray(data)) {
            console.info("auto-complete only Receive Array data; current data is invalid:", data);
            return;
        } else {
            this.setData(data);
        }
/*         if (this.utils.arrayUtil.isArray(data)) {
            this.setData(data);
            return;
        }
 */        
        /* if (!this.utils.classUtil.notExits(data.retCode) && data.retCode != 0) {
            this.modalService.modalToast(data.message);
            return;
        }
        this.setData(data.rows); */

    }

    private setData(rows: any[]) {
        if (!this.utils.arrayUtil.isArray(rows)) {
            rows = [];
        }
        this.customSource.localdata = rows;
        this.dataAdapter.dataBind();

    }

    private rendererItem = (index, label, value): string => {
        let item = this.dataAdapter.records[index];
        // console.debug(">>>>item", item);
        if (!item) {
            return "";
        }
        let html: string = "";
        let filedIndex: number = 0;
        for (let filed of this.fieldArray) {
            html += this.getCellHtml(item[filed], index, filedIndex, false);
            filedIndex++;
        }
        return html;
    };

    /**
     * 初始化输入框事件
     */
    private initInputKBEvent() {
        // 获取焦点,刷新placeho
        this.listboxInputEL.addEventListener("focus", (event) => {
            this.setPlaceHolderStr();
        });
        this.listboxInputEL.addEventListener("blur", (event) => {
            //关闭下拉层
            this.listboxRootEL.style.display = "none" ;
        });
        this.listboxInputEL.addEventListener("keydown", (event) => {
            //搜索更多 不受listbox是否显示限制
            if (this.utils.domHandler.checkHotkeyValueIsTrigger(event, HOTKEYS.LISTBOX_MORE)) {
                if (this.searchMoreEL) {
                    event.stopPropagation();
                    event.preventDefault();
                    this.rendererObj.invokeElementMethod(this.searchMoreEL, "click");
                }
                return;
            }
            let listboxIsHiden: boolean = this.utils.domHandler.elementIsHide(this.listboxRootEL);
            if (listboxIsHiden) {
                return;
            }
            //监听空格键; 空格为选中
            if (event.keyCode == KEYBOARD_VALUE.SPACE) {
                // this.lockSearch = true;
                event.stopPropagation();
                event.preventDefault();
                if (this.option.isMult) {
                    this.spaceToggleItem();
                }
                return;
            }
            //监听空格键; 空格为选中"↑" 
            if (event.keyCode == KEYBOARD_VALUE["↓"] || event.keyCode == KEYBOARD_VALUE["↑"]) {
                //选中记录才处理滚动条
                this.dealScroll(event, event.keyCode == KEYBOARD_VALUE["↓"]);
                if (this.option.isMult) {
                    setTimeout(() => {
                        this.resetSelectState();
                    }, 10);
                }
                return;
            }
            //回车确定商品
            if (event.keyCode == KEYBOARD_VALUE.ENTER) {
                if (this.confirmBtnEl) {
                    this.rendererObj.invokeElementMethod(this.confirmBtnEl, "click");
                }
                return;
            }

            //esc 取消或隐藏
            if (event.keyCode == KEYBOARD_VALUE.ESC) {
                //关闭下拉框
                this.listboxRootEL.style.display = "none" ;
                return;
            }

        });
    }

    /**
     * 初始化键盘操作
     */
    private initListbox() {
        let innerListBoxjqxWidgetEl: HTMLElement = this.listboxRootEL.querySelector("#innerListBoxjqxWidget" + this.uuid) as HTMLElement;
        this.utils.domHandler.addClass(innerListBoxjqxWidgetEl, "sui-combobox-listbox");
        this.initHeader();
        this.initFooter();
        this.initMutation();
        this.initFilterTerm();
    }

    private initFilterTerm() {
        //无过滤条件选择
        if (
            this.utils.classUtil.notExits(this.option.filterFileds)
            || this.utils.classUtil.notExits(this.option.cacheId)) {
            return;
        }
        // this.placeHolder();
        this.filterTerm = new SuiAutoCompleteFilterTerm();
        this.filterTerm.init(this.listboxRootEL, this.option.filterFileds, this.option.cacheId, this.utils, this.cookie, this.myService);
        //初始化设置提示
        this.setPlaceHolderStr();
        this.filterTerm.onClose = () => {
            this.focus();
            //设置条件后关闭 条件层,提示
            this.setPlaceHolderStr();
        }
    }

    private setPlaceHolderStr() {
        let placeHolder: string = this.filterTerm.getPlaceHolderStr() ;
        // console.log(">>>>>>>>>>>>>>placeHolder...", placeHolder);
        if (placeHolder) {
            this.placeHolder(placeHolder);
        }
    }

    /**
     * 空格选中/取消记录
     */
    private spaceToggleItem() {
        let chooseRowCellSpan: HTMLElement = this.getFocusRowElement();
        if (!chooseRowCellSpan) {
            return;
        }
        this.toggleItemByRowIndex(this.getRowIndexByCellElement(chooseRowCellSpan));
    }

    /**
     * 获取定位到的行元素
     */
    private getFocusRowElement(): HTMLElement {
        return this.listboxRootEL.querySelector(".jqx-listitem-state-selected > span ") as HTMLElement;
    }

    /**
     * 通过单元格元素获取rowIndex
     * 
     * @param {HTMLElement} cellElement 
     * @memberof SuiDemoComboboxList
     */
    private getRowIndexByCellElement(cellElement: HTMLElement): number {
        if (!cellElement) {
            this.utils.logs.throwError("get Cell element faile; because can't get the cell element ", cellElement);
        }
        if (!cellElement.hasAttribute("rowIndex")) {
            let _cellElement = cellElement.querySelector("[rowIndex]") as HTMLElement;
            if (!_cellElement) {
                this.utils.logs.throwError("get Cell element faile; because can't the cell element hasAttribute rowIndex  ", cellElement);
            }
            cellElement = _cellElement;
        }

        let rowIndexStr: any = cellElement.getAttribute("rowIndex");
        if (!rowIndexStr) {

        }
        let rowIndex: number = this.utils.classUtil.toInt(rowIndexStr);
        if (rowIndex == null) {
            this.utils.logs.throwError("get Cell element faile; because can't the row index ", rowIndexStr, cellElement);
        }
        return rowIndex;
    }

    /**
     * 
     * 通过行号选中商品
     * @private
     * @param {number} rowIndex 
     * @param {HTMLDivElement} [rowEL] 
     * @memberof SuiDemoComboboxList
     */
    private toggleItemByRowIndex(rowIndex: number, rowEL?: HTMLElement) {
        if (!rowEL) {
            rowEL = this.listboxRootEL;
        }
        let chooseFlagEL: HTMLElement = rowEL.querySelector(`[rowIndex="${rowIndex}"][class*="sui-mult"]`) as HTMLElement;
        if (!chooseFlagEL) {
            this.utils.logs.throwError("toggleItem fiale;becuase chooseFlagEL undefined", rowIndex, chooseFlagEL, rowEL);
        }
        if (this.selectItems[rowIndex]) {
            //不选择
            delete this.selectItems[rowIndex];
            this.utils.domHandler.removeClass(chooseFlagEL, "sui-checkbox-selected");
        } else {
            this.utils.domHandler.addClass(chooseFlagEL, "sui-checkbox-selected");
            //选中
            this.selectItems[rowIndex] = this.getItems()[rowIndex].originalItem;
        }
        this.refreshItemCount();
        // this.close();
    }

    private resetSelectState() {
        if (!this.option.isMult) {
            //单选不需要刷新状态
            return;
        }
        // console.debug(">>>>resetSelectState");
        // console.trace();
        let chooseFlagEL: HTMLElement;
        for (let rowIndex in this.selectItems) {
            chooseFlagEL = this.listboxRootEL.querySelector(`[rowIndex="${rowIndex}"][class*="sui-mult"]`) as HTMLElement;
            if (chooseFlagEL) {
                this.utils.domHandler.addClass(chooseFlagEL, "sui-checkbox-selected");
            }
        }
    }

    private dealScroll(event, isDown) {
        //如果无滚动条,则不重置paddingTop
        if (this.verticalScrollIsHiden()) {
            // console.debug(" the verical scroll is hidden ,don't need change set paddingTop");
            return;
        }
        let chooseItemEL: HTMLElement = this.listboxRootEL.querySelector(".jqx-listitem-state-selected") as HTMLElement;
        if (!chooseItemEL) {
            return chooseItemEL;
        }
        //下一个单元格top 
        let top: number = this.utils.classUtil.toInt(window.getComputedStyle(chooseItemEL.parentElement).top.replace("px", ""));
        let itemHeight = this.attrItemHeight;
        //单元格默认高度为25
        top += itemHeight > 25 ? itemHeight : 25;
        let paddingTop: number;
        // console.debug(">>>", top, (this.dropDownHeight - 50), this.attrItemHeight);
        if (top < ((this.attrDropDownHeight as number) - 50)) {
            return;
        }
        if (isDown) {
            paddingTop = 0;
        } else {
            if (top > 10) {
                paddingTop = this.headerHeight;
            }
        }
        this.setListBoxContentPaddingTop(paddingTop);
    }

    private setListBoxContentPaddingTop(paddingTop: number) {
        this.listBoxContentinnerListBoxEL.style.paddingTop = paddingTop + "px";
    }

    /**
     * 确定按钮
     * 当没有选择记录,按下回车键后,会把当前定位的记录选中(如果有)
     * @private
     * @param {boolean} [isAllowTriggerSpaceEvent] 
     * @returns 
     * @memberof SuiDemoComboboxList
     */
    private confirm(isAllowTriggerSpaceEvent?: boolean) {
        if (!this.option.isMult) {
            //单选模式下,回车直接选择当前选中的行
            let focusRowEL = this.getFocusRowElement();
            if (!focusRowEL) {
                this.chooseSingleItem(0);
            } else {
                this.chooseSingleItem(this.getRowIndexByCellElement(this.getFocusRowElement()));
            }
            return;
        }
        //默认true
        if (isAllowTriggerSpaceEvent !== false) {
            isAllowTriggerSpaceEvent = true;
        }
        let results: any[] = [];
        let firstSelectItemIndex: number = -1;
        if (this.selectItems) {
            for (let rowIndex in this.selectItems) {
                results.push(this.selectItems[rowIndex]);
                if (firstSelectItemIndex == -1) {
                    firstSelectItemIndex = parseInt(rowIndex);
                }
            }
        }
        if (results.length == 0 && isAllowTriggerSpaceEvent === true) {
            //触发一次空格选中
            this.spaceToggleItem();
            this.confirm(false);
            return;
        }
        let ids = results.map(item => item.CustomerID);
        this.onAfterChooseItems(results, firstSelectItemIndex);
    }


    /**
     * 选择单条记录
     * 
     * @private
     * @param {number} rowIndex 
     * @returns 
     * @memberof SuiDemoComboboxList
     */
    private chooseSingleItem(rowIndex: number) {

        if (this.utils.classUtil.notExits(rowIndex) || rowIndex < 0) {
            this.onAfterChooseItems([], rowIndex);
            return;
        }
        let item = this.getItems()[rowIndex];
        if (!item) {
            this.utils.logs.throwError("selected single item faile, can't find the item", rowIndex, this.getItems());
        }
        this.onAfterChooseItems([item.originalItem], rowIndex);
    }

    private onAfterChooseItems(items: any[], firstSelectItemIndex: number) {
        items = items || [];
        // if (this.utils.arrayUtil.isNotEmptyArray(items)) {
        this.clearSelection();
        if (items.length == 1) {
            this.selectIndex(firstSelectItemIndex);
        }
        if (!this.option.isMult) {
            items = items[0];
        }
        if (this.utils.classUtil.isFunction(this.option.beforeSelectData)) {
            if (!this.option.beforeSelectData(items)) {
                return;
            }
        }
        this.option.selectData(items);
        this.close();
        this.focus();
        this.selectItems = {};
        // }
    }

    /**
     * 查询更多记录
     * 
     * @private
     * @memberof SuiDemoComboboxList
     */
    private searchMoreItem() {
        this.option.goToAdvanceSearch(this.val());
        this.close();
    }

    private refreshItemCount() {
        let chooseItemCountEL: HTMLSpanElement = this.listboxRootEL.querySelector("#chooseItemCount") as HTMLSpanElement;
        if (chooseItemCountEL) {
            let count = 0;
            for (let key in this.selectItems) {
                count++;
            }
            chooseItemCountEL.innerText = (count).toString();
        }
    }

    private verticalScrollIsHiden() {
        let verticalScrollBarinnerListBoxjqxWidgetEL: HTMLElement = this.listboxRootEL.querySelector("#verticalScrollBarinnerListBoxjqxWidget" + this.uuid) as HTMLElement;
        if (verticalScrollBarinnerListBoxjqxWidgetEL.style.visibility == "hidden") {
            return true;
        }
        return this.utils.domHandler.elementIsHide(verticalScrollBarinnerListBoxjqxWidgetEL);
    }

    private horizontalScrollIsHiden() {
        let horizontalScrollBarinnerListBoxjqxWidgetEL: HTMLElement = this.listboxRootEL.querySelector("#horizontalScrollBarinnerListBoxjqxWidget" + this.uuid) as HTMLElement;
        if (horizontalScrollBarinnerListBoxjqxWidgetEL.style.visibility == "hidden") {
            return true;
        }
        return this.utils.domHandler.elementIsHide(horizontalScrollBarinnerListBoxjqxWidgetEL);
    }

    private refreshListbox() {
        if (!this.listboxRootEL) {
            return;
        }
        this.listboxRootEL.style.height = ((this.attrDropDownHeight as any) * 1 + this.footerHeight + this.headerHeight) + "px";
        if (this.headerHeight > 0) {
            let originHeight: number = this.utils.classUtil.toNum(this.listBoxContentinnerListBoxEL.style.height.replace("px", ""));
            this.listBoxContentinnerListBoxEL.style.height = (originHeight + this.headerHeight) + "px";
            this.setListBoxContentPaddingTop(this.headerHeight);

            let innerListBoxjqxWidgetEL: HTMLElement = this.listboxRootEL.querySelector("#innerListBoxjqxWidget" + this.uuid) as HTMLElement;
            let _originHeight: number = this.utils.classUtil.toNum(innerListBoxjqxWidgetEL.style.height.replace("px", ""));
            innerListBoxjqxWidgetEL.style.height = (_originHeight + this.headerHeight) + "px";

            //纵向滚动条
            if (!this.verticalScrollIsHiden()) {
                let verticalScrollBarinnerListBoxjqxWidgetEL: HTMLElement = this.listboxRootEL.querySelector("#verticalScrollBarinnerListBoxjqxWidget" + this.uuid) as HTMLElement;
                let originTop: number = this.utils.classUtil.toNum(verticalScrollBarinnerListBoxjqxWidgetEL.style.top.replace("px", ""));
                verticalScrollBarinnerListBoxjqxWidgetEL.style.top = (this.headerHeight) + "px";
            }
            //横向滚动  
            if (!this.horizontalScrollIsHiden()) {
                let horizontalScrollBarinnerListBoxjqxWidgetEL: HTMLElement = this.listboxRootEL.querySelector("#horizontalScrollBarinnerListBoxjqxWidget" + this.uuid) as HTMLElement;
                let horizontalOriginTop: number = this.utils.classUtil.toNum(horizontalScrollBarinnerListBoxjqxWidgetEL.style.top.replace("px", ""));
                horizontalScrollBarinnerListBoxjqxWidgetEL.style.top = (horizontalOriginTop + this.headerHeight) + "px";
                let bottomRightinnerListBoxjqxWidgetEL: HTMLElement = this.listboxRootEL.querySelector("#bottomRightinnerListBoxjqxWidget" + this.uuid) as HTMLElement;
                bottomRightinnerListBoxjqxWidgetEL.style.top = horizontalScrollBarinnerListBoxjqxWidgetEL.style.top;
            }

        }

        let listitem = this.listboxRootEL.querySelectorAll(".jqx-listitem-element");
        let itemEL: HTMLElement;
        for (let listitemIndex = 0; listitemIndex < listitem.length; listitemIndex++) {
            //增加头的高度
            itemEL = listitem[listitemIndex] as HTMLElement;

            itemEL.addEventListener("mousedown", (event: any) => {
                if (event.button == KEYBOARD_VALUE.MOUSELEFT) {
                    //CTRL+鼠标左键
                    event.stopPropagation();
                    event.preventDefault();
                    // this.toggleItemByRowIndex(listitemIndex);
                    if (!this.option.isMult) {
                        //单选
                        this.chooseSingleItem(this.getRowIndexByCellElement(event.target));
                    } else {
                        if (event.ctrlKey === true) {
                            this.toggleItemByRowIndex(this.getRowIndexByCellElement(event.target));
                        } else {
                            //鼠标右键直接选中商品
                            this.chooseSingleItem(this.getRowIndexByCellElement(event.target));
                        }
                    }
                    return;
                }
            });
            itemEL.addEventListener("click", (event: any) => {
                event.stopPropagation();
                //不执行默认事件
                event.preventDefault();
            });

        }

    }

    private initHeader() {
        let html: string = this.getHeaderHtml();
        if (!html) {
            return;
        }
        this.headerHTML = document.createElement("div");
        this.headerHTML.style.width = ((this.attrDropDownWidth as any) * 1 + 2) + "px";
        this.headerHTML.style.top = /* "-" + this.headerHeight + */ "0";
        this.headerHTML.style.height = this.headerHeight + "px";
        this.headerHTML.style.lineHeight = this.headerHeight + "px";
        this.utils.domHandler.addClass(this.headerHTML, "sui-combobox-listbox-header");
        this.headerHTML.innerHTML = html;
        this.listboxRootEL.appendChild(this.headerHTML);
        this.myService.stopElementEvent(this.headerHTML);
    }

    private initFooter() {
        this.footerHTML = document.createElement("div");
        this.utils.domHandler.addClass(this.footerHTML, "sui-combobox-listbox-footer");
        // this.footerHTML.style.top = (this.dropDownHeight + this.headerHeight) + "px";
        this.footerHTML.style.bottom = "0px";
        this.footerHTML.style.height = this.footerHeight + "px";
        this.footerHTML.style.width = this.headerHTML.style.width;
        this.footerHTML.innerHTML = this.getFooterHtml()
        this.listboxRootEL.appendChild(this.footerHTML);
        this.confirmBtnEl = this.footerHTML.querySelector("#confirm");
        if (this.confirmBtnEl) {
            this.confirmBtnEl.addEventListener("click", (event) => {
                this.confirm();
            });
        }
        this.searchMoreEL = this.footerHTML.querySelector("#searchMore");
        if (this.searchMoreEL) {
            this.searchMoreEL.addEventListener("click", (event) => {
                this.searchMoreItem();
            });
        }
        let setFilterTermEL = this.footerHTML.querySelector("#setFilterTerm");
        if (setFilterTermEL) {
            setFilterTermEL.addEventListener("click", (event) => {
                this.filterTerm.setFiterTerm();
            });
        }
        this.cancelBtnEl = this.footerHTML.querySelector("#cancel");
        if (this.cancelBtnEl) {
            this.cancelBtnEl.addEventListener("click", (event) => {
                this.close();
            });
        }
        this.myService.stopElementEvent(this.footerHTML);

    }


    private initCellWidths() {
        this.fieldArray = this.option.fields.split(",");
        let avgWidth = (100.0 / this.fieldArray.length).toFixed(2) + "%";
        this.option.cellWidths = this.option.cellWidths || "";
        this.cellWidthArray = this.option.cellWidths.split(",");
        for (let index in this.fieldArray) {
            //不存在则取平均值
            this.cellWidthArray[index] = this.cellWidthArray[index] || avgWidth;
        }
    }

    private getHeaderHtml(): string {
        if (!this.option.titles) {
            return null;
        }
        let titles: string[] = this.option.titles.split(",");
        let html: string = "";
        let index: number = 0;
        for (let title of titles) {
            if (!title) {
                continue;
            }
            html += this.getCellHtml(title, -1, index, true);
            index++;
        }
        return html;
    }

    private getCellHtml(content: string, rowIndex: number, cellIndex: number, isHeader?: boolean): string {
        let className: string = isHeader ? "title" : "content";
        let styleStr = "";
        if (this.utils.classUtil.notExits(content)) {
            content = "";
        }
        let width: string = this.cellWidthArray[cellIndex];
        if (width) {
            styleStr = `style="width:${width}"`;
        }
        let multClass: string = "";
        if (cellIndex == 0 && this.option.isMult) {
            multClass = "sui-mult";
            if (!isHeader) {
                multClass += " sui-checkbox";
            }
        }
        let rowIndexStr: string = "";
        if (!isHeader && rowIndex >= 0) {
            rowIndexStr = `rowIndex="${rowIndex}"`;
        }
        return `<span ${rowIndexStr} title="${content}" class="${className} tx-overflow ${multClass}" ${styleStr} >${content}</span>`;
    }

    private getFooterHtml() {
        let hotkeyValue = HOTKEYS;
        let advanceSearchStr: string = "";
        if (this.utils.classUtil.isFunction(this.option.goToAdvanceSearch)) {
            advanceSearchStr = `<button id="searchMore" class="slic-btn slic-btn-theme1 fr mr">更多(${hotkeyValue.LISTBOX_MORE})</button> `;
        }
        return `
            <div class="sui-footer-info">
                <b>空格</b>或<b>CTRL+</b>鼠标左键 选中商品         
                <span class="c-txred  mr-xs">已选记录: <span id="chooseItemCount">0</span>条 </span>
                <span id="setFilterTerm"  class="slic-btn slic-btn-theme3">设置条件</span>
            </div>
            ${advanceSearchStr}
            <button id="cancel" class="slic-btn slic-btn-theme1 fr mr-xs">取消(${hotkeyValue.CANCEL})</button>  
            <button id="confirm" class="slic-btn slic-btn-theme1 fr mr-xs">确定(${hotkeyValue.ENTER})</button>  
        `;
    }



    private initMutation() {
        // Firefox和Chrome早期版本中带有前缀
        let _window = window as any;
        var MutationObserver = _window.MutationObserver || _window.WebKitMutationObserver || _window.MozMutationObserver;

        // 创建观察者对象
        this.mutationObserver = new MutationObserver((mutations) => {
            //垂直滚动到顶部,paddingTop设置为0
            let target: HTMLElement = mutations[0].target;
            if (!this.verticalScrollIsHiden() && target.getAttribute("id").indexOf("vertical") != -1) {
                let topValue: number = parseInt(target.style.top.replace("px", ""));
                if (topValue < 30) {
                    this.setListBoxContentPaddingTop(this.headerHeight);
                }
            }

            this.resetSelectState();
        });
    }

    private startMutation() {
        // 选择目标节点
        var verticalScroll = document.querySelector('#jqxScrollThumbverticalScrollBarinnerListBoxjqxWidget' + this.uuid);
        var horizontalScroll = document.querySelector('#jqxScrollThumbhorizontalScrollBarinnerListBoxjqxWidget' + this.uuid);
        // 配置观察选项:
        var config = {
            attributes: true,
            attributeFilter: ["style"]
        }
        this.mutationObserver.observe(verticalScroll, config);
        this.mutationObserver.observe(horizontalScroll, config);
        console.debug(" start listen...");
    }

    private stopMutation() {
        this.mutationObserver.disconnect();
        console.debug(" stop listen...");
    }

    __wireEvents__(): void {
        this.host.on('bindingComplete', (eventData: any) => {
            this.refreshListbox();
            this.onBindingComplete.emit(eventData);
        });
        this.host.on('checkChange', (eventData: any) => { this.onCheckChange.emit(eventData); });
        this.host.on('close', (eventData: any) => {
            this.stopMutation();
            this.onClose.emit(eventData);
        });
        this.host.on('change', (eventData: any) => { this.onChange.emit(eventData); if (eventData.args) if (eventData.args.item !== null) this["onChangeCallback"](eventData.args.item.label); });
        this.host.on('open', (eventData: any) => {
            this.refreshItemCount();
            this.startMutation();
            this.onOpen.emit(eventData);
        });
        this.host.on('select', (eventData: any) => { this.onSelect.emit(eventData); });
        this.host.on('unselect', (eventData: any) => { this.onUnselect.emit(eventData); });
    }


}