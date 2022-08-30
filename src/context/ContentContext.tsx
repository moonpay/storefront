import { createContext, FC, useEffect, useState } from 'react';
import { ConfigType } from '../types/Config';
import { ICollectionContent, IMetadataContent } from '../types/config/IContentConfig';
import { IContentContext, IContentProvider } from '../types/context/IContentContext';

export const ContentContext = createContext<IContentContext>({} as IContentContext);

export const ContentProvider: FC<IContentProvider> = ({ children, configurationImporter }) => {
    const [metadata, setMetadata] = useState<IMetadataContent>();
    const [collection, setCollection] = useState<ICollectionContent>();

    useEffect(() => {
        const config = configurationImporter.loadConfig(ConfigType.CONTENT);
        setMetadata(config.metadata);
        setCollection(config.collection);
    }, []);

    return (
        <ContentContext.Provider value={{ metadata, collection }}>
            {children}
        </ContentContext.Provider>
    );
};