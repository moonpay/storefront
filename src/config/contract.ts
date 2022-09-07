// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { NFTContractType, NetworkEnvironment, NetworkType, NetworkChain } = HyperMint;

// Deployed Mumbai ERC721 Contract
export default {
    contractId: '93addcff-8875-47c3-86a7-19738e4e5ea0',
    contractAddress: '0x5257b05EDf55fc6A4C67BEd7dF505C8b77cCD057',
    contractType: NFTContractType.ERC721,
    networkEnvironment: NetworkEnvironment.Testnet,
    networkType: NetworkType.Polygon,
    networkChain: NetworkChain.Mumbai,
    enableLogging: true
};

// Deployed Mumbai ERC1155 Contract
// export default {
//     contractId: 'a56134e9-a8ef-43a6-a257-3f9cd8be6b96',
//     contractAddress: '0x54f8DbB6960720332991b53Dda3F3c56Ed609106',
//     contractType: NFTContractType.ERC1155,
//     networkEnvironment: NetworkEnvironment.Testnet,
//     networkType: NetworkType.Polygon,
//     networkChain: NetworkChain.Mumbai,
//     enableLogging: true
// };