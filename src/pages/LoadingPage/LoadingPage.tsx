import { FC } from 'react';
import Loading from '../../components/Common/Loading';
import Logo from '../../components/Common/Logo';
import styles from './LoadingPage.module.scss';

interface ILoadingPage {
    hasFinishedLoading?: boolean;
}

const LoadingPage: FC<ILoadingPage> = ({ hasFinishedLoading }) => (
    <div className={`${styles.wrap} ${hasFinishedLoading && styles.wrapLoaded}`}>
        <Loading
            className={styles.loadingSpinner}
            light
        />

        <Logo />
    </div>
);

export default LoadingPage;