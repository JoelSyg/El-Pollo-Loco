class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthStatusBar = new HealthStatusBar();
    bottlesStatusBar = new BottlesStatusBar();
    coinsStatusBar = new CoinsStatusBar();
    throwableObjects = [];
    lastThrowTime = 0; // Initialize last throw time

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 50);
    }

    collectBottle(bottle) {
        if (this.character.bottles < 5) {
        this.character.bottles += 1;
        this.bottlesStatusBar.setPercentage(this.character.bottles * 20); // Update Bottlestatusbar
        
        // remove bottle
        const index = this.level.bottles.indexOf(bottle);
        if (index > -1) {
            this.level.bottles.splice(index, 1);
        }
    }
    }

    collectCoin(coin) {
        this.character.coins += 1;
        this.coinsStatusBar.setPercentage(this.character.coins * 10); // Update Coinstatusbar
        
        // remove coin
        const index = this.level.coins.indexOf(coin);
        if (index > -1) {
            this.level.coins.splice(index, 1);
        }
    }


    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) & enemy.isAlive) { // Auf Kollision prüfen und prüfen ob enemy noch alive ist
                if (this.character.isCollidingFromAbove(enemy)) {
                    enemy.kill(enemy);  // enemy töten
                    console.log('Chicken getötet');
                    this.removeDeadEnemy(enemy); // dead enemy removen

                } else {
                    this.character.hit();  // Charakter nimmt Schaden
                    this.healthStatusBar.setPercentage(this.character.health);
                    console.log(this.character.health);
                }
            }
        });

        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(bottle);
            }
        });

        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });

        this.throwableObjects.forEach((thrownBottle) => {
            if (!thrownBottle.hasHit && thrownBottle.y > 355) {
                thrownBottle.bottleSplash();
                thrownBottle.hasHit = true;
                this.removeThrownBottle(thrownBottle);
                console.log(thrownBottle.y, 'boden getroffen');
            } else {
                this.level.enemies.forEach((enemy) => {
                    if (!thrownBottle.hasHit && thrownBottle.isColliding(enemy)) {
                        // Handle collision
                        console.log('Bottle hit enemy');
                        enemy.hitByBottle();
                        thrownBottle.bottleSplash();
                        thrownBottle.hasHit = true;
                        this.removeThrownBottle(thrownBottle);
                        if (!enemy.isAlive) {
                            this.removeDeadEnemy(enemy);
                        }
                    }
                });
            }
        });
        
    }

    removeThrownBottle(thrownBottle) {
        setTimeout(() => {
            const index = this.throwableObjects.indexOf(thrownBottle);
            if (index > -1) {
                this.throwableObjects.splice(index, 1);
            }
        }, 500);
    }

    removeDeadEnemy(enemy) {
        setTimeout(() => {
            const index = this.level.enemies.indexOf(enemy);
            if (index > -1) {
                this.level.enemies.splice(index, 1);
            }
        }, 500);
    }


    // checkCollisions() {
    //     this.level.enemies.forEach( (enemy) => {
    //         if(this.character.isColliding(enemy) ) {
    //              this.character.hit();
    //              this.healthStatusBar.setPercentage(this.character.health);
    //              console.log(this.character.health);
    //         }
    //      });

        //  this.level.bottles.forEach( (bottle) => {
        //     if(this.character.isColliding(bottle) ) {
        //          this.collectBottle(bottle);
        //     }
        //  });

        //  this.level.coins.forEach( (coin) => {
        //     if(this.character.isColliding(coin) ) {
        //          this.collectCoin(coin);
        //     }
        //  });
    // }
    

    // checkThrowObjects() {
    //     if (this.keyboard.D && this.character.bottles > 0) { // checks if character has min. 1 bottle
    //         const direction = this.character.otherDirection ? 'left' : 'right'; 
    //         let bottle = new ThrowableObject(this.character.x + (direction === 'right' ? 100 : -100), this.character.y + 100, direction);
    //         this.throwableObjects.push(bottle);
    //         this.character.bottles -= 1; // Removes a bottle after throwing
    //         this.bottlesStatusBar.setPercentage(this.character.bottles * 20); // Update BottlesStatusbar
    //     }
    // }

    checkThrowObjects() {
        const currentTime = Date.now();
        if (this.keyboard.D && this.character.bottles > 0 && currentTime - this.lastThrowTime >= 300) { // checks if character has min. 1 bottle and 300 ms have passed
            const direction = this.character.otherDirection ? 'left' : 'right';
            let bottle = new ThrowableObject(this.character.x + (direction === 'right' ? 100 : -100), this.character.y + 100, direction);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 1; // Removes a bottle after throwing
            this.bottlesStatusBar.setPercentage(this.character.bottles * 20); // Update BottlesStatusbar
            this.lastThrowTime = currentTime; // Update the last throw time
        }
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);
        // Space for fixed objects
        this.addToMap(this.healthStatusBar);
        this.addToMap(this.coinsStatusBar);
        this.addToMap(this.bottlesStatusBar);
        //
        this.ctx.translate(this.camera_x, 0);

        this.ctx.translate(-this.camera_x, 0);

        // // Draw() wird immer wieder aufgerufe
        requestAnimationFrame(() => {
            this.draw();
        });

    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if(mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        mo.drawInnerFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}