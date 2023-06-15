class CerdanBoxer extends Boxer {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Initialize NPC movement state
        this.moveState = 'idle';

        this.leftFist = this.scene.add.circle(20, -this.displayHeight / 2, 8, 0x0000FF).setOrigin(0.9, 0.9);
        this.rightFist = this.scene.add.circle(40, -this.displayHeight / 2, 8, 0x0000FF).setOrigin(0.5, 1.2);
        this.health = 100;

        // Initialize NPC move timer
        this.moveTimer = scene.time.addEvent({
            delay: 1000, // 1 second delay before first movement
            callback: this.decideMove,
            callbackScope: this,
            loop: true
        });

        // Initialize NPC punch timer
        this.punchTimer = scene.time.addEvent({
            delay: 1000, // 2 seconds
            callback: this.decidePunch,
            callbackScope: this,
            loop: true
        });
    }

    decideMove() {
        // Decide a new movement state for the NPC
        let rand = Math.random();

        if (rand < 0.25) {
            this.moveState = 'forward';
        } else if (rand < 0.5) {
            this.moveState = 'backward';
        } else if (rand < 0.75) {
            this.moveState = 'left';
        } else {
            this.moveState = 'right';
        }

        // Set a random duration for this movement state
        this.moveTimer.reset({
            delay: Phaser.Math.Between(100, 500), // between 0.1 and 0.5 seconds
            callback: this.decideMove,
            callbackScope: this
        });
    }

    decidePunch(x,y) {
        // Decide which punch to perform
        let rand = Math.random();

        if (rand < 0.5) {
            this.leftpunching = true;
            this.punchLeft(x,y);
        } else {
            this.rightpunching = true;
            this.punchRight(x,y);
        }
    }

    update(p1Boxer) {
        let speed = this.moveSpeed;
    
        // Get the direction towards the player
        let dirX = (p1Boxer.x - this.x);
        let dirY = (p1Boxer.y - this.y);
    
        // Normalize the direction
        let len = Math.sqrt(dirX * dirX + dirY * dirY);
        dirX /= len;
        dirY /= len;
    
        // Check if the NPC is within 15 pixels of p1Boxer
        if (len < 20) {
            // Back up from p1Boxer
            this.x -= dirX * speed;
            this.y -= dirY * speed;
        } else {
            // The position of the center of the ring
            const centerX = this.scene.width / 2;
            const centerY = this.scene.height / 2;
    
            // The radius of the ring
            const ringRadius = 200;
    
            // The distance between the NPC and the center of the ring
            const distFromCenter = Phaser.Math.Distance.Between(this.x, this.y, centerX, centerY);
    
            // If the NPC is near the edge of the ring, direct it back towards the center
            if (distFromCenter > ringRadius - 100) {
                const angleToCenter = Phaser.Math.Angle.Between(this.x, this.y, centerX, centerY);
    
                // Adjust the NPC's position
                this.x += Math.cos(angleToCenter) * speed;
                this.y += Math.sin(angleToCenter) * speed;
            }
    
            // Apply the movement state
            if (this.moveState == 'forward' && len > 30) {
                this.x += dirX * speed;
                this.y += dirY * speed;
            } else if (this.moveState == 'backward') {
                this.x -= dirX * speed;
                this.y -= dirY * speed;
            } else if (this.moveState == 'left') {
                this.x += dirX * speed;
            } else if (this.moveState == 'right') {
                this.x -= dirX * speed;
            }
            
            if (len <= 30 && this.leftpunching == false && this.rightpunching == false) {
                let rand = Math.random();
                if (rand < 0.05) {
                    this.decidePunch(p1Boxer.x, p1Boxer.y);
                }
            }
        }

    
        // Collision detection and resolution
        const npcBody = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
        const p1Body = new Phaser.Geom.Rectangle(p1Boxer.x, p1Boxer.y, p1Boxer.width, p1Boxer.height);
    
        // Check for body collisions
        if (Phaser.Geom.Intersects.RectangleToRectangle(npcBody, p1Body)) {
            // If NPC collides with the player, move the NPC away from the player
            const pushDistance = 10;
            const pushAngle = Phaser.Math.Angle.Between(this.x, this.y, p1Boxer.x, p1Boxer.y);
    
            this.x += Math.cos(pushAngle) * pushDistance;
            this.y += Math.sin(pushAngle) * pushDistance;
    
            // Reset the rotation to prevent spinning
            this.rotation = 0;
        }

        // Check for fist collision with body
        if (Phaser.Geom.Intersects.CircleToRectangle(this.leftFist, p1Body)) {
            p1Boxer.health -= 1.5;
        }
    
        if (Phaser.Geom.Intersects.CircleToRectangle(this.rightFist, p1Body)) {
            p1Boxer.health -= 3;
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
    
    // Left Jab
    punchLeft(x, y) {
        const punchDistance = 33;

        // Calculate the angle between the boxer and p1Boxer
        const angle = Phaser.Math.Angle.Between(this.leftFist.x, this.leftFist.y, x, y);

        // Calculate target position
        let targetX = this.leftFist.x + punchDistance * Math.cos(angle) + this.velX*8;
        let targetY = this.leftFist.y + punchDistance * Math.sin(angle) + this.velY*8;

        console.log("Target: ", targetX, targetY);
        console.log("Player: ", )
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
    punchRight(x, y) {
        const punchDistance = 44;
        const angle = Phaser.Math.Angle.Between(this.rightFist.x, this.rightFist.y, x, y);

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
}

  
  