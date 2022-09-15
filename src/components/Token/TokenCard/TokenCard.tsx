import { FC, SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import TokenAllocationBreakdown from '../TokenAllocationBreakdown/TokenAllocationBreakdown';
import TokenPurchaseButton from '../TokenPurchaseButton/TokenPurchaseButton';
import { WalletContext } from '../../../context/WalletContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import Modal from '../../Common/Modal';
import { ContentContext } from '../../../context/ContentContext';
import BuyWithCardButton from '../BuyWithCardButton';
import Toast from '../../../utils/Toast';
import NetworkHelpers from '../../../utils/NetworkHelpers';
import styles from './TokenCard.module.scss';

interface ITokenCardToken {
    id: number;
    description: string;
    external_url?: string | null
    image?: string;
    maxPerTransaction: number;
    name: string;
    price?: number;
    remaining: number;
    type: NFTContractType;
}

interface ITokenCard {
    token: ITokenCardToken; // TODO; use new token types
    publicSaleLive: boolean;
    allocation?: ITokenAllocationBreakdown[];
    onSuccessfulPurchase: (tokeId: number) => void;
}

const TotalFormatter = new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 3,
});

const TokenCard: FC<ITokenCard> = ({ token, publicSaleLive, allocation, onSuccessfulPurchase }) => {
    const content = useContext(ContentContext);
    const { nftContract, hyperMintContract } = useContext(ContractContext);
    const { connectedWallet, getConnectedWallet } = useContext(WalletContext);
    const [quantity, setQuantity] = useState(1);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [purchasing, setIsPurchasing] = useState(false);
    const [canPurchase, setCanPurchase] = useState(false);
    const [showingDetails, setShowingDetails] = useState(false);

    const isERC721Contract = useMemo(() => nftContract?.network.contractType === NFTContractType.ERC721, [nftContract]);
    const tokenSymbol = useMemo(() => nftContract ? NetworkHelpers.getSymbolForNetwork(nftContract.network.type) : 'ETH', [nftContract]);

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
    }, [allocation, token]);

    const inputError = useMemo(() => {
        if (maxAllocation === undefined) return false;

        return !!(quantity > maxAllocation);
    }, [quantity, maxAllocation]);

    const onPurchase = async (e: SyntheticEvent) => {
        e.preventDefault();

        setIsPurchasing(true);

        try {
            const method = publicSaleLive ? 'buy' : 'buyAuthorised';

            await hyperMintContract[method](quantity, Number(token.id), true);

            onSuccessfulPurchase(token.id);

            Toast.successToast('Purchase Complete 🎉');
        } catch (e) {
            const error = e as Error;
            const ignorableMessages = ['HM (connect) - Failed selecting wallet'];

            if (!ignorableMessages.includes(error.message)) {
                Toast.errorToast(error.message ?? 'Purchase failed');
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
                            <img
                                src={
                                    require(`../../../assets/icons/${isERC721Contract ? 'question' : 'info'}.png`)
                                }
                            />
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
                                        </div>

                                        <div className={styles.inputWrap}>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                value={quantity.toString()}
                                                className={`${styles.input} ${inputError && styles.inputWithError}`}
                                                onChange={e => setQuantity(Number(e.target.value))}
                                                min={1}
                                                max={maxAllocation && maxAllocation > 0 ? maxAllocation : undefined}
                                                disabled={token.remaining === 0}
                                            />

                                            {!!inputError && (
                                                <span className={styles.inputError}>Max quantity is {maxAllocation} per transaction</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.purchaseButtons}>
                                        <TokenPurchaseButton
                                            total={`${TotalFormatter.format(totalCost)} ${tokenSymbol}`}
                                            onPurchase={onPurchase}
                                            purchasing={purchasing}
                                            disabled={!!inputError}
                                            soldOut={token.remaining === 0}
                                        />

                                        {nftContract?.allowBuyWithMoonPay && token.remaining > 0 && (
                                            <BuyWithCardButton
                                                tokenId={Number(token.id)}
                                                disabled={!!inputError}
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