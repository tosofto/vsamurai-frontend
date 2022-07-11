<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="company">
        <img src="../assets/img/logo-bg.png" alt="">
        <h2>vSamurai is an NFT collection of male and female Samurai spanning across multiple stages.</h2>
        <h3>© 2022 vSAMURAI - ALL RIGHTS RESERVED.-</h3>
      </div>
      <div class="community">
        <div class="social-links">
          <a href="https://discord.gg/G8Y2yxp2Q8" Target="_blank"><img src="../assets/img/discord-2.png" alt="Discord" class="discord"></a>
          <a href="https://twitter.com/vSamurai_NFT" Target="_blank"><img src="../assets/img/twitter.png" alt="Twitter"></a>
          <a href="https://opensea.io/collection/vsamurai-genesis" Target="_blank">
            <img src="../assets/img/opensea.png" class="icon-footer-orange" alt="Opensea">
          </a>
        </div>
        <div class="text">
          <h2>Join Our Community</h2>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style scoped>
/* FOOTER */
.footer-container {
  height: 350px;
  display: flex;
  background-color: #000;
  justify-content: space-between;
}

.company {
  margin-top: 50px;
  margin-left: 100px;
  max-width: 840px;
}
.company img {
  width: 200px;
  margin-bottom: 20px;
}
.company h2{
  font-family: 'Raleway';
  font-size: 16px;
  text-transform: uppercase;
  color: #FFFFFF;
  margin-top: 20px;
  margin-bottom: 20px;
  letter-spacing: 2px;
}
.company h3{
  font-family: 'Raleway';
  font-size: 16px;
  color: #FFFFFF;
  opacity: 0.5;
  letter-spacing: 2px;
}
.community {
  margin-top: 50px;
  margin-right: 40px;
}
.community .discord {
  margin-right: 20px;
}
.community h2{
  margin-top: 40px;
  font-family: 'Raleway';
  font-size: 16px;
  color: #048abf;
  letter-spacing: 2px;
}
.form {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.input-header {
  color: #FFFFFF !important;
}
.input-email {
  outline: none;
  border: none;
  width: 296px;
  height: 43px;
  font-size: 16px;
  padding-left: 15px;
}

input::placeholder {
  color: #999999;
  font-family: 'Raleway';
  letter-spacing: 1.5px;
}

.btn {
  font-family: 'Raleway';
  margin-left: 20px;
  height: 41px;
  background: #048ABF;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.32);
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 2px;
  color: #FFFFFF;
}

@media (max-width: 991.98px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 800px;
    margin-top: 100px;
  }
  .company {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    margin-top: 0px;
    margin-left: 0px;
    text-align: center;
  }
  .community {
    height: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px 0px;
    margin-right: 0px;
  }
  .community h2 {
    margin-top: 0px;
    margin-bottom: 30px;
  }
  .social-links {
    position: absolute;
    bottom: 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -14px;
  }
  .btn {
    margin-left: 0px;
    margin-top: 20px;
  }
}

</style>
