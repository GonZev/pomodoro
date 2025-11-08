const principalTime = document.getElementById("principal-time");
const secondaryTime = document.getElementById("secondary-time");
const taskContainer = document.getElementById("task-container")

const resetButton = document.getElementById("reset-button");
const playButton = document.getElementById("play-button");
const iconPlayButton = playButton.querySelector(".material-icons");

const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const timeForm = document.getElementById('time-form');
const closeModalButton = document.getElementById('close-modal-button');

const arrowTask = document.getElementById('arrow-task');
const addTaskButton = document.getElementById('add-task-button');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const closeTaskModalButton = document.getElementById('close-modal-task-button');

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


function switchSettings(display, modal) {
  if (modal == 'settings-modal') {
    settingsModal.style.display = display;
  }
  if (modal == 'task-modal') {
    taskModal.style.display = display;
  }
}

function getDataTime(event) {
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
  switchSettings('none', 'settings-modal');

}

function expandTask() {
  taskContainer.classList.toggle("expand");
  if (arrowTask.textContent == 'arrow_back_ios') {
    arrowTask.textContent = 'arrow_forward_ios';
  } else {
    arrowTask.textContent = 'arrow_back_ios';
  }

}

function getDataTask(event) {
  event.preventDefault();

  const data = new FormData(taskForm);
  const description = data.get('description');
  addTask(description);

  switchSettings('none', 'task-modal')
}

function addTask(textDescription) {
  let tableTask = document.getElementById('table-task-container')
  let item = document.createElement("div");
  item.classList.add('item-task');
  const id = `done-${Math.random().toString(36).substring(2, 9)}`;
  // 2. Crear el input (radio button)
  const inputRadio = document.createElement('input');
  inputRadio.type = 'radio';
  inputRadio.id = id;
  inputRadio.name = 'check'; // Usa el mismo nombre para agrupar los radios
  inputRadio.value = 'done';

  // 3. Crear el label
  const label = document.createElement('label');
  label.htmlFor = id; // Asocia el label con el ID único del input
  label.textContent = `${textDescription}`;

  const button = document.createElement('button');
  button.classList.add('delete-button');
  button.textContent = 'X';
  button.addEventListener('click', () => { deleteTask(button) });

  // 4. Montar la estructura: Añadir input y label al divTask
  item.appendChild(inputRadio);
  item.appendChild(label);
  item.appendChild(button)

  // 5. Añadir el divTask completo al contenedor padre
  tableTask.appendChild(item);
}

function deleteTask(button) {
  const elementChildToDelete = button.parentElement;
  const parentOfChild = elementChildToDelete.parentElement;
  parentOfChild.removeChild(elementChildToDelete);
}

principalTime.textContent = formatHour(secondsRemaining);
secondaryTime.textContent = formatHour(secondsRemainingBreak);

timeForm.addEventListener('submit', getDataTime);
settingsButton.addEventListener('click', () => { switchSettings('block', 'settings-modal') });
closeModalButton.addEventListener('click', () => { switchSettings('none', 'settings-modal') });
resetButton.addEventListener('click', resetTime);
playButton.addEventListener('click', startCountdown);
arrowTask.addEventListener('click', expandTask);
addTaskButton.addEventListener('click', () => { switchSettings('block', 'task-modal') });
closeTaskModalButton.addEventListener('click', () => { switchSettings('none', 'task-modal') });
taskForm.addEventListener('submit', getDataTask);
// startCountdown();
