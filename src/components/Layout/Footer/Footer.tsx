import { FC } from 'react';
import HyperMint from '../../../assets/HyperMint.png';
import styles from './Footer.module.scss';

interface IFooter {
    className?: string;
}

const Footer: FC<IFooter> = ({ className }) => (
    <footer className={`${styles.footer} ${className}`}>
        <div className={styles.branding}>
            <p className={styles.title}>Powered By</p>
            <img src={HyperMint} alt="HyperMint" />
        </div>
    </footer>
);

export default Footer;