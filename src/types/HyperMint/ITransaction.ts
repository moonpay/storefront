export interface ITransaction {
    hash: string;
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETE = 'COMPLETE',
    FAILED = 'FAILED'
}