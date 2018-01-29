/**
 * 表格列类型
 */
export interface GridColumnType {
    // GridColumnType properties
    Number?: string;
    checkbox?: (threestatecheckbox: Boolean) => void;
    numberinput?: string;
    dropdownlist?: string;
    combobox?: string;
    datetimeinput?: string;
    textbox?: string;
    template?: string;
    custom?: string;
}// GridColumnType

/**
 * 表格列信息
 */
export interface GridColumnDef {
    // GridColumn properties
    text?: string;
    datafield?: string;
    displayfield?: string;
    sortable?: boolean;
    filterable?: boolean;
    filter?: (cellValue?: any, rowData?: any, dataField?: String, filterGroup?: any, defaultFilterResult?: any) => any;
    hideable?: boolean;
    hidden?: boolean;
    groupable?: boolean;
    menu?: boolean;
    exportable?: boolean;
    columngroup?: string;
    enabletooltips?: boolean;
    renderer?: (defaultText?: String, alignment?: String, height?: Number) => String;
    rendered?: (columnHeaderElement?: any) => void;
    cellsrenderer?: (row?: Number, columnfield?: String, value?: any, defaulthtml?: String, columnproperties?: any, rowdata?: any) => String;
    columntype?: string;
    validation?: (cell?: any, value?: Number) => any;
    createwidget?: (row: any, column: any, value: String, cellElement: any) => void;
    initwidget?: (row: Number, column: String, value: String, cellElement: any) => void;
    createfilterwidget?: (column: any, htmlElement: any, editor: any) => void;
    createfilterpanel?: (datafield: String, filterPanel: any) => void;
    initeditor?: (row: Number, cellvalue: any, editor: any, celltext: any, pressedChar: String, callback: any) => void;
    createeditor?: (row: Number, cellvalue: any, editor: any, celltext: any, cellwidth: any, cellheight: any) => void;
    destroyeditor?: (row: Number, callback: any) => void;
    geteditorvalue?: (row: Number, cellvalue:any, editor:any) => any;
    cellbeginedit?: (row: Number, datafield: String, columntype: String) => Boolean;
    cellendedit?: (row: Number, datafield: String, columntype: String, oldvalue: any, newvalue: any) => Boolean;
    cellvaluechanging?: (row: Number, datafield: String, columntype: String, oldvalue: any, newvalue: any) => String;
    createeverpresentrowwidget?: (datafield: String, htmlElement: any, popup: any, addRowCallback: any) => any;
    initeverpresentrowwidget?: (datafield: String, htmlElement: any, popup: any) => void;
    reseteverpresentrowwidgetvalue?: (htmlElement: any) => void;
    geteverpresentrowwidgetvalue?: (datafield: String, htmlElement: any) => any;
    destroyeverpresentrowwidget?: (htmlElement: any) => void;
    validateeverpresentrowwidgetvalue?: (datafield: String, value: any, rowValues: any) => Boolean;
    cellsformat?: string;
    aggregates?: any;
    align?: string;
    cellsalign?: string;
    width?: Number | String;
    minwidth?: any;
    maxwidth?: any;
    resizable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    classname?: string;
    pinned?: boolean;
    nullable?: boolean;
    filteritems?: any;
    filterdelay?: number;
    filtertype?: string;
    filtercondition?: string;
}// GridColumn