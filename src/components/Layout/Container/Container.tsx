import { FC } from 'react';
import { IComponentWithChildren } from '../../../types/IComponentWithChildren';
import styles from './Container.module.scss';

interface IContainer extends IComponentWithChildren {
    narrow?: boolean;
    className?: string;
}

const Container: FC<IContainer> = ({ children, narrow, className }) => (
    <div className={`${styles.container} ${narrow && styles.narrowContainer} ${className}`}>
        {children}
    </div>
);

export default Container;