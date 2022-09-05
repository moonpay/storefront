import { FC, useContext, useEffect, useState } from 'react';
import TokenCard from '../../Token/TokenCard';
import mysteryTokenImage from '../../../assets/token.png';
import { WalletContext } from '../../../context/WalletContext';
import { ContractContext } from '../../../context/ContractContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import PrivateSaleCard from '../PrivateSaleCard';
import styles from './ERC721Checkout.module.scss';

interface IERC721Checkout {
    token?: any; // TODO: add token types
    publicSaleLive: boolean;
}

const ERC721Checkout: FC<IERC721Checkout> = ({ token, publicSaleLive }) => {
    const { hyperMintContract } = useContext(ContractContext);
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

    if (!canPurchase) {
        return (
            <PrivateSaleCard />
        );
    }

    return (
        <div className={styles.limiter}>
            <TokenCard
                token={{
                    id: token?.id,
                    name: 'Mystery Token',
                    description: 'Each NFT in this collection is completely unique. Once your purchase is processed, the image and details of your 1 of 1 token will be revealed to you. Until then, enjoy the thrill of claiming some mystery tokens.',
                    image: mysteryTokenImage,
                    type: NFTContractType.ERC721
                }}
                publicSaleLive={publicSaleLive}
                allocation={allocation}
                onSuccessfulPurchase={async () => await getWalletAllocation(connectedWallet?.address)}
            />
        </div>
    );
};

export default ERC721Checkout;