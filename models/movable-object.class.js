class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    speedY = 1;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    applyGravity(){
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        if (this instanceof ThrowableObject) { // Throwable object should always fall
            return true;
        } else {
        return this.y < 180;
        }
    }

    
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
        this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
        this.x + this.offset.left < mo.x + mo.width - mo.offset.right&&
        this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit() {
        this.health -= 5;
        if(this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 0.8;
    }

    isDead() {
        return this.health == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    jump(){
        this.speedY = 30;
    }
}

