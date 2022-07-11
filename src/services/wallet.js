import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3"

const provider = new WalletConnectProvider({
  infuraId: process.env.INFURA_ID || "db45f4e662574c0db9daaaa5e91ffaf0"
});

const Wallet = {
  address: '',
  async connect(wallet) {
    if (wallet === 'walletConnect') {
      await provider.enable();
      window.web3 = new Web3(provider);
    } 
    else if(wallet === 'metamask' || window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
    }
    const accounts = await web3.eth.getAccounts();
    this.address = window.web3.utils.toChecksumAddress(accounts[0]);
    
    let balance = await web3.eth.getBalance(this.address)
    return { address: this.address, balance: balance };
  },
  async disconnected() {
    await provider.disconnect()
    await provider.on("disconnect");
  }
}
export default Wallet;
