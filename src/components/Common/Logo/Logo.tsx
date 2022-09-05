import { FC, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const Logo: FC = () => {
    const { images } = useContext(ThemeContext);

    if (!images?.logo) return null;

    return (
        <img src={images.logo} />
    );
};

export default Logo;