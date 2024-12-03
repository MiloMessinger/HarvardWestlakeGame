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
                width: 300,
                height: 200,
                type: 'classroom',
                doors: [
                    {x: 240, y: 300, width: 40, height: 8, isOpen: false}
                ],
                name: "Room 101"
            },
            {
                x: 500,
                y: 100,
                width: 300,
                height: 200,
                type: 'classroom',
                doors: [
                    {x: 640, y: 300, width: 40, height: 8, isOpen: false}
                ],
                name: "Room 102"
            },
            {
                x: 100,
                y: 400,
                width: 300,
                height: 200,
                type: 'classroom',
                doors: [
                    {x: 240, y: 400, width: 40, height: 8, isOpen: false}
                ],
                name: "Room 103"
            },
            {
                x: 500,
                y: 400,
                width: 300,
                height: 200,
                type: 'classroom',
                doors: [
                    {x: 640, y: 400, width: 40, height: 8, isOpen: false}
                ],
                name: "Room 104"
            }
        ];

        // Define the main hallway
        this.hallways = [
            {x: 0, y: 300, width: 900, height: 100} // Main hallway
        ];

        this.walls = this.generateWalls();

        this.interactables = [
            {x: 150, y: 150, type: 'desk', items: ['pencil', 'paper']}
        ];
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
                y: room.y + room.height,
                width: room.width,
                height: this.wallThickness,
                direction: 'horizontal'
            });
            
            // West wall
            walls.push({
                x: room.x,
                y: room.y,
                width: this.wallThickness,
                height: room.height + this.wallThickness,
                direction: 'vertical'
            });
            
            // East wall
            walls.push({
                x: room.x + room.width - this.wallThickness,
                y: room.y,
                width: this.wallThickness,
                height: room.height + this.wallThickness,
                direction: 'vertical'
            });
        });

        // Add hallway walls
        this.hallways.forEach(hall => {
            // North wall
            walls.push({
                x: hall.x,
                y: hall.y,
                width: hall.width,
                height: this.wallThickness,
                direction: 'horizontal'
            });
            
            // South wall
            walls.push({
                x: hall.x,
                y: hall.y + hall.height,
                width: hall.width,
                height: this.wallThickness,
                direction: 'horizontal'
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

    getRandomSpawnPoint() {
        const hallway = this.hallways[0]; // Use main hallway for spawning
        return {
            x: hallway.x + hallway.width/2,
            y: hallway.y + hallway.height/2
        };
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