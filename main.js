import { updateEnergyDisplay, updateLevelDisplay, saveGame, loadGame, startAutoProduction, gainXP, levelUp, lootArtifact, displayArtifacts, startEventInterval, assignQuest, displayQuest, completeQuest, playSound } from './gameLogic.js';
import { changeDimension } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const energyDisplay = document.getElementById('energy');
    const levelDisplay = document.getElementById('level');
    const progressBar = document.getElementById('progress');
    const clickButton = document.getElementById('clickButton');
    const upgradesContainer = document.getElementById('upgrades');
    const dimensionsContainer = document.getElementById('dimensions');
    const prestigeButton = document.getElementById('prestigeButton');
    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');
    const artifactsContainer = document.getElementById('artifacts');
    const questsContainer = document.getElementById('quests');

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

    const dimensions = {
        "Cybermonde": { background: "linear-gradient(135deg, #1abc9c, #16a085)", color: "#ecf0f1", boost: 1.5 },
        "Terre Organique": { background: "linear-gradient(135deg, #2ecc71, #27ae60)", color: "#ecf0f1", boost: 2 },
        "Vide Lumineux": { background: "linear-gradient(135deg, #e67e22, #d35400)", color: "#ecf0f1", boost: 2.5 }
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

    clickButton.addEventListener('click', () => {
        energy += clickMultiplier * prestigeMultiplier;
        gainXP(clickMultiplier);
        updateEnergyDisplay(energy);
        saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
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
                        saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
                    });
                }
                updateEnergyDisplay(energy);
                event.target.style.display = 'none';
                saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
            }
        }
    });

    dimensionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('dimension')) {
            const dimension = event.target.dataset.dimension;
            changeDimension(dimension, dimensions, () => {
                currentDimension = dimension;
                saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
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
            saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
        }
    });

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    loadGame(() => {
        updateEnergyDisplay(energy);
        updateLevelDisplay(level, xp, xpToNextLevel, progressBar);
        startAutoProduction(autoProduction, prestigeMultiplier, () => {
            updateEnergyDisplay(energy);
            saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
        });
        displayArtifacts(artifacts, artifactsContainer);
        displayQuest(currentQuest, questsContainer);
        startEventInterval(events, () => {
            saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
        });
        if (!currentQuest) {
            assignQuest(quests, () => {
                saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
            });
        }
    });
});
