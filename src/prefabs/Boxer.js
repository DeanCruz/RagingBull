class Boxer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.moveSpeed = 2;

        this.leftFist = new Phaser.GameObjects.Ellipse(scene, 0, 0, 10, 10, 0x0000ff, 1);
        this.rightFist = new Phaser.GameObjects.Ellipse(scene, 0, 0, 10, 10, 0x0000ff, 1);
        scene.add.existing(this.leftFist);
        scene.add.existing(this.rightFist);
    }

    setRotation(angle) {
        super.setRotation(angle);
    }

    reset() {
        this.x = game.config.width/2;
        this.y = game.config.height/1.2;
    }
}
