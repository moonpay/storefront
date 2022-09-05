export interface IThemeColors {
    primary: string;
    success: string;
    error: string;
}
export interface IThemeImages {
    logo: string;
    background: string;
}

export interface IThemeConfig {
    images?: IThemeImages;
    colors?: IThemeColors;
}