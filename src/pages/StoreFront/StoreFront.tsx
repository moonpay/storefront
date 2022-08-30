/* eslint-disable import/no-unresolved */
import { FC, useContext, useEffect, useState } from 'react';
import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Footer from '../../components/Layout/Footer';
import Header from '../../components/Layout/Header';
import { ContractContext } from '../../context/ContractContext';
import { ThemeContext } from '../../context/ThemeContext';
import { WalletProvider } from '../../context/WalletContext';
import ERC721Checkout from '../../components/Collection/ERC721Checkout';
import { IToken } from '../../types/HyperMint/IToken';
import styles from './StoreFront.module.scss';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
    [chain.localhost], // might be able to configure this to JUST use the contract selected chain
    [
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
});

{/* Show sale card if the user is not able to purchase (not on whitelist or whitelist is closed) */}
{/* Show token card if the user is purchasing (on whitelist and 721) and contract is 721 */}
const StoreFront: FC = () => {
    const { nftContract, hyperMintContract } = useContext(ContractContext);
    const themeContext = useContext(ThemeContext);

    const [publicSaleLive, setPublicSaleLive] = useState(false);
    const [privateSaleLive, setPrivateSaleLive] = useState(false);
    const [privateSaleDate, setPrivateSaleDate] = useState<Date>();
    const [contractTokens, setContractTokens] = useState<any[]>();

    const getToken = async (token: IToken): Promise<any> => {
        try {
            const metadata = await hyperMintContract?.getTokenMetadata(token.id);

            return {
                id: token.id,
                remaining: token.remaining,
                price: token.price,
                ...metadata
            };
        } catch (e) {
            console.log(
                `Failed to load token ${token.id} - ${(e as Error).message}`
            );
        }
    };

    const getContractTokens = async () => {
        const contractTokens = await hyperMintContract?.getTokens() ?? [];
        // TODO: add type
        const tokensWithData = await Promise.all(contractTokens.map(token => getToken(token)));
        setContractTokens(tokensWithData);
    };

    useEffect(() => {
        if (!nftContract?.whitelists?.length) return;

        let privateSaleStart: Date | undefined;

        if (nftContract.whitelists.length === 1) {
            const startDate = (nftContract.whitelists[0]?.startDate) ?? 0;
            privateSaleStart = new Date(startDate);
        } else {
            const orderedWhitelists = nftContract.whitelists.sort((a, b) => {
                const aStartDate = new Date(a?.startDate ?? 0);
                const bStartDate = new Date(b?.startDate ?? 0);

                return aStartDate.getTime() - bStartDate.getTime();
            });

            privateSaleStart = new Date(orderedWhitelists[0]?.startDate ?? 0);
        }
        getContractTokens();
        setPrivateSaleDate(privateSaleStart);
    }, [nftContract]);

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} modalSize="compact" theme={darkTheme()}>
                <WalletProvider>
                    <div
                        className={styles.background}
                        style={{ backgroundImage: `url(${themeContext.images?.background?.src})` }}
                    />

                    <section
                        className={styles.wrapper}
                    >
                        <Header
                            publicSaleLive={publicSaleLive}
                            privateSaleLive={privateSaleLive}
                            privateSaleDate={privateSaleDate}
                            setPublicSaleLive={setPublicSaleLive}
                            setPrivateSaleLive={setPrivateSaleLive}
                        />

                        {nftContract?.erc721Price ? (
                            <ERC721Checkout
                                token={contractTokens ? contractTokens[0] : undefined}
                            />
                        ) : (
                            <h1>Hello world</h1>
                        )}

                        <Footer />
                    </section>
                </WalletProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export default StoreFront;