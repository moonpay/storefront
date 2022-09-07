import { FC, useContext, useEffect, useState } from 'react';
import TokenCard from '../../Token/TokenCard';
import mysteryTokenImage from '../../../assets/token.png';
import { WalletContext } from '../../../context/WalletContext';
import { ContractContext } from '../../../context/ContractContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import PrivateSaleCard from '../PrivateSaleCard';
import { ThemeContext } from '../../../context/ThemeContext';
import Container from '../../Layout/Container';
import Footer from '../../Layout/Footer';
import Header from '../../Layout/Header';
import CollectionDetails from '../CollectionDetails';
import styles from './ERC721Checkout.module.scss';

interface IERC721Checkout {
    token?: any; // TODO: add token types
    publicSaleLive: boolean;
    privateSaleLive: boolean;
    privateSaleDate?: Date;
    setPublicSaleLive: (isLive: boolean) => void;
    setPrivateSaleLive: (isLive: boolean) => void;
}

const ERC721Checkout: FC<IERC721Checkout> = ({ token, publicSaleLive, privateSaleLive, privateSaleDate, setPublicSaleLive, setPrivateSaleLive }) => {
    const themeContext = useContext(ThemeContext);
    const { hyperMintContract, nftContract } = useContext(ContractContext);
    const { connectedWallet, isConnected } = useContext(WalletContext);
    const [canPurchase, setCanPurchase] = useState(false);
    const [allocation, setAllocation] = useState<ITokenAllocationBreakdown[]>();

    const getWalletAllocation = async (walletAddress?: string): Promise<ITokenAllocationBreakdown[]> => {
        if (!walletAddress) {
            return [];
        }

        const walletAllocation = await hyperMintContract?.getTokenAllocation('0', walletAddress)
            .catch(() => {
                setAllocation(undefined);
                return [];
            });

        setAllocation(walletAllocation);

        return walletAllocation ?? [];
    };

    useEffect(() => {
        if (publicSaleLive) {
            setCanPurchase(true);
        } else if (!isConnected) {
            setCanPurchase(false);
        } else {
            (async () => {
                const walletAllocation = await getWalletAllocation(connectedWallet?.address);

                return setCanPurchase(walletAllocation.length > 0);
            })();
        }
    }, [publicSaleLive, isConnected]);

    return (
        <>
            <Header
                publicSaleLive={publicSaleLive}
                privateSaleLive={privateSaleLive}
                privateSaleDate={privateSaleDate}
                setPublicSaleLive={setPublicSaleLive}
                setPrivateSaleLive={setPrivateSaleLive}
            />

            <div
                className={styles.hero}
                style={{ backgroundImage: `url(${themeContext.images?.background})` }}
            >
                <Container className={styles.container}>
                    <div className={styles.heroGrid}>
                        <CollectionDetails />

                        {canPurchase ? (
                            <div className={styles.limiter}>
                                <TokenCard
                                    token={{
                                        ...token,
                                        name: 'Mystery Token',
                                        description: 'Each NFT in this collection is completely unique. Once your purchase is processed, the image and details of your 1 of 1 token will be revealed to you. Until then, enjoy the thrill of claiming some mystery tokens.',
                                        image: mysteryTokenImage,
                                        maxPerTransaction: nftContract?.erc721MaxPerTransaction ?? 0,
                                        type: NFTContractType.ERC721
                                    }}
                                    publicSaleLive={publicSaleLive}
                                    allocation={allocation}
                                    onSuccessfulPurchase={async () => await getWalletAllocation(connectedWallet?.address)}
                                />
                            </div>
                        ) : (
                            <PrivateSaleCard />
                        )}
                    </div>
                </Container>

                <Footer />
            </div>
        </>
    );
};

export default ERC721Checkout;