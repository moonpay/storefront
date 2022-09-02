import { NetworkChain, NetworkEnvironment, NetworkType, NFTContractType } from '../HyperMint/IContract';
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