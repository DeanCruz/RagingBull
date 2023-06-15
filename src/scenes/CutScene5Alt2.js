class CutScene5Alt2 extends Phaser.Scene {
    constructor() {
        super("cutScene5Alt2");
    }
  
    preload() {
        // load audio
        this.load.audio('cheer', './assets/cheering.mp3');
    }
    
    create() {
        // add crowd cheering
        this.sound.play('cheer', { loop: true });
        
        // text configuration
        let textConfig = {
            fontFamily: 'Major Mono Display',
            fontSize: '28px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let smallConfig = {
            fontFamily: 'Major Mono Display',
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - 35, 'Ladies and Gentlemen, the winner!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'By Decision, Marcel Cerdan!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 35, 'Better luck next time!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 70, 'Cerdan is the champion for a reason!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + 70, 'Press SPACE to restart', smallConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.scene.start("cutScene4pt1", game.settings);
          // stop sounds
          this.sound.stopAll();   
        }
      }
  }