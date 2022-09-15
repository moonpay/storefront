import { FC, useContext, useMemo, useState } from 'react';
import { ContentContext } from '../../../context/ContentContext';
import Modal from '../../Common/Modal';
import styles from './CollectionDetails.module.scss';

const maxDescriptionLength = 200;

const CollectionDetails: FC = () => {
    const contentContext = useContext(ContentContext);
    const [showContentModal, setShowContentModal] = useState(false);

    const hasReadMore = useMemo(() => {
        return (contentContext?.description.length ?? 0) >= maxDescriptionLength;
    }, [contentContext?.description]);

    const truncatedContent = useMemo(() => {
        if (!contentContext?.description) return null;

        if (contentContext.description.length <= maxDescriptionLength) return contentContext.description;

        return `${contentContext.description.slice(0, 200)}...`;
    }, [contentContext?.description]);

    return (
        <>
            <section className={styles.wrapper}>
                <h3 className={styles.subHeading}>{contentContext?.author} Presents</h3>
                <h1 className={styles.heading}>{contentContext?.title}</h1>
                <p className={styles.description}>{truncatedContent}</p>

                {hasReadMore && (
                    <button
                        onClick={() => setShowContentModal(!showContentModal)}
                        className={styles.expander}
                    >
                        {showContentModal ? '- Show Less' : '+ Read More'}
                    </button>
                )}
            </section>

            <Modal
                isOpen={showContentModal}
                onClose={() => setShowContentModal(false)}
                header={<h2 className={styles.modalHeader}>Collection Details</h2>}
                content={
                    <div>
                        <p className={styles.modalDescription}>{contentContext?.description}</p>
                    </div>
                }
            />
        </>
    );
};

export default CollectionDetails;