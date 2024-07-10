class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthStatusBar = new HealthStatusBar();
    bottlesStatutsbar = new BottlesStatusBar();
    throwableObjects = [];
    collectableObjects = [];

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
        }, 200);
    }

    collectBottle(bottle) {
        this.character.bottles += 1;
        this.bottlesStatutsbar.setPercentage(this.character.bottles * 20); // Update Bottlestatusbar
        
        // remove bottle
        const index = this.level.collectableObjects.indexOf(bottle);
        if (index > -1) {
            this.level.collectableObjects.splice(index, 1);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach( (enemy) => {
            if(this.character.isColliding(enemy) ) {
                 this.character.hit();
                 this.healthStatusBar.setPercentage(this.character.health);
                 console.log(this.character.health);
            }
         });

         this.level.collectableObjects.forEach( (bottle) => {
            if(this.character.isColliding(bottle) ) {
                 this.collectBottle(bottle);
            }
         });
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) { // checks if character has min. 1 bottle
            const direction = this.character.otherDirection ? 'left' : 'right'; 
            let bottle = new ThrowableObject(this.character.x + (direction === 'right' ? 100 : -100), this.character.y + 100, direction);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 1; // Removes a bottle after throwing
            this.bottlesStatutsbar.setPercentage(this.character.bottles * 20); // Update BottlesStatusbar
        }
    }

 
    


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        // Space for fixed objects
        this.addToMap(this.healthStatusBar);
        this.addToMap(this.bottlesStatutsbar);
        //
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.collectableObjects);
    

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