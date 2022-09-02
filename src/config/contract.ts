// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { NFTContractType, NetworkEnvironment, NetworkType, NetworkChain } = HyperMint;

const ERC1155Contract = {
    contractId: 'dd903464-1958-45f9-ae7e-bf468bcc1bf2',
    contractAddress: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    contractType: NFTContractType.ERC1155,
    networkEnvironment: NetworkEnvironment.Emulator,
    networkType: NetworkType.Ethereum,
    networkChain: NetworkChain.EVMLocal,
    enableLogging: true,
    hmURL: 'http://localhost:4001/v1'
};

const ERC721Contract = {
    contractId: 'bf19ddc9-05ab-44cb-ba43-a777de280b3e',
    contractAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    contractType: NFTContractType.ERC721,
    networkEnvironment: NetworkEnvironment.Emulator,
    networkType: NetworkType.Ethereum,
    networkChain: NetworkChain.EVMLocal,
    enableLogging: true,
    hmURL: 'http://localhost:4001/v1'
};

export default ERC1155Contract;