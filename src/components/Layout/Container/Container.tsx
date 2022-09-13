import { FC } from 'react';
import { IComponentWithChildren } from '../../../types/IComponentWithChildren';
import styles from './Container.module.scss';

interface IContainer extends IComponentWithChildren {
    width?: 'narrow' | 'wide';
    className?: string;
}

const Container: FC<IContainer> = ({ children, width, className }) => (
    <div className={`${styles.container} ${width === 'narrow' && styles.narrowContainer} ${width === 'wide' && styles.wideContainer} ${className}`}>
        {children}
    </div>
);

export default Container;