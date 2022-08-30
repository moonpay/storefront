import { FC } from 'react';
import styles from './TokenPurchaseButton.module.scss';

interface ITokenPurchaseButton {
    total: string;
    onClick: () => void;
}

const TokenPurchaseButton: FC<ITokenPurchaseButton> = ({ total, onClick }) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}
        >
            {total} | Buy
        </button>
    );
};

export default TokenPurchaseButton;