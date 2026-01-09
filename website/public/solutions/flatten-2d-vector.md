# Flatten 2d Vector

## Problem Description

Design and implement an iterator to flatten a 2d vector. It should support the following operations: next and hasNext.
Implement the Vector2D class:
- Vector2D(List<List<Integer>> vec) initializes the object with the 2D vector vec.
- next() returns the next element from the 2D vector and moves the pointer one step forward. You may assume that all calls to next are valid.
- hasNext() returns true if there are still some elements in the vector, and false otherwise.

### Examples

**Example 1:**

**Input:**
```
["Vector2D", "next", "next", "next", "hasNext", "hasNext", "next", "hasNext"]
[[[[1, 2], [3], [4]]], [], [], [], [], [], [], []]
```

**Output:**
```
[null, 1, 2, 3, true, true, 4, false]
```

**Explanation:**
```
Vector2D vector2D = new Vector2D([[1, 2], [3], [4]]);
vector2D.next();    // return 1
vector2D.next();    // return 2
vector2D.next();    // return 3
vector2D.hasNext(); // return True
vector2D.hasNext(); // return True
vector2D.next();    // return 4
vector2D.hasNext(); // return False
```

### Constraints

- 0 <= vec.length <= 200
- 0 <= vec[i].length <= 500
- -1000 <= vec[i][j] <= 1000
- At most 10^5 calls will be made to next and hasNext.

## Solution

```python
from typing import List

class Vector2D:

    def __init__(self, vec: List[List[int]]):
        self.vec = vec
        self.i = 0
        self.j = 0

    def next(self) -> int:
        res = self.vec[self.i][self.j]
        self.j += 1
        if self.j == len(self.vec[self.i]):
            self.i += 1
            self.j = 0
        return res

    def hasNext(self) -> bool:
        while self.i < len(self.vec) and self.j == len(self.vec[self.i]):
            self.i += 1
            self.j = 0
        return self.i < len(self.vec)
```

### Approach

Use two pointers i and j to track the current position in the 2D vector.
In next(), return the current element and move j, if j reaches end of row, move to next row.
In hasNext(), skip empty rows, check if i < len(vec).

### Complexity

**Time Complexity:** next() O(1), hasNext() amortized O(1)

**Space Complexity:** O(1)
