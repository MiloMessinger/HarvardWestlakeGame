
<!-- 
-
-
-
-
all of these items have a priority of P2
-
-
-
-
-
 -->

1. **GameManager**

    *Methods:*

   - `respawnPlayer(player)`: Handles respawn logic in the office

---

3. **Player (Base Class)**

    *Methods:*

   - `dropItem(item)`: Drops an item from the player's inventory
   - `die()`: Handles player death, respawn logic, and sends to the office

---

5. **Student (Inherits from Player)**

    *Variables:*

   - `assignments`: Array of assignment objects the student must complete
   - `classes`: 2D array of each class a student has

    *Methods:*

   - `isInOffice`: Indicates whether the player is in the office
   - `completeAssignment()`: Marks assignments as complete
   - `goToOffice()`: Handles detention form and respawn
   - `draw()`: Allows student to draw on the screen (office only)
   - `erase()`: Allows student to erase their writing (office only)

---

8. **Teacher (Inherits from Player)**

    *Variables:*

   - `patrolPath`: Path that the teacher patrols (final)
   - `mainClassroom`: Main area where teacher spends time (final)

    *Methods:*

   - `patrol()`: Moves the teacher along the patrol route
   - `teach(student[])`: Keeps students in classroom and assigns tasks
   - `sendToOffice(student)`: Sends the student to the office
   - `assign(assignment, student[])`: Gives assignments to students

---

10. **Item**

    *Variables:*

   - `mods`: Modifications on the item (damaged, burning, etc.)

---

12. **Map**

    *Methods:*

   - `generateMap()`: Randomly generates map details

---

16. **Interactable**

    *Variables:*

   - `isActive`: Indicates if the object is active

    *Methods:*

   - `deactivate()`: Deactivates the object

---

18. **Assignment**

    *Variables:*

   - `completion`: Completion status of the assignment
   - `name`: Name of the assignment

    *Methods:*

   - `isCompleted()`: Checks if assignment is complete
   - `getRequirements()`: Lists requirements for completion

---

19. **UIManager**

    *Variables:*

   - `timerUI`: Match duration countdown

    *Methods:*

   - `updateTimer(timeLeft)`: Updates countdown timer
   - `showMessage(message)`: Displays messages

---

20. **EventManager**

    *Variables:*

   - `events`: List of possible events (final)

    *Methods:*

   - `triggerRandomEvent()`: Triggers a random event
