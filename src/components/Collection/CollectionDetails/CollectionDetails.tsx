import { FC, useContext, useMemo, useState } from 'react';
import { ContentContext } from '../../../context/ContentContext';
import CollectionDescriptionModal from '../CollectionDescriptionModal';
import styles from './CollectionDetails.module.scss';

interface ICollectionDetails {
    privateSaleLive?: boolean;
    isPurchasing?: boolean;
}

const CollectionDetails: FC<ICollectionDetails> = ({ privateSaleLive, isPurchasing }) => {
    const contentContext = useContext(ContentContext);
    const [showContentModal, setShowContentModal] = useState(false);

    const truncatedContent = useMemo(() => {
        if (!contentContext.collection?.description) return null;

        return `${contentContext.collection.description.slice(0, 200)}...`;
    }, [contentContext.collection?.description]);

    return (
        <>
            <section className={styles.hero}>
                <h3 className={styles.subHeading}>Bored Ape Yacht Club Presents</h3>
                <h1 className={styles.heading}>{contentContext.collection?.title}</h1>
                <p className={styles.description}>{truncatedContent}</p>

                <button
                    onClick={() => setShowContentModal(!showContentModal)}
                    className={styles.expander}
                >
                    {showContentModal ? '- Show Less' : '+ Read More'}
                </button>
            </section>

            <CollectionDescriptionModal
                isOpen={showContentModal}
                description={contentContext?.collection?.description}
                onClose={() => setShowContentModal(false)}
            />
        </>
    );
};

export default CollectionDetails;