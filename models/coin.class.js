class Coin extends MovableObject {
    
 

    offset = {
        top: 45,
        bottom: 45,
        left: 30,
        right: 30
    }

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ]

    collect_sound = new Audio('./audio/coin_collect.wav')
    
    constructor(){
        super().loadImage('./img/8_coin/coin_2.png');
        this.loadImages(this.IMAGES_COIN);

        this.x = 500 + Math.random() * (4600 - 500);
        this.y = 300 - Math.random() * 200;

        this.animate();
    }


    animate() {
        addInterval( () => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }

}

