class GameManager {
    constructor() {
        console.log("Starting game initialization");
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize texture loader first
        this.textureLoader = new TextureLoader();
        this.textureLoader.loadAllTextures();
        
        // Initialize other properties
        this.keys = {};
        this.isPaused = true;
        
        // Wait for textures to load before creating map
        this.startGameWhenLoaded();

        // Setup start button listener
        this.setupStartButton();
    }

    setupStartButton() {
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            if (username.trim() !== '') {
                document.getElementById('loginOverlay').classList.add('hidden');
                document.getElementById('gameCanvas').style.filter = 'none';
                this.start(username);
            }
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startGameWhenLoaded() {
        if (this.textureLoader.isLoaded()) {
            console.log("Textures loaded, initializing game...");
            this.initializeGame();
        } else {
            requestAnimationFrame(() => this.startGameWhenLoaded());
        }
    }

    initializeGame() {
        // Initialize map after textures are loaded
        this.map = new Map(this.textureLoader);
        
        const spawnPoint = this.map.getRandomSpawnPoint();
        this.localPlayer = new Player(spawnPoint.x, spawnPoint.y, Math.random() < 0.2 ? 'teacher' : 'student');
        this.players = [this.localPlayer];

        this.cameraX = 0;
        this.cameraY = 0;
        
        this.setupInputs();
        this.gameLoop();
    }

    setupInputs() {
        window.addEventListener('keydown', (e) => {
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
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    start(username) {
        console.log("Starting game with username:", username);
        if (this.localPlayer) {
            this.localPlayer.setUsername(username);
            this.isPaused = false;
            console.log("Game started, isPaused:", this.isPaused);
        }
    }

    update() {
        if (this.isPaused) return;

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
        
        // Draw map
        this.map.draw(this.ctx);
        
        // Draw all players
        this.players.forEach(player => {
            player.draw(this.ctx);
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