import { FC, SyntheticEvent } from 'react';
import Loading from '../../Common/Loading';
import styles from './TokenPurchaseButton.module.scss';

interface ITokenPurchaseButton {
    total: string;
    onPurchase?: (event: SyntheticEvent) => void;
    purchasing?: boolean;
    disabled?: boolean;
    soldOut?: boolean;
}

const TokenPurchaseButton: FC<ITokenPurchaseButton> = ({ total, onPurchase, purchasing, disabled, soldOut }) => {
    if (soldOut) {
        return (
            <button className={`${styles.button} ${styles.soldOutButton}`} disabled>
                Sold Out
            </button>
        );
    }

    return (
        <button
            className={styles.button}
            onClick={onPurchase}
            disabled={disabled || purchasing}
        >
            {purchasing ? <Loading light /> : `${total} | Buy`}
        </button>
    );
};

export default TokenPurchaseButton;