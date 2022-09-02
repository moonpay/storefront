import { FC, useContext, useMemo, useState } from 'react';
import { ContentContext } from '../../../context/ContentContext';
import Container from '../../Layout/Container';
import CollectionDescriptionModal from '../CollectionDescriptionModal';
import styles from './CollectionDetails.module.scss';

const CollectionDetails: FC = () => {
    const contentContext = useContext(ContentContext);
    const [showContentModal, setShowContentModal] = useState(false);

    const truncatedContent = useMemo(() => {
        if (!contentContext?.description) return null;

        return `${contentContext.description.slice(0, 200)}...`;
    }, [contentContext?.description]);

    return (
        <>
            <section className={styles.wrapper}>
                <h3 className={styles.subHeading}>Bored Ape Yacht Club Presents</h3>
                <h1 className={styles.heading}>{contentContext?.title}</h1>
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
                description={contentContext?.description}
                onClose={() => setShowContentModal(false)}
            />
        </>
    );
};

export default CollectionDetails;