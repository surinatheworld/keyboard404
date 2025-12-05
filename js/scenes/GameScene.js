// Game Scene - Main gameplay with all the trolling

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Reset death counter for this session
        GameState.reset();

        // Setup world bounds
        this.physics.world.setBounds(0, 0, 2400, 600);

        // Initialize trap system BEFORE creating level (platforms need it)
        this.trapSystem = new TrapSystem(this);

        // Create background
        this.createBackground();

        // Create level elements
        this.createLevel();

        // Create player
        this.player = new Player(this, 100, 400);
        this.playerSprite = this.player.getSprite();

        // Setup camera
        this.cameras.main.setBounds(0, 0, 2400, 600);
        this.cameras.main.startFollow(this.playerSprite, true, 0.1, 0.1);

        // Collision with platforms
        this.physics.add.collider(this.playerSprite, this.platforms, (player, platform) => {
            // Check platform betrayal RNG
            if (player.body.touching.down && platform.isRNG) {
                this.trapSystem.onPlatformLand(platform, player);
            }
        });

        // Collision with ground
        this.physics.add.collider(this.playerSprite, this.ground);

        // Collision with hidden blocks (reveals them on hit from below)
        this.physics.add.collider(this.playerSprite, this.hiddenBlocks, (player, block) => {
            if (player.body.touching.up) {
                block.reveal();
                // Push player down - THE TROLL!
                player.setVelocityY(200);
            }
        });

        // Overlap with spikes (death)
        this.physics.add.overlap(this.playerSprite, this.spikes, () => {
            this.playerDeath();
        });

        // Overlap with coins
        this.physics.add.overlap(this.playerSprite, this.coins, (player, coin) => {
            if (coin.isTroll) {
                coin.destroy();
                this.playerDeath();
            } else {
                coin.destroy();
                // TODO: Add score
            }
        });

        // Overlap with death zones
        this.physics.add.overlap(this.playerSprite, this.deathZones, () => {
            this.playerDeath();
        });

        // Overlap with checkpoint
        this.physics.add.overlap(this.playerSprite, this.checkpoints, (player, checkpoint) => {
            if (!checkpoint.activated) {
                checkpoint.activated = true;
                this.currentCheckpoint = { x: checkpoint.x, y: checkpoint.y - 20 };
                checkpoint.setFillStyle(0x00FF00);

                // Show checkpoint message
                this.showMessage('Checkpoint! 🎉');
            }
        });

        // Overlap with finish flag
        this.physics.add.overlap(this.playerSprite, this.finishFlag, () => {
            this.levelComplete();
        });

        // Initialize wonky controls system
        this.wonkyControls = new WonkyControls(this);
        this.wonkyControls.start();

        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Checkpoint position
        this.currentCheckpoint = { x: 100, y: 400 };

        // Spawn position
        this.spawnPoint = { x: 100, y: 400 };

        // Fade in
        this.cameras.main.fadeIn(500);
    }

    createBackground() {
        // Sky gradient
        const skyGradient = this.add.graphics();
        skyGradient.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xB0E0E6, 0xB0E0E6, 1);
        skyGradient.fillRect(0, 0, 2400, 600);
        skyGradient.setScrollFactor(0.1);

        // Background hills
        for (let i = 0; i < 8; i++) {
            const hill = this.add.ellipse(i * 400 + 200, 550, 500, 200, 0x90EE90);
            hill.setScrollFactor(0.3);
        }

        // Clouds
        for (let i = 0; i < 12; i++) {
            const cloud = this.add.ellipse(
                i * 220 + Phaser.Math.Between(0, 100),
                Phaser.Math.Between(50, 150),
                Phaser.Math.Between(80, 140),
                Phaser.Math.Between(40, 60),
                0xffffff,
                0.9
            );
            cloud.setScrollFactor(0.2);
        }

        // Sun
        const sun = this.add.circle(2200, 100, 60, 0xFFD700);
        sun.setScrollFactor(0.1);
    }

    createLevel() {
        // Groups
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();
        this.coins = this.physics.add.group();
        this.hiddenBlocks = this.physics.add.staticGroup();
        this.deathZones = this.physics.add.staticGroup();
        this.checkpoints = this.physics.add.staticGroup();

        // === GROUND ===
        // Starting safe area
        this.createGround(0, 568, 600, 64);

        // Gap with death zone
        this.createDeathZone(600, 580, 150, 40);

        // More ground
        this.createGround(750, 568, 400, 64);

        // Another gap
        this.createDeathZone(1150, 580, 100, 40);

        // Platform section
        this.createGround(1250, 568, 300, 64);

        // Final stretch
        this.createGround(1700, 568, 700, 64);

        // === PLATFORMS ===
        // Tutorial platforms (safe)
        this.createPlatform(300, 480, 120, 20, false); // Safe
        this.createPlatform(420, 400, 100, 20, false); // Safe

        // RNG treachery begins!
        this.createPlatform(550, 350, 80, 20, true);  // RNG!

        // Hidden block trap - looks like easy jump
        this.createHiddenBlock(480, 320); // Will block the jump!

        // More platforms over the gap
        this.createPlatform(680, 450, 60, 20, true);

        // Spike after seemingly safe landing
        this.createSpikes(820, 552, 60, 16);

        // Safe looking area with hidden spikes
        this.createPlatform(900, 450, 100, 20, false);
        this.createPlatform(1020, 380, 80, 20, true);

        // Checkpoint (may or may not be real...)
        this.createCheckpoint(1100, 540);

        // Fake ground that falls
        this.createPlatform(1300, 520, 100, 20, true);

        // Staircase of doom
        this.createPlatform(1400, 500, 60, 20, true);
        this.createPlatform(1480, 440, 60, 20, false);
        this.createPlatform(1560, 380, 60, 20, true);
        this.createPlatform(1640, 320, 80, 20, false);

        // Hidden block in the middle of staircase
        this.createHiddenBlock(1520, 350);

        // Spike field
        this.createSpikes(1750, 552, 30, 16);
        this.createSpikes(1820, 552, 30, 16);
        this.createSpikes(1900, 552, 30, 16);

        // Safe platforms over spikes
        this.createPlatform(1780, 480, 60, 20, true);
        this.createPlatform(1860, 420, 60, 20, false);
        this.createPlatform(1940, 360, 60, 20, true);

        // Coins (some are trolls!)
        this.createCoin(320, 450);
        this.createCoin(550, 320);
        this.createCoin(1020, 350);  // Troll potential
        this.createCoin(1560, 350);
        this.createCoin(1860, 390);

        // Final gauntlet
        this.createPlatform(2050, 450, 80, 20, false);
        this.createPlatform(2150, 400, 80, 20, true);
        this.createSpikes(2100, 552, 200, 16); // Death below

        // Finish line!
        this.createFinishFlag(2280, 500);
    }

    createGround(x, y, width, height) {
        const ground = this.add.rectangle(x + width / 2, y, width, height, 0x8B4513);
        this.physics.add.existing(ground, true);
        this.ground.add(ground);

        // Grass on top
        const grass = this.add.rectangle(x + width / 2, y - height / 2 - 4, width, 8, 0x228B22);

        return ground;
    }

    createPlatform(x, y, width, height, isRNG = false) {
        const platform = this.add.rectangle(x, y, width, height, isRNG ? 0xCD853F : 0xDEB887);
        platform.setStrokeStyle(2, 0x8B4513);
        this.physics.add.existing(platform, true);
        platform.isRNG = isRNG;

        if (isRNG) {
            this.trapSystem.registerPlatform(platform);
        }

        this.platforms.add(platform);
        return platform;
    }

    createSpikes(x, y, width, height) {
        // Create spike shape using triangles visual
        const spikeCount = Math.floor(width / 10);
        for (let i = 0; i < spikeCount; i++) {
            const spike = this.add.triangle(
                x + i * 10 + 5, y,
                0, height,
                5, 0,
                10, height,
                0xff0000
            );
        }

        // Collision box
        const spikeZone = this.add.rectangle(x + width / 2, y, width, height);
        spikeZone.setAlpha(0);
        this.physics.add.existing(spikeZone, true);
        this.spikes.add(spikeZone);

        return spikeZone;
    }

    createHiddenBlock(x, y) {
        const block = this.add.rectangle(x, y, 32, 32, 0x8B4513);
        block.setAlpha(0); // INVISIBLE!
        this.physics.add.existing(block, true);

        block.reveal = () => {
            this.tweens.add({
                targets: block,
                alpha: 1,
                duration: 100
            });
        };

        this.hiddenBlocks.add(block);
        return block;
    }

    createDeathZone(x, y, width, height) {
        const zone = this.add.rectangle(x + width / 2, y, width, height);
        zone.setAlpha(0);
        this.physics.add.existing(zone, true);
        this.deathZones.add(zone);
        return zone;
    }

    createCoin(x, y) {
        const coin = this.add.circle(x, y, 10, 0xFFD700);
        coin.setStrokeStyle(2, 0xDAA520);
        this.physics.add.existing(coin, true);

        // RNG: 5% chance coin is deadly (after first death)
        coin.isTroll = false; // Will be set by trap system later

        // Sparkle animation
        this.tweens.add({
            targets: coin,
            alpha: { from: 1, to: 0.6 },
            yoyo: true,
            repeat: -1,
            duration: 400
        });

        this.coins.add(coin);
        return coin;
    }

    createCheckpoint(x, y) {
        const checkpoint = this.add.rectangle(x, y, 20, 40, 0xFFFF00);
        checkpoint.setStrokeStyle(2, 0xFFA500);
        checkpoint.activated = false;
        this.physics.add.existing(checkpoint, true);
        this.checkpoints.add(checkpoint);

        // Flag pole
        this.add.rectangle(x, y - 30, 4, 60, 0x8B4513);

        return checkpoint;
    }

    createFinishFlag(x, y) {
        // Flag pole
        this.add.rectangle(x, y - 50, 6, 100, 0x8B4513);

        // Flag
        this.finishFlag = this.add.rectangle(x + 20, y - 80, 40, 30, 0x00FF00);
        this.add.text(x + 20, y - 80, '🏁', { fontSize: '24px' }).setOrigin(0.5);
        this.physics.add.existing(this.finishFlag, true);

        // Celebration animation
        this.tweens.add({
            targets: this.finishFlag,
            y: y - 85,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    showMessage(text) {
        const msg = document.getElementById('troll-message');
        msg.textContent = text;
        msg.classList.remove('hidden');

        setTimeout(() => {
            msg.classList.add('hidden');
        }, 2000);
    }

    playerDeath() {
        if (!this.player.isAlive) return;

        this.player.die();
        GameState.addDeath();
        this.trapSystem.updateDifficulty(GameState.deaths);

        // Respawn after delay
        this.time.delayedCall(1500, () => {
            this.player.respawn(this.currentCheckpoint.x, this.currentCheckpoint.y);
        });
    }

    levelComplete() {
        this.wonkyControls.stop();
        this.player.canControl = false;

        // Victory!
        this.showMessage('🎉 Level Complete! 🎉');

        // Show stats after delay
        this.time.delayedCall(2000, () => {
            // Could transition to next level or show stats
            this.showMessage(`Deaths: ${GameState.deaths}`);
        });
    }

    update(time, delta) {
        // Combine cursor keys and WASD
        const combinedCursors = {
            left: { isDown: this.cursors.left.isDown || this.wasd.left.isDown },
            right: { isDown: this.cursors.right.isDown || this.wasd.right.isDown },
            up: { isDown: this.cursors.up.isDown || this.wasd.up.isDown },
            space: { isDown: this.wasd.space.isDown }
        };

        // Copy JustDown methods
        combinedCursors.up.justDown = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.wasd.up);
        combinedCursors.space.justDown = Phaser.Input.Keyboard.JustDown(this.wasd.space);

        // Update player
        this.player.update(combinedCursors, this.wonkyControls);

        // Check standing still trap
        if (this.player.isAlive) {
            this.trapSystem.checkStandingStill(this.playerSprite, delta);
        }

        // Check fall death
        if (this.playerSprite.y > 620) {
            this.playerDeath();
        }
    }
}
