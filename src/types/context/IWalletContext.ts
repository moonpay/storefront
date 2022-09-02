import { IComponentWithChildren } from '../IComponentWithChildren';

export interface IConnectedWallet {
    address: string;
    formattedAddress: string;
    formattedBalance: string;
}

export interface IWalletContext {
    connectedWallet?: IConnectedWallet;
    connect: (() => void) | undefined;
    disconnect: (() => void) | undefined;
    isConnected: boolean;
}

export type IWalletProvider = IComponentWithChildren;