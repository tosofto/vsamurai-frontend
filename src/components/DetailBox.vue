<template>
  <div id="stages">
    <br />
    <div class="detail-box-container">
      <img src="../assets/img/Vector.png" class="vector" />
      <div class="detail-block">
        <img src="../assets/img/stage1.png" alt="Ellipse-1" />
				<div class="detail-text">
					<h2>Stage 1: Historical Era</h2>
					<p>This era contains 2000 male and female Genesis Samurai with properties inspired by Edo period Japanese Ukiyoe woodprints. </p>
				</div>
      </div>
      <div class="detail-block">
        <img src="../assets/img/stage2.png" alt="Ellipse-2" />
				<div class="detail-text">
					<h2>Stage 2: Modern Era</h2>
					<p>???</p>
				</div>
      </div>
      <div class="detail-block">
        <img src="../assets/img/stage3.png" alt="Ellipse-3" />
				<div class="detail-text">
					<h2>???</h2>
					<p></p>
				</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailBox",
};
</script>

<style scoped>
/* DETAIL BOX */

.detail-box-container {
  max-width: 1300px;
  margin: auto;
}
.detail-block {
  display: flex;
  margin: 100px;
  align-items: center;
  margin-left: 163px;
}
.detail-text {
	max-width: 900px;
}
.detail-text h2 {
  font-family: "Raleway";
  font-size: 30px;
  color: #ffffff;
  margin: 20px;
  padding-left: 80px;
  letter-spacing: 2px;
}
.detail-text p {
  font-family: "Raleway";
  font-size: 20px;
  color: #ffffff;
  margin: 20px;
  padding-left: 80px;
  letter-spacing: 2px;
}
.detail-block img {
  border-radius: 50%;
}
.vector {
  position: absolute;
  right: 0;
  margin-top: 150px;
  opacity: 0.5;
}

@media (max-width: 1399.98px) {
  /* .detail-box-container {
    width: 100%;
    margin: auto;
    position: relative;
    overflow-x: hidden;
  } */
  .detail-block {
    margin: 50px;
    margin-left: 149px;
  }
}

@media (max-width: 1199.98px) {
  .detail-box-container {
    width: 100%;
    margin: auto;
  }
  .detail-block {
    margin: 100px;
  }
}

@media (max-width: 991.98px) {
  .detail-box-container {
    width: 100%;
  }
  .detail-block {
    margin: 50px;
  }
}

@media (max-width: 767.98px) {
  .detail-box-container {
    width: 100%;
    margin-top: 50px;
  }
  .detail-block {
    margin: 50px;
  }
}

@media (max-width: 625px) {
  .detail-block {
    margin: 50px;
    flex-direction: column;
  }
	.detail-text h2 {
  	font-size: 20px;
		text-align: center;
		padding-left: 0px;
	}
	.detail-text p {
  	font-size: 15px;
		text-align: center;
		padding-left: 0px;
	}
  .vector {
    right: -90px;
    margin-top: 427px;
  }
  .detail-box-container {
    width: 100%;
    margin: auto;
    position: relative;
    overflow-x: hidden;
  }
}
</style>
