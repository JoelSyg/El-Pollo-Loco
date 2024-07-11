class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;




    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
     }

     drawFrame(ctx){

        if(this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss || this instanceof Bottle || this instanceof Coin) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }

    drawInnerFrame(ctx){

        if(this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss || this instanceof Bottle || this instanceof Coin) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "red";
        ctx.rect(
            this.x + this.offset.left,         // x-Position um left-Offset verschieben
            this.y + this.offset.top,          // y-Position um top-Offset verschieben
            this.width - this.offset.left - this.offset.right, // Breite um left und right Offsets reduzieren
            this.height - this.offset.top - this.offset.bottom // Höhe um top und bottom Offsets reduzieren
        );
        
        ctx.stroke();
        }
    }

     loadImages(arr) {
        arr.forEach((path) =>{

            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
    });
    }
}