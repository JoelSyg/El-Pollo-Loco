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

    constructor() {
        super().loadImage('/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.45;

        this.animate();
    }

    animate() {
        this.intervals.push(setInterval(() => {
            this.moveLeft();
        }, 1000 / 60));

        this.intervals.push(setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200));
    }

    stopIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    kill() {
        this.stopIntervals();
        this.speed = 0;
        this.loadImage(this.IMAGE_DEAD[0]);
        this.isAlive = false;
    }
}


