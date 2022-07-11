<template>
  <nav class="navbar navbar-expand-xxl navbar-top" id="navbarId">
    <div>
      <!-- <img class="navbar-logo" src="../../src/assets/img/logo-navbar.png" alt=""> -->
      <router-link to="/" class="button-logo">
        <img class="navbar-logo" src="../../src/assets/img/logo-navbar.png" alt="">
      </router-link>
    </div>
    <div class="container-fluid px-5 nav-bar-height navbar-display">
      <div class="nav-bar-left">
        <button
          type="button"
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="changeBackgroundNavbar"
        >
          <i class="fas fa-bars navbar-toggler-collapse" v-if="!navbarOpen"></i>
          <i class="fas fa-times navbar-toggler-collapse" v-else ></i>
        </button>
      </div>
      <div class="collapse navbar-collapse navbar-collapse-top" id="navbarNav">
        <ul class="navbar-nav">
          <!-- <li class="nav-item">
            <a href="#" class="nav-link"  @click="closeNavbar">Collection</a>
          </li> -->
          <li class="nav-item">
            <a href="#" class="nav-link"  @click="closeNavbar">Mint</a>
          </li>
          <li class="nav-item">
            <a href="/#staking" class="nav-link"  @click="closeNavbar">Staking</a>
          </li>
          <li class="nav-item">
            <a href="/#stages" class="nav-link"  @click="closeNavbar">Stages</a>
          </li>
          <li class="nav-item">
            <a href="/#utility" class="nav-link"  @click="closeNavbar">Utility</a>
          </li>
          <li class="nav-item">
            <a href="/#manifesto" class="nav-link" @click="closeNavbar">Manifesto</a>
          </li>
          <li class="nav-item">
            <router-link to="/my-dojo" class="nav-link" @click="closeNavbar">My Dojo
              <span v-if="!wallet" class="tooltiptext">CONNECT YOUR WALLET</span>
              <span v-else-if="collectable.gettingUserNFTs" class="tooltiptext">Getting your vsamurais...</span>
              <span v-else-if="!collectable.userNFTs || !collectable.userNFTs.length" class="tooltiptext">You don't have any NFT</span>
            </router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/breeding" class="nav-link" @click="closeNavbar">Breeding
              <span v-if="!wallet" class="tooltiptext">CONNECT YOUR WALLET</span>
              <span v-else-if="collectable.gettingUserNFTs" class="tooltiptext">Getting your vsamurais...</span>
              <span v-else-if="!collectable.userNFTs || !collectable.userNFTs.length" class="tooltiptext">You don't have any NFT</span>
            </router-link>
          </li> -->
        </ul>
        <div class="icons" v-if="!wallet">
          <div class="nav-item nav-item-social">
            <a href="https://discord.gg/G8Y2yxp2Q8" target="_blank" class="social-links" @click="closeNavbar" ><i class="fab fa-discord social-icon"></i></a>
          </div>
          <div class="nav-item nav-item-social">
            <a href="https://twitter.com/vSamurai_NFT" target="_blank" class="social-links" @click="closeNavbar" ><i class="fab fa-twitter social-icon"></i></a>
          </div>
          <div class="nav-item nav-item-social">
            <a href="https://opensea.io/collection/vsamurai-genesis" target="_blank" class="social-links" @click="closeNavbar">
              <img src="../assets/img/opensea.png" width="44" height="38" alt="Opensea">
            </a>
          </div>
        </div>
        <li class="nav-item-button">
          <div class="div-connect-to-wallet">
            <div v-if="!wallet" style="z-index: 50">
              <button type="button" class="button-connect" @click="showModal">
                CONNECT
              </button>
            </div>
            <div
              v-else
              class="container-wallet-conected"
              style="position: relative"
            >
              <div class="div-network-wallet">
                {{networkWallet}}
              </div>
              <button type="button" class="btn btn-connect-wallet-adrress">
                <span class="btn-connect-wallet-address">{{
                  walletShort
                }}</span>
              </button>
              <div class="box-arrow-disconect" @click="disconect">
                DISCONNECT
              </div>
            </div>
          </div>
        </li>

      </div>
      <Modal
        v-show="isModalVisible"
        @close="closeModal"
        @openWallet="openWallet"
      />
    </div>
  </nav>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import walletService from "../services/wallet";
import Modal from "./WalletsModal.vue";
import NetworkService from "../services/network"

export default {
  name: "TopBar",
  components: {
    Modal,
  },
  data() {
    return {
      isModalVisible: false,
      nameWallet: "",
      currentLink: "",
      navbarOpen: false,
      networkWallet: '',
    };
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
    async disconect() {
      if (this.nameWallet === "walletConnect") {
        await walletService.disconnected();
      }
      let address = "";
      this.disconectWallet({ address });
      this.emptyCollection();
      if (this.$route.path === "/admin") {
        this.$router.push("/");
      }
      if (this.$route.path === "/my-dojo") {
        this.$router.push("/");
      }
      if (this.$route.path === "/breeding") {
        this.$router.push("/");
      }
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    activeLink(link) {
      this.currentLink = link;
    },
    closeNavbar(){
      $('.navbar-collapse').collapse('hide');
      this.navbarOpen = false
      $("#navbarId").removeClass("background-navbar");
    },
    changeBackgroundNavbar(){
      this.navbarOpen = !this.navbarOpen
      if( this.navbarOpen ){
        $("#navbarId").addClass("background-navbar");
      }else{
        $("#navbarId").removeClass("background-navbar");
      }
    }
  },
  computed: {
    ...mapState("wallet", ["wallet"]),
    ...mapState("collectable", ["collectable", "errorMsg", 'successMsg']),
    showMessageError() {
      if (this.errorMsg) {
        this.$toast.error(this.errorMsg, {
          position: "top",
        });
      }
    },
    showMessageSuccess() {
      if (this.successMsg) {
        this.$toast.success(this.successMsg, {
          position: "top",
        });
      }
    },
    walletShort() {
      const prefix =
        this.wallet && this.wallet.address && this.wallet.address.toString().slice(0, 6).toUpperCase();
      const length = this.wallet && this.wallet.address && this.wallet.address.toString().length;
      const suffix =
        this.wallet &&
        this.wallet.address &&
        this.wallet.address
          .toString()
          .slice(length - 4, length)
          .toUpperCase();
      return `${prefix}...${suffix}`;
    },
  },
};
</script>

<style scoped>
.navbar-nav{
  letter-spacing: 2px;
}
.nav-item {
  position: relative;
}
.separator {
  position: absolute;
  top: 52%;
}
.router-link-active {
  opacity: 1 !important;
}

.tooltip {
  position: relative;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #080e1f;
  color: #7eb5f3;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.gallery-tooltip {
  left: -15px !important;
}

.media-bar {
  align-self: flex-end;
  padding-right: 4rem !important;
  justify-content: flex-end;
  background-color: #000;
}
</style>
