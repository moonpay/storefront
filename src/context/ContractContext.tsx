/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, FC, useEffect, useMemo, useState } from 'react';
import PreDeploymentPage from '../pages/PreDeploymentPage';
import { ConfigType } from '../types/Config';
import { IContractContext, IContractProvider } from '../types/context/IContractContext';
import { IHyperMintContract, INFTContract } from '../types/HyperMint/IContract';
import ConfigurationImporter from '../utils/ConfigurationImporter';

// @ts-ignore
const { Contract } = HyperMint;

export const ContractContext = createContext<IContractContext>({} as IContractContext);

const contractConfig = (new ConfigurationImporter()).loadConfig(ConfigType.CONTRACT);
export const ContractProvider: FC<IContractProvider> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [nftContract, setNftContract] = useState<INFTContract>();
    const hyperMintContract = useMemo<IHyperMintContract>(() => {
        // TODO: fix this running twice
        const params = new URLSearchParams(document.location.search);
        const contractParam = params.get('contract');
        if (contractParam) {
            return new Contract(JSON.parse(contractParam));
        }
        else {
            return new Contract(contractConfig);
        }
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const contractInfo = await hyperMintContract.getContractInformation();

                // TODO: make client SDK throw errors
                if ((contractInfo as any).error) {
                    throw new Error();
                }

                setNftContract(contractInfo);
            } catch (e) {
                setNftContract(undefined);
            }

            setLoading(false);
        })();
    }, [hyperMintContract]);

    if (!loading && !nftContract) {
        return (
            <PreDeploymentPage />
        );
    }

    return (
        <ContractContext.Provider value={{ hyperMintContract, nftContract }}>
            {children}
        </ContractContext.Provider>
    );
};