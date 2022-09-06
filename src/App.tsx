import { ContentProvider } from './context/ContentContext';
import { ContractProvider } from './context/ContractContext';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import StoreFront from './pages/StoreFront';
import ConfigurationImporter from './utils/ConfigurationImporter';

const configurationImporter = new ConfigurationImporter();

const App = () => {
    return (
        <ThemeProvider configurationImporter={configurationImporter}>
            <ContentProvider configurationImporter={configurationImporter}>
                <ContractProvider configurationImporter={configurationImporter}>
                    <WalletProvider>
                        <StoreFront /> {/** Could replace this with a router for more complex stores */}
                    </WalletProvider>
                </ContractProvider>
            </ContentProvider>
        </ThemeProvider>
    );
};

export default App;
