import { FC, useContext, useMemo } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import Countdown from '../../Common/Countdown';
import ConnectedWallet from '../../Wallet/ConnectedWallet';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import Logo from '../../Common/Logo';
import styles from './Header.module.scss';

interface IHeader {
    publicSaleLive: boolean;
    privateSaleLive: boolean;
    totalMintedTokens?: number;
    privateSaleDate?: Date;
    saleClosesAt?: Date;
    setPublicSaleLive: (isLive: boolean) => void;
    setPrivateSaleLive: (isLive: boolean) => void;
}

const mintedCountFormatter = new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const Header: FC<IHeader> = ({ publicSaleLive, privateSaleLive, privateSaleDate, totalMintedTokens, saleClosesAt, setPublicSaleLive, setPrivateSaleLive }) => {
    const { nftContract } = useContext(ContractContext);

    const shouldShowPrivateSaleCounter = useMemo(() => {
        if (nftContract?.network.contractType === NFTContractType.ERC1155) return false;

        return !publicSaleLive && !!privateSaleDate;
    }, [publicSaleLive, privateSaleDate, privateSaleLive, nftContract?.network]);

    const saleHasEnded = useMemo(() => {
        if (totalMintedTokens === undefined) return false;

        const saleHasClosed = saleClosesAt ? saleClosesAt < new Date() : false;

        return saleHasClosed || Number(totalMintedTokens) === Number(nftContract?.tokenCount ?? 0);
    }, [saleClosesAt, nftContract, totalMintedTokens]);

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <Logo />
                </div>

                <section className={styles.connectedWallet}>
                    <ConnectedWallet />
                </section>

                {!!nftContract && (
                    <section className={styles.timers}>
                        {saleHasEnded ? (
                            <div className={`${styles.countdown} ${styles.saleEndedCard}`}>
                                <p className={styles.countdownTitle}>
                                    Sale has ended: <span className={styles.contentEmphasis}>{mintedCountFormatter.format(1000000)} tokens minted</span>
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className={`${styles.countdown} ${publicSaleLive && styles.countdownLive}`}>
                                    <p className={styles.countdownTitle}>Public Sale &nbsp;</p>
                                    <Countdown
                                        until={nftContract?.publicSaleAt}
                                        onEndReached={() => setPublicSaleLive(true)}
                                        className={styles.countdownTitle}
                                    />
                                </div>

                                {shouldShowPrivateSaleCounter && (
                                    <div className={`${styles.countdown} ${privateSaleLive && styles.countdownLive}`}>
                                        <p className={styles.countdownTitle}>Private Sale &nbsp;</p>
                                        <Countdown
                                            until={privateSaleDate}
                                            onEndReached={() => setPrivateSaleLive(true)}
                                            className={styles.countdownTitle}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}
            </div>
        </header>
    );
};

export default Header;