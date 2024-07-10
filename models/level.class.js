class Level {
    enemies;
    clouds;
    collectableObjects;
    backgroundObjects;
    level_end_x = 700 * 3 - 200;

    constructor(enemies, clouds, collectableObjects, backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.collectableObjects = collectableObjects;
        this.backgroundObjects = backgroundObjects;
    }
}