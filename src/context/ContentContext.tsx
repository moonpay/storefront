import { createContext, FC, useEffect, useState } from 'react';
import { ConfigType } from '../types/Config';
import { ICollectionContent, IMetadataContent } from '../types/config/IContentConfig';
import { IContentContext, IContentProvider } from '../types/context/IContentContext';

export const ContentContext = createContext<IContentContext>({} as IContentContext);

export const ContentProvider: FC<IContentProvider> = ({ children, configurationImporter }) => {
    const [metadata, setMetadata] = useState<IMetadataContent>();
    const [collectionContent, setCollectionContent] = useState<ICollectionContent>();

    useEffect(() => {
        console.log('mounted');
        (async () => {
            const config = await configurationImporter.loadConfig(ConfigType.CONTENT);
            setMetadata(config.metadata);
            setCollectionContent(config.collection);
        })();
    }, []);

    return (
        <ContentContext.Provider value={{ metadata, collectionContent }}>
            {children}
        </ContentContext.Provider>
    );
};