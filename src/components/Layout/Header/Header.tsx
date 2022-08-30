import { FC, useContext } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import Countdown from '../../Countdown';
import logo from '../../../assets/logo.png';
import ConnectedWallet from '../../Wallet/ConnectedWallet';
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

                        {(!publicSaleLive && !!privateSaleDate) && (
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