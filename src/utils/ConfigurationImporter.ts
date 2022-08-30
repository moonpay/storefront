/* eslint-disable @typescript-eslint/no-var-requires */
import { IContentConfig } from '../types/config/IContentConfig';
import { IThemeConfig } from '../types/config/IThemeConfig';
import { IContractConfig } from '../types/config/IContractConfig';
import { ConfigType } from './../types/Config';

export default class ConfigurationImporter {
    private readonly typeMap = {
        [ConfigType.CONTENT]: 'content.json',
        [ConfigType.CONTRACT]: 'contract.json',
        [ConfigType.THEME]: 'theme.json',
    };

    public loadConfig(type: ConfigType.CONTENT): IContentConfig;
    public loadConfig(type: ConfigType.CONTRACT): IContractConfig;
    public loadConfig(type: ConfigType.THEME): IThemeConfig;
    public loadConfig(type: ConfigType) {
        const fileName = this.getFilenameFromType(type);
        const configImport = require(`../config/${fileName}`);

        return configImport;
    }

    private getFilenameFromType(type: ConfigType): string {
        return this.typeMap[type];
    }
}