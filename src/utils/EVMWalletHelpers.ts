import { INFTContract , NetworkType } from '../types/HyperMint/IContract';
import NetworkHelpers from './NetworkHelpers';

export default class EVMWalletHelpers {
    public static truncateAddress(address: string) {
        const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
        const match = address.match(truncateRegex);

        if (!match) return address;

        return `${match[1]}…${match[2]}`;
    }

    public static formatBalance(balance: string, contract?: INFTContract) {
        const formattedBalance = balance.replace(new RegExp('(.+\\.\\d{2})\\d+'), '$1')
            .replace(/(\.[1-9]*)0+$/, '$1')
            .replace(/\.$/, '');

        const symbol = contract ? NetworkHelpers.getSymbolForNetwork(contract.network.type as NetworkType) : 'ETH';

        const formatter = new Intl.NumberFormat('en-GB', {
            notation: 'compact',
            compactDisplay: 'short',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
        });

        return `${formatter.format(Number(formattedBalance))} ${symbol}`;
    }
}