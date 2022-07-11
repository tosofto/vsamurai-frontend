<template>
  <div class="timer-container">
    <div class="timer">
      <h1 class="title">Countdown <br />Timer</h1>
      <div class="blocks">
        <div class="block">
          <div class="count-timer" id="days"></div>
          <p>Days</p>
        </div>
        <div class="block">
          <div class="count-timer" id="hours"></div>
          <p>Hours</p>
        </div>
        <div class="block">
          <div class="count-timer" id="minutes"></div>
          <p>Minutes</p>
        </div>
        <div class="block">
          <div class="count-timer" id="seconds"></div>
          <p>Seconds</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";

export default {
  name: "Timer",
  data() {
    return {
      timerSeconds: 0,
    };
  },
  mounted() {
    let final = moment(1650668400000);
    let intervaltest = setInterval(() => {
      let today = new Date();
      let duration = moment.duration(final.diff(today));
      let hours = "0";
      let days = "0";
      let minutes = "0";
      let seconds = "0";
      $("#days").html(days);
      $("#hours").html(hours);
      $("#minutes").html(minutes);
      $("#seconds").html(seconds);
      this.timerSeconds = duration._milliseconds;
    }, 1000);
  },
};
</script>

<style scoped>
/* COUNT DOWN TIMER */
.timer-container {
  height: 500px;
  margin-top: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  font-family: "pixel-point";
  color: #ef0a0a;
  font-size: 42px;
  text-align: center;
  margin-top: -35px;
}
.timer {
  width: 1250px;
  height: 400px;
  background-image: url("../assets/img/vector-1.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.blocks {
  display: flex;
  margin-top: 40px;
  justify-content: center;
}
.block {
  margin: 50px 20px;
  width: 249px;
  height: 129px;
  background: #022741;
  box-shadow: 0px 7px 48px rgba(0, 0, 0, 0.48),
    inset 0px -5px 35px rgba(4, 138, 191, 0.36);
  border-radius: 15px;
}
.block div {
  font-family: "Raleway";
  font-size: 50px;
  color: #ef0a0a;
  text-align: center;
  margin-top: 5px;
}
.block p {
  font-family: "Raleway";
  font-size: 30px;
  text-align: center;
  color: #ffffff;
  opacity: 0.5;
  margin-top: -8px;
}

@media (max-width: 1399.98px) {
    .timer-container {
      height: 300px;
      margin-top: 200px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title {
      font-size: 30px;
      text-align: center;
      margin-top: -25px;
    }
    .timer {
      width: 800px;
      height: 400px;
      background-image: url("../assets/img/vector-1.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .blocks {
      display: flex;
      margin-top: 40px;
      justify-content: center;
    }
    .block {
      margin: 0px 10px;
      width: 160px;
      height: 100px;
      background: #022741;
      box-shadow: 0px 7px 48px rgba(0, 0, 0, 0.48),
        inset 0px -5px 35px rgba(4, 138, 191, 0.36);
      border-radius: 15px;
    }
    .block div {
      font-size: 40px;
      text-align: center;
      margin-top: 5px;
    }
    .block p {
      font-size: 20px;
      text-align: center;
      color: #ffffff;
      opacity: 0.5;
      margin-top: -5px;
    }
}

@media (max-width: 991.98px) {
  .timer-container {
    height: 200px;
    margin-top: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 20px;
    text-align: center;
    margin-top: -17px;
  }
  .timer {
    width: 600px;
    height: 200px;
    background-image: url("../assets/img/vector-1.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .blocks {
    display: flex;
    margin-top: 40px;
    justify-content: center;
  }
  .block {
    margin: 0px 10px;
    width: 120px;
    height: 80px;
    background: #022741;
    box-shadow: 0px 7px 48px rgba(0, 0, 0, 0.48),
      inset 0px -5px 35px rgba(4, 138, 191, 0.36);
    border-radius: 15px;
  }
  .block div {
    font-size: 30px;
    color: #ef0a0a;
    text-align: center;
    margin-top: 5px;
  }
  .block p {
    font-size: 15px;
    text-align: center;
    color: #ffffff;
    opacity: 0.5;
    margin-top: -5px;
  }
}

@media (max-width: 625px) {
  .title {
    font-size: 26px;
    text-align: center;
    margin-top: -40px;
  }
  .timer-container {
    height: 700px;
  }
  .timer {
    width: 376.51px;
    height: 629.14px;
    background-image: url("../assets/img/vector-3.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .blocks {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .block {
    margin: 15px;
    width: 176px;
    height: 96px;
  }
  .block div {
    margin-top: 12px;
  }
  .block p {
    margin-top: 1px;
}

}

</style>
