import { FC, useContext } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import { WalletContext } from '../../../context/WalletContext';
import styles from './ConnectWalletButton.module.scss';

interface IConnectWalletButton {
    canAccessPrivateSale?: boolean;
}

const ConnectWalletButton: FC<IConnectWalletButton> = ({ canAccessPrivateSale }) => {
    const { isConnected, disconnect, connect } = useContext(WalletContext);

    if (isConnected && !canAccessPrivateSale) {
        return (
            <button
                onClick={() => disconnect && disconnect()}
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
                onClick={connect}
            >
                Access Sale
            </button>
        );
    }

    return null;
};

export default ConnectWalletButton;