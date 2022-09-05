import { FC } from 'react';
import Logo from '../../components/Common/Logo';
import styles from './PreDeploymentPage.module.scss';

const PreDeploymentPage: FC = () => (
    <main className={styles.wrapper}>
        <Logo />

        <div className={styles.contentWrapper}>
            <h1 className={styles.heading}>Check back soon</h1>
            <p className={styles.content}>we are working on something...</p>
        </div>
    </main>
);

export default PreDeploymentPage;