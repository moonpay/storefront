export interface IMetadataContent {
    title: string;
    favicon: string;
    description: string;
}

export interface ICollectionContent {
    heading: string;
    description: string;
}

export interface IContentConfig {
    metadata: IMetadataContent;
    collection: ICollectionContent;
}
