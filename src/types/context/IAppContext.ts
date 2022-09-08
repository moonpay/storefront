import { IComponentWithChildren } from '../IComponentWithChildren';

export enum AppComponents {
    Contract = 'Contract',
    Tokens = 'Tokens'
}

export interface IAppContext {
    loadedComponents?: AppComponents[];
    setLoadedComponents: (components: AppComponents[]) => void
}

export type IAppProvider = IComponentWithChildren