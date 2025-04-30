let energy = 0;
let energyPerClick = 1;
let energyPerSecond = 0;
let progress = 0;

document.getElementById('energy-button').addEventListener('click', () => {
    energy += energyPerClick;
    updateEnergyDisplay();
});

document.querySelectorAll('.upgrade').forEach(button => {
    button.addEventListener('click', () => {
        const cost = parseInt(button.dataset.cost);
        const increase = parseInt(button.dataset.increase);
        if (energy >= cost) {
            energy -= cost;
            energyPerClick += increase;
            updateEnergyDisplay();
            button.disabled = true;
        }
    });
});

document.querySelectorAll('.dimension').forEach(button => {
    button.addEventListener('click', () => {
        const dimension = button.dataset.dimension;
        // Logique pour débloquer la dimension
        alert(`Dimension ${dimension} débloquée !`);
    });
});

document.querySelectorAll('.theme').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        document.body.className = theme;
    });
});

document.getElementById('prestige-button').addEventListener('click', () => {
    // Logique pour le prestige
    alert('Prestige activé !');
});

function updateEnergyDisplay() {
    console.log(`Énergie: ${energy}`);
    document.getElementById('progress').style.setProperty('--progress', `${progress}%`);
}

function updateProgress(value) {
    progress = value;
    document.getElementById('progress').style.setProperty('--progress', `${progress}%`);
}
