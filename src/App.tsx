import { HelmetProvider } from 'react-helmet-async';
import { ContentProvider } from './context/ContentContext';
import { ContractProvider } from './context/ContractContext';
import { ThemeProvider } from './context/ThemeContext';
import StoreFront from './pages/StoreFront';
import ConfigurationImporter from './utils/ConfigurationImporter';

const configurationImporter = new ConfigurationImporter();

const App = () => {
    return (
        <HelmetProvider>
            <ThemeProvider configurationImporter={configurationImporter}>
                <ContentProvider configurationImporter={configurationImporter}>
                    <ContractProvider configurationImporter={configurationImporter}>
                        <StoreFront /> {/** Could replace this with a router for more complex stores */}
                    </ContractProvider>
                </ContentProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
};

export default App;
