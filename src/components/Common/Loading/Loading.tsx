import { FC } from 'react';
import styles from './Loading.module.scss';

interface ILoading {
    className?: string;
    light?: boolean;
}

const Loading: FC<ILoading> = ({ className, light }) => (
    <div
        className={`${styles.loader} ${light && styles.loaderLight} ${className}`}
    />
);

export default Loading;