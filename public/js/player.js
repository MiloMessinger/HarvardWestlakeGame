class Player {
    constructor(x, y, role) {
        this.x = x;
        this.y = y;
        this.role = role;
        this.size = 20;
        this.speed = role === 'teacher' ? 5 : 4;
        
        this.hotbar = new Array(2).fill(null);
        this.inventory = new Array(role === 'teacher' ? 6 : 12).fill(null);
        this.selectedSlot = 0;
        this.isInventoryOpen = false;
        
        this.lastPosition = {x, y};
        console.log("Player created:", this);
    }

    move(moveX, moveY) {
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        
        this.x += moveX * this.speed;
        this.y += moveY * this.speed;
        console.log("Player moved to:", this.x, this.y);
    }

    undoMove() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
    }

    toggleInventory() {
        console.log("Toggling inventory, current state:", this.isInventoryOpen);
        this.isInventoryOpen = !this.isInventoryOpen;
        console.log("New inventory state:", this.isInventoryOpen);
    }

    drawUI(ctx) {
        const slotSize = 40;
        const margin = 5;
        
        // Draw hotbar
        const startX = (ctx.canvas.width - (slotSize + margin) * this.hotbar.length) / 2;
        const startY = ctx.canvas.height - 60;

        // Set font before drawing text
        ctx.font = '16px Arial';

        this.hotbar.forEach((item, i) => {
            // Draw slot background
            ctx.fillStyle = '#333';
            ctx.fillRect(startX + i * (slotSize + margin), startY, slotSize, slotSize);
            
            // Draw slot border
            ctx.strokeStyle = i === this.selectedSlot ? '#ff0' : '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(startX + i * (slotSize + margin), startY, slotSize, slotSize);
            
            // Draw item if exists
            if (item) {
                ctx.fillStyle = '#fff';
                ctx.fillText(item, startX + i * (slotSize + margin) + 5, startY + 25);
            }
        });

        // Draw inventory when open
        if (this.isInventoryOpen) {
            console.log("Drawing inventory");
            
            // Draw background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(200, 100, 400, 300);
            
            // Draw inventory slots
            const invColumns = 6;
            const invStartX = 220;
            const invStartY = 120;

            this.inventory.forEach((item, i) => {
                const x = invStartX + (i % invColumns) * (slotSize + margin);
                const y = invStartY + Math.floor(i / invColumns) * (slotSize + margin);
                
                // Draw slot background
                ctx.fillStyle = '#333';
                ctx.fillRect(x, y, slotSize, slotSize);
                
                // Draw slot border
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(x, y, slotSize, slotSize);
                
                // Draw item if exists
                if (item) {
                    ctx.fillStyle = '#fff';
                    ctx.fillText(item, x + 5, y + 25);
                }
            });
        }
    }
}