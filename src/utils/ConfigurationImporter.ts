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

    public async loadConfig(type: ConfigType.CONTENT): Promise<IContentConfig>;
    public async loadConfig(type: ConfigType.CONTRACT): Promise<IContractConfig>;
    public async loadConfig(type: ConfigType.THEME): Promise<IThemeConfig>;
    public async loadConfig(type: ConfigType) {
        const fileName = this.getFilenameFromType(type);
        const configImport = await import(`../config/${fileName}`);

        return configImport.default;
    }

    private getFilenameFromType(type: ConfigType): string {
        return this.typeMap[type];
    }
}