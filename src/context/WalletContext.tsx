import { useConnectModal } from '@rainbow-me/rainbowkit';
import { createContext, FC, useMemo } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { IWalletContext, IWalletProvider } from '../types/context/IWalletContext';
import EthereumWalletHelpers from '../utils/EthereumWalletHelpers';

export const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const WalletProvider: FC<IWalletProvider> = ({ children }) => {
    const { isConnected, address } = useAccount();
    const { openConnectModal: connect } = useConnectModal();
    const { disconnect } = useDisconnect();
    const { data } = useBalance({ watch: true, addressOrName: address });

    const connectedWallet = useMemo(() => {
        if (address) {
            return {
                address,
                balance: data?.formatted ?? '0',
                formattedAddress: EthereumWalletHelpers.truncateAddress(address ?? ''),
                formattedBalance: EthereumWalletHelpers.formatBalance(data?.formatted ?? '', data?.symbol),
            };
        }
    }, [address]);

    return (
        <WalletContext.Provider
            value={{
                connect,
                disconnect,
                connectedWallet,
                isConnected
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};