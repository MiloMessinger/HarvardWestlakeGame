Techology Stack:

The best option I found seemed to be Construct 3.

Pros: So, there's gonna be multiple people coding this. If there was just one, I could choose which game engine to use to tailor to that person's skills, but since there's gonna be a bunch, I think it's best to assume the worst of everyone, and imagine that they, like me, do not know how to code javascript or html. In that case, Construct 3 is great because you don't have to do any coding. Meanwhile, even if you're an Edwin or a Milo that actually knows how to use html and js, Construct 3 allows you to add in code, which is awesome. (PS: I know that AI exists and would be doing most of the coding, but AI doesn't do things perfectly and if you don't know how to code in html or js then it's really hard to debug in html or js). Also, C3 allows you to look at what you're making as you make it and seems intuitive to use. And it's the game engine that There Is No Game was made on, which is cool. It's also apparently powerful and fast. They did tests with how many sprites different devices could handle, and the numbers they got seem pretty big to me.

Cons: No cons??? Based. (Except that some people might not want to figure out how to use the Construct 3 UI. "Some people" includes me. But it's better than figuring out how to debug code in a language I can't code in.)



# TechSpec.md

1. **GameManager** [P0]

    *Purpose:*

        Manages game state, player interactions, and the overall flow of the match.

    *Variables:*

   - `gameState` [P0]: Enum for game state (e.g., 'starting', 'running', 'ended')
   - `players` [P0]: Array of player objects (students and teachers) (final)
   - `timeLeft` [P1]: Timer for match duration
   - `spawnPoints` [P1]: List of potential spawn points for players

    *Methods:*

   - `startGame()` [P0]: Starts the match, sets the game state to 'running'
   - `endGame(winner)` [P0]: Ends the match and displays results
   - `updateGame()` [P0]: Main game loop; Updates the game state every frame
   - `assignRoles()` [P1]: Randomly assigns roles (students vs. teachers)
   - `respawnPlayer(player)` [P2]: Handles respawn logic in the office
   - `checkVictoryConditions()` [P0]: Checks if any victory condition is met (e.g., students escaping or time running out)

---

3. **Player (Base Class)** [P0]

    *Purpose:*

        Base class for both students and teachers.

    *Variables:*

   - `name` [P0]: Player’s name (final)
   - `role` [P0]: Enum for role (Student or Teacher) (final)
   - `maxHealth` [P1]: Max amount of health for this player (final)
   - `health` [P1]: Current player health value
   - `inventory` [P0]: Array of items in the player’s possession
   - `position` [P0]: (x, y) coordinates on the map
   - `speed` [P1]: Movement speed (final)

    *Methods:*

   - `move(int direction)` [P0]: Moves the player based on WASD input. The int is measured in degrees like polar coordinates; it must be a multiple of 45 (orthogonal or diagonal movement only).
   - `interact()` [P0]: Interacts with interactable objects using the F key
   - `pickUpItem(item)` [P0]: Adds an item to the player’s inventory
   - `dropItem(item)` [P2]: Drops an item from the player's inventory
   - `useItem(item)` [P1]: Uses an item from the player’s inventory
   - `die()` [P2]: Handles player death, respawn logic, and sends to the office

---

5. **Student (Inherits from Player)** [P0]

    *Purpose:*

        Represents a student character.

    *Variables:*

   - `assignments` [P2]: Array of assignment objects the student must complete
   - `classes` [P2]: 2D array for each class; one row contains the room a class is in, and the other row contains the time they must attend.

    *Methods:*

   - `isInOffice` [P2]: Boolean indicating whether the player is in the office
   - `completeAssignment()` [P2]: Marks assignments as complete and rewards with credits or items
   - `alertEscape()` [P1]: Checks if the student can escape the school and alerts them when they can win (e.g., if they've started a disaster).
   - `craft(item[])` [P1]: Crafts a new item using items in inventory
   - `goToOffice()` [P2]: Screen filling out detention form, wait 30 seconds as they write, then respawn in the office
   - `draw()` [P2]: Allows student to draw on the screen (only in the office)
   - `erase()` [P2]: Allows student to erase their writing (only in the office)

---

8. **Teacher (Inherits from Player)** [P0]

    *Purpose:*

        Represents a teacher character.

    *Variables:*

   - `patrolPath` [P2]: Path that the teacher patrols (final)
   - `mainClassroom` [P2]: Area where teacher spends most of their time teaching students (final)

    *Methods:*

   - `patrol()` [P2]: Moves the teacher along the patrol route until done or interrupted
   - `teach(student[])` [P2]: Keeps students in the classroom and assigns them tasks for a short period.
   - `catchStudent(student)` [P1]: Catches students in a scheme or breaking rules
   - `confiscateItem(item)` [P1]: Removes forbidden items from students
   - `sendToOffice(student)` [P2]: Sends the student to the office
   - `assign(assignment, student[])` [P2]: Assigns tasks to a group of students

---

10. **Item** [P0]

    *Purpose:*

        Represents items in the game, both allowed and forbidden.

    *Variables:*

   - `name` [P0]: Name of the item (e.g., "ruler", "paint") (final)
   - `allowed` [P1]: Boolean to indicate if the item is allowed or contraband
   - `mods` [P2]: Array of booleans indicating if the item has any modifications (e.g., damaged, burning, makeshift)

---

12. **Map** [P0]

    *Purpose:*

        Represents the map of the school, including interactable objects and player positions.

    *Variables:*

   - `rooms` [P0]: Array of room objects (e.g., classroom, science lab) (final)
   - `interactables` [P1]: Objects that players can interact with (e.g., desks, power terminals)
   - `entrances` [P0]: Points where players can enter or exit rooms or buildings (final)

    *Methods:*

   - `generateMap()` [P2]: Randomly generates details of the map (e.g., location of desks, locked rooms, etc.)
   - `triggerEvent(event)` [P1]: Triggers specific events like a fire, gas leak, or power outage
   - `movePlayerToRoom(player, room)` [P0]: Moves the player into a new room or space on the map

---

14. **Room** [P1]

    *Purpose:*

        Represents each room. Each room is rectangular for simplicity.

    *Variables:*

   - `corners` [P1]: Array with four coordinates, each for a corner of the room.

    *Methods:*

   - `getCorners()` [P1]: Returns the room's corners.

---

16. **Interactable** [P1]

    *Purpose:*

        Represents an interactive object on the map that players can interact with, but not pick up.

    *Variables:*

   - `type` [P1]: Type of object (e.g., door, desk, power socket) (final)
   - `location` [P1]: (x, y) coordinates for positioning
   - `isActive` [P2]: Boolean indicating if the interactable object is active

    *Methods:*

   - `activate()` [P1]: Activates the interactable object (e.g., opening a door, starting a power tool)
   - `deactivate()` [P2]: Deactivates the object
   - `onInteract(player, type)` [P1]: Defines interaction logic when a player interacts with the object

---

18. **Assignment** [P2]

    *Purpose:*

        Represents assignments that teachers give and students complete.

    *Variables:*

   - `completion` [P2]: Array of booleans representing task completion for the assignment
   - `name` [P2]: Name of the assignment

    *Methods:*

   - `isCompleted()` [P2]: Checks if all booleans in completion are true
   - `getRequirements()` [P2]: Lists requirements to complete the assignment

---

19. **UIManager** [P1]

    *Purpose:*

        Manages the game's user interface (UI).

    *Variables:*

   - `healthBar` [P1]: Health bar UI element
   - `inventoryUI` [P1]: Inventory display for players
   - `timerUI` [P2]: Timer countdown for match duration

    *Methods:*

   - `updateHealthBar(player)` [P1]: Updates the health bar based on player health
   - `updateInventory(player)` [P1]: Updates the inventory UI display
   - `updateTimer(timeLeft)` [P2]: Updates countdown timer on the UI
   - `showMessage(message)` [P2]: Displays messages (e.g., "You have been caught!")

---

20. **EventManager** [P1]

    *Purpose:*

        Handles random or scripted events in the game world (e.g., disasters, item changes).

    *Variables:*

   - `events` [P2]: List of possible events (e.g., fire, power failure) (final)

    *Methods:*

   - `triggerRandomEvent()` [P2]: Triggers a random event that impacts the map
   - `triggerCustomEvent(event)` [P1]: Triggers a custom event based on game logic (e.g., disaster caused by a student)

FIGMA: https://www.figma.com/board/x58rgAi1HoxderWDKChwNY/Milo's-School-Escape?node-id=0-1&t=TYYgUrB1u4bhd7cN-1
