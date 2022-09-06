import { FC, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import styles from './Logo.module.scss';

const Logo: FC = () => {
    const { images } = useContext(ThemeContext);

    if (!images?.logo) return null;

    return (
        <img
            src={images.logo}
            className={styles.logo}
        />
    );
};

export default Logo;