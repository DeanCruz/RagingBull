class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
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
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - 35, 'Credits', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'Director - Dean Cruz', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 35, 'Design - Dean Cruz', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize + 70, 'Programming - Dean Cruz', textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + 70, 'Thank you for playing!', textConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.scene.start("cutScene5pt2", game.settings);
        }
      }
  }