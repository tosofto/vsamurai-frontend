<template>
	<div>
		<br><br><br><br><br><br>
		<div class="staking-text">
			All vSamurai NFT hodlers will be able to stake their Samurai to earn EDO tokens. These chosen warriors will earn their hodlers different token yields based on the rarity class which they hail from
			<ul>
			<li>Samurai: 2 EDO tokens per day</li>
			<li>Ronin and Onna-Musha: 4 EDO tokens per day</li>
			<li>Shogun and Kunoichi: 7 EDO tokens per day</li>
				<li>Emperors and Empresses: 10 EDO tokens per day</li>
			</ul>
			Currently, EDO tokens should be accumulated for ‘marrying’ (breeding) male and female Samurai, a utility function that will be introduced in future stages. All future utility applications will be announced on our Twitter and Discord.
		</div>
		<div v-if="collectable.gettingUserNFTs" class="text-center">
			<div class="spinner-border" style="border-color: white; border-right-color: transparent; width: 8rem; height: 8rem;" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
		<div v-else>
			<div class="d-none d-md-flex container nfts-container">
				<div class="card-container" v-for="(nft, index) in collectable.userNFTs" :key="index">
					<img class="sword-gif" :src="getImageURL(nft)" alt="" />
					<div class="data">
						<div class="text">EDO tokens earned {{ parseFloat(nft.reward).toFixed(3) }} </div>
						<div class="coin-gif"></div>
					</div>
					<div class="text-rarity">
						{{ nft.rarityClass }}
					</div>
					<button v-if="nft.rarity == 0" @click="stakeNFT(nft.id, nft.rarityBackend, $event)" type="button" class="button-connect">STAKE</button>
					<button v-else :disabled="nft.reward == 0" @click="claimRewardsNFT(nft.id)" type="button" :class="`button-connect ${nft.reward == 0 ? 'button-connect-disabled' : ''}`">CLAIM</button>
					<br><br><br><br>
				</div>
			</div>
			<div class="d-md-none">
				<Splide :options="{ type: 'loop',rewind: true, perPage: 1, perMove: 1, focus: 'center', arrows: false, padding: 10 }">
					<SplideSlide v-for="(nft, index) in collectable.userNFTs" :key="index">
						<div class="div-container-img-carousel">
							<img class="sword-gif" :src="getImageURL(nft)" alt="" />
							<div class="data">
								<div class="text">EDO tokens earned {{ parseFloat(nft.reward).toFixed(3) }} </div>
							</div>
							<div class="text-rarity">
								{{ nft.rarityClass }}
							</div>
							<button v-if="nft.rarity == 0" @click="stakeNFT(nft.id, nft.rarityBackend, $event)" type="button" class="button-connect">STAKE</button>
							<button v-else :disabled="nft.reward == 0" @click="claimRewardsNFT(nft.id)" type="button" :class="`button-connect ${nft.reward == 0 ? 'button-connect-disabled' : ''}`">CLAIM</button>
						</div>
					</SplideSlide>
				</Splide>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import EDOTokenServices from "../services/token"
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import axios from 'axios';
import NetworkService from '../services/network';

export default {
  name: 'myDojo',
  components:{ Splide, SplideSlide },
  data(){
    return {}
  },
  methods: {
    ...mapActions("collectable", ["getUserTokens", "updateTotalClaimable"]),
    getImageURL(nft) {
      console.log('Getting image for nft: ', nft);
      if(['111', '333', '777', '1111', '1499', '1998'].includes(nft.id.toString()) ) {
        return `https://storage.googleapis.com/vsamurai-images/${nft.id}.gif`
      }
      return `https://storage.googleapis.com/vsamurai-images/${nft.id}.png`
    },
	async stakeNFT(nftId, rarity, event){
		console.log("rarity",rarity);
			console.log("nftId",nftId);

			let element = event.target;
			if(element.innerText == "INITIALIZING...")return;

		let apiBaseURI = "https://vsamurai-nft.wn.r.appspot.com"
		let chainId = await NetworkService.getNetworkId()
		let address = this.wallet.address;
		let apiURL = `${apiBaseURI}/api/signatures/rarity?chainId=${chainId}&address=${address}&nftId=${nftId}`


		element.innerText = "INITIALIZING..." || "TRANSACTION COMPLETED";

		let signature = await axios.get(apiURL).then(res => {
				this.$toast.info("Contract sent to your Wallet. Please accept to proceed.", {
					position: "top",
					duration: 5000
				});
				element.innerText = "AWAITING ACCEPTANCE...";
				return res.data;
		}).catch(e => {
				element.innerText = "INITIALIZATION FAILED!";
				setTimeout(function(){
						element.innerText = "STAKE";
				}, 2000);
			console.error(e)}
		);
		console.log("signature",signature);
		let rewardResp = await EDOTokenServices.registerForRewards(signature, nftId, rarity);
		if(rewardResp == "Error" || !rewardResp){
			this.$toast.error("Your last transaction could not be completed!", {
				position: "top",
			});
				element.innerText = "TRANSACTION FAILED";
				setTimeout(function(){
					if(element)
						element.innerText = "STAKE";
				}, 2000);
		}else{
			this.$toast.success("Transaction completed!", {
				position: "top",
			});
				element.innerText = "TRANSACTION COMPLETED";
		}
		console.log("rewardResp",rewardResp);
		await this.getUserTokens({})
	},
	async claimRewardsNFT(nftId){
		await EDOTokenServices.claimRewards(nftId)
		await this.getUserTokens({})
	},
	async rarities(nftId){
		return await EDOTokenServices.rarities(nftId)
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
