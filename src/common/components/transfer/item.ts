export interface TransferItem {
    title: string;
    direction?: 'left' | 'right';
    disabled?: boolean;
    checked?: boolean;
    _hiden?: boolean;
    /* tslint:disable-next-line:no-any */
    [key: string]: any;
}

export interface TreeItem {
    // TreeItem properties
    id?: number;
    label?: string;
    value?: string;
    disabled?: boolean;
    checked?: boolean;
    element?: any;
    parentElement?: any;
    isExpanded?: boolean;
    selected?: boolean;
    direction?: 'left' | 'right';
}// TreeItem