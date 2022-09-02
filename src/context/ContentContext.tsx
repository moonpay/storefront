import { createContext, FC, useEffect, useState } from 'react';
import { ConfigType } from '../types/Config';
import { ICollectionContent } from '../types/config/IContentConfig';
import { IContentContext, IContentProvider } from '../types/context/IContentContext';

export const ContentContext = createContext<IContentContext>({} as IContentContext);

export const ContentProvider: FC<IContentProvider> = ({ children, configurationImporter }) => {
    const [content, setContent] = useState<ICollectionContent>();

    useEffect(() => {
        const config = configurationImporter.loadConfig(ConfigType.CONTENT);
        setContent(config);
    }, []);

    return (
        <ContentContext.Provider value={content}>
            {children}
        </ContentContext.Provider>
    );
};