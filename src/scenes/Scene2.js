import Phaser from "phaser";
import { Beam } from "../sprites/Beam";
import { Explosion } from "../sprites/Explosion";
import {gameSettings} from '../settings';

export class Scene2 extends Phaser.Scene {

  static get NAME() { return 'playGame'}

  constructor() {
    super(Scene2.NAME);
  }

  preload() {
  }

  create() {
    this.score = 0;
    this.backgroundImage = this.add.image(0,0, 'background');
    this.background = this.add.tileSprite(0,0, this.backgroundImage.width, this.backgroundImage.height, 'background');
    this.background.setOrigin(0,0);
    this.background.setScale(
      this.game.config.width / this.background.width,
      this.game.config.height / this.background.height,
    );

    this.ship1 = this.add.sprite(this.game.config.width/2 - 50, this.game.config.height/2, "ship1");
    this.ship2 = this.add.sprite(this.game.config.width/2, this.game.config.height/2, "ship2");
    this.ship3 = this.add.sprite(this.game.config.width/2 + 50, this.game.config.height/2, "ship3");

    this.powerUps = this.physics.add.group();

    const maxObjects = 4;
    for(let i = 0; i <= maxObjects; i++) {
      const powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, this.game.config.width, this.game.config.height);

      if (Math.random() > 0.5) {
        powerUp.play('red');
      } else {
        powerUp.play('gray');
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    this.resetShip(this.ship1);
    this.resetShip(this.ship2);
    this.resetShip(this.ship3);

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.player = this.physics.add.sprite(this.playerInitialPosition().x, this.playerInitialPosition().y, 'player');
    this.player.play('thrust');
    this.player.setCollideWorldBounds(true);
    
    // this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursorKeys = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.projectiles = this.add.group();

    // Part 9 - COllisions
    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
    
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

    // Part 10 - Score
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE  ", 16 );

    setInterval(() => {
      if (this.enemies.getChildren().length < 20) {
        this.spawnShip();
      }
    }, 500);
  }

  update() {
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      this.moveShip(this.enemies.getChildren()[i], 3);
    }

    this.background.tilePositionY -= 0.5;

    this.movePlayer();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.player.active) {
      this.shootBeam();
    }

    for (let i; i< this.projectiles.getChildren().length; i++) {
      const beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  moveShip(ship, speed) {
    ship.y += speed;

    if (ship.y > this.game.config.height) {
      this.resetShip(ship);
    }
  }

  resetShip(ship) {
    ship.y = 0;
    const randomX = Phaser.Math.Between(0, this.game.config.width);
    ship.x = randomX;
  }

  resetPlayer() {
    const {
      x,
      y
    } = this.playerInitialPosition();

    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;

    const tween = this.tweens.add({
      targets: this.player,
      y: this.playerInitialPosition().y,
      ease: "Power1",
      duration: 1500,
      repeat: 0,
      onComplete: () => {
        this.player.alpha = 1;
      },
      callbackScope: this,
    });
  }

  destroyShip(ship) {
    ship.setTexture('explosion');
    ship.play('explode');
    ship.destroy();
  }

  movePlayer() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityY(0);
    }
  }

  shootBeam() {
    const beam = new Beam(this);
    console.log('fire');
  }

  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
  }

  hurtPlayer(player, enemy) {
    if (this.player.alpha < 1) {
      return;
    }

    this.resetShip(enemy);

    const explosion = new Explosion(this, player.x, player.y);

    player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false,
    });

    this.spawnShip(enemy);
  }

  hitEnemy(projectile, enemy) {
    const explosion = new Explosion(this, enemy.x, enemy.y);
    projectile.destroy();
    this.destroyShip(enemy);

    this.score += 15;
    this.scoreLabel.text = `SCORE ${this.score}`;
    this.spawnShip(enemy);
  }

  playerInitialPosition() {
    return {
      x: this.game.config.width / 2 - 8,
      y: this.game.config.height - 64,
    }
  }

  spawnShip() {
    const ship = this.add.sprite(this.game.config.width/2 - 50, this.game.config.height/2, "ship1");
    this.add.existing(ship);
    ship.play("ship1_anim");
    ship.setInteractive();
    this.enemies.add(ship);
    this.resetShip(ship);
  }
}
