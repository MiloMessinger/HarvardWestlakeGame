class Player {
    constructor(x, y, role) {
        console.log(`Creating new player at (${x}, ${y}) with role ${role}`);
        this.x = x;
        this.y = y;
        this.role = role;
        this.speed = 5;
        this.size = 20;
    }

    move(direction) {
        const rad = direction * (Math.PI / 180);
        this.x += Math.cos(rad) * this.speed;
        this.y += Math.sin(rad) * this.speed;

        // Keep player within canvas bounds
        this.x = Math.max(this.size/2, Math.min(800 - this.size/2, this.x));
        this.y = Math.max(this.size/2, Math.min(600 - this.size/2, this.y));
        console.log(`Player moved to (${this.x}, ${this.y})`);
    }

    draw(ctx) {
        console.log(`Drawing player at (${this.x}, ${this.y})`);
        ctx.fillStyle = this.role === 'student' ? '#00f' : '#f00';
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}