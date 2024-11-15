<!-- all of these items have a priority of either P0 or P1 -->

1. **GameManager**

    *Purpose:*

        Manages game state, player interactions, and the overall flow of the match.

    *Variables:*

   - `gameState`: Enum for game state (e.g., 'starting', 'running', 'ended')
   - `players`: Array of player objects (students and teachers) (final)
   - `timeLeft`: Timer for match duration
   - `spawnPoints`: List of potential spawn points for players

    *Methods:*

   - `startGame()`: Starts the match, sets the game state to 'running'
   - `endGame(winner)`: Ends the match and displays results
   - `updateGame()`: Main game loop; updates the game state every frame
   - `assignRoles()`: Randomly assigns roles (students vs. teachers)
   - `checkVictoryConditions()`: Checks if any victory condition is met

---

3. **Player (Base Class)**

    *Purpose:*

        Base class for both students and teachers.

    *Variables:*

   - `name`: Player’s name (final)
   - `role`: Enum for role (Student or Teacher) (final)
   - `maxHealth`: Max amount of health for this player (final)
   - `health`: Current player health value
   - `inventory`: Array of items in the player’s possession
   - `position`: (x, y) coordinates on the map
   - `speed`: Movement speed (final)

    *Methods:*

   - `move(int direction)`: Moves the player based on WASD input
   - `interact()`: Interacts with interactable objects using the F key
   - `pickUpItem(item)`: Adds an item to the player’s inventory
   - `useItem(item)`: Uses an item from the player’s inventory

---

5. **Student (Inherits from Player)**

    *Purpose:*

        Represents a student character.

    *Methods:*

   - `alertEscape()`: Checks if the student can escape and alerts them
   - `craft(item[])`: Crafts a new item using items in inventory

---

8. **Teacher (Inherits from Player)**

    *Purpose:*

        Represents a teacher character.

    *Methods:*

   - `catchStudent(student)`: Catches students breaking rules
   - `confiscateItem(item)`: Removes forbidden items from students

---

10. **Item**

    *Purpose:*

        Represents items in the game, both allowed and forbidden.

    *Variables:*

   - `name`: Name of the item (e.g., "ruler", "paint") (final)
   - `allowed`: Indicates if the item is permitted or contraband

---

12. **Map**

    *Purpose:*

        Represents the map of the school.

    *Variables:*

   - `rooms`: Array of room objects (final)
   - `interactables`: Objects that players can interact with
   - `entrances`: Points where players can enter or exit (final)

    *Methods:*

   - `triggerEvent(event)`: Triggers specific events (e.g., fire)
   - `movePlayerToRoom(player, room)`: Moves player to a new room

---

14. **Room**

    *Purpose:*

        Represents each room; rectangular for simplicity.

    *Variables:*

   - `corners`: Coordinates of the room's corners

    *Methods:*

   - `getCorners()`: Returns the room's corners

---

16. **Interactable**

    *Purpose:*

        Represents an object players can interact with but not pick up.

    *Variables:*

   - `type`: Type of object (e.g., door, desk) (final)
   - `location`: Position on the map

    *Methods:*

   - `activate()`: Activates the object
   - `onInteract(player, type)`: Defines interaction logic

---

19. **UIManager**

    *Purpose:*

        Manages the game's user interface.

    *Variables:*

   - `healthBar`: Health bar element
   - `inventoryUI`: Inventory display

    *Methods:*

   - `updateHealthBar(player)`: Updates health bar
   - `updateInventory(player)`: Updates inventory display

---

20. **EventManager**

    *Purpose:*

        Handles events in the game world.

    *Methods:*

   - `triggerCustomEvent(event)`: Triggers a custom event
