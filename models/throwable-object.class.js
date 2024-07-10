class ThrowableObject extends MovableObject {


    IMAGES_ROTATING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]


    constructor(x, y, direction) {
        super().loadImage(this.IMAGES_ROTATING[3]);
        this.loadImages(this.IMAGES_ROTATING);
        this.direction = direction;
        this.height = 60;
        this.width = 50;
        // Adjust the x position based on the direction
        this.x = direction === 'right' ? x - 30 : x + 80;
        this.y = y;
        this.throw();
        this.animate();
    }
    

    throw() {
        this.speedY = 30;
        this.applyGravity();
        const speedX = this.direction === 'left' ? -10 : 10; // Adjust speedX based on direction
        setInterval(() => {
            this.x += speedX;
        }, 25);
    }

    animate(){
        setInterval( () => {
            this.playAnimation(this.IMAGES_ROTATING);
        }, 150);
    }
}