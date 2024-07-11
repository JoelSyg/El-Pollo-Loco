class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    speedY = 1;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;

    isBoss = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    // applyGravity(){
    //     setInterval(() => {
    //         if (this.isAboveGround() || this.speedY > 0) {
    //             this.y -= this.speedY;
    //             this.speedY -= this.acceleration;
    //         }
    //     }, 1000 / 25);
    // }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;  // Sicherstellen, dass die Geschwindigkeit null ist, wenn der Charakter auf dem Boden ist
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

    
    // isColliding(mo) {
    //     return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
    //     this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
    //     this.x + this.offset.left < mo.x + mo.width - mo.offset.right&&
    //     this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    // }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }


    isCollidingFromAbove(mo) {
        if (mo.isBoss) {
            return false;  // Auf den Endboss kann man nicht springen
        }
    
        const characterBottom = this.y + this.height - this.offset.bottom;
        const enemyBottom = mo.y + mo.height - mo.offset.bottom;
    
        return characterBottom < enemyBottom && this.speedY < 0;  // Charakter fällt nach unten, Charakter ist über dem Feind
    }
    

    hit() {
        this.health -= 1;
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

