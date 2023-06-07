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
    hookLeft() {
        console.log("punchLeft called"); // Log the call to punchLeft

        const punchDistance = 10;

        // Calculate target position
        let targetX = this.x + punchDistance * Math.cos(this.rotation - Math.PI/2);
        let targetY = this.y + punchDistance * Math.sin(this.rotation - Math.PI/2);

        console.log(`leftFist current position: (${this.leftFist.x}, ${this.leftFist.y})`);  // Log the current position
        console.log(`leftFist target position: (${targetX}, ${targetY})`);  // Log the target position

        // Indicate punch is in progress
        this.leftpunching = true;

        // Move fist forward
        this.scene.tweens.add({
            targets: this.leftFist,
            x: targetX,
            y: targetY,
            duration: 100, // Punch duration
            ease: 'Power2', 
            yoyo: true, // Move fist back
            onComplete: () => { // add this function
                this.leftpunching = false;
                console.log("punch animation complete"); // Log when the punch animation completes
            }
        });
    }
    hookRight() {
        console.log("punchRight called"); // Log the call to punchRight

        const punchDistance = 10;

        // Calculate target position
        let targetX = this.x + punchDistance * Math.cos(this.rotation - Math.PI/2);
        let targetY = this.y + punchDistance * Math.sin(this.rotation - Math.PI/2);

        console.log(`rightFist current position: (${this.rightFist.x}, ${this.rightFist.y})`);  // Log the current position
        console.log(`rightFist target position: (${targetX}, ${targetY})`);  // Log the target position

        // Indicate punch is in progress
        this.rightpunching = true;

        // Move fist forward
        this.scene.tweens.add({
            targets: this.rightFist,
            x: targetX,
            y: targetY,
            duration: 100, // Punch duration
            ease: 'Power2', 
            yoyo: true, // Move fist back
            onComplete: () => { // add this function
                this.rightpunching = false;
                console.log("punch animation complete"); // Log when the punch animation completes
            }
        });
    }
    punchLeft() {
        console.log("punchLeft called");
    
        const punchDistance = 10;
    
        // Calculate target position relative to the boxer's current position
        let targetX = this.leftFist.x + punchDistance * Math.cos(this.rotation - Math.PI / 2);
        let targetY = this.leftFist.y + punchDistance * Math.sin(this.rotation - Math.PI / 2);
    
        console.log(`leftFist current position: (${this.leftFist.x}, ${this.leftFist.y})`);
        console.log(`leftFist target position: (${targetX}, ${targetY})`);
    
        this.leftpunching = true;
    
        // Move fist forward relative to the boxer's current position
        this.scene.tweens.add({
          targets: this.leftFist,
          x: '+=' + punchDistance * Math.cos(this.rotation - Math.PI / 2),
          y: '+=' + punchDistance * Math.sin(this.rotation - Math.PI / 2),
          duration: 100,
          ease: 'Power2',
          yoyo: true,
          onComplete: () => {
            this.leftpunching = false;
            console.log("punch animation complete");
          }
        });
      }
      punchRight() {
        console.log("punchRight called");
    
        const punchDistance = 10;
    
        // Calculate target position relative to the boxer's current position
        let targetX = this.rightFist.x + punchDistance * Math.cos(this.rotation - Math.PI / 2);
        let targetY = this.rightFist.y + punchDistance * Math.sin(this.rotation - Math.PI / 2);
    
        console.log(`rightFist current position: (${this.rightFist.x}, ${this.rightFist.y})`);
        console.log(`rightFist target position: (${targetX}, ${targetY})`);
    
        this.rightpunching = true;
    
        // Move fist forward relative to the boxer's current position
        this.scene.tweens.add({
          targets: this.rightFist,
          x: '+=' + punchDistance * Math.cos(this.rotation - Math.PI / 2),
          y: '+=' + punchDistance * Math.sin(this.rotation - Math.PI / 2),
          duration: 100,
          ease: 'Power2',
          yoyo: true,
          onComplete: () => {
            this.rightpunching = false;
            console.log("punch animation complete");
          }
        });
      }
}