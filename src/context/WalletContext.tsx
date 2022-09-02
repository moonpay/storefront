import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { IWalletContext, IWalletProvider } from '../types/context/IWalletContext';
import EthereumWalletHelpers from '../utils/EthereumWalletHelpers';
import { ContractContext } from './ContractContext';

export const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const WalletProvider: FC<IWalletProvider> = ({ children }) => {
    const { hyperMintContract } = useContext(ContractContext);
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState(0);

    const connectedWallet = useMemo(() => {
        if (address) {
            return {
                address,
                balance,
                formattedAddress: EthereumWalletHelpers.truncateAddress(address ?? ''),
                formattedBalance: EthereumWalletHelpers.formatBalance(balance.toString(), 'ETH') // TODO: get the symbol from the SDK we cant assume ETH
                // formattedBalance: EthereumWalletHelpers.formatBalance(data?.formatted ?? '', data?.symbol),
            };
        }
    }, [address]);

    const getConnectedWallet = async () => {
        const wallet = await hyperMintContract.getConnectedWallet();

        setIsConnected(wallet.isConnected);
        setAddress(wallet.address);
        setBalance(wallet.balance);
    };

    const connect = async () => {
        try {
            await hyperMintContract.connect();
            await getConnectedWallet();
        } catch (e) {
            console.error('Unable to connect to wallet', e);
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