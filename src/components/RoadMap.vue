<template>
  <div class="road-map-container" id="manifesto">
    <h2>Manifesto</h2>
    <div class="manifesto-text">
      For a more detailed breakdown of the values that fuel vSamurai, please visit: <a href="https://vsamurai.gitbook.io/info/vsamurai-manifesto" target="_blank" rel="noopener noreferrer">https://vsamurai.gitbook.io/info/vsamurai-manifesto</a>
    </div>
    <img src="../assets/img/Path.png" class="path" />
    <div class="blocks">
      <div class="block-1">
        <div class="road-map-block-c">
          <p>
            1. Transparency: key to success lies in how honest we are with the vSamurai community.
          </p>
        </div>
      </div>

      <div class="block-2">
        <div class="road-map-block-b">
          <p>
            2. Clear, driven project direction: providing constant value and utility to all vSamurai hodlers for as long as we can!
          </p>
        </div>
      </div>

      <div class="block-1">
        <div class="road-map-block-c">
          <p>
            3. Commitment to our NFT community, our brand, and ourselves: we are all in on vSamurai. We take pride in our brand and ourselves - this will be evident!
          </p>
        </div>
      </div>

      <div class="block-2">
        <div class="road-map-block-b">
          <p>
            4. Our ultimate vision: building an MMO Strategy game revolving around each unique vSamurai NFT! 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "RoadMap",
}
</script>

<style scoped>
/* ROAD MAP */
.line-png-responsive, .line-png-responsive-1 {
  display: none;
}

.manifesto-text{
  max-width: 1360px;
  font-family: 'Raleway';
  font-size: 24px;   
  color: #FFFFFF;
  margin: 20px auto;
	text-align: center;
  letter-spacing: 2px;
  padding-bottom: 20px;
}

.road-map-container {
  margin: 50px;
}
.block-1,
.block-2 {
  margin-bottom: 50px;
}
.blocks {
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 200px;
}
.road-map-container h2 {
  padding-top: 50px;
  font-family: "pixel-point";
  color: #ef0a0a;
  font-size: 42px;
  text-align: center;
  margin-bottom: 80px;
}
.road-map-container p {
  font-family: "Raleway";
  font-size: 16px;
  color: #ffffff;
  margin-top: 15px;
  padding: 15px;
  letter-spacing: 2px;
}
.road-map-block-c {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #03658c;
  box-shadow: inset 0px 1px 15px rgba(255, 255, 255, 0.26);
  border-radius: 9px;
  margin: 20px;
  width: 510px;
  height: 128px;
}
.road-map-block-b {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #022741;
  box-shadow: inset 0px 1px 15px rgba(255, 255, 255, 0.26);
  border-radius: 9px;
  width: 510px;
  height: 128px;
  margin: 20px;
}
.path {
  margin-top: 100px;
  position: absolute;
  right: 50px;
  z-index: 50;
}

@media (max-width: 767.98px) {
  .manifesto-text a{
    font-size: 12px;
  }
  .road-map-container p {
    font-family: "Raleway";
    font-size: 14px;
    color: #ffffff;
    margin-top: 15px;
    padding: 15px;
  }
  .road-map-block-c {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .road-map-block-b {
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 625px) {
  .manifesto-text{
    font-size: 16px;
  }

	.road-map-container h2 {
		font-size: 26px;
	}
  .line-png {
    display: none;
  }

  .blocks {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .block-1, .block-2 {
    flex-direction: column;
    margin-left: 0px;
    justify-content: center;
    align-items: center;
  }

  .road-map-block-c, .road-map-block-b {
    margin: 0px;
    width: 362px;
    height: 130px;
    margin-left: 0px;
  }

  .line-png-responsive {
    display: flex;
    height: 166.26px;
    width: 49.46px;
    margin-bottom: 20px;
  }
  .line-png-responsive-1 {
    display: flex;
    height: 156.73px;
    width: 49.46px;
    margin-bottom: 20px;
  }
  .path {
    margin-top: -62px;
    right: 24px;
    width: 721px;
    height: 1100px;
  }
}

</style>
