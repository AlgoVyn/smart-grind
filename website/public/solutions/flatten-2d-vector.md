# Flatten 2d Vector

## Problem Description

[LeetCode Link: Flatten 2D Vector](https://leetcode.com/problems/flatten-2d-vector/)

Design and implement an iterator to flatten a 2d vector. It should support the following operations: next and hasNext.
Implement the Vector2D class:
- Vector2D(List<List<Integer>> vec) initializes the object with the 2D vector vec.
- next() returns the next element from the 2D vector and moves the pointer one step forward. You may assume that all calls to next are valid.
- hasNext() returns true if there are still some elements in the vector, and false otherwise.

## Examples

**Example 1:**

**Input:**
```python
["Vector2D", "next", "next", "next", "hasNext", "hasNext", "next", "hasNext"]
[[[[1, 2], [3], [4]]], [], [], [], [], [], [], []]
```

**Output:**
```python
[null, 1, 2, 3, true, true, 4, false]
```

**Explanation:**
```python
Vector2D vector2D = new Vector2D([[1, 2], [3], [4]]);
vector2D.next();    // return 1
vector2D.next();    // return 2
vector2D.next();    // return 3
vector2D.hasNext(); // return True
vector2D.hasNext(); // return True
vector2D.next();    // return 4
vector2D.hasNext(); // return False
```

## Constraints

- 0 <= vec.length <= 200
- 0 <= vec[i].length <= 500
- -1000 <= vec[i][j] <= 1000
- At most 10^5 calls will be made to next and hasNext.

---

## Pattern:

This problem follows the **Iterator Design** pattern for flattening nested data structures.

### Core Concept

- **Two Pointer Tracking**: Use indices (i, j) to track current position
- **Lazy Evaluation**: Only advance when next() is called
- **Empty Row Skipping**: Skip empty rows in hasNext()

### When to Use This Pattern

This pattern is applicable when:
1. Implementing iterators for nested collections
2. Problems requiring sequential access with state tracking
3. Flattening hierarchical data structures

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Iterator | Design pattern for traversal |
| Two Pointers | Multiple index tracking |
| Lazy Evaluation | Defer computation |

---

## Common Pitfalls

### 1. Not Skipping Empty Rows
**Issue:** hasNext() returns true but next() fails on empty sub-array.

**Solution:** Skip empty rows in hasNext() by advancing i.

### 2. Incorrect Index Reset
**Issue:** Not resetting j to 0 when moving to next row.

**Solution:** Reset j = 0 whenever i advances to next row.

### 3. Off-by-One in Boundary Check
**Issue:** Checking wrong boundary condition.

**Solution:** Check i < len(vec) before accessing vec[i].

---

## Related Problems

Based on similar iterator and nested collection themes:

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Search Tree Iterator | [Link](https://leetcode.com/problems/binary-search-tree-iterator/) | Iterator for BST |
| Flatten Nested List Iterator | [Link](https://leetcode.com/problems/flatten-nested-list-iterator/) | Iterator for nested list |
| Peeking Iterator | [Link](https://leetcode.com/problems/peeking-iterator/) | Iterator with peek |
| Zigzag Iterator | [Link](https://leetcode.com/problems/zigzag-iterator/) | Interleave two iterators |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Flatten 2D Vector - LeetCode 251](https://www.youtube.com/watch?v=wgL1bHuy6G8)** - NeetCode explanation
2. **[Iterator Design Pattern](https://www.youtube.com/watch?v=3F_wXqfx9qQ)** - Design patterns

---

## Summary

The **Flatten 2D Vector** problem demonstrates the **Iterator Design Pattern**:

- **Two pointers**: Track row (i) and column (j) position
- **Lazy evaluation**: Only advance when next() is called
- **Empty row handling**: Skip empty rows in hasNext()
- **Time complexity**: next() O(1), hasNext() amortized O(1)

Key insights:
1. Maintain two-level indexing for nested structures
2. hasNext() should prepare position before returning true
3. Always handle empty sub-arrays gracefully
4. Reset column index when moving to new row

---

## Follow-up Questions

### Q1: How would you handle very large 2D vectors efficiently?

**Answer:** The current solution is already O(1) space. For time, consider pre-computing flat list but this uses O(n) space.

### Q2: Can you add a peek() method?

**Answer:** Yes, return the current element without advancing. Need to store the peeked value.

### Q3: How would you modify for 3D vectors?

**Answer:** Extend to three-level indexing (i, j, k) or recursively flatten.

### Q4: What if the vector is modified during iteration?

**Answer:** Need to add synchronization or make a copy. Current design assumes static vector.

---

## Intuition

The key insight for this problem is maintaining a **two-pointer position** to track where we are in the 2D vector. We need to:

1. **Track Position**: Use row index (i) and column index (j) to track current position
2. **Skip Empty Rows**: When hasNext() is called, skip any empty sub-arrays
3. **Lazy Evaluation**: Only advance the pointer when next() is called

### Key Observations

1. **Two-Level Indexing**: We need to track which row (i) and which column (j) we're at
2. **Automatic Row Advancement**: When j reaches end of a row, move to next row and reset j to 0
3. **hasNext() as Preparer**: hasNext() should prepare the position before returning true

### Example Walkthrough

For `vec = [[1, 2], [3], [4]]`:
```
Initial: i=0, j=0 → points to 1
next() → returns 1, j=1 → points to 2
next() → returns 2, j=2 → end of row 0, i=1, j=0
hasNext() → i=1 < 3, returns true
next() → returns 3, j=1 → end of row 1, i=2, j=0
hasNext() → i=2 < 3, returns true  
next() → returns 4, j=1 → end of row 2, i=3, j=0
hasNext() → i=3 >= 3, returns false
```

---

## Solution Approaches

## Approach 1: Two Pointers (Optimal)

### Algorithm Steps

1. Initialize with i=0, j=0 pointing to first element
2. In next(): return current element, advance j, handle row transition
3. In hasNext(): skip empty rows, check if i < len(vec)

### Why It Works

The two-pointer approach naturally traverses the 2D structure. By maintaining row and column indices, we can efficiently navigate through nested arrays.

### Code Implementation

````carousel
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

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Vector2D {
public:
    Vector2D(vector<vector<int>>& vec) {
        this->vec = vec;
        i = 0;
        j = 0;
    }
    
    int next() {
        int res = vec[i][j];
        j++;
        if (j >= vec[i].size()) {
            i++;
            j = 0;
        }
        return res;
    }
    
    bool hasNext() {
        while (i < vec.size() && j >= vec[i].size()) {
            i++;
            j = 0;
        }
        return i < vec.size();
    }
    
private:
    vector<vector<int>> vec;
    int i;
    int j;
};
```

<!-- slide -->
```java
import java.util.*;

class Vector2D {
    private List<List<Integer>> vec;
    private int i, j;
    
    public Vector2D(List<List<Integer>> vec) {
        this.vec = vec;
        i = 0;
        j = 0;
    }
    
    public int next() {
        int res = vec.get(i).get(j);
        j++;
        if (j >= vec.get(i).size()) {
            i++;
            j = 0;
        }
        return res;
    }
    
    public boolean hasNext() {
        while (i < vec.size() && j >= vec.get(i).size()) {
            i++;
            j = 0;
        }
        return i < vec.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} vec
 */
var Vector2D = function(vec) {
    this.vec = vec;
    this.i = 0;
    this.j = 0;
};

/**
 * @return {number}
 */
Vector2D.prototype.next = function() {
    const res = this.vec[this.i][this.j];
    this.j++;
    if (this.j >= this.vec[this.i].length) {
        this.i++;
        this.j = 0;
    }
    return res;
};

/**
 * @return {boolean}
 */
Vector2D.prototype.hasNext = function() {
    while (this.i < this.vec.length && this.j >= this.vec[this.i].length) {
        this.i++;
        this.j = 0;
    }
    return this.i < this.vec.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | next() O(1), hasNext() amortized O(1) |
| **Space** | O(1) |

---

## Approach 2: Using Iterator (Alternative)

### Algorithm Steps

1. Use iterators to traverse rows and columns
2. Maintain flat iterator pointing to valid elements
3. Skip empty rows during initialization and advancement

### Why It Works

By using language-provided iterators, we abstract away the complexity of two-level indexing.

### Code Implementation

````carousel
```python
from typing import List

class Vector2D:
    def __init__(self, vec: List[List[int]]):
        # Create a flat iterator over non-empty rows
        self.rows = iter([row for row in vec if row])
        self.col_iter = iter([])
        self._advance()
    
    def _advance(self):
        try:
            self.col_iter = next(self.rows)
        except StopIteration:
            self.col_iter = iter([])
    
    def next(self) -> int:
        try:
            result = next(self.col_iter)
            return result
        except StopIteration:
            self._advance()
            return next(self.col_iter)
    
    def hasNext(self) -> bool:
        try:
            # Check if current iterator has more
            return self.col_iter.__length_hint__() > 0 if hasattr(self.col_iter, '__length_hint__') else True
        except:
            return False
```

<!-- slide -->
```cpp
// Similar concept using C++ iterators
```

<!-- slide -->
```java
// Similar concept using Java iterators
```

<!-- slide -->
```javascript
// Similar concept using JavaScript iterators
```
````

---

## Comparison of Approaches

| Aspect | Two Pointers | Iterator-based |
|--------|--------------|----------------|
| **Time Complexity** | O(1) | O(1) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Two Pointers) for simplicity and efficiency.
