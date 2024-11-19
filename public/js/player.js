class Player {
    constructor(x, y, role, username = '') {
        this.x = x;
        this.y = y;
        this.role = role;
        this.username = username;
        this.size = 20;
        this.speed = role === 'teacher' ? 5 : 4;
        
        // Updated inventory system
        this.hotbar = [null, null]; // Always 2 slots
        this.inventory = new Array(role === 'teacher' ? 6 : 12).fill(null);
        this.selectedSlot = 0;
        this.isInventoryOpen = false;
        
        this.lastPosition = {x, y};
    }

    selectHotbarSlot(slot) {
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

        // Try inventory if hotbar is full
        const emptyInvSlot = this.inventory.findIndex(slot => slot === null);
        if (emptyInvSlot !== -1) {
            this.inventory[emptyInvSlot] = itemId;
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

    drawUI(ctx) {
        const slotSize = 40;
        const margin = 5;
        const startX = (ctx.canvas.width - (slotSize + margin) * this.hotbar.length) / 2;
        const startY = ctx.canvas.height - 60;

        // Draw hotbar
        this.hotbar.forEach((itemId, i) => {
            // Slot background
            ctx.fillStyle = '#333';
            ctx.fillRect(startX + i * (slotSize + margin), startY, slotSize, slotSize);
            
            // Selected slot highlight
            ctx.strokeStyle = i === this.selectedSlot ? '#ff0' : '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(startX + i * (slotSize + margin), startY, slotSize, slotSize);
            
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
        });

        // Draw inventory when open
        if (this.isInventoryOpen) {
            // Semi-transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(200, 100, 400, 300);

            // Draw inventory slots
            const invColumns = 6;
            this.inventory.forEach((itemId, i) => {
                const x = 220 + (i % invColumns) * (slotSize + margin);
                const y = 120 + Math.floor(i / invColumns) * (slotSize + margin);
                
                // Slot background
                ctx.fillStyle = '#333';
                ctx.fillRect(x, y, slotSize, slotSize);
                
                // Slot border
                ctx.strokeStyle = '#fff';
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