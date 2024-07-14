class Endboss extends MovableObject {

    height = 320;
    width = 260;
    y = 130;

    speed = 2;

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
        'img/4_enemie_boss_chicken/2_allert/G5.png',
        'img/4_enemie_boss_chicken/2_allert/G6.png',
        'img/4_enemie_boss_chicken/2_allert/G7.png',
        'img/4_enemie_boss_chicken/2_allert/G8.png',
        'img/4_enemie_boss_chicken/2_allert/G9.png',
        'img/4_enemie_boss_chicken/2_allert/G10.png',
        'img/4_enemie_boss_chicken/2_allert/G11.png',
        'img/4_enemie_boss_chicken/2_allert/G12.png',
    ]

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

    intervals = [];
    isAttacking = false;  // Add an attacking state

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = 700;
        this.isBoss = true;
        this.health = 100; // Initialize health
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAttacking) {  // Check if the endboss is attacking
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        setInterval(() => {
            this.checkCharacterPosition();
        }, 1000 / 60); 
    }

    kill() {
        this.speed = 0;
        this.isAlive = false;
    }

    hitByBottle() {
        if (this.health > 51) {
            this.health -= 50;
            this.lastHit = new Date().getTime();  // Set last hit time
            this.hurt_sound.play();

        } else {
            this.health = 0;
            this.kill();
        }
    }

    attack() {
        this.isAttacking = true;
    }

    stopAttack() {
        this.isAttacking = false;
    }

    checkCharacterPosition() {
        if (this.world) {
            const character = this.world.character;
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

