class Map {
    constructor() {
        // Define basic rooms
        this.rooms = [
            { x: 100, y: 100, width: 200, height: 150, type: 'classroom' },
            { x: 400, y: 100, width: 200, height: 150, type: 'classroom' },
            { x: 100, y: 300, width: 200, height: 150, type: 'classroom' },
            { x: 400, y: 300, width: 200, height: 150, type: 'classroom' }
        ];

        this.hallways = [
            { x: 300, y: 100, width: 100, height: 150 },
            { x: 300, y: 300, width: 100, height: 150 },
            { x: 100, y: 250, width: 500, height: 50 }
        ];

        this.interactables = [
            { x: 150, y: 150, type: 'desk', items: ['pencil', 'paper'] },
            { x: 450, y: 150, type: 'desk', items: ['ruler', 'scissors'] },
            { x: 150, y: 350, type: 'desk', items: ['textbook', 'pen'] },
            { x: 450, y: 350, type: 'desk', items: ['calculator', 'compass'] }
        ];
    }

    getRandomSpawnPoint() {
        const hallway = this.hallways[Math.floor(Math.random() * this.hallways.length)];
        return {
            x: hallway.x + hallway.width / 2,
            y: hallway.y + hallway.height / 2
        };
    }

    canMoveTo(x, y) {
        return this.rooms.some(room => 
            x >= room.x && x <= room.x + room.width &&
            y >= room.y && y <= room.y + room.height
        ) || this.hallways.some(hall => 
            x >= hall.x && x <= hall.x + hall.width &&
            y >= hall.y && y <= hall.y + hall.height
        );
    }

    getNearbyInteractables(x, y, radius = 30) {
        return this.interactables.filter(obj => {
            const dx = obj.x - x;
            const dy = obj.y - y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    }

    draw(ctx) {
        // Draw rooms
        ctx.fillStyle = '#ddd';
        this.rooms.forEach(room => {
            ctx.fillRect(room.x, room.y, room.width, room.height);
            ctx.strokeRect(room.x, room.y, room.width, room.height);
        });

        // Draw hallways
        ctx.fillStyle = '#eee';
        this.hallways.forEach(hall => {
            ctx.fillRect(hall.x, hall.y, hall.width, hall.height);
            ctx.strokeRect(hall.x, hall.y, hall.width, hall.height);
        });

        // Draw interactables
        ctx.fillStyle = '#999';
        this.interactables.forEach(obj => {
            ctx.fillRect(obj.x - 10, obj.y - 10, 20, 20);
        });
    }
}