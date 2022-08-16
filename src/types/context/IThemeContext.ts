import ConfigurationImporter from '../../utils/ConfigurationImporter';
import { IComponentWithChildren } from './../IComponentWithChildren';
import { IThemeColors, IThemeImages } from './../config/IThemeConfig';

export interface IThemeContext {
    colors?: IThemeColors;
    images?: IThemeImages;
}

export interface IThemeProvider extends IComponentWithChildren {
    configurationImporter: ConfigurationImporter;
}