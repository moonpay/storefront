import { FC } from 'react';
import { NFTContractType } from '../../../types/HyperMint/IContract';
import TokenCard from '../../Token/TokenCard';
import styles from './ERC1155Checkout.module.scss';

interface IERC1155Checkout {
    tokens: any[];
    publicSaleLive: boolean;
    onSuccessfulPurchase: (tokenId: string) => void;
}

const ERC1155Checkout: FC<IERC1155Checkout> = ({ tokens, publicSaleLive, onSuccessfulPurchase }) => {
    return (
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
    );
};

export default ERC1155Checkout;