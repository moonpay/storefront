import { FC } from 'react';
import HyperMint from '../../../assets/HyperMint.png';
import styles from './Footer.module.scss';

const Footer: FC = () => (
    <footer className={styles.footer}>
        <div className={styles.branding}>
            <p className={styles.title}>Powered By</p>
            <img
                src={HyperMint}
                className={styles.hypermint}
                alt="HyperMint"
            />
        </div>
    </footer>
);

export default Footer;