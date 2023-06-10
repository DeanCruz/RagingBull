class CutScene2 extends Phaser.Scene {
    constructor() {
        super("cutScene2");
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
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - 35, 'Your opponent is Sugar Ray Robinson', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'He is fast, so stay light on your feet', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 35, 'You got this, get in there!', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + 70, 'Press SPACE to continue', textConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.scene.start("sugarRing", game.settings);
        }
      }
  }