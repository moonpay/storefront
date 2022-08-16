import { FC, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ContentContext } from '../../context/ContentContext';

const SiteMeta: FC = () => {
    const contentContext = useContext(ContentContext);

    return (
        <Helmet>
            <title>{contentContext.metadata?.title}</title>
            <link rel="icon" type="image/png" href={contentContext.metadata?.favicon} sizes="16x16" />
            <meta name="description">{contentContext.metadata?.description}</meta>
        </Helmet>
    );
};

export default SiteMeta;