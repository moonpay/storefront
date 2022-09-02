import { FC } from 'react';
import numberToWords from 'number-to-words';
import { ITokenAllocationBreakdown as IApiTokenAllocationBreakdown } from '../../../types/HyperMint/IToken';
import styles from './TokenAllocationBreakdown.module.scss';

interface ITokenAllocationBreakdown {
    showBreakdown: boolean;
    setShowBreakdown: (showBreakdown: boolean) => void;
    allocation?: IApiTokenAllocationBreakdown[];
}

const TokenAllocationBreakdown: FC<ITokenAllocationBreakdown> = ({ allocation, showBreakdown, setShowBreakdown }) => {
    if (!allocation?.length) {
        return null;
    }

    return (
        <div className={styles.wrap}>
            <div
                className={`${styles.toggle} ${showBreakdown && styles.toggleActive}`}
                onClick={() => setShowBreakdown(!showBreakdown)}
            >
                <div className={styles.toggleHeader}>
                    <p>Token Allocation</p>
                    <img
                        src={require('../../../assets/icons/down.png')}
                        className={showBreakdown ? styles.toggleIconActive : styles.toggleIconInactive}
                    />
                </div>

                {showBreakdown && (
                    <div className={styles.breakdown}>
                        {
                            (() => {
                                let currentUpperBound = 0;
                                let currentLowerBound = 0;

                                return allocation?.map((allocation, key) => {
                                    currentLowerBound = currentUpperBound > 0 ? currentUpperBound + 1 : 1;
                                    currentUpperBound = allocation.remainingAllocation ? currentUpperBound + allocation.remainingAllocation : -1;

                                    const isOneAllocation = currentLowerBound === currentUpperBound;
                                    const isDoubleAllocation = currentLowerBound + 1 === currentUpperBound;

                                    const allocationCount = (() => {
                                        if (isOneAllocation) {
                                            return (
                                                <p>{numberToWords.toOrdinal(currentLowerBound)}</p>
                                            );
                                        }

                                        if (isDoubleAllocation) {
                                            return (
                                                <p>{numberToWords.toOrdinal(currentLowerBound)} & {numberToWords.toOrdinal(currentUpperBound)}</p>
                                            );
                                        }

                                        if (currentUpperBound < 0) {
                                            return (
                                                <p>{numberToWords.toOrdinal(currentLowerBound)}+</p>
                                            );
                                        }

                                        return (
                                            <p>{numberToWords.toOrdinal(currentLowerBound)} - {numberToWords.toOrdinal(currentUpperBound)}</p>
                                        );
                                    })();

                                    return (
                                        <div className={styles.allocationItem} key={`allocation-${key}`}>
                                            {allocationCount}
                                            <p>{allocation.pricePerToken ? `${allocation.pricePerToken} ETH/ea` : 'Free'}</p>
                                        </div>
                                    );
                                });
                            })()
                        }
                    </div>
                )}
            </div>

        </div>
    );
};

export default TokenAllocationBreakdown;