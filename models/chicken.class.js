class Chicken extends MovableObject{
    y = 360;
    height = 60;
    width = 100;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    
    IMAGES_WALKING = [
        '/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]

    constructor(){
        super().loadImage('/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.25 + Math.random() * 0.45;

        this.animate();
    }


    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

}