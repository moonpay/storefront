import { FC, useContext, useState } from 'react';
import { ContractContext } from '../../context/ContractContext';
import Countdown from '../Countdown';
import logo from '../../assets/logo.png';
import ConnectedWallet from '../ConnectedWallet';
import styles from './Header.module.scss';

const Header: FC = () => {
    const [publicSaleLive, setPublicSaleLive] = useState(false);
    const [privateSaleLive, setPrivateSaleLive] = useState(false);

    const contract = useContext(ContractContext);

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <img src={logo}/>
                </div>

                <section className={styles.connectedWallet}>
                    <ConnectedWallet />
                </section>

                {!!contract.nftContract && (
                    <section className={styles.timers}>
                        <div className={`${styles.countdown} ${publicSaleLive && styles.countdownLive}`}>
                            <p className={styles.countdownTitle}>Public Sale &nbsp;</p>
                            <Countdown
                                until={contract.nftContract?.publicSaleAt}
                                onEndReached={() => setPublicSaleLive(true)}
                                className={styles.countdownTitle}
                            />
                        </div>

                        {/* If the wallet is connected and they are not on the whitelist then we shouldnt show this */}
                        {!publicSaleLive && (
                            <div className={`${styles.countdown} ${privateSaleLive && styles.countdownLive}`}>
                                <p className={styles.countdownTitle}>Private Sale &nbsp;</p>
                                <Countdown
                                    until={new Date(1660649042274)}
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