/** @type {import("typings\phaser.d.ts")} */

let game;
let gameOptions = {
  heroWidth: 128,
  heroHeight: 192,
  senseiWidth: 128,
  senseiHeight: 192,
  foodSize: 16,
  basicThrowSpeed: 1,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        gravity: { y: 300 }
    }
},
};

class bootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    console.log("> load assets");
    this.load.spritesheet("food", "assets/food.png", {
      frameWidth: gameOptions.foodSize,
      frameHeight: gameOptions.foodSize,
      startFrame: 0,
      endFrame: 63,
      margin: 0,
      spacing: 0
    });

    this.load.spritesheet("hero", "assets/hero.png", {
      frameWidth: gameOptions.heroWidth,
      frameHeight: gameOptions.heroHeight,
      startFrame: 0,
      endFrame: 10,
      margin: 0,
      spacing: 0
    });

    this.load.spritesheet("sensei", "assets/sensei.png", {
      frameWidth: gameOptions.senseiWidth,
      frameHeight: gameOptions.senseiHeight,
      startFrame: 0,
      endFrame: 10,
      margin: 0,
      spacing: 0
    });
  }

  create() {
    console.log("> boot");
    this.scene.start("MainScene");
  }
}

class mainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {}

  create() {
    console.log("> main");
    this.cursors = this.input.keyboard.createCursorKeys();

    // Animations
    /// Hero Animation

    let heroAnimFrames = this.anims.generateFrameNumbers("hero", {
      start: 1,
      end: 7
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.create({
        key: "attack",
        frames: heroAnimFrames,
        frameRate: 16,
        showOnStart: true
      })
    });
    

    // / Sensei Animation
    let senseiAnimFrames = this.anims.generateFrameNumbers("sensei", {
      start: 1,
      end: 7
    });

    this.anims.create({
      key: "throw",
      frames: this.anims.create({
        key: "throw",
        frames: senseiAnimFrames,
        frameRate: 16,
        showOnStart: true
      })
    });

    // Objects

    this.hero = this.add.image(
      gameOptions.heroWidth / 1.5,
      window.innerHeight - gameOptions.heroHeight * 1.5,
      "hero",
      1
    );

    this.sensei = this.add.image(
      window.innerWidth - gameOptions.heroWidth,
      window.innerHeight - gameOptions.heroHeight,
      "sensei",
      1
    );

    // THROW FOOD
    this.anims.create({ 
      key: 'fly', 
      frames: this.anims
      .generateFrameNumbers('food', [0]), 
      frameRate: 5, 
      repeat: -1 });
    var cannon = this.add.image(64, 448, 'food');
    var chick = this.physics.add.sprite(cannon.x, cannon.y, 'food').setScale(2);
    var gfx = this.add.graphics().setDefaultStyles({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });
    var line = new Phaser.Geom.Line();
    var angle = 0;

    chick.disableBody(true, true);

    this.input.on('pointermove', function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer);
        Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y, angle, 128);
        gfx.clear().strokeLineShape(line);
    }, this);

    this.input.on('pointerup', function () {
        chick.enableBody(true, cannon.x, cannon.y, true, true);
        chick.play('fly');
        this.physics.velocityFromRotation(angle, 600, chick.body.velocity);
    }, this);


    console.log("done");
  }

  

  update() {
    if (this.cursors.up.isDown) {
      console.log("up");
      this.hero.anims.play("attack", true);
    }
  }
}

function resizeGame() {
  let canvas = document.querySelector("canvas");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowHeight + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}

window.onload = function() {
  let gameConfig = {
    width: 720,
    height: 480,
    type: Phaser.AUTO,
    backgroundColor: 0x776e65,
    scene: [bootScene, mainScene],
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        gravity: { y: 300 }
      }
    }
  };

  game = new Phaser.Game(gameConfig);
  window.focus();
  this.resizeGame();
  window.addEventListener("resize", this.resizeGame);
};
