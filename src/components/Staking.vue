<template>
  <div>
	<div class="container-header">
		<div class="header" id="staking">Staking</div>
	</div>
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
	<img class="ellipse-1" src="../assets/img/staking-img/ellipse1.png" alt="">
	<img class="ellipse-2" src="../assets/img/staking-img/ellipse2.png" alt="">
	<div class="d-none d-md-flex container nfts-container">
		<div class="card-container" v-for="(nft, index) in allStaking" :key="index">
			<div class="coin-gif"></div>
			<div class="text">{{nft.text}}</div>
			<router-link to="/my-dojo" class="button-connect btn-my-dojo-staking">My Dojo
				<span v-if="!wallet" @click="showModal" class="text-staking-btn">CONNECT YOUR WALLET</span>
				<span v-else-if="collectable.gettingUserNFTs" class="text-staking-btn">Getting your vsamurais...</span>
				<span v-else-if="!collectable.userNFTs || !collectable.userNFTs.length" class="text-staking-btn">You don't have any NFT</span>
			</router-link>
		</div>
	</div>
	<div class="d-md-none">
		<Splide :options="{ type: 'loop',rewind: true, perPage: 1, perMove: 1, focus: 'center', arrows: false, padding: 10 }">
			<SplideSlide v-for="(nft, index) in allStaking" :key="index">
				<div class="div-container-img-carousel">
					<div class="coin-gif"></div>
					<div class="text">{{nft.text}}</div>
					<router-link to="/my-dojo" class="button-connect btn-my-dojo-staking">My Dojo
						<span v-if="!wallet" @click="showModal" class="text-staking-btn">CONNECT YOUR WALLET</span>
						<span v-else-if="collectable.gettingUserNFTs" class="text-staking-btn">Getting your vsamurais...</span>
						<span v-else-if="!collectable.userNFTs || !collectable.userNFTs.length" class="text-staking-btn">You don't have any NFT</span>
					</router-link>
				</div>
			</SplideSlide>
		</Splide>
	</div>
	<hr class="line">
	<Modal
        v-show="isModalVisible"
        @close="closeModal"
        @openWallet="openWallet"
	/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import walletService from "../services/wallet";
import Modal from "./WalletsModal.vue";
import NetworkService from "../services/network"

export default {
  name: "Staking",
	components: { Splide, SplideSlide },
	data(){
		return {
			isModalVisible: false,
      		nameWallet: "",
      		networkWallet: '',
			allStaking: [
				{
					text: 'earned tokens',
				},
			],
		}
	},
	components: { Modal },
	computed: {
    	...mapState("wallet", ["wallet"]),
    	...mapState("collectable", ["collectable"]),
	},
	methods: {
		...mapActions("wallet", ["setWallet", "disconectWallet"]),
    	...mapMutations("collectable", ["emptyCollection"]),
		async openWallet(wallet) {
			this.isModalVisible = false;
			this.nameWallet = wallet;
			let address = await walletService.connect(wallet);
			await this.setWallet({ address });
			this.networkWallet = await NetworkService.getCurrentNetwork();
		},
		showModal() {
			this.isModalVisible = true;
		},
		closeModal() {
			this.isModalVisible = false;
		},
	}
}
</script>

<style scoped>

.text-staking-btn{
		visibility: hidden;
	  width: 295px;
    background-color: #020e1f;
    color: #EF0A0A;
    text-align: center;
    border-radius: 6px;
    padding: 26px 0px;
    font-family: 'Raleway';
    font-size: 17px;
    position: absolute;
    right: -24px;
    top: -9px;
}

.btn-my-dojo-staking:hover .text-staking-btn {
  visibility: visible;
}

.btn-my-dojo-staking{
	margin-bottom: 100px;
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
  margin-left: 87px;
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
	margin: 10px;
	width: 250px;
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.text {
	font-family: 'Raleway';
	font-size: 18px;
	text-align: center;
	color: #FFFFFF;
	letter-spacing: 2px;
	margin-bottom: 30px;
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
.image-nft {
	max-width: 250px;
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
@media (max-width: 767.98px) {
 .text-staking-btn[data-v-638094] {
  	right: -34px;
  	top: -5px;
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
	}
}

</style>

<style>
.splide__pagination {
    bottom: 0px;
    position: inherit;
    margin-top: 10px;
}
.splide__pagination__page {
	opacity: 1;
	width: 17px;
	height: 17px;
	margin: 6px;
	background: transparent;
	border: 1px solid white;
}
.splide__pagination__page.is-active {
	border: 1px solid #F28B2E;
	background: #F28B2E!important;
	transform: none!important
}
</style>
