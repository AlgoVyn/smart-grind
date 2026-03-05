# Stack - Min Stack Design

## Problem Description

The Min Stack Design pattern implements a stack that supports standard operations (push, pop, top) plus retrieving the minimum element in constant time. This is achieved by storing additional metadata with each element.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(1) for all operations |
| Space Complexity | O(n) - stores minimum metadata |
| Operations | push, pop, top, getMin all in O(1) |
| Output | Min Stack with O(1) min retrieval |
| Approach | Store (value, current_min) pairs or use auxiliary stack |

### When to Use

- Tracking minimum values during stack operations
- Problems requiring constant-time access to stack statistics
- Implementing data structures with augmented information
- Sliding window minimum with a stack-based approach
- Any stack where you need to track running minimums

## Intuition

The key insight is to **store the minimum at each state** so it's always available without searching.

The "aha!" moments:

1. **Pair storage**: Store (value, current_min) tuple with each element
2. **Minimum restoration**: When popping, previous minimum is already stored
3. **Two-stack alternative**: Separate stack tracking only minimums
4. **Lazy propagation**: Store offsets to save space (advanced)
5. **O(1) guarantee**: No searching needed, min is always at top of aux structure

## Solution Approaches

### Approach 1: Pair Storage (Tuple) ✅ Recommended

#### Algorithm

1. Store each element as (value, current_minimum) tuple
2. On push: new_min = min(val, stack.top.min) if stack not empty, else val
3. On pop: simply remove top tuple
4. On getMin: return the min part of top tuple

#### Implementation

````carousel
```python
class MinStack:
    """
    Min Stack using pair storage.
    LeetCode 155 - Min Stack
    Time: O(1) for all operations, Space: O(n)
    """
    
    def __init__(self):
        self.stack = []  # Stores tuples: (value, current_minimum)
    
    def push(self, val: int) -> None:
        current_min = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, current_min))
    
    def pop(self) -> None:
        self.stack.pop()
    
    def top(self) -> int:
        return self.stack[-1][0]
    
    def getMin(self) -> int:
        return self.stack[-1][1]
```
<!-- slide -->
```cpp
class MinStack {
private:
    std::vector<std::pair<int, int>> stack;  // {value, current_minimum}
    
public:
    MinStack() {}
    
    void push(int val) {
        int currentMin = stack.empty() ? val : std::min(val, stack.back().second);
        stack.emplace_back(val, currentMin);
    }
    
    void pop() {
        stack.pop_back();
    }
    
    int top() {
        return stack.back().first;
    }
    
    int getMin() {
        return stack.back().second;
    }
};
```
<!-- slide -->
```java
class MinStack {
    private Stack<int[]> stack;  // [value, currentMinimum]
    
    public MinStack() {
        stack = new Stack<>();
    }
    
    public void push(int val) {
        int currentMin = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, currentMin});
    }
    
    public void pop() {
        stack.pop();
    }
    
    public int top() {
        return stack.peek()[0];
    }
    
    public int getMin() {
        return stack.peek()[1];
    }
}
```
<!-- slide -->
```javascript
var MinStack = function() {
    this.stack = [];  // [value, currentMinimum]
};

MinStack.prototype.push = function(val) {
    const currentMin = this.stack.length === 0 
        ? val 
        : Math.min(val, this.stack[this.stack.length - 1][1]);
    this.stack.push([val, currentMin]);
};

MinStack.prototype.pop = function() {
    this.stack.pop();
};

MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1][0];
};

MinStack.prototype.getMin = function() {
    return this.stack[this.stack.length - 1][1];
};
```
````

#### Time and Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| push | O(1) | O(n) total |
| pop | O(1) | - |
| top | O(1) | - |
| getMin | O(1) | - |

### Approach 2: Two-Stack Approach

Use separate main stack and min stack.

#### Implementation

````carousel
```python
class MinStackTwoStacks:
    """
    Min Stack using two stacks.
    Time: O(1), Space: O(n) worst case
    """
    
    def __init__(self):
        self.stack = []      # Main stack
        self.min_stack = []  # Auxiliary stack for minimums
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]
```
<!-- slide -->
```cpp
class MinStackTwoStacks {
private:
    std::vector<int> stack;
    std::vector<int> minStack;
    
public:
    void push(int val) {
        stack.push_back(val);
        if (minStack.empty() || val <= minStack.back())
            minStack.push_back(val);
    }
    
    void pop() {
        int val = stack.back();
        stack.pop_back();
        if (val == minStack.back())
            minStack.pop_back();
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
class MinStackTwoStacks {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    
    public MinStackTwoStacks() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek())
            minStack.push(val);
    }
    
    public void pop() {
        int val = stack.pop();
        if (val == minStack.peek())
            minStack.pop();
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
var MinStackTwoStacks = function() {
    this.stack = [];
    this.minStack = [];
};

MinStackTwoStacks.prototype.push = function(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1])
        this.minStack.push(val);
};

MinStackTwoStacks.prototype.pop = function() {
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1])
        this.minStack.pop();
};

MinStackTwoStacks.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

MinStackTwoStacks.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1];
};
```
````

#### Time and Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| push | O(1) | O(n) worst case (increasing order) |
| pop | O(1) | - |
| top | O(1) | - |
| getMin | O(1) | - |

## Complexity Analysis

| Approach | Time | Space | Pros/Cons |
|----------|------|-------|-----------|
| Pair Storage | O(1) | O(n) | Simple, most common |
| Two Stacks | O(1) | O(n) | Better for non-increasing sequences |
| Lazy Offset | O(1) | O(n) | Complex, space-optimized variant |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Min Stack](https://leetcode.com/problems/min-stack/) | 155 | Easy | Core problem |
| [Max Stack](https://leetcode.com/problems/max-stack/) | 716 | Easy | Similar with max |
| [Stack With Increment](https://leetcode.com/problems/design-a-stack-with-increment-operation/) | 1381 | Medium | Augmented stack |
| [Online Stock Span](https://leetcode.com/problems/online-stock-span/) | 901 | Medium | Monotonic stack variant |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | 739 | Medium | Next greater element |

## Video Tutorial Links

1. **[NeetCode - Min Stack](https://www.youtube.com/watch?v=qkLl7nOwW3c)** - Clear explanation
2. **[Back To Back SWE - Min Stack](https://www.youtube.com/watch?v=qkLl7nOwW3c)** - Multiple approaches
3. **[Kevin Naughton Jr. - LeetCode 155](https://www.youtube.com/watch?v=qkLl7nOwW3c)** - Clean implementation
4. **[Nick White - Design Problems](https://www.youtube.com/watch?v=qkLl7nOwW3c)** - Pattern overview
5. **[Techdose - Min Stack Variations](https://www.youtube.com/watch?v=qkLl7nOwW3c)** - Advanced variants

## Summary

### Key Takeaways

- **Pair storage** is most intuitive: store (value, min) together
- **Two-stack approach** saves space for non-increasing sequences
- **Always compute new min** on push: `min(val, current_min)`
- **Handle duplicates**: Use `<=` when pushing to min stack
- **O(1) guaranteed**: All operations constant time

### Common Pitfalls

1. Not calculating new minimum correctly on push
2. Using `<` instead of `<=` for duplicate handling
3. Returning wrong value from top/getMin
4. Not handling empty stack edge cases
5. Integer overflow in offset approach (use long)

### Follow-up Questions

1. **How would you implement Max Stack?**
   - Same approach, track maximum instead

2. **Can you implement both min and max?**
   - Store (value, min, max) tuples or use three stacks

3. **What about a thread-safe version?**
   - Add locks around operations

4. **How would you optimize for limited value range?**
   - Use frequency array if range is small

5. **Can you do this with O(1) extra space per element?**
   - Yes, pair storage uses one extra int per element

## Pattern Source

[Min Stack Design Pattern](patterns/stack-min-stack-design.md)
