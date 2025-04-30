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

    function updateEnergyDisplay() {
        energyDisplay.textContent = `Énergie dimensionnelle: ${energy}`;
    }

    function updateLevelDisplay() {
        levelDisplay.textContent = `Niveau: ${level}`;
        progressBar.style.width = `${(xp / xpToNextLevel) * 100}%`;
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
            currentQuest
        }));
    }

    function loadGame() {
        try {
            const state = JSON.parse(localStorage.getItem('gameState'));
            if (state) {
                Object.assign(this, state);
                if (currentDimension) {
                    changeDimension(currentDimension);
                }
                updateEnergyDisplay();
                updateLevelDisplay();
                startAutoProduction();
                displayArtifacts();
                displayQuest();
                startEventInterval();
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la sauvegarde:", error);
        }
    }

    function startAutoProduction() {
        if (autoProduction > 0) {
            autoInterval = setInterval(() => {
                energy += autoProduction * prestigeMultiplier;
                gainXP(autoProduction);
                updateEnergyDisplay();
                saveGame();
            }, 1000);
        }
    }

    function gainXP(amount) {
        xp += amount;
        if (xp >= xpToNextLevel) {
            levelUp();
        }
        updateLevelDisplay();
        saveGame();
    }

    function levelUp() {
        level++;
        xp = 0;
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
        clickMultiplier *= 1.01;
        autoProduction += 1;
        updateLevelDisplay();
        saveGame();
    }

    clickButton.addEventListener('click', () => {
        energy += clickMultiplier * prestigeMultiplier;
        gainXP(clickMultiplier);
        updateEnergyDisplay();
        saveGame();
        playSound('click');
        if (Math.random() < 0.01) {
            lootArtifact();
        }
        if (currentQuest && currentQuest.type === 'click') {
            currentQuest.progress++;
            if (currentQuest.progress >= currentQuest.goal) {
                completeQuest();
            }
            displayQuest();
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
                    startAutoProduction();
                }
                updateEnergyDisplay();
                event.target.style.display = 'none';
                saveGame();
            }
        }
    });

    dimensionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('dimension')) {
            const dimension = event.target.dataset.dimension;
            changeDimension(dimension);
        }
    });

    function changeDimension(dimension) {
        if (dimensions[dimension]) {
            currentDimension = dimension;
            document.body.style.background = dimensions[dimension].background;
            document.body.style.color = dimensions[dimension].color;
            clickMultiplier *= dimensions[dimension].boost;
            document.body.classList.add('fade-transition');
            setTimeout(() => {
                document.body.classList.remove('fade-transition');
            }, 1000);
            saveGame();
        }
    }

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
            updateEnergyDisplay();
            saveGame();
        }
    });

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    function lootArtifact() {
        const artifact = {
            name: `Artefact ${artifacts.length + 1}`,
            effect: `Bonus permanent de +${Math.floor(Math.random() * 10) + 1}% d'énergie`
        };
        artifacts.push(artifact);
        displayArtifacts();
        saveGame();
    }

    function displayArtifacts() {
        artifactsContainer.innerHTML = '';
        artifacts.forEach(artifact => {
            const artifactElement = document.createElement('div');
            artifactElement.classList.add('artifact');
            artifactElement.textContent = `${artifact.name}: ${artifact.effect}`;
            artifactsContainer.appendChild(artifactElement);
        });
    }

    function startEventInterval() {
        eventInterval = setInterval(() => {
            const event = events[Math.floor(Math.random() * events.length)];
            triggerEvent(event);
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
        }, event.duration);
    }

    function assignQuest() {
        currentQuest = quests[Math.floor(Math.random() * quests.length)];
        currentQuest.progress = 0;
        displayQuest();
        saveGame();
    }

    function displayQuest() {
        questsContainer.innerHTML = '';
        if (currentQuest) {
            const questElement = document.createElement('div');
            questElement.classList.add('quest');
            questElement.textContent = `Quête: ${currentQuest.description} (${currentQuest.progress}/${currentQuest.goal})`;
            questsContainer.appendChild(questElement);
        }
    }

    function completeQuest() {
        if (currentQuest.reward.energy) {
            energy += currentQuest.reward.energy;
        }
        if (currentQuest.reward.xp) {
            gainXP(currentQuest.reward.xp);
        }
        currentQuest = null;
        displayQuest();
        assignQuest();
        saveGame();
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

    loadGame();
    if (!currentQuest) {
        assignQuest();
    }
});
