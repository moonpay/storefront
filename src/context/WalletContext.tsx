import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IWalletContext, IWalletProvider } from '../types/context/IWalletContext';
import { IWalletBalance } from '../types/HyperMint/IWallet';
import EVMWalletHelpers from '../utils/EVMWalletHelpers';
import { ContractContext } from './ContractContext';

export const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const WalletProvider: FC<IWalletProvider> = ({ children }) => {
    const { hyperMintContract, nftContract } = useContext(ContractContext);
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string>();
    const [balance, setBalance] = useState<IWalletBalance>();

    const connectedWallet = useMemo(() => {
        if (address) {
            return {
                address,
                formattedAddress: EVMWalletHelpers.truncateAddress(address ?? ''),
                formattedBalance: balance?.formatted ? EVMWalletHelpers.formatBalance(balance.formatted, nftContract) : '',
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

        const onHandleWalletChainChanged = async ({ detail }: any) => {
            if (!detail.isSupported) {
                // TODO: add toast error type
                toast('Selected chain is not supported');
                await disconnect();
                await connect();
            }
        };

        const onHandleWalletAccountChanged = async (e: any) => {
            await disconnect();
            await connect();
        };

        window.addEventListener('hmWalletChainChanged', onHandleWalletChainChanged);
        window.addEventListener('hmWalletAccountChanged', onHandleWalletAccountChanged);

        return () => {
            window.removeEventListener('hmWalletChainChanged', onHandleWalletChainChanged);
            window.removeEventListener('hmWalletAccountChanged', onHandleWalletAccountChanged);
        };
    }, []);

    return (
        <WalletContext.Provider
            value={{
                connect,
                disconnect,
                connectedWallet,
                isConnected,
                getConnectedWallet
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};