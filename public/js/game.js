class GameManager {
    constructor() {
        console.log("Starting game initialization");
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.map = new Map();
        const spawnPoint = this.map.getRandomSpawnPoint();
        this.localPlayer = new Player(spawnPoint.x, spawnPoint.y, Math.random() < 0.2 ? 'teacher' : 'student');
        this.players = [this.localPlayer];

        this.cameraX = 0;
        this.cameraY = 0;
        
        this.keys = {};
        this.isPaused = true;  // Start paused
        this.setupInputs();
        this.gameLoop();
    }

    start(username) {
        this.localPlayer.username = username;
        this.isPaused = false;
        console.log("Game started with username:", username);
    }

    pause() {
        this.isPaused = true;
        // Clear all pressed keys when pausing
        this.keys = {};
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupInputs() {
        window.addEventListener('keydown', (e) => {
            // Only handle game inputs if not paused
            if (!this.isPaused) {
                this.keys[e.key.toLowerCase()] = true;
                
                // Handle hotbar selection
                if (e.key === '1' || e.key === '2') {
                    e.preventDefault();
                    this.localPlayer.selectHotbarSlot(parseInt(e.key) - 1);
                }
                
                // Handle backpack toggle
                if (e.key.toLowerCase() === 'e') {
                    e.preventDefault();
                    this.localPlayer.toggleBackpack();
                }
                
                // Handle interaction
                if (e.key.toLowerCase() === 'f') {
                    e.preventDefault();
                    if (this.localPlayer.getCurrentItem()) {
                        this.localPlayer.useCurrentItem();
                    } else {
                        this.handleInteraction();
                    }
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (!this.isPaused) {
                this.keys[e.key.toLowerCase()] = false;
            }
        });
    }

    update() {
        let moveX = 0;
        let moveY = 0;
        
        if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
        if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
        if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        if (moveX !== 0 || moveY !== 0) {
            console.log("Moving player:", moveX, moveY);
            this.localPlayer.move(moveX, moveY);
        }

        this.cameraX = this.canvas.width/2 - this.localPlayer.x;
        this.cameraY = this.canvas.height/2 - this.localPlayer.y;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(Math.floor(this.cameraX), Math.floor(this.cameraY));
        
        // Draw map with its own context state
        this.map.draw(this.ctx);
        
        // Draw all players with their usernames
        this.players.forEach(player => {
            player.draw(this.ctx, {x: this.cameraX, y: this.cameraY});
        });
        
        this.ctx.restore();
        
        // Draw UI elements after restore
        this.localPlayer.drawUI(this.ctx);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Ensure game only starts after window loads
window.onload = () => {
    console.log("Window loaded, creating game");
    new GameManager();
};