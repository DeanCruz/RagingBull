class Boxer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        // Creating a container for the boxer and fists
        this.container = this.scene.add.container(x, y);
        this.container.setSize(this.width, this.height);
    
        // Track movement
        this.moveSpeed = 2;
        this.velX = 0; // velocity in the X direction
        this.velY = 0; // velocity in the Y direction
    
        this.leftFist = this.scene.add.circle(20, -this.displayHeight / 2, 8, 0xFF0000).setOrigin(.9, .9);
        this.rightFist = this.scene.add.circle(40, -this.displayHeight / 2, 8, 0xFF0000).setOrigin(.5, 1.2);

        // Boxer states
        this.punchingstate = 'none';
        this.leftpunching = false;
        this.rightpunching = false;
        this.rotation = 0;
        this.health = 100;
        this.punchSoundPlaying = false;
        this.swingSoundPlaying = false;
    
        // Add fists to container
        this.container.add([this, this.leftFist, this.rightFist]);

        scene.add.existing(this);
        scene.add.existing(this.leftFist);
        scene.add.existing(this.rightFist);

        // Raging Bull ability
        this.rage = false;
        this.hasUsedRage = false;
    }

    update(pointer, npcBoxer){
        // Rotate boxer to face towards mouse pointer with a 45-degree offset
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          pointer.x,
          pointer.y
        );
        const rotationAngle = angle + Math.PI / 2 + Math.PI / 4;
        this.setRotation(rotationAngle);

        // Update the positions and rotations of the fists relative to the boxer
        const distance = this.displayWidth / 2;
      
        // update left fist
        if (!this.leftpunching) {
          const leftFistOffset = Math.PI / 2 + Math.PI / 4;
          const leftFistAngle = rotationAngle + leftFistOffset;
          const leftFistX = this.x + Math.cos(leftFistAngle) * distance;
          const leftFistY = this.y + Math.sin(leftFistAngle) * distance;
          this.leftFist.setPosition(leftFistX, leftFistY);
          this.leftFist.setRotation(rotationAngle);
        }
        // update right fist
        if (!this.rightpunching) {
          const rightFistOffset = Math.PI / 2 - Math.PI / 4;
          const rightFistAngle = rotationAngle + rightFistOffset;
          const rightFistX = this.x + Math.cos(rightFistAngle) * distance;
          const rightFistY = this.y + Math.sin(rightFistAngle) * distance;
          this.rightFist.setPosition(rightFistX, rightFistY);
          this.rightFist.setRotation(rotationAngle);
      }

      // detect if sound is playing
      const isPunchSoundPlaying = this.scene.sound.sounds.some(
        (sound) => sound.key === 'punch1' || sound.key === 'punch2' || sound.key === 'punch3' || sound.key === 'punch4'
      );
      const isSwingSoundPlaying = this.scene.sound.sounds.some(
        (sound) => sound.key === 'swing1' || sound.key === 'swing2'
      );      
      // set sound state
      if (isPunchSoundPlaying) {
        this.punchSoundPlaying = true;
      } else {
        this.punchSoundPlaying = false;
      }
      if (isSwingSoundPlaying) {
        this.punchSoundPlaying = true;
      } else {
        this.punchSoundPlaying = false;
      }

      // Collision detection and resolution
      const npcBody = new Phaser.Geom.Rectangle(npcBoxer.x, npcBoxer.y, npcBoxer.width, npcBoxer.height);

      // Check for fist collision with body
      // left fist collision
      if (Phaser.Geom.Intersects.CircleToRectangle(this.leftFist, npcBody)) {
        if (this.punchingstate == 'lefthook')
        {
            if (!this.punchSoundPlaying) {
                this.scene.sound.play('punch3');
            }
            if(this.rage){
                npcBoxer.health -= 1.2;
            }
            else{
                npcBoxer.health -= .6;
            }
            
        }
        else{
            if (!this.punchSoundPlaying) {
                this.scene.sound.play('punch1');
            }
            if(this.rage){
                npcBoxer.health -= .4;
            }
            else{
                npcBoxer.health -= .2;
            }
        }
      }
      // right fist collision
      if (Phaser.Geom.Intersects.CircleToRectangle(this.rightFist, npcBody)) {
        if (this.punchingstate == 'righthook')
        {
            if (!this.punchSoundPlaying) {
                this.scene.sound.play('punch4');
            }
            if(this.rage){
                
                npcBoxer.health -= 1.8;
            }
            else{
                npcBoxer.health -= .9;
            }
        }
        else{
            if (!this.punchSoundPlaying) {
                this.scene.sound.play('punch2');
            }
            if(this.rage){
                npcBoxer.health -= .6;
            }
            else{
                npcBoxer.health -= .3;
            }
        }
      }
    }

    // set boxer rotation
    setRotation(angle) {
        super.setRotation(angle);
        this.rotation = angle;
    }

    // reset boxer
    reset() {
        this.x = game.config.width/2;
        this.y = game.config.height/1.2;
    }

    // Left Jab
    punchLeft(pointer) {
        this.punchingstate = 'jab';
        const punchDistance = 33;

        // Play swing1 sound
        if (!this.swingSoundPlaying) {
            this.scene.sound.play('swing1');
        }

        // Calculate the angle between the boxer and the pointer
        const angle = Phaser.Math.Angle.Between(this.leftFist.x, this.leftFist.y, pointer.x, pointer.y);
      
        // Calculate target position
        let targetX = this.leftFist.x + punchDistance * Math.cos(angle) + this.velX*8;
        let targetY = this.leftFist.y + punchDistance * Math.sin(angle) + this.velY*8;

        // Move fist forward
        this.scene.tweens.add({
          targets: this.leftFist,
          x: targetX,
          y: targetY,
          duration: 80, // Punch duration
          ease: 'Power2', 
          yoyo: true, // Move fist back
          onComplete: () => {
            this.leftpunching = false; // Reset leftpunching when the animation is complete
          }
        });
      }

      // Right Cross
      punchRight(pointer) {
        this.punchingstate = 'cross';

        // Play swing2 sound
        if (!this.swingSoundPlaying) {
            this.scene.sound.play('swing2');
        }

        if (!pointer || typeof pointer.x === 'undefined' || typeof pointer.y === 'undefined') {
            console.error('Invalid pointer object:', pointer);
            return;
          }
        const punchDistance = 44;
        var pointerx = 0;
      
        // Calculate the angle between the boxer and the pointer
        if (pointer.y < this.rightFist.y){
            pointerx = pointer.x - 40;
        }
        else{
            pointerx = pointer.x + 40;
        }
        const angle = Phaser.Math.Angle.Between(this.rightFist.x, this.rightFist.y, pointerx, pointer.y);
      
        // Calculate target position
        let targetX = this.rightFist.x + punchDistance * Math.cos(angle) + this.velX*8;
        let targetY = this.rightFist.y + punchDistance * Math.sin(angle) + this.velY*8;
      
        // Move fist forward
        this.scene.tweens.add({
          targets: this.rightFist,
          x: targetX,
          y: targetY,
          duration: 110, // Punch duration
          ease: 'Power2', 
          yoyo: true, // Move fist back
          onComplete: () => this.rightpunching = false // Reset left punching when the animation is complete
        });
      }
    
      // Left hook
      hookLeft(pointer) {
        this.punchingstate = 'lefthook';

        // Play swing1 sound
        if (!this.swingSoundPlaying) {
            this.scene.sound.play('swing1');
        }

        // Initial target
        let targetIx = this.leftFist.x, targetIy = this.leftFist.y;
        // Final target angle
        let targetFx = this.rightFist.x, targetFy = this.rightFist.y;
        // When facing up
        if (this.rotation < 0.75 && this.rotation > -0.75){
            targetIx = this.leftFist.x - 25;
            targetFy = this.rightFist.y - 99;
        }

        // When facing right
        if (this.rotation >= 0.75 && this.rotation < 2.25){
            targetIy = this.leftFist.y - 25;
            targetFx = this.rightFist.x + 99;
        }

        // When facing down
        if (this.rotation >= 2.25 || this.rotation < -2.25){
            targetIx = this.leftFist.x + 25;
            targetFy = this.rightFist.y + 99;
        }

        // When facing left
        if (this.rotation <= -0.75 && this.rotation > -2.25){
            targetIy = this.leftFist.y + 25;
            targetFx = this.rightFist.x - 99;
        }

        // Calculate the angle between the boxer and the pointer
        const angle = Phaser.Math.Angle.Between(this.leftFist.x, this.leftFist.y, targetFx, targetFy);

        // Calculate target position
        let targetX = this.leftFist.x + Math.cos(angle) * 30 + this.velX*8;
        let targetY = this.leftFist.y + Math.sin(angle) * 30 + this.velY*8;


        // First tween to move fist up
        this.scene.tweens.add({
            targets: this.leftFist,
            x: targetIx,
            y: targetIy,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                // Second tween to move fist towards the pointer
                this.scene.tweens.add({
                    targets: this.leftFist,
                    x: targetX,
                    y: targetY,
                    duration: 100,
                    ease: 'Power2',
                    yoyo: true, // Move fist back
                    onComplete: () => {
                        this.leftpunching = false;
                    }
                });
            }
        });
    }    
    
    // Right hook
    hookRight(pointer) {
        this.punchingstate = 'righthook';

        // Play swing2 sound
        if (!this.swingSoundPlaying) {
            this.scene.sound.play('swing2');
        }

        // Initial target
        let targetIx = this.rightFist.x, targetIy = this.rightFist.y;
        // Final target angle
        let targetFx = this.leftFist.x, targetFy = this.leftFist.y;
        // When facing up
        if (this.rotation < 0.75 && this.rotation > -0.75){
            targetIx = this.rightFist.x + 25;
            targetFy = this.leftFist.y - 33;
        }

        // When facing right
        if (this.rotation >= 0.75 && this.rotation < 2.25){
            targetIy = this.rightFist.y + 25;
            targetFx = this.leftFist.x + 33;
        }

        // When facing down
        if (this.rotation >= 2.25 || this.rotation < -2.25){
            targetIx = this.rightFist.x - 25;
            targetFy = this.leftFist.y + 33;
        }

        // When facing left
        if (this.rotation <= -0.75 && this.rotation > -2.25){
            targetIy = this.rightFist.y - 25;
            targetFx = this.leftFist.x - 33;
        }

        // Calculate the angle between the boxer and the pointer
        const angle = Phaser.Math.Angle.Between(this.rightFist.x, this.rightFist.y, targetFx, targetFy);

        // Calculate target position
        let targetX = this.rightFist.x + Math.cos(angle) * 30 + this.velX*8;
        let targetY = this.rightFist.y + Math.sin(angle) * 30 + this.velY*8;


        // First tween to move fist up
        this.scene.tweens.add({
            targets: this.rightFist,
            x: targetIx,
            y: targetIy,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                // Second tween to move fist towards the pointer
                this.scene.tweens.add({
                    targets: this.rightFist,
                    x: targetX,
                    y: targetY,
                    duration: 100,
                    ease: 'Power2',
                    yoyo: true, // Move fist back
                    onComplete: () => {
                        this.rightpunching = false;
                    }
                });
            }
        });
    }    
    RagingBull() {
        if (!this.hasUsedRage) {
            // Save the original scale for later
            this.originalScale = { x: this.scaleX, y: this.scaleY };
    
            // Scales the boxer 1.1X bigger
            this.setScale(this.scaleX * 1.3, this.scaleY * 1.3);
            
            // Activates the rage toggle
            this.rage = true;
    
            // Make sure the RagingBull can only be used 2 times
            this.hasUsedRage = true;
    
            // Use Phaser's delayedCall to revert the changes after 5 seconds
            this.scene.time.delayedCall(5000, () => {
                this.setScale(this.originalScale.x, this.originalScale.y);
                this.rage = false;
            });
        } 
    }
}