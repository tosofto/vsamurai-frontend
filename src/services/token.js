import Token from '../../build/contracts/EDOToken.sol/EDOToken.json';
import NetworkService from './network';
import wallet from './wallet';

const TokenContractABI = {
  async getContractTokenInstance() {
    try {
      if (window.TokenInstance) {
        return window.TokenInstance;
      } else {
        const networkId = await window.web3.eth.net.getId();
        const contractAddress = NetworkService.getContractEDOTokenAddress(networkId);
        if (!contractAddress) {
          throw new Error(`Contract not found - Check that you are in the correct network, network detected: ${NetworkService.networks[networkId]}`);
        }
        const TokenInstance = new window.web3.eth.Contract(
          Token.abi,
          contractAddress
        );
        window.TokenInstance = TokenInstance
        return window.TokenInstance;
      }
    } catch(e) {
      console.error('Error getting contract instance!');
      throw e;
    }
  },

  async totalSupply() {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.totalSupply().call();
  },

  async mintRewards(_tokenId) {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods._mintRewards(_tokenId).send({
      from: wallet.address,
    });
  },

  async getEDOTokenBalance() {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.balanceOf(wallet.address).call()
  },

  async claimRewards(_nftId) {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.claimRewards(_nftId).send({
      from: wallet.address,
    });
  },

  async getTotalClaimable(address, tokenId) {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.getTotalClaimable(address, tokenId).call()
  },

  async registerForRewards(signature, tokenId, rarity) {
    console.log("registerForRewards start");
    const TokenInstance = await this.getContractTokenInstance();
      console.log("registerForRewards token init");
        console.log("registerForRewards wallet.address", wallet.address);
    var data = await TokenInstance.methods.registerForRewards(signature, tokenId, rarity).send({
      from: wallet.address,
    }).on('receipt', function(){
      console.log("registerForRewards receipt");
      }).then(res => {
        console.log("registerForRewards then",res.data);
				return res.data;
		}).catch(e => {
        console.error(e);
				return "Error";
    });
      console.log("registerForRewards data", data);
      return data;
  },

  async rarities(nftId) {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.rarities(nftId).call()
  },

  async getTokenRates(){
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.tokenRates().call()
  },

  async setTokenRates(newRates) {
    const TokenInstance = await this.getContractTokenInstance();
    return TokenInstance.methods.setTokenRates(newRates).send({from: wallet.address});
  },

  async bulkAdminRarityRegistration(tokenIds, rarities, tokenOwners) {
    const TokenInstance = await this.getContractTokenInstance();
    console.log(TokenInstance)
    return TokenInstance.methods.bulkAdminRarityRegistration(tokenIds, rarities, tokenOwners).send({from: wallet.address});
  }
}
export default TokenContractABI;
