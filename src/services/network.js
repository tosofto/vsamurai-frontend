const networks = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  56: 'Binance Smart Chain',
  97: 'Binance Smart Chain - Testnet',
  1337: 'Localhost',
  123456: 'Localhost',
  31337: 'Localhost',
  137: 'Polygon Mainnet',
  80001: 'Polygon Testnet Mumbai',
}

const contractAddress = {
  1: process.env.NFT_CONTRACT_ADDRESS || '0x0b95b4f29d10f7a676f8c38c7c0692b29a396d1d',
  4: process.env.NFT_CONTRACT_ADDRESS || '',
  // Localhost for new hardhat integration
  31337: process.env.NFT_CONTRACT_ADDRESS || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
}
const contractEDOTokenAddress = {
  1: process.env.CONTRACT_ADDRESS_EDOTOKEN || '0xbcc6422e5726fb65e09cbedcd73cb6c14ea0ad05',
  4: process.env.CONTRACT_ADDRESS_EDOTOKEN || '',
  // Localhost for new hardhat integration
  31337: process.env.NFT_CONTRACT_EDO_TOKEN_ADDRESS || '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
}

const contractBreedingManagerAddress = {
  1: process.env.CONTRACT_ADDRESS_BREEDING_MANAGER || '',
  4: process.env.CONTRACT_ADDRESS_BREEDING_MANAGER || '',
  // Localhost for new hardhat integration
  31337: process.env.NFT_CONTRACT_EDO_TOKEN_ADDRESS || '0x0165878A594ca255338adfa4d48449f69242Eb8F',
}

const NetworkService = {
  networks,
  async getCurrentNetwork() {
    const networkId = await this.getNetworkId();
    return networks[networkId] || `Unknown network (ID: ${networkId})`;
  },
  getNetworkId() {
    return window.web3.eth.net.getId();
  },
  getNetworkById(networkId) {
    return networks[networkId] || `Unknown network (ID: ${networkId})`;
  },
  getContractAddress(networkId) {
    return contractAddress[networkId];
  },
  getContractEDOTokenAddress(networkId) {
    return contractEDOTokenAddress[networkId];
  },
  getContractBreedingManagerAddress(networkId) {
    return contractBreedingManagerAddress[networkId];
  }
}
export default NetworkService;
