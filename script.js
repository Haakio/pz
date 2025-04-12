'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const lines = [
    "Initialisation du protocole DeadHope v2.7...",
    "Connexion aux bases de données sécurisées...",
    "Chargement de la carte tactique de Knox County...",
    "Établissement des liaisons radio d'urgence...",
    "Analyse des zones de danger en temps réel...",
    "Estimation des mouvements de zombies...",
    "Authentification requise pour accéder au terminal."
  ];

  let currentLine = 0;
  function typeNextLine() {
    if (currentLine >= lines.length) {
      document.getElementById("input-zone").style.display = "block";
      return;
    }

    const terminal = document.getElementById("terminal-lines");
    const newLine = document.createElement("div");
    terminal.appendChild(newLine);

    let i = 0;
    const text = lines[currentLine];
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        newLine.textContent += text[i++];
      } else {
        clearInterval(typeInterval);
        currentLine++;
        setTimeout(typeNextLine, 500);
      }
    }, 30);
  }

  function updateTimestamp() {
    const now = new Date();
    const formatted = now.toLocaleString("fr-FR");
    document.getElementById("last-updated").textContent = formatted;
  }

  function filterTable(inputId, tableBodyId) {
    const input = document.getElementById(inputId).value.toLowerCase();
    const rows = document.getElementById(tableBodyId).querySelectorAll("tr");
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(input) ? "" : "none";
    });
  }

  function resetSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const firstItem = el.children[0];
    el.innerHTML = '';
    if (!firstItem) return;

    const clone = firstItem.cloneNode(true);
    clone.querySelectorAll('input, textarea').forEach(el => el.value = '');
    clone.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
    el.appendChild(clone);
  }

  function ajouterFichePerso() {
    const list = document.getElementById("character-list");
    const clone = list.children[0].cloneNode(true);
    clone.querySelectorAll("input, textarea").forEach(el => el.value = "");
    list.appendChild(clone);
  }

  function ajouterJournal() {
    const tbody = document.getElementById("journal-body");
    const clone = tbody.rows[0].cloneNode(true);
    clone.querySelectorAll("input").forEach(el => el.value = "");
    tbody.appendChild(clone);
  }

  function ajouterMission() {
    const tbody = document.getElementById("mission-body");
    const clone = tbody.rows[0].cloneNode(true);
    clone.querySelectorAll("input").forEach(el => el.value = "");
    clone.querySelector("select").selectedIndex = 0;
    tbody.appendChild(clone);
  }

  function ajouterLogistique() {
    const tbody = document.getElementById("logistique-body");
    const clone = tbody.rows[0].cloneNode(true);
    clone.querySelectorAll("input, select").forEach(el => {
      el.value = "";
      el.selectedIndex = 0;
    });
    clone.style.backgroundColor = "transparent";
    tbody.appendChild(clone);
  }

  function ajouterZoneDangereuse() {
    const container = document.getElementById("danger-zone-container");
    const clone = container.firstElementChild.cloneNode(true);
    clone.querySelectorAll("input").forEach(input => input.value = "");
    clone.style.borderLeftColor = "#333";
    container.appendChild(clone);
  }

  function toggleChat() {
    const box = document.getElementById("radio-chat");
    box.style.display = box.style.display === "none" ? "block" : "none";
    if (box.style.display === "block") {
      const notif = document.querySelector(".msg-notification");
      if (notif) notif.style.display = "none";
    }
  }

  function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    const chatLog = document.getElementById("chat-log");
    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });

    const msg = document.createElement("div");
    msg.className = "chat-message";
    msg.innerHTML = `<strong style="color:#5af">${window.pseudo}</strong> <span style="color:#888">[${time}]</span>: ${text}`;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;

    input.value = "";
    document.getElementById("radio-bip").play().catch(() => {});
  }

  function startDashboard() {
    const input = document.getElementById("input-pseudo");
    const pseudo = input.value.trim();
    if (!pseudo) {
      input.style.border = "1px solid #e74c3c";
      input.placeholder = "⚠️ PSEUDO REQUIS!";
      return;
    }

    input.disabled = true;
    window.pseudo = pseudo;

    document.getElementById("confirm-sound").play().catch(() => {});
    document.getElementById("terminal-lines").innerHTML += `\nBienvenue, OPÉRATEUR: <span style="color: #8b0000; font-weight: bold">${pseudo.toUpperCase()}</span>\nInitialisation du terminal tactique...`;

    setTimeout(() => {
      document.getElementById("welcome-screen").style.display = "none";
      document.getElementById("dashboard-content").style.display = "block";
      document.getElementById("background-sound").play().catch(() => {});
      updateTimestamp();
    }, 2000);
  }

  function simulateWeather() {
    const types = ['rain', 'fog', 'clear'];
    const type = types[Math.floor(Math.random() * types.length)];
    const temp = Math.floor(Math.random() * 30 - 5);
    const el = document.getElementById("weather-info");
    el.textContent = `${type === 'rain' ? '🌧️' : type === 'fog' ? '🌫️' : '☀️'} ${temp}°C`;
  }

  // Time
  let gameMinutes = 480;
  let countdownMinutes = 47 * 60 + 23 * 60 + 12;

  function updateGameClock() {
    const h = Math.floor(gameMinutes / 60) % 24;
    const m = gameMinutes % 60;
    document.getElementById("game-clock").textContent = `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`;
    gameMinutes += 2;
    updateCountdown();
  }

  function updateCountdown() {
    if (countdownMinutes <= 0) countdownMinutes = Math.floor(Math.random() * 24 * 60 * 60);
    const h = Math.floor(countdownMinutes / 3600);
    const m = Math.floor((countdownMinutes % 3600) / 60);
    const s = countdownMinutes % 60;
    document.getElementById("next-event-countdown").textContent =
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    countdownMinutes--;
  }

  // Start up
  document.getElementById("boot-sound").play().catch(() => {});
  typeNextLine();
  simulateWeather();

  setInterval(updateGameClock, 60000 / 2);
  setInterval(updateCountdown, 1000);

  // Bindings
  document.getElementById("input-pseudo").addEventListener("keypress", e => {
    if (e.key === "Enter") startDashboard();
  });

  document.getElementById("chat-input").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  document.getElementById("start-button").addEventListener("click", startDashboard);
  document.getElementById("chat-toggle").addEventListener("click", toggleChat);

  // Utility bindings (you may want to add more)
  document.getElementById("filter-missions").addEventListener("input", () => filterTable("filter-missions", "mission-body"));
  document.getElementById("filter-journal").addEventListener("input", () => filterTable("filter-journal", "journal-body"));
  document.getElementById("filter-logistique").addEventListener("input", () => filterTable("filter-logistique", "logistique-body"));
});
