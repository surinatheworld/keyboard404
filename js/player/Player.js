// Player - Cute Dog Character (Pixel Art Generated via Canvas)

class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Generate pixel art textures
        this.generateSprites();

        // Create player sprite
        this.sprite = scene.physics.add.sprite(x, y, 'dog_idle');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.1);
        this.sprite.setSize(14, 14);
        this.sprite.setOffset(1, 2);

        // Player stats
        this.speed = 160;
        this.jumpForce = -380;
        this.isAlive = true;
        this.canControl = true;

        // Create animations
        this.createAnimations();
    }

    generateSprites() {
        // Dog color palette
        const colors = {
            body: '#F5DEB3',      // Wheat/cream
            bodyDark: '#DEB887',  // Burlywood
            nose: '#2F1810',      // Dark brown
            eyes: '#1a1a1a',      // Black
            tongue: '#FF6B6B',    // Pink
            collar: '#4169E1'     // Royal blue
        };

        // Generate idle frame
        this.generateDogSprite('dog_idle', colors, 'idle');

        // Generate run frames
        this.generateDogSprite('dog_run1', colors, 'run1');
        this.generateDogSprite('dog_run2', colors, 'run2');

        // Generate jump frame
        this.generateDogSprite('dog_jump', colors, 'jump');

        // Generate death frame
        this.generateDogSprite('dog_death', colors, 'death');
    }

    generateDogSprite(key, colors, pose) {
        const size = 16;
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

        // Clear
        graphics.clear();

        // Draw based on pose
        switch (pose) {
            case 'idle':
                this.drawDogIdle(graphics, colors);
                break;
            case 'run1':
                this.drawDogRun1(graphics, colors);
                break;
            case 'run2':
                this.drawDogRun2(graphics, colors);
                break;
            case 'jump':
                this.drawDogJump(graphics, colors);
                break;
            case 'death':
                this.drawDogDeath(graphics, colors);
                break;
        }

        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    drawDogIdle(g, c) {
        // Body (rounded rectangle)
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.body).color);
        g.fillRect(3, 6, 10, 8);

        // Head
        g.fillRect(4, 2, 8, 6);

        // Ears
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(3, 1, 3, 3);
        g.fillRect(10, 1, 3, 3);

        // Eyes
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.eyes).color);
        g.fillRect(5, 4, 2, 2);
        g.fillRect(9, 4, 2, 2);

        // Eye shine
        g.fillStyle(0xffffff);
        g.fillRect(5, 4, 1, 1);
        g.fillRect(9, 4, 1, 1);

        // Nose
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.nose).color);
        g.fillRect(7, 6, 2, 1);

        // Collar
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.collar).color);
        g.fillRect(4, 8, 8, 2);

        // Legs
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(4, 14, 2, 2);
        g.fillRect(10, 14, 2, 2);

        // Tail
        g.fillRect(12, 8, 2, 3);
    }

    drawDogRun1(g, c) {
        // Similar to idle but legs in different position
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.body).color);
        g.fillRect(3, 5, 10, 8);

        g.fillRect(4, 1, 8, 6);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(3, 0, 3, 3);
        g.fillRect(10, 0, 3, 3);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.eyes).color);
        g.fillRect(5, 3, 2, 2);
        g.fillRect(9, 3, 2, 2);

        g.fillStyle(0xffffff);
        g.fillRect(5, 3, 1, 1);
        g.fillRect(9, 3, 1, 1);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.nose).color);
        g.fillRect(7, 5, 2, 1);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.collar).color);
        g.fillRect(4, 7, 8, 2);

        // Legs - running pose 1
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(3, 13, 2, 2);  // Front leg forward
        g.fillRect(11, 12, 2, 2); // Back leg back

        // Tail up
        g.fillRect(12, 5, 2, 4);
    }

    drawDogRun2(g, c) {
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.body).color);
        g.fillRect(3, 5, 10, 8);

        g.fillRect(4, 1, 8, 6);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(3, 0, 3, 3);
        g.fillRect(10, 0, 3, 3);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.eyes).color);
        g.fillRect(5, 3, 2, 2);
        g.fillRect(9, 3, 2, 2);

        g.fillStyle(0xffffff);
        g.fillRect(5, 3, 1, 1);
        g.fillRect(9, 3, 1, 1);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.nose).color);
        g.fillRect(7, 5, 2, 1);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.collar).color);
        g.fillRect(4, 7, 8, 2);

        // Legs - running pose 2 (opposite)
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(5, 12, 2, 2);  // Front leg back
        g.fillRect(9, 13, 2, 2);  // Back leg forward

        // Tail middle
        g.fillRect(12, 6, 2, 3);
    }

    drawDogJump(g, c) {
        // Stretched body for jump
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.body).color);
        g.fillRect(2, 4, 11, 7);

        g.fillRect(3, 0, 8, 6);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(2, 0, 3, 2);
        g.fillRect(9, 0, 3, 2);

        // Happy eyes (arcs)
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.eyes).color);
        g.fillRect(4, 3, 2, 1);
        g.fillRect(8, 3, 2, 1);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.nose).color);
        g.fillRect(6, 4, 2, 1);

        // Tongue out!
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.tongue).color);
        g.fillRect(7, 5, 2, 2);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.collar).color);
        g.fillRect(3, 6, 8, 2);

        // Legs tucked
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(3, 11, 3, 2);
        g.fillRect(9, 11, 3, 2);

        // Tail up excited
        g.fillRect(12, 3, 2, 4);
    }

    drawDogDeath(g, c) {
        // X_X eyes, lying down
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.body).color);
        g.fillRect(2, 8, 12, 6);

        g.fillRect(3, 5, 8, 5);

        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(2, 4, 3, 3);
        g.fillRect(9, 4, 3, 3);

        // X X eyes
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.eyes).color);
        // Left X
        g.fillRect(4, 6, 1, 1);
        g.fillRect(6, 6, 1, 1);
        g.fillRect(5, 7, 1, 1);
        g.fillRect(4, 8, 1, 1);
        g.fillRect(6, 8, 1, 1);
        // Right X
        g.fillRect(8, 6, 1, 1);
        g.fillRect(10, 6, 1, 1);
        g.fillRect(9, 7, 1, 1);
        g.fillRect(8, 8, 1, 1);
        g.fillRect(10, 8, 1, 1);

        // Tongue hanging out
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.tongue).color);
        g.fillRect(6, 10, 3, 3);

        // Legs stiff
        g.fillStyle(Phaser.Display.Color.HexStringToColor(c.bodyDark).color);
        g.fillRect(3, 14, 2, 2);
        g.fillRect(7, 14, 2, 2);
        g.fillRect(11, 14, 2, 2);
    }

    createAnimations() {
        // Idle animation
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'dog_idle' }],
            frameRate: 1,
            repeat: -1
        });

        // Run animation
        this.scene.anims.create({
            key: 'run',
            frames: [
                { key: 'dog_run1' },
                { key: 'dog_run2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Jump animation
        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'dog_jump' }],
            frameRate: 1,
            repeat: -1
        });

        // Death animation
        this.scene.anims.create({
            key: 'death',
            frames: [{ key: 'dog_death' }],
            frameRate: 1,
            repeat: 0
        });
    }

    update(cursors, wonkyControls) {
        if (!this.isAlive || !this.canControl) return;

        // Get processed input from wonky controls
        const movement = wonkyControls.processMovement(cursors, this.sprite);
        const shouldJump = wonkyControls.processJump(cursors, this.sprite);

        // Apply movement
        if (movement.left) {
            this.sprite.setVelocityX(-this.speed);
            this.sprite.setFlipX(true);
        } else if (movement.right) {
            this.sprite.setVelocityX(this.speed);
            this.sprite.setFlipX(false);
        } else {
            this.sprite.setVelocityX(0);
        }

        // Jump
        if (shouldJump && this.sprite.body.onFloor()) {
            this.sprite.setVelocityY(this.jumpForce);
        }

        // Animations
        if (!this.sprite.body.onFloor()) {
            this.sprite.anims.play('jump', true);
        } else if (this.sprite.body.velocity.x !== 0) {
            this.sprite.anims.play('run', true);
        } else {
            this.sprite.anims.play('idle', true);
        }
    }

    die() {
        if (!this.isAlive) return;

        this.isAlive = false;
        this.sprite.anims.play('death');
        this.sprite.setVelocity(0, -200);
        this.sprite.body.setAllowGravity(true);

        // Disable collision
        this.sprite.body.checkCollision.none = true;

        // Screen shake
        this.scene.cameras.main.shake(200, 0.01);

        // Flash red
        this.flashDeathOverlay();
    }

    flashDeathOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'death-overlay';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    respawn(x, y) {
        this.sprite.setPosition(x, y);
        this.sprite.setVelocity(0, 0);
        this.sprite.body.checkCollision.none = false;
        this.sprite.anims.play('idle');
        this.isAlive = true;
    }

    getSprite() {
        return this.sprite;
    }
}
