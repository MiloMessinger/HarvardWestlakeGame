# Rewritten Game Features

### GameManager
**Priority:** P0  
**Implementation Timeline:** Day 1  

**Core Requirements:**
- Manage game state transitions (e.g., 'starting', 'running', 'ended').
- Handle player interactions and overall match flow.
- Assign roles (students and teachers) and check victory conditions.

**Technical Components:**
- `gameState`: Enum for game state (e.g., 'starting', 'running', 'ended').
- `players`: Array of player objects.
- `timeLeft`: Timer for match duration.
- `spawnPoints`: List of player spawn points.
- Methods:
  - `startGame()`, `endGame(winner)`, `updateGame()`, `assignRoles()`, `checkVictoryConditions()`.

**Simplifications:**
- Role assignment can use a simple random algorithm initially.

**Dependencies:**
- Player class implementation.
- Map feature.

---

### Player (Base Class)
**Priority:** P0  
**Implementation Timeline:** Day 1-2  

**Core Requirements:**
- Represent a player (either a student or teacher) with basic attributes.
- Provide movement and interaction with the environment.

**Technical Components:**
- Variables:
  - `name`: Player’s name.
  - `role`: Enum for role (Student or Teacher).
  - `maxHealth`, `health`: Player's health values.
  - `inventory`: Array of items.
  - `position`: Coordinates on the map.
  - `speed`: Movement speed.
- Methods:
  - `move(int direction)`, `interact()`, `pickUpItem(item)`, `useItem(item)`.

**Simplifications:**
- Movement limited to orthogonal and diagonal directions only.

**Dependencies:**
- GameManager for state management.
- Map for positioning.

---

### Student
**Priority:** P0  
**Implementation Timeline:** Day 2  

**Core Requirements:**
- Check if students can escape and alert them.
- Craft new items using inventory.

**Technical Components:**
- Methods:
  - `alertEscape()`, `craft(item[])`.

**Simplifications:**
- Alerts and crafting use predefined conditions and recipes.

**Dependencies:**
- Player class implementation.
- Items system.

---

### Teacher
**Priority:** P0  
**Implementation Timeline:** Day 2  

**Core Requirements:**
- Catch students breaking rules.
- Confiscate forbidden items.

**Technical Components:**
- Methods:
  - `catchStudent(student)`, `confiscateItem(item)`.

**Simplifications:**
- Catching and confiscation use proximity checks.

**Dependencies:**
- Player class implementation.
- Items system.

---

### Item
**Priority:** P1  
**Implementation Timeline:** Day 3  

**Core Requirements:**
- Represent items in the game, both allowed and forbidden.

**Technical Components:**
- Variables:
  - `name`: Name of the item (e.g., "ruler", "paint").
  - `allowed`: Indicates if the item is contraband.

**Simplifications:**
- Items classified into "allowed" and "forbidden" with a boolean.

**Dependencies:**
- Students and Teachers for inventory interactions.

---

### Map
**Priority:** P0  
**Implementation Timeline:** Day 1  

**Core Requirements:**
- Represent the school map with rooms and interactables.
- Allow players to move between rooms.

**Technical Components:**
- Variables:
  - `rooms`: Array of room objects.
  - `interactables`: Objects players can interact with.
  - `entrances`: Points for entering/exiting rooms.
- Methods:
  - `triggerEvent(event)`, `movePlayerToRoom(player, room)`.

**Simplifications:**
- Map layout static for MVP.

**Dependencies:**
- GameManager for player coordination.

---

### Room
**Priority:** P1  
**Implementation Timeline:** Day 3  

**Core Requirements:**
- Represent individual rooms on the map.

**Technical Components:**
- Variables:
  - `corners`: Coordinates of the room's corners.
- Methods:
  - `getCorners()`.

**Simplifications:**
- All rooms rectangular for simplicity.

**Dependencies:**
- Map for integration.

---

### Interactable
**Priority:** P1  
**Implementation Timeline:** Day 4  

**Core Requirements:**
- Represent objects players can interact with on the map.

**Technical Components:**
- Variables:
  - `type`: Type of object (e.g., door, desk).
  - `location`: Object's position on the map.
- Methods:
  - `activate()`, `onInteract(player, type)`.

**Simplifications:**
- Predefined interaction logic for each type.

**Dependencies:**
- Map for placement.
- Player for interactions.

---

### UIManager
**Priority:** P1  
**Implementation Timeline:** Day 4  

**Core Requirements:**
- Display health, inventory, and match timer.

**Technical Components:**
- Variables:
  - `healthBar`, `inventoryUI`, `timerUI`.
- Methods:
  - `updateHealthBar(player)`, `updateInventory(player)`.

**Simplifications:**
- UI updates limited to text and static bars.

**Dependencies:**
- GameManager for state updates.

---

### EventManager
**Priority:** P1  
**Implementation Timeline:** Day 5  

**Core Requirements:**
- Handle custom events like disasters or player-triggered changes.

**Technical Components:**
- Methods:
  - `triggerCustomEvent(event)`.

**Simplifications:**
- Events triggered manually for MVP.

**Dependencies:**
- GameManager for coordination.
- Map for effects.

---

# MVP Implementation Plan

## Day 1-2 (Core Framework)
### Objective:
Establish the foundational framework of the game, including core player functionality and map integration.

### Tasks:
- Implement **GameManager** (P0):
  - Manage game state transitions (`startGame()`, `endGame(winner)`, `updateGame()`).
  - Assign roles (`assignRoles()`) and check victory conditions (`checkVictoryConditions()`).
- Implement **Player (Base Class)** (P0):
  - Create base attributes (`name`, `role`, `health`, `inventory`, `position`, `speed`).
  - Implement core methods:
    - `move(int direction)` for movement.
    - `interact()` for environmental interactions.
    - `pickUpItem(item)` for inventory handling.
- Implement **Map** (P0):
  - Define the static layout of the map with rooms and entrances.
  - Add movement between rooms (`movePlayerToRoom(player, room)`).

---

## Day 3-4 (Essential Features)
### Objective:
Add the core functionality for students, teachers, and interactables.

### Tasks:
- Implement **Student** (P0):
  - Add methods:
    - `alertEscape()` to notify players when they can win.
    - `craft(item[])` for creating new items using inventory.
- Implement **Teacher** (P0):
  - Add methods:
    - `catchStudent(student)` for identifying rule-breaking players.
    - `confiscateItem(item)` for removing forbidden items.
- Implement **Interactable** (P1):
  - Add variables (`type`, `location`) and methods (`activate()`, `onInteract(player, type)`).
  - Define basic interaction logic for key objects (e.g., doors, desks).
- Implement **Item** (P1):
  - Add variables:
    - `name` for item identification.
    - `allowed` for defining contraband status.
  - Enable item interactions within player inventory.

---

## Day 5 (Enhancement & Testing)
### Objective:
Integrate UI features, event handling, and finalize testing.

### Tasks:
- Implement **UIManager** (P1):
  - Display player health (`updateHealthBar(player)`).
  - Show inventory contents (`updateInventory(player)`).
- Implement **EventManager** (P1):
  - Add custom event logic (`triggerCustomEvent(event)`).
  - Set up basic disaster scenarios (e.g., fire, power outage).
- Conduct final testing:
  - Verify role assignment and victory conditions.
  - Test player interactions with map, items, and each other.
  - Ensure basic UI and event triggers function as expected.

### Stretch Goals (if time permits):
- Add additional room features using **Room** (P1):
  - Implement `getCorners()` for room corner data.
- Refine and expand **Interactable** functionality (e.g., animations for object interactions).

---