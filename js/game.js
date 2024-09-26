let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];

victory_sound = new Audio('./audio/victory.mp3')
game_over_sound = new Audio('./audio/game_over.wav')

/* Zentrale Verwaltung von Intervallen */
function addInterval(fn, time, object) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    if (object && object.intervals) {
        object.intervals.push(id);
    }
    return id;
}

function toggleMusic() {
    if (world) { 
        world.toggleMusicMute();
        updateMusicSwitch(world.isMusicMuted); // Greife direkt auf world.isMusicMuted zu
    }
}

function toggleSound() {
    if (world) { 
        world.toggleSoundMute();
        updateSoundSwitch(world.isSoundMuted); // Greife direkt auf world.isSoundMuted zu
        updateAllSoundVolumes(world.isSoundMuted);
    }
}

// Funktion zum Aktualisieren des Musik-Switch-Bildes
function updateMusicSwitch(isMusicMuted) {
    const musicSwitch = document.getElementById('music-switch');
    if (isMusicMuted) {
        musicSwitch.src = './img/11_menu/switch_off.png';
    } else {
        musicSwitch.src = './img/11_menu/switch_on.png';
    }
}

// Funktion zum Aktualisieren des Sound-Switch-Bildes
function updateSoundSwitch(isSoundMuted) {
    const soundSwitch = document.getElementById('sound-switch');
    if (isSoundMuted) {
        soundSwitch.src = './img/11_menu/switch_off.png';
    } else {
        soundSwitch.src = './img/11_menu/switch_on.png';
    }
}

function updateAllSoundVolumes(isMuted) {
    const volume = isMuted ? 0 : 1;
    victory_sound.volume = volume;
    game_over_sound.volume = volume;
}




function clearAllIntervals() {
    setTimeout(() => {
        intervalIds.forEach(clearInterval);
        intervalIds = [];
    }, 250);
}

/* Initialisierungsfunktion */
function init() {
    canvas = document.getElementById('canvas'); // Canvas-Element abrufen
    detectMobileDevice(); // Überprüfen, ob das Gerät ein mobiles Gerät ist
    addTouchEventListeners(); // Touch-Event-Listener hinzufügen
    window.addEventListener('resize', checkOrientation); // Listener für die Größenänderung des Fensters hinzufügen
    checkOrientation(); // Überprüfen Sie die Ausrichtung beim Laden der Seite
}

window.onload = init; // Initialisierungsfunktion beim Laden des Fensters ausführen

/* Funktion zum Starten des Spiels */
function startGame() {
    if (world) {
        clearAllIntervals();
        world = null;
    }
    initLevel();
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameOverScreen').classList.add('hidden');
    canvas.style.display = 'block';
    document.getElementById('soundIcon').style.display = 'block'
    document.getElementById('controlDiv').style.display = 'flex'; // Ensure controlDiv is displayed
    if (!document.querySelector('.mobile-controls').classList.contains('hidden')) {
        document.getElementById('controlDiv').style.display = 'none'; // Hide keyboard controls if mobile controls are visible
    }
    world = new World(canvas, keyboard); // Create the game world
}


/* Funktion zum Stoppen des Spiels */
function stopGame() {
    clearAllIntervals();
    if (world && world.character) {
        world.character.stopIntervals();
    }
    // Füge hier ähnliche Aufrufe für andere Spielobjekte hinzu, falls nötig
}

function gameOver(won) {
    setTimeout(() => {
        stopGame();
        const gameOverScreen = document.getElementById('gameOverScreen');
        const gameOverImage = document.getElementById('gameOverImage');
        gameOverScreen.classList.remove('hidden');
        gameOverScreen.style.width = (canvas.clientWidth + 7) + 'px'; // +7 für die 3,5px Border auf jeder Seite
        gameOverScreen.style.height = (canvas.clientHeight + 7) + 'px'; // +7 für die 3,5px Border auf jeder Seite

        // Überprüfen, ob beide gemuted sind
        const isCompletelyMuted = world.isMusicMuted && world.isSoundMuted;

        if (won) {
            gameOverScreen.classList.add('won');
            gameOverImage.src = './img/9_intro_outro_screens/win/won_1.png';
            if (!isCompletelyMuted) {  // Spiele den Victory-Sound, wenn nicht alles gemutet ist
                victory_sound.play(); 
            }
        } else {
            gameOverScreen.classList.remove('won');
            gameOverImage.src = './img/9_intro_outro_screens/game_over/you lost.png';
            if (!isCompletelyMuted) {  // Spiele den Game-Over-Sound, wenn nicht alles gemutet ist
                game_over_sound.play(); 
            }
        }
    }, 250);
}







/* Event-Listener für Tastaturereignisse */
window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});

/* Funktion zum Hinzufügen von Touch-Event-Listenern */
function addTouchEventListeners() {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");
    const btnThrow = document.getElementById("btnThrow");

    if (btnLeft) {
        btnLeft.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.LEFT = true;
        });
        btnLeft.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.LEFT = false;
        });
    }

    if (btnRight) {
        btnRight.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.RIGHT = true;
        });
        btnRight.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.RIGHT = false;
        });
    }

    if (btnJump) {
        btnJump.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.UP = true;
        });
        btnJump.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.UP = false;
        });
    }

    if (btnThrow) {
        btnThrow.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.D = true;
        });
        btnThrow.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.D = false;
        });
    }
}

/* Funktion zur Erkennung mobiler Geräte */
function detectMobileDevice() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|tablet|touch/.test(userAgent); // Überprüfen, ob das Gerät ein mobiles Gerät ist
    const isTouchDevice = 'ontouchstart' in document.documentElement; // Überprüfen, ob das Gerät Touch-Events unterstützt

    if (isMobile || isTouchDevice) {
        document.querySelector('.mobile-controls').classList.remove('hidden'); // Mobile Steuerungsbuttons anzeigen
        document.getElementById('controlDiv').style.display = 'none'; // Tastatursteuerungserklärung ausblenden
    } else {
        document.querySelector('.mobile-controls').classList.add('hidden'); // Mobile Steuerungsbuttons ausblenden
        document.getElementById('controlDiv').style.display = 'flex'; // Tastatursteuerungserklärung anzeigen
    }
}

/* Funktion zur Überprüfung der Ausrichtung des Geräts */
function checkOrientation() {
    const orientationWarning = document.getElementById('orientationWarning');
    const gameContent = [document.getElementById('gameTitle'), document.getElementById('startMenu'), document.getElementById('controlDiv'), document.getElementById('gameContainer')];

    if (window.innerWidth < window.innerHeight) {
        orientationWarning.classList.remove('hidden'); // Warnung anzeigen, wenn das Gerät aufrecht gehalten wird
        gameContent.forEach(element => element.classList.add('hidden')); // Spielinhalte ausblenden
    } else {
        orientationWarning.classList.add('hidden'); // Warnung ausblenden, wenn das Gerät seitwärts gehalten wird
        gameContent.forEach(element => element.classList.remove('hidden')); // Spielinhalte anzeigen
    }
}


function toggleSoundMenu() {
    let soundMenu = document.querySelector('.sound-menu');
    soundMenu.style.display = (soundMenu.style.display === 'flex') ? 'none' : 'flex';
 }

 document.addEventListener('click', function(event) {
    let soundMenu = document.querySelector('.sound-menu');
    let openButton = document.querySelector('img[onclick="toggleSoundMenu()"]');
    if (soundMenu.style.display === 'flex' && !soundMenu.contains(event.target) && !openButton.contains(event.target)) {
        soundMenu.style.display = 'none';
    }
});
 

function toggleFullscreen() {
    let elem = document.documentElement;
    let fullscreenSwitch = document.getElementById('fullscreen-switch');

    if (!document.fullscreenElement) {
        // Request fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        }
        fullscreenSwitch.src = './img/11_menu/switch_on.png';  // Change switch to ON
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
        fullscreenSwitch.src = './img/11_menu/switch_off.png';  // Change switch to OFF
    }
}

document.addEventListener("fullscreenchange", function() {
    const fullscreenSwitch = document.getElementById('fullscreen-switch');
    if (document.fullscreenElement) {
        fullscreenSwitch.src = './img/11_menu/switch_on.png';
    } else {
        fullscreenSwitch.src = './img/11_menu/switch_off.png';
    }
});

