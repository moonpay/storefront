import { FC } from 'react';
import Logo from '../../components/Common/Logo';
import styles from './LoadingPage.module.scss';

const LoadingPage: FC = () => (
    <div className={styles.wrap}>
        <Logo />
        <p className={styles.text}>Loading...</p>
    </div>
);

export default LoadingPage;