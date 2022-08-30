export interface IMetadataContent {
    title: string;
    favicon: string;
    description: string;
}

export interface ICollectionContent {
    title: string;
    description: string;
}

export interface IContentConfig {
    metadata: IMetadataContent;
    collection: ICollectionContent;
}
