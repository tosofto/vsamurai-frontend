<template>
  <div>
    <div class="presentation-box">
      <div class="container presentation-container">
        <img class="presentation-logo" src="../assets/img/logo-bg.png" alt="">
        <p class="presentation-description">vSamurai is a collection of pixelated male and female Samurai of varying classes. Each class of Samurai is of a varying rarity - which generates a set amount of EDO tokens - used to usher in a new age of distinct warriors!  Get ready to join the vSamurai, or risk defeat!
        </p>
        <!-- <a href="#stages" class="learn-more-btn" v-if="wallet">LEARN MORE</a> -->
        <!-- <a v-if="!wallet" href="#stages" class="learn-more-btn">LEARN MORE</a>
        <div v-if="wallet" class="div-container-mint">
          <div class="div-counter-container">
            <button v-if="collectable.saleState" :disabled="quantity <= 1" @click="quantity--" class="fas fa-minus btn-counter-mint"></button>
            <span class="info-mint">{{quantity}} (ETH {{ (quantity* nftPrice).toFixed(3) }})</span>
            <button v-if="collectable.saleState" :disabled="quantity >= 5" @click="quantity++" class="fas fa-plus btn-counter-mint"></button>
          </div>
          <button class="button-mint" @click="mint" v-if="!loading">MINT</button>
          <div class="button-mint-rainbow-container" v-else>
            <div class="div-button-mint-rainbow"  type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>   
            </div>
          </div>
        </div> -->
        <AdminPanel v-if="collectable.isOwner" />
      </div>
    </div>  
    <!-- Timer -->
    <!-- <Timer /> -->
    <!-- Staking -->
    <Staking />
    <!-- Detail Box -->
    <DetailBox />
    <!-- Utility Heading -->
    <Utility />
    <!-- Road Map -->
    <RoadMap />
    <!-- The Team -->
    <TheTeam />
  </div>
</template>

<script>
import Staking from '../components/Staking.vue';
import RoadMap from '../components/RoadMap.vue';
import Utility from '../components/Utility.vue';
import DetailBox from '../components/DetailBox.vue';
import Timer from '../components/Timer.vue';
import TheTeam from '../components/TheTeam.vue';
import { mapState, mapActions } from "vuex";
import whitelistService from "../services/whitelist";
import ModalMember from "../components/ModalTeam";
import AdminPanel from '../components/AdminPanel.vue';

export default {
  name: "Home",
  data() {
    return {
      quantity: 1,
      maxNFTs: 2,
      showModalMember: false,
      memberSelect: {},
      loading: false
    };
  },
  components: {
    ModalMember,
    Staking,
    RoadMap,
    Utility,
    Timer,
    DetailBox,
    TheTeam,
    AdminPanel,
  },
  methods: {
    ...mapActions("collectable", [
      "publicSaleMint",
      "mintWhitelist",
    ]),
    async mint() {
      if(!this.wallet){
        return this.$toast.error("Connect your wallet first.", {
          position: "top",
        });
      }
      const enoughFunds = this.wallet.balance > this.quantity * web3.utils.toWei(this.nftPrice, 'ether');
      if(!enoughFunds){
        return this.$toast.error("You do not have enough balance", {
          position: "top",
        });
      }
      this.loading = true
      if(this.collectable.saleState) {
        await this.publicSaleMint({ quantity: this.quantity, nftPrice: web3.utils.toWei(this.nftPrice, 'ether')});
       if(this.successMsg === "NFT Minted successfully") {
          this.$toast.success(`${this.successMsg}`, { position: "top" });
        }
      } else if(this.collectable.preSaleState) {
        try {
          const signature = await whitelistService.getWhitelistSignature(this.wallet.address);
          if(!signature) {
            this.loading = false
            return this.$toast.error("You wallet is not whitelisted", { position: "top" });
          }
          await this.mintWhitelist({ quantity: this.quantity, signature, nftPrice: web3.utils.toWei(this.nftPrice, 'ether') });
          if(this.successMsg === "NFT Minted successfully") {
            this.$toast.success(`${this.successMsg}`, { position: "top" });
          }
        } catch(e) {
          console.error(`Error getting whitelist signature - ${e.message} - ${e.stack}`)
          this.$toast.error(`Error getting whitelist signature - ${e.message} - Try again later`, {
            position: "top",
          });  
        }
      } else {
        this.$toast.error("Sale is closed", {
          position: "top",
        });
      }
      this.loading = false
    },
    showModal(member) {
      this.showModalMember = true;
      this.memberSelect = member;
    },
    closeModal() {
      this.memberSelect = {};
      this.showModalMember = false;
    },
  },
  computed: {
    nftPrice() {
      if(this.collectable.saleState) {
        return this.collectable.nftPrice
      } else {
        return this.collectable.nftWhitelistPrice
      }
    },
    showMessageError() {
      if (this.errorMsg) {
        this.$toast.error(this.errorMsg, {
          position: "top",
        });
      }
    },
    ...mapState("wallet", ["wallet"]),
    ...mapState("collectable", ["collectable", "errorMsg", "successMsg"]),
  },
};
</script>