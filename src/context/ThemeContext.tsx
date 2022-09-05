import { createContext, FC, useEffect, useState } from 'react';
import { ConfigType } from '../types/Config';
import { IThemeColors, IThemeImages } from '../types/config/IThemeConfig';
import { IThemeContext, IThemeProvider } from '../types/context/IThemeContext';

export const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeProvider: FC<IThemeProvider> = ({ children, configurationImporter }) => {
    const [colors, setColors] = useState<IThemeColors>();
    const [images, setImages] = useState<IThemeImages>();

    useEffect(() => {
        const config = configurationImporter.loadConfig(ConfigType.THEME);
        setImages(config.images);
        setColors(config.colors);
    }, []);

    useEffect(() => {
        const root: any = document.querySelector(':root');

        if (colors?.primary) root.style.setProperty('--color-primary', colors.primary);
        if (colors?.success) root.style.setProperty('--color-state-success', colors.success);
        if (colors?.error) root.style.setProperty('--color-state-error', colors.error);

    }, [colors]);

    return (
        <ThemeContext.Provider value={{ colors, images }}>
            {children}
        </ThemeContext.Provider>
    );
};