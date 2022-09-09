import { FC, useContext, useEffect, useState } from 'react';
import TokenCard from '../../Token/TokenCard';
import mysteryTokenImage from '../../../assets/token.png';
import { WalletContext } from '../../../context/WalletContext';
import { ContractContext } from '../../../context/ContractContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import { IToken, ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import PrivateSaleCard from '../PrivateSaleCard';
import { ThemeContext } from '../../../context/ThemeContext';
import Container from '../../Layout/Container';
import Footer from '../../Layout/Footer';
import CollectionDetails from '../CollectionDetails';
import styles from './ERC721Checkout.module.scss';

interface IERC721Checkout {
    token?: IToken;
    publicSaleLive: boolean;
    onSuccessfulPurchase: () => void;
}

const ERC721Checkout: FC<IERC721Checkout> = ({ token, publicSaleLive, onSuccessfulPurchase }) => {
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

    const onPurchase = async () => {
        await onSuccessfulPurchase();
        await getWalletAllocation(connectedWallet?.address);
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
        <div
            className={styles.hero}
            style={{ backgroundImage: `url(${themeContext.images?.background})` }}
        >
            <Container className={styles.container}>
                <div className={styles.heroGrid}>
                    <CollectionDetails />

                    {(canPurchase && token) ? (
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
                                onSuccessfulPurchase={onPurchase}
                            />
                        </div>
                    ) : (
                        <PrivateSaleCard />
                    )}
                </div>
            </Container>

            <Footer />
        </div>
    );
};

export default ERC721Checkout;