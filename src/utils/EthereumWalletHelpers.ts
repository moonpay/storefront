// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import abbreviate from 'number-abbreviate';

export default class EthereumWalletHelpers {
    public static truncateAddress(address: string) {
        const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
        const match = address.match(truncateRegex);

        if (!match) return address;

        return `${match[1]}…${match[2]}`;
    }

    public static formatBalance(balance: string, symbol?: string) {
        const formattedBalance = balance.replace(new RegExp('(.+\\.\\d{2})\\d+'), '$1')
            .replace(/(\.[1-9]*)0+$/, '$1')
            .replace(/\.$/, '');

        return `${abbreviate(formattedBalance, 2)} ${symbol ?? ''}`;
    }
}