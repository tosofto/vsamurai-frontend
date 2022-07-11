import collectableService from '../../services/collectable';
import tokenServices from '../../services/token';
import web3 from 'web3'
import axios from 'axios';

export default {
    getOwner: async({ commit, dispatch }) => {
        try {
            const res = await collectableService.getOwner();
            commit('setOwner', { owner: res });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    setTotalSupply: async({ commit }) => {
        try {
            const res = await collectableService.getTotalSupply();
            commit('setTotalSupply', { totalSupply: res });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getBalance: async({ commit, dispatch }) => {
        try {
            const res = await collectableService.getBalance();
            commit('setBalance', { balance: res });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },

    getEDOTokenBalance: async({ commit, dispatch }) => {
        try {
            const res = await tokenServices.getEDOTokenBalance();
            commit('setEDOTokenBalance', { balance: web3.utils.fromWei(res) });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },

    transferOwnership: async({ commit, dispatch }, { newOwner }) => {
        try {
            const res = await collectableService.transferOwnership(newOwner);
            commit('setOwner', res);
            commit('setSuccessMsg', 'Contract ownership transferred successfully');
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    publicSaleMint: async({ commit, dispatch }, { quantity, nftPrice }) => {
        try {
            await collectableService.mintNfts(quantity, nftPrice);
            dispatch('setTotalSupply', {});
            dispatch('collectable/getUserTokens', {}, { root: true });
            dispatch('collectable/getEDOTokenBalance', {}, { root: true });
            commit('setSuccessMsg', 'NFT Minted successfully');
        } catch (e) {
            commit('setSuccessMsg', '');
            commit('setErrorMsg', e);
        }
    },
    mintWhitelist: async({ commit, dispatch }, { quantity, signature, nftPrice }) => {
        try {
            await collectableService.mintWhitelist(signature, quantity, nftPrice);
            dispatch('setTotalSupply', {});
            dispatch('collectable/getUserTokens', {}, { root: true });
            dispatch('collectable/getEDOTokenBalance', {}, { root: true });
            commit('setSuccessMsg', 'NFT Minted successfully');
        } catch (e) {
            commit('setSuccessMsg', '');
            commit('setErrorMsg', e);
        }
    },
    claimNfts: async({ commit, dispatch }, { address, quantity }) => {
        try {
            const res = await collectableService.claimNfts(address, quantity);
            commit('setSuccessMsg', 'NFT Airdropped successfully');
            dispatch('setTotalSupply', {});
            dispatch('getNFTClaimed', {});
            dispatch('collectable/getEDOTokenBalance', {}, { root: true });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    setBaseURI: async({ commit, dispatch }, { newBaseURI }) => {
        try {
            const res = await collectableService.setBaseURI(newBaseURI);
            commit('setBaseURI', { baseURI: newBaseURI });
            commit('setSuccessMsg', 'Metadata base URI changed successfully');
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getBaseURI: async({ commit, dispatch }) => {
        try {
            const res = await collectableService.getBaseURI();
            commit('setBaseURI', { baseURI: res });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getWhitelist: async({ commit, dispatch }) => {
        try {
            const res = await collectableService.getWhitelist();
            commit('setWhitelist', { whitelist: res });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    changeWhitelist: async({ commit, dispatch }, { whitelist }) => {
        try {
            const res = await collectableService.setWhitelist(whitelist);
            commit('setWhitelist', { whitelist });
            commit('setSuccessMsg', 'Whitelist changed successfully');
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    withdraw: async({ commit, dispatch }) => {
        try {
            await collectableService.withdraw();
            commit('setSuccessMsg', 'Balance withdrawn successfully');
            dispatch('getBalance');
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    isTheOwner: async({ commit }, {}) => {
        try {
            const res = await collectableService.isTheOwner();
            commit('setIsTheOwner', { isOwner: res });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getSaleState: async({ commit }, {}) => {
        const res = await collectableService.getSaleState();
        commit('setSaleState', { saleState: res });
    },
    getPreSaleState: async({ commit }, {}) => {
        const res = await collectableService.getPreSaleState();
        commit('setPreSaleState', { preSaleState: res });
    },
    getMaxNFTClaims: async({ commit }, {}) => {
        const res = await collectableService.getMaxNFTClaims();
        commit('setMaxNFTClaims', { maxNFTClaims: res });
    },
    getNFTClaimed: async({ commit }, {}) => {
        const res = await collectableService.getNFTClaimed();
        commit('setNFTClaimed', { nftClaimed: res });
    },
    flipSaleState: async({ commit }, {}) => {
        try {
            const res = await collectableService.flipSaleState();
            commit('flipSaleState', {});
            commit('setSuccessMsg', 'Sale state changed successfully');
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    flipPreSaleState: async({ commit }, {}) => {
        try {
            const res = await collectableService.flipPreSaleState();
            commit('flipPreSaleState', {});
            commit('setSuccessMsg', 'Presale state changed successfully');
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getWhitelistMintPrice: async({ commit }) => {
        try {
            const res = await collectableService.getWhitelistMintPrice();
            commit('setWhitelistMintPrice', { nftWhitelistPrice: web3.utils.fromWei(res, 'ether') });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getMintPrice: async({ commit }) => {
        try {
            const res = await collectableService.getMintPrice();
            commit('setMintPrice', { nftPrice: web3.utils.fromWei(res, 'ether') });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    setWhitelistMintPrice: async({ commit }, nftWhitelistPrice) => {
        try {
            await collectableService.setWhitelistMintPrice(web3.utils.toWei(nftWhitelistPrice, 'ether'));
            commit('setWhitelistMintPrice', { nftWhitelistPrice: nftWhitelistPrice });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    setMintPrice: async({ commit }, nftPrice) => {
        try {
            await collectableService.setMintPrice(web3.utils.toWei(nftPrice, 'ether'));
            commit('setMintPrice', { nftPrice: nftPrice });
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getBreedingState: async({ commit }, {}) => {
        const res = await collectableService.getBreedingState();
        commit('setBreedingState', { breedingState: res });
    },
    flipBreedingState: async({ commit }, {}) => {
        try {
            await collectableService.flipBreedingState();
            commit('flipBreedingState', {});
        } catch (e) {
            commit('setErrorMsg', e);
        }
    },
    getBreedingPrice: async({ commit }, {}) => {
        try {
            const res = await collectableService.getBreedingPrice();
            commit('getBreedingPrice', { breedingPrice: res });
        } catch (e) {
            console.log(e)
            commit('setErrorMsg', e);
        }
    },
    setBreedingPrice: async({ commit }, { breedingPrice }) => {
        try {
            await collectableService.setBreedingPrice(breedingPrice);
            commit('setBreedingPrice', { breedingPrice: breedingPrice });
        } catch (e) {
            console.log(e)
            commit('setErrorMsg', e);
        }
    },
    updateTotalClaimable: async({ commit, rootState }, { nftId }) => {
        const userAddress = rootState.wallet.wallet.address;
        let totalClaimable = await tokenServices.getTotalClaimable(userAddress, nftId)
        commit('updateReward', { nftId, totalClaimable });
    },
    getUserTokens: async({ commit, dispatch, rootState }, {}) => {
        try {
            commit('setGettingUserNFTs', true)
            dispatch('collectable/getEDOTokenBalance', {}, { root: true });

            // get wallet address
            const userAddress = rootState.wallet.wallet.address;

            // Get base URI
            const [baseURI, nftsIds] = await Promise.all([
                collectableService.getBaseTokenURI(),
                collectableService.getTokensOfOwner(userAddress)
            ]);

            // loop it and call tokenOfOwnerByIndex
            try {
                let userNFTs = await Promise.all(
                        nftsIds.map(async id => {
                            const uri = `${baseURI}${id}`;
                            let totalClaimable = await tokenServices.getTotalClaimable(userAddress, id)
                            let reward = web3.utils.fromWei(totalClaimable)
                            let apiBaseURI = "https://vsamurai-nft.wn.r.appspot.com"; //process.env.API_URI || "https://vsamurai-nft.wn.r.appspot.com"
                            const nftMetadata = await axios.get(`${apiBaseURI}/api/metadata/${id}`).then(res => res.data);
                            const rarityObj = nftMetadata.attributes.find(attr => attr.trait_type === 'rarity');
                            let rarityClass = (rarityObj && rarityObj.value) || 'Emperor/Empress'
                            let rarityBackend;
                            if (rarityClass === 'Samurai') {
                                rarityBackend = 1;
                            } else if (rarityClass === 'Ronin' || rarityClass === 'Onna-musha') {
                                rarityBackend = 2;
                            } else if (rarityClass == 'Shogun' || rarityClass === 'Kunoichi') {
                                rarityBackend = 3;
                            } else {
                                rarityBackend = 4;
                            }
                            const rarity = await tokenServices.rarities(id);
                            return {
                                id,
                                uri,
                                reward,
                                rarity,
                                rarityClass,
                                rarityBackend
                            }
                        })
                    ).catch(console.log)
                    //commit the mutation to set userNFTs with the userNFTs array
                commit('setUserNFTs', userNFTs)
                commit('setGettingUserNFTs', false)
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            commit('setErrorMsg', e);
            commit('setGettingUserNFTs', false)

        }
    },
}
