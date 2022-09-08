import { FC, SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EVMWalletHelpers from '../../../utils/EVMWalletHelpers';
import { ContractContext } from '../../../context/ContractContext';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import TokenAllocationBreakdown from '../TokenAllocationBreakdown/TokenAllocationBreakdown';
import TokenPurchaseButton from '../TokenPurchaseButton/TokenPurchaseButton';
import { WalletContext } from '../../../context/WalletContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import Modal from '../../Common/Modal';
import { ContentContext } from '../../../context/ContentContext';
import BuyWithCardButton from '../BuyWithCardButton';
import styles from './TokenCard.module.scss';

interface ITokenCard {
    token: {
        id: string;
        name: string;
        maxPerTransaction: number;
        description?: string;
        external_url?: string;
        image: string;
        remaining: number;
        price?: number;
        type: NFTContractType
    };
    publicSaleLive: boolean;
    allocation?: ITokenAllocationBreakdown[];
    onSuccessfulPurchase: (tokeId: string) => void;
}

const TokenCard: FC<ITokenCard> = ({ token, publicSaleLive, allocation, onSuccessfulPurchase }) => {
    const content = useContext(ContentContext);
    const { nftContract, hyperMintContract } = useContext(ContractContext);
    const { connectedWallet, getConnectedWallet } = useContext(WalletContext);
    const [quantity, setQuantity] = useState(1);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [purchasing, setIsPurchasing] = useState(false);
    const [canPurchase, setCanPurchase] = useState(false);
    const [showingDetails, setShowingDetails] = useState(false);

    const doesWalletHaveAllocation = async (walletAddress?: string): Promise<boolean> => {
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

        if (publicSaleLive && buyingEnabled) {
            setCanPurchase(true);
        } else if (!connectedWallet || !buyingEnabled) {
            setCanPurchase(false);
        } else {
            (async () => {
                const hasAllocation = await doesWalletHaveAllocation(connectedWallet.address);

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
        let maxPerTransaction = token.maxPerTransaction;
        const remainingCount = token.remaining;

        if (!remainingCount) {
            return 0; // Token has sold out
        }

        // 0 means unlimited per transaction
        if (maxPerTransaction === 0) {
            // We cant buy more than how many are remaining
            maxPerTransaction = remainingCount;
        }

        if (!allocation) {
            return Math.min(maxPerTransaction, remainingCount);
        }

        const remainingAllocation = allocation.reduce((prev, cur) => {
            const remaining = cur?.remainingAllocation ?? Math.min(maxPerTransaction, remainingCount);

            return prev + remaining;
        }, 0);

        return remainingAllocation;
    }, [allocation]);

    const inputHasError = useMemo(() => {
        if (maxAllocation === undefined) return false;

        return !!(quantity > maxAllocation);
    }, [quantity, maxAllocation]);

    const onPurchase = async (e: SyntheticEvent) => {
        e.preventDefault();

        setIsPurchasing(true);
        const styles = getComputedStyle(document.body);

        try {
            const method = publicSaleLive ? 'buy' : 'buyAuthorised';

            await hyperMintContract[method](quantity, Number(token.id), true);

            onSuccessfulPurchase(token.id);

            toast('Purchase Complete 🎉', {
                style: {
                    background: `rgba(${styles.getPropertyValue('--color-state-success')})`,
                    color: `rgb(${styles.getPropertyValue('--color-white')})`
                }
            });
        } catch (e) {
            const error = e as Error;
            const ignorableMessages = ['HM (connect) - Failed selecting wallet'];

            if (!ignorableMessages.includes(error.message)) {
                toast(error.message ?? 'Purchase failed', {
                    style: {
                        background: `rgb(${styles.getPropertyValue('--color-state-error')})`,
                        color: `rgb(${styles.getPropertyValue('--color-white')})`
                    }
                });
            }
        }

        await getConnectedWallet();

        setIsPurchasing(false);
    };

    if (token?.remaining === 0 && content?.hideSoldOutTokens) {
        return null;
    }

    return (
        <>
            {token.description && (
                <Modal
                    isOpen={showingDetails}
                    onClose={() => setShowingDetails(false)}
                    header={<h2 className={styles.modalHeader}>{token.name} Description</h2>}
                    content={
                        <div>
                            <p className={styles.modalDescription}>{token.description}</p>
                        </div>
                    }
                />
            )}

            <article className={styles.card}>
                <div className={styles.cardInner}>
                    <header className={styles.header}>
                        <h4 className={styles.title}>{token?.name}</h4>

                        <div
                            tabIndex={0}
                            onClick={() => setShowingDetails(!showingDetails)}
                            className={styles.infoIcon}
                        >
                            <img src={require('../../../assets/icons/info.png')} />
                        </div>
                    </header>

                    <main>
                        <div className={styles.imageWrap}>
                            <img
                                src={token?.image}
                                className={styles.image}
                            />

                            {token.remaining !== undefined && (
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

                                <form onSubmit={e => e.preventDefault()}>
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
                                                value={quantity.toString()}
                                                className={`${styles.input} ${inputHasError && styles.inputError}`}
                                                onChange={e => setQuantity(Number(e.target.value))}
                                                min={1}
                                                max={maxAllocation && maxAllocation > 0 ? maxAllocation : undefined}
                                                disabled={token.remaining === 0}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.purchaseButtons}>
                                        <TokenPurchaseButton
                                            total={EVMWalletHelpers.formatBalance(totalCost.toString(), nftContract)}
                                            onPurchase={onPurchase}
                                            purchasing={purchasing}
                                            disabled={inputHasError}
                                            soldOut={token.remaining === 0}
                                        />

                                        {nftContract?.allowBuyWithMoonPay && token.remaining > 0 && (
                                            <BuyWithCardButton
                                                tokenId={Number(token.id)}
                                                disabled={inputHasError}
                                            />
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </article>
        </>
    );
};

export default TokenCard;