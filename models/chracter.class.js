class Character extends MovableObject {
  height = 250;
  y = 80;
  speed = 10;

  bottles = 0;
  coins = 0;

  offset = {
    top: 100,
    bottom: 10,
    left: 20,
    right: 22
  }

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png'
  ]

  IMAGES_LONG_IDLE = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png'
  ]

  IMAGES_WALKING = [
    "/img/2_character_pepe/2_walk/W-21.png",
    "/img/2_character_pepe/2_walk/W-22.png",
    "/img/2_character_pepe/2_walk/W-23.png",
    "/img/2_character_pepe/2_walk/W-24.png",
    "/img/2_character_pepe/2_walk/W-25.png",
    "/img/2_character_pepe/2_walk/W-26.png"
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png"
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png"
  ]

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png"
  ]

  world;
  walking_sound = new Audio("audio/running.mp3");
  death_sound = new Audio("audio/pepe_death.mp3");
  jump_sound = new Audio('audio/jump.wav');
  landing_sound = new Audio('audio/landing.wav');
  
  pepe_hurt_sounds = [
    new Audio('audio/pepe_hurt1.mp3'),
    new Audio('audio/pepe_hurt2.mp3'),
    new Audio('audio/pepe_hurt3.mp3')
  ];

  soundPlaying = false;
  idleStartTime = null;
  animationIntervalWalking = null;
  animationIntervalAction = null;

  constructor() {
    super().loadImage("/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  resetIdleTimer() {
    this.idleStartTime = new Date().getTime();
  }

  animate() {
    this.resetIdleTimer();

    this.animationIntervalWalking = setInterval(() => {
      this.walking_sound.pause();
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.playWalkSound();
        this.otherDirection = false;
        this.resetIdleTimer();
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.playWalkSound();
        this.otherDirection = true;
        this.resetIdleTimer();
      }

      if (this.world.keyboard.UP && !this.isAboveGround()) {
        this.jump();
        this.resetIdleTimer();
        this.playJumpSound();
      }

      this.world.camera_x = -this.x + 240;
    }, 1000 / 60);

    this.animationIntervalAction = setInterval(() => {
      if (this.isDead()) {
        this.playDeathAnimation();
      } else if (this.isHurt()) {
        this.playRandomHurtSound();
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          const idleTime = new Date().getTime() - this.idleStartTime;
          if (idleTime > 3000) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
          } else {
            this.playAnimation(this.IMAGES_IDLE);
          }
        }
      }
    }, 90);
  }

  playDeathAnimation() {
    this.death_sound.play();
    this.playAnimation(this.IMAGES_DEAD, true);
  }

  playAnimation(images, stopAtEnd = false) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
    
    if (stopAtEnd && i === images.length - 1) {
      // Stop the animation at the last image for death animation
      this.stopAnimation();
    }
  }

  stopAnimation() {
    clearInterval(this.animationIntervalWalking);
    clearInterval(this.animationIntervalAction);
  }

  playRandomHurtSound() {
    if (!this.soundPlaying) {
      const hurtSounds = this.pepe_hurt_sounds;
      const randomIndex = Math.floor(Math.random() * hurtSounds.length);
      const selectedSound = hurtSounds[randomIndex];

      selectedSound.play();
      this.soundPlaying = true;

      // Use setTimeout to reset the soundPlaying flag after the duration of the sound
      setTimeout(() => {
        this.soundPlaying = false;
      }, selectedSound.duration * 1000); // Convert to milliseconds
    }
  }

  playWalkSound() {
    if (this.y > 180) { // walking sound nur abspielen wenn man auch auf dem boden ist...
      this.walking_sound.play();
      }
  }

  playJumpSound() {
    this.jump_sound.play();
    setTimeout(() => {
      this.landing_sound.play();
    }, 900);
  }
}
