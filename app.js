const principalTime = document.getElementById("principal-time");
const secondaryTime = document.getElementById("secondary-time");

const playButton = document.getElementById("play-button");
const iconPlayButton = playButton.querySelector(".material-icons")

// como pasar de segundos a minutos logica

let minutesFocus = 5;
let minutesBreak = 5;
let secondsRemaining = 60 * minutesFocus; //segundos restantes
let intervalID;

function startCountdown() {
  // Solo inicia si no hay un intervalo ya corriendo
  if (intervalID) {
    iconPlayButton.textContent = ""
    iconPlayButton.textContent = "play_arrow"

    clearInterval(intervalID);
    intervalID = null;
    return
  };
  iconPlayButton.textContent = ""
  iconPlayButton.textContent = "pause"
  intervalID = setInterval(
    () => {
      if (secondsRemaining <= 0) {
        clearInterval(intervalID);
        principalTime.textContent = "00:00";

        return;
      }
      let minutesRemaining = Math.floor(secondsRemaining / 60);
      let secondsOfminutes = secondsRemaining % 60;

      let minutesFormat = String(minutesRemaining).padStart(2, '0');
      let secondsFormat = String(secondsOfminutes).padStart(2, '0');
      principalTime.textContent = `${minutesFormat}:${secondsFormat}`;
      secondsRemaining--;
    }
    , 1000);
}

playButton.addEventListener('click', startCountdown);
// startCountdown();
