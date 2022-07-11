export default {
  setWallet: ({ commit, dispatch }, { address }) => {
    commit('setWallet', address);
    dispatch('collectable/isTheOwner', {}, { root: true });
    dispatch('collectable/setTotalSupply', {}, { root: true });
    dispatch('collectable/getBreedingState', {}, { root: true });
    dispatch('collectable/getBreedingPrice', {}, { root: true });
    dispatch('collectable/getBaseURI', {}, { root: true });
    dispatch('collectable/getBalance', {}, { root: true });
    dispatch('collectable/getEDOTokenBalance', {}, { root: true });
    dispatch('collectable/getOwner', {}, { root: true });
    dispatch('collectable/getWhitelist', {}, { root: true });
    dispatch('collectable/getSaleState', {}, { root: true });
    dispatch('collectable/getPreSaleState', {}, { root: true });
    dispatch('collectable/getWhitelistMintPrice', {}, { root: true });
    dispatch('collectable/getMintPrice', {}, { root: true });
    dispatch('collectable/getMaxNFTClaims', {}, { root: true });
    dispatch('collectable/getNFTClaimed', {}, { root: true });
    dispatch('collectable/getUserTokens', {}, { root: true });
  },
  disconectWallet: ({ commit }, { address }) => {
    commit('setWallet', address);
  }
}
