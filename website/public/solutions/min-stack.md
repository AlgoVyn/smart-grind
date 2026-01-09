# Min Stack

## Problem Description

Design a stack that supports `push`, `pop`, `top`, and retrieving the **minimum element** in **constant time**.

### Operations

| Operation | Description |
|-----------|-------------|
| `MinStack()` | Initializes the stack object |
| `push(val)` | Pushes element `val` onto the stack |
| `pop()` | Removes the element on top of the stack |
| `top()` | Gets the top element of the stack |
| `getMin()` | Retrieves the minimum element in the stack |

All operations must run in **O(1)** time complexity.

---

## Examples

**Example:**

| Operations | Output |
|------------|--------|
| `["MinStack","push","push","push","getMin","pop","top","getMin"]` | `[null,null,null,null,-3,null,0,-2]` |
| `[[],[-2],[0],[-3],[],[],[],[]]` | |

**Explanation:**
1. `minStack.push(-2)` — Stack: `[-2]`, Min: `-2`
2. `minStack.push(0)` — Stack: `[-2, 0]`, Min: `-2`
3. `minStack.push(-3)` — Stack: `[-2, 0, -3]`, Min: `-3`
4. `minStack.getMin()` — Returns `-3`
5. `minStack.pop()` — Stack: `[-2, 0]`, Min: `-2`
6. `minStack.top()` — Returns `0`
7. `minStack.getMin()` — Returns `-2`

---

## Constraints

- `-2^31 <= val <= 2^31 - 1`
- Operations `pop`, `top`, and `getMin` will always be called on **non-empty** stacks
- At most `3 * 10^4` calls will be made to `push`, `pop`, `top`, and `getMin`

---

## Solution

```python
class MinStack:
    def __init__(self):
        self.stack = []          # Main stack for values
        self.min_stack = []      # Auxiliary stack for minimums

    def push(self, val: int) -> None:
        """Push val onto stack and update min_stack."""
        self.stack.append(val)
        
        # Push to min_stack if empty or val is <= current minimum
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
        else:
            # Push current minimum again to maintain alignment
            self.min_stack.append(self.min_stack[-1])

    def pop(self) -> None:
        """Pop from both stacks."""
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        """Return top element of stack."""
        return self.stack[-1]

    def getMin(self) -> int:
        """Return minimum element in stack."""
        return self.min_stack[-1]
```

---

## Explanation

We use **two stacks** to track values and their corresponding minimums:

1. **`stack`**: Stores all pushed values.
2. **`min_stack`**: Stores the minimum value at each position.

**For `push(val)`**:
- Push `val` to `stack`.
- Push `min(val, current_min)` to `min_stack`.

**For `pop()`**:
- Pop from both `stack` and `min_stack`.

**For `top()`**:
- Return the top element of `stack`.

**For `getMin()`**:
- Return the top element of `min_stack`.

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| `push` | O(1) | O(1) |
| `pop` | O(1) | O(1) |
| `top` | O(1) | O(1) |
| `getMin` | O(1) | O(1) |

**Overall Space:** `O(n)` — where `n` is the number of elements in the stack
