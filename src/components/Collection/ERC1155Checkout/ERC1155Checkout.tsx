import { FC, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import { IToken } from '../../../types/HyperMint/IToken';
import Container from '../../Layout/Container';
import Footer from '../../Layout/Footer';
import TokenCard from '../../Token/TokenCard';
import CollectionDetails from '../CollectionDetails';
import styles from './ERC1155Checkout.module.scss';

interface IERC1155Checkout {
    tokens: IToken[];
    publicSaleLive: boolean;
    onSuccessfulPurchase: (tokenId: number) => void;
}

const ERC1155Checkout: FC<IERC1155Checkout> = ({ tokens, publicSaleLive, onSuccessfulPurchase }) => {
    const themeContext = useContext(ThemeContext);

    return (
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

            <Container
                className={styles.main}
                width="narrow"
            >
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
    );
};

export default ERC1155Checkout;