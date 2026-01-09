# Implement Queue Using Stacks

## Problem Description

Implement a **first in first out (FIFO)** queue using only two stacks. The implemented queue should support all the functions of a normal queue:

- `void push(int x)` - Pushes element `x` to the back of the queue.
- `int pop()` - Removes the element from the front of the queue and returns it.
- `int peek()` - Returns the element at the front of the queue.
- `boolean empty()` - Returns `true` if the queue is empty, `false` otherwise.

> **Note:** You must use only standard operations of a stack: push to top, peek/pop from top, size, and is empty operations.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `["MyQueue", "push", "push", "peek", "pop", "empty"]`<br>`[[], [1], [2], [], [], []]` | `[null, null, null, 1, 1, false]` |

**Explanation:**
```python
MyQueue myQueue = new MyQueue();
myQueue.push(1);    // queue is: [1]
myQueue.push(2);    // queue is: [1, 2] (leftmost is front)
myQueue.peek();     // return 1
myQueue.pop();      // return 1, queue is [2]
myQueue.empty();    // return false
```

**Follow-up:** Can you implement the queue such that each operation is **amortized O(1)** time complexity?

## Constraints

- `1 <= x <= 9`
- At most 100 calls will be made to push, pop, peek, and empty.
- All calls to pop and peek are valid.

## Solution

```python
class MyQueue:

    def __init__(self):
        self.s1 = []  # Input stack for push operations
        self.s2 = []  # Output stack for pop/peek operations

    def push(self, x: int) -> None:
        """Push element x to the back of the queue."""
        self.s1.append(x)

    def pop(self) -> int:
        """Removes the element from the front of the queue and returns it."""
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2.pop()

    def peek(self) -> int:
        """Returns the element at the front of the queue."""
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2[-1]

    def empty(self) -> bool:
        """Returns true if the queue is empty, false otherwise."""
        return not self.s1 and not self.s2
```

## Explanation

This problem implements a queue using two stacks with an amortized O(1) approach.

### Data Structure Design

- **`s1` (Input Stack):** Used for push operations. Elements are added here in the order they arrive.
- **`s2` (Output Stack):** Used for pop and peek operations. Elements are reversed here to maintain FIFO order.

### Key Operations

1. **Push (`x`):** Simply append to `s1`. O(1) time.

2. **Pop/Peek:**
   - If `s2` is empty, transfer all elements from `s1` to `s2` (reversing order).
   - Then pop/peek from `s2`.
   - Each element is moved at most once from `s1` to `s2`, giving amortized O(1).

3. **Empty:** Check if both stacks are empty.

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Push | O(1) | O(1) |
| Pop | Amortized O(1) | O(1) |
| Peek | Amortized O(1) | O(1) |
| Empty | O(1) | O(1) |

**Overall Space:** O(n) for storing all elements.
