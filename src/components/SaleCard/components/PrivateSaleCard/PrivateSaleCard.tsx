import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ContractContext } from '../../../../context/ContractContext';
import { WalletContext } from '../../../../context/WalletContext';
import ConnectWalletButton from '../../../Wallet/ConnectWalletButton';
import styles from './PrivateSaleCard.module.scss';

const PrivateSaleCard: FC = () => {
    const walletContext = useContext(WalletContext);
    const contractContext = useContext(ContractContext);
    const [isOnEarlyAccessList, setIsOnEarlyAccessList] = useState(false);
    const { isConnected, address } = useAccount({
        onConnect: async ({ address }) => {
            await getWalletAllocation(address);
        }
    });

    const canAccessPrivateSale = useMemo(() => isConnected && isOnEarlyAccessList, [isConnected, isOnEarlyAccessList]);
    const cantAccessPrivateSale = useMemo(() => isConnected && !isOnEarlyAccessList, [isConnected, isOnEarlyAccessList]);

    const getWalletAllocation = async (walletAddress?: string) => {
        if (!walletAddress) {
            setIsOnEarlyAccessList(false);
            return;
        }

        const contract = contractContext.hyperMintContract;

        // TODO: need to get tokenId (0 for 721, param for 1155)
        const tokenAllocation = await contract?.getTokenAllocation('0', walletAddress)
            .catch(() => {
                setIsOnEarlyAccessList(false);
            });

        if (tokenAllocation?.length) {
            setIsOnEarlyAccessList(true);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            getWalletAllocation(address);
        }
    }, [isConnected, address]);

    // This is where we show the purchase flow
    if (canAccessPrivateSale) return null;

    if (cantAccessPrivateSale) {
        return (
            <article className={styles.card}>
                <div className={styles.cardContentBlock}>
                    <h2 className={`${styles.cardContent} ${styles.cardHeader}`}>Oops that wallet is not on the access list</h2>
                    <p className={styles.cardContent}>Wallet {walletContext?.connectedWallet?.formattedAddress} does not appear to be on the access list for early access. Check back during the public sale or disconnect to try again.</p>
                </div>

                <ConnectWalletButton canAccessPrivateSale={isOnEarlyAccessList} />
            </article>
        );
    }

    return (
        <article className={styles.card}>
            <div className={styles.cardContentBlock}>
                <h2 className={`${styles.cardContent} ${styles.cardHeader}`}>The private sale is live</h2>
                <p className={styles.cardContent}>All private access list members are now free to begin purchasing tokens according to their allocation.</p>
            </div>

            <ConnectWalletButton canAccessPrivateSale={isOnEarlyAccessList} />
        </article>
    );
};

export default PrivateSaleCard;