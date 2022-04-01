import Phaser from "phaser";
import { Scene2 } from "./Scene2";
import background from "../assets/images/background.png";
import ship1 from "../assets/spritesheets/ship1.png";
import ship2 from "../assets/spritesheets/ship2.png";
import ship3 from "../assets/spritesheets/ship3.png";
import explosion from "../assets/spritesheets/explosion.png";
import powerUp from "../assets/spritesheets/power-up.png";
import player from "../assets/spritesheets/player.png";
import beam from "../assets/spritesheets/beam.png";
import fontPng from "../assets/fonts/font.png";
import fontXml from "../assets/fonts/font.xml";

export class Scene1 extends Phaser.Scene {
  constructor() {
    super("Boot game");
  }

  preload() {
    this.load.image("background", background);
    this.load.spritesheet("ship1", ship1, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("ship2", ship2, { frameWidth: 32, frameHeight: 16 });
    this.load.spritesheet("ship3", ship3, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("explosion", explosion, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("power-up", powerUp, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("player", player, { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet("beam", beam, { frameWidth: 16, frameHeight: 16 });

    this.load.bitmapFont('pixelFont', fontPng, fontXml);
  }

  create() {
    this.add.text(20, 20, "Loading game...");

    this.anims.create({
      key: 'ship1_anim',
      frames: this.anims.generateFrameNumbers("ship1"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'ship2_anim',
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'ship3_anim',
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'beam_anim',
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.anims.create({
      key: 'red',
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1,
      }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'gray',
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3,
      }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'thrust',
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1,
    });

    this.scene.start(Scene2.NAME);
  }
}
