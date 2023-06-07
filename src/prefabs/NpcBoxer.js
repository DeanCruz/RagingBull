class NPCBoxer extends Boxer {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // Initialize NPC movement state
      this.moveState = 'idle';
  
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
  
      if (rand < 0.5) {
        this.moveState = 'forward';
      } else {
        this.moveState = 'backward';
      }
  
      // Set a random duration for this movement state
      this.moveTimer.reset({
        delay: Phaser.Math.Between(500, 2000), // between 0.5 and 2 seconds
        callback: this.decideMove,
        callbackScope: this
      });
    }
  
    update() {
      super.update();
  
      let speed = 2;
  
      // Get the direction towards the player
      let dirX = (p1boxer.x - this.x);
      let dirY = (p1boxer.y - this.y);
  
      // Normalize the direction
      let len = Math.sqrt(dirX * dirX + dirY * dirY);
      dirX /= len;
      dirY /= len;
  
      // Apply the movement state
      if (this.moveState == 'forward') {
        this.x += dirX * speed;
        this.y += dirY * speed;
      } else if (this.moveState == 'backward') {
        this.x -= dirX * speed;
        this.y -= dirY * speed;
      }
    }
  }
  