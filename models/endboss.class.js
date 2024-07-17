class Endboss extends MovableObject {
    height = 320;
    width = 260;
    y = 130;

    speed = 2.5;
    originalSpeed = 2.5;

    health = 100; // Initialize health property

    offset = {
        top: 55,
        bottom: 15,
        left: 20,
        right: 20
    };

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    hurt_sound = new Audio('audio/endboss_hurt.mp3');
    sound = new Audio('audio/chickenBoss.wav');

    intervals = [];
    isAttacking = false;
    isChasing = false;
    isAlert = false;
    isHurt = false;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = 3800;
        this.isBoss = true;
        this.animate();
    }

    animate() {
        addInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAlert) {
                this.playAnimation(this.IMAGES_ALERT);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        addInterval(() => {
            this.checkCharacterPosition();
        }, 1000 / 60);
    }

    kill() {
        this.speed = 0;
        this.isAlive = false;
    }

    hitByBottle() {
        if (this.health > 21) {
            this.health -= 20;
            this.lastHit = new Date().getTime();
            this.hurt_sound.play();
            this.hurt();
            setTimeout(() => {
                this.goToAlertState();
            }, 500);
        } else {
            this.health = 0;
            this.kill();
        }
    }

    hurt() {
        this.isHurt = true;
        setTimeout(() => {
            this.isHurt = false;
        }, 200);
    }

    goToAlertState() {
        this.isAlert = true;
        this.speed = 14;
        setTimeout(() => {
            this.isAlert = false;
            this.speed = this.originalSpeed;
        }, 550);
    }

    attack() {
        this.isAttacking = true;
        this.sound.play();
    }

    stopAttack() {
        this.isAttacking = false;
    }

    startChasing() {
        this.isChasing = true;
    }

    checkCharacterPosition() {
        if (this.world) {
            const character = this.world.character;
            const distance = Math.abs(character.x - this.x);
            if (distance < 465) {
                this.startChasing();
            }

            if (this.isChasing) {
                if (character.x < this.x) {
                    this.otherDirection = false;
                    if (!this.isColliding(character)) {
                        this.moveLeft();
                    }
                } else if (character.x > this.x) {
                    this.otherDirection = true;
                    if (!this.isColliding(character)) {
                        this.moveRight();
                    }
                }

                if (this.isColliding(character)) {
                    this.attack();
                } else {
                    this.stopAttack();
                }
            }
        }
    }
}
