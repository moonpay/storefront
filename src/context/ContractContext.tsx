/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, FC, useEffect, useState } from 'react';
// import { useSigner } from 'wagmi';
import { ConfigType } from '../types/Config';
import { IContractContext, IContractProvider } from '../types/context/IContractContext';
import { IHyperMintContract, INFTContract } from '../types/HyperMint/IContract';

// @ts-ignore
const { Contract } = HyperMint;

export const ContractContext = createContext<IContractContext>({} as IContractContext);

export const ContractProvider: FC<IContractProvider> = ({ children, configurationImporter }) => {
    const [hyperMintContract, setHyperMintContract] = useState<IHyperMintContract>();
    const [nftContract, setNftContract] = useState<INFTContract>();
    // const { data: signer } = useSigner();

    useEffect(() => {
        const config = configurationImporter.loadConfig(ConfigType.CONTRACT);
        const contract: IHyperMintContract = new Contract(config);
        // contract.connect(signer);

        setHyperMintContract(contract);
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