# Implement Queue Using Stacks

## LeetCode Link

[LeetCode Problem 232: Implement Queue Using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)

## Problem Description

Implement a **first in first out (FIFO)** queue using only two stacks. The implemented queue should support all the functions of a normal queue:

- `void push(int x)` - Pushes element `x` to the back of the queue.
- `int pop()` - Removes the element from the front of the queue and returns it.
- `int peek()` - Returns the element at the front of the queue.
- `boolean empty()` - Returns `true` if the queue is empty, `false` otherwise.

> **Note:** You must use only standard operations of a stack: push to top, peek/pop from top, size, and is empty operations.

---

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

---

## Constraints

- `1 <= x <= 9`
- At most 100 calls will be made to push, pop, peek, and empty.
- All calls to pop and peek are valid.

---

## Pattern: Two-Stack Queue

This problem follows the **Two-Stack** pattern for implementing queue operations using stacks.

### Core Concept

- **Input Stack**: Used for push operations
- **Output Stack**: Used for pop/peek operations
- **Order Reversal**: Transferring elements between stacks reverses order (LIFO → FIFO)

### When to Use This Pattern

This pattern is applicable when:
1. Implementing one data structure using another
2. Converting LIFO to FIFO behavior
3. Achieving amortized O(1) operations

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Single Stack + Recursion | Use recursion to reverse order |
| Two Queues | Reverse approach (stack using queues) |

---

## Intuition

The key insight is using **two stacks** to simulate queue behavior. A stack is LIFO (Last In First Out), but we need FIFO (First In First Out).

### Key Observations

1. **Two Stacks Strategy**: Use one stack for enqueue (push), another for dequeue (pop/peek)
2. **Order Reversal**: When transferring from input stack to output stack, elements get reversed
3. **Amortized O(1)**: Each element is moved at most once - either to output stack or stays in input

### How It Works

- **Push**: Add to input stack (s1) - O(1)
- **Pop/Peek**: If output stack (s2) empty, transfer all from s1 to s2 (reversing order), then pop/peek from s2
- **Transfer**: Only happens when s2 is empty - each element moved at most once

The reversal during transfer is what converts LIFO to FIFO!

---

## Summary

The **Implement Queue Using Stacks** problem demonstrates the **Two-Stack** pattern:

- **Approach**: Two stacks - input for push, output for pop/peek
- **Amortized Time**: O(1) for all operations
- **Space**: O(n) for storing elements

Key insight: transferring elements from input to output stack reverses order, enabling FIFO behavior from LIFO stacks.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two-Stack Approach (Optimal)** - Amortized O(1)
2. **Single Stack with Recursion** - Alternative approach

---

## Approach 1: Two-Stack Approach (Optimal)

### Code Implementation

````carousel
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

<!-- slide -->
```cpp
#include <stack>
using namespace std;

class MyQueue {
private:
    stack<int> s1;  // Input stack
    stack<int> s2;  // Output stack
    
    void transfer() {
        while (!s1.empty()) {
            s2.push(s1.top());
            s1.pop();
        }
    }
    
public:
    /** Initialize your data structure here. */
    MyQueue() {}
    
    /** Push element x to the back of queue. */
    void push(int x) {
        s1.push(x);
    }
    
    /** Removes the element from in front of queue and returns that element. */
    int pop() {
        if (s2.empty()) {
            transfer();
        }
        int val = s2.top();
        s2.pop();
        return val;
    }
    
    /** Get the front element. */
    int peek() {
        if (s2.empty()) {
            transfer();
        }
        return s2.top();
    }
    
    /** Returns whether the queue is empty. */
    bool empty() {
        return s1.empty() && s2.empty();
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

class MyQueue {
    private Stack<Integer> s1;
    private Stack<Integer> s2;
    
    public MyQueue() {
        s1 = new Stack<>();
        s2 = new Stack<>();
    }
    
    private void transfer() {
        while (!s1.isEmpty()) {
            s2.push(s1.pop());
        }
    }
    
    /** Push element x to the back of queue. */
    public void push(int x) {
        s1.push(x);
    }
    
    /** Removes the element from in front of queue and returns that element. */
    public int pop() {
        if (s2.isEmpty()) {
            transfer();
        }
        return s2.pop();
    }
    
    /** Get the front element. */
    public int peek() {
        if (s2.isEmpty()) {
            transfer();
        }
        return s2.peek();
    }
    
    /** Returns whether the queue is empty. */
    public boolean empty() {
        return s1.isEmpty() && s2.isEmpty();
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var MyQueue = function() {
    this.s1 = [];  // Input stack
    this.s2 = [];  // Output stack
};

MyQueue.prototype.transfer = function() {
    while (this.s1.length > 0) {
        this.s2.push(this.s1.pop());
    }
};

/**
 * Push element x to the back of queue. 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
    this.s1.push(x);
};

/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function() {
    if (this.s2.length === 0) {
        this.transfer();
    }
    return this.s2.pop();
};

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function() {
    if (this.s2.length === 0) {
        this.transfer();
    }
    return this.s2[this.s2.length - 1];
};

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
    return this.s1.length === 0 && this.s2.length === 0;
};
```
````

### Complexity Analysis

| Operation | Time Complexity | Explanation |
|-----------|-----------------|-------------|
| Push | O(1) | Direct push to input stack |
| Pop | Amortized O(1) | Each element moved at most once |
| Peek | Amortized O(1) | Each element moved at most once |
| Empty | O(1) | Check both stacks |

---

## Approach 2: Single Stack with Recursion

### Algorithm
Use a single stack and simulate queue operations using recursion to reverse the order.

### Code Implementation

````carousel
```python
class MyQueue:
    def __init__(self):
        self.stack = []

    def push(self, x: int) -> None:
        self.stack.append(x)

    def pop(self) -> int:
        # Use recursion to reverse order
        def reverse():
            if not self.stack:
                return None
            if len(self.stack) == 1:
                return self.stack.pop()
            
            temp = self.stack.pop()
            result = reverse()
            self.stack.append(temp)
            return result
        
        return reverse()

    def peek(self) -> int:
        def reverse():
            if not self.stack:
                return None
            if len(self.stack) == 1:
                return self.stack[-1]
            
            temp = self.stack.pop()
            result = reverse()
            self.stack.append(temp)
            return result
        
        return reverse()

    def empty(self) -> bool:
        return len(self.stack) == 0
```

<!-- slide -->
```cpp
#include <stack>
using namespace std;

class MyQueue {
private:
    stack<int> s;
    
    int reverseHelper(bool returnTop) {
        if (s.empty()) return -1;
        
        int temp = s.top();
        s.pop();
        
        if (s.empty()) {
            int result = returnTop ? temp : temp;
            s.push(temp);
            return result;
        }
        
        int result = reverseHelper(returnTop);
        s.push(temp);
        return result;
    }
    
public:
    MyQueue() {}
    
    void push(int x) {
        s.push(x);
    }
    
    int pop() {
        return reverseHelper(false);
    }
    
    int peek() {
        return reverseHelper(true);
    }
    
    bool empty() {
        return s.empty();
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

class MyQueue {
    private Stack<Integer> s;
    
    public MyQueue() {
        s = new Stack<>();
    }
    
    private int reverseHelper(boolean returnTop) {
        if (s.isEmpty()) return -1;
        
        int temp = s.pop();
        
        if (s.isEmpty()) {
            int result = returnTop ? temp : temp;
            s.push(temp);
            return result;
        }
        
        int result = reverseHelper(returnTop);
        s.push(temp);
        return result;
    }
    
    public void push(int x) {
        s.push(x);
    }
    
    public int pop() {
        return reverseHelper(false);
    }
    
    public int peek() {
        return reverseHelper(true);
    }
    
    public boolean empty() {
        return s.isEmpty();
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var MyQueue = function() {
    this.stack = [];
};

MyQueue.prototype.reverseHelper = function(returnTop) {
    if (this.stack.length === 0) return -1;
    
    const temp = this.stack.pop();
    
    if (this.stack.length === 0) {
        const result = returnTop ? temp : temp;
        this.stack.push(temp);
        return result;
    }
    
    const result = this.reverseHelper(returnTop);
    this.stack.push(temp);
    return result;
};

/**
 * Push element x to the back of queue. 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
    this.stack.push(x);
};

/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function() {
    return this.reverseHelper(false);
};

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function() {
    return this.reverseHelper(true);
};

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
    return this.stack.length === 0;
};
```
````

### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Push | O(1) | O(1) |
| Pop | O(n) | O(n) recursion |
| Peek | O(n) | O(n) recursion |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [Implement Stack Using Queues](/solutions/implement-stack-using-queues.md) | 225 | Reverse problem |
| [Design Circular Queue](/solutions/design-circular-queue.md) | 622 | Array-based queue |
| [Design Circular Deque](/solutions/design-circular-deque.md) | 641 | Double-ended queue |

---

## Video Tutorial Links

1. **[Implement Queue Using Stacks - NeetCode](https://www.youtube.com/watch?v=r3Z3D6A4Q5Q)** - Clear explanation
2. **[Two Stack Queue - Back to Back SWE](https://www.youtube.com/watch?v=3R8J3k5l5X4)** - Visual demonstration

---

## Follow-up Questions

### Q1: How would you implement peek() to return the front element?
**Answer:** If output stack is empty, transfer all elements. Then return the top of the output stack without popping.

### Q2: What's the amortized time complexity?
**Answer:** O(1) amortized. Each element is moved at most once from input to output stack.

### Q3: Can you implement this with only one stack?
**Answer:** Yes, using recursion to simulate the reverse transfer, but it's less efficient (O(n) per operation).

### Q4: How does this compare to using two queues?
**Answer:** The stack approach achieves amortized O(1), while queue-based approaches have worse performance.

---

## Summary

The **Implement Queue Using Stacks** problem demonstrates the **Two-Stack** pattern:

- **Approach**: Two stacks - input for push, output for pop/peek
- **Amortized Time**: O(1) for all operations
- **Space**: O(n) for storing elements

Key insight: transferring elements from input to output stack reverses order, enabling FIFO behavior from LIFO stacks.

---

## Solution (Original)

## Common Pitfalls

- **Not transferring at the right time**: Only transfer elements when the output stack is empty and a pop/peek is requested.
- **Forgetting to check both stacks for empty**: The `empty()` method must check both stacks.
- **Amortized complexity misunderstanding**: While individual pop/peek can be O(n), the amortized cost is O(1) since each element is moved at most once.
- **Swapping references incorrectly**: When transferring, ensure all elements are moved (use while loop) before switching stacks.

---

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

---

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Push | O(1) | O(1) |
| Pop | Amortized O(1) | O(1) |
| Peek | Amortized O(1) | O(1) |
| Empty | O(1) | O(1) |

**Overall Space:** O(n) for storing all elements.
