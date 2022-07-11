import BreedingManager from '../../build/contracts/BreedingManager.sol/BreedingManager.json';
import NetworkService from './network';
import wallet from './wallet';

const BreedingManagerContractABI = {
  async getContractBreedingManagerInstance() {
    try {
      if (window.BreedingManagerInstance) {
        return window.BreedingManagerInstance;
      } else {
        const networkId = await window.web3.eth.net.getId();
        const contractAddress = NetworkService.getContractBreedingManagerAddress(networkId);
        if (!contractAddress) {
          throw new Error(`Contract not found - Check that you are in the correct network, network detected: ${NetworkService.networks[networkId]}`);
        }
        const BreedingManagerInstance = new window.web3.eth.Contract(
          BreedingManager.abi,
          contractAddress
        );
        window.BreedingManagerInstance = BreedingManagerInstance
        return window.BreedingManagerInstance;
      }
    } catch(e) {
      console.log('Error getting contract instance!');
      throw e;
    }
  },

  async registerGender(signature, tokenId, gender) {
    const BreedingManagerInstance = await this.getContractBreedingManagerInstance();
    return BreedingManagerInstance.methods.registerGender(signature, tokenId, gender).send({
      from: wallet.address,
    });
  },
}
export default BreedingManagerContractABI;