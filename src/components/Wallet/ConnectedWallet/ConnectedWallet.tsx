
import { FC, useContext } from 'react';
import walletIcon from '../../../assets/icons/wallet.png';
import { WalletContext } from '../../../context/WalletContext';
import styles from './ConnectedWallet.module.scss';

const ConnectedWallet: FC = () => {
    const { isConnected, disconnect, connectedWallet } = useContext(WalletContext);

    if (!isConnected) return null;

    return (
        <div className={styles.connectedWallet}>
            <div className={styles.disconnectWallet} onClick={disconnect}>
                <img
                    src={require('../../../assets/icons/walletRed.png')}
                    alt=""
                    className={styles.walletIcon}
                />
                <p className={styles.walletText}>Disconnect Wallet</p>
            </div>

            <button className={styles.wrapperButton}>
                <img src={walletIcon} />
                <p className={`${styles.connectedWalletMeta} ${styles.withSpacer}`}>{connectedWallet?.formattedAddress}</p>
                <p className={styles.connectedWalletMeta}>{connectedWallet?.formattedBalance}</p>
            </button>
        </div>
    );
};

export default ConnectedWallet;