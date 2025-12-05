// Trap System - RNG chaos manager

class TrapSystem {
    constructor(scene) {
        this.scene = scene;
        this.deathCount = 0;
        this.platforms = [];
        this.hiddenBlocks = [];
        this.rngMultiplier = 1.0; // Increases with deaths

        // RNG chances (base values)
        this.chances = {
            platformBetray: 0.10,    // 10% platform disappears
            spikeSpawn: 0.15,        // 15% spikes spawn when standing still
            coinTrap: 0.05,          // 5% coins are deadly
            checkpointTroll: 0.03,   // 3% checkpoint is fake
            enemyExplode: 0.10       // 10% enemy explodes on death
        };
    }

    // Increase RNG difficulty after deaths
    updateDifficulty(deaths) {
        this.deathCount = deaths;
        // RNG increases by 2% per death, up to 2x
        this.rngMultiplier = Math.min(2.0, 1.0 + (deaths * 0.02));
    }

    // Check if RNG trap should trigger
    shouldTrigger(trapType) {
        // NEVER trigger on first attempt at each spot
        if (this.deathCount === 0) return false;

        const baseChance = this.chances[trapType] || 0.1;
        const adjustedChance = baseChance * this.rngMultiplier;

        return Math.random() < adjustedChance;
    }

    // Register a platform for potential betrayal
    registerPlatform(platform) {
        platform.hasBetrayed = false;
        platform.timesTouched = 0;
        this.platforms.push(platform);
        return platform;
    }

    // Called when player lands on platform
    onPlatformLand(platform, player) {
        platform.timesTouched++;

        // Don't betray first time
        if (platform.timesTouched <= 1) return false;

        // Check RNG
        if (!platform.hasBetrayed && this.shouldTrigger('platformBetray')) {
            this.betrayPlatform(platform, player);
            return true;
        }
        return false;
    }

    betrayPlatform(platform, player) {
        platform.hasBetrayed = true;

        // Random betrayal type
        const betrayType = Phaser.Math.Between(1, 3);

        switch (betrayType) {
            case 1: // Platform disappears
                this.scene.tweens.add({
                    targets: platform,
                    alpha: 0,
                    y: platform.y + 50,
                    duration: 300,
                    onComplete: () => {
                        platform.body.enable = false;
                    }
                });
                break;

            case 2: // Platform falls
                platform.body.setAllowGravity(true);
                platform.body.setVelocityY(200);
                break;

            case 3: // Spikes appear
                this.spawnSpikesOn(platform);
                break;
        }
    }

    spawnSpikesOn(platform) {
        const spike = this.scene.add.rectangle(
            platform.x,
            platform.y - 12,
            platform.width * 0.8,
            16,
            0xff0000
        );
        this.scene.physics.add.existing(spike, true);

        // Add spike collision
        if (this.scene.player) {
            this.scene.physics.add.overlap(this.scene.player, spike, () => {
                this.scene.playerDeath();
            });
        }

        // Visual effect
        this.scene.tweens.add({
            targets: spike,
            scaleY: { from: 0, to: 1 },
            duration: 200,
            ease: 'Back.easeOut'
        });
    }

    // Spawn hidden block to block jump
    createHiddenBlock(x, y, width = 32, height = 32) {
        const block = this.scene.add.rectangle(x, y, width, height, 0x8B4513);
        block.setAlpha(0); // Invisible!
        this.scene.physics.add.existing(block, true);

        block.reveal = () => {
            this.scene.tweens.add({
                targets: block,
                alpha: 1,
                duration: 100
            });
        };

        this.hiddenBlocks.push(block);
        return block;
    }

    // Check if player standing still too long - spawn spikes!
    checkStandingStill(player, deltaTime) {
        if (!player.standingTime) player.standingTime = 0;

        if (player.body.velocity.x === 0 && player.body.onFloor()) {
            player.standingTime += deltaTime;

            if (player.standingTime > 2000 && this.shouldTrigger('spikeSpawn')) {
                player.standingTime = 0;
                this.spawnSpikesUnder(player);
                return true;
            }
        } else {
            player.standingTime = 0;
        }
        return false;
    }

    spawnSpikesUnder(player) {
        const spike = this.scene.add.rectangle(
            player.x,
            player.y + 20,
            24, 16,
            0xff0000
        );
        this.scene.physics.add.existing(spike, true);

        // Animate spikes coming from ground
        spike.setScale(1, 0);
        this.scene.tweens.add({
            targets: spike,
            scaleY: 1,
            duration: 150,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Check if player still there
                if (Phaser.Geom.Intersects.RectangleToRectangle(
                    player.getBounds(),
                    spike.getBounds()
                )) {
                    this.scene.playerDeath();
                }
            }
        });

        // Remove spike after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            spike.destroy();
        });
    }

    // Create fake coin that kills
    createTrollCoin(x, y) {
        const coin = this.scene.add.circle(x, y, 8, 0xFFD700);
        this.scene.physics.add.existing(coin, true);

        coin.isTroll = this.shouldTrigger('coinTrap');

        // Sparkle animation
        this.scene.tweens.add({
            targets: coin,
            alpha: { from: 1, to: 0.6 },
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        return coin;
    }

    // Reset for new level
    reset() {
        this.platforms = [];
        this.hiddenBlocks.forEach(b => b.destroy());
        this.hiddenBlocks = [];
    }
}
