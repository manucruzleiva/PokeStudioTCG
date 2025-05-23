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

let currentPlayer = "A";
let matchTurnCount = 0;
let finalTurn = false;
let matchActive = false;

let matchTime = 50 * 60;
let timer = null;
let timerRunning = false;

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

function addTime(seconds) {
  matchTime = Math.max(0, matchTime + seconds);
  updateTimerDisplay();
}

function renderPrizes(playerId) {
  const container = document.getElementById(playerId === 'A' ? 'playerAPrizes' : 'playerBPrizes');
  container.innerHTML = "";
  const player = playerId === "A" ? playerA : playerB;
  for (let i = 0; i < 6; i++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "prize-checkbox";
    // Checked si el premio YA fue tomado (es decir, los 6 - prizesLeft primeros)
    checkbox.checked = i >= (6 - player.prizesLeft) ? false : true;
    checkbox.dataset.index = i;
    checkbox.addEventListener("change", function () {
      // El usuario marca como tomados de izquierda a derecha los premios
      // prizesLeft = 6 - la cantidad de checkboxes marcados como tomados
      const allChecks = container.querySelectorAll("input[type=checkbox]");
      let prizesTaken = 0;
      allChecks.forEach((chk, idx) => {
        if (chk.checked) prizesTaken++;
      });
      player.prizesLeft = 6 - prizesTaken;
      updateUI();
    });
    container.appendChild(checkbox);
  }
}

function updateUI() {
  document.getElementById('playerAName').value = playerA.name;
  document.getElementById('playerBName').value = playerB.name;
  document.getElementById('playerAStanding').value = playerA.standing;
  document.getElementById('playerBStanding').value = playerB.standing;
  document.getElementById('playerAWins').textContent = playerA.wins;
  document.getElementById('playerBWins').textContent = playerB.wins;

  document.getElementById('playerASupporter').checked = playerA.supporterUsed;
  document.getElementById('playerAStadium').checked = playerA.stadiumUsed;
  document.getElementById('playerAEnergy').checked = playerA.energyUsed;
  document.getElementById('playerARetreat').checked = playerA.retreatUsed;

  document.getElementById('playerBSupporter').checked = playerB.supporterUsed;
  document.getElementById('playerBStadium').checked = playerB.stadiumUsed;
  document.getElementById('playerBEnergy').checked = playerB.energyUsed;
  document.getElementById('playerBRetreat').checked = playerB.retreatUsed;

  document.getElementById('matchTurnCount').textContent = matchTurnCount;
  document.getElementById('playerATurnCount').textContent = playerA.turnCount;
  document.getElementById('playerBTurnCount').textContent = playerB.turnCount;

  document.getElementById('finalTurnDisplay').textContent = finalTurn === false ? "FALSO" : finalTurn;

  const playerADiv = document.getElementById('playerA');
  const playerBDiv = document.getElementById('playerB');
  if (currentPlayer === 'A') {
    playerADiv.classList.add('active-turn');
    playerBDiv.classList.remove('active-turn');
  } else {
    playerBDiv.classList.add('active-turn');
    playerADiv.classList.remove('active-turn');
  }

  document.getElementById('currentPlayerTurn').textContent = currentPlayer === 'A' ? "Jugador A" : "Jugador B";
  document.getElementById('endTurnBtn').textContent = `Fin de turno Jugador ${currentPlayer}`;
  renderPrizes('A');
  renderPrizes('B');
}

function updateMatchControlsUI() {
  const radios = document.getElementsByName('firstTurn');
  const confirmBtn = document.getElementById('confirmFirstTurnBtn');
  const endTurnBtn = document.getElementById('endTurnBtn');
  const endMatchBtn = document.getElementById('endMatchBtn');
  const winnerOptions = document.getElementById('winnerOptions');
  const firstTurnBlock = document.getElementById('mc-firstturn');
  const turnLoopBlock = document.getElementById('mc-turnloop');
  const endMatchBlock = document.getElementById('mc-endmatch');
  const winnerVisible = winnerOptions.style.display === "block";

  if (!matchActive && !winnerVisible) {
    radios.forEach(r => r.disabled = false);
    confirmBtn.disabled = false;
    firstTurnBlock.style.opacity = '1';
    firstTurnBlock.style.pointerEvents = '';
    endTurnBtn.disabled = true;
    endMatchBtn.disabled = true;
    turnLoopBlock.style.opacity = '0.6';
    turnLoopBlock.style.pointerEvents = 'none';
    endMatchBlock.style.opacity = '0.6';
    endMatchBlock.style.pointerEvents = 'none';
  } else if (winnerVisible) {
    radios.forEach(r => r.disabled = true);
    confirmBtn.disabled = true;
    firstTurnBlock.style.opacity = '0.6';
    firstTurnBlock.style.pointerEvents = 'none';
    endTurnBtn.disabled = true;
    endMatchBtn.disabled = false;
    turnLoopBlock.style.opacity = '0.6';
    turnLoopBlock.style.pointerEvents = 'none';
    endMatchBlock.style.opacity = '1';
    endMatchBlock.style.pointerEvents = '';
  } else {
    radios.forEach(r => r.disabled = true);
    confirmBtn.disabled = true;
    firstTurnBlock.style.opacity = '0.6';
    firstTurnBlock.style.pointerEvents = 'none';
    endTurnBtn.disabled = false;
    endMatchBtn.disabled = false;
    turnLoopBlock.style.opacity = '1';
    turnLoopBlock.style.pointerEvents = '';
    endMatchBlock.style.opacity = '1';
    endMatchBlock.style.pointerEvents = '';
  }
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
  updateUI();
  updateMatchControlsUI();
  startTimer();
}

function endMatch() {
  document.getElementById('winnerOptions').style.display = "block";
  updateMatchControlsUI();
}

function confirmMatchWinner() {
  const radios = document.getElementsByName('matchWinner');
  let selected = null;
  for (const r of radios) {
    if (r.checked) selected = r.value;
  }
  if (!selected) return alert("Selecciona el jugador ganador.");
  declareWinner(selected);
}

function declareWinner(player) {
  if (player === 'A') playerA.wins++;
  else if (player === 'B') playerB.wins++;
  document.getElementById('winnerOptions').style.display = "none";
  resetMatch();
  updateUI();
  updateMatchControlsUI();
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
  matchActive = false;
  matchTime = 50 * 60;
  updateTimerDisplay();
  pauseTimer();
  const radios = document.getElementsByName('firstTurn');
  radios.forEach(r => r.checked = false);
  const winnerRadios = document.getElementsByName('matchWinner');
  winnerRadios.forEach(r => r.checked = false);
  document.getElementById('startPauseBtn').textContent = "▶️";
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

updateTimerDisplay();
updateUI();
updateMatchControlsUI();

// --- BUSCADOR DE CARTAS SIN BACKEND ---
async function searchCard(e) {
  e.preventDefault();
  const query = document.getElementById('cardSearchInput').value.trim();
  if (!query) return;

  const $results = document.getElementById('cardSearchResults');
  const $selected = document.getElementById('selectedCardImage');
  $results.innerHTML = "Buscando...";
  $selected.innerHTML = "";

  try {
    // Usar la API pública de pokemontcg.io
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)} OR text:${encodeURIComponent(query)}`);
    if (!res.ok) {
      $results.innerHTML = "Error al buscar cartas en la API pública.";
      return;
    }
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      $results.innerHTML = "<em>No se encontraron cartas que coincidan con la búsqueda.</em>";
      return;
    }

    $results.innerHTML = "";
    data.data.slice(0, 12).forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = "card-result";
      cardDiv.innerHTML = `
        <img src="${card.images.small}" alt="${card.name}">
        <div>${card.name}</div>
        <div style="font-size:0.9em;color:#888;">${card.set && card.set.name ? card.set.name : ""}</div>
      `;
      cardDiv.onclick = () => selectCard(card, cardDiv);
      $results.appendChild(cardDiv);
    });
  } catch (err) {
    $results.innerHTML = "Error de red al buscar cartas. Intenta de nuevo o revisa tu conexión.";
  }
}

function selectCard(card, cardDiv) {
  document.querySelectorAll('.card-result.selected').forEach(el => el.classList.remove('selected'));
  cardDiv.classList.add('selected');
  const $selected = document.getElementById('selectedCardImage');
  $selected.innerHTML = `
    <h3>${card.name}</h3>
    <img src="${card.images.large}" alt="${card.name}">
    <div style="margin-top:8px;font-size:1.02em;">${card.set && card.set.name ? card.set.name : ""}</div>
  `;
}

// Event listeners de botones importantes
document.getElementById('startPauseBtn').addEventListener('click', toggleTimer);
document.getElementById('resetTimerBtn').addEventListener('click', resetTimer);
document.getElementById('addTimeBtn').addEventListener('click', () => addTime(60)); // 1 minuto extra

document.getElementById('confirmFirstTurnBtn').addEventListener('click', confirmFirstTurn);
document.getElementById('endTurnBtn').addEventListener('click', endTurn);
document.getElementById('endMatchBtn').addEventListener('click', endMatch);
document.getElementById('confirmWinnerBtn').addEventListener('click', confirmMatchWinner);

// Card search form
document.getElementById('cardSearchForm').addEventListener('submit', searchCard);
// 
document.getElementById('confirmFirstTurnBtn').onclick = function() {
  document.getElementById('mc-firstturn').style.display = 'none';
  document.getElementById('changeFirstTurnBtn').style.display = 'block';
};
document.getElementById('changeFirstTurnBtn').onclick = function() {
  document.getElementById('mc-firstturn').style.display = 'flex';
  document.getElementById('changeFirstTurnBtn').style.display = 'none';
};