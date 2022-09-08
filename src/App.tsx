import { AppProvider } from './context/AppContext';
import { ContractProvider } from './context/ContractContext';
import { ThemeProvider } from './context/ThemeContext';
import StoreFront from './pages/StoreFront';
import ConfigurationImporter from './utils/ConfigurationImporter';

const configurationImporter = new ConfigurationImporter();

const App = () => {
    return (
        <ThemeProvider configurationImporter={configurationImporter}>
            <AppProvider>
                <ContractProvider configurationImporter={configurationImporter}>
                    {/** Could replace this with a router for more complex stores */}
                    <StoreFront configurationImporter={configurationImporter} />
                </ContractProvider>
            </AppProvider>
        </ThemeProvider>
    );
};

export default App;
