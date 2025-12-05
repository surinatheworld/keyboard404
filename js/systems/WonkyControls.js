// Wonky Controls System - Makes the keyboard "malfunction"

class WonkyControls {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.currentGlitch = null;
        this.glitchTimer = null;
        this.cycleTimer = null;

        // Glitch types with their effects
        this.glitchTypes = [
            { name: 'DELAY_JUMP', description: 'Jump Delay 0.5s', duration: 5000 },
            { name: 'SWAP_CONTROLS', description: 'Left ↔ Right Swapped', duration: 5000 },
            { name: 'STICKY_KEYS', description: 'Sticky Movement', duration: 5000 },
            { name: 'DOUBLE_TAP', description: 'Double Tap Required', duration: 5000 },
            { name: 'RANDOM_IGNORE', description: 'Random Input Loss', duration: 5000 }
        ];

        this.jumpQueued = false;
        this.lastDirection = null;
        this.tapCounts = { left: 0, right: 0, jump: 0 };
    }

    start() {
        this.schedulNextGlitch();
    }

    stop() {
        if (this.cycleTimer) this.cycleTimer.remove();
        if (this.glitchTimer) this.glitchTimer.remove();
        this.deactivateGlitch();
    }

    schedulNextGlitch() {
        // Random time between 10-20 seconds
        const delay = Phaser.Math.Between(10000, 20000);

        this.cycleTimer = this.scene.time.delayedCall(delay, () => {
            this.activateGlitch();
        });
    }

    activateGlitch() {
        // Pick random glitch
        const glitch = Phaser.Utils.Array.GetRandom(this.glitchTypes);
        this.currentGlitch = glitch;
        this.isActive = true;
        GameState.wonkyActive = true;
        GameState.wonkyType = glitch.name;

        // Show fake keyboard popup
        this.showKeyboardPopup();

        console.log(`🎮 Glitch activated: ${glitch.name}`);

        // Schedule glitch end
        this.glitchTimer = this.scene.time.delayedCall(glitch.duration, () => {
            this.deactivateGlitch();
            this.schedulNextGlitch();
        });
    }

    deactivateGlitch() {
        this.isActive = false;
        this.currentGlitch = null;
        this.jumpQueued = false;
        this.lastDirection = null;
        this.tapCounts = { left: 0, right: 0, jump: 0 };
        GameState.wonkyActive = false;
        GameState.wonkyType = null;

        this.hideKeyboardPopup();
    }

    showKeyboardPopup() {
        const popup = document.getElementById('keyboard-popup');
        popup.classList.remove('hidden');

        // Hide after 1 second (but glitch continues!)
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 1000);
    }

    hideKeyboardPopup() {
        document.getElementById('keyboard-popup').classList.add('hidden');
    }

    // Process movement input with glitch effects
    processMovement(cursors, player) {
        if (!this.isActive) {
            // Normal controls
            return {
                left: cursors.left.isDown,
                right: cursors.right.isDown
            };
        }

        let left = cursors.left.isDown;
        let right = cursors.right.isDown;

        switch (this.currentGlitch.name) {
            case 'SWAP_CONTROLS':
                // Swap left and right
                return { left: right, right: left };

            case 'STICKY_KEYS':
                // Continue moving in last direction even after release
                if (left) this.lastDirection = 'left';
                if (right) this.lastDirection = 'right';
                if (!left && !right && this.lastDirection) {
                    return {
                        left: this.lastDirection === 'left',
                        right: this.lastDirection === 'right'
                    };
                }
                return { left, right };

            case 'DOUBLE_TAP':
                // Need to tap twice
                if (Phaser.Input.Keyboard.JustDown(cursors.left)) this.tapCounts.left++;
                if (Phaser.Input.Keyboard.JustDown(cursors.right)) this.tapCounts.right++;
                return {
                    left: left && this.tapCounts.left >= 2,
                    right: right && this.tapCounts.right >= 2
                };

            case 'RANDOM_IGNORE':
                // 20% chance to ignore input
                return {
                    left: left && Math.random() > 0.2,
                    right: right && Math.random() > 0.2
                };

            default:
                return { left, right };
        }
    }

    // Process jump input with glitch effects
    processJump(cursors, player) {
        const jumpPressed = Phaser.Input.Keyboard.JustDown(cursors.up) ||
            Phaser.Input.Keyboard.JustDown(cursors.space);

        if (!this.isActive) {
            return jumpPressed;
        }

        switch (this.currentGlitch.name) {
            case 'DELAY_JUMP':
                // Delay jump by 0.5 seconds
                if (jumpPressed && !this.jumpQueued) {
                    this.jumpQueued = true;
                    this.scene.time.delayedCall(500, () => {
                        if (player.body.onFloor()) {
                            player.setVelocityY(-400);
                        }
                        this.jumpQueued = false;
                    });
                }
                return false; // Block immediate jump

            case 'DOUBLE_TAP':
                if (jumpPressed) this.tapCounts.jump++;
                return this.tapCounts.jump >= 2 && jumpPressed;

            case 'RANDOM_IGNORE':
                return jumpPressed && Math.random() > 0.2;

            default:
                return jumpPressed;
        }
    }
}
