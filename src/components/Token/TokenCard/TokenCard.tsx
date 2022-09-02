import { FC, SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EthereumWalletHelpers from '../../../utils/EthereumWalletHelpers';
import { ContractContext } from '../../../context/ContractContext';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import TokenAllocationBreakdown from '../TokenAllocationBreakdown';
import TokenPurchaseButton from '../TokenPurchaseButton';
import { WalletContext } from '../../../context/WalletContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import styles from './TokenCard.module.scss';

interface ITokenCard {
    token: {
        id: string;
        name: string;
        external_url?: string;
        image: string;
        remaining?: number;
        price?: number;
        type: NFTContractType
    };
    publicSaleLive: boolean;
    allocation?: ITokenAllocationBreakdown[];
}

const TokenCard: FC<ITokenCard> = ({ token, publicSaleLive, allocation }) => {
    const { nftContract, hyperMintContract } = useContext(ContractContext);
    const { connectedWallet } = useContext(WalletContext);
    const [quantity, setQuantity] = useState(1);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [purchasing, setIsPurchasing] = useState(false);

    const [canPurchase, setCanPurchase] = useState(false);

    const getWalletAllocation = async (walletAddress?: string): Promise<boolean> => {
        // We pass in allocation for 721 contracts
        if (allocation !== undefined) {
            return allocation?.length > 0;
        }

        if (!walletAddress) {
            return false;
        }

        // Currently there is no support for 1155 token allocation.
        return false;
    };

    useEffect(() => {
        const buyingEnabled = nftContract?.allowBuyOnNetwork || nftContract?.allowBuyWithMoonPay;

        if (publicSaleLive) {
            setCanPurchase(true);
        } else if (!connectedWallet || !(buyingEnabled)) {
            setCanPurchase(false);
        } else {
            (async () => {
                const hasAllocation = await getWalletAllocation(connectedWallet.address);

                return setCanPurchase(hasAllocation);
            })();
        }
    }, [connectedWallet, publicSaleLive, allocation]);

    const totalCost = useMemo(() => {
        if (token.type === NFTContractType.ERC1155) {
            if (!token.price) {
                console.error('ERC1155 tokens require a price to be set');
                return 0;
            } else {
                return token?.price * quantity;
            }
        }

        if (!allocation) {
            return nftContract?.erc721Price ? quantity * nftContract?.erc721Price : 0;
        }

        let cost = 0;
        let remainingQuantity = quantity;

        for (let i = 0; i < quantity; i++) {
            for (const priceBracket of allocation) {
                const remainingAllocation = priceBracket.remainingAllocation ?? quantity;
                const quantityToTakeFromBracket = Math.min(remainingQuantity, remainingAllocation);

                cost += quantityToTakeFromBracket * priceBracket.pricePerToken;
                remainingQuantity -= quantityToTakeFromBracket;
            }
        }

        return cost;
    }, [quantity, allocation]);

    const maxAllocation = useMemo(() => {
        const maxPerTransaction = nftContract?.erc721MaxPerTransaction;

        if (!allocation) {
            return maxPerTransaction ?? 0;
        }

        const remainingAllocationCount = allocation.reduce((prev, cur) => {
            const allowedCount = cur.remainingAllocation ?? nftContract?.erc721MaxPerTransaction ?? 0;

            return prev + allowedCount;
        }, 0);

        return Math.min(remainingAllocationCount, (maxPerTransaction ?? remainingAllocationCount));
    }, [allocation]);

    const onPurchase = async (e: SyntheticEvent) => {
        e.preventDefault();

        setIsPurchasing(true);
        const styles = getComputedStyle(document.body);

        try {
            const method = publicSaleLive ? 'buy' : 'buyAuthorised';

            await hyperMintContract[method](quantity, 1, true);

            toast('Purchase Complete 🎉', {
                style: {
                    background: `rgba(${styles.getPropertyValue('--color-state-success')})`,
                    color: `rgb(${styles.getPropertyValue('--color-white')})`
                }
            });
        } catch (e) {
            toast((e as Error)?.message ?? 'Purchase failed', {
                style: {
                    background: `rgb(${styles.getPropertyValue('--color-state-error')})`,
                    color: `rgb(${styles.getPropertyValue('--color-white')})`
                }
            });
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <h4 className={styles.title}>{token?.name}</h4>

                <div tabIndex={0}>
                    <img src={require('../../../assets/icons/info.png')} />
                </div>
            </header>

            <main>
                <div className={styles.imageWrap}>
                    <img
                        src={token?.image}
                        className={styles.image}
                    />

                    {token.remaining && (
                        <div className={styles.remainingCounter}>
                            <p>{token.remaining} left</p>
                        </div>
                    )}
                </div>

                {canPurchase && (
                    <div className={styles.form}>
                        <TokenAllocationBreakdown
                            allocation={allocation}
                            setShowBreakdown={setShowBreakdown}
                            showBreakdown={showBreakdown}
                        />

                        <form action="" onSubmit={e => e.preventDefault()}>
                            <div className={showBreakdown ? styles.breakdownShowing : styles.quantityInput}>
                                <div className={styles.inputHeader}>
                                    <label htmlFor="quantity" className={styles.inputContent}>Quantity</label>

                                    {maxAllocation > 0 && (
                                        <span className={styles.inputContent}>Max. {maxAllocation}</span>
                                    )}
                                </div>

                                <div className={styles.inputWrap}>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={quantity}
                                        className={styles.input}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                        min={1}
                                        max={maxAllocation > 0 ? maxAllocation : undefined}
                                    />
                                </div>
                            </div>

                            <TokenPurchaseButton
                                total={EthereumWalletHelpers.formatBalance(totalCost.toString(), 'ETH')}
                                onPurchase={onPurchase}
                                purchasing={purchasing}
                            />
                        </form>
                    </div>
                )}
            </main>
        </article>
    );
};

export default TokenCard;