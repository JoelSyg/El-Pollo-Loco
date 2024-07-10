class CollectableObject extends MovableObject {
    
    y = 360;
    height = 60;
    width = 100;

    offset = {
        top: 0,
        bottom: 0,
        left: 30,
        right: 30
    }

    BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    constructor() {
        super();
        this.x = 300 + Math.random() * 1200;
        this.loadImage(this.getRandomImage());
    }

    getRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.BOTTLE_ON_GROUND.length);
        return this.BOTTLE_ON_GROUND[randomIndex];
    }

}
