class Map {
    constructor(textureLoader) {
        this.textureLoader = textureLoader;
        
        // Wall thickness
        this.wallThickness = 8;
        
        // Define rooms with walls and doors
        this.rooms = [
            {
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                type: 'classroom',
                doors: [
                    {x: 180, y: 100, width: 40, height: 8, isOpen: false} // North door
                ],
                name: "Room 101"
            }
            // Add more rooms as needed
        ];

        // Define walls
        this.walls = this.generateWalls();
        
        // Define hallways (now just used for spawn points)
        this.hallways = [
            {x: 300, y: 100, width: 100, height: 150}
        ];

        this.interactables = [
            {x: 150, y: 150, type: 'desk', items: ['pencil', 'paper']}
        ];
    }

    getRandomSpawnPoint() {
        const hallway = this.hallways[Math.floor(Math.random() * this.hallways.length)];
        return {
            x: hallway.x + hallway.width / 2,
            y: hallway.y + hallway.height / 2
        };
    }

    generateWalls() {
        let walls = [];
        
        // Generate walls for each room
        this.rooms.forEach(room => {
            // North wall
            walls.push({
                x: room.x,
                y: room.y,
                width: room.width,
                height: this.wallThickness,
                direction: 'horizontal'
            });
            
            // South wall
            walls.push({
                x: room.x,
                y: room.y + room.height - this.wallThickness,
                width: room.width,
                height: this.wallThickness,
                direction: 'horizontal'
            });
            
            // West wall
            walls.push({
                x: room.x,
                y: room.y,
                width: this.wallThickness,
                height: room.height,
                direction: 'vertical'
            });
            
            // East wall
            walls.push({
                x: room.x + room.width - this.wallThickness,
                y: room.y,
                width: this.wallThickness,
                height: room.height,
                direction: 'vertical'
            });
        });

        return walls;
    }

    canMoveTo(x, y, radius = 10) {
        // Check wall collisions
        for (let wall of this.walls) {
            if (this.collidesWith(x, y, radius, wall)) {
                // Check if there's a door here and if it's open
                let doorHere = this.getDoorAt(wall.x, wall.y, wall.width, wall.height);
                if (!doorHere || !doorHere.isOpen) {
                    return false;
                }
            }
        }
        return true;
    }

    collidesWith(x, y, radius, rect) {
        let testX = x;
        let testY = y;

        if (x < rect.x) testX = rect.x;
        else if (x > rect.x + rect.width) testX = rect.x + rect.width;
        
        if (y < rect.y) testY = rect.y;
        else if (y > rect.y + rect.height) testY = rect.y + rect.height;

        let distX = x - testX;
        let distY = y - testY;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        return distance <= radius;
    }

    getDoorAt(x, y, width, height) {
        for (let room of this.rooms) {
            for (let door of room.doors) {
                if (this.rectsOverlap(
                    {x, y, width, height},
                    door
                )) {
                    return door;
                }
            }
        }
        return null;
    }

    rectsOverlap(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    toggleDoorAt(x, y) {
        for (let room of this.rooms) {
            for (let door of room.doors) {
                if (this.collidesWith(x, y, 20, door)) {
                    door.isOpen = !door.isOpen;
                    return true;
                }
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.save();

        // Draw floor first
        for (let room of this.rooms) {
            // Draw room floor
            let pattern = ctx.createPattern(this.textureLoader.getTexture('floor-tile'), 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(room.x, room.y, room.width, room.height);
            
            // Draw room name
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(room.name, room.x + room.width/2, room.y + room.height/2);
        }

        // Draw walls
        for (let wall of this.walls) {
            let texture = this.textureLoader.getTexture(
                wall.direction === 'horizontal' ? 'wall-h' : 'wall-v'
            );
            ctx.drawImage(texture, wall.x, wall.y, wall.width, wall.height);
        }

        // Draw doors
        for (let room of this.rooms) {
            for (let door of room.doors) {
                let doorTexture = this.textureLoader.getTexture(
                    door.isOpen ? 'door-open' : 'door-closed'
                );
                ctx.drawImage(doorTexture, door.x, door.y, door.width, door.height);
            }
        }

        // Draw interactables
        for (let obj of this.interactables) {
            ctx.fillStyle = '#999';
            ctx.fillRect(obj.x - 10, obj.y - 10, 20, 20);
        }

        ctx.restore();
    }
}