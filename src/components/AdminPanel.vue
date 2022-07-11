<template>
  <div class="container admin-container">
    <div class="col-6">
      <!-- Whitelist -->
      <div class="owner-title">Change Whitelist Signer:</div>
      <div class="mb-3">
        <input class="input-surreal mr-3" v-model="whitelistAddress" type="text" />
        <button @click="changewhitelistSigner" class="banner-btn"> CHANGE </button>
      </div>
      <!-- Whitelist -->
      <div class="owner-title">Metadata Base URI:</div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="collectable.baseURI" type="text" />
        <button @click="setBaseURI({ newBaseURI: collectable.baseURI })" class="button-owner">
          CHANGE
        </button>
      </div>
      <div class="owner-title">Transfer ownership:</div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="newOwnerAddress" type="text" />
        <button @click="doTransferOwnership" class="button-owner">
          CHANGE
        </button>
      </div>
      <div class="owner-title mt-3">Mint free nfts:</div>
      <div class="d-flex" >
        <div>
          <input class="input-base-uri-mint" v-model="addressToAirdrop" type="text" placeholder="0x000000000000000000" />
          <span class="px-2"> > </span>
          <input class="input-base-uri-mint" v-model="quantityToAirdrop" style="width: 50px" type="text" />
          <button @click="nftAirdrop" class="button-owner">Send free nft!</button> ({{ collectable.nftClaimed }} / {{ collectable.maxNFTClaims }})
        </div>
      </div>
      <!-- NFT PRE PRICE -->
      <div class="owner-title">Whitelist nft price:</div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="collectable.nftWhitelistPrice" type="text" />
        <button @click="setWhitelistMintPrice(collectable.nftWhitelistPrice)" class="button-owner">
          CHANGE
        </button>
      </div>
      <!-- NFT PRICE -->
      <div class="owner-title">Nft price:</div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="collectable.nftPrice" type="text" />
        <button @click="setMintPrice(collectable.nftPrice)" class="button-owner">
          CHANGE
        </button>
      </div>
      <!-- PRESALE -->
      <div class="owner-title">PreSale State: {{ collectable.preSaleState ? "ACTIVE" : "NOT ACTIVE" }} </div>
      <div class="mb-3">
        <button @click="flipPreSaleState" :class="collectable.preSaleState ? 'banner-btn banner-btn-danger' : 'banner-btn banner-btn-success'"> {{ collectable.preSaleState ? 'CLOSE' : 'OPEN' }} </button>
      </div>
      <!-- SALE -->
      <div class="owner-title">Sale State: {{ collectable.saleState ? "ACTIVE" : "NOT ACTIVE" }} </div>
      <div class="mb-3">
        <button @click="flipSaleState" :class="collectable.saleState ? 'banner-btn banner-btn-danger' : 'banner-btn banner-btn-success'"> {{ collectable.saleState ? 'CLOSE' : 'OPEN' }} </button>
      </div>
            <!-- GENERAL -->
      <div class="owner-title mt-4">NFTs minted: {{ collectable.totalSupply }} </div>
      <div class="owner-title">Withdraw (balance: {{ (collectable.balance || 0) / 1000000000000000000 }} eth):</div>
      <div class="mb-3">
        <div>
          <button @click="withdraw" class="button-owner">WITHDRAW</button>
        </div>
      </div>
    </div>
    <div>
      <!-- BREEDING -->
      <div class="owner-title">Breeding State: {{ collectable.breedingState ? "ACTIVE" : "NOT ACTIVE" }} </div>
      <div class="mb-3">
        <button @click="flipBreedingState" :class="collectable.breedingState ? 'banner-btn banner-btn-danger' : 'banner-btn banner-btn-success'"> {{ collectable.breedingState ? 'CLOSE' : 'OPEN' }} </button>
      </div>
      <!-- SET BREED ADDRESS -->
      <div class="owner-title">Set breeding manager address </div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="contractBreedingManagerAddress" type="text" />
        <button @click="setBreedingManager()" class="button-owner">
          SET
        </button>
      </div>
      <!-- SET BREED PRICE -->
      <div class="owner-title">Set breeding price </div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="collectable.breedingPrice" type="text" />
        <button @click="setBreedPrice()" class="button-owner">
          SET
        </button>
      </div>
      <!-- SET YIELD TOKEN -->
      <div class="owner-title">Set Yield token </div>
      <div class="mb-3">
        <input class="input-base-uri" v-model="contractEDOTokenAddress" type="text" />
        <button @click="setYieldToken()" class="button-owner">
          SET
        </button>
      </div>
      <!-- REWARDS -->
      <div class="mb-4 mt-5">
        <button @click="setTokenRates" class="button-owner">Set token rates</button>
      </div>
      <div>
        <div class="mt-3 d-flex justify-content-between align-items-center">
          <div class="owner-title">Bulk Rariry Registration</div>
          <button @click="addNewToken" class="button-owner mt-2">Add</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Holder address</th>
              <th scope="col">NFT Rarity</th>
              <th scope="col">NFT ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(nft, index) in stakeNftsOwner" :key="index">
              <th scope="row"> {{ index + 1 }} </th>
              <td>
                <input class="input-table" type="text" v-model="nft.tokenOwner" placeholder="address">
              </td>
              <td>
                <input class="input-table" type="text" v-model="nft.rarity" placeholder="rarity">
              </td>
              <td>
                <input class="input-table" type="text" v-model="nft.tokenId" placeholder="token id">
              </td>
            </tr>
          </tbody>
        </table>
        <div class="w-100 d-flex justify-content-end mt-3">
          <div class="custom-input-file button-owner">
            <input id="fichero-tarifas" class="input-file" type="file" accept="application/json" @change="updateJsonFile" />
              Upload JSON
          </div>
          <button @click="saveRaritiesOwner" class="button-owner">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-input-file {
  color: #fff;
  cursor: pointer;
  min-height: 15px;
  overflow: hidden;
  position: relative;
  text-align: center;
}

.custom-input-file .input-file {
 border: 10000px solid transparent;
 cursor: pointer;
 font-size: 10000px;
 margin: 0;
 opacity: 0;
 outline: 0 none;
 padding: 0;
 position: absolute;
 right: -1000px;
 top: -1000px;
}
.box-update-json {
  position: relative;
}
input[type="file"] {
  width: 200px;
  height: 32px;
  display: inline-block;
}
.input-update-json {
  position: absolute;
  width: 116px;
  height: 40px;
  /* filter: opacity(0); */
  z-index: 50;
}
tr {
  color: white;
}
input, button{
  margin-left:10px;
}
.input-table {
  margin-left: 0;
}
</style>
<script>
import { mapState, mapActions } from "vuex";
import collectableService from "../services/collectable";
import TokenService from "../services/token";
import { BigNumber} from 'ethers';

export default {
  name: "AdminPanel",
  data() {
    return { 
      whitelistAddress: "",
      addressToAirdrop: "",
      newOwnerAddress: "",
      provenanceHash: "",
      quantityToAirdrop: 1,
      baseURI: "",
      contractEDOTokenAddress: "",
      contractBreedingManagerAddress: "",
      stakeNftsOwner: [{
        tokenOwner: "",
        rarity: "",
        tokenId: ""
      }],
    }
  },
  methods: {
    ...mapActions("collectable", [
      "claimNfts",
      "transferOwnership",
      "setBaseURI",
      "withdraw",
      "flipSaleState",
      "flipPreSaleState",
      "flipBreedingState",
      "getBreedPrice",
      "setBreedingPrice",
      "setTokenRates",
      "setWhitelistMintPrice",
      "setMintPrice",
      "getUserTokens"
    ]),
    updateJsonFile(evt){
      try {
          let files = evt.target.files;
          if (!files.length) {
              alert('No file selected!');
              return;
          }
          let file = files[0];
          let reader = new FileReader();
          const self = this;
          reader.onload = async (event) => {
              let result = await JSON.parse(event.target.result)
              this.stakeNftsOwner = result.tokens
          };
          reader.readAsText(file);
      } catch (err) {
          console.error(err);
      }
    },
    async setYieldToken(){
      await collectableService.setYieldToken(this.contractEDOTokenAddress);
    },
    async setBreedingManager(){
      await collectableService.setBreedingManager(this.contractBreedingManagerAddress);
    },
    async setBreedPrice() {
      this.setBreedingPrice({breedingPrice: this.collectable.breedingPrice})
    },
    async changewhitelistSigner() {
      await collectableService.setWhitelistSigningAddress(this.whitelistAddress);
    },
    async nftAirdrop() {
      if (!this.wallet) {
        return this.$toast.error("Connect your wallet first.", {
          position: "top",
        });
      }
      if (!this.quantityToAirdrop || this.quantityToAirdrop <= 0) {
        return this.$toast.error("Amount must be positive", {
          position: "top",
        });
      }
      if (!this.addressToAirdrop) {
        return this.$toast.error("Address required", {
          position: "top",
        });
      }
      await this.claimNfts({ address: this.addressToAirdrop, quantity: this.quantityToAirdrop });
    },
    async doTransferOwnership() {
      await this.transferOwnership({ newOwner: this.newOwnerAddress });
    },
    async setTokenRates() {
      let rates = [0, 2, 4, 7, 10, 20, 20, 40, 70, 100, 200, 40, 140, 80, 200, 400, 0, 0, 0, 0]
      if(rates.length === 20) {
        for(let i = 0; i < rates.length; i++) {
          // rates[i] = rates[i]*1e17
          // rates[i] = web3.utils.toWei((rates[i]*1e17).toString());
          // rates[i] = "0x"+rates[i]*1e17.toString(16);
          // rates[i] = BigInt(rates[i]*1e17);
          // rates[i] = web3.utils.toBigNumber(rates[i]*1e17);
          rates[i] = BigNumber.from(rates[i]).mul(BigNumber.from(10).pow(18));
        }
        await TokenService.setTokenRates(rates)
      } else {
        return this.$toast.error("Invalid Rates", {
          position: "top",
        });
      }
    },
    addNewToken(){
      if(this.stakeNftsOwner.length < 50) {
        this.stakeNftsOwner.push({
          tokenOwner: "",
          rarity: "",
          tokenId: ""
        })
      }
    },
    async saveRaritiesOwner(){
      let tokenIds = []
      let rarities = []
      let tokenOwners = []
      this.stakeNftsOwner.forEach(nft => {
        tokenIds.push(nft.tokenId)
        rarities.push(nft.rarity)
        tokenOwners.push(nft.tokenOwner)
      })
      await TokenService.bulkAdminRarityRegistration(tokenIds, rarities, tokenOwners)
    }
  },
  computed: {
    ...mapState("wallet", ["wallet"]),
    ...mapState("collectable", ["collectable"]),
  },
};
</script>
