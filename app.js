// NBA 2K26 Builder - Application JavaScript

// Configuration des limites par position
const positionLimits = {
    PG: { minHeight: 66, maxHeight: 80, name: "Point Guard" },      // 5'6" - 6'8"
    SG: { minHeight: 66, maxHeight: 81, name: "Shooting Guard" },   // 5'6" - 6'9"
    SF: { minHeight: 66, maxHeight: 82, name: "Small Forward" },    // 5'6" - 6'10"
    PF: { minHeight: 66, maxHeight: 84, name: "Power Forward" },    // 5'6" - 7'0"
    C:  { minHeight: 66, maxHeight: 88, name: "Center" }            // 5'6" - 7'4"
};

// Configuration des attributs avec leurs limites de base
const attributeConfig = {
    // Finishing
    closeShot: { min: 25, max: 99, category: 'finishing' },
    drivingLayup: { min: 25, max: 99, category: 'finishing' },
    drivingDunk: { min: 25, max: 99, category: 'finishing' },
    standingDunk: { min: 25, max: 99, category: 'finishing' },
    postControl: { min: 25, max: 99, category: 'finishing' },
    // Shooting
    midRange: { min: 25, max: 99, category: 'shooting' },
    threePoint: { min: 25, max: 99, category: 'shooting' },
    freeThrow: { min: 25, max: 99, category: 'shooting' },
    // Playmaking
    passAccuracy: { min: 25, max: 99, category: 'playmaking' },
    ballHandle: { min: 25, max: 99, category: 'playmaking' },
    speedWithBall: { min: 25, max: 99, category: 'playmaking' },
    // Defense
    interiorDefense: { min: 25, max: 99, category: 'defense' },
    perimeterDefense: { min: 25, max: 99, category: 'defense' },
    steal: { min: 25, max: 99, category: 'defense' },
    block: { min: 25, max: 99, category: 'defense' },
    // Rebounding
    offensiveRebound: { min: 25, max: 99, category: 'rebounding' },
    defensiveRebound: { min: 25, max: 99, category: 'rebounding' },
    // Physicals
    speed: { min: 25, max: 99, category: 'physicals' },
    acceleration: { min: 25, max: 99, category: 'physicals' },
    strength: { min: 25, max: 99, category: 'physicals' },
    vertical: { min: 25, max: 99, category: 'physicals' },
    stamina: { min: 25, max: 99, category: 'physicals' }
};

// État de l'application
let currentBuild = {
    name: '',
    position: 'PG',
    height: 78,  // 6'6"
    weight: 200,
    wingspan: 80, // 6'8"
    attributes: {},
    badges: {}
};

// Points totaux disponibles
const TOTAL_POINTS = 420;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeAttributes();
    setupEventListeners();
    loadSavedBuilds();
    updateUI();
});

// Initialiser les attributs à 25
function initializeAttributes() {
    for (const attr in attributeConfig) {
        currentBuild.attributes[attr] = 25;
    }
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Position
    document.getElementById('position').addEventListener('change', (e) => {
        currentBuild.position = e.target.value;
        updateHeightLimits();
        updateUI();
    });

    // Taille
    document.getElementById('height').addEventListener('input', (e) => {
        currentBuild.height = parseInt(e.target.value);
        updateWingspanLimits();
        updateAttributeLimits();
        updateUI();
    });

    // Poids
    document.getElementById('weight').addEventListener('input', (e) => {
        currentBuild.weight = parseInt(e.target.value);
        updateAttributeLimits();
        updateUI();
    });

    // Envergure
    document.getElementById('wingspan').addEventListener('input', (e) => {
        currentBuild.wingspan = parseInt(e.target.value);
        updateAttributeLimits();
        updateUI();
    });

    // Nom du build
    document.getElementById('playerName').addEventListener('input', (e) => {
        currentBuild.name = e.target.value;
    });

    // Boutons d'attributs
    document.querySelectorAll('.btn-minus, .btn-plus').forEach(btn => {
        btn.addEventListener('click', handleAttributeChange);
    });

    // Badges
    document.querySelectorAll('.badge-level').forEach(select => {
        select.addEventListener('change', handleBadgeChange);
    });

    // Actions
    document.getElementById('saveBuild').addEventListener('click', saveBuild);
    document.getElementById('resetBuild').addEventListener('click', resetBuild);
    document.getElementById('exportBuild').addEventListener('click', exportBuild);
}

// Gérer le changement d'attribut
function handleAttributeChange(e) {
    const attr = e.target.dataset.attr;
    const isPlus = e.target.classList.contains('btn-plus');
    const currentValue = currentBuild.attributes[attr];
    const config = attributeConfig[attr];
    const maxValue = getMaxAttributeValue(attr);

    if (isPlus) {
        if (currentValue < maxValue && getPointsUsed() < TOTAL_POINTS) {
            currentBuild.attributes[attr] = currentValue + 1;
        }
    } else {
        if (currentValue > config.min) {
            currentBuild.attributes[attr] = currentValue - 1;
        }
    }

    updateUI();
}

// Gérer le changement de badge
function handleBadgeChange(e) {
    const badgeItem = e.target.closest('.badge-item');
    const badgeName = badgeItem.dataset.badge;
    currentBuild.badges[badgeName] = e.target.value;

    // Mettre à jour l'attribut visuel
    e.target.dataset.selected = e.target.value;
}

// Obtenir la valeur max d'un attribut basée sur la taille/poids/envergure
function getMaxAttributeValue(attr) {
    const config = attributeConfig[attr];
    let maxValue = config.max;

    // Ajuster selon la taille (les grands perdent en agilité, gagnent en intérieur)
    const heightFactor = (currentBuild.height - 66) / 22; // 0 à 1

    if (config.category === 'physicals') {
        if (attr === 'speed' || attr === 'acceleration' || attr === 'speedWithBall') {
            maxValue = Math.round(99 - (heightFactor * 25));
        }
        if (attr === 'strength') {
            maxValue = Math.round(65 + (heightFactor * 34));
        }
    }

    if (config.category === 'playmaking') {
        if (attr === 'ballHandle' || attr === 'speedWithBall') {
            maxValue = Math.round(99 - (heightFactor * 20));
        }
    }

    if (config.category === 'finishing') {
        if (attr === 'standingDunk') {
            maxValue = Math.round(60 + (heightFactor * 39));
        }
    }

    if (config.category === 'rebounding') {
        maxValue = Math.round(70 + (heightFactor * 29));
    }

    if (config.category === 'defense') {
        if (attr === 'block') {
            maxValue = Math.round(65 + (heightFactor * 34));
        }
        if (attr === 'perimeterDefense') {
            maxValue = Math.round(99 - (heightFactor * 15));
        }
    }

    // Ajuster selon l'envergure
    const wingspanDiff = currentBuild.wingspan - currentBuild.height;
    if (config.category === 'shooting') {
        maxValue = Math.round(maxValue - (wingspanDiff * 1.5));
    }
    if (attr === 'steal' || attr === 'block') {
        maxValue = Math.round(maxValue + (wingspanDiff * 1));
    }

    return Math.max(25, Math.min(99, maxValue));
}

// Mettre à jour les limites de taille selon la position
function updateHeightLimits() {
    const limits = positionLimits[currentBuild.position];
    const heightSlider = document.getElementById('height');

    heightSlider.max = limits.maxHeight;

    if (currentBuild.height > limits.maxHeight) {
        currentBuild.height = limits.maxHeight;
        heightSlider.value = limits.maxHeight;
    }

    document.getElementById('maxHeightLabel').textContent = formatHeight(limits.maxHeight);
    updateWingspanLimits();
}

// Mettre à jour les limites d'envergure
function updateWingspanLimits() {
    const minWingspan = currentBuild.height - 6;
    const maxWingspan = currentBuild.height + 6;
    const wingspanSlider = document.getElementById('wingspan');

    wingspanSlider.min = minWingspan;
    wingspanSlider.max = maxWingspan;

    if (currentBuild.wingspan < minWingspan) {
        currentBuild.wingspan = minWingspan;
    }
    if (currentBuild.wingspan > maxWingspan) {
        currentBuild.wingspan = maxWingspan;
    }
    wingspanSlider.value = currentBuild.wingspan;

    document.getElementById('minWingspanLabel').textContent = formatHeight(minWingspan);
    document.getElementById('maxWingspanLabel').textContent = formatHeight(maxWingspan);
}

// Mettre à jour les limites des attributs
function updateAttributeLimits() {
    for (const attr in attributeConfig) {
        const maxValue = getMaxAttributeValue(attr);
        if (currentBuild.attributes[attr] > maxValue) {
            currentBuild.attributes[attr] = maxValue;
        }
    }
}

// Calculer les points utilisés
function getPointsUsed() {
    let used = 0;
    for (const attr in currentBuild.attributes) {
        used += currentBuild.attributes[attr] - 25;
    }
    return used;
}

// Calculer l'overall
function calculateOverall() {
    const attrs = currentBuild.attributes;
    let total = 0;
    let count = 0;

    for (const attr in attrs) {
        total += attrs[attr];
        count++;
    }

    // Calcul simplifié de l'overall
    const avgAttr = total / count;
    const overall = Math.round(25 + (avgAttr - 25) * 0.95);

    return Math.min(99, Math.max(25, overall));
}

// Formater la taille en pieds et pouces
function formatHeight(inches) {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
}

// Mettre à jour l'interface utilisateur
function updateUI() {
    // Taille
    document.getElementById('heightDisplay').textContent = formatHeight(currentBuild.height);
    document.getElementById('height').value = currentBuild.height;

    // Poids
    document.getElementById('weightDisplay').textContent = currentBuild.weight;

    // Envergure
    document.getElementById('wingspanDisplay').textContent = formatHeight(currentBuild.wingspan);
    document.getElementById('wingspan').value = currentBuild.wingspan;

    // Attributs
    for (const attr in currentBuild.attributes) {
        const element = document.getElementById(attr);
        if (element) {
            element.textContent = currentBuild.attributes[attr];

            // Colorer selon la valeur
            const value = currentBuild.attributes[attr];
            if (value >= 90) {
                element.style.color = '#27ae60';
            } else if (value >= 75) {
                element.style.color = '#f39c12';
            } else if (value >= 50) {
                element.style.color = '#ffffff';
            } else {
                element.style.color = '#e74c3c';
            }
        }
    }

    // Points restants
    const pointsUsed = getPointsUsed();
    const pointsRemaining = TOTAL_POINTS - pointsUsed;
    document.getElementById('pointsRemaining').textContent = pointsRemaining;

    // Overall
    const overall = calculateOverall();
    const overallElement = document.getElementById('overallRating');
    overallElement.textContent = overall;
    overallElement.classList.add('updated');
    setTimeout(() => overallElement.classList.remove('updated'), 300);
}

// Sauvegarder le build
function saveBuild() {
    const buildName = currentBuild.name || `Build ${new Date().toLocaleString('fr-FR')}`;

    const buildToSave = {
        ...currentBuild,
        name: buildName,
        overall: calculateOverall(),
        savedAt: new Date().toISOString()
    };

    let savedBuilds = JSON.parse(localStorage.getItem('nba2k26builds') || '[]');
    savedBuilds.push(buildToSave);
    localStorage.setItem('nba2k26builds', JSON.stringify(savedBuilds));

    loadSavedBuilds();
    alert(`Build "${buildName}" sauvegardé !`);
}

// Charger les builds sauvegardés
function loadSavedBuilds() {
    const savedBuilds = JSON.parse(localStorage.getItem('nba2k26builds') || '[]');
    const container = document.getElementById('savedBuildsList');

    if (savedBuilds.length === 0) {
        container.innerHTML = '<p class="no-builds">Aucun build sauvegardé</p>';
        return;
    }

    container.innerHTML = savedBuilds.map((build, index) => `
        <div class="saved-build-card">
            <h4>${build.name}</h4>
            <div class="build-info">
                <p>${positionLimits[build.position]?.name || build.position} | ${formatHeight(build.height)} | ${build.weight} lbs</p>
                <p>Overall: <strong>${build.overall}</strong></p>
            </div>
            <div class="build-actions">
                <button class="btn btn-secondary btn-small" onclick="loadBuild(${index})">Charger</button>
                <button class="btn btn-danger btn-small" onclick="deleteBuild(${index})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Charger un build
function loadBuild(index) {
    const savedBuilds = JSON.parse(localStorage.getItem('nba2k26builds') || '[]');
    const build = savedBuilds[index];

    if (build) {
        currentBuild = { ...build };

        // Mettre à jour les inputs
        document.getElementById('playerName').value = build.name;
        document.getElementById('position').value = build.position;
        document.getElementById('height').value = build.height;
        document.getElementById('weight').value = build.weight;

        updateHeightLimits();
        updateWingspanLimits();

        // Charger les badges
        for (const badge in build.badges) {
            const select = document.querySelector(`[data-badge="${badge}"] .badge-level`);
            if (select) {
                select.value = build.badges[badge];
                select.dataset.selected = build.badges[badge];
            }
        }

        updateUI();
    }
}

// Supprimer un build
function deleteBuild(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce build ?')) {
        let savedBuilds = JSON.parse(localStorage.getItem('nba2k26builds') || '[]');
        savedBuilds.splice(index, 1);
        localStorage.setItem('nba2k26builds', JSON.stringify(savedBuilds));
        loadSavedBuilds();
    }
}

// Réinitialiser le build
function resetBuild() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le build ?')) {
        currentBuild = {
            name: '',
            position: 'PG',
            height: 78,
            weight: 200,
            wingspan: 80,
            attributes: {},
            badges: {}
        };

        initializeAttributes();

        document.getElementById('playerName').value = '';
        document.getElementById('position').value = 'PG';
        document.getElementById('height').value = 78;
        document.getElementById('weight').value = 200;

        // Réinitialiser les badges
        document.querySelectorAll('.badge-level').forEach(select => {
            select.value = 'none';
            select.dataset.selected = 'none';
        });

        updateHeightLimits();
        updateWingspanLimits();
        updateUI();
    }
}

// Exporter le build
function exportBuild() {
    const buildData = {
        ...currentBuild,
        overall: calculateOverall()
    };

    const dataStr = JSON.stringify(buildData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentBuild.name || 'nba2k26-build'}.json`;
    link.click();

    URL.revokeObjectURL(url);
}
