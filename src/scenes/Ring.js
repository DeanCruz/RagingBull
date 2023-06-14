class Ring extends Phaser.Scene {
    constructor() {
        super("ringScene");

        // used to stop updating fists while punching
        this.leftpunching = false;
        this.rightpunching = false;

        // set boxer scale
        this.initialScale = 2;

        // add text to display time
        this.timeText = null;

        // add text to display health
        this.p1HealthText = null;
        this.npcHealthText = null;

        this.endScreenText = [];

        // timer
        this.timer = 30;
        this.timerEvent = null;
        this.timerText = null;
        
        // add text and buttons for pause menu
        this.pauseText = null;
        this.restartButton = null;
        this.mainMenuButton = null;
        this.isPaused = false;
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
    
        // Create Player in bottom left corner of the ring
        this.p1Boxer = new Boxer(this, ringX + 50, ringY + ringHeight - 50, 'boxer').setOrigin(0.5, 0);
        this.p1Boxer.setScale(this.initialScale);
    
        // Create NPC in top right corner of the ring
        this.npcBoxer = new NPCBoxer(this, ringX + ringWidth - 50, ringY + 50, 'boxer').setOrigin(0.5, 0);
        this.npcBoxer.setScale(this.initialScale);


        // create health text
        const healthConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };
        this.p1HealthText = this.add.text(game.config.width / 2.5, game.config.height - 20, `Health: ${this.p1Boxer.health}`, healthConfig).setOrigin(0.5);
        this.npcHealthText = this.add.text(game.config.width / 2.5, 20, `Health: ${this.npcBoxer.health}`, healthConfig).setOrigin(0.5);

        // Special ability text
        this.rageTextConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FF0000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };
        
        this.rageTextLeft = this.add.text(ringX - 60, ringY + ringHeight / 2, 'RAGING', this.rageTextConfig).setOrigin(0.5);
        this.rageTextRight = this.add.text(ringX + ringWidth + 60, ringY + ringHeight / 2, 'BULL', this.rageTextConfig).setOrigin(0.5);
        
        // Initially hide the text
        this.rageTextLeft.setVisible(false);
        this.rageTextRight.setVisible(false);
      

        // Health bars
        this.p1HealthBar = {
            background: this.add.graphics().fillStyle(0xff0000).fillRect(game.config.width / 1.75 - 50, game.config.height - 25, 100, 10),
            bar: this.add.graphics().fillStyle(0x00ff00).fillRect(game.config.width / 1.75 - 50, game.config.height - 25, 100, 10)
        };
        this.npcHealthBar = {
            background: this.add.graphics().fillStyle(0xff0000).fillRect(game.config.width / 1.75 - 50, 16, 100, 10),
            bar: this.add.graphics().fillStyle(0x00ff00).fillRect(game.config.width / 1.75 - 50, 16, 100, 10)
        };

        // define keys
        // movement
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // punching
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE); 
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO); 
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

        // special ability raging bull
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Esc key for pause menu
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // create pause menu
        this.createPauseMenu();

        // Initially the pause menu is hidden
        this.showPauseMenu(false);
        
        // Initialize timer
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });

        // Create timer text
        const timerConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };
        this.timerText = this.add.text(20, 20, `Time: ${this.timer}`, timerConfig).setOrigin(0);
    }

    update() {
        if (!this.gameOver && !this.isPaused) {
          // Boxing ring boundaries
          const ringX = (game.config.width - 390) / 2;
          const ringY = (game.config.height - 380) / 2;
      
          // Prevent p1Boxer from moving outside of the ring
            [ this.p1Boxer , this.npcBoxer ].forEach(boxer => {
                boxer.x = Phaser.Math.Clamp(
                boxer.x,
                ringX + boxer.width / 2,
                ringX + 380 - boxer.width / 2
                );
                boxer.y = Phaser.Math.Clamp(
                boxer.y,
                ringY + boxer.height / 2,
                ringY + 380 - boxer.height / 2
                );
            });
            
            this.npcBoxer.update(this.p1Boxer);
            this.p1Boxer.update(this.input.activePointer, this.npcBoxer);
  
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

          // Left jab
          if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            if (!this.p1Boxer.leftpunching) {
              this.p1Boxer.leftpunching = true;
              this.p1Boxer.punchLeft(this.input.activePointer);
            }
          }
          // Right cross
          if (Phaser.Input.Keyboard.JustDown(this.key2)) {
            if (!this.p1Boxer.rightpunching) {
              this.p1Boxer.rightpunching = true;
              this.p1Boxer.punchRight(this.input.activePointer);
            }
          }
          // Left hook
          if (Phaser.Input.Keyboard.JustDown(this.key3)) {
            if (!this.p1Boxer.leftpunching) {
              this.p1Boxer.leftpunching = true;
              this.p1Boxer.hookLeft(this.input.activePointer);
            }
          }
          // Right hook
          if (Phaser.Input.Keyboard.JustDown(this.key4)) {
            if (!this.p1Boxer.rightpunching) {
              this.p1Boxer.rightpunching = true;
              this.p1Boxer.hookRight(this.input.activePointer);
            }
          }  
          // Special ability x2 dmg
          if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
            this.p1Boxer.RagingBull();
          }
          // If special ability pressed, display text
          if (this.p1Boxer.rage) {
              this.rageTextLeft.setVisible(true);
              this.rageTextRight.setVisible(true);
          } else {
              this.rageTextLeft.setVisible(false);
              this.rageTextRight.setVisible(false);
          }
          // Pause menu
          if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            this.isPaused = true;  
            console.log(this.gameOver);
            this.showPauseMenu(this.isPaused);
          }
          

          // update health text
          this.p1HealthText.setText(`Health: ${Math.floor(this.p1Boxer.health)}`);
          this.npcHealthText.setText(`Health: ${Math.floor(this.npcBoxer.health)}`);

          if (this.p1Boxer.health <= 0) {
              this.p1HealthBar.bar.clear();
          } else {
              this.p1HealthBar.bar.clear();
              this.p1HealthBar.bar.fillStyle(0x00ff00).fillRect(game.config.width / 1.75 - 50, game.config.height - 25, this.p1Boxer.health, 10);
          }
      
          if (this.npcBoxer.health <= 0) {
              this.npcHealthBar.bar.clear();
          } else {
              this.npcHealthBar.bar.clear();
              this.npcHealthBar.bar.fillStyle(0x00ff00).fillRect(game.config.width / 1.75 - 50, 16, this.npcBoxer.health, 10);
          }
          if (this.p1Boxer.health <= 0 || this.npcBoxer.health <= 0) {
            this.endGame();
          }

          // Update timer text
          this.timerText.setText(`Time: ${this.timer}`);
              
          // End game if timer is zero
          if (this.timer <= 0) {
              this.endGame();
          }
        }
        else if(this.isPaused) {
          if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            this.isPaused = false;  // Toggle pause status
            console.log(this.gameOver);
            this.showPauseMenu(this.isPaused);
          }
        }
    }

    updateTimer() {
        this.timer--;
    }

    endGame() {
      // end loop
      this.gameOver = true;
      this.isPaused = false;
  
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
      if (this.npcBoxer.health <= 0 || this.p1Boxer.health <= 0)
      {
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 30, 'KO', scoreConfig).setOrigin(0.5);
      }
      else
      {
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 30, 'Round 10 Over', scoreConfig).setOrigin(0.5);
      }
      
      this.gameOverText.setColor('#ff0000'); // make the text red
      this.gameOverText.setFontStyle('bold'); // make the text bold
  
      if (this.npcBoxer.health <= 0){
        this.spaceToStartText = this.add.text(game.config.width / 2, game.config.height / 2 + 30, 'Press SPACE to continue', scoreConfig).setOrigin(0.5);
      }
      else if (this.p1Boxer.health > 0){
        this.spaceToStartText = this.add.text(game.config.width / 2, game.config.height / 2 + 30, 'Press SPACE to see judges decision', scoreConfig).setOrigin(0.5);
      }
      else
      {
        this.spaceToStartText = this.add.text(game.config.width / 2, game.config.height / 2 + 30, 'Press SPACE to restart', scoreConfig).setOrigin(0.5);
      }
      // space to start end screen
  
      // store end screen text objects in the array
      this.endScreenText.push(this.gameOverText);
      this.endScreenText.push(this.spaceToStartText);

      // check key input to return to menu
      if (this.timer <= 0){
        this.spaceKeyDown = () => {
          if (this.gameOver) {
            this.reset();
            this.scene.start("cutScene1", game.settings);
          }
        };
        this.input.keyboard.on('keydown-SPACE', this.spaceKeyDown);
      }
      else if (this.p1Boxer.health > 0){
        this.spaceKeyDown = () => {
          if (this.gameOver) {
            this.reset();
            this.scene.start("cutScene1Alt", game.settings);
          }
        };
        this.input.keyboard.on('keydown-SPACE', this.spaceKeyDown);
      }
      else {
        this.spaceKeyDown = () => {
          if (this.gameOver) {
            this.reset();
            this.scene.start("tutorialScene", game.settings);
          }
        };
        this.input.keyboard.on('keydown-SPACE', this.spaceKeyDown);
      }
    }
    createPauseMenu() {
      const menuConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          color: '#ffffff',
          align: 'center',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0,
      };

      // create pause text
      this.pauseText = this.add.text(game.config.width / 2, game.config.height / 3, 'PAUSED', menuConfig).setOrigin(0.5);

      // create restart button
      this.restartButton = this.add.text(game.config.width / 2, game.config.height / 2, 'Restart', menuConfig).setOrigin(0.5);
      this.restartButton.setInteractive({ useHandCursor: true });
      this.restartButton.on('pointerdown', () => this.reset());

      // create main menu button
      this.mainMenuButton = this.add.text(game.config.width / 2, game.config.height / 2 + 100, 'Main Menu', menuConfig).setOrigin(0.5);
      this.mainMenuButton.setInteractive({ useHandCursor: true });
      this.mainMenuButton
      .on('pointerdown', () => this.scene.start('menuScene'));
    }
    showPauseMenu(show) {
        this.pauseText.visible = show;
        this.restartButton.visible = show;
        this.mainMenuButton.visible = show;
    }
    reset() {
      // reset health
      this.timer = 30;
      this.p1Boxer.health = 100;  
      this.npcBoxer.health = 100;  
      
      // Reset position
      const ringWidth = 400;
      const ringHeight = 400;
      const ringX = (game.config.width - ringWidth) / 2;
      const ringY = (game.config.height - ringHeight) / 2;
      
      this.p1Boxer.setPosition(ringX + 50, ringY + ringHeight - 50);
      this.npcBoxer.setPosition(ringX + ringWidth - 50, ringY + 50);
      
      // Reset game over flag
      this.gameOver = false;
      this.isPaused = false;

      // Hide pause menu
      this.showPauseMenu(false);  
      this.p1Boxer.rage = false;
      this.p1Boxer.hasUsedRage = false;
      this.p1Boxer.setScale(this.initialScale);
    }
}