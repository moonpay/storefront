import ConfigurationImporter from '../../utils/ConfigurationImporter';
import { IComponentWithChildren } from '../IComponentWithChildren';
import { ICollectionContent } from './../config/IContentConfig';

export type IContentContext = ICollectionContent | undefined;

export interface IContentProvider extends IComponentWithChildren {
    configurationImporter: ConfigurationImporter;
}