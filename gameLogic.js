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
    saveGame();
}

export function levelUp() {
    level++;
    xp = 0;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
    clickMultiplier *= 1.01;
    autoProduction += 1;
    updateLevelDisplay(level, xp, xpToNextLevel, progressBar);
    saveGame();
}

export function lootArtifact(artifacts) {
    const artifact = {
        name: `Artefact ${artifacts.length + 1}`,
        effect: `Bonus permanent de +${Math.floor(Math.random() * 10) + 1}% d'énergie`
    };
    artifacts.push(artifact);
    displayArtifacts(artifacts, artifactsContainer);
    saveGame();
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
    saveGame();
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
        saveGame();
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

export function changeDimension(dimension, dimensions, callback) {
    if (dimensions[dimension]) {
        currentDimension = dimension;
        document.body.style.background = dimensions[dimension].background;
        document.body.style.color = dimensions[dimension].color;
        clickMultiplier *= dimensions[dimension].boost;
        document.body.classList.add('fade-transition');
        setTimeout(() => {
            document.body.classList.remove('fade-transition');
        }, 1000);
        callback();
    }
}

export function fuseArtifacts(artifacts) {
    if (artifacts.length >= 3) {
        const newArtifact = { name: "Artéfact Rare", effect: () => { energyProduction *= 1.1; } };
        artifacts.push(newArtifact);
        return newArtifact;
    }
}

export function calculatePrestigeBonus(prestigeLevel) {
    return 1 + (prestigeLevel * 0.05);
}

export function getPrestigeReward(prestigeLevel) {
    if (prestigeLevel >= 10) {
        return { name: "Artéfact Légendaire", effect: () => { energyProduction *= 2; } };
    }
}

export function getAchievementReward(achievementsUnlocked) {
    if (achievementsUnlocked >= 10) {
        return { effect: () => { energyProduction *= 1.1; } };
    }
}

export function getDailyReward(consecutiveDays) {
    return { energy: 100 * consecutiveDays };
}

export function updateLeaderboard(leaderboardData, elementId) {
    const leaderboardElement = document.getElementById(elementId);
    leaderboardElement.innerHTML = '';
    leaderboardData.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score}`;
        leaderboardElement.appendChild(li);
    });
}

export function addFriend(friendName) {
    const friendsList = document.getElementById('friends');
    const li = document.createElement('li');
    li.textContent = friendName;
    friendsList.appendChild(li);
}

export function showNotification(message) {
    alert(message);
}

export function updateStats(totalEnergy, totalClicks) {
    document.getElementById('totalEnergy').textContent = totalEnergy;
    document.getElementById('totalClicks').textContent = totalClicks;
}

export function updateGemDisplay(gems) {
    document.getElementById('gemCount').textContent = gems;
}

export function earnGems(amount) {
    gems += amount;
    updateGemDisplay(gems);
}

export function startMemoryGame() {
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

export function startPrecisionGame() {
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
