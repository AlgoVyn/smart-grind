# Implement Stack Using Queues

## LeetCode Link

[LeetCode Problem 225: Implement Stack Using Queues](https://leetcode.com/problems/implement-stack-using-queues/)

## Problem Description

Implement a **last-in-first-out (LIFO)** stack using only two queues. The implemented stack should support all the functions of a normal stack:

- `void push(int x)` - Pushes element `x` to the top of the stack.
- `int pop()` - Removes the element on the top of the stack and returns it.
- `int top()` - Returns the element on the top of the stack.
- `boolean empty()` - Returns `true` if the stack is empty, `false` otherwise.

> **Note:** You must use only standard operations of a queue: push to back, peek/pop from front, size, and is empty operations.

---

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

---

## Constraints

- `1 <= x <= 9`
- At most 100 calls will be made to push, pop, top, and empty.
- All calls to pop and top are valid.

---

## Pattern: Queue-Based Stack

This problem follows the **Queue Reordering** pattern for implementing stack operations using queues.

### Core Concept

- **Queue Order Reversal**: Moving elements between queues reverses their relative order
- **Keep Last Element**: For pop/top, move all elements except the last one to temp queue
- **Swap Queues**: After operation, swap the queues to maintain correct structure

### When to Use This Pattern

This pattern is applicable when:
1. Implementing one data structure using another
2. Converting FIFO to LIFO behavior
3. Reordering elements to achieve different access patterns

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Single Queue + Rotation | Rotate queue during push to simulate LIFO |
| Two Stacks | Reverse approach (queue using stacks) |

---

## Intuition

The key insight is using **two queues** to simulate LIFO behavior. We need to move all elements except the last one to a temporary queue to get the "top" element.

### Key Observations

1. **Queue Order Reversal**: Moving elements from one queue to another reverses their relative order
2. **Keep Last Element**: For pop/top, we move all elements except the last one to temp queue
3. **Swap Queues**: After operation, swap the queues to maintain correct structure

### How It Works

- **Push**: Add to main queue (q1) - O(1)
- **Pop/Top**: Move all but last element from q1 to q2, the remaining element is the result
- **Empty**: Check if q1 is empty

The key is that by moving n-1 elements, the last element becomes accessible for pop/top operations.

---

## Summary

The **Implement Stack Using Queues** problem demonstrates the **Two-Queue Reordering** pattern:

- **Approach**: Two queues - move n-1 elements to temp queue to access last element
- **Push Time**: O(1)
- **Pop/Top Time**: O(n)
- **Space**: O(n)

Key insight: Moving elements between queues reverses order, making the last element accessible for LIFO operations.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two-Queue Approach** - Using two queues for operations
2. **Single-Queue Approach (Optimal)** - Using only one queue with rotation

---

## Approach 1: Two-Queue Approach

### Code Implementation

````carousel
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

<!-- slide -->
```cpp
#include <queue>
using namespace std;

class MyStack {
private:
    queue<int> q1;
    queue<int> q2;
    
public:
    /** Initialize your data structure here. */
    MyStack() {}
    
    /** Push element x onto stack. */
    void push(int x) {
        q1.push(x);
    }
    
    /** Removes the element on top of the stack and returns that element. */
    int pop() {
        while (q1.size() > 1) {
            q2.push(q1.front());
            q1.pop();
        }
        int res = q1.front();
        q1.pop();
        swap(q1, q2);
        return res;
    }
    
    /** Get the top element. */
    int top() {
        while (q1.size() > 1) {
            q2.push(q1.front());
            q1.pop();
        }
        int res = q1.front();
        q2.push(res);
        q1.pop();
        swap(q1, q2);
        return res;
    }
    
    /** Returns whether the stack is empty. */
    bool empty() {
        return q1.empty();
    }
};
```

<!-- slide -->
```java
import java.util.LinkedList;
import java.util.Queue;

class MyStack {
    private Queue<Integer> q1;
    private Queue<Integer> q2;
    
    public MyStack() {
        q1 = new LinkedList<>();
        q2 = new LinkedList<>();
    }
    
    /** Push element x onto stack. */
    public void push(int x) {
        q1.add(x);
    }
    
    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        while (q1.size() > 1) {
            q2.add(q1.remove());
        }
        int res = q1.remove();
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
        return res;
    }
    
    /** Get the top element. */
    public int top() {
        while (q1.size() > 1) {
            q2.add(q1.remove());
        }
        int res = q1.remove();
        q2.add(res);
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
        return res;
    }
    
    /** Returns whether the stack is empty. */
    public boolean empty() {
        return q1.isEmpty();
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var MyStack = function() {
    this.q1 = [];
    this.q2 = [];
};

/**
 * Push element x onto stack. 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    this.q1.push(x);
};

/**
 * Removes the element on top of the stack and returns that element.
 * @return {number}
 */
MyStack.prototype.pop = function() {
    while (this.q1.length > 1) {
        this.q2.push(this.q1.shift());
    }
    const res = this.q1.shift();
    [this.q1, this.q2] = [this.q2, this.q1];
    return res;
};

/**
 * Get the top element.
 * @return {number}
 */
MyStack.prototype.top = function() {
    while (this.q1.length > 1) {
        this.q2.push(this.q1.shift());
    }
    const res = this.q1.shift();
    this.q2.push(res);
    [this.q1, this.q2] = [this.q2, this.q1];
    return res;
};

/**
 * Returns whether the stack is empty.
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.q1.length === 0;
};
```
````

---

## Approach 2: Single-Queue Approach (Optimal)

### Algorithm
This approach uses only one queue. During push, we rotate the queue to move the newly added element to the front.

### Code Implementation

````carousel
```python
from collections import deque

class MyStack:

    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        """Push element x onto the stack."""
        self.q.append(x)
        # Rotate to make the newly added element at front
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        """Removes the element on top of the stack and returns it."""
        return self.q.popleft()

    def top(self) -> int:
        """Returns the element on top of the stack."""
        return self.q[0]

    def empty(self) -> bool:
        """Returns true if the stack is empty, false otherwise."""
        return not self.q
```

<!-- slide -->
```cpp
#include <queue>
using namespace std;

class MyStack {
private:
    queue<int> q;
    
public:
    /** Initialize your data structure here. */
    MyStack() {}
    
    /** Push element x onto stack. */
    void push(int x) {
        q.push(x);
        // Rotate to make newly added element at front
        for (int i = 0; i < q.size() - 1; i++) {
            q.push(q.front());
            q.pop();
        }
    }
    
    /** Removes the element on top of the stack and returns that element. */
    int pop() {
        int val = q.front();
        q.pop();
        return val;
    }
    
    /** Get the top element. */
    int top() {
        return q.front();
    }
    
    /** Returns whether the stack is empty. */
    bool empty() {
        return q.empty();
    }
};
```

<!-- slide -->
```java
import java.util.LinkedList;
import java.util.Queue;

class MyStack {
    private Queue<Integer> q;
    
    public MyStack() {
        q = new LinkedList<>();
    }
    
    /** Push element x onto stack. */
    public void push(int x) {
        q.add(x);
        // Rotate to make newly added element at front
        for (int i = 0; i < q.size() - 1; i++) {
            q.add(q.remove());
        }
    }
    
    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        return q.remove();
    }
    
    /** Get the top element. */
    public int top() {
        return q.peek();
    }
    
    /** Returns whether the stack is empty. */
    public boolean empty() {
        return q.isEmpty();
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var MyStack = function() {
    this.q = [];
};

/**
 * Push element x onto stack. 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    this.q.push(x);
    // Rotate to make newly added element at front
    for (let i = 0; i < this.q.length - 1; i++) {
        this.q.push(this.q.shift());
    }
};

/**
 * Removes the element on top of the stack and returns that element.
 * @return {number}
 */
MyStack.prototype.pop = function() {
    return this.q.shift();
};

/**
 * Get the top element.
 * @return {number}
 */
MyStack.prototype.top = function() {
    return this.q[0];
};

/**
 * Returns whether the stack is empty.
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.q.length === 0;
};
```
````

### Complexity Analysis

| Operation | Two-Queue | Single-Queue |
|-----------|-----------|--------------|
| Push | O(1) | O(n) |
| Pop | O(n) | O(1) |
| Top | O(n) | O(1) |
| Space | O(n) | O(n) |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [Implement Queue Using Stacks](/solutions/implement-queue-using-stacks.md) | 232 | Reverse problem |
| [Design Circular Queue](/solutions/design-circular-queue.md) | 622 | Array-based queue |

---

## Video Tutorial Links

1. **[Implement Stack Using Queues - NeetCode](https://www.youtube.com/watch?v=r3Z3D6A4Q5Q)** - Clear explanation
2. **[Stack Using Two Queues - Back to Back SWE](https://www.youtube.com/watch?v=gY8t8z4h8h4)** - Visual demonstration

---

## Follow-up Questions

### Q1: Can you implement stack using only one queue?
**Answer:** Yes, by rotating the queue during each push operation to move the newly added element to the front.

### Q2: What's the time complexity difference between approaches?
**Answer:** Two-queue: O(1) push, O(n) pop. Single-queue: O(n) push, O(1) pop.

### Q3: Which approach is better?
**Answer:** Depends on usage pattern. If more pushes, use two-queue. If more pops, use single-queue.

---

## Summary

The **Implement Stack Using Queues** problem demonstrates the **Queue Reordering** pattern:

- **Two-Queue**: Move n-1 elements to temp queue to access last element
- **Single-Queue**: Rotate queue during push to simulate LIFO
- **Time**: O(1) for some operations, O(n) for others
- **Space**: O(n)

---

## Solution (Original)

## Common Pitfalls

- **Moving wrong number of elements**: Move all elements except one (`len(q1) > 1`) to the temporary queue, not all elements.
- **Not swapping queues after operation**: After pop/top, must swap q1 and q2 to maintain the correct queue for subsequent operations.
- **Forgetting to re-add element for top()**: In `top()`, after getting the last element, it must be added back to the temporary queue before swapping.
- **Checking wrong queue in empty()**: The `empty()` method should check q1 (the main queue), not q2.

---

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

---

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Push | O(1) | O(1) |
| Pop | O(n) | O(1) |
| Top | O(n) | O(1) |
| Empty | O(1) | O(1) |

**Overall Space:** O(n) for storing all elements.
