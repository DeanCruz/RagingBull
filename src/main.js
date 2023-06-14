// Dean Cruz
// configure game
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Intro, Tutorial, Ring, CutScene1, CutScene1Alt, TrainingScene, TrainingScene2, TrainingRing, TrainingComplete, CutScene2, CutScene2pt2, SugarRing, CutScene3, CutScene3Alt1, CutScene3Alt2],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
}

// game declaration
let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;