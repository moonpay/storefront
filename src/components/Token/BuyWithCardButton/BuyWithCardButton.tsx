import { FC, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { ContractContext } from '../../../context/ContractContext';
import Toast from '../../../utils/Toast';
import Modal from '../../Common/Modal';
import styles from './BuyWithCardButton.module.scss';

interface IBuyWithCardButton {
    disabled?: boolean;
    tokenId?: number;
}

const BuyWithCardButton: FC<IBuyWithCardButton> = ({ disabled, tokenId }) => {
    const { hyperMintContract } = useContext(ContractContext);

    const [moonPayUrl, setMoonPayUrl] = useState<string>();

    const onPurchase = async () => {
        if (tokenId === undefined) {
            Toast.errorToast('Unable to purchase');
            return;
        }

        const url = await hyperMintContract?.getMoonPayWidgetUrl(tokenId);

        setMoonPayUrl(url);
    };

    const onClose = () => {
        setMoonPayUrl(undefined);

        // Workaround until we have a hook for successful/failed transaction
        window.location.reload();
    };

    return (
        <>
            <Modal
                isOpen={!!moonPayUrl}
                onClose={onClose}
                className={styles.modal}
                content={
                    <iframe
                        className={styles.moonPayFrame}
                        src={moonPayUrl}
                    />
                }
            />

            <button
                className={styles.button}
                disabled={disabled}
                onClick={onPurchase}
            >
                Buy with Card
            </button>
        </>
    );
};

export default BuyWithCardButton;