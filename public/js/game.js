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

        this.canvas.addEventListener('click', (e) => this.handleInventoryClick(e)); 
    }

    handleInventoryClick(e) {
        if (!this.localPlayer.isBackpackOpen) return;

        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Constants for inventory UI (matching the ones in drawUI)
        const slotSize = 40;
        const margin = 5;
        
        // Hotbar position
        const hotbarStartX = (this.canvas.width - (slotSize + margin) * this.localPlayer.hotbar.length) / 2;
        const hotbarStartY = this.canvas.height - 60;

        // Backpack position
        const invColumns = 6;
        const invRows = Math.ceil(this.localPlayer.backpack.length / invColumns);
        const backpackWidth = (slotSize + margin) * invColumns + margin;
        const backpackHeight = (slotSize + margin) * invRows + 50;
        const backpackX = (this.canvas.width - backpackWidth) / 2;
        const backpackY = (this.canvas.height - backpackHeight) / 2;

        // Check if click is on hotbar
        for (let i = 0; i < this.localPlayer.hotbar.length; i++) {
            const slotX = hotbarStartX + i * (slotSize + margin);
            const slotY = hotbarStartY;

            if (clickX >= slotX && clickX < slotX + slotSize &&
                clickY >= slotY && clickY < slotY + slotSize) {
                this.moveItemToBackpack(i);
                return;
            }
        }

        // Check if click is on backpack
        for (let i = 0; i < this.localPlayer.backpack.length; i++) {
            const x = backpackX + margin + (i % invColumns) * (slotSize + margin);
            const y = backpackY + 45 + Math.floor(i / invColumns) * (slotSize + margin);

            if (clickX >= x && clickX < x + slotSize &&
                clickY >= y && clickY < y + slotSize) {
                this.moveItemToHotbar(i);
                return;
            }
        }
    }

    moveItemToBackpack(hotbarIndex) {
        const hotbarItem = this.localPlayer.hotbar[hotbarIndex];
        if (!hotbarItem) return; // No item to move

        // Find empty backpack slot
        const emptyBackpackSlot = this.localPlayer.backpack.findIndex(slot => slot === null);
        if (emptyBackpackSlot !== -1) {
            // Move item to backpack
            this.localPlayer.backpack[emptyBackpackSlot] = hotbarItem;
            this.localPlayer.hotbar[hotbarIndex] = null;
            console.log(`Moved ${hotbarItem} from hotbar to backpack slot ${emptyBackpackSlot}`);
        } else {
            // Try to swap with first non-null backpack slot
            const firstBackpackSlot = this.localPlayer.backpack.findIndex(slot => slot !== null);
            if (firstBackpackSlot !== -1) {
                const backpackItem = this.localPlayer.backpack[firstBackpackSlot];
                this.localPlayer.backpack[firstBackpackSlot] = hotbarItem;
                this.localPlayer.hotbar[hotbarIndex] = backpackItem;
                console.log(`Swapped ${hotbarItem} with ${backpackItem}`);
            } else {
                console.log("Backpack is empty, cannot swap");
            }
        }
    }

    moveItemToHotbar(backpackIndex) {
        const backpackItem = this.localPlayer.backpack[backpackIndex];
        if (!backpackItem) return; // No item to move

        // Find empty hotbar slot
        const emptyHotbarSlot = this.localPlayer.hotbar.findIndex(slot => slot === null);
        if (emptyHotbarSlot !== -1) {
            // Move item to hotbar
            this.localPlayer.hotbar[emptyHotbarSlot] = backpackItem;
            this.localPlayer.backpack[backpackIndex] = null;
            console.log(`Moved ${backpackItem} from backpack to hotbar slot ${emptyHotbarSlot}`);
        } else {
            // Try to swap with selected hotbar slot
            const selectedSlot = this.localPlayer.selectedSlot;
            const hotbarItem = this.localPlayer.hotbar[selectedSlot];
            this.localPlayer.hotbar[selectedSlot] = backpackItem;
            this.localPlayer.backpack[backpackIndex] = hotbarItem;
            console.log(`Swapped ${backpackItem} with ${hotbarItem}`);
        }
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
                this.showInteractionDialog(item);
            }
        }
    }

    showInteractionDialog(itemId) {
        const item = Item.getItem(itemId);
        if (!item) return;
    
        const dialogContainer = document.getElementById('interactionDialog');
        const titleElement = document.getElementById('interactionTitle');
        const descriptionElement = document.getElementById('interactionDescription');
    
        titleElement.textContent = item.name;
        descriptionElement.textContent = item.getDescription();
    
        // Store current item for later use
        this.currentInteractionItem = itemId;
    
        dialogContainer.style.display = 'block';
        this.canvas.style.filter = 'blur(5px)';
    }

    addItemToHotbar() {
        if (this.currentInteractionItem) {
            const hotbarResult = this.localPlayer.pickUpItem(this.currentInteractionItem);
            if (hotbarResult) {
                console.log("Added item to hotbar:", this.currentInteractionItem);
            }
            this.closeInteractionDialog();
        }
    }
    
    addItemToBackpack() {
        if (this.currentInteractionItem) {
            // Directly try to add to backpack instead of using pickUpItem
            const emptyBackpackSlot = this.localPlayer.backpack.findIndex(slot => slot === null);
            if (emptyBackpackSlot !== -1) {
                this.localPlayer.backpack[emptyBackpackSlot] = this.currentInteractionItem;
                console.log("Added item to backpack slot:", emptyBackpackSlot);
            } else {
                console.log("Backpack is full");
            }
            this.closeInteractionDialog();
        }
    }
    
    closeInteractionDialog() {
        const dialogContainer = document.getElementById('interactionDialog');
        dialogContainer.style.display = 'none';
        this.canvas.style.filter = 'none';
        this.currentInteractionItem = null;
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