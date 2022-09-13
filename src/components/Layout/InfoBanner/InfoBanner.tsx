import { FC } from 'react';
import Container from '../Container';
import rightArrow from '../../../assets/icons/arrowRight.png';
import close from '../../../assets/icons/closeSolid.png';
import styles from './InfoBanner.module.scss';

interface IInfoBanner {
    onHide: () => void;
}

const InfoBanner: FC<IInfoBanner> = ({ onHide }) => (
    <div className={styles.banner}>
        <Container
            className={styles.bannerContainer}
            width="wide"
        >
            <a href="https://docs.hypermint.com/experiences" className={styles.bannerLeft}>
                <p className={styles.bannerContent}>
                    <strong className={styles.bannerHeading}>HyperMint Storefront Experiences:</strong> Pre-built customisable templates. Discover how they work.
                </p>

                <img
                    src={rightArrow}
                    className={styles.linkButton}
                    tabIndex={0}
                />
            </a>

            <img
                src={close}
                className={styles.closeButton}
                onClick={onHide}
                tabIndex={0}
            />
        </Container>
    </div>
);

export default InfoBanner;