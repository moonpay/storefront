import { FC, useContext, useMemo, useState } from 'react';
import Container from '../../Layout/Container';
import TokenCard from '../../Token/TokenCard';
import CollectionDetails from '../CollectionDetails';
import mysteryTokenImage from '../../../assets/token.png';
import SaleCard from '../../SaleCard';
import { WalletContext } from '../../../context/WalletContext';
import { ContractContext } from '../../../context/ContractContext';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import styles from './ERC721Checkout.module.scss';

interface IERC721Checkout {
    token?: any;
}

const ERC721Checkout: FC<IERC721Checkout> = ({ token }) => {
    const { hyperMintContract } = useContext(ContractContext);
    const { connectedWallet } = useContext(WalletContext);
    const [allocation, setAllocation] = useState<ITokenAllocationBreakdown[]>();
    const canPurchase = useMemo(() => {
        if (!connectedWallet) return false;

        (async () => {
            await setTimeout(async () => {
                await getWalletAllocation(connectedWallet.address);
            }, 1000);
        })();

        return true;
    }, [connectedWallet, hyperMintContract]);

    const getWalletAllocation = async (walletAddress?: string) => {
        if (!walletAddress) {
            return;
        }

        const tokenAllocation = await hyperMintContract?.getTokenAllocation('0', walletAddress)
            .catch(() => {
                setAllocation(undefined);
            });

        if (tokenAllocation?.length) {
            setAllocation(tokenAllocation);
        }
    };


    // if public sale open then anyone can purchase
    // if private sale open, get the allocation and then we can see if they are able to purchase

    return (
        <main className={styles.main}>
            <Container narrow>
                <div className={styles.layout}>
                    <CollectionDetails
                        privateSaleLive={true}
                        isPurchasing={canPurchase}
                    />

                    {canPurchase ? (
                        <TokenCard
                            token={{
                                id: token?.id,
                                name: 'Mystery Token',
                                image: {
                                    url: mysteryTokenImage
                                },
                            }}
                            allocation={allocation}
                            canPurchase
                        />
                    ) : (
                        <SaleCard
                            privateSaleLive={true}
                        />
                    )}

                    {/* If its 1155 - show grid */}
                </div>
            </Container>
        </main>
    );
};

export default ERC721Checkout;