# School Game Project

## Project Setup

1. Clone the repository
2. Install Firebase CLI if not already installed: `npm install -g firebase-tools`
3. No other installs are required beyond firebase.
4. Project should now be ready to run

## Project Structure

### Key Classes

#### GameManager
- Main game controller
- Handles game loop, input processing, and state management
- Coordinates between Map, Player, and TextureLoader
- Manages camera positioning and rendering

#### Player
- Handles player movement and rendering
- Manages inventory system (hotbar and backpack)
- Processes player interactions
- Supports different roles (student/teacher) with varying capabilities

#### Map
- Manages game world layout including rooms, hallways, and walls
- Handles collision detection
- Controls door mechanics
- Processes interactions with map objects

#### TextureLoader
- Loads and manages game textures
- Ensures textures are available before game starts
- Provides texture access to Map and Player classes

### Class Interactions
- GameManager creates instances of Map and Player
- Map uses TextureLoader to render the game world
- Player interacts with Map for collision detection and object interaction
- GameManager coordinates all updates and rendering each frame

### File Structure
```
public/
├── assets/
│   └── textures/
│       ├── floor-tile.jpg
│       ├── hallway-floor.jpg
│       ├── wall-horizontal.jpg
│       ├── wall-vertical.jpg
│       └── wall-corner.jpg
├── js/
│   ├── game.js
│   ├── player.js
│   ├── map.js
│   └── textureLoader.js
└── index.html
```

## Development Tools Used

- Firebase
- Chose not to use library such as construct as it would greatly increase the learning curve for the limited time in this project which is only a 2d game. Using a library may have made things look a little bit nicer, but working around it while trying to use AI would be difficult.

## Current Features

- Player movement with WASD/arrow keys
- Inventory system with hotbar (2 slots) and backpack
- Username display
- Basic item pickup system (untested)
- Texture-based rendering
- Camera following player

## Notes for Future Development

- The game is currently single-player; multiplayer functionality needs to be implemented
- Item usage system needs to be expanded
- Victory conditions need to be implemented
- Additional rooms and interactables can be added by modifying the Map class

## Running the Project

Run `firebase serve` to start the development server. The game will be available at `localhost:5000`.