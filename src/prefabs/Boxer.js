// Boxer prefab
class Boxer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureKey) {
        this.sprite = scene.physics.add.sprite(x, y, textureKey);
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        this.moveSpeed = 2;         // pixels per frame
    }
    setRotation(angle) {
        this.sprite.setRotation(angle);
    }
    // reset boxer
    reset() {
        this.x = game.config.width/2;
        this.y = game.config.height/1.2;
    }
}