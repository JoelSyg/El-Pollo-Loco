class ThrowableObject extends MovableObject {

    IMAGES_ROTATING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    break_sound = new Audio ('audio/break.mp3')
    throw_sound = new Audio ('audio/throw.mp3')
    splash_sound = new Audio ('audio/splash.mp3')

    constructor(x, y, direction) {
        super().loadImage(this.IMAGES_ROTATING[3]);
        this.loadImages(this.IMAGES_ROTATING);
        this.loadImages(this.IMAGES_SPLASH);
        this.direction = direction;
        this.height = 60;
        this.width = 50;
        // Adjust the x position based on the direction
        this.x = direction === 'right' ? x - 30 : x + 80;
        this.y = y;
        this.throw();
        this.animate(this.IMAGES_ROTATING, 150);
        this.hasHit = false; // Prüft ob die bottle schon gehittet hat
    }
    
    throw() {
        this.throw_sound.play();
        this.speedY = 20;
        this.applyGravity();
        const speedX = this.direction === 'left' ? -10 : 10; // Adjust speedX based on direction
        this.moveInterval = setInterval(() => {
            this.x += speedX;
        }, 25);
    }

    animate(path, time){
        this.animateInterval = setInterval(() => {
            this.playAnimation(path);
        }, time);
    }

    bottleSplash() {
        // this.break_sound.play();
        // this.splash_sound.play();
        this.speedY = 0;
        this.acceleration = 0;
        clearInterval(this.moveInterval); // Stop moving
        clearInterval(this.animateInterval); // Stop rotating
        this.animate(this.IMAGES_SPLASH, 100)
    }
}
