class Menu extends Phaser.Scene {
  constructor() {
      super("menuScene");
  }

  preload() {
      // load audio

  }
  
  create() {
      // menu text configuration
    let menuConfig = {
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
    let titleConfig = {
        fontFamily: 'Major Mono Display',
        fontSize: '48px', 
        color: '#FFFFFF',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 0
    }    

    // show menu text
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Raging Bull', titleConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press space to start', menuConfig).setOrigin(0.5);

    // define keys
    keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
      if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
        this.scene.start("introScene", game.settings);
      }
    }
}