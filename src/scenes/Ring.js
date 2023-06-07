class Ring extends Phaser.Scene {
    constructor() {
        super("ringScene");

        this.leftpunching = false;
        this.rightpunching = false;

        // add text to display time
        this.timeText = null;
    }

    // initialize game settings
    init(settings) {
        this.settings = settings;
        this.gameTimer = settings.gameTimer;
    }

    preload(){
        this.load.image('boxer', './assets/rocket.png');
    }

    create() {
        // black borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000 ).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000000).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000000).setOrigin(0,0);

        // Define ring parameters
        const ringWidth = 400;
        const ringHeight = 400;
        const ringColor = 0xAAAAAA;
        const ringBorderColor = 0xFF0000;
        const ringBorderThickness = 10;
        
        const ringX = (game.config.width - ringWidth) / 2;
        const ringY = (game.config.height - ringHeight) / 2;

        // Draw ring floor
        this.add.rectangle(ringX, ringY, ringWidth, ringHeight, ringColor).setOrigin(0,0);

        // Draw ring border
        this.add.rectangle(ringX, ringY, ringWidth, ringBorderThickness, ringBorderColor).setOrigin(0,0); // Top border
        this.add.rectangle(ringX, ringY + ringHeight - ringBorderThickness, ringWidth, ringBorderThickness, ringBorderColor).setOrigin(0,0); // Bottom border
        this.add.rectangle(ringX, ringY, ringBorderThickness, ringHeight, ringBorderColor).setOrigin(0,0); // Left border
        this.add.rectangle(ringX + ringWidth - ringBorderThickness, ringY, ringBorderThickness, ringHeight, ringBorderColor).setOrigin(0,0); // Right border


        this.p1Boxer = new Boxer(this, game.config.width/2, game.config.height/1.2, 'boxer').setOrigin(0.5, 0);
        this.p1Boxer.setScale(2);

        // define keys
        // movement
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // punching
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); 
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); 
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update() {
        if (!this.gameOver) {
          // Boxing ring boundaries
          const ringX = (game.config.width - 390) / 2;
          const ringY = (game.config.height - 380) / 2;
      
          // Prevent p1Boxer from moving outside of the ring
          this.p1Boxer.x = Phaser.Math.Clamp(
            this.p1Boxer.x,
            ringX + this.p1Boxer.width / 2,
            ringX + 380 - this.p1Boxer.width / 2
          );
          this.p1Boxer.y = Phaser.Math.Clamp(
            this.p1Boxer.y,
            ringY + this.p1Boxer.height / 2,
            ringY + 380 - this.p1Boxer.height / 2
          );
      
          // Check keys
          if (this.keyW.isDown) {
            this.p1Boxer.y -= 2;
            this.p1Boxer.velY = -2;
          } else if (this.keyS.isDown) {
            this.p1Boxer.y += 2;
            this.p1Boxer.velY = 2;
          } else {
            this.p1Boxer.velY = 0;
          }
          
          if (this.keyA.isDown) {
            this.p1Boxer.x -= 2;
            this.p1Boxer.velX = -2;
          } else if (this.keyD.isDown) {
            this.p1Boxer.x += 2;
            this.p1Boxer.velX = 2;
          } else {
            this.p1Boxer.velX = 0;
          }
          
      
          if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
            if (!this.p1Boxer.leftpunching) {
              this.p1Boxer.leftpunching = true;
              this.p1Boxer.punchLeft(this.input.activePointer);
            }
          }
          
          if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            if (!this.p1Boxer.rightpunching) {
              this.p1Boxer.rightpunching = true;
              this.p1Boxer.punchRight(this.input.activePointer);
            }
          }
          if (Phaser.Input.Keyboard.JustDown(this.keyShift)) {
            if (!this.p1Boxer.leftpunching) {
              this.p1Boxer.leftpunching = true;
              this.p1Boxer.hookLeft(this.input.activePointer);
            }
          }
          if (Phaser.Input.Keyboard.JustDown(this.keyC)) {
            if (!this.p1Boxer.rightpunching) {
              this.p1Boxer.rightpunching = true;
              this.p1Boxer.hookRight(this.input.activePointer);
            }
          }
      
      
          // Rotate boxer to face towards mouse pointer with a 45-degree offset
          const pointer = this.input.activePointer;
          const angle = Phaser.Math.Angle.Between(
            this.p1Boxer.x,
            this.p1Boxer.y,
            pointer.x,
            pointer.y
          );
          const rotationAngle = angle + Math.PI / 2 + Math.PI / 4;
          this.p1Boxer.setRotation(rotationAngle);
      
          // Update the positions and rotations of the fists relative to the boxer
          const distance = this.p1Boxer.displayWidth / 2;
      
          if (!this.p1Boxer.leftpunching) {
            const leftFistOffset = Math.PI / 2 + Math.PI / 4;
            const leftFistAngle = rotationAngle + leftFistOffset;
            const leftFistX = this.p1Boxer.x + Math.cos(leftFistAngle) * distance;
            const leftFistY = this.p1Boxer.y + Math.sin(leftFistAngle) * distance;
            this.p1Boxer.leftFist.setPosition(leftFistX, leftFistY);
            this.p1Boxer.leftFist.setRotation(rotationAngle);
          }
      
          if (!this.p1Boxer.rightpunching) {
            const rightFistOffset = Math.PI / 2 - Math.PI / 4;
            const rightFistAngle = rotationAngle + rightFistOffset;
            const rightFistX = this.p1Boxer.x + Math.cos(rightFistAngle) * distance;
            const rightFistY = this.p1Boxer.y + Math.sin(rightFistAngle) * distance;
            this.p1Boxer.rightFist.setPosition(rightFistX, rightFistY);
            this.p1Boxer.rightFist.setRotation(rotationAngle);
        }
      }
    }
    
      
        
    
    endGame() {
        this.gameOver = true;
        // display text
        let scoreConfig = {
            fontFamily: 'Major Mono Display',
            fontSize: '28px',
            color: '#DEB64B',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0,
        };

        // end screen text
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 128, 'KO', scoreConfig).setOrigin(0.5);
        // space to start end screen
        this.spaceToStartText = this.add.text(game.config.width / 2, game.config.height / 2 - 64, 'Press SPACE to restart', scoreConfig).setOrigin(0.5);

        // store end screen text objects in the array
        this.endScreenText.push(this.gameOverText);
        this.endScreenText.push(this.spaceToStartText);

        // check key input to return to menu
        this.spaceKeyDown = () => {
            if (this.gameOver) {
                this.resetGame();
                // remove listener
                this.input.keyboard.removeListener('keydown-SPACE', this.spaceKeyDown);
            }
        };
        this.input.keyboard.on('keydown-SPACE', this.spaceKeyDown);
    }

    resetGame() {    
        // reset rockets and spaceships
        this.p1Boxer.reset();

        // restart loop
        this.gameOver = false;
    }

    // hideEndScreen() {
    //     // hide text after restarting game
    //     this.endScreenText.forEach(text => text.visible = false);
    // }
}