import { NetworkType } from '../types/HyperMint/IContract';

export default class NetworkHelpers {
    public static getSymbolForNetwork(networkType: NetworkType) {
        switch (networkType) {
            case NetworkType.Solana:
                return 'SOL';

            case NetworkType.Polygon:
                return 'WETH';

            case NetworkType.Ethereum:
            default:
                return 'ETH';
        }
    }
}