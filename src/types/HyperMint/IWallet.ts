export interface IWallet {
    isConnected: boolean;
    address?: string;
    balance?: IWalletBalance
}

export interface IWalletBalance {
    value: string;
    formatted: string;
    symbol: string;
}