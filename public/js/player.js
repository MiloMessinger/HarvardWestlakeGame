class Player {
    constructor(x, y, role, username = '') {
        this.x = x;
        this.y = y;
        this.role = role;
        this.username = username;
        this.size = 20;
        this.speed = role === 'teacher' ? 5 : 4;
        
        // Inventory system
        this.hotbar = [null, null];
        this.backpack = new Array(role === 'teacher' ? 6 : 12).fill(null);
        this.selectedSlot = 0;
        this.isBackpackOpen = false;
        
        this.lastPosition = {x, y};
        console.log("Player created:", this);
    }

    setUsername(username) {
        console.log("Setting username:", username);
        this.username = username;
    }

    move(moveX, moveY) {
        this.lastPosition = {x: this.x, y: this.y};
        this.x += moveX * this.speed;
        this.y += moveY * this.speed;
    }

    undoMove() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
    }

    selectHotbarSlot(slot) {
        console.log("Selecting hotbar slot:", slot);
        if (slot >= 0 && slot < this.hotbar.length) {
            this.selectedSlot = slot;
            return true;
        }
        return false;
    }

    getCurrentItem() {
        return this.hotbar[this.selectedSlot];
    }

    pickUpItem(itemId) {
        const item = Item.getItem(itemId);
        if (!item) return false;

        // Teachers can't pick up forbidden items
        if (this.role === 'teacher' && item.category === Item.categories.FORBIDDEN) {
            return false;
        }

        // Try hotbar first
        const emptyHotbarSlot = this.hotbar.findIndex(slot => slot === null);
        if (emptyHotbarSlot !== -1) {
            this.hotbar[emptyHotbarSlot] = itemId;
            return true;
        }

        // Try backpack if hotbar is full
        const emptyInvSlot = this.backpack.findIndex(slot => slot === null);
        if (emptyInvSlot !== -1) {
            this.backpack[emptyInvSlot] = itemId;
            return true;
        }

        return false;
    }

    useCurrentItem() {
        const itemId = this.getCurrentItem();
        if (itemId) {
            const item = Item.getItem(itemId);
            if (item) {
                return item.use(this);
            }
        }
        return false;
    }

    toggleBackpack() {
        this.isBackpackOpen = !this.isBackpackOpen;
        console.log("Backpack toggled:", this.isBackpackOpen);
    }

    draw(ctx, camera) {
        // Draw player
        ctx.fillStyle = this.role === 'student' ? '#0000FF' : '#FF0000';
        ctx.fillRect(
            Math.floor(this.x - this.size/2),
            Math.floor(this.y - this.size/2),
            this.size,
            this.size
        );

        // Draw username above player
        if (this.username) {
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(this.username, this.x, this.y - this.size/2 - 5);
            ctx.restore();
        }
    }

    drawUI(ctx) {
        // Save the initial context state
        ctx.save();

        const slotSize = 40;
        const margin = 5;
        const startX = (ctx.canvas.width - (slotSize + margin) * this.hotbar.length) / 2;
        const startY = ctx.canvas.height - 60;

        // Draw hotbar
        this.hotbar.forEach((itemId, i) => {
            ctx.save();  // Save state for each slot

            // Slot background
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.fillRect(startX + i * (slotSize + margin), startY, slotSize, slotSize);
            ctx.closePath();
            
            // Selected slot highlight
            ctx.strokeStyle = i === this.selectedSlot ? '#ff0' : '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.strokeRect(startX + i * (slotSize + margin), startY, slotSize, slotSize);
            ctx.closePath();
            
            // Draw item if exists
            if (itemId) {
                const item = Item.getItem(itemId);
                if (item) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '12px Arial';
                    ctx.fillText(item.name, startX + i * (slotSize + margin) + 5, startY + 25);
                }
            }

            // Draw slot number
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(`${i + 1}`, startX + i * (slotSize + margin) + 2, startY + 12);

            ctx.restore();  // Restore state for each slot
        });

        // Draw backpack when open
        if (this.isBackpackOpen) {
            const invColumns = 6;
            const invRows = Math.ceil(this.backpack.length / invColumns);
            const backpackWidth = (slotSize + margin) * invColumns + margin;
            const backpackHeight = (slotSize + margin) * invRows + 50; // Extra 50px for title
            const backpackX = (ctx.canvas.width - backpackWidth) / 2;
            const backpackY = (ctx.canvas.height - backpackHeight) / 2;

            // Semi-transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(backpackX, backpackY, backpackWidth, backpackHeight);

            // Draw "Backpack" title
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Backpack', backpackX + backpackWidth/2, backpackY + 30);
            
            // Reset text align for item names
            ctx.textAlign = 'left';

            // Draw backpack slots
            this.backpack.forEach((itemId, i) => {
                const x = backpackX + margin + (i % invColumns) * (slotSize + margin);
                const y = backpackY + 45 + Math.floor(i / invColumns) * (slotSize + margin);
                
                // Slot background
                ctx.fillStyle = '#333';
                ctx.fillRect(x, y, slotSize, slotSize);
                
                // Slot border
                ctx.strokeStyle = '#666';
                ctx.strokeRect(x, y, slotSize, slotSize);
                
                // Draw item if exists
                if (itemId) {
                    const item = Item.getItem(itemId);
                    if (item) {
                        ctx.fillStyle = '#fff';
                        ctx.font = '12px Arial';
                        ctx.fillText(item.name, x + 5, y + 25);
                    }
                }
            });
        }
    }
}