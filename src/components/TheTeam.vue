<template>
  <h2>THE TEAM</h2>
  <div class="team-container row">
    <div class="team-block col-3" v-for="(user, index) in allTeam" :key="index">
      <img :src="user.image" alt="" />
      <div class="team-item">
        <h3>{{ user.name }}</h3>
      </div>
      <h4>{{ user.role }}</h4>
        <h5 class="founder-about">{{ user.about }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheTeam",
  data() {
    return {
      allTeam: [
        {
          name: "Jason BTO",
          role: "FOUNDER",
          about: "GOD, Family, Friend. I love being a Dad, Crypto Expert, Influencer, Coach 2-Blessed-2-B-Stressed",
          image: require("../assets/img/json.jpeg"),
        },
        {
          name: "Trent Silver",
          role: "CO-FOUNDER",
          about: "Media Mogul & Viral Marketing Specialist as seen on Tony Robbins Stages for News Jacking",
          image: require("../assets/img/trent.jpeg"),
        },
        {
          name: "Samuel Mayers",
          role: "CO-FOUNDER",
          about: "Influencer, World Traveler, Vibe Manager in charge of keeping the energy high and the stress low in all the things we do",
          image: require("../assets/img/samuel.jpeg"),
        },
      ],
    };
  },
};
</script>

<style scoped>
/* THE TEAM */
.team-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-icon {
  color: #fff;
  font-size: 20px;
  margin-left: 10px;
}

.team-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-bottom: 100px;
}
.team-block {
  margin: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 300px;
}

img {
  width: 200px;
  margin: 10px auto;
  border-radius: 50%;
}

h2 {
  font-family: "pixel-point";
  color: #ef0a0a;
  font-size: 42px;
  text-align: center;
}
h3 {
  font-family: "Raleway";
  font-size: 28px;
  color: #ffffff;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 2px;
}
h4 {
  font-family: "pixel-point";
  font-size: 18px;
  color: #04d9c4;
  text-align: center;
}

@media (max-width: 991.98px) {
  h3 {
    font-family: "Raleway";
    font-weight: bold;
    font-size: 22px;
    color: #ffffff;
    text-align: center;
    margin-top: 10px;
  }
  h4 {
    font-family: "pixel-point";
    font-size: 18px;
    color: #04d9c4;
    text-align: center;
  }
  img {
    width: 200px;
  }
}

@media (max-width: 625px) {
  h2 {
    font-size: 26px;
  }
}
</style>
