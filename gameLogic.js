export function updateEnergyDisplay(energy) {
    document.getElementById('energy').textContent = `Énergie dimensionnelle: ${energy}`;
}

export function updateLevelDisplay(level, xp, xpToNextLevel, progressBar) {
    document.getElementById('level').textContent = `Niveau: ${level}`;
    progressBar.style.width = `${(xp / xpToNextLevel) * 100}%`;
}

export function saveGame(state) {
    localStorage.setItem('gameState', JSON.stringify(state));
}

export function loadGame(callback) {
    try {
        const state = JSON.parse(localStorage.getItem('gameState'));
        if (state) {
            Object.assign(this, state);
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la sauvegarde:", error);
    } finally {
        callback();
    }
}

export function startAutoProduction(autoProduction, prestigeMultiplier, callback) {
    if (autoProduction > 0) {
        const autoInterval = setInterval(() => {
            energy += autoProduction * prestigeMultiplier;
            gainXP(autoProduction);
            callback();
        }, 1000);
    }
}

export function gainXP(amount) {
    xp += amount;
    if (xp >= xpToNextLevel) {
        levelUp();
    }
    updateLevelDisplay(level, xp, xpToNextLevel, progressBar);
    saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
}

export function levelUp() {
    level++;
    xp = 0;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
    clickMultiplier *= 1.01;
    autoProduction += 1;
    updateLevelDisplay(level, xp, xpToNextLevel, progressBar);
    saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
}

export function lootArtifact(artifacts) {
    const artifact = {
        name: `Artefact ${artifacts.length + 1}`,
        effect: `Bonus permanent de +${Math.floor(Math.random() * 10) + 1}% d'énergie`
    };
    artifacts.push(artifact);
    displayArtifacts(artifacts, artifactsContainer);
    saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
}

export function displayArtifacts(artifacts, container) {
    container.innerHTML = '';
    artifacts.forEach(artifact => {
        const artifactElement = document.createElement('div');
        artifactElement.classList.add('artifact');
        artifactElement.textContent = `${artifact.name}: ${artifact.effect}`;
        container.appendChild(artifactElement);
    });
}

export function startEventInterval(events, callback) {
    const eventInterval = setInterval(() => {
        const event = events[Math.floor(Math.random() * events.length)];
        triggerEvent(event);
        callback();
    }, 120000); // Every 2 minutes
}

export function triggerEvent(event) {
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

export function assignQuest(quests, callback) {
    currentQuest = quests[Math.floor(Math.random() * quests.length)];
    currentQuest.progress = 0;
    displayQuest(currentQuest, questsContainer);
    saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
    callback();
}

export function displayQuest(currentQuest, container) {
    container.innerHTML = '';
    if (currentQuest) {
        const questElement = document.createElement('div');
        questElement.classList.add('quest');
        questElement.textContent = `Quête: ${currentQuest.description} (${currentQuest.progress}/${currentQuest.goal})`;
        container.appendChild(questElement);
    }
}

export function completeQuest(currentQuest, energy, xp) {
    if (currentQuest.reward.energy) {
        energy += currentQuest.reward.energy;
    }
    if (currentQuest.reward.xp) {
        gainXP(currentQuest.reward.xp);
    }
    currentQuest = null;
    displayQuest(currentQuest, questsContainer);
    assignQuest(quests, () => {
        saveGame({ energy, clickMultiplier, autoProduction, prestigeMultiplier, currentDimension, xp, level, artifacts, currentQuest });
    });
}

export function playSound(type) {
    const audio = new Audio();
    if (type === 'click') {
        audio.src = 'https://www.freesoundslibrary.com/wp-content/uploads/2021/08/click-sound.mp3';
    } else if (type === 'event') {
        audio.src = 'https://www.freesoundslibrary.com/wp-content/uploads/2021/08/vortex-sound.mp3';
    }
    audio.play();
}
