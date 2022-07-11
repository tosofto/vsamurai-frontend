import axios from 'axios';
import NetworkService from './network';
class WhitelistService {
  async getWhitelistSignature(address) {
    const apiBaseURI = "https://vsamurai-nft.wn.r.appspot.com";//process.env.API_URI || "https://vsamurai-nft.wn.r.appspot.com";
    const chainId = await NetworkService.getNetworkId();
    const apiURL = `${apiBaseURI}/api/signatures/whitelist?chainId=${chainId}&address=${address}`
    return axios.get(apiURL).then(res => res.data);
  }
}


export default new WhitelistService();
