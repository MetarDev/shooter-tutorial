import Phaser from 'phaser';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';

export const gameSettings = {
    playerSpeed: 200
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 600,
    height: 450,
    scene: [Scene1, Scene2],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    }
};

const game = new Phaser.Game(config);
