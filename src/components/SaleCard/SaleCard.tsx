import { FC } from 'react';
import PrivateSaleCard from './components/PrivateSaleCard';
import styles from './SaleCard.module.scss';

// todo: only show the sale card if the private sale has started

interface ISaleCard {
    privateSaleLive?: boolean;
}

const SaleCard: FC<ISaleCard> = ({ privateSaleLive }) => (
    <section>
        {privateSaleLive && (
            <PrivateSaleCard />
        )}
    </section>
);

export default SaleCard;