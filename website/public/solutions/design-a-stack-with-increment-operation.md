# Design A Stack With Increment Operation

## Problem Description

Design a stack that supports increment operations on its elements.
Implement the CustomStack class:

- `CustomStack(int maxSize)` Initializes the object with maxSize which is the maximum number of elements in the stack.
- `void push(int x)` Adds x to the top of the stack if the stack has not reached the maxSize.
- `int pop()` Pops and returns the top of the stack or -1 if the stack is empty.
- `void inc(int k, int val)` Increments the bottom k elements of the stack by val. If there are less than k elements in the stack, increment all the elements in the stack.

**LeetCode Link:** [Design A Stack With Increment Operation - LeetCode](https://leetcode.com/problems/design-a-stack-with-increment-operation/)

---

## Examples

### Example 1

**Input:**
```python
["CustomStack","push","push","pop","push","push","push","increment","increment","pop","pop","pop","pop"]
[[3],[1],[2],[],[2],[3],[4],[5,100],[2,100],[],[],[],[]]
```

**Output:**
```python
[null,null,null,2,null,null,null,null,null,103,202,201,-1]
```

**Explanation:**
```
CustomStack stk = new CustomStack(3); // Stack is Empty []
stk.push(1);                          // stack becomes [1]
stk.push(2);                          // stack becomes [1, 2]
stk.pop();                            // return 2 --> Return top of the stack 2, stack becomes [1]
stk.push(2);                          // stack becomes [1, 2]
stk.push(3);                          // stack becomes [1, 2, 3]
stk.push(4);                          // stack still [1, 2, 3], Do not add another elements as size is 4
stk.increment(5, 100);                // stack becomes [101, 102, 103]
stk.increment(2, 100);                // stack becomes [201, 202, 103]
stk.pop();                            // return 103 --> Return top of the stack 103, stack becomes [201, 202]
stk.pop();                            // return 202 --> Return top of the stack 202, stack becomes [201]
stk.pop();                            // return 201 --> Return top of the stack 201, stack becomes []
stk.pop();                            // return -1 --> Stack is empty return -1.
```

---

## Constraints

- `1 <= maxSize, x, k <= 1000`
- `0 <= val <= 100`
- At most 1000 calls will be made to each method of increment, push and pop each separately.

---

## Pattern: Lazy Propagation with Auxiliary Array

This problem demonstrates the **Lazy Propagation** pattern where increment operations are stored in an auxiliary array and only applied when elements are popped from the stack. This avoids O(n) operations for each increment call.

### Core Concept

- **Auxiliary Array**: Store pending increments separately
- **Lazy Application**: Apply increments only when popping
- **O(1) Operations**: All operations should be O(1)

### When to Use This Pattern

This pattern is applicable when:
1. Batch updates with delayed application
2. Range updates with point queries
3. Problems requiring amortized O(1) operations

---

## Intuition

The key insight for this problem is that we can avoid iterating through all elements during each increment operation by storing the increments lazily.

### Key Observations

1. **Naive Approach Problem**: Incrementing k elements by traversing the entire stack would be O(k) per operation.

2. **Lazy Propagation Solution**: Store increments in a separate array and only apply them when needed (during pop).

3. **Increment Array Logic**: The `inc[i]` stores how much should be added to stack[i] and all elements below it.

4. **Propagation**: When popping, add the increment to the element and propagate the remaining increment to the next element.

### Algorithm Overview

1. Maintain a stack array for values
2. Maintain an `inc` array for pending increments (same length as stack)
3. For `increment(k, val)`:
   - Apply val to first `min(k, stack.size())` elements
   - Store in inc array at the appropriate position
4. For `pop()`:
   - Add inc value to the popped element
   - Propagate remaining inc to next element

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Lazy Propagation (Optimal)** - O(1) all operations
2. **Naive Implementation** - O(k) for increment

---

## Approach 1: Lazy Propagation (Optimal)

### Algorithm Steps

1. Initialize stack and inc arrays
2. For push: add element, initialize inc as 0
3. For increment: add val to inc[min(k, size) - 1]
4. For pop: add inc[top] to value, propagate to previous, return value

### Why It Works

This approach works because:
- Storing increments lazily defers the work until needed
- Each increment is only applied when that element is popped
- The inc array acts like a "pending addition" tracker

### Code Implementation

````carousel
```python
class CustomStack:
    def __init__(self, maxSize: int):
        """
        Initialize the custom stack.
        
        Args:
            maxSize: Maximum size of the stack
        """
        self.stack = []  # Main stack for values
        self.max_size = maxSize
        self.inc = []   # Lazy increment array
    
    def push(self, x: int) -> None:
        """
        Push element x onto stack if not at capacity.
        
        Args:
            x: Value to push
        """
        if len(self.stack) < self.max_size:
            self.stack.append(x)
            self.inc.append(0)
    
    def pop(self) -> int:
        """
        Pop and return top element, applying any pending increments.
        
        Returns:
            Top element value or -1 if empty
        """
        if not self.stack:
            return -1
        
        # Propagate increment to previous element before popping
        if len(self.inc) > 1:
            self.inc[-2] += self.inc[-1]
        
        # Pop and add pending increment
        return self.stack.pop() + self.inc.pop()
    
    def increment(self, k: int, val: int) -> None:
        """
        Increment bottom k elements by val.
        
        Args:
            k: Number of elements from bottom
            val: Value to increment by
        """
        if not self.stack:
            return
        
        # Find the index to apply increment (k-th from bottom)
        idx = min(k, len(self.stack)) - 1
        if idx >= 0:
            self.inc[idx] += val
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class CustomStack {
private:
    vector<int> stack;
    vector<int> inc;
    int maxSize;
    
public:
    CustomStack(int maxSize) {
        this->maxSize = maxSize;
    }
    
    void push(int x) {
        if (stack.size() < maxSize) {
            stack.push_back(x);
            inc.push_back(0);
        }
    }
    
    int pop() {
        if (stack.empty()) {
            return -1;
        }
        
        // Propagate increment
        if (inc.size() > 1) {
            inc[inc.size() - 2] += inc.back();
        }
        
        int result = stack.back() + inc.back();
        stack.pop_back();
        inc.pop_back();
        return result;
    }
    
    void increment(int k, int val) {
        if (stack.empty()) {
            return;
        }
        
        int idx = min(k, (int)stack.size()) - 1;
        if (idx >= 0) {
            inc[idx] += val;
        }
    }
};
```

<!-- slide -->
```java
class CustomStack {
    private int[] stack;
    private int[] inc;
    private int top;
    private int maxSize;
    
    public CustomStack(int maxSize) {
        this.maxSize = maxSize;
        this.stack = new int[maxSize];
        this.inc = new int[maxSize];
        this.top = -1;
    }
    
    public void push(int x) {
        if (top < maxSize - 1) {
            stack[++top] = x;
            inc[top] = 0;
        }
    }
    
    public int pop() {
        if (top < 0) {
            return -1;
        }
        
        // Propagate increment
        if (top > 0) {
            inc[top - 1] += inc[top];
        }
        
        int result = stack[top] + inc[top];
        top--;
        return result;
    }
    
    public void increment(int k, int val) {
        if (top < 0) {
            return;
        }
        
        int idx = Math.min(k, top + 1) - 1;
        if (idx >= 0) {
            inc[idx] += val;
        }
    }
}
```

<!-- slide -->
```javascript
class CustomStack {
    /**
     * @param {number} maxSize
     */
    constructor(maxSize) {
        this.stack = [];
        this.inc = [];
        this.maxSize = maxSize;
    }
    
    /**
     * @param {number} x
     * @return {void}
     */
    push(x) {
        if (this.stack.length < this.maxSize) {
            this.stack.push(x);
            this.inc.push(0);
        }
    }
    
    /**
     * @return {number}
     */
    pop() {
        if (this.stack.length === 0) {
            return -1;
        }
        
        // Propagate increment to previous element
        if (this.inc.length > 1) {
            this.inc[this.inc.length - 2] += this.inc[this.inc.length - 1];
        }
        
        return this.stack.pop() + this.inc.pop();
    }
    
    /**
     * @param {number} k
     * @param {number} val
     * @return {void}
     */
    increment(k, val) {
        if (this.stack.length === 0) {
            return;
        }
        
        const idx = Math.min(k, this.stack.length) - 1;
        if (idx >= 0) {
            this.inc[idx] += val;
        }
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for all operations |
| **Space** | O(maxSize) |

---

## Approach 2: Naive Implementation

### Algorithm Steps

1. Simply iterate through first k elements and add val to each

### Why It Works

This approach directly implements the increment by updating each element, but is slower.

### Code Implementation

````carousel
```python
class CustomStack:
    def __init__(self, maxSize: int):
        self.stack = []
        self.max_size = maxSize
    
    def push(self, x: int) -> None:
        if len(self.stack) < self.max_size:
            self.stack.append(x)
    
    def pop(self) -> int:
        if not self.stack:
            return -1
        return self.stack.pop()
    
    def increment(self, k: int, val: int) -> None:
        # Directly increment first k elements
        for i in range(min(k, len(self.stack))):
            self.stack[i] += val
```

<!-- slide -->
```cpp
class CustomStack {
private:
    vector<int> stack;
    int maxSize;
    
public:
    CustomStack(int maxSize) : maxSize(maxSize) {}
    
    void push(int x) {
        if (stack.size() < maxSize) {
            stack.push_back(x);
        }
    }
    
    int pop() {
        if (stack.empty()) return -1;
        int val = stack.back();
        stack.pop_back();
        return val;
    }
    
    void increment(int k, int val) {
        int limit = min(k, (int)stack.size());
        for (int i = 0; i < limit; i++) {
            stack[i] += val;
        }
    }
};
```

<!-- slide -->
```java
class CustomStack {
    private int[] stack;
    private int top;
    private int maxSize;
    
    public CustomStack(int maxSize) {
        this.maxSize = maxSize;
        this.stack = new int[maxSize];
        this.top = -1;
    }
    
    public void push(int x) {
        if (top < maxSize - 1) {
            stack[++top] = x;
        }
    }
    
    public int pop() {
        if (top < 0) return -1;
        return stack[top--];
    }
    
    public void increment(int k, int val) {
        int limit = Math.min(k, top + 1);
        for (int i = 0; i < limit; i++) {
            stack[i] += val;
        }
    }
}
```

<!-- slide -->
```javascript
class CustomStack {
    constructor(maxSize) {
        this.stack = [];
        this.maxSize = maxSize;
    }
    
    push(x) {
        if (this.stack.length < this.maxSize) {
            this.stack.push(x);
        }
    }
    
    pop() {
        if (this.stack.length === 0) return -1;
        return this.stack.pop();
    }
    
    increment(k, val) {
        const limit = Math.min(k, this.stack.length);
        for (let i = 0; i < limit; i++) {
            this.stack[i] += val;
        }
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k) for increment |
| **Space** | O(maxSize) |

---

## Comparison of Approaches

| Aspect | Lazy Propagation | Naive |
|--------|------------------|-------|
| **Time - push** | O(1) | O(1) |
| **Time - pop** | O(1) | O(1) |
| **Time - increment** | O(1) | O(k) |
| **Space** | O(maxSize) | O(maxSize) |
| **Best For** | Frequent increments | Simple implementation |

**Best Approach:** Use Approach 1 (Lazy Propagation) as it provides O(1) for all operations.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in interviews
- **Companies**: Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Lazy propagation, Stack design, Optimization

### Learning Outcomes

1. **Lazy Propagation**: Master the concept of deferring operations
2. **Space-Time Tradeoff**: Understand when to trade space for time
3. **Stack Design**: Learn advanced stack implementations

---

## Related Problems

Based on similar themes (stack design, lazy propagation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Min Stack | [Link](https://leetcode.com/problems/min-stack/) | Stack with min tracking |
| Max Stack | [Link](https://leetcode.com/problems/max-stack/) | Stack with max tracking |
| Range Addition | [Link](https://leetcode.com/problems/range-addition/) | Similar lazy propagation |

### Pattern Reference

For more detailed explanations, see:
- **[Stack Pattern](/patterns/stack)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Design A Stack With Increment Operation - NeetCode](https://www.youtube.com/watch?v=T2sB7v3r5yA)** - Clear explanation
2. **[LeetCode 1381 - Design A Stack With Increment Operation](https://www.youtube.com/watch?v=1ldsflX6mLw)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you implement decrement operation?

**Answer:** Similar to increment, but subtract val instead. The same lazy propagation approach works.

---

### Q2: What if you needed to support increment on any range, not just bottom k?

**Answer:** You'd need a more complex data structure like a segment tree or Fenwick tree to handle range updates.

---

### Q3: How would you handle increment on middle elements (not just bottom k)?

**Answer:** This would require a different approach - perhaps storing increments at multiple indices and accumulating them.

---

## Common Pitfalls

### 1. Increments Not Propagating Correctly
**Issue**: When popping, the increment must propagate to the next element. The algorithm adds the current increment to the previous element's increment before popping.

**Solution**: Use `inc[-2] += inc[-1]` before popping.

### 2. Index Out of Bounds in Increment
**Issue**: Always use `min(k, len(self.stack)) - 1` to ensure you don't access indices beyond the stack size.

**Solution**: Use min function to clamp the index.

### 3. Not Handling Empty Stack
**Issue**: Both `pop()` and `increment()` should handle empty stack cases gracefully.

**Solution**: Add early return checks.

### 4. Forgetting to Initialize Inc Array
**Issue**: Each new element pushed should have a corresponding 0 in the inc array.

**Solution**: Append 0 when pushing new element.

---

## Summary

The **Design A Stack With Increment Operation** problem demonstrates lazy propagation:

Key takeaways:
1. Store increments lazily in a separate array
2. Apply increments only when popping
3. Propagate increments to maintain correct values
4. Achieve O(1) for all operations

This problem is essential for understanding lazy propagation and optimization techniques.

### Pattern Summary

This problem exemplifies the **Lazy Propagation** pattern, characterized by:
- Deferring expensive operations
- Storing pending updates in auxiliary data structures
- Applying updates only when needed
- Trading space for time complexity

For more details, see the **[Stack Pattern](/patterns/stack)**.

---

## Additional Resources

- [LeetCode Problem 1381](https://leetcode.com/problems/design-a-stack-with-increment-operation/) - Official problem page
- [Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Detailed explanation
- [Pattern: Stack](/patterns/stack) - Comprehensive pattern guide
