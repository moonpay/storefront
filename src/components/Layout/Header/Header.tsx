import { FC, useContext, useMemo } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import Countdown from '../../Common/Countdown';
import logo from '../../../assets/logo.png';
import ConnectedWallet from '../../Wallet/ConnectedWallet';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import styles from './Header.module.scss';

interface IHeader {
    publicSaleLive: boolean;
    privateSaleLive: boolean;
    privateSaleDate?: Date;
    setPublicSaleLive: (isLive: boolean) => void;
    setPrivateSaleLive: (isLive: boolean) => void;
}

const Header: FC<IHeader> = ({ publicSaleLive, privateSaleLive, privateSaleDate, setPublicSaleLive, setPrivateSaleLive }) => {
    const { nftContract } = useContext(ContractContext);

    const shouldShowPrivateSaleCounter = useMemo(() => {
        if (nftContract?.network.contractType === NFTContractType.ERC1155) return false;

        return !publicSaleLive && !!privateSaleDate;
    }, [publicSaleLive, privateSaleDate, privateSaleLive, nftContract?.network]);

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <img src={logo}/>
                </div>

                <section className={styles.connectedWallet}>
                    <ConnectedWallet />
                </section>

                {!!nftContract && (
                    <section className={styles.timers}>
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
                    </section>
                )}
            </div>
        </header>
    );
};

export default Header;