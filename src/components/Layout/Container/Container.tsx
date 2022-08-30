import { FC } from 'react';
import { IComponentWithChildren } from '../../../types/IComponentWithChildren';
import styles from './Container.module.scss';

interface IContainer extends IComponentWithChildren {
    narrow?: boolean;
}

const Container: FC<IContainer> = ({ children, narrow }) => (
    <div className={`${styles.container} ${narrow && styles.narrowContainer}`}>
        {children}
    </div>
);

export default Container;