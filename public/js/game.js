class GameManager {
    constructor() {
        console.log("GameManager constructor starting...");
        
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error("Canvas element not found!");
            return;
        }
        console.log("Canvas found:", this.canvas);

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error("Could not get canvas context!");
            return;
        }
        console.log("Canvas context acquired");

        // Draw background to verify canvas is working
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.players = [];
        console.log("Creating local player...");
        this.localPlayer = new Player(400, 300, 'student');
        console.log("Local player created:", this.localPlayer);
        
        this.players.push(this.localPlayer);
        console.log("Player added to players array. Total players:", this.players.length);
        
        // Input handling
        this.keys = {};
        this.setupInputs();
        console.log("Input handlers set up");
        
        // Start game loop
        console.log("Starting game loop...");
        this.gameLoop();
    }

    setupInputs() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            console.log("Key pressed:", e.key.toLowerCase());
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    update() {
        // Handle movement based on WASD keys
        if (this.keys['w'] && this.keys['d']) {
            this.localPlayer.move(315);
            console.log("Moving NW", this.localPlayer.x, this.localPlayer.y);
        }
        else if (this.keys['w'] && this.keys['a']) this.localPlayer.move(225);
        else if (this.keys['s'] && this.keys['d']) this.localPlayer.move(45);
        else if (this.keys['s'] && this.keys['a']) this.localPlayer.move(135);
        else if (this.keys['w']) this.localPlayer.move(270);
        else if (this.keys['s']) this.localPlayer.move(90);
        else if (this.keys['a']) this.localPlayer.move(180);
        else if (this.keys['d']) this.localPlayer.move(0);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all players
        this.players.forEach((player, index) => {
            console.log(`Drawing player ${index}:`, player);
            player.draw(this.ctx);
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Make sure DOM is loaded before starting game
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, starting game...");
    window.gameInstance = new GameManager();
});

// Backup initialization in case DOMContentLoaded doesn't fire
window.onload = () => {
    console.log("Window loaded...");
    if (!window.gameInstance) {
        console.log("No game instance found, creating one...");
        window.gameInstance = new GameManager();
    }
};