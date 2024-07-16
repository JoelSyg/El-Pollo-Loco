class ChickenSmall extends MovableObject {
    y = 380;
    height = 40;
    width = 70;

    offset = {
        top: 0,
        bottom: 0,
        left: 5,
        right: 5
    }

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]

    intervals = [];

    death_sound = new Audio('audio/small_chicken_death.mp3');

    constructor() {
        super().loadImage('/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.applyGravity();

        this.x = 900 + Math.random() * (3600 - 1200);
        this.speed = 0.65 + Math.random() * 0.45;

        this.animate();
    }

    animate() {
        this.intervals.push(setInterval(() => {
            this.moveLeft();
        }, 1000 / 60));

        this.intervals.push(setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200));

        // Hier fügen wir das Interval hinzu, um die jump-Funktion alle 2 Sekunden aufzurufen
        // this.intervals.push(setInterval(() => {
        //     this.jump();
        // }, 2000));
    }

    // stopIntervals() {
    //     this.intervals.forEach(clearInterval);
    //     this.intervals = [];
    // }

    kill() {
        this.death_sound.play();
        this.stopIntervals();
        this.speed = 0;
        this.loadImage(this.IMAGE_DEAD[0]);
        this.isAlive = false;
    }

    hitByBottle() {
        this.kill();
    }
}

