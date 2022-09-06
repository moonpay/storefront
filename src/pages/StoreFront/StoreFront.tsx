/* eslint-disable import/no-unresolved */
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Footer from '../../components/Layout/Footer';
import Header from '../../components/Layout/Header';
import { ContractContext } from '../../context/ContractContext';
import { ThemeContext } from '../../context/ThemeContext';
import ERC721Checkout from '../../components/Collection/ERC721Checkout';
import { IToken } from '../../types/HyperMint/IToken';
import ERC1155Checkout from '../../components/Collection/ERC1155Checkout';
import Container from '../../components/Layout/Container';
import CollectionDetails from '../../components/Collection/CollectionDetails';
import { NFTContractType } from '../../types/HyperMint/IContract';
import styles from './StoreFront.module.scss';

const StoreFront: FC = () => {
    const { nftContract, hyperMintContract } = useContext(ContractContext);
    const themeContext = useContext(ThemeContext);

    const [publicSaleLive, setPublicSaleLive] = useState(false);
    const [privateSaleLive, setPrivateSaleLive] = useState(false);
    const [privateSaleDate, setPrivateSaleDate] = useState<Date>();
    const [contractTokens, setContractTokens] = useState<any[]>();

    const contractIsERC721 = useMemo(() => nftContract?.network.contractType === NFTContractType.ERC721, [nftContract]);
    const showERC721Layout = useMemo(() => contractIsERC721 || !contractTokens?.length, [contractTokens, contractIsERC721]);

    const getToken = async (token: IToken): Promise<any> => {
        try {
            const id = contractIsERC721 ? 1 : token.id;
            const metadata = await hyperMintContract?.getTokenMetadata(id);

            return {
                id,
                remaining: token.remaining,
                price: token.price,
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

        // TODO: improve error handling
        if ((contractTokens as any).error) {
            setContractTokens(undefined);
        }

        // TODO: add type
        const tokensWithData = await Promise.all(contractTokens.map(token => getToken(token)));

        setContractTokens(tokensWithData);
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
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div
                className={`${styles.hero} ${!showERC721Layout && styles.erc1155Hero}`}
                style={{ backgroundImage: `url(${themeContext.images?.background})` }}
            >
                <Header
                    publicSaleLive={publicSaleLive}
                    privateSaleLive={privateSaleLive}
                    privateSaleDate={privateSaleDate}
                    setPublicSaleLive={setPublicSaleLive}
                    setPrivateSaleLive={setPrivateSaleLive}
                />

                <div>
                    <Container>
                        <div className={styles.heroGrid}>
                            <CollectionDetails />

                            {contractIsERC721 && (
                                <ERC721Checkout
                                    token={contractTokens ? contractTokens[0] : undefined}
                                    publicSaleLive={publicSaleLive}
                                />
                            )}
                        </div>
                    </Container>

                    {contractIsERC721 && (
                        <Footer />
                    )}
                </div>

            </div>

            {!showERC721Layout && (
                <>
                    <main className={styles.main}>
                        <Container narrow>
                            <ERC1155Checkout
                                onSuccessfulPurchase={getContractTokens}
                                tokens={contractTokens ?? []}
                                publicSaleLive={publicSaleLive}
                            />
                        </Container>
                    </main>

                    <Footer />
                </>
            )}
        </>
    );
};

export default StoreFront;