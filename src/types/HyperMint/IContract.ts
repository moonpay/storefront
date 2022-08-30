import { ethers } from 'ethers';
import { IToken, ITokenMetadata, ITokenAllocationBreakdown } from './IToken';
import { ITransaction, TransactionStatus } from './ITransaction';

export enum NFTContractMetadataType {
    NONE = 'NONE',
    HOSTED = 'HOSTED',
    URL = 'URL'
}

interface INFTContractWhitelist {
    startDate?: string | null;
    endDate?: string | null;
}
export interface INFTContract {
    name: string;
    symbol: string;
    allowBuyOnNetwork: boolean;
    publicSaleAt?: Date;
    saleClosesAt?: Date;
    erc721Price?: number;
    erc721MaxPerTransaction?: number;
    whitelists: INFTContractWhitelist[];
    metadata: {
        type: NFTContractMetadataType;
        contractUrl?: string;
        tokenUrl?: string;
    };
}

export interface IHyperMintContract {
    connect: () => void;
    disconnect: () => void;
    getContractInformation: () => Promise<INFTContract>;
    getTokenBalance: () => Promise<number>;
    getTokens: () => Promise<IToken[]>;
    getToken: (tokenId: number) => Promise<IToken>;
    getTokenAllocation: (tokenId: string, walletAddress: string) => Promise<ITokenAllocationBreakdown[]>;
    getTokenMetadataUrl: (tokenId: number) => Promise<string>;
    getTokenMetadata: (tokenId: number) => Promise<ITokenMetadata>;
    getTransactionStatus: (transaction: ITransaction) => Promise<TransactionStatus>;
    getWalletBalance: () => Promise<number>;
    getWalletAddress: () => Promise<string>;
    isWalletValid: () => Promise<boolean>;
    waitForTransaction: (transaction: ITransaction) => Promise<TransactionStatus>;
    buy: (amount: number, tokenId?: number, wait?: boolean) => Promise<ITransaction>;
    transfer: (to: string, tokenId: number, amount?: number) => Promise<ITransaction>;
    getMoonPayWidgetUrl: (tokenId?: number) => Promise<string>;
    buyAuthorised: (
        amount: number,
        tokenId: number,
        wait?: boolean,
        ethPrice?: number,
        maxPerAddress?: number,
        expires?: number,
        signature?: string
    ) => Promise<ITransaction>;
}
