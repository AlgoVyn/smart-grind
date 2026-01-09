# Design Snake Game

## Problem Description
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

## Explanation
The SnakeGame class uses a deque for the snake body to efficiently add to head and remove from tail. A set tracks occupied positions for O(1) collision checks.

In `__init__`, initialize snake at (0,0), food list, and score.

In `move`, calculate new head based on direction, check boundaries and self-collision. If valid, add new head. If food is eaten, increment score and don't remove tail; else, remove tail.

Time complexity: O(1) per move.

Space complexity: O(width * height) for snake set.
