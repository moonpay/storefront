import { FC, useContext } from 'react';
import { WalletContext } from '../../../context/WalletContext';
import styles from './ConnectWalletButton.module.scss';

interface IConnectWalletButton {
    canAccessPrivateSale?: boolean;
    onClick: () => void
}

const ConnectWalletButton: FC<IConnectWalletButton> = ({ canAccessPrivateSale, onClick }) => {
    const { isConnected } = useContext(WalletContext);

    if (isConnected && !canAccessPrivateSale) {
        return (
            <button
                onClick={onClick}
                className={styles.button}
            >
                Disconnect
            </button>
        );
    }

    if (!isConnected) {
        return (
            <button
                className={`${styles.button} ${styles.connectButton}`}
                onClick={onClick}
            >
                Access Sale
            </button>
        );
    }

    return null;
};

export default ConnectWalletButton;