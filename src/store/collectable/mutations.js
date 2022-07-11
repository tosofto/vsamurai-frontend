import web3 from 'web3'

export default {
  setErrorMsg(state, error){
    let message;
    if(typeof error === 'string') {
      message = error;
    } else {
      message = error.message || 'Error please try again latter';
    }
    if(message === "Cannot read property 'net' of undefined") {
      state.errorMsg = "Check that you are in the correct network";
    } else {
      state.errorMsg = message;
    }
  },
  setSuccessMsg(state, message) {
    state.successMsg = message;
  },
  emptyCollection(state){
    state.errorMsg = "";
    state.collectable = {
      baseURI: "",
      whitelist: "",
      isOwner: false,
      saleState: false,
      preSaleState: false,
    }
  },
  setSaleState(state, { saleState }) {
    state.collectable.saleState = saleState;
  },
  setPreSaleState(state, { preSaleState }) {
    state.collectable.preSaleState = preSaleState;
  },
  setMaxNFTClaims(state, { maxNFTClaims }) {
    state.collectable.maxNFTClaims = maxNFTClaims;
  },
  setNFTClaimed(state, { nftClaimed }) {
    state.collectable.nftClaimed = nftClaimed;
  },
  flipSaleState(state) {
    state.collectable.saleState = !state.collectable.saleState;
  },
  flipPreSaleState(state) {
    state.collectable.preSaleState = !state.collectable.preSaleState;
  },
  setWhitelistMintPrice(state, { nftWhitelistPrice }) {
    state.collectable.nftWhitelistPrice = nftWhitelistPrice;
  },
  setMintPrice(state, { nftPrice }) {
    state.collectable.nftPrice = nftPrice;
  },
  setBreedingState(state, { breedingState }) {
    state.collectable.breedingState = breedingState;
  },
  flipBreedingState(state) {
    state.collectable.breedingState = !state.collectable.breedingState;
  },
  getBreedingPrice(state, { breedingPrice }) {
    state.collectable.breedingPrice = breedingPrice;
  },
  setBreedingPrice(state, { breedingPrice }) {
    state.collectable.breedingPrice = breedingPrice
  },
  setBalance(state, { balance }) {
    state.collectable.balance = balance;
  },
  setEDOTokenBalance(state, { balance }) {
    state.collectable.edoTokensBalance = balance;
  },
  setIsTheOwner(state, { isOwner }){
    state.errorMsg = "";
    state.collectable.isOwner = isOwner;
  },
  setOwner(state, { owner }){
    state.errorMsg = "";
    state.collectable.owner = owner;
  },
  setBaseURI(state, { baseURI }){
    state.errorMsg = "";
    state.collectable.baseURI = baseURI;
  },
  setProvenanceHash(state, { provenanceHash }){
    state.errorMsg = "";
    state.collectable.provenanceHash = provenanceHash;
  },
  setWhitelist(state, { whitelist }){
    state.errorMsg = "";
    state.collectable.whitelist = whitelist;
  },
  setTotalSupply(state, { totalSupply }) {
    state.errorMsg = "";
    state.collectable.totalSupply = totalSupply;
  },
  setGettingUserNFTs(state, value){
    state.collectable.gettingUserNFTs = value;
  },
  setUserNFTs(state, userNFTs){
    state.errorMsg = "";
    state.collectable = {
      ...state.collectable,
      userNFTs,
    }
  },
  registerGenderNft(state, { nftId }){
    return state.collectable.userNFTs[(parseInt(nftId)-1).toString()].registerGender = true
  },
  updateReward(state, { nftId, totalClaimable }){
    return state.collectable.userNFTs[(parseInt(nftId)-1).toString()].reward = web3.utils.fromWei(totalClaimable)
  }
}
