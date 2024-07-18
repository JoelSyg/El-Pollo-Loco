class Cloud extends MovableObject {
    static existingClouds = [];
    y = 20;
    height = 250;
    width = 500;
    speed = 0.2;

    IMAGES_CLOUDS = [
        './img/5_background/layers/4_clouds/1.png',
        './img/5_background/layers/4_clouds/2.png',
    ]

    constructor(){
        super();
        this.loadImages(this.IMAGES_CLOUDS);

        // Zufällig eines der Bilder auswählen
        let randomImage = this.IMAGES_CLOUDS[Math.floor(Math.random() * this.IMAGES_CLOUDS.length)];
        this.loadImage(randomImage);

        this.x = this.generateValidX();
        Cloud.existingClouds.push(this.x);

        this.animate();
    }

    generateValidX() {
        let x;
        let isValid;
        do {
            x = Math.random() * 6200 - 200;  // Bereich von -200 bis 6000
            isValid = Cloud.existingClouds.every(existingX => Math.abs(existingX - x) >= 350);
        } while (!isValid);
        return x;
    }

    animate() {
        addInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
