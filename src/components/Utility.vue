<template>
    <h2 id="utility">Utility</h2>

    <div class="utility-heading-container">
        <div class="utility-block" > 
            <div class="gif-1"></div>
            <img src="../assets/img/rectangle-4.png" class="utility-bottom">
            <p>Hodl a male and female Samurai at the same time to ‘marry (breed) them together, creating an Akachan Samurai!</p>
        </div>
        <div class="utility-block">
            <img src="../assets/img/chest.png" class="utility-top">
            <img src="../assets/img/rectangle-4.png" class="utility-bottom">
            <p>Stake vSamurai to earn EDO tokens.</p>
        </div>
        <div class="utility-block">
            <img src="../assets/img/edo-token.png" class="utility-top">
            <img src="../assets/img/rectangle-4.png" class="utility-bottom">
            <p>Use EDO tokens to breed, or to obtain *top secret* drops.</p>
        </div>
        <div class="utility-block">
            <div class="gif-2"></div>
            <img src="../assets/img/rectangle-4.png" class="utility-bottom">
            <p>Hodling a vSamurai NFT gives premier access to our upcoming game.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Utility",
}
</script>

<style scoped>
/* UTILITY HEADING */
.utility-text{
  font-family: 'Raleway';
  font-size: 24px;   
  color: #FFFFFF;
  margin: 20px auto;
  text-align: left;
  align-items: center;
  justify-content: center;
  display: flex;
	flex-direction: column;
	letter-spacing: 2px;
}

div ul {
	max-width: 1000px;
}

h2{
    font-family: 'pixel-point';
    color: #EF0A0A;
    font-size: 42px;
    text-align: center;
    padding-top: 100px;
	margin-bottom: 100px;
}

.utility-heading-container {
    margin: 100px 0px;
    display: flex;
    justify-content: center;
}

.utility-heading-container p{
    font-family: 'Raleway';
    font-size: 16px;    
    color: #FFFFFF;
    width: 280px;
    margin-top: 60px;
    text-align: center;
	letter-spacing: 2px;
}

.utility-block {
    position: relative;
    padding: 0 30px;
}
.utility-top {
    z-index: 100;
    position: relative;
    width: 250px;
    height: 250px;
    border-radius: 10px;	
}
.gif-1 {
    z-index: 100;
    position: relative;
    width: 250px;
    height: 250px;
    border-radius: 10px;
    background-image: url("../assets/img/hodl-gif.gif");
    background-repeat: no-repeat;
	background-size: cover;
}
.gif-2 {
    z-index: 100;
    position: relative;
    width: 250px;
    height: 250px;
    border-radius: 10px;
    background-image: url("../assets/img/hodling.gif");
    background-repeat: no-repeat;
    background-position: center;
	background-size: cover;
}
.utility-bottom {
    position: absolute;
    top: 15px;
    left: 70px;
    z-index: 50;
}


@media (max-width: 1399.98px) {
    .utility-heading-container {
        flex-wrap: wrap;
    }
    .utility-heading-container p {
        padding-bottom: 20px;
    }
    .utility-text{
        max-width: 900px;
  	    font-size: 20px;
	} 
}

@media (max-width: 625px) {
	h2 {
		font-size: 26px;
		margin-bottom: 50px;
	}
	.utility-text{
		margin: 20px;
  	font-size: 16px;
	}  
}

</style>