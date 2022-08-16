import ConfigurationImporter from '../../utils/ConfigurationImporter';
import { IComponentWithChildren } from '../IComponentWithChildren';
import { IMetadataContent, ICollectionContent } from './../config/IContentConfig';

export interface IContentContext {
    metadata?: IMetadataContent;
    collectionContent?: ICollectionContent;
}

export interface IContentProvider extends IComponentWithChildren {
    configurationImporter: ConfigurationImporter;
}