import { FC, useContext, useMemo, useState } from 'react';
import { ContentContext } from '../../context/ContentContext';
import SaleCard from '../SaleCard';
import TokenCard from '../Token/TokenCard';
import mysteryTokenImage from '../../assets/token.png';
import styles from './Hero.module.scss';

interface IHero {
    privateSaleLive?: boolean;
    isPurchasing?: boolean;
}

// todo: for now assume this is just 721 and tweak for 1155 when that is being built
const Hero: FC<IHero> = ({ privateSaleLive, isPurchasing }) => {
    // Get the current contract
    const contentContext = useContext(ContentContext);
    const [showContentModal, setShowContentModal] = useState(false);

    // neeed to know if the user is purchasing
    // Need to know the token allocation for 721 (id is always 0)

    const truncatedContent = useMemo(() => {
        if (!contentContext.collection?.description) return null;

        return `${contentContext.collection.description.slice(0, 200)}...`;
    }, [contentContext.collection?.description]);

    return (
        <section className={styles.hero}>
            <div>
                <h3 className={styles.subHeading}>Bored Ape Yacht Club Presents</h3>
                <h1 className={styles.heading}>{contentContext.collection?.title}</h1>
                <p className={styles.description}>{truncatedContent}</p>

                {/* TODO: open content modal */}
                <button
                    onClick={() => setShowContentModal(!showContentModal)}
                    className={styles.expander}
                >
                    {showContentModal ? '- Show Less' : '+ Read More'}
                </button>
            </div>

            {isPurchasing ? (
                // TODO: this will change for 1155
                <p>Hello world</p>
                // <TokenCard
                //     token={{
                //         name: 'Mystery Token',
                //         image: {
                //             url: mysteryTokenImage
                //         },
                //     }}
                //     canPurchase
                // />
            ) : (
                <SaleCard
                    privateSaleLive={privateSaleLive}
                />
            )}
        </section>
    );
};

export default Hero;