import { updateEnergyDisplay, updateLevelDisplay, saveGame, loadGame, startAutoProduction, gainXP, levelUp, lootArtifact, displayArtifacts, startEventInterval, assignQuest, displayQuest, completeQuest, playSound, changeDimension, fuseArtifacts, calculatePrestigeBonus, getPrestigeReward, getAchievementReward, getDailyReward, updateLeaderboard, addFriend, showNotification, updateStats, updateGemDisplay, earnGems, startMemoryGame, startPrecisionGame } from './gameLogic.js';

document.addEventListener('DOMContentLoaded', () => {
    const energyDisplay = document.getElementById('energy');
    const levelDisplay = document.getElementById('level');
    const progressBar = document.getElementById('progress');
    const clickButton = document.getElementById('clickButton');
    const upgradesContainer = document.getElementById('upgrades');
    const passiveUpgradesContainer = document.getElementById('passiveUpgrades');
    const dimensionUpgradesContainer = document.getElementById('dimensionUpgrades');
    const dimensionsContainer = document.getElementById('dimensions');
    const prestigeButton = document.getElementById('prestigeButton');
    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');
    const artifactsContainer = document.getElementById('artifacts');
    const questsContainer = document.getElementById('quests');
    const totalEnergyDisplay = document.getElementById('totalEnergy');
    const totalClicksDisplay = document.getElementById('totalClicks');
    const themeSelector = document.getElementById('themeSelector');
    const friendsList = document.getElementById('friends');
    const tradeButton = document.getElementById('tradeButton');
    const shopContainer = document.getElementById('shop');
    const avatarSelector = document.getElementById('avatarSelector');
    const accessorySelector = document.getElementById('accessorySelector');
    const gemCountDisplay = document.getElementById('gemCount');

    let energy = 0;
    let clickMultiplier = 1;
    let autoProduction = 0;
    let autoInterval = null;
    let prestigeMultiplier = 1;
    let xp = 0;
    let level = 1;
    let xpToNextLevel = 100;
    let artifacts = [];
    let currentQuest = null;
    let eventInterval = null;
    let currentDimension = null;
    let totalEnergy = 0;
    let totalClicks = 0;
    let gems = 0;

    const dimensions = {
        "Cybermonde": { background: "linear-gradient(135deg, #1abc9c, #16a085)", color: "#ecf0f1", boost: 1.5 },
        "Terre Organique": { background: "linear-gradient(135deg, #2ecc71, #27ae60)", color: "#ecf0f1", boost: 2 },
        "Vide Lumineux": { background: "linear-gradient(135deg, #e67e22, #d35400)", color: "#ecf0f1", boost: 2.5 },
        "Dimension Quantique": { background: "linear-gradient(135deg, #6a11cb, #2575fc)", color: "#ecf0f1", boost: 1.8 }
    };

    const events = [
        { name: "Faille instable", effect: () => { clickMultiplier *= 1.5; }, duration: 30000 },
        { name: "Pluie de quanta", effect: () => { autoProduction *= 2; }, duration: 60000 },
        { name: "Perturbation énergétique", effect: () => { clickMultiplier *= 0.5; }, duration: 45000 }
    ];

    const quests = [
        { description: "Cliquez 100 fois", goal: 100, type: 'click', reward: { energy: 500 } },
        { description: "Atteignez 1000 énergie", goal: 1000, type: 'energy', reward: { xp: 200 } }
    ];

    const passiveUpgrades = [
        { name: "Générateur d'Énergie", cost: 500, effect: () => { energyProduction *= 1.05; } }
    ];

    const dimensionUpgrades = {
        "Cybermonde": { name: "Boost de Cybermonde", cost: 300, effect: () => { energyProduction *= 1.1; } }
    };

    const achievements = [
        { name: "Cliqueur Ultime", goal: 1000000, type: 'click', reward: { energy: 10000 } }
    ];

    const seasonalEvents = [
        { name: "Festival d'Halloween", startDate: "2023-10-31", endDate: "2023-11-01", quests: [{ description: "Collectez des bonbons", goal: 100, type: 'click', reward: { energy: 500 } }] }
    ];

    const seasonalRewards = {
        "Festival d'Halloween": { name: "Artéfact d'Halloween", effect: () => { energyProduction *= 1.2; } }
    };

    const weeklyQuests = [
        { description: "Cliquez 1000 fois cette semaine", goal: 1000, type: 'click', reward: { energy: 1000 } }
    ];

    const factionQuests = {
        "Gardiens": [
            { description: "Cliquez 500 fois pour les Gardiens", goal: 500, type: 'click', reward: { energy: 500 } }
        ]
    };

    const chainQuests = [
        { description: "Trouvez le premier indice", goal: 1, type: 'click', reward: { energy: 100 }, nextQuest: "Trouvez le cristal" },
        { description: "Trouvez le cristal", goal: 1, type: 'click', reward: { energy: 200 } }
    ];

    const randomEvents = [
        { name: "Pluie de Météorites", effect: () => { energy += Math.floor(Math.random() * 100); } }
    ];

    const groupEvents = [
        { name: "Invasion Alien", effect: () => { /* Logique de l'événement de groupe */ } }
    ];

    const bossEvents = [
        { name: "Le Gardien des Dimensions", effect: () => { energy += 500; } }
    ];

    const legendaryArtifacts = [
        { name: "Artéfact de l'Infini", effect: () => { energyProduction *= 2; }, duration: 86400000 }
    ];

    const prestigeChallenges = [
        { description: "Cliquez 10000 fois", goal: 10000, type: 'click', reward: { energy: 5000 } }
    ];

    const leaderboardData = [
        { name: "Player1", score: 1500 },
        { name: "Player2", score: 1200 }
    ];

    const shopItems = [
        { name: "Artéfact Rare", cost: 100, effect: () => { energyProduction *= 1.1; } }
    ];

    const npcData = [
        { name: "Gardien", quest: "Quête du Gardien" }
    ];

    themeSelector.addEventListener('change', (event) => {
        document.body.className = event.target.value;
    });

    document.getElementById('tradeButton').addEventListener('click', () => {
        const friendName = document.getElementById('tradeInput').value;
        // Logique d'échange
    });

    shopContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('shopItem')) {
            const cost = parseInt(event.target.dataset.cost);
            if (gems >= cost) {
                gems -= cost;
                updateGemDisplay();
                // Logique pour obtenir l'item
            }
        }
    });

    avatarSelector.addEventListener('change', (event) => {
        document.getElementById('playerAvatar').src = `images/${event.target.value}.png`;
    });

    accessorySelector.addEventListener('change', (event) => {
        document.getElementById('playerAccessory').src = `images/${event.target.value}.png`;
    });

    function updateGemDisplay() {
        gemCountDisplay.textContent = gems;
    }

    clickButton.addEventListener('click', () => {
        energy += clickMultiplier * prestigeMultiplier;
        totalEnergy += clickMultiplier * prestigeMultiplier;
        totalClicks++;
        gainXP(clickMultiplier);
        updateEnergyDisplay(energy);
        updateStats(totalEnergy, totalClicks);
        saveGame();
        playSound('click');
        if (Math.random() < 0.01) {
            lootArtifact(artifacts);
        }
        if (currentQuest && currentQuest.type === 'click') {
            currentQuest.progress++;
            if (currentQuest.progress >= currentQuest.goal) {
                completeQuest(currentQuest, energy, xp);
            }
            displayQuest(currentQuest, questsContainer);
        }
    });

    upgradesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('upgrade')) {
            const cost = parseInt(event.target.dataset.cost);
            const multiplier = parseFloat(event.target.dataset.multiplier);
            const interval = parseInt(event.target.dataset.interval);
            const auto = parseInt(event.target.dataset.auto);

            if (energy >= cost) {
                energy -= cost;
                if (multiplier) {
                    clickMultiplier = multiplier;
                }
                if (auto) {
                    autoProduction = auto;
                    startAutoProduction(autoProduction, prestigeMultiplier, () => {
                        updateEnergyDisplay(energy);
                        saveGame();
                    });
                }
                updateEnergyDisplay(energy);
                event.target.style.display = 'none';
                saveGame();
            }
        }
    });

    passiveUpgradesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('upgrade')) {
            const cost = parseInt(event.target.dataset.cost);
            const effect = event.target.dataset.effect;

            if (energy >= cost) {
                energy -= cost;
                if (effect === "energyProduction") {
                    energyProduction *= 1.05;
                }
                event.target.style.display = 'none';
                updateEnergyDisplay(energy);
                saveGame();
            }
        }
    });

    dimensionUpgradesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('upgrade')) {
            const dimension = event.target.dataset.dimension;
            const cost = parseInt(event.target.dataset.cost);
            const effect = event.target.dataset.effect;

            if (energy >= cost && currentDimension === dimension) {
                energy -= cost;
                if (effect === "energyProduction") {
                    energyProduction *= 1.1;
                }
                event.target.style.display = 'none';
                updateEnergyDisplay(energy);
                saveGame();
            }
        }
    });

    dimensionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('dimension')) {
            const dimension = event.target.dataset.dimension;
            changeDimension(dimension, dimensions, () => {
                currentDimension = dimension;
                saveGame();
            });
        }
    });

    prestigeButton.addEventListener('click', () => {
        if (energy >= 1000) {
            prestigeMultiplier *= 2;
            energy = 0;
            clickMultiplier = 1;
            autoProduction = 0;
            clearInterval(autoInterval);
            autoInterval = null;
            document.querySelectorAll('.upgrade').forEach(upgrade => {
                upgrade.style.display = 'block';
            });
            updateEnergyDisplay(energy);
            saveGame();
        }
    });

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    function lootArtifact(artifacts) {
        const artifact = {
            name: `Artefact ${artifacts.length + 1}`,
            effect: `Bonus permanent de +${Math.floor(Math.random() * 10) + 1}% d'énergie`
        };
        artifacts.push(artifact);
        displayArtifacts(artifacts, artifactsContainer);
        saveGame();
    }

    function displayArtifacts(artifacts, container) {
        container.innerHTML = '';
        artifacts.forEach(artifact => {
            const artifactElement = document.createElement('div');
            artifactElement.classList.add('artifact');
            artifactElement.textContent = `${artifact.name}: ${artifact.effect}`;
            container.appendChild(artifactElement);
        });
    }

    function startEventInterval(events, callback) {
        eventInterval = setInterval(() => {
            const event = events[Math.floor(Math.random() * events.length)];
            triggerEvent(event);
            callback();
        }, 120000); // Every 2 minutes
    }

    function triggerEvent(event) {
        alert(`Événement: ${event.name}`);
        event.effect();
        setTimeout(() => {
            if (event.name === "Faille instable" || event.name === "Perturbation énergétique") {
                clickMultiplier /= 1.5;
            } else if (event.name === "Pluie de quanta") {
                autoProduction /= 2;
            }
            alert(`Fin de l'événement: ${event.name}`);
            callback();
        }, event.duration);
    }

    function assignQuest(quests, callback) {
        currentQuest = quests[Math.floor(Math.random() * quests.length)];
        currentQuest.progress = 0;
        displayQuest(currentQuest, questsContainer);
        saveGame();
        callback();
    }

    function displayQuest(currentQuest, container) {
        container.innerHTML = '';
        if (currentQuest) {
            const questElement = document.createElement('div');
            questElement.classList.add('quest');
            questElement.textContent = `Quête: ${currentQuest.description} (${currentQuest.progress}/${currentQuest.goal})`;
            container.appendChild(questElement);
        }
    }

    function completeQuest(currentQuest, energy, xp) {
        if (currentQuest.reward.energy) {
            energy += currentQuest.reward.energy;
        }
        if (currentQuest.reward.xp) {
            gainXP(currentQuest.reward.xp);
        }
        currentQuest = null;
        displayQuest(currentQuest, questsContainer);
        assignQuest(quests, () => {
            saveGame();
        });
    }

    function playSound(type) {
        const audio = new Audio();
        if (type === 'click') {
            audio.src = 'https://www.freesoundslibrary.com/wp-content/uploads/2021/08/click-sound.mp3';
        } else if (type === 'event') {
            audio.src = 'https://www.freesoundslibrary.com/wp-content/uploads/2021/08/vortex-sound.mp3';
        }
        audio.play();
    }

    function saveGame() {
        localStorage.setItem('gameState', JSON.stringify({
            energy,
            clickMultiplier,
            autoProduction,
            prestigeMultiplier,
            currentDimension,
            xp,
            level,
            artifacts,
            currentQuest,
            totalEnergy,
            totalClicks,
            gems
        }));
    }

    function loadGame() {
        try {
            const state = JSON.parse(localStorage.getItem('gameState'));
            if (state) {
                Object.assign(this, state);
                if (currentDimension) {
                    changeDimension(currentDimension, dimensions, () => {
                        currentDimension = dimension;
                        saveGame();
                    });
                }
                updateEnergyDisplay(energy);
                updateLevelDisplay(level, xp, xpToNextLevel, progressBar);
                startAutoProduction(autoProduction, prestigeMultiplier, () => {
                    updateEnergyDisplay(energy);
                    saveGame();
                });
                displayArtifacts(artifacts, artifactsContainer);
                displayQuest(currentQuest, questsContainer);
                startEventInterval(events, () => {
                    saveGame();
                });
                updateStats(totalEnergy, totalClicks);
                updateGemDisplay();
                if (!currentQuest) {
                    assignQuest(quests, () => {
                        saveGame();
                    });
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la sauvegarde:", error);
        }
    }

    function updateStats(totalEnergy, totalClicks) {
        totalEnergyDisplay.textContent = totalEnergy;
        totalClicksDisplay.textContent = totalClicks;
    }

    function updateLeaderboard(leaderboardData, elementId) {
        const leaderboardElement = document.getElementById(elementId);
        leaderboardElement.innerHTML = '';
        leaderboardData.forEach(player => {
            const li = document.createElement('li');
            li.textContent = `${player.name}: ${player.score}`;
            leaderboardElement.appendChild(li);
        });
    }

    function addFriend(friendName) {
        const friendsList = document.getElementById('friends');
        const li = document.createElement('li');
        li.textContent = friendName;
        friendsList.appendChild(li);
    }

    function showNotification(message) {
        alert(message);
    }

    function startMemoryGame() {
        const cards = document.getElementById('cards');
        const cardValues = ['A', 'B', 'C', 'D', 'E', 'F'];
        const shuffledCards = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);
        shuffledCards.forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.textContent = value;
            cards.appendChild(card);
        });
    }

    function startPrecisionGame() {
        const target = document.getElementById('target');
        target.style.position = 'absolute';
        target.style.width = '50px';
        target.style.height = '50px';
        target.style.background = 'red';
        target.style.left = Math.random() * window.innerWidth + 'px';
        target.style.top = Math.random() * window.innerHeight + 'px';
        target.addEventListener('click', () => {
            // Logique pour obtenir la récompense
        });
    }

    loadGame();
    updateLeaderboard(leaderboardData, 'weeklyLeaderboard');
    updateLeaderboard(leaderboardData, 'monthlyLeaderboard');
    startMemoryGame();
    startPrecisionGame();
});
