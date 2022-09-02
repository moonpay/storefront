/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, FC, useEffect, useMemo, useState } from 'react';
import { ConfigType } from '../types/Config';
import { IContractContext, IContractProvider } from '../types/context/IContractContext';
import { IHyperMintContract, INFTContract } from '../types/HyperMint/IContract';
import ConfigurationImporter from '../utils/ConfigurationImporter';

// @ts-ignore
const { Contract } = HyperMint;

export const ContractContext = createContext<IContractContext>({} as IContractContext);

const contractConfig = (new ConfigurationImporter()).loadConfig(ConfigType.CONTRACT);
export const ContractProvider: FC<IContractProvider> = ({ children }) => {
    const [nftContract, setNftContract] = useState<INFTContract>();
    const hyperMintContract = useMemo<IHyperMintContract>(() => {
        return new Contract(contractConfig);
    }, []);

    useEffect(() => {
        (async () => {
            // TODO: need to handle a non deployed contract error here
            const contractInfo = await hyperMintContract.getContractInformation();

            setNftContract(contractInfo);
        })();
    }, [hyperMintContract]);

    return (
        <ContractContext.Provider value={{ hyperMintContract, nftContract }}>
            {children}
        </ContractContext.Provider>
    );
};