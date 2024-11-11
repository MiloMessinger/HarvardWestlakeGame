Techology Stack:

The best option I found seemed to be Construct 3.

Pros: So, there's gonna be multiple people coding this. If there was just one, I could choose which game engine to use to tailor to that person's skills, but since there's gonna be a bunch, I think it's best to assume the worst of everyone, and imagine that they, like me, do not know how to code javascript or html. In that case, Construct 3 is great because you don't have to do any coding. Meanwhile, even if you're an Edwin or a Milo that actually knows how to use html and js, Construct 3 allows you to add in code, which is awesome. (PS: I know that AI exists and would be doing most of the coding, but AI doesn't do things perfectly and if you don't know how to code in html or js then it's really hard to debug in html or js). Also, C3 allows you to look at what you're making as you make it and seems intuitive to use. And it's the game engine that There Is No Game was made on, which is cool. It's also apparently powerful and fast. They did tests with how many sprites different devices could handle, and the numbers they got seem pretty big to me.

Cons: No cons??? Based. (Except that some people might not want to figure out how to use the Construct 3 UI. "Some people" includes me. But it's better than figuring out how to debug code in a language I can't code in.)



Architecture:

1. GameManager
    Purpose:
        Manages game state, player interactions, and the overall flow of the match.
    Variables:
        gameState: Enum for game state (e.g., 'starting', 'running', 'ended')
        players: Array of player objects (students and teachers) (final)
        timeLeft: Timer for match duration
        spawnPoints: List of potential spawn points for players
    Methods:
        startGame(): Starts the match, sets the game state to 'running'
        endGame(winner): Ends the match and displays results
        updateGame(): Main game loop; Updates the game state every frame
        assignRoles(): Randomly assigns roles (students vs. teachers)
        respawnPlayer(player): Handles respawn logic in the office
        checkVictoryConditions(): Checks if any victory condition is met (e.g., students escaping or time running out)
2. Player (Base Class)
    Purpose:
        Base class for both students and teachers.
    Variables:
        name: Player’s name (final)
        role: Enum for role (Student or Teacher)
        health: Player health value
        inventory: Array of items in the player’s possession
        position: (x, y) coordinates on the map
        speed: Movement speed  (final)
    Methods:
        move(): Moves the player based on WASD input
        interact(): Interacts with interactable objects using the F key
        pickUpItem(item): Adds an item to the player’s inventory
        dropItem(item): Drops an item in a player's inventory
        useItem(item): Uses an item from the player’s inventory
        takeDamage(amount): Reduces health based on interactions or events
        die(): Handles player death, respawn logic, and sends to the office
3. Student (Inherits from Player)
    Purpose:
        Represents a student character.
    Variables:
        assignments: List of assignments the student must complete
        classes: 2D array of each class a student has; one row contains the room a class is in and the other row contains the time that they must be there by (the array also contains free blocks and breaks, so that you can tell when a class has ended from the fact that the break has started.)
    Methods:
        isInOffice: Boolean indicating whether the player is in the office
        completeAssignment(): Marks assignments as complete and rewards with credits or items
        createDisaster(item): Triggers a disaster event (e.g., fire, power outage)
        alertEscape(): Checks if the student can escape the school and alerts student (Like, if they've started a disaster and can now win, it tells the student that they can now win)
        craft(): Crafts a new item using items in inventory.
4. Teacher (Inherits from Player)
    Purpose:
        Represents a teacher character.
    Variables:
        patrolPath: Path that the teacher patrols (final)
        mainClassroom: Area where teacher spends most of their time while teaching students (final)
    Methods:
        patrol(): Moves the teacher in the patrol route until done or interrupted
        teach(student[]): Keeps students in classroom and assigns them tasks for a minute or two.
        catchStudent(student): Catches students if they are caught in a scheme or breaking rules
        confiscateItem(item): Removes forbidden items from students
        sendToOffice(player): Sends the student or teacher to the office
        assign(assignment, student[]): Gives an assignment to a number of students
5. Office
    Purpose:
        Manages logic for students who are sent to the office (either for dying or being caught).
    Variables:
        playersInOffice: List of players currently in the office
        detentionTimer: Countdown for the 30-second detention wait
    Methods:
        addPlayerToOffice(student): Adds a student to the office
        removePlayerFromOffice(student): Removes the student after their detention is complete
        startDetentionTimer(): Starts the 30-second wait
6. Item
    Purpose:    
        Represents items in the game, both allowed and forbidden.
    Variables:
        name: Name of the item (e.g., "ruler", "paint") (final)
        allowed: boolean determining whether this item is OK or contraband (not final cuz the mods can change this)
        mods: Array of booleans indicating if the item has any modifications (damaged, burning, makeshift, etc)
    Methods:
        N/A
7. Map
    Purpose:
        Represents the map of the school, including interactable objects and player positions.
    Variables:
        rooms: Array of room objects (e.g., classroom, science lab) (final)
        interactables: Array of objects that players can interact with (e.g., desks, power terminals)
        entrances: Points where players can enter or exit rooms or buildings (final)
    Methods:
        generateMap(): Randomly generates parts of the map (e.g., desks, locked rooms)
        updateInteractivity(): Updates the interactable objects that players can interact with
        triggerEvent(event): Triggers specific events like a fire, gas leak, or power outage
        movePlayerToRoom(player, room): Moves the player into a new room or space on the map
8. Room
    Purpose:
        Represents each room. Each room is rectangular for simplicity.
    Variables:
        corners: Array of size 4. Each index has a coordinate, one for each corner of the room.
    Methods:
        getCorners(): Returns the corners.
9. Interactable
    Purpose:
        Represents an interactive object on the map that players can interact with.
    Variables:
        type: Type of object (e.g., door, desk, power socket) (final)
        location: (x, y) coordinates for positioning
        isActive: Boolean indicating if the interactable object is active
    Methods:
        activate(): Activates the interactable object (e.g., opening a door, starting a power tool)
        deactivate(): Deactivates the object
        onInteract(player): Defines the interaction logic when a player interacts with the object (e.g., use a power tool, open a door)
10. Assignment
    Purpose:
        Represents an assignment that teachers give and students complete.
    Variables:
        completion: array of booleans for each of the things that must be done for the assignment to be completed
        name: String. the name of the assignment
    Methods:
        isCompleted(): checks if all of the booleans in completion are true
        getRequirements(): Returns all of the requirements needed to complete the assignment.
11. UIManager
    Purpose:
        Manages the game's user interface (UI).
    Variables:
        healthBar: Health bar UI element
        inventoryUI: Inventory display for players
        timerUI: Timer countdown for match duration
    Methods:
        updateHealthBar(player): Updates the health bar based on player health
        updateInventory(player): Updates the inventory UI display
        updateTimer(timeLeft): Updates the countdown timer on the UI
        showMessage(message): Displays messages (e.g., "You have been caught!")
12. EventManager
    Purpose:
        Handles random or scripted events in the game world (e.g., disasters, item changes).
    Variables:
        events: List of possible events (e.g., fire, power failure) (final)
    Methods:
        triggerRandomEvent(): Triggers a random event that impacts the map (e.g., fire breaking out in a building)
        triggerCustomEvent(event): Triggers a custom event based on game logic (e.g., disaster caused by a student)