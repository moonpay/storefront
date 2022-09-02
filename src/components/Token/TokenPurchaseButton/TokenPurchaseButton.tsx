import { FC, SyntheticEvent, useContext } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import styles from './TokenPurchaseButton.module.scss';

interface ITokenPurchaseButton {
    total: string;
    onPurchase?: (event: SyntheticEvent) => void;
    purchasing?: boolean;
}

const TokenPurchaseButton: FC<ITokenPurchaseButton> = ({ total, onPurchase, purchasing }) => {
    return (
        <button
            className={styles.button}
            onClick={onPurchase}
            disabled={purchasing}
        >
            {purchasing ? 'Processing...' : `${total} | Buy`}
        </button>
    );
};

export default TokenPurchaseButton;