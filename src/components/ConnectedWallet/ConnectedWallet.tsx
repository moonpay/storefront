import { FC } from 'react';
import walletIcon from '../../assets/icons/wallet.png';
import styles from './ConnectedWallet.module.scss';

const ConnectedWallet: FC = () => (
    <div className={styles.connectedWallet}>
        <img src={walletIcon} />
        <p className={styles.connectedWalletMeta}>1x3Khf...0c4J</p>
        <p className={styles.connectedWalletMeta}>2.1ETH</p>
    </div>
);

export default ConnectedWallet;