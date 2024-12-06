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

        this.setupInteractionDialog();
    }

    setupInteractionDialog() {
        // Create dialog container
        const dialogContainer = document.createElement('div');
        dialogContainer.id = 'interactionDialog';
        dialogContainer.style.cssText = `
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 1000;
            text-align: center;
        `;
        document.body.appendChild(dialogContainer);
    
        // Create dialog elements
        const titleElement = document.createElement('h2');
        titleElement.id = 'interactionTitle';
        dialogContainer.appendChild(titleElement);
    
        const descriptionElement = document.createElement('p');
        descriptionElement.id = 'interactionDescription';
        dialogContainer.appendChild(descriptionElement);
    
        const hotbarButton = document.createElement('button');
        hotbarButton.textContent = 'Add to Hotbar';
        hotbarButton.onclick = () => this.addItemToHotbar();
        dialogContainer.appendChild(hotbarButton);
    
        const backpackButton = document.createElement('button');
        backpackButton.textContent = 'Add to Backpack';
        backpackButton.onclick = () => this.addItemToBackpack();
        dialogContainer.appendChild(backpackButton);
    
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => this.closeInteractionDialog();
        dialogContainer.appendChild(cancelButton);
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

    handleInteraction() {
        const interactionRadius = 30;
        
        // First, check for door interactions
        for (let room of this.map.rooms) {
            for (let door of room.doors) {
                const doorCenterX = door.x + door.width/2;
                const doorCenterY = door.y + door.height/2;
                
                const dx = this.localPlayer.x - doorCenterX;
                const dy = this.localPlayer.y - doorCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < interactionRadius) {
                    door.isOpen = !door.isOpen;
                    console.log(`Door ${door.isOpen ? 'opened' : 'closed'}`);
                    return;
                }
            }
        }

        // Then check for item pickups
        const nearbyObjects = this.map.interactables.filter(obj => {
            const dx = obj.x - this.localPlayer.x;
            const dy = obj.y - this.localPlayer.y;
            return Math.sqrt(dx * dx + dy * dy) < interactionRadius;
        });

        if (nearbyObjects.length > 0) {
            const object = nearbyObjects[0];
            if (object.items && object.items.length > 0) {
                const item = object.items[Math.floor(Math.random() * object.items.length)];
                if (this.localPlayer.pickUpItem(item)) {
                    console.log(`Picked up ${item}`);
                }
            }
        }
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