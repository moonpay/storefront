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

const ERC1155GoerliContract = {
    contractId: '029c4a1f-8512-451a-b5a4-1352773c04be',
    contractAddress: '0xF01E96053E3f884e232E81E6c719C99355DeC7cB',
    contractType: NFTContractType.ERC1155,
    networkEnvironment: NetworkEnvironment.Testnet,
    networkType: NetworkType.Ethereum,
    networkChain: NetworkChain.Goerli,
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

const ERC721PolygonContract = {
    contractId: '44a25c06-11c4-4b4f-81d9-0646e85b8429',
    contractAddress: '0xb5320db0a7da4e1d101eD388066E0798E5fAEe2b',
    contractType: NFTContractType.ERC721,
    networkEnvironment: NetworkEnvironment.Testnet,
    networkType: NetworkType.Polygon,
    networkChain: NetworkChain.Mumbai,
    enableLogging: true,
    hmURL: 'http://localhost:4001/v1'
};

const ERC1155PolygonContract = {
    contractId: '450b02ae-5c12-487f-8dd0-e7b6bf7b37a2',
    contractAddress: '0xfd9efD728d38fB2d057Fed64EBD4B7Cf53Ec988c',
    contractType: NFTContractType.ERC1155,
    networkEnvironment: NetworkEnvironment.Testnet,
    networkType: NetworkType.Polygon,
    networkChain: NetworkChain.Mumbai,
    enableLogging: true,
    hmURL: 'http://localhost:4001/v1'
};

export default ERC721PolygonContract;