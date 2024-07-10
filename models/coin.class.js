class Coin extends MovableObject {
    
 

    offset = {
        top: 0,
        bottom: 0,
        left: 30,
        right: 30
    }

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ]


    constructor(){
        super().loadImage('img/8_coin/coin_2.png');
        this.loadImages(this.IMAGES_COIN);

        this.x = 200 + Math.random() * 500;
        this.y = 300 - Math.random() * 200;

        this.animate();
    }


    animate() {
        setInterval( () => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }

}

