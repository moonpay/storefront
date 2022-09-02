import ConfigurationImporter from '../../utils/ConfigurationImporter';
import { IComponentWithChildren } from '../IComponentWithChildren';
import { IHyperMintContract, INFTContract } from './../HyperMint/IContract';

export interface IContractContext {
    hyperMintContract: IHyperMintContract;
    nftContract?: INFTContract;
}

export interface IContractProvider extends IComponentWithChildren {
    configurationImporter: ConfigurationImporter;
}