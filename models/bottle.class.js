class Bottle extends MovableObject {
    
    y = 360;
    height = 60;
    width = 100;

    offset = {
        top: 8,
        bottom: 8,
        left: 30,
        right: 20
    }

    BOTTLE_ON_GROUND = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    pickup_sound = new Audio ('./audio/item_pickup.ogg');

    constructor() {
        super();
        this.x = 500 + Math.random() * (4600 - 1500);
        this.loadImage(this.getRandomImage());
    }

    getRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.BOTTLE_ON_GROUND.length);
        return this.BOTTLE_ON_GROUND[randomIndex];
    }

}
