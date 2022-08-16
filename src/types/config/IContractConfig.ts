
export enum NetworkType {
    ETHEREUM = 'ETHEREUM',
    POLYGON = 'POLYGON',
    SOLANA = 'SOLANA'
}

export enum NetworkEnvironment {
    EMULATOR = 'EMULATOR',
    TESTNET = 'TESTNET',
    MAINNET = 'MAINNET'
}

export enum NFTContractType {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155'
}

export enum NetworkChain {
    EVMLocal = 1337,
    ETHEREUM = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Goerli = 5,
    POLYGON = 137,
    Mumbai = 80001
}

export interface IContractConfig {
    contractId: string,
    contractAddress: string,
    contractType  : NFTContractType,
    networkEnvironment: NetworkEnvironment,
    networkType: NetworkType,
    networkChain: NetworkChain,
    enableLogging: boolean,
    hmURL?: string;
}