import { taskModel } from "./taskModel.js";

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
let addTaskItem = false;

const focusAudio = document.getElementById('focus-audio');
const breakAudio = document.getElementById('break-audio');

// tasks
let arrayTask = []

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
  playSound('break-audio');
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
  playSound('focus-audio');
  iconPlayButton.textContent = ""
  iconPlayButton.textContent = "pause"
  intervalBreakID = setInterval(
    () => {
      console.log(secondsRemainingBreak)
      if (secondsRemainingBreak <= 0) {
        clearInterval(intervalBreakID);
        secondaryTime.textContent = "00:00";
        startCountdown();
        return;
      }
      console.log(formatHour(secondsRemainingBreak))
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
  let secondsOfminutes = seconds % 60;

  // si son mas de 60 minutos
  if (minutesRemaining >= 60) {
    hours = Math.floor(minutesRemaining / 60);
    minutesRemaining = minutesRemaining % 60;
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

// NOTE:TASK

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
  // TODO: save tasks in array and create from this.
  const identifierTask = crypto.randomUUID();
  addTask(description, identifierTask);
  arrayTask.push(new taskModel(identifierTask, description))
  addTaskItem = true;
  switchSettings('none', 'task-modal')
}

function addTask(textDescription, identifierTask, check = false) {
  let tableTask = document.getElementById('table-task-container')
  let item = document.createElement("div");
  item.classList.add('item-task');
  item.id = identifierTask;
  const id = `done-${Math.random().toString(36).substring(2, 9)}`;
  // 2. Crear el input (checkbox button)
  const inputCheckbox = document.createElement('input');
  inputCheckbox.type = 'checkbox';
  inputCheckbox.id = id;
  inputCheckbox.name = 'check'; // Usa el mismo nombre para agrupar los radios
  inputCheckbox.value = 'done';
  inputCheckbox.checked = check;
  inputCheckbox.addEventListener('change', () => { checkTask(inputCheckbox) })

  // 3. Crear el label
  const label = document.createElement('label');
  label.htmlFor = id; // Asocia el label con el ID único del input
  label.textContent = `${textDescription}`;

  const button = document.createElement('button');
  button.classList.add('delete-button');
  button.textContent = 'X';
  button.addEventListener('click', () => { deleteTask(button) });

  // 4. Montar la estructura: Añadir input y label al divTask
  item.appendChild(inputCheckbox);
  item.appendChild(label);
  item.appendChild(button)

  // 5. Añadir el divTask completo al contenedor padre
  tableTask.appendChild(item);
}

function deleteTask(button) {
  const elementChildToDelete = button.parentElement;
  const parentOfChild = elementChildToDelete.parentElement;
  arrayTask = arrayTask.filter((item) =>
    item.id != elementChildToDelete.id
  )
  parentOfChild.removeChild(elementChildToDelete);
  addTaskItem = true;
}

function checkTask(button) {
  const task = button.parentElement;
  arrayTask.forEach((item) => {
    if (task.id == item.id) {
      item.check = !item.check;
    }
  })
  addTaskItem = true;
}

// NOTE:GENERALS FUNCTION

function switchSettings(display, modal) {
  if (modal == 'settings-modal') {
    settingsModal.style.display = display;
  }
  if (modal == 'task-modal') {
    taskModal.style.display = display;
  }
}

function saveData() {
  const dataSerialized = JSON.stringify(arrayTask);
  localStorage.removeItem('tasks');
  localStorage.setItem('tasks', dataSerialized);
}

function loadData() {
  const saveData = localStorage.getItem('tasks');
  arrayTask = JSON.parse(saveData);
  arrayTask.forEach(element => {
    addTask(element.description, element.id, element.check)
  });
}

function saveDataCloseWindows() {
  if (addTaskItem) {
    saveData()
  }
}

function playSound(time) {
  let audio;
  if (time == 'break-audio') {
    audio = breakAudio;
    breakAudio.play()
  } else {
    audio = focusAudio;
    focusAudio.play()
  }
  setTimeout(() => {
    audio.pause();
  }, 3500)
}


// ---------------------------- // 

window.addEventListener('beforeunload', saveDataCloseWindows);

loadData();

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
