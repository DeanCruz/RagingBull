class CutScene5 extends Phaser.Scene {
    constructor() {
        super("cutScene5");
    }
  
    preload() {
        // load audio
  
    }
    
    create() {
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
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - 35, 'Ladies and Gentlemen, the winner!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'By KNOCKOUT, Jake LaMotta!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 35, 'Congratulations!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 70, 'You are now the middle weight champion!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + 70, 'Press SPACE to continue', textConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.scene.start("credits", game.settings);
        }
      }
  }