import { FC, useContext, useMemo, useState } from 'react';
import EthereumWalletHelpers from '../../../utils/EthereumWalletHelpers';
import { ContractContext } from '../../../context/ContractContext';
import { ITokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import TokenAllocationBreakdown from '../TokenAllocationBreakdown';
import TokenPurchaseButton from '../TokenPurchaseButton';
import styles from './TokenCard.module.scss';

interface ITokenCard {
    token?: {
        id?: string;
        name: string;
        image?: {
            url?: string;
            alt?: string;
        };
    },
    canPurchase?: boolean;
    allocation?: ITokenAllocationBreakdown[]; // todo: get allocation for token from endpoint
}

const TokenCard: FC<ITokenCard> = ({ token, canPurchase, allocation }) => {
    const { nftContract, hyperMintContract } = useContext(ContractContext);
    const [quantity, setQuantity] = useState(1);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const totalCost = useMemo(() => {
        if (!allocation) {
            return 0;
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
        if (!allocation) return 0;

        return allocation.reduce((prev, cur) => {
            const allowedCount = cur.remainingAllocation ?? nftContract?.erc721MaxPerTransaction ?? 0;

            return prev + allowedCount;
        }, 0);
    }, [allocation]);

    return (
        <article className={styles.card}>
            <header>
                <h4 className={styles.title}>{token?.name}</h4>
            </header>

            <main>
                <img
                    src={token?.image?.url}
                    alt={token?.image?.alt}
                    className={styles.image}
                />

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
                                    <span className={styles.inputContent}>Max. {maxAllocation}</span>
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
                                        max={maxAllocation}
                                    />
                                </div>
                            </div>

                            <TokenPurchaseButton
                                total={EthereumWalletHelpers.formatBalance(totalCost.toString(), 'ETH')}
                                onClick={async () => {
                                    const transaction = await hyperMintContract?.buyAuthorised(quantity, 1);
                                    console.log('🚀 ~ file: TokenCard.tsx ~ line 104 ~ onClick={ ~ transaction', transaction);

                                    // await hyperMintContract.waitForTransaction(transaction);
                                }}
                            />
                        </form>
                    </div>
                )}
            </main>
        </article>
    );
};

export default TokenCard;