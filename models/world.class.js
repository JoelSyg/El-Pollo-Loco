class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthStatusBar = new HealthStatusBar();
  bottlesStatusBar = new BottlesStatusBar();
  coinsStatusBar = new CoinsStatusBar();
  bossHealthStatusBar = new BossHealthStatusBar();
  throwableObjects = [];
  lastThrowTime = 0; // Initialize last throw time
  isMusicMuted = false;
  isSoundMuted = false;

  gameMusic = new Audio("./audio/music.mp3");
  endbossMusic = new Audio("./audio/endboss_music.wav");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this; // Hier wird die World-Instanz an den Character weitergegeben
    this.draw();
    this.setWorld();
    this.run();
    this.playGameMusic();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this; // Übergibt die World-Instanz an den Endboss
      }
    });
    this.bossHealthStatusBar.setVisible(false); // Hide initially
  }

  playGameMusic() {
    this.gameMusic.loop = true; // Setze die Musik auf Schleife
    this.gameMusic.play();
  }

  startEndbossMusic() {
    this.gameMusic.pause(); // Pausiere die Standard-Musik
    this.endbossMusic.loop = true; // Setze die Endboss-Musik auf Schleife
    this.endbossMusic.play();
  }

  run() {
    addInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossChasing(); // Neue Methode zur Überprüfung der Verfolgung
    }, 25);
  }

  checkEndbossChasing() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isChasing) {
        this.startEndbossMusic();
        this.bossHealthStatusBar.setVisible(true); // Show health bar
      } else {
        this.bossHealthStatusBar.setVisible(false); // Hide health bar when not chasing (optional)
      }
    });
  }

  collectBottle(bottle) {
    if (this.character.bottles < 5) {
      bottle.pickup_sound.play();
      this.character.bottles += 1;
      this.bottlesStatusBar.setPercentage(this.character.bottles * 20); // Update Bottlestatusbar

      // remove bottle
      const index = this.level.bottles.indexOf(bottle);
      if (index > -1) {
        this.level.bottles.splice(index, 1);
      }
    }
  }

  collectCoin(coin) {
    coin.collect_sound.play();
    this.character.coins += 1;
    this.coinsStatusBar.setPercentage(this.character.coins * 10); // Update Coinstatusbar

    // remove coin
    const index = this.level.coins.indexOf(coin);
    if (index > -1) {
      this.level.coins.splice(index, 1);
    }
  }

  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkBottleCollisions();
    this.checkCoinCollisions();
    this.checkThrowableObjectsCollisions();
}

checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy) && enemy.isAlive) {
            if (enemy instanceof Endboss) {
                enemy.attack();
            }
            if (this.character.isCollidingFromAbove(enemy)) {
                enemy.kill();
                this.removeDeadEnemy(enemy);
            } else {
                this.character.hit();
                this.healthStatusBar.setPercentage(this.character.health);
                if (this.character.isDead()) {
                    this.muteAllMusic();
                    this.character.walking_sound.volume = 0;
                    gameOver(false);
                }
            }
        }
    });
}

checkBottleCollisions() {
    this.level.bottles.forEach((bottle) => {
        if (this.character.isColliding(bottle)) {
            this.collectBottle(bottle);
        }
    });
}

checkCoinCollisions() {
    this.level.coins.forEach((coin) => {
        if (this.character.isColliding(coin)) {
            this.collectCoin(coin);
        }
    });
}

checkThrowableObjectsCollisions() {
    this.throwableObjects.forEach((thrownBottle) => {
        if (!thrownBottle.hasHit && thrownBottle.y > 360) {
            this.handleBottleHitGround(thrownBottle);
        } else {
            this.checkThrownBottleCollisionsWithEnemies(thrownBottle);
        }
    });
}

handleBottleHitGround(thrownBottle) {
  thrownBottle.bottleSplash();
  if (!this.isSoundMuted) {
    thrownBottle.break_sound.play(); // Nur abspielen, wenn nicht gemutet
  }
  thrownBottle.hasHit = true;
  this.removeThrownBottle(thrownBottle);
}


checkThrownBottleCollisionsWithEnemies(thrownBottle) {
  this.level.enemies.forEach((enemy) => {
      if (!thrownBottle.hasHit && thrownBottle.isColliding(enemy)) {
          enemy.hitByBottle();
          thrownBottle.bottleSplash();
          if (!this.isSoundMuted) {
            thrownBottle.splash_sound.play(); // Nur abspielen, wenn nicht gemutet
          }
          thrownBottle.hasHit = true;
          this.removeThrownBottle(thrownBottle);
          if (!enemy.isAlive) {
              this.removeDeadEnemy(enemy);
          }
          if (enemy instanceof Endboss) {
              this.bossHealthStatusBar.setPercentage(enemy.health);
              if (enemy.isDead()) {
                  this.muteAllMusic();
                  this.character.walking_sound.volume = 0;
                  gameOver(true);
              }
          }
      }
  });
}


muteAllMusic() {
    this.gameMusic.volume = 0; // Mute game music
    this.endbossMusic.volume = 0; // Mute Endboss music
}






  toggleMusicMute() {
      if (this.isMusicMuted) {
          this.isMusicMuted = false;
          this.gameMusic.volume = 1;
          this.endbossMusic.volume = 1;
      } else {
          this.isMusicMuted = true;
          this.gameMusic.volume = 0;
          this.endbossMusic.volume = 0;
      }
  }

  toggleSoundMute() {
      if (this.isSoundMuted) {
          this.isSoundMuted = false;
      } else {
          this.isSoundMuted = true;
      }

      // Charakter-Sounds muten
      if (this.character) {
          this.character.updateSoundVolumes(this.isSoundMuted);
      }

      // Feinde (inkl. Hühner und Endboss) muten
      if (this.level.enemies) {
          this.level.enemies.forEach(enemy => {
              if (enemy.updateSoundVolumes) {
                  enemy.updateSoundVolumes(this.isSoundMuted);
              }
          });
      }

      // Flaschen-Sounds muten
      if (this.level.bottles) {
          this.level.bottles.forEach(bottle => {
              if (bottle.updateSoundVolumes) {
                  bottle.updateSoundVolumes(this.isSoundMuted);
              }
          });
      }

      // Münzen-Sounds muten
      if (this.level.coins) {
          this.level.coins.forEach(coin => {
              if (coin.updateSoundVolumes) {
                  coin.updateSoundVolumes(this.isSoundMuted);
              }
          });
      }

      // Geworfene Flaschen-Sounds muten
      if (this.throwableObjects) {
          this.throwableObjects.forEach(thrownBottle => {
              if (thrownBottle.updateSoundVolumes) {
                  thrownBottle.updateSoundVolumes(this.isSoundMuted);
              }
          });
      }

      // Endboss-Sounds muten
      if (this.endboss) {
          this.endboss.updateSoundVolumes(this.isSoundMuted);
      }
  }











  removeThrownBottle(thrownBottle) {
    setTimeout(() => {
      const index = this.throwableObjects.indexOf(thrownBottle);
      if (index > -1) {
        this.throwableObjects.splice(index, 1);
      }
    }, 500);
  }

  removeDeadEnemy(enemy) {
    setTimeout(() => {
      const index = this.level.enemies.indexOf(enemy);
      if (index > -1) {
        this.level.enemies.splice(index, 1);
      }
    }, 500);
  }

  checkThrowObjects() {
    const currentTime = Date.now();
    if (this.keyboard.D && this.character.bottles > 0 && currentTime - this.lastThrowTime >= 500) {
      const direction = this.character.otherDirection ? "left" : "right";
      let bottle = new ThrowableObject(this.character.x + (direction === "right" ? 100 : -100), this.character.y + 100, direction);
      
      // Rufe die Methode zum Abspielen des Sounds auf
      this.playThrowSound();

      this.throwableObjects.push(bottle);
      this.character.bottles -= 1;
      this.bottlesStatusBar.setPercentage(this.character.bottles * 20);
      this.lastThrowTime = currentTime;
    }
}

playThrowSound() {
  if (!this.isSoundMuted) {
      const throwSound = new Audio('./audio/throw.mp3');
      throwSound.play();
  }
}



  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
    // Space for fixed objects
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinsStatusBar);
    this.addToMap(this.bottlesStatusBar);
    // Only add bossHealthStatusBar if visible
    if (this.bossHealthStatusBar.visible) {
      this.addToMap(this.bossHealthStatusBar);
    }
    //
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    // // Draw() wird immer wieder aufgerufe
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    mo.drawInnerFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
