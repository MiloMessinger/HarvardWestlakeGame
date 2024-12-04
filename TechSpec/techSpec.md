# TechSpec.md

1. **GameManager** [P0]

    *Purpose:*

        Manages game state, player interactions, texture loading, and the overall flow of the match.

    *Variables:*

   - `canvas` [P0]: HTML canvas element for game rendering (final)
   - `ctx` [P0]: Canvas rendering context (final)
   - `textureLoader` [P0]: Handles loading and managing game textures (final)
   - `map` [P0]: Map instance containing game layout (final)
   - `localPlayer` [P0]: The current player's instance
   - `players` [P0]: Array of all players in the game
   - `cameraX/Y` [P0]: Camera offset coordinates for viewport centering
   - `keys` [P0]: Object tracking currently pressed keys
   - `isPaused` [P0]: Boolean indicating if game is paused

    *Methods:*

   - `setupInputs()` [P0]: Initializes keyboard input handlers
   - `handleInteraction()` [P0]: Processes player interactions with doors and items
   - `update()` [P0]: Updates game state each frame
   - `draw()` [P0]: Renders the game each frame
   - `startGameWhenLoaded()` [P0]: Initializes game after textures load
   - `start(username)` [P0]: Starts gameplay with player username

---

2. **Player** [P0]

    *Purpose:*

        Represents a player character with movement, inventory management, and rendering capabilities.

    *Variables:*

   - `x/y` [P0]: Player coordinates on map (final)
   - `role` [P0]: Player role (student/teacher) (final)
   - `username` [P0]: Player's display name
   - `size` [P0]: Player's collision radius
   - `speed` [P0]: Movement speed (varies by role)
   - `hotbar` [P0]: Two-slot quick access inventory
   - `backpack` [P0]: Main inventory storage (size varies by role)
   - `selectedSlot` [P0]: Currently selected hotbar slot
   - `isBackpackOpen` [P0]: Tracks if backpack UI is visible

    *Methods:*

   - `move(moveX, moveY)` [P0]: Handles player movement
   - `draw(ctx)` [P0]: Renders player character
   - `drawUI(ctx)` [P0]: Renders inventory interface
   - `selectHotbarSlot(slot)` [P0]: Changes active hotbar slot
   - `pickUpItem(itemId)` [P0]: Adds items to inventory
   - `toggleBackpack()` [P0]: Shows/hides backpack interface

---

3. **Map** [P0]

    *Purpose:*

        Manages game world layout including rooms, walls, doors, and collision detection.

    *Variables:*

   - `textureLoader` [P0]: Reference to game's texture system (final)
   - `rooms` [P0]: Array of classroom definitions (final)
   - `walls` [P0]: Array of wall collision boundaries (final)
   - `hallways` [P0]: Array of hallway definitions (final)
   - `interactables` [P0]: Array of interactive objects
   - `wallThickness` [P0]: Standard wall collision width (final)

    *Methods:*

   - `generateWalls()` [P0]: Creates wall colliders from room definitions
   - `canMoveTo(x, y, radius)` [P0]: Checks if position is valid for movement
   - `collidesWith(x, y, radius, rect)` [P0]: Handles collision detection
   - `getDoorAt(x, y, width, height)` [P0]: Finds door at given position
   - `draw(ctx)` [P0]: Renders map elements

---

4. **TextureLoader** [P0]

    *Purpose:*

        Handles loading and managing game textures for consistent rendering.

    *Variables:*

   - `textures` [P0]: Object storing loaded texture images (final)
   - `loaded` [P0]: Boolean indicating if all textures are ready
   - `totalTextures` [P0]: Count of textures to load (final)
   - `loadedTextures` [P0]: Count of currently loaded textures

    *Methods:*

   - `loadTexture(name, path)` [P0]: Loads individual texture
   - `getTexture(name)` [P0]: Retrieves loaded texture
   - `loadAllTextures()` [P0]: Initiates loading of all game textures
   - `isLoaded()` [P0]: Checks if all textures are ready

---