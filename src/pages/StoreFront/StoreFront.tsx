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

    const getToken = async (token: IToken): Promise<any> => {
        try {
            const metadata = await hyperMintContract?.getTokenMetadata(token.id);

            return {
                id: token.id,
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
        // TODO: add type
        const tokensWithData = await Promise.all(contractTokens.map(token => getToken(token)));
        setContractTokens(tokensWithData);
    };

    useEffect(() => {
        if (!nftContract?.whitelists?.length) return;

        let privateSaleStart: Date | undefined;

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
        getContractTokens();
        setPrivateSaleDate(privateSaleStart);
    }, [nftContract]);

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div
                className={`${styles.hero} ${nftContract?.network.contractType === NFTContractType.ERC1155 && styles.erc1155Hero}`}
                style={{ backgroundImage: `url(${themeContext.images?.background})` }}
            >
                <Header
                    publicSaleLive={publicSaleLive}
                    privateSaleLive={privateSaleLive}
                    privateSaleDate={privateSaleDate}
                    setPublicSaleLive={setPublicSaleLive}
                    setPrivateSaleLive={setPrivateSaleLive}
                />


                <Container>
                    <div className={`${styles.heroGrid} ${contractIsERC721 ? styles.erc721HeroGrid : ''}`}>
                        <CollectionDetails />

                        {contractIsERC721 && (
                            <ERC721Checkout
                                token={contractTokens ? contractTokens[0] : undefined}
                                publicSaleLive={publicSaleLive}
                            />
                        )}
                    </div>
                </Container>
            </div>

            {!contractIsERC721 && (
                <main className={styles.main}>
                    <Container narrow>
                        <ERC1155Checkout
                            onSuccessfulPurchase={getContractTokens}
                            tokens={contractTokens ?? []}
                            publicSaleLive={publicSaleLive}
                        />
                    </Container>
                </main>
            )}

            <Footer
                className={contractIsERC721 ? styles.erc721Footer : ''}
            />
        </>
    );
};

export default StoreFront;