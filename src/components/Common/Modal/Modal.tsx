import { FC } from 'react';
import styles from './Modal.module.scss';

interface IModal {
    header?: JSX.Element;
    content: JSX.Element;
    isOpen?: boolean;
    className?: string;
    onClose: () => void;
}

const Modal: FC<IModal> = ({ content, header, isOpen, className, onClose }) => (
    <div
        className={`${styles.modalWrap} ${isOpen ? styles.modalWrapActive : styles.modalWrapClose}`}
        onClick={onClose}
        tabIndex={0}
    >
        <div
            className={`${styles.modal} ${className} ${isOpen && styles.modalActive}`}
            onClick={e => e.stopPropagation()}
        >
            <div className={styles.modalHeaderWrap}>
                {header}

                <img
                    src={require('../../../assets/icons/close.png')}
                    alt="X"
                    tabIndex={0}
                    className={styles.closeIcon}
                    onClick={onClose}
                />
            </div>

            {content}
        </div>
    </div>
);

export default Modal;