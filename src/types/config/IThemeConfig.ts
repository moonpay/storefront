export interface IThemeColors {
    primary: string;
}

interface IThemeImage {
    src: string;
    alt: string
}

export interface IThemeImages {
    logo: IThemeImage;
    background: IThemeImage;
}

export interface IThemeConfig {
    images?: IThemeImages;
    colors?: IThemeColors;
}