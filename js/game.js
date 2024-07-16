let canvas;
let world;
let keyboard = new Keyboard();

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
    initLevel(); // Level initialisieren
    document.getElementById('startMenu').style.display = 'none'; // Startmenü ausblenden
    canvas.style.display = 'block'; // Canvas anzeigen
    if (!document.querySelector('.mobile-controls').classList.contains('hidden')) {
        document.getElementById('controlDiv').style.display = 'none'; // Tastatursteuerungserklärung ausblenden, wenn mobile Steuerungsbuttons sichtbar sind
    }
    world = new World(canvas, keyboard); // Spielwelt erstellen
    console.log('my character is', world.character);
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
