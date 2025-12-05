// Menu Scene - First impression (with trolling!)

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.playButtonClickCount = 0;
    }

    create() {
        // Gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98, 1);
        bg.fillRect(0, 0, 800, 600);

        // Cute clouds
        this.createClouds();

        // Title with cute styling
        this.add.text(400, 120, '🐕 ICY UNIVERSE 🐕', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#4169E1',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Subtitle (deceptive)
        this.add.text(400, 180, 'A Fun & Easy Platformer!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#2E8B57',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Create play button (that moves!)
        this.createPlayButton();

        // Instructions
        this.add.text(400, 480, '🎮 Arrow Keys / WASD to Move\n⬆️ Space / Up to Jump', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#333',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // Version text
        this.add.text(790, 590, 'v1.0', {
            fontSize: '12px',
            color: '#666'
        }).setOrigin(1, 1);

        // Disclaimer (hidden in plain sight)
        this.add.text(400, 560, '⚠️ This game contains no tricks whatsoever ⚠️', {
            fontSize: '11px',
            color: '#999',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }

    createClouds() {
        // Add floating clouds
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.ellipse(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(50, 200),
                Phaser.Math.Between(60, 120),
                Phaser.Math.Between(30, 50),
                0xffffff,
                0.8
            );

            // Float animation
            this.tweens.add({
                targets: cloud,
                x: cloud.x + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createPlayButton() {
        // Button container
        this.playBtn = this.add.container(400, 320);

        // Button background
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x4CAF50, 1);
        btnBg.fillRoundedRect(-100, -30, 200, 60, 16);
        btnBg.lineStyle(4, 0x2E7D32);
        btnBg.strokeRoundedRect(-100, -30, 200, 60, 16);

        // Button text
        const btnText = this.add.text(0, 0, '▶  PLAY', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.playBtn.add([btnBg, btnText]);

        // Make interactive
        const hitArea = this.add.rectangle(400, 320, 200, 60);
        hitArea.setInteractive({ useHandCursor: true });

        // Hover effects
        hitArea.on('pointerover', () => {
            this.playButtonClickCount++;

            // First hover - button moves away (troll!)
            if (this.playButtonClickCount === 1) {
                this.tweens.add({
                    targets: [this.playBtn, hitArea],
                    x: '+=' + Phaser.Math.Between(-150, 150),
                    y: '+=' + Phaser.Math.Between(-50, 50),
                    duration: 200,
                    ease: 'Power2'
                });
            } else {
                // After first troll, just scale up
                this.tweens.add({
                    targets: this.playBtn,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            }
        });

        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: this.playBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        hitArea.on('pointerdown', () => {
            // Start game
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        // Pulse animation
        this.tweens.add({
            targets: this.playBtn,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
