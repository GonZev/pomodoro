const principalTime = document.getElementById("principal-time");
const secondaryTime = document.getElementById("secondary-time");

const resetButton = document.getElementById("reset-button");
const playButton = document.getElementById("play-button");
const iconPlayButton = playButton.querySelector(".material-icons");

const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const timeForm = document.getElementById('time-form');
const closeModalButton = document.getElementById('close-modal-button');

// minutes default
let minutesFocus = 45;
let minutesBreak = 5;

let secondsRemaining = 60 * minutesFocus; //segundos restantes
let secondsRemainingBreak = 60 * minutesBreak;

let intervalFocusID;
let intervalBreakID;

function startCountdown() {
  // Solo inicia si no hay un intervalo ya corriendo
  if (intervalFocusID) {
    iconPlayButton.textContent = ""
    iconPlayButton.textContent = "play_arrow"

    clearInterval(intervalFocusID);
    intervalFocusID = null;
    return
  };
  iconPlayButton.textContent = ""
  iconPlayButton.textContent = "pause"
  intervalFocusID = setInterval(
    () => {
      if (secondsRemaining <= 0) {
        clearInterval(intervalFocusID);
        principalTime.textContent = "00:00";
        startCountdownBreak();
        return;
      }
      principalTime.textContent = formatHour(secondsRemaining);
      secondsRemaining--;
    }
    , 1000);
}

function startCountdownBreak() {
  // Solo inicia si no hay un intervalo ya corriendo
  if (intervalBreakID) {
    iconPlayButton.textContent = ""
    iconPlayButton.textContent = "play_arrow"

    clearInterval(intervalBreakID);
    intervalBreakID = null;
    return
  };
  iconPlayButton.textContent = ""
  iconPlayButton.textContent = "pause"
  intervalBreakID = setInterval(
    () => {
      if (secondsRemainingBreak <= 0) {
        clearInterval(intervalBreakID);
        secondaryTime.textContent = "00:00";

        return;
      }
      secondaryTime.textContent = formatHour(secondsRemainingBreak);
      secondsRemainingBreak--;
    }
    , 1000);
}

function formatHour(seconds) {
  let hours;
  let hoursFormat;
  let minutesFormat
  let secondsFormat
  let minutesRemaining = Math.floor(seconds / 60);
  let secondsOfminutes = secondsRemaining % 60;

  // si son mas de 60 minutos
  if (minutesRemaining >= 60) {
    hours = Math.floor(minutesRemaining / 60);
    minutesRemaining = minutesRemaining % 60;
    console.log(minutesRemaining)
    hoursFormat = String(hours).padStart(2, '0');
    minutesFormat = String(minutesRemaining).padStart(2, '0');
    secondsFormat = String(secondsOfminutes).padStart(2, '0');


    return `${hoursFormat}:${minutesFormat}:${secondsFormat}`
  }

  minutesFormat = String(minutesRemaining).padStart(2, '0');
  secondsFormat = String(secondsOfminutes).padStart(2, '0');

  return `${minutesFormat}:${secondsFormat}`
}

function toMinutes(seconds) {
  const timeSplit = seconds.split(':');
  let totalHours = parseInt(timeSplit[0]) * 60;
  let totalMinutes = parseInt(timeSplit[1]) + totalHours;
  return totalMinutes;
}

function toSeconds(seconds) {
  let totalMinutes = toMinutes(seconds);
  let totalSeconds = totalMinutes * 60;
  return totalSeconds;
}

function resetTime() {
  if (intervalBreakID) {
    secondsRemainingBreak = 60 * minutesBreak;
    secondaryTime.textContent = formatHour(secondsRemainingBreak);
    startCountdown();
  }
  if (intervalFocusID) {
    secondsRemaining = 60 * minutesFocus;
    principalTime.textContent = formatHour(secondsRemaining);
    startCountdown();
  }
}


function switchSettings(display) {
  settingsModal.style.display = display;
}

function getData(event) {
  event.preventDefault();

  const data = new FormData(timeForm);
  const focusTime = data.get('focus-time');
  const breakTime = data.get('break-time');

  minutesFocus = toMinutes(focusTime);
  minutesBreak = toMinutes(breakTime);
  secondsRemaining = toSeconds(focusTime);
  secondsRemainingBreak = toSeconds(breakTime);
  principalTime.textContent = formatHour(secondsRemaining);
  secondaryTime.textContent = formatHour(secondsRemainingBreak);
  switchSettings('none');

}


principalTime.textContent = formatHour(secondsRemaining);
secondaryTime.textContent = formatHour(secondsRemainingBreak);

timeForm.addEventListener('submit', getData);
settingsButton.addEventListener('click', () => { switchSettings('block') });
closeModalButton.addEventListener('click', () => { switchSettings('none') });
resetButton.addEventListener('click', resetTime);
playButton.addEventListener('click', startCountdown);
// startCountdown();
