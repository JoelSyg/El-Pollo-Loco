class BossHealthStatusBar extends StatusBar {
    visible = false; // Initially invisible

    IMAGES = [
        './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 5;
        this.width = 200;
        this.height = 55;
        this.setPercentage(100);
    }

    setVisible(isVisible) {
        this.visible = isVisible;
    }

    draw(ctx) {
        if (this.visible) {
            super.draw(ctx);
        }
    }
}
