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

---

## Examples

**Example 1:**

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

**Example 2:**

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

## Solution

```python
from typing import List
from collections import deque

class SnakeGame:

    def __init__(self, width: int, height: int, food: List[List[int]]):
        self.width = width
        self.height = height
        self.food = food
        self.food_index = 0
        self.snake = deque([(0, 0)])
        self.snake_set = set([(0, 0)])
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

        # Check wall
        if not (0 <= new_head[0] < self.height and 0 <= new_head[1] < self.width):
            return -1

        # Check self collision
        if new_head in self.snake_set:
            return -1

        self.snake.appendleft(new_head)
        self.snake_set.add(new_head)

        # Check food
        if self.food_index < len(self.food) and new_head == tuple(self.food[self.food_index]):
            self.food_index += 1
            self.score += 1
        else:
            tail = self.snake.pop()
            self.snake_set.remove(tail)

        return self.score
```

---

## Explanation
The SnakeGame class uses a deque for the snake body to efficiently add to head and remove from tail. A set tracks occupied positions for O(1) collision checks.

In `__init__`, initialize snake at (0, 0), food list, and score.

In `move`, calculate new head based on direction, check boundaries and self-collision. If valid, add new head. If food is eaten, increment score and don't remove tail; else, remove tail.

**Time Complexity:** O(1) per move.

**Space Complexity:** O(width * height) for snake set.
