/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, FC, useEffect, useState } from 'react';
import { ConfigType } from '../types/Config';
import { IContractContext, IContractProvider } from '../types/context/IContractContext';
import { IHyperMintContract, INFTContract } from '../types/HyperMint/IContract';

// @ts-ignore
const { Contract } = HyperMint;

export const ContractContext = createContext<IContractContext>({} as IContractContext);

export const ContractProvider: FC<IContractProvider> = ({ children, configurationImporter }) => {
    const [hyperMintContract, setHyperMintContract] = useState<IHyperMintContract>();
    const [nftContract, setNftContract] = useState<INFTContract>();

    useEffect(() => {
        (async () => {
            const config = await configurationImporter.loadConfig(ConfigType.CONTRACT);

            setHyperMintContract(new Contract(config));
        })();
    }, []);

    useEffect(() => {
        if (!hyperMintContract) return;

        (async () => {
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