# Stack - Min Stack Design

## Overview

The **Min Stack Design** pattern implements a stack data structure that supports standard stack operations (push, pop, top) plus a `getMin` operation that retrieves the minimum element in constant time. This is achieved by storing additional information with each element to track the current minimum value.

This pattern is essential for solving problems that require tracking minimum values during stack operations and is frequently asked in technical interviews at major tech companies.

## Problem Statement

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

**Example:**
```
Input: ["MinStack","push","push","push","getMin","pop","getMin"]
       [[],[-2],[0],[-3],[],[],[]]

Output: [null,null,null,null,-3,null,-2]

Explanation:
MinStack minStack = new MinStack();
minStack.push(-2);  // stack: [-2]
minStack.push(0);   // stack: [-2, 0]
minStack.push(-3);   // stack: [-2, 0, -3]
minStack.getMin();  // returns -3
minStack.pop();     // removes -3, stack: [-2, 0]
minStack.getMin();  // returns -2
```

---

## Intuition

### Why This Problem Matters

The key challenge is tracking the minimum element in the stack at any point in time, even after popping elements. A naive approach would search the entire stack for the minimum each time `getMin()` is called, resulting in O(n) time complexity—unacceptable when we need O(1) for all operations.

### Key Insight

The solution is to store **additional metadata** with each element that helps us track the minimum:

1. **Pair Storage**: Store each element as `(value, current_minimum)` tuple
2. **Lazy Minimum**: The minimum is always available at the stack top—no need to search
3. **Two-Stack Alternative**: Use a separate stack to track minimum values

### Visual Example

For operations: `push(-2) → push(0) → push(-3) → pop() → getMin()`

```
After push(-2):
Stack: [(-2, -2)]
       ↑ value, min

After push(0):
Stack: [(-2, -2), (0, -2)]
       ↑ value, min

After push(-3):
Stack: [(-2, -2), (0, -2), (-3, -3)]
       ↑ value, min

After pop():
Stack: [(-2, -2), (0, -2)]
       ↑ value, min
getMin() returns -2 ✓
```

---

## Multiple Approaches

We'll cover three approaches for implementing a Min Stack:

1. **Pair Storage (Tuple Approach)** - O(n) space, most intuitive
2. **Two-Stack Approach** - O(n) space, separate min stack
3. **Lazy Propagation with Offset** - O(n) space, space-optimized

---

## Approach 1: Pair Storage (Most Common) ⭐

This is the most commonly used approach. Store each element as a tuple containing the value and the current minimum at that point.

### Algorithm Steps

1. Initialize an empty stack that will store tuples `(value, current_min)`
2. On `push(val)`:
   - Calculate new minimum: `min(val, previous_min)` if stack exists, else `val`
   - Push tuple `(val, current_min)` to stack
3. On `pop()`: Simply remove the top tuple
4. On `top()`: Return the value part of the top tuple
5. On `getMin()`: Return the minimum part of the top tuple

### Why It Works

By storing the minimum alongside each element, we guarantee O(1) access to the minimum at any time. When we pop an element, the previous minimum is automatically restored because it's stored in the next element down.

### Code Implementation

````carousel
```python
class MinStack:
    """
    Min Stack implementation using pair storage.
    Each element is stored as (value, current_minimum) tuple.
    
    Time Complexity: O(1) for all operations
    Space Complexity: O(n) where n is the number of elements
    """
    
    def __init__(self):
        """Initialize an empty stack."""
        self.stack = []  # Stores tuples: (value, current_minimum)
    
    def push(self, val: int) -> None:
        """
        Push element onto stack.
        
        Args:
            val: Value to push
        """
        # Calculate new minimum: min of val and current min (if stack exists)
        current_min = min(val, self.stack[-1][1]) if self.stack else val
        # Push tuple of (value, current_min)
        self.stack.append((val, current_min))
    
    def pop(self) -> None:
        """Remove the element on top of the stack."""
        self.stack.pop()
    
    def top(self) -> int:
        """Return the top element of the stack."""
        return self.stack[-1][0]
    
    def getMin(self) -> int:
        """Retrieve the minimum element in the stack."""
        return self.stack[-1][1]
```

<!-- slide -->
```cpp
class MinStack {
private:
    // Stack stores pairs: {value, current_minimum}
    vector<pair<int, int>> stack;
    
public:
    /** initialize your data structure here. */
    MinStack() {
        // Constructor - no special initialization needed
    }
    
    void push(int val) {
        // Calculate new minimum: min of val and current min
        int current_min = stack.empty() ? val : min(val, stack.back().second);
        // Push pair of (value, current_min)
        stack.emplace_back(val, current_min);
    }
    
    void pop() {
        // Remove top element
        stack.pop_back();
    }
    
    int top() {
        // Return the value part of top pair
        return stack.back().first;
    }
    
    int getMin() {
        // Return the minimum part of top pair
        return stack.back().second;
    }
};
```

<!-- slide -->
```java
class MinStack {
    // Stack stores pairs: {value, current_minimum}
    private Stack<int[]> stack;
    
    /** initialize your data structure here. */
    public MinStack() {
        stack = new Stack<>();
    }
    
    public void push(int val) {
        // Calculate new minimum: min of val and current min
        int currentMin = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        // Push array of [value, currentMin]
        stack.push(new int[]{val, currentMin});
    }
    
    public void pop() {
        // Remove top element
        stack.pop();
    }
    
    public int top() {
        // Return the value part of top element
        return stack.peek()[0];
    }
    
    public int getMin() {
        // Return the minimum part of top element
        return stack.peek()[1];
    }
}
```

<!-- slide -->
```javascript
/**
 * Min Stack implementation using pair storage.
 * Each element is stored as [value, currentMinimum] array.
 * 
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) where n is the number of elements
 */
var MinStack = function() {
    // Stack stores arrays: [value, currentMinimum]
    this.stack = [];
};

/**
 * Push element onto stack.
 * @param {number} val - Value to push
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    // Calculate new minimum: min of val and current min
    const currentMin = this.stack.length === 0 
        ? val 
        : Math.min(val, this.stack[this.stack.length - 1][1]);
    // Push array of [value, currentMin]
    this.stack.push([val, currentMin]);
};

/**
 * Remove the element on top of the stack.
 * @return {void}
 */
MinStack.prototype.pop = function() {
    this.stack.pop();
};

/**
 * Return the top element of the stack.
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1][0];
};

/**
 * Retrieve the minimum element in the stack.
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.stack[this.stack.length - 1][1];
};
```
````

### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| push() | O(1) | O(n) total |
| pop() | O(1) | - |
| top() | O(1) | - |
| getMin() | O(1) | - |

---

## Approach 2: Two-Stack Approach ⭐

Use two stacks: a main stack for all values and a separate min stack to track minimum values. The min stack's top always represents the current minimum.

### Algorithm Steps

1. Initialize two empty stacks: `main_stack` and `min_stack`
2. On `push(val)`:
   - Push to main stack
   - If min_stack is empty OR val <= min_stack top, push to min_stack
3. On `pop()`:
   - Pop from main stack
   - If popped value equals min_stack top, pop from min_stack too
4. On `top()`: Return main stack's top
5. On `getMin()`: Return min_stack's top

### Why It Works

The min stack acts as a "shadow" stack that only contains elements that are candidates for being the minimum. When we push a value smaller than or equal to the current minimum, it becomes the new minimum. When we pop the minimum value, the next minimum is revealed.

### Code Implementation

````carousel
```python
class MinStack:
    """
    Min Stack implementation using two stacks.
    
    Time Complexity: O(1) for all operations
    Space Complexity: O(n) in worst case (when elements are in increasing order)
    """
    
    def __init__(self):
        """Initialize two empty stacks."""
        self.stack = []      # Main stack for all values
        self.min_stack = []  # Auxiliary stack for minimum values
    
    def push(self, val: int) -> None:
        """
        Push element onto stack.
        
        Args:
            val: Value to push
        """
        # Push to main stack
        self.stack.append(val)
        
        # Push to min_stack: either the new value or current minimum
        # Use <= to handle duplicate minimum values correctly
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        """Remove the element on top of the stack."""
        val = self.stack.pop()
        
        # If popped value is the current minimum, remove from min_stack too
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        """Return the top element of the stack."""
        return self.stack[-1]
    
    def getMin(self) -> int:
        """Retrieve the minimum element in the stack."""
        return self.min_stack[-1]
```

<!-- slide -->
```cpp
class MinStack {
private:
    vector<int> stack;      // Main stack for all values
    vector<int> minStack;   // Auxiliary stack for minimum values
    
public:
    /** initialize your data structure here. */
    MinStack() {
        // Constructor - no special initialization needed
    }
    
    void push(int val) {
        // Push to main stack
        stack.push_back(val);
        
        // Push to min_stack: either the new value or current minimum
        // Use <= to handle duplicate minimum values correctly
        if (minStack.empty() || val <= minStack.back()) {
            minStack.push_back(val);
        }
    }
    
    void pop() {
        int val = stack.back();
        stack.pop_back();
        
        // If popped value is the current minimum, remove from min_stack too
        if (val == minStack.back()) {
            minStack.pop_back();
        }
    }
    
    int top() {
        return stack.back();
    }
    
    int getMin() {
        return minStack.back();
    }
};
```

<!-- slide -->
```java
class MinStack {
    private Stack<Integer> stack;      // Main stack for all values
    private Stack<Integer> minStack;    // Auxiliary stack for minimum values
    
    /** initialize your data structure here. */
    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int val) {
        // Push to main stack
        stack.push(val);
        
        // Push to min_stack: either the new value or current minimum
        // Use <= values correctly
        if (minStack.isEmpty() || to handle duplicate minimum val <= minStack.peek()) {
            minStack.push(val);
        }
    }
    
    public void pop() {
        int val = stack.pop();
        
        // If popped value is the current minimum, remove from min_stack too
        if (val == minStack.peek()) {
            minStack.pop();
        }
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}
```

<!-- slide -->
```javascript
/**
 * Min Stack implementation using two stacks.
 * 
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) in worst case
 */
var MinStack = function() {
    this.stack = [];      // Main stack for all values
    this.minStack = [];   // Auxiliary stack for minimum values
};

/**
 * Push element onto stack.
 * @param {number} val - Value to push
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    // Push to main stack
    this.stack.push(val);
    
    // Push to min_stack: either the new value or current minimum
    // Use <= to handle duplicate minimum values correctly
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
        this.minStack.push(val);
    }
};

/**
 * Remove the element on top of the stack.
 * @return {void}
 */
MinStack.prototype.pop = function() {
    const val = this.stack.pop();
    
    // If popped value is the current minimum, remove from min_stack too
    if (val === this.minStack[this.minStack.length - 1]) {
        this.minStack.pop();
    }
};

/**
 * Return the top element of the stack.
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

/**
 * Retrieve the minimum element in the stack.
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1];
};
```
````

### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| push() | O(1) | O(n) total |
| pop() | O(1) | - |
| top() | O(1) | - |
| getMin() | O(1) | - |

---

## Approach 3: Lazy Propagation with Offset

This is a space-optimized approach that uses a single stack storing values as offsets from the current minimum. It's more complex but uses only one data structure.

### Algorithm Steps

1. Initialize an empty stack and a variable `min_val` tracking the current minimum
2. On `push(val)`:
   - If val < min_val: store (val - min_val), update min_val to val
   - Otherwise: store val directly
3. On `pop()`:
   - If top < 0: this was the minimum, recover previous min: min_val = min_val - top
   - Otherwise: just pop
4. On `top()`:
   - If top < 0: return min_val (because top stored negative offset)
   - Otherwise: return top
5. On `getMin()`: Return min_val

### Why It Works

The key insight is that when we push a new minimum, we store the difference (offset) from the previous minimum as a negative number. This allows us to "remember" the previous minimum while only using one stack.

### Code Implementation

````carousel
```python
class MinStack:
    """
    Min Stack implementation using lazy propagation with offset.
    Space-optimized approach using single stack.
    
    Time Complexity: O(1) for all operations
    Space Complexity: O(n)
    """
    
    def __init__(self):
        """Initialize an empty stack."""
        self.stack = []
        self.min_val = float('inf')
    
    def push(self, val: int) -> None:
        """
        Push element onto stack using offset storage.
        
        Args:
            val: Value to push
        """
        if val < self.min_val:
            # New minimum found: store offset as negative value
            self.stack.append(val - self.min_val)
            self.min_val = val
        else:
            # Not a new minimum: store value directly
            self.stack.append(val)
    
    def pop(self) -> None:
        """Remove the element on top of the stack."""
        val = self.stack.pop()
        
        if val < 0:
            # This was the minimum: recover previous minimum
            # Previous minimum = current minimum - (negative offset)
            self.min_val = self.min_val - val
    
    def top(self) -> int:
        """Return the top element of the stack."""
        val = self.stack[-1]
        
        if val < 0:
            # Top stores negative offset: actual value is min_val
            return self.min_val
        else:
            # Top stores actual value
            return val
    
    def getMin(self) -> int:
        """Retrieve the minimum element in the stack."""
        return self.min_val
```

<!-- slide -->
```cpp
class MinStack {
private:
    vector<long long> stack;  // Use long long to handle large differences
    long long minVal;         // Current minimum value
    
public:
    /** initialize your data structure here. */
    MinStack() {
        minVal = LLONG_MAX;
    }
    
    void push(int val) {
        if (val < minVal) {
            // New minimum found: store offset as negative value
            stack.push_back((long long)val - minVal);
            minVal = val;
        } else {
            // Not a new minimum: store value directly
            stack.push_back(val);
        }
    }
    
    void pop() {
        long long val = stack.back();
        stack.pop_back();
        
        if (val < 0) {
            // This was the minimum: recover previous minimum
            minVal = minVal - val;
        }
    }
    
    int top() {
        long long val = stack.back();
        
        if (val < 0) {
            // Top stores negative offset: actual value is minVal
            return (int)minVal;
        } else {
            // Top stores actual value
            return (int)val;
        }
    }
    
    int getMin() {
        return (int)minVal;
    }
};
```

<!-- slide -->
```java
class MinStack {
    private Stack<Long> stack;  // Use Long to handle large differences
    private long minVal;        // Current minimum value
    
    /** initialize your data structure here. */
    public MinStack() {
        stack = new Stack<>();
        minVal = Long.MAX_VALUE;
    }
    
    public void push(int val) {
        if (val < minVal) {
            // New minimum found: store offset as negative value
            stack.push((long)val - minVal);
            minVal = val;
        } else {
            // Not a new minimum: store value directly
            stack.push((long)val);
        }
    }
    
    public void pop() {
        long val = stack.pop();
        
        if (val < 0) {
            // This was the minimum: recover previous minimum
            minVal = minVal - val;
        }
    }
    
    public int top() {
        long val = stack.peek();
        
        if (val < 0) {
            // Top stores negative offset: actual value is minVal
            return (int)minVal;
        } else {
            // Top stores actual value
            return (int)val;
        }
    }
    
    public int getMin() {
        return (int)minVal;
    }
}
```

<!-- slide -->
```javascript
/**
 * Min Stack implementation using lazy propagation with offset.
 * Space-optimized approach using single stack.
 * 
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n)
 */
var MinStack = function() {
    this.stack = [];
    this.minVal = Infinity;
};

/**
 * Push element onto stack using offset storage.
 * @param {number} val - Value to push
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    if (val < this.minVal) {
        // New minimum found: store offset as negative value
        this.stack.push(val - this.minVal);
        this.minVal = val;
    } else {
        // Not a new minimum: store value directly
        this.stack.push(val);
    }
};

/**
 * Remove the element on top of the stack.
 * @return {void}
 */
MinStack.prototype.pop = function() {
    const val = this.stack.pop();
    
    if (val < 0) {
        // This was the minimum: recover previous minimum
        // Previous minimum = current minimum - (negative offset)
        this.minVal = this.minVal - val;
    }
};

/**
 * Return the top element of the stack.
 * @return {number}
 */
MinStack.prototype.top = function() {
    const val = this.stack[this.stack.length - 1];
    
    if (val < 0) {
        // Top stores negative offset: actual value is minVal
        return this.minVal;
    } else {
        // Top stores actual value
        return val;
    }
};

/**
 * Retrieve the minimum element in the stack.
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.minVal;
};
```
````

### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| push() | O(1) | O(n) total |
| pop() | O(1) | - |
| top() | O(1) | - |
| getMin() | O(1) | - |

---

## Comparison of Approaches

| Aspect | Pair Storage | Two-Stack | Lazy Offset |
|--------|-------------|-----------|-------------|
| **Implementation** | Simple | Simple | Complex |
| **Space** | O(n) | O(n) worst case | O(n) |
| **Code Clarity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Memory Efficiency** | Good | Better for increasing sequences | Best |
| **Debugging** | Easy | Easy | Difficult |
| **Interview Preferred** | ✅ Yes | ✅ Yes | ❌ Rarely |

**Recommendation**: For interviews, the **Pair Storage** approach is most commonly expected due to its clarity. The **Two-Stack** approach is also highly regarded as it demonstrates understanding of auxiliary data structures.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very common in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft
- **Difficulty**: Easy to Medium
- **Variations**: Max Stack, MinMax Stack, Stack with Increment

### Learning Outcomes

1. **Data Structure Design**: Learn to design data structures with specific time constraints
2. **Trade-off Analysis**: Understand space-time trade-offs
3. **Auxiliary Structures**: Master the use of helper data structures
4. **Edge Case Handling**: Handle duplicates, empty stacks, overflow

---

## Related Problems

### Same Problem Category

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Min Stack](https://leetcode.com/problems/min-stack/) | 155 | Easy | Design a stack with min() in O(1) |
| [Max Stack](https://leetcode.com/problems/max-stack/) | 716 | Easy | Design a stack with max() in O(1) |
| [Design a Stack With Increment Operation](https://leetcode.com/problems/design-a-stack-with-increment-operation/) | 1381 | Medium | Stack with increment on bottom k elements |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Implement Stack Using Queues](https://leetcode.com/problems/implement-stack-using-queues/) | 225 | Easy | Implement stack using queues |
| [Implement Queue Using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) | 232 | Easy | Implement queue using stacks |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 84 | Hard | Stack-based solution |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | 739 | Medium | Monotonic stack application |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Min Stack - LeetCode 155 - Full Explanation](https://www.youtube.com/watch?v=qkLl7nOwW3c)**
   - Clear explanation with multiple approaches
   - Visual demonstrations
   - Part of popular NeetCode playlist

2. **[Design Min Stack - Interview Question](https://www.youtube.com/watch?v=ZkWClD5LalNHw)**
   - Interview-focused approach
   - Step-by-step implementation
   - Tips for interviews

3. **[Min Stack Problem - Multiple Approaches](https://www.youtube.com/watch?v=8GpY2D5LNDw)**
   - Detailed walkthrough of all approaches
   - Comparison of solutions
   - Time complexity analysis

### Additional Resources

- **[LeetCode Official Solution](https://leetcode.com/problems/min-stack/solutions/)** - Official solutions and community discussions
- **[GeeksforGeeks - Design and Implement Min Stack](https://www.geeksforgeeks.org/design-and-implement-a-special-stack-data-structure/)** - Detailed explanations
- **[Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/)** - Stack fundamentals

---

## Common Pitfalls

### 1. Forgetting to Update Minimum on Push
**Issue**: Not calculating the new minimum when pushing elements.

**Solution**: Always compute `min(val, previous_min)` when pushing.

### 2. Not Handling Empty Stack
**Issue**: Not handling the case when stack is empty for getMin or top operations.

**Solution**: Add checks for empty stack or assume non-empty per problem constraints.

### 3. Incorrect Duplicate Handling
**Issue**: Using `<` instead of `<=` when pushing to min stack.

**Solution**: Use `<=` to handle duplicate minimum values correctly.

### 4. Off-by-One Errors in Offset Approach
**Issue**: Incorrectly calculating previous minimum in offset approach.

**Solution**: Remember: `previous_min = current_min - (negative_offset)`.

### 5. Integer Overflow
**Issue**: In offset approach, using int instead of long for stored differences.

**Solution**: Use long/long long to handle potential overflow with large differences.

---

## Follow-up Questions

### Q1: How would you extend Min Stack to support getMax() in O(1)?

**Answer**: Use the same two-stack approach, maintaining a max stack alongside the min stack. When pushing, if the new value is greater than or equal to the current max, push to the max stack. When popping, if the popped value equals the max stack's top, pop from the max stack as well.

### Q2: How would you modify to track both min and max simultaneously?

**Answer**: Store tuples of `(value, current_min, current_max)` in the pair approach, or use three stacks (main, min, max) in the two-stack approach.

### Q3: Can you implement a thread-safe Min Stack?

**Answer**: Add synchronization mechanisms like locks (mutex) around each operation. In Python, use the `threading` module. In Java, use `synchronized` blocks or `ReentrantLock`.

### Q4: What happens when you have duplicate minimum values?

**Answer**: Use `<=` when pushing to the min stack to ensure duplicates are handled correctly. This way, when popping, all occurrences of the minimum are properly removed.

### Q5: How would you optimize space with limited value range?

**Answer**: Use a counting approach with a frequency array if the range is small, storing counts of each value and tracking the current minimum index.

---

## Summary

The **Min Stack Design** pattern is a classic data structure problem that tests your ability to design efficient solutions with specific time constraints:

- **Key Insight**: Store additional metadata with each element to track minimum
- **Best Approach**: Pair Storage (most intuitive) or Two-Stack (memory efficient)
- **All Operations**: O(1) time complexity guaranteed
- **Space**: O(n) for all approaches

### Recommended Approach for Interviews

The **Pair Storage** approach is typically preferred because:
- Most intuitive and easy to explain
- Clean and readable code
- Easy to extend for variations (max, min+max)

The **Two-Stack** approach is also excellent and shows understanding of auxiliary data structures.

For production code, choose based on your specific needs for code clarity vs. memory efficiency.

---

## LeetCode Link

[Min Stack - LeetCode](https://leetcode.com/problems/min-stack/)
