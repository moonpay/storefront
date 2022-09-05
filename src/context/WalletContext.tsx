import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { IWalletContext, IWalletProvider } from '../types/context/IWalletContext';
import { IWalletBalance } from '../types/HyperMint/IWallet';
import EthereumWalletHelpers from '../utils/EthereumWalletHelpers';
import { ContractContext } from './ContractContext';

export const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const WalletProvider: FC<IWalletProvider> = ({ children }) => {
    const { hyperMintContract } = useContext(ContractContext);
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string>();
    const [balance, setBalance] = useState<IWalletBalance>();

    const connectedWallet = useMemo(() => {
        if (address) {
            return {
                address,
                formattedAddress: EthereumWalletHelpers.truncateAddress(address ?? ''),
                formattedBalance: balance?.formatted ? EthereumWalletHelpers.formatBalance(balance.formatted, balance.symbol) : '',
            };
        }
    }, [address]);

    const getConnectedWallet = async () => {
        const wallet = await hyperMintContract.getConnectedWallet();

        setIsConnected(wallet.isConnected);

        if (wallet.address) {
            setAddress(wallet.address);
        }

        if (wallet.balance) {
            setBalance(wallet.balance);
        }
    };

    const connect = async () => {
        try {
            await hyperMintContract.connect();
            await getConnectedWallet();
        } catch (e) {
            setIsConnected(false);
            setAddress(undefined);
        }
    };

    const disconnect = async () => {
        await hyperMintContract.disconnect();
        setIsConnected(false);
        setAddress(undefined);
    };

    useEffect(() => {
        getConnectedWallet();
    }, []);

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