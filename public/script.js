// Variables de estado
let playerA = {
  name: "Jugador A",
  standing: "0/0/0",
  wins: 0,
  prizesLeft: 6,
  supporterUsed: false,
  stadiumUsed: false,
  energyUsed: false,
  retreatUsed: false,
  turnCount: 0
};

let playerB = {
  name: "Jugador B",
  standing: "0/0/0",
  wins: 0,
  prizesLeft: 6,
  supporterUsed: false,
  stadiumUsed: false,
  energyUsed: false,
  retreatUsed: false,
  turnCount: 0
};

let currentPlayer = "A"; // 'A' o 'B'
let matchTurnCount = 0;
let finalTurn = false; // false o número del turno final
let matchActive = false;

let matchTime = 50 * 60; // 50 minutos en segundos
let timer = null;
let timerRunning = false;

// ======== Funciones Temporizador ========

function updateTimerDisplay() {
  const minutes = Math.floor(matchTime / 60);
  const seconds = matchTime % 60;
  document.getElementById('timer').textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (matchTime > 0) {
      matchTime--;
      updateTimerDisplay();
    } else if (finalTurn === false) {
      finalTurn = 0;
      document.getElementById('finalTurnDisplay').textContent = finalTurn;
      alert("¡Tiempo terminado! Comienza el turno final.");
    }
  }, 1000);
  timerRunning = true;
  document.getElementById('startPauseBtn').textContent = "⏸️";
}

function pauseTimer() {
  clearInterval(timer);
  timerRunning = false;
  document.getElementById('startPauseBtn').textContent = "▶️";
}

function toggleTimer() {
  if (timerRunning) pauseTimer();
  else startTimer();
}

function resetTimer() {
  pauseTimer();
  matchTime = 50 * 60;
  updateTimerDisplay();
  document.getElementById('startPauseBtn').textContent = "▶️";
  finalTurn = false;
  document.getElementById('finalTurnDisplay').textContent = "FALSO";
}

// Añadir o quitar tiempo (segundos)
function addTime(seconds) {
  matchTime = Math.max(0, matchTime + seconds);
  updateTimerDisplay();
}

// ======== Funciones UI ========

function renderPrizes(playerId) {
  const container = document.getElementById(playerId === 'A' ? 'playerAPrizes' : 'playerBPrizes');
  container.innerHTML = "";
  // Premios como checkboxes en 3 columnas x 2 filas
  for (let i = 0; i < 6; i++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "prize-checkbox";
    checkbox.checked = (playerId === "A" ? playerA.prizesLeft : playerB.prizesLeft) <= (5 - i);
    checkbox.disabled = true; // solo visual
    container.appendChild(checkbox);
  }
}

function updateUI() {
  // Nombres
  document.getElementById('playerAName').value = playerA.name;
  document.getElementById('playerBName').value = playerB.name;

  // Standings
  document.getElementById('playerAStanding').value = playerA.standing;
  document.getElementById('playerBStanding').value = playerB.standing;

  // Wins
  document.getElementById('playerAWins').textContent = playerA.wins;
  document.getElementById('playerBWins').textContent = playerB.wins;

  // Recursos usados (checkboxes)
  document.getElementById('playerASupporter').checked = playerA.supporterUsed;
  document.getElementById('playerAStadium').checked = playerA.stadiumUsed;
  document.getElementById('playerAEnergy').checked = playerA.energyUsed;
  document.getElementById('playerARetreat').checked = playerA.retreatUsed;

  document.getElementById('playerBSupporter').checked = playerB.supporterUsed;
  document.getElementById('playerBStadium').checked = playerB.stadiumUsed;
  document.getElementById('playerBEnergy').checked = playerB.energyUsed;
  document.getElementById('playerBRetreat').checked = playerB.retreatUsed;

  // Match info
  document.getElementById('matchTurnCount').textContent = matchTurnCount;
  document.getElementById('playerATurnCount').textContent = playerA.turnCount;
  document.getElementById('playerBTurnCount').textContent = playerB.turnCount;

  // Final turn display
  document.getElementById('finalTurnDisplay').textContent = finalTurn === false ? "FALSO" : finalTurn;

  // Resaltar jugador con turno activo
  const playerADiv = document.getElementById('playerA');
  const playerBDiv = document.getElementById('playerB');
  if (currentPlayer === 'A') {
    playerADiv.classList.add('active-turn');
    playerBDiv.classList.remove('active-turn');
  } else {
    playerBDiv.classList.add('active-turn');
    playerADiv.classList.remove('active-turn');
  }

  // Texto y botón fin de turno
  document.getElementById('currentPlayerTurn').textContent = currentPlayer === 'A' ? "Jugador A" : "Jugador B";
  document.getElementById('endTurnBtn').textContent = `Fin de turno Jugador ${currentPlayer}`;

  // Premios
  renderPrizes('A');
  renderPrizes('B');
}

// ======== Manejo de eventos y lógica de juego ========

function startMatch() {
  if (matchActive) return alert("La partida ya está activa.");
  document.getElementById('startMatchBtn').disabled = true;
  document.getElementById('firstTurnSelector').style.display = "block";
}

function confirmFirstTurn() {
  const radios = document.getElementsByName('firstTurn');
  let selected = null;
  for (const r of radios) {
    if (r.checked) selected = r.value;
  }
  if (!selected) return alert("Selecciona quién empieza.");
  currentPlayer = selected;
  matchActive = true;
  document.getElementById('firstTurnSelector').style.display = "none";
  document.getElementById('endMatchBtn').disabled = false;
  updateUI();
  startTimer();
}

function endMatch() {
  pauseTimer();
  matchActive = false;
  document.getElementById('startMatchBtn').disabled = false;
  document.getElementById('endMatchBtn').disabled = true;
  document.getElementById('match-winner-section').style.display = "block";
}

function declareWinner(player) {
  if (player === 'A') playerA.wins++;
  else if (player === 'B') playerB.wins++;
  document.getElementById('match-winner-section').style.display = "none";
  resetMatch();
  updateUI();
}

function resetMatch() {
  playerA.prizesLeft = 6;
  playerB.prizesLeft = 6;
  playerA.supporterUsed = false;
  playerA.stadiumUsed = false;
  playerA.energyUsed = false;
  playerA.retreatUsed = false;
  playerB.supporterUsed = false;
  playerB.stadiumUsed = false;
  playerB.energyUsed = false;
  playerB.retreatUsed = false;
  playerA.turnCount = 0;
  playerB.turnCount = 0;
  matchTurnCount = 0;
  finalTurn = false;
  matchTime = 50 * 60;
  updateTimerDisplay();
  pauseTimer();
  document.getElementById('startPauseBtn').textContent = "▶️";
  document.getElementById('startMatchBtn').disabled = false;
  document.getElementById('endMatchBtn').disabled = true;
}

function endTurn() {
  if (!matchActive) return alert("La partida no está activa.");
  
  matchTurnCount++;

  if (currentPlayer === "A") {
    playerA.turnCount++;
    playerA.supporterUsed = false;
    playerA.stadiumUsed = false;
    playerA.energyUsed = false;
    playerA.retreatUsed = false;
    currentPlayer = "B";
  } else {
    playerB.turnCount++;
    playerB.supporterUsed = false;
    playerB.stadiumUsed = false;
    playerB.energyUsed = false;
    playerB.retreatUsed = false;
    currentPlayer = "A";
  }

  if (finalTurn !== false) {
    if (matchTurnCount >= finalTurn + 3) {
      alert("¡La partida ha terminado por límite de turno final!");
      endMatch();
      return;
    }
  }

  updateUI();
}

// Escuchar cambios de recursos usados para actualizar estado
document.getElementById('playerASupporter').addEventListener('change', e => {
  playerA.supporterUsed = e.target.checked;
});
document.getElementById('playerAStadium').addEventListener('change', e => {
  playerA.stadiumUsed = e.target.checked;
});
document.getElementById('playerAEnergy').addEventListener('change', e => {
  playerA.energyUsed = e.target.checked;
});
document.getElementById('playerARetreat').addEventListener('change', e => {
  playerA.retreatUsed = e.target.checked;
});

document.getElementById('playerBSupporter').addEventListener('change', e => {
  playerB.supporterUsed = e.target.checked;
});
document.getElementById('playerBStadium').addEventListener('change', e => {
  playerB.stadiumUsed = e.target.checked;
});
document.getElementById('playerBEnergy').addEventListener('change', e => {
  playerB.energyUsed = e.target.checked;
});
document.getElementById('playerBRetreat').addEventListener('change', e => {
  playerB.retreatUsed = e.target.checked;
});

// Actualizar nombres y standings cuando se modifican
document.getElementById('playerAName').addEventListener('input', e => {
  playerA.name = e.target.value;
});
document.getElementById('playerBName').addEventListener('input', e => {
  playerB.name = e.target.value;
});

document.getElementById('playerAStanding').addEventListener('input', e => {
  playerA.standing = e.target.value;
});
document.getElementById('playerBStanding').addEventListener('input', e => {
  playerB.standing = e.target.value;
});

// Inicializar UI y temporizador
updateTimerDisplay();
updateUI();
