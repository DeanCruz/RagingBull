class NPCBoxer extends Boxer {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
        // Initialize NPC movement state
        this.moveState = 'idle';

        this.leftFist = this.scene.add.circle(20, -this.displayHeight / 2, 8, 0x0000FF).setOrigin(.9, .9);
        this.rightFist = this.scene.add.circle(40, -this.displayHeight / 2, 8, 0x0000FF).setOrigin(.5, 1.2);

        
  
      // Initialize NPC move timer
      this.moveTimer = scene.time.addEvent({
        delay: 1000, // 1 second delay before first movement
        callback: this.decideMove,
        callbackScope: this,
        loop: true
      });
    }
  
    decideMove() {
      // Decide a new movement state for the NPC
      let rand = Math.random();
  
      if (rand < 0.25) {
        this.moveState = 'forward';
      } 
      else if (rand < 0.5) {
        this.moveState = 'backward';
      }
      else if (rand < 0.75) {
        this.moveState = 'left';
      }
      else {
        this.moveState = 'right';
      }
  
      // Set a random duration for this movement state
      this.moveTimer.reset({
        delay: Phaser.Math.Between(500, 2000), // between 0.5 and 2 seconds
        callback: this.decideMove,
        callbackScope: this
      });
    }
  
    update(p1Boxer) {
      let speed = 2;
  
      // Get the direction towards the player
      let dirX = (p1Boxer.x - this.x);
      let dirY = (p1Boxer.y - this.y);
  
      // Normalize the direction
      let len = Math.sqrt(dirX * dirX + dirY * dirY);
      dirX /= len;
      dirY /= len;
  
      // Apply the movement state
      console.log(len);
      if (this.moveState == 'forward' && len > 20) {
        this.x += dirX * speed;
        this.y += dirY * speed;
      } else if (this.moveState == 'backward') {
        this.x -= dirX * speed;
        this.y -= dirY * speed;
      } else if (this.moveState == 'left'){
        this.x += dirX * speed;
      } else {
        this.x -= dirX * speed;
      }
      // Rotate NPC to face towards the player boxer with a 45-degree offset
        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            p1Boxer.x,
            p1Boxer.y
        );
        const rotationAngle = angle + Math.PI / 2 + Math.PI / 4;
        this.setRotation(rotationAngle);

        // Update the positions and rotations of the fists relative to the NPC boxer
        const distance = this.displayWidth / 2;

        if (!this.leftpunching) {
            const leftFistOffset = Math.PI / 2 + Math.PI / 4;
            const leftFistAngle = rotationAngle + leftFistOffset;
            const leftFistX = this.x + Math.cos(leftFistAngle) * distance;
            const leftFistY = this.y + Math.sin(leftFistAngle) * distance;
            this.leftFist.setPosition(leftFistX, leftFistY);
            this.leftFist.setRotation(rotationAngle);
        }

        if (!this.rightpunching) {
            const rightFistOffset = Math.PI / 2 - Math.PI / 4;
            const rightFistAngle = rotationAngle + rightFistOffset;
            const rightFistX = this.x + Math.cos(rightFistAngle) * distance;
            const rightFistY = this.y + Math.sin(rightFistAngle) * distance;
            this.rightFist.setPosition(rightFistX, rightFistY);
            this.rightFist.setRotation(rotationAngle);
        }
    }
  }

  
  