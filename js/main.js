// Icy Universe - Main Game Configuration

const GAME_CONFIG = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene]
};

// Global Game State
const GameState = {
    deaths: 0,
    currentLevel: 1,
    totalDeaths: 0,
    wonkyActive: false,
    wonkyType: null,

    // Troll messages based on death count
    trollMessages: [
        { min: 0, max: 5, messages: ["Bạn làm tốt lắm!", "Cố lên nào! 🐕"] },
        { min: 6, max: 15, messages: ["Hmm... vẫn ổn mà!", "Đừng bỏ cuộc!"] },
        { min: 16, max: 30, messages: ["Ờ... bạn vẫn chơi à?", "Có lẽ nên nghỉ ngơi?"] },
        { min: 31, max: 50, messages: ["...Bạn ổn chứ?", "Game này không dành cho bạn đâu 😏"] },
        { min: 51, max: 100, messages: ["CHỊU CHƯA?!", "Bạn là masochist à? 🤔"] },
        { min: 101, max: 9999, messages: ["Tôi... ngưỡng mộ bạn", "Huyền thoại! 👑"] }
    ],

    addDeath() {
        this.deaths++;
        this.totalDeaths++;
        document.getElementById('death-count').textContent = this.deaths;
        this.showTrollMessage();
    },

    showTrollMessage() {
        const messageEl = document.getElementById('troll-message');
        const group = this.trollMessages.find(g => this.deaths >= g.min && this.deaths <= g.max);

        if (group && this.deaths % 5 === 0) { // Show every 5 deaths
            const msg = group.messages[Math.floor(Math.random() * group.messages.length)];
            messageEl.textContent = msg;
            messageEl.classList.remove('hidden');

            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, 3000);
        }
    },

    reset() {
        this.deaths = 0;
        document.getElementById('death-count').textContent = 0;
    }
};

// Start the game
const game = new Phaser.Game(GAME_CONFIG);

console.log('🐕 Icy Universe loaded! Good luck... you will need it.');
