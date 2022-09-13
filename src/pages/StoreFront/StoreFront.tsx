/* eslint-disable import/no-unresolved */
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ContractContext } from '../../context/ContractContext';
import ERC721Checkout from '../../components/Collection/ERC721Checkout';
import { IListToken, IToken } from '../../types/HyperMint/IToken';
import ERC1155Checkout from '../../components/Collection/ERC1155Checkout';
import { NFTContractType } from '../../types/HyperMint/IContract';
import Header from '../../components/Layout/Header';
import { WalletProvider } from '../../context/WalletContext';
import { ContentProvider } from '../../context/ContentContext';
import ConfigurationImporter from '../../utils/ConfigurationImporter';
import { AppContext } from '../../context/AppContext';
import { AppComponents } from '../../types/context/IAppContext';
import InfoBanner from '../../components/Layout/InfoBanner';

interface IStoreFront {
    configurationImporter: ConfigurationImporter;
}

const StoreFront: FC<IStoreFront> = ({ configurationImporter }) => {
    const appContext = useContext(AppContext);
    const { nftContract, hyperMintContract } = useContext(ContractContext);

    const [publicSaleLive, setPublicSaleLive] = useState(false);
    const [privateSaleLive, setPrivateSaleLive] = useState(false);
    const [privateSaleDate, setPrivateSaleDate] = useState<Date>();
    const [totalMintedTokens, setTotalMintedTokens] = useState<number>();
    const [contractTokens, setContractTokens] = useState<IToken[]>();
    const [showInfoBanner, setShowInfoBanner] = useState(true);

    const contractIsERC721 = useMemo(() => nftContract?.network.contractType === NFTContractType.ERC721, [nftContract]);

    const getToken = async (token: IListToken): Promise<IToken | undefined> => {
        try {
            const id = contractIsERC721 ? 0 : token.id;
            const metadata = await hyperMintContract?.getTokenMetadata(id);

            return {
                id,
                remaining: token.remaining,
                price: token.price,
                maxPerTransaction: token?.maxPerTransaction ?? nftContract?.erc721MaxPerTransaction,
                ...metadata
            };
        } catch (e) {
            console.log(
                `Failed to load token ${token.id} - ${(e as Error).message}`
            );
        }
    };

    const getContractTokens = async () => {
        const contractTokens = await hyperMintContract?.getTokens() ?? [];

        if ((contractTokens as any).error) {
            setContractTokens(undefined);
        }

        setTotalMintedTokens(
            contractTokens.reduce((prev, cur) => prev + cur.supply, 0)
        );

        const tokensWithData: any = contractIsERC721
            ? contractTokens
            : await Promise.all(contractTokens.map(token => getToken(token)));

        setContractTokens(tokensWithData as IToken[]);

        appContext.setLoadedComponents([
            ...appContext?.loadedComponents ?? [],
            AppComponents.Tokens
        ]);
    };

    const calculateAndSetPrivateSaleStart = () => {
        let privateSaleStart: Date | undefined;

        if (!nftContract?.whitelists.length) {
            setPrivateSaleDate(undefined);
            return;
        }

        if (nftContract.whitelists.length === 1) {
            const startDate = (nftContract.whitelists[0]?.startDate) ?? 0;
            privateSaleStart = new Date(startDate);
        } else {
            const orderedWhitelists = nftContract.whitelists.sort((a, b) => {
                const aStartDate = new Date(a?.startDate ?? 0);
                const bStartDate = new Date(b?.startDate ?? 0);

                return aStartDate.getTime() - bStartDate.getTime();
            });

            privateSaleStart = new Date(orderedWhitelists[0]?.startDate ?? 0);
        }

        setPrivateSaleDate(privateSaleStart);
    };

    useEffect(() => {
        if (nftContract) {
            calculateAndSetPrivateSaleStart();

            if (!contractTokens?.length) {
                getContractTokens();
            }
        }
    }, [nftContract]);

    return (
        <ContentProvider configurationImporter={configurationImporter}>
            <WalletProvider>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />

                {showInfoBanner && (
                    <InfoBanner onHide={() => setShowInfoBanner(false)} />
                )}

                <Header
                    publicSaleLive={publicSaleLive}
                    privateSaleLive={privateSaleLive}
                    privateSaleDate={privateSaleDate}
                    setPublicSaleLive={setPublicSaleLive}
                    setPrivateSaleLive={setPrivateSaleLive}
                    totalMintedTokens={totalMintedTokens}
                />

                {contractIsERC721 ? (
                    <ERC721Checkout
                        token={contractTokens ? contractTokens[0] : undefined}
                        publicSaleLive={publicSaleLive}
                        onSuccessfulPurchase={getContractTokens}
                    />
                ) : (
                    <ERC1155Checkout
                        onSuccessfulPurchase={getContractTokens}
                        tokens={contractTokens ?? []}
                        publicSaleLive={publicSaleLive}
                    />
                )}
            </WalletProvider>
        </ContentProvider>
    );
};

export default StoreFront;