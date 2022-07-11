<script>
  export default {
    name: 'Modal',
    methods: {
      close() {
        this.$emit('close');
      },
      openWallet(wallet){
        this.$emit('openWallet', wallet);
      }
    },
  };
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal-wallets" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <header class="modal-header" id="modalTitle">
          <slot name="header" class="modal-title">
            Connect to a wallet
          </slot>
          <button type="button" class="btn-close" @click="close" aria-label="Close modal">
            <i class="fas fa-times icon-close-modal"></i>
          </button>
        </header>
        <div class="body-modal-wallet">
          <div class="row-wallet mb-3" @click="openWallet('metamask')">
            <div class="title-wallet-modal">
              Metamask
            </div>
            <div style="padding-right: 5px">
              <img src="../assets/img/metamask.png" width="40" height="40" alt="logo metamask" />
            </div>
          </div>
          <div class="row-wallet" @click="openWallet('walletConnect')">
            <div class="title-wallet-modal">
              WalletConnect
            </div>
            <div style="padding-right: 5px">
              <img src="../assets/img/walletconnect.png" width="40" height="30" alt="logo metamask" style="margin: 5px 0" />
            </div>
          </div>
        </div>
        <div class="footer-modal">
          <div class="text-footer-primary">New to Ethereum?</div>
          <a href="https://ethereum.org/en/wallets/" target="_blank" style="text-decoration: none">
            <div class="text-footer-secondary">Learn more about wallets</div>
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.icon-close-modal {
  padding-right: 10px;
  color: var(--white);
}
.text-footer-primary {
  text-align: center;
  font-size: 16px;
  font-family: var(--proxima);
  color: #ffffff8e;
}
.text-footer-secondary {
  text-align: center;
  color: #FFFFFF;
  font-family: var(--proxima);
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
}
.title-wallet-modal {
  font-family: var(--rockoUltraFLF-bold);
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  color: #FFFFFF;
  font-weight: bold;
}
.row-wallet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19px;
  cursor: pointer;
  border: 2px solid white;
  background-size: cover;
  border-radius: 8px;
}
.body-modal-wallet {
  padding: 25px;
}
.modal-wallets {
  height: 345px;
  width: 300px;
  background: #0e2238;
  border-radius: 5px;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}
.modal-header {
  color: var(--primary-light);
  font-family: var(--rockoUltraFLF-bold);
  font-size: 18px!important;
  padding: 10px 15px 0 18px;
  display: flex;
  position: relative;
  border-bottom: none;
  justify-content: space-between;
  font-family: "Raleway";
  color: #ffffff;
  letter-spacing: 2px;
}
.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
}
.modal-body {
  position: relative;
  padding: 20px 10px;
}
.btn-close {
  opacity: 1;
  position: absolute;
  top: 12px;
  right: 15px;
  border: none;
  font-size: 28px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
  background: transparent;
  outline: none!important;
}
.btn-close:focus {
  outline: none!important;
  box-shadow: none!important
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease;
}
</style>