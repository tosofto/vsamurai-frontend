<template>
    <div>
        <br><br><br><br><br><br>
        <div class="staking-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex expedita mollitia ad dolorum placeat corporis deleniti repellat at ullam pariatur quaerat facere temporibus unde, est sapiente id quos esse vitae?
        </div>
        <div class="staking-title">
            EDOTOKEN needed to breed
        </div>
        <div class="staking-breeding-price">
            {{ collectable.breedingPrice }} <div class="coin-gif" style="height: 66px; width: 69px; margin-left: 25px"></div>
        </div>

        <div v-if="collectable.gettingUserNFTs" class="text-center">
            <div class="spinner-border" style="border-color: white; border-right-color: transparent; width: 8rem; height: 8rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="row breeding-row">
            <div class="breeding-row-divider"></div>
            <!-- MALE -->
            <div class="col-6">
                <div class="breeding-col">
                    <div v-for="(nft, index) in collectable.userNFTs" :key="index">
                        <div v-if="nft.gender === 1">
                            <div class="card-container">
                                <img class="sword-gif" alt="">
                                <div class="data">
                                    <div class="text">EDO tokens earned {{ parseFloat(nft.reward).toFixed(3) }} </div>
                                    <div class="coin-gif"></div>
                                </div>
                                <div class="text-rarity">
                                    <div style="height: inherit">
                                        {{ nft.rarityClass }}
                                    </div>
                                </div>
                                <button v-if="!nft.registerGender" @click="registerGender(nft)" type="button" class="button-connect">REGISTER</button>
                                <button v-else @click="selectNft(nft)" type="button" :class="`button-connect ${nftMale === nft ? 'button-connect-focus' : ''} `">SELECT</button>
                                <br><br><br><br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- FEMALE -->
            <div class="col-6">
                <div class="breeding-col">
                    <div v-for="(nft, index) in collectable.userNFTs" :key="index">
                        <div v-if="nft.gender === 2">
                            <div class="card-container">
                                <img class="sword-gif" alt="">
                                <div class="data">
                                    <div class="text">EDO tokens earned {{ parseFloat(nft.reward).toFixed(3) }} </div>
                                    <div class="coin-gif"></div>
                                </div>
                                <div class="text-rarity">
                                    <div style="height: inherit">
                                        {{ nft.rarityClass }}
                                    </div>
                                </div>
									<button v-if="!nft.registerGender" @click="registerGender(nft)" type="button" class="button-connect">REGISTER</button>
                                	<button v-else @click="selectNft(nft)" type="button" :class="`button-connect ${nftFemale === nft ? 'button-connect-focus' : ''} `">SELECT</button>
                                <br><br><br><br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex my-4 justify-content-center">
            <button @click="breed()" type="button" class="button-connect">BREED</button>
        </div>
    </div>

</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import EDOTokenServices from "../services/token"
import BreedingManagerServices from "../services/breeding-manager";
import CollectableServices from "../services/collectable";
import NetworkService from '../services/network';
import axios from 'axios';
import web3 from 'web3'

export default {
  name: 'breeding',
  data(){
    return {
        nftMale: null,
        nftFemale: null,
    }
  },
  methods: {
    ...mapActions("collectable", ["getUserTokens"]),
    ...mapMutations("collectable", [ "registerGenderNft" ]),
	async rarities(nftId){
		return await EDOTokenServices.rarities(nftId)
	},
    selectNft(nft) {
        if(nft === this.nftMale) {
            this.nftMale = null
        } else if(nft === this.nftFemale) {
            this.nftFemale = null
        }
        else if(nft.gender === 1) {
            this.nftMale = nft
        } else {
            this.nftFemale = nft
        }
    },
	async registerGender(nft) {
		let signature = null
		let apiBaseURI = "https://vsamurai-nft.wn.r.appspot.com"
		let chainId = await NetworkService.getNetworkId()
		let address = this.wallet.address
		let apiURL = `${apiBaseURI}/api/signatures/breed?chainId=${chainId}&address=${address}&nftId=${parseInt(nft.id)}&genderId=${parseInt(nft.gender)}`
		await axios.get(apiURL)
			.then(res => {
				signature = res.data
			})
			.catch(e => console.log(e))
		await BreedingManagerServices.registerGender(signature, parseInt(nft.id), parseInt(nft.gender))
			.then(res => {
				this.registerGenderNft({nftId: nft.id})
			})
			.catch(e => console.log(e))
	},
    async breed() {
		// if the owner allows breeding
		if (!this.collectable.breedingState) {
			return this.$toast.error("Unauthorized breeding", {
				position: "top",
			});
		}
        // if you have both genders select
        if(this.nftFemale && this.nftMale){
            // if you have the necessary edotokens
			console.log(this.collectable.edoTokensBalance)
			console.log(this.collectable.breedingPrice)
            if(this.collectable.edoTokensBalance >= this.collectable.breedingPrice) {
				await CollectableServices.breed(this.nftMale.id, this.nftFemale.id)
				await this.getUserTokens({})
            } else {
				return this.$toast.error("Insufficient EDOToken", {
					position: "top",
				});
            }
        } else {
			return this.$toast.error("It is required to select a male or female nft", {
				position: "top",
			});
        }
    },
  },
  computed: {
    ...mapState('collectable', ['collectable']),
    ...mapState('wallet', ['wallet']),
  },
}
</script>

<style scoped>
.splide__pagination {
    bottom: -90px;
}
.splide__pagination__page {
	opacity: 1;
	width: 17px;
	height: 17px;
	margin: 0px 6px;
	background: transparent;
	border: 1px solid white;
}
.splide__pagination__page.is-active {
	border: 1px solid #F28B2E;
	background: #F28B2E!important;
	transform: none!important
}
.container-header{
	display: flex;
  justify-content: center;
  align-items: center;
	margin-top: 100px;
	margin-bottom: 80px;
}

.coin-gif {
  background-image: url("../assets/img/staking-img/edo-coinn-anim.gif");
	height: 100px;
  background-repeat: no-repeat;
	width: 165px;
	margin-top: -5px;
	margin-left: -5px;
	margin-right: -25px;
}

.ellipse-1 {
	position: absolute;
	left: 0;
	margin-top: -230px;
}

.ellipse-2 {
	position: absolute;
	right: 0;
	margin-top: 183px;
}

.nfts-container {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	z-index: 1000;
	max-width: 1600px;
}

.card-container {
	margin: 10px 22px;
	width: 300px;
    height: 500px;
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.data {
	display: flex;
	margin-top: 20px;
	margin-left: 26px;
	justify-content: space-between;
}

.text {
	font-family: 'Raleway';
	font-size: 18px;
	text-align: center;
	color: #FFFFFF;
	letter-spacing: 2px;
}
.text-rarity {
	font-family: 'Raleway';
	font-size: 18px;
	text-align: center;
	color: #FFFFFF;
	letter-spacing: 2px;
	height: 24px;
	margin-bottom: 10px;
	margin-top: -26px;
}

.token {
	width: 54px;
	height: 54px;
	background: white;
	border-radius: 50%;
}

.container-header div{
  font-family: 'pixel-point';
  color: #EF0A0A;
  font-size: 42px;
  text-align: center;
	height: 100px;
}

.staking-text {
    max-width: 1360px;
	font-family: 'Raleway';
	font-size: 24px;
    color: #FFFFFF;
	margin: auto;
	letter-spacing: 2px;
	margin-bottom: 80px;
}
.staking-title {
    text-align: center;
	font-family: 'Raleway';
	font-size: 32px;
    color: #FFFFFF;
	margin: auto;
	letter-spacing: 2px;
	margin-bottom: 30px;
}
.staking-breeding-price {
    display: flex;
    justify-content: center;
    align-content: center;
	font-family: 'Raleway';
	font-size: 50px;
    color: #04D9C2;
	margin: auto;
	letter-spacing: 2px;
	margin-bottom: 80px;
}

ul {
	margin: 20px;
}

p{
  max-width: 1360px;
	height: 196px;
  font-family: 'Raleway';
  font-size: 24px;
  color: #FFFFFF;
  margin: 20px auto;
	text-align: center;
	font-weight: 600;
}

.line {
	margin: auto;
	max-width: 1000px;
	height: 3px;
	color: #03738B;
}
.vector {
	position: absolute;
  left: 0;
	margin-top: -40px;
  opacity: 0.5;
}
.staking-text {
	max-width: 1200px;
}
/* .image-nft {
	max-width: 250px;
} */
.image-nft{
  background-image:url('../assets/img/staking-img/staking.png');
  background-repeat:no-repeat;
	background-size: cover;
  width:250px;
	height:250px;
  background-position:center;
	border-radius: 50%;
	border: none;
	background-color: transparent;
}

@media (max-width: 1400px) {
	p {
		font-size: 20px;
		max-width: 1000px;
		padding: 10px;
	}
	.staking-text {
		max-width: 1000px;
	}
}

@media (max-width: 1200px) {
 	.line {
		max-width: 800px;
	}
	.staking-text {
		max-width: 700px;
		font-size: 16px;
		padding: 20px;
	}
}

@media (max-width: 950px) {
 .line {
	max-width: 700px;
	}
	.bottom-container p {
	font-size: 20px;
	}
}

@media (max-width: 730px) {
 .line {
		max-width: 500px;
		margin-top: 100px;
	}
	.bottom-container p {
		font-size: 15px;
	}
}

@media (max-width: 625px) {
	.header {
		font-size: 26px !important;
		height: 50px !important;
	}
	.staking-text {
		font-size: 16px;
		margin: 20px;
		margin-bottom: 100px;
	}
	.line {
		max-width: 310px;
	}
	.vector {
  	left: -35px;
	}
	.bottom-container{
		margin-top: 160px;
	}
	.text{
		font-size: 13px;
		margin-left: -14px;
	}
	.coin-gif{
		margin-top: -4px;
    margin-left: 11px;
	}
	.image-nft{
  	width:200px;
		height:200px;
	}
}
</style>
