import { NgxCurrencyInputMode } from "ngx-currency";

export const itemsRowPerPage = [5, 10, 15, 20];
export const maxPages = 10;
export const customCurrencyMask = {
    align: "left",
    allowNegative: true,
    allowZero: true,
    decimal: ".", 
    precision: 0,
    prefix: "Rp. ",
    suffix: "",
    thousands: ",", 
    nullable: false,
    min: null,
    max: null,
    inputMode: NgxCurrencyInputMode.Financial
};
export const groupNames = [
    { id: 1, name: 'Frontend Team' },
    { id: 2, name: 'Backend Team' },
    { id: 3, name: 'Mobile Dev' },
    { id: 4, name: 'QA Engineers' },
    { id: 5, name: 'DevOps Squad' },
    { id: 6, name: 'Data Analysts' },
    { id: 7, name: 'Product Managers' },
    { id: 8, name: 'UI/UX Designers' },
    { id: 9, name: 'Security Team' },
    { id: 10, name: 'Infra Team' }
];

export const statusNames = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Inactive' },
];