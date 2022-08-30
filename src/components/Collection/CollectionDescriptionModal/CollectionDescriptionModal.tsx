import { FC } from 'react';
import styles from './CollectionDescriptionModal.module.scss';

interface ICollectionDescriptionModal {
    description?: string;
    isOpen?: boolean;
    onClose: () => void;
}

const CollectionDescriptionModal: FC<ICollectionDescriptionModal> = ({  description, isOpen, onClose }) => {
    return (
        <div
            className={`${styles.modalWrap} ${isOpen ? styles.modalWrapActive : styles.modalWrapClose}`}
            onClick={onClose}
            tabIndex={0}
        >
            <div
                className={`${styles.modal} ${isOpen && styles.modalActive}`}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.modalHeaderWrap}>
                    <h3 className={styles.modalHeader}>Collection Description</h3>
                    <img
                        src={require('../../../assets/icons/close.png')}
                        alt="X"
                        tabIndex={0}
                        className={styles.closeIcon}
                        onClick={onClose}
                    />
                </div>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default CollectionDescriptionModal;