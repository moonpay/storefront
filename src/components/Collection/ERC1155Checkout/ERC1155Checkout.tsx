import { FC, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import Container from '../../Layout/Container';
import Footer from '../../Layout/Footer';
import Header from '../../Layout/Header';
import TokenCard from '../../Token/TokenCard';
import CollectionDetails from '../CollectionDetails';
import styles from './ERC1155Checkout.module.scss';

interface IERC1155Checkout {
    tokens: any[];
    publicSaleLive: boolean;
    privateSaleLive: boolean;
    privateSaleDate?: Date;
    setPublicSaleLive: (isLive: boolean) => void;
    setPrivateSaleLive: (isLive: boolean) => void;
    onSuccessfulPurchase: (tokenId: string) => void;
}

const ERC1155Checkout: FC<IERC1155Checkout> = ({ tokens, publicSaleLive, privateSaleLive, privateSaleDate, setPublicSaleLive, setPrivateSaleLive, onSuccessfulPurchase }) => {
    const themeContext = useContext(ThemeContext);

    return (
        <>
            <Header
                publicSaleLive={publicSaleLive}
                privateSaleLive={privateSaleLive}
                privateSaleDate={privateSaleDate}
                setPublicSaleLive={setPublicSaleLive}
                setPrivateSaleLive={setPrivateSaleLive}
            />

            <div>
                <div
                    className={styles.hero}
                    style={{ backgroundImage: `url(${themeContext.images?.background})` }}
                >

                    <Container className={styles.heroContainer}>
                        <div className={styles.heroContent}>
                            <CollectionDetails />
                        </div>
                    </Container>
                </div>

                <Container className={styles.main} narrow>
                    <section className={styles.grid}>
                        {(tokens.filter(t => !!t) ?? []).map((token) => (
                            <TokenCard
                                onSuccessfulPurchase={onSuccessfulPurchase}
                                key={`ERC1155-${token.id}`}
                                publicSaleLive={publicSaleLive}
                                token={{
                                    ...token,
                                    type: NFTContractType.ERC1155
                                }}
                            />
                        ))}
                    </section>
                </Container>

                <Footer />
            </div>

        </>
    );
};

export default ERC1155Checkout;