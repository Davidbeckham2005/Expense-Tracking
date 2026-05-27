export interface IDBTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: TTransactionType;
    category_id: string;
    note?: string;
    create_at?: string;
    transaction_date: string;
    tags?: string[],
    is_deleted: boolean;
}

export interface ICreateTransaction {
    amount: number;
    type: TTransactionType;
    category_id: string;
    note?: string;
    transaction_date: string;

    // tags?: string[],
}
export interface IUpdateTransactionDto {
    amount?: number;
    type?: TTransactionType;
    category_id?: string;
    note?: string;
    transaction_date?: string;
    // tags?: string[],
}

export interface ITransactionFormData {
    amount: number;
    type: TTransactionType;
    category_id: string;
    note?: string;
    transaction_date: string;
    tags?: string[],
}
export interface GroupedTransactions {
    income: number;
    balance: number;
    expense: number;
    transactions: IDBTransaction[];
}
export type GroupedTransactionMap = Record<string, GroupedTransactions>;
export type TTransactionType = 'income' | 'expense';