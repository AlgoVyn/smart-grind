# Design Snake Game

## Problem Description

Design a Snake game that is played on a 2D grid. The game should support the following operations:

- `SnakeGame(width, height, food)`: Initialize the game with a board of given width and height, and a list of food positions.
- `move(direction)`: Move the snake in the given direction ('U' for up, 'D' for down, 'L' for left, 'R' for right). The function returns the current score after the move.

Rules of the game:
1. The snake starts at position (0, 0) with length 1.
2. Food appears at the positions specified in the `food` list in order.
3. When the snake moves:
   - If the new head position is outside the board or collides with the snake's body, return -1 (game over).
   - If the new head position matches the current food position, the snake eats the food (score increases by 1, the snake grows by not removing the tail).
   - Otherwise, the snake moves normally (remove the tail to maintain length).
4. The game ends when the snake collides with a wall or itself, or when all food has been eaten.

**LeetCode Link:** [Design Snake Game - LeetCode 353](https://leetcode.com/problems/design-snake-game/)

---

## Examples

### Example 1

**Input:**
```python
["SnakeGame", "move", "move", "move", "move", "move", "move"]
[[3, 3, [[2, 0], [0, 2]]], "R", "D", "L", "U", "R", "L"]
```

**Output:**
```python
[null, 0, 0, 0, 1, 1, 2]
```

**Explanation:**
```python
SnakeGame snake = new SnakeGame(3, 3, [[2, 0], [0, 2]]);
snake.move("R"); // snake moves right, head at (0, 1), no food eaten, score 0
snake.move("D"); // snake moves down, head at (1, 1), no food eaten, score 0
snake.move("L"); // snake moves left, head at (1, 0), no food eaten, score 0
snake.move("U"); // snake moves up, head at (0, 0), no food eaten, score 0
snake.move("R"); // snake moves right, head at (0, 1), no food eaten, score 0
snake.move("L"); // snake moves left, head at (0, 0), no food eaten, score 0
```

### Example 2

**Input:**
```python
["SnakeGame", "move", "move", "move", "move", "move"]
[[2, 3, [[1, 2], [0, 1]]], "R", "D", "L", "U", "R"]
```

**Output:**
```python
[null, 0, 0, 0, 1, -1]
```

**Explanation:**
```python
SnakeGame snake = new SnakeGame(2, 3, [[1, 2], [0, 1]]);
snake.move("R"); // snake moves right, head at (0, 1), no food eaten, score 0
snake.move("D"); // snake moves down, head at (1, 1), no food eaten, score 0
snake.move("L"); // snake moves left, head at (1, 0), no food eaten, score 0
snake.move("U"); // snake moves up, head at (0, 0), eats food [[1, 2]] at (0, 0), score 1
snake.move("R"); // snake moves right, head at (0, 1), hits wall, game over, return -1
```

---

## Constraints

- `1 <= width, height <= 100`
- `0 <= food[i][0] < height`
- `0 <= food[i][1] < width`
- `1 <= food.length <= 100`
- At most 10^4 calls will be made to `move`.

---

## Pattern: Data Structure Simulation

This problem uses a **simulation** approach with a **deque** to represent the snake body and a **set** for O(1) collision detection. The deque allows efficient addition at head (for new position) and removal from tail (for movement without eating).

---

## Intuition

The Snake Game is a classic simulation problem that requires maintaining the state of a moving snake on a grid. The key challenge is efficiently tracking the snake's body positions and determining collisions.

### Key Observations

1. **Snake Body Representation**: The snake body is essentially a queue - we add new head positions and remove tail positions (unless we eat food).

2. **Collision Detection**: We need to check two types of collisions:
   - Wall collision: When the head goes outside the grid boundaries
   - Self-collision: When the head position is already occupied by the snake body

3. **Order of Collision Checks**: According to game rules, we should check wall collision before self-collision.

4. **Food Eating**: When the snake head matches a food position:
   - Score increases by 1
   - The snake grows (we DON'T remove the tail)
   - Move to the next food item

5. **Data Structure Choice**: 
   - **Deque**: O(1) for adding to front (new head) and removing from back (tail)
   - **Hash Set**: O(1) for checking if a position is occupied by the snake

### Algorithm Overview

1. Initialize snake at position (0, 0), empty food list index, and score of 0
2. For each move:
   - Calculate new head position based on direction
   - Check for wall collision (return -1 if failed)
   - Check for self-collision (return -1 if failed)
   - Add new head to snake body
   - Check if food is eaten (grow snake, increment score)
   - Otherwise, remove tail to maintain length
   - Return current score

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Deque + Hash Set** - Optimal solution using built-in data structures
2. **Two-Directional Lists** - Alternative implementation using lists

---

## Approach 1: Deque + Hash Set (Optimal)

### Algorithm Steps

1. Initialize the snake with a deque containing (0, 0)
2. Use a set to track all occupied positions
3. For each move operation:
   - Calculate new head position
   - Check wall and self collisions
   - Add new head to the front of deque
   - Check if food is eaten - if yes, keep tail and increment score
   - If no food, remove tail from deque and set

### Why It Works

The deque naturally models the snake's behavior - new positions are added to the front (head) and removed from the back (tail). The set provides O(1) lookup for collision detection. This combination gives us O(1) time per move operation.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class SnakeGame:
    """
    Design Snake Game using Deque and Hash Set.
    
    Time Complexity: O(1) per move operation
    Space Complexity: O(width * height) for the snake set
    """

    def __init__(self, width: int, height: int, food: List[List[int]]):
        """
        Initialize the snake game.
        
        Args:
            width: Width of the game board
            height: Height of the game board
            food: List of food positions [[row, col], ...]
        """
        self.width = width
        self.height = height
        self.food = food
        self.food_index = 0
        self.snake = deque([(0, 0)])
        self.snake_set = set([(0, 0)])
        self.score = 0

    def move(self, direction: str) -> int:
        """
        Move the snake in the given direction.
        
        Args:
            direction: 'U', 'D', 'L', 'R' for up, down, left, right
            
        Returns:
            Current score after the move, or -1 if game over
        """
        head = self.snake[0]
        
        # Calculate new head position
        if direction == 'U':
            new_head = (head[0] - 1, head[1])
        elif direction == 'D':
            new_head = (head[0] + 1, head[1])
        elif direction == 'L':
            new_head = (head[0], head[1] - 1)
        elif direction == 'R':
            new_head = (head[0], head[1] + 1)
        
        # Check wall collision
        if not (0 <= new_head[0] < self.height and 0 <= new_head[1] < self.width):
            return -1
        
        # Check self collision
        # Note: Don't check the tail because it will be removed after this move
        if new_head in self.snake_set and new_head != self.snake[-1]:
            return -1
        
        # Add new head to snake
        self.snake.appendleft(new_head)
        self.snake_set.add(new_head)
        
        # Check if food is eaten
        if self.food_index < len(self.food) and new_head == tuple(self.food[self.food_index]):
            # Eat food - snake grows, score increases
            self.food_index += 1
            self.score += 1
        else:
            # No food eaten - remove tail
            tail = self.snake.pop()
            self.snake_set.remove(tail)
        
        return self.score
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
#include <unordered_set>
#include <string>
using namespace std;

class SnakeGame {
private:
    int width;
    int height;
    vector<vector<int>> food;
    int foodIndex;
    deque<pair<int, int>> snake;
    unordered_set<long long> snakeSet;
    int score;
    
    // Convert pair to unique hash for set
    long long getHash(int row, int col) {
        return (long long)row * width + col;
    }

public:
    SnakeGame(int width, int height, vector<vector<int>>& food) {
        this->width = width;
        this->height = height;
        this->food = food;
        this->foodIndex = 0;
        this->snake = deque<pair<int, int>>();
        this->snake.push_front({0, 0});
        this->snakeSet.insert(getHash(0, 0));
        this->score = 0;
    }
    
    int move(string direction) {
        auto head = snake.front();
        pair<int, int> newHead;
        
        if (direction == "U") {
            newHead = {head.first - 1, head.second};
        } else if (direction == "D") {
            newHead = {head.first + 1, head.second};
        } else if (direction == "L") {
            newHead = {head.first, head.second - 1};
        } else if (direction == "R") {
            newHead = {head.first, head.second + 1};
        }
        
        // Check wall collision
        if (newHead.first < 0 || newHead.first >= height || 
            newHead.second < 0 || newHead.second >= width) {
            return -1;
        }
        
        // Check self collision
        long long newHash = getHash(newHead.first, newHead.second);
        auto tail = snake.back();
        long long tailHash = getHash(tail.first, tail.second);
        
        if (snakeSet.find(newHash) != snakeSet.end() && newHash != tailHash) {
            return -1;
        }
        
        // Add new head
        snake.push_front(newHead);
        snakeSet.insert(newHash);
        
        // Check if food is eaten
        if (foodIndex < food.size() && 
            newHead.first == food[foodIndex][0] && 
            newHead.second == food[foodIndex][1]) {
            foodIndex++;
            score++;
        } else {
            // Remove tail
            snakeSet.erase(tailHash);
            snake.pop_back();
        }
        
        return score;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class SnakeGame {
    private int width;
    private int height;
    private int[][] food;
    private int foodIndex;
    private Deque<int[]> snake;
    private Set<Long> snakeSet;
    private int score;
    
    public SnakeGame(int width, int height, int[][] food) {
        this.width = width;
        this.height = height;
        this.food = food;
        this.foodIndex = 0;
        this.snake = new ArrayDeque<>();
        this.snake.addFirst(new int[]{0, 0});
        this.snakeSet = new HashSet<>();
        this.snakeSet.add(this.hash(0, 0));
        this.score = 0;
    }
    
    private long hash(int row, int col) {
        return (long) row * width + col;
    }
    
    public int move(String direction) {
        int[] head = snake.peekFirst();
        int[] newHead = new int[2];
        
        switch(direction) {
            case "U":
                newHead = new int[]{head[0] - 1, head[1]};
                break;
            case "D":
                newHead = new int[]{head[0] + 1, head[1]};
                break;
            case "L":
                newHead = new int[]{head[0], head[1] - 1};
                break;
            case "R":
                newHead = new int[]{head[0], head[1] + 1};
                break;
        }
        
        // Check wall collision
        if (newHead[0] < 0 || newHead[0] >= height || 
            newHead[1] < 0 || newHead[1] >= width) {
            return -1;
        }
        
        // Check self collision
        long newHash = hash(newHead[0], newHead[1]);
        int[] tail = snake.peekLast();
        long tailHash = hash(tail[0], tail[1]);
        
        if (snakeSet.contains(newHash) && newHash != tailHash) {
            return -1;
        }
        
        // Add new head
        snake.addFirst(newHead);
        snakeSet.add(newHash);
        
        // Check if food is eaten
        if (foodIndex < food.length && 
            newHead[0] == food[foodIndex][0] && 
            newHead[1] == food[foodIndex][1]) {
            foodIndex++;
            score++;
        } else {
            // Remove tail
            snakeSet.remove(tailHash);
            snake.removeLast();
        }
        
        return score;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} width
 * @param {number} height
 * @param {number[][]} food
 */
var SnakeGame = function(width, height, food) {
    this.width = width;
    this.height = height;
    this.food = food;
    this.foodIndex = 0;
    this.snake = [[0, 0]];
    this.snakeSet = new Set(['0,0']);
    this.score = 0;
    
    this.hash = (row, col) => `${row},${col}`;
};

/**
 * @param {string} direction
 * @return {number}
 */
SnakeGame.prototype.move = function(direction) {
    const head = this.snake[0];
    let newHead;
    
    switch(direction) {
        case 'U':
            newHead = [head[0] - 1, head[1]];
            break;
        case 'D':
            newHead = [head[0] + 1, head[1]];
            break;
        case 'L':
            newHead = [head[0], head[1] - 1];
            break;
        case 'R':
            newHead = [head[0], head[1] + 1];
            break;
    }
    
    // Check wall collision
    if (newHead[0] < 0 || newHead[0] >= this.height || 
        newHead[1] < 0 || newHead[1] >= this.width) {
        return -1;
    }
    
    // Check self collision
    const newHash = this.hash(newHead[0], newHead[1]);
    const tail = this.snake[this.snake.length - 1];
    const tailHash = this.hash(tail[0], tail[1]);
    
    if (this.snakeSet.has(newHash) && newHash !== tailHash) {
        return -1;
    }
    
    // Add new head
    this.snake.unshift(newHead);
    this.snakeSet.add(newHash);
    
    // Check if food is eaten
    if (this.foodIndex < this.food.length && 
        newHead[0] === this.food[this.foodIndex][0] && 
        newHead[1] === this.food[this.foodIndex][1]) {
        this.foodIndex++;
        this.score++;
    } else {
        // Remove tail
        const removedTail = this.snake.pop();
        this.snakeSet.delete(this.hash(removedTail[0], removedTail[1]));
    }
    
    return this.score;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) per move operation - all operations are constant time |
| **Space** | O(width × height) for storing the snake set |

---

## Approach 2: List-Based Implementation

### Algorithm Steps

1. Use a list to represent snake body positions
2. For each move, calculate new head and check collisions
3. Use list slicing for adding/removing positions

### Why It Works

This approach uses Python lists instead of deque. While slightly less efficient for pop operations from the front, it provides the same functionality.

### Code Implementation

````carousel
```python
from typing import List

class SnakeGame:
    """
    Design Snake Game using List-based implementation.
    """

    def __init__(self, width: int, height: int, food: List[List[int]]):
        self.width = width
        self.height = height
        self.food = food
        self.food_index = 0
        self.snake = [(0, 0)]
        self.score = 0

    def move(self, direction: str) -> int:
        head = self.snake[0]
        
        if direction == 'U':
            new_head = (head[0] - 1, head[1])
        elif direction == 'D':
            new_head = (head[0] + 1, head[1])
        elif direction == 'L':
            new_head = (head[0], head[1] - 1)
        elif direction == 'R':
            new_head = (head[0], head[1] + 1)
        
        # Check wall collision
        if not (0 <= new_head[0] < self.height and 0 <= new_head[1] < self.width):
            return -1
        
        # Check self collision (excluding tail if not eating)
        if new_head in self.snake[:-1]:
            return -1
        
        # Add new head
        self.snake.insert(0, new_head)
        
        # Check if food is eaten
        if self.food_index < len(self.food) and new_head == tuple(self.food[self.food_index]):
            self.food_index += 1
            self.score += 1
        else:
            self.snake.pop()
        
        return self.score
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class SnakeGame {
private:
    int width;
    int height;
    vector<vector<int>> food;
    int foodIndex;
    vector<pair<int, int>> snake;
    int score;
    
public:
    SnakeGame(int width, int height, vector<vector<int>>& food) {
        this->width = width;
        this->height = height;
        this->food = food;
        this->foodIndex = 0;
        this->snake = vector<pair<int, int>>();
        this->snake.push_back({0, 0});
        this->score = 0;
    }
    
    int move(string direction) {
        auto head = snake[0];
        pair<int, int> newHead;
        
        if (direction == "U") {
            newHead = {head.first - 1, head.second};
        } else if (direction == "D") {
            newHead = {head.first + 1, head.second};
        } else if (direction == "L") {
            newHead = {head.first, head.second - 1};
        } else if (direction == "R") {
            newHead = {head.first, head.second + 1};
        }
        
        // Check wall collision
        if (newHead.first < 0 || newHead.first >= height || 
            newHead.second < 0 || newHead.second >= width) {
            return -1;
        }
        
        // Check self collision
        for (size_t i = 0; i < snake.size() - 1; i++) {
            if (snake[i] == newHead) {
                return -1;
            }
        }
        
        // Add new head
        snake.insert(snake.begin(), newHead);
        
        // Check if food is eaten
        if (foodIndex < food.size() && 
            newHead.first == food[foodIndex][0] && 
            newHead.second == food[foodIndex][1]) {
            foodIndex++;
            score++;
        } else {
            snake.pop_back();
        }
        
        return score;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class SnakeGame {
    private int width;
    private int height;
    private int[][] food;
    private int foodIndex;
    private List<int[]> snake;
    private int score;
    
    public SnakeGame(int width, int height, int[][] food) {
        this.width = width;
        this.height = height;
        this.food = food;
        this.foodIndex = 0;
        this.snake = new ArrayList<>();
        this.snake.add(new int[]{0, 0});
        this.score = 0;
    }
    
    public int move(String direction) {
        int[] head = snake.get(0);
        int[] newHead = new int[2];
        
        switch(direction) {
            case "U":
                newHead = new int[]{head[0] - 1, head[1]};
                break;
            case "D":
                newHead = new int[]{head[0] + 1, head[1]};
                break;
            case "L":
                newHead = new int[]{head[0], head[1] - 1};
                break;
            case "R":
                newHead = new int[]{head[0], head[1] + 1};
                break;
            default:
                return -1;
        }
        
        // Check wall collision
        if (newHead[0] < 0 || newHead[0] >= height || 
            newHead[1] < 0 || newHead[1] >= width) {
            return -1;
        }
        
        // Check self collision
        for (int i = 0; i < snake.size() - 1; i++) {
            if (snake.get(i)[0] == newHead[0] && snake.get(i)[1] == newHead[1]) {
                return -1;
            }
        }
        
        // Add new head
        snake.add(0, newHead);
        
        // Check if food is eaten
        if (foodIndex < food.length && 
            newHead[0] == food[foodIndex][0] && 
            newHead[1] == food[foodIndex][1]) {
            foodIndex++;
            score++;
        } else {
            snake.remove(snake.size() - 1);
        }
        
        return score;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} width
 * @param {number} height
 * @param {number[][]} food
 */
var SnakeGame = function(width, height, food) {
    this.width = width;
    this.height = height;
    this.food = food;
    this.foodIndex = 0;
    this.snake = [[0, 0]];
    this.score = 0;
};

/**
 * @param {string} direction
 * @return {number}
 */
SnakeGame.prototype.move = function(direction) {
    const head = this.snake[0];
    let newHead;
    
    switch(direction) {
        case 'U':
            newHead = [head[0] - 1, head[1]];
            break;
        case 'D':
            newHead = [head[0] + 1, head[1]];
            break;
        case 'L':
            newHead = [head[0], head[1] - 1];
            break;
        case 'R':
            newHead = [head[0], head[1] + 1];
            break;
    }
    
    // Check wall collision
    if (newHead[0] < 0 || newHead[0] >= this.height || 
        newHead[1] < 0 || newHead[1] >= this.width) {
        return -1;
    }
    
    // Check self collision
    for (let i = 0; i < this.snake.length - 1; i++) {
        if (this.snake[i][0] === newHead[0] && this.snake[i][1] === newHead[1]) {
            return -1;
        }
    }
    
    // Add new head
    this.snake.unshift(newHead);
    
    // Check if food is eaten
    if (this.foodIndex < this.food.length && 
        newHead[0] === this.food[this.foodIndex][0] && 
        newHead[1] === this.food[this.foodIndex][1]) {
        this.foodIndex++;
        this.score++;
    } else {
        this.snake.pop();
    }
    
    return this.score;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) per move where n is snake length due to list insertion/checking |
| **Space** | O(width × height) for storing the snake |

---

## Comparison of Approaches

| Aspect | Deque + Hash Set | List-Based |
|--------|-----------------|------------|
| **Time Complexity** | O(1) per move | O(n) per move |
| **Space Complexity** | O(width × height) | O(width × height) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ❌ (too slow for large inputs) |

**Best Approach:** Use Approach 1 (Deque + Hash Set) for the optimal solution with O(1) move operations.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Data Structure Design, Simulation, Queue/Deque, Hash Set

### Learning Outcomes

1. **Data Structure Design**: Learn to choose appropriate data structures for simulation problems
2. **Queue Operations**: Understand how to model a queue using deque
3. **Collision Detection**: Efficient O(1) collision checking using hash sets
4. **State Management**: Learn to maintain complex game state

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Tic-Tac-Toe | [Link](https://leetcode.com/problems/design-tic-tac-toe/) | Game design with O(1) operations |
| Design Parking System | [Link](https://leetcode.com/problems/design-parking-system/) | Simple simulation |
| Design Browser History | [Link](https://leetcode.com/problems/design-browser-history/) | Linked list simulation |
| Design Linked List | [Link](https://leetcode.com/problems/design-linked-list/) | Data structure design |

### Pattern Reference

For more detailed explanations of simulation patterns, see:
- **[Simulation Pattern](/patterns/simulation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Design Snake Game](https://www.youtube.com/watch?v=4F72FJU4x5I)** - Clear explanation with visual examples
2. **[Design Snake Game - LeetCode 353](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Detailed walkthrough

### Related Concepts

- **[Deque Data Structure](https://www.youtube.com/watch?v=6Dr9F8W3z_M)** - Understanding deque operations
- **[Hash Set Complexity](https://www.youtube.com/watch?v=0M6F4F8F5JQ)** - O(1) lookup operations

---

## Follow-up Questions

### Q1: How would you handle diagonal movement?

**Answer:** Currently the snake can only move in 4 directions (up, down, left, right). For diagonal movement, you'd need to:
- Add checks for 4 additional directions (UL, UR, DL, DR)
- Update the new head calculation to move in both row and column directions
- Modify collision detection accordingly

---

### Q2: What if you needed to support multiple snakes?

**Answer:** For multi-snake support:
- Maintain separate snake data structures for each snake
- Add snake ID to track which snake occupies which cells
- Modify collision detection to check against all snakes
- Add logic for snake-to-snake collision

---

### Q3: How would you implement a "reverse" move that moves the snake backward?

**Answer:** Moving backward in Snake is complex because:
- The head would become the previous body segment
- You need to check if reversing is valid (no immediate collision)
- Food positions would need to be reconsidered
- It's generally not standard Snake behavior

---

### Q4: How would you add obstacle support to the game?

**Answer:** To add obstacles:
- Add an obstacle set to track blocked positions
- Check obstacle collision alongside wall and self-collision
- Initialize obstacles in the constructor
- Obstacles should never be removed or moved

---

### Q5: Can you make the game support wrapping (toroidal grid)?

**Answer:** For a wrapping grid:
- Modify wall collision check to use modulo: `new_head[0] = (new_head[0] + height) % height`
- The snake can exit one side and appear on the opposite side
- Food and obstacle positions remain the same

---

## Common Pitfalls

### 1. Wrong Collision Check Order
**Issue**: Checking self-collision before wall collision.

**Solution**: Always check wall collision first, as per standard game rules.

### 2. Forgetting to Remove Tail When Moving
**Issue**: Only removing the tail when NOT eating food. When eating, keep the tail to grow the snake.

**Solution**: Use conditional logic - only pop the tail when food is NOT eaten.

### 3. Using Wrong Food Index
**Issue**: Not tracking `food_index` correctly and incrementing only when food is eaten.

**Solution**: Maintain a food_index counter that increments only when the snake reaches the current food position.

### 4. Self-Collision Check After Move
**Issue**: The new head position should NOT be in the snake set (but remember the tail will be removed after move).

**Solution**: When checking self-collision, exclude the tail position if the snake won't grow in this move.

### 5. Incorrect Position Hashing
**Issue**: When using sets for collision detection, position hashing must be unique.

**Solution**: Use a unique hash like `row * width + col` to convert 2D coordinates to a single integer.

---

## Summary

The **Design Snake Game** problem demonstrates how to use appropriate data structures for simulation problems:

- **Deque**: Efficient O(1) operations for adding to front and removing from back
- **Hash Set**: O(1) collision detection
- **Queue Pattern**: Snake body naturally follows FIFO queue behavior

Key takeaways:
1. Use a deque to represent the snake body
2. Use a hash set for O(1) collision checking
3. Check wall collision before self-collision
4. Grow the snake by not removing the tail when eating food
5. Each move operation should be O(1) time complexity

This problem is essential for understanding data structure design and simulation problems, forming the foundation for more complex game implementations.

### Pattern Summary

This problem exemplifies the **Data Structure Simulation** pattern, characterized by:
- Using appropriate data structures to model real-world systems
- Maintaining state with efficient operations
- Handling edge cases in simulation logic

For more details on this pattern and its variations, see the **[Simulation Pattern](/patterns/simulation)**.

---

## Additional Resources

- [LeetCode Problem 353](https://leetcode.com/problems/design-snake-game/) - Official problem page
- [Deque - Python Documentation](https://docs.python.org/3/library/collections.html#collections.deque) - Deque operations
- [Hash Set Operations](https://docs.python.org/3/library/stdtypes.html#set-types) - Set lookup complexity
- [Pattern: Simulation](/patterns/simulation) - Comprehensive pattern guide
