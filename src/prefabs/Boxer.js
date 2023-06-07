class Boxer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        

        // Track movement
        this.moveSpeed = 2;
        this.velX = 0; // velocity in the X direction
        this.velY = 0; // velocity in the Y direction

        this.leftFist = this.scene.add.circle(20, -this.displayHeight / 2, 8, 0xFF0000).setOrigin(.9, .9);
        this.rightFist = this.scene.add.circle(40, -this.displayHeight / 2, 8, 0xFF0000).setOrigin(.5, 1.2);
        this.leftpunching = false;
        this.rightpunching = false;

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
    punchLeft(pointer) {
        const punchDistance = 30;
      
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
          onComplete: () => this.leftpunching = false // Reset leftpunching when the animation is complete
        });
      }
      punchRight(pointer) {
        const punchDistance = 40;
        var pointerx = 0;
      
        // Calculate the angle between the boxer and the pointer
        if (pointer.y < this.rightFist.y){
            pointerx = pointer.x - 40;
        }
        else{
            pointerx = pointer.x + 40;
        }
        const angle = Phaser.Math.Angle.Between(this.rightFist.x, this.rightFist.y, pointerx, pointer.y);

        console.log(pointer.x);
        console.log(pointer.y);
      
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
          onComplete: () => this.rightpunching = false // Reset leftpunching when the animation is complete
        });
      }
         
    hookLeft() {
        if (!this.leftpunching) {
          this.leftpunching = true;
      
          const punchDistance = 10;
          const angle = this.rotation + Math.PI / 4;
          const targetX = this.x + Math.cos(angle) * punchDistance;
          const targetY = this.y + Math.sin(angle) * punchDistance;
      
          this.scene.tweens.add({
            targets: this.leftFist,
            x: targetX,
            y: targetY,
            duration: 100,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
              this.leftpunching = false;
              console.log("punch animation complete");
            }
          });
        }
      }
      hookLeft(pointer) {
        if (!this.leftpunching) {
            this.leftpunching = true;
    
            const punchDistance = 50;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
    
            // We will move the fist from its current position to its current position plus punchDistance in the direction of the angle
            const startX = this.leftFist.x;
            const startY = this.leftFist.y;
            const endX = startX + punchDistance * Math.cos(angle) + this.velX*8;
            const endY = startY + punchDistance * Math.sin(angle) + this.velY*8;
    
            // We will use this object to hold our custom property
            let values = { arcParameter: 0 };
    
            this.scene.tweens.add({
                targets: values,
                arcParameter: 1,
                duration: 100,
                ease: 'Linear',
                onUpdate: () => {
                    // Calculate the new position based on the arcParameter
                    this.leftFist.x = startX + values.arcParameter * (endX - startX);
                    this.leftFist.y = startY + values.arcParameter * (endY - startY);
                },
                onComplete: () => {
                    this.leftpunching = false;
                    console.log("Hook animation complete");
                }
            });
        }
    }
    
    hookRight(pointer) {
        if (!this.rightpunching) {
            this.rightpunching = true;
    
            const punchDistance = 50;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
    
            // We will move the fist from its current position to its current position plus punchDistance in the direction of the angle
            const startX = this.rightFist.x;
            const startY = this.rightFist.y;
            const endX = startX + punchDistance * Math.cos(angle) + this.velX*8;
            const endY = startY + punchDistance * Math.sin(angle) + this.velY*8;
    
            // We will use this object to hold our custom property
            let values = { arcParameter: 0 };
    
            this.scene.tweens.add({
                targets: values,
                arcParameter: 1,
                duration: 100,
                ease: 'Linear',
                onUpdate: () => {
                    // Calculate the new position based on the arcParameter
                    this.rightFist.x = startX + values.arcParameter * (endX - startX);
                    this.rightFist.y = startY + values.arcParameter * (endY - startY);
                },
                onComplete: () => {
                    this.rightpunching = false;
                    console.log("Hook animation complete");
                }
            });
        }
    }    
}