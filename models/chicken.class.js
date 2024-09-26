class Chicken extends MovableObject {
    y = 360;
    height = 60;
    width = 100;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }

    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        './img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    death_sound = new Audio('./audio/chicken_death.mp3');

    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 1200 + Math.random() * (4200 - 1200);
        this.speed = 0.45 + Math.random() * 0.45;

        this.animate();
    }

    animate() {
        addInterval(() => {
            this.moveLeft();
        }, 1000 / 60, this);

        addInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200, this);
    }

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

    updateSoundVolumes(isMuted) {
        this.death_sound.volume = isMuted ? 0 : 1;
    }
}


