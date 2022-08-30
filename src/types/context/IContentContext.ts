import ConfigurationImporter from '../../utils/ConfigurationImporter';
import { IComponentWithChildren } from '../IComponentWithChildren';
import { IMetadataContent, ICollectionContent } from './../config/IContentConfig';

export interface IContentContext {
    metadata?: IMetadataContent;
    collection?: ICollectionContent;
}

export interface IContentProvider extends IComponentWithChildren {
    configurationImporter: ConfigurationImporter;
}