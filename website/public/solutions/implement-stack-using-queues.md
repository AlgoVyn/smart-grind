# Implement Stack Using Queues

## Problem Description

Implement a **last-in-first-out (LIFO)** stack using only two queues. The implemented stack should support all the functions of a normal stack:

- `void push(int x)` - Pushes element `x` to the top of the stack.
- `int pop()` - Removes the element on the top of the stack and returns it.
- `int top()` - Returns the element on the top of the stack.
- `boolean empty()` - Returns `true` if the stack is empty, `false` otherwise.

> **Note:** You must use only standard operations of a queue: push to back, peek/pop from front, size, and is empty operations.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `["MyStack", "push", "push", "top", "pop", "empty"]`<br>`[[], [1], [2], [], [], []]` | `[null, null, null, 2, 2, false]` |

**Explanation:**
```python
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top();     // return 2
myStack.pop();     // return 2
myStack.empty();   // return false
```

**Follow-up:** Can you implement the stack using only one queue?

## Constraints

- `1 <= x <= 9`
- At most 100 calls will be made to push, pop, top, and empty.
- All calls to pop and top are valid.

## Solution

```python
from collections import deque

class MyStack:

    def __init__(self):
        self.q1 = deque()  # Main queue
        self.q2 = deque()  # Temporary queue

    def push(self, x: int) -> None:
        """Push element x onto the stack."""
        self.q1.append(x)

    def pop(self) -> int:
        """Removes the element on top of the stack and returns it."""
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())
        res = self.q1.popleft()
        self.q1, self.q2 = self.q2, self.q1  # Swap queues
        return res

    def top(self) -> int:
        """Returns the element on top of the stack."""
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())
        res = self.q1.popleft()
        self.q2.append(res)
        self.q1, self.q2 = self.q2, self.q1  # Swap queues
        return res

    def empty(self) -> bool:
        """Returns true if the stack is empty, false otherwise."""
        return not self.q1
```

## Explanation

This problem implements a stack using two queues with O(n) push/pop operations.

### Data Structure Design

- **`q1` (Main Queue):** Contains all elements in their current stack order.
- **`q2` (Temporary Queue):** Used during pop/top operations to reorder elements.

### Key Operations

1. **Push:** Simply append to `q1`. O(1) time.

2. **Pop/Top:**
   - Move all but the last element from `q1` to `q2`.
   - The last element in `q1` is the one to return.
   - For pop: remove it and swap queues.
   - For top: remove it, add to `q2`, then swap queues.

3. **Empty:** Check if `q1` is empty.

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Push | O(1) | O(1) |
| Pop | O(n) | O(1) |
| Top | O(n) | O(1) |
| Empty | O(1) | O(1) |

**Overall Space:** O(n) for storing all elements.
