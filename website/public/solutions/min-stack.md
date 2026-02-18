# Min Stack

## Problem Description

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the `MinStack` class:

- `MinStack()` — Initializes the stack object.
- `void push(int val)` — Pushes the element `val` onto the stack.
- `void pop()` — Removes the element on the top of the stack.
- `int top()` — Gets the top element of the stack.
- `int getMin()` — Retrieves the minimum element in the stack.

You must implement a solution with O(1) time complexity for each operation.

---

## Examples

**Example 1:**

**Input:**
```python
["MinStack","push","push","push","getMin","pop","getMin","pop","getMin"]
[[],[],[],[2],[],[],[],[],[]]
```

**Output:**
```python
[null,null,null,null,2,null,2,null,0]
```

**Explanation:**
```python
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2
```

---

**Example 2:**

**Input:**
```python
["MinStack","push","push","push","getMin","pop","pop","getMin"]
[[],[1],[2],[3],[],[],[],[]]
```

**Output:**
```python
[null,null,null,null,1,null,null,1]
```

**Explanation:**
```python
MinStack minStack = new MinStack();
minStack.push(1);
minStack.push(2);
minStack.push(3);
minStack.getMin(); // return 1
minStack.pop();
minStack.pop();
minStack.getMin(); // return 1
```

---

## Constraints

- `-2^31 <= val <= 2^31 - 1`
- All operations `push`, `pop`, `top`, and `getMin` will be called with non-empty stacks.
- At most `3 * 10^4` calls will be made to `push`, `pop`, `top`, and `getMin`.

---

## Intuition

The key challenge is to track the minimum element in the stack at any point in time, even after popping elements. A naive approach would be to search the entire stack for the minimum each time `getMin()` is called, but this would result in O(n) time complexity.

The insight is to store additional information with each element that helps us track the minimum. When we push a new element, we can compute and store the new minimum at that point. This way, the minimum is always accessible in O(1) time.

---

## Approaches

### Approach 1: Pair Storage (Tuple/Object Approach) ⭐

Store each element as a pair `(value, current_minimum)`. When pushing a new element, the `current_minimum` is the minimum of the new value and the previous minimum (if any).

````carousel
```python
class MinStack:

    def __init__(self):
        self.stack = []  # Each element is (value, current_min)

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
    vector<pair<int, int>> stack;
    
public:
    MinStack() {}
    
    void push(int val) {
        int current_min = stack.empty() ? val : min(val, stack.back().second);
        stack.emplace_back(val, current_min);
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
    private Stack<int[]> stack;
    
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
    this.stack = [];
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

---

### Approach 2: Two-Stack Approach ⭐

Use two stacks: a main stack for all values and a separate min stack to track minimum values. The min stack's top always represents the current minimum.

````carousel
```python
class MinStack:

    def __init__(self):
        self.stack = []      # Main stack
        self.min_stack = []  # Stores minimum values

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
class MinStack {
private:
    vector<int> stack;
    vector<int> minStack;
    
public:
    MinStack() {}
    
    void push(int val) {
        stack.push_back(val);
        if (minStack.empty() || val <= minStack.back()) {
            minStack.push_back(val);
        }
    }
    
    void pop() {
        int val = stack.back();
        stack.pop_back();
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
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    
    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }
    
    public void pop() {
        int val = stack.pop();
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
var MinStack = function() {
    this.stack = [];
    this.minStack = [];
};

MinStack.prototype.push = function(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
        this.minStack.push(val);
    }
};

MinStack.prototype.pop = function() {
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1]) {
        this.minStack.pop();
    }
};

MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

MinStack.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1];
};
```
````

---

### Approach 3: Lazy Propagation with Offset

Use a single stack storing actual values minus a running minimum offset. This is a space-optimized approach but more complex to understand.

````carousel
```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.min_val = float('inf')

    def push(self, val: int) -> None:
        if val < self.min_val:
            self.stack.append(val - self.min_val)
            self.min_val = val
        else:
            self.stack.append(val)

    def pop(self) -> None:
        val = self.stack.pop()
        if val < 0:
            self.min_val = self.min_val - val

    def top(self) -> int:
        val = self.stack[-1]
        return val if val >= 0 else self.min_val

    def getMin(self) -> int:
        return self.min_val
```

<!-- slide -->
```cpp
class MinStack {
private:
    vector<long long> stack;
    long long minVal;
    
public:
    MinStack() {
        minVal = LLONG_MAX;
    }
    
    void push(int val) {
        if (val < minVal) {
            stack.push_back((long long)val - minVal);
            minVal = val;
        } else {
            stack.push_back(val);
        }
    }
    
    void pop() {
        long long val = stack.back();
        stack.pop_back();
        if (val < 0) {
            minVal = minVal - val;
        }
    }
    
    int top() {
        long long val = stack.back();
        return (val < 0) ? (int)minVal : (int)val;
    }
    
    int getMin() {
        return (int)minVal;
    }
};
```

<!-- slide -->
```java
class MinStack {
    private Stack<Long> stack;
    private long minVal;
    
    public MinStack() {
        stack = new Stack<>();
        minVal = Long.MAX_VALUE;
    }
    
    public void push(int val) {
        if (val < minVal) {
            stack.push((long)val - minVal);
            minVal = val;
        } else {
            stack.push((long)val);
        }
    }
    
    public void pop() {
        long val = stack.pop();
        if (val < 0) {
            minVal = minVal - val;
        }
    }
    
    public int top() {
        long val = stack.peek();
        return (val < 0) ? (int)minVal : (int)val;
    }
    
    public int getMin() {
        return (int)minVal;
    }
}
```

<!-- slide -->
```javascript
var MinStack = function() {
    this.stack = [];
    this.minVal = Infinity;
};

MinStack.prototype.push = function(val) {
    if (val < this.minVal) {
        this.stack.push(val - this.minVal);
        this.minVal = val;
    } else {
        this.stack.push(val);
    }
};

MinStack.prototype.pop = function() {
    const val = this.stack.pop();
    if (val < 0) {
        this.minVal = this.minVal - val;
    }
};

MinStack.prototype.top = function() {
    const val = this.stack[this.stack.length - 1];
    return val < 0 ? this.minVal : val;
};

MinStack.prototype.getMin = function() {
    return this.minVal;
};
```
````

---

## Complexity Analysis

| Approach | push() | pop() | top() | getMin() | Space |
|----------|--------|-------|-------|----------|-------|
| Pair Storage | O(1) | O(1) | O(1) | O(1) | O(n) |
| Two-Stack | O(1) | O(1) | O(1) | O(1) | O(n) worst case |
| Lazy Offset | O(1) | O(1) | O(1) | O(1) | O(n) |

**Space Complexity:** O(n) for all approaches, where n is the number of elements in the stack.

**Time Complexity:** O(1) for all operations in all approaches.

---

## Related Problems

1. **[Max Stack](https://leetcode.com/problems/max-stack/)** (LeetCode 716) — Similar to Min Stack but tracks maximum values.
2. **[Design a Stack With Increment Operation](https://leetcode.com/problems/design-a-stack-with-increment-operation/)** (LeetCode 1381) — Implement a stack with increment operation that adds value to bottom k elements.
3. **[Implement Stack Using Queues](https://leetcode.com/problems/implement-stack-using-queues/)** (LeetCode 225) — Implement a stack using only queue operations.
4. **[Implement Queue Using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)** (LeetCode 232) — The inverse problem of implementing a queue using stacks.
5. **[Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)** (LeetCode 84) — Uses a stack-based approach for finding the maximum rectangle.

---

## Follow-up Questions

1. **How would you extend the Min Stack to support a `getMax()` operation in O(1) time?**

   **Answer:** You can use the same two-stack approach, maintaining a max stack alongside the min stack. When pushing, if the new value is greater than or equal to the current max, push to the max stack. When popping, if the popped value equals the max stack's top, pop from the max stack as well.

2. **How would you modify the Min Stack to support tracking both minimum and maximum values simultaneously?**

   **Answer:** Store tuples of `(value, current_min, current_max)` in the pair approach, or use three stacks (main, min, max) in the two-stack approach.

3. **Can you implement a thread-safe Min Stack for concurrent access?**

   **Answer:** Add synchronization mechanisms like locks (mutex) around each operation to ensure thread safety. In Python, you could use the `threading` module.

4. **What happens when you have duplicate minimum values?**

   **Answer:** In the two-stack approach, use `<=` when pushing to the min stack to ensure duplicates are handled correctly. This way, when popping, all occurrences of the minimum are properly removed.

5. **How would you optimize space if you know the range of input values is limited?**

   **Answer:** Use a counting approach with a frequency array if the range is small, storing counts of each value and tracking the current minimum index. This trades space for potentially faster lookups.

---

## Video Tutorial Links

1. [Min Stack - LeetCode 155 - Full Explanation](https://www.youtube.com/watch?v=qkLl7nOwW3c)
2. [Design Min Stack - Interview Question](https://www.youtube.com/watch?v=ZkWClD5LalNHw)
3. [Min Stack Problem - Multiple Approaches](https://www.youtube.com/watch?v=8GpY2D5LNDw)

---

## Summary

The Min Stack problem is a classic design problem that tests your ability to think about data structure design and trade-offs. The key insight is to store additional metadata (either as pairs or in a separate structure) that allows constant-time retrieval of the minimum. All three approaches presented achieve O(1) time for all operations with O(n) space complexity.

The pair storage approach is often the most intuitive and straightforward, while the two-stack approach can be more memory-efficient in some scenarios. The lazy propagation approach is interesting but can be harder to understand and debug.

Choose the approach that best fits your needs based on code clarity, memory efficiency, and ease of maintenance.

---

## LeetCode Link

[Min Stack - LeetCode](https://leetcode.com/problems/min-stack/)
