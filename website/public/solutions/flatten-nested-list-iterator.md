# Flatten Nested List Iterator

## Problem Description

You are given a nested list of integers nestedList. Each element is either an integer or a list whose elements may also be integers or other lists. Implement an iterator to flatten it.

Implement the NestedIterator class:
- `NestedIterator(List<NestedInteger> nestedList)` Initializes the iterator with the nested list nestedList.
- `int next()` Returns the next integer in the nested list.
- `boolean hasNext()` Returns true if there are still some integers in the nested list and false otherwise.

Your code will be tested with the following pseudocode:
```
initialize iterator with nestedList
res = []
while iterator.hasNext()
    append iterator.next() to the end of res
return res
```

If res matches the expected flattened list, then your code will be judged as correct.

**Link to problem:** [Flatten Nested List Iterator - LeetCode 341](https://leetcode.com/problems/flatten-nested-list-iterator/)

---

## Pattern: Stack - Nested List Iteration

This problem demonstrates how to flatten a nested structure using a stack, processing elements lazily as needed.

### Core Concept

The key is to use a stack to keep track of nested elements:
- Store elements in reverse order so we can process them sequentially
- When we encounter a list, push its elements onto the stack
- When we encounter an integer, it's the next element to return
- This allows us to flatten arbitrarily deep nested lists

---

## Examples

### Example

**Input:**
```
nestedList = [[1,1],2,[1,1]]
```

**Output:**
```
[1,1,2,1,1]
```

**Explanation:** The nested list contains [1,1], 2, and [1,1]. Flattening gives [1,1,2,1,1].

### Example 2

**Input:**
```
nestedList = [1,[4,[6]]]
```

**Output:**
```
[1,4,6]
```

**Explanation:** The nested list contains 1, [4, [6]]. Flattening gives [1,4,6].

---

## Constraints

- `1 <= nestedList.length <= 500`
- The values of the integers in the nested list is in the range `[-10^6, 10^6]`

---

## Intuition

The problem requires us to iterate through a nested list as if it were flat. The challenge is that we don't want to flatten the entire list upfront (that's inefficient for memory). Instead, we want to process elements lazily.

The solution uses a stack to:
1. Store the nested elements in a way that allows us to access them sequentially
2. When hasNext() is called, find the next integer without fully flattening
3. When next() is called, return the current integer and prepare for the next

The key insight is to store elements in reverse order on the stack, so when we pop, we get them in the correct order.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Stack-Based (Optimal)** - O(n) initialization, O(1) per operation
2. **Recursive with Queue** - O(n) initialization, O(1) per operation

---

## Approach 1: Stack-Based (Optimal)

This is the standard approach using a stack to manage nested elements.

### Algorithm Steps

1. In the constructor, push all elements from nestedList onto the stack in reverse order
2. In hasNext():
   - While stack is not empty:
     - If top is an integer, return true
     - If top is a list, pop it and push its elements in reverse order
   - If stack is empty, return false
3. In next():
   - Call hasNext() to ensure top is an integer
   - Pop and return the integer

### Why It Works

The stack approach works because:
- We process elements lazily, only when needed
- By storing in reverse order, we can use LIFO to get elements in correct sequence
- When we encounter a nested list, we flatten it on-demand

### Code Implementation

````carousel
```python
# """
# This is the interface that allows for creating nested lists.
# You should not implement it, or speculate about its implementation
# """
#class NestedInteger:
#    def isInteger(self) -> bool:
#        """
#        @return True if this NestedInteger holds a single integer, rather than a nested list.
#        """
#
#    def getInteger(self) -> int:
#        """
#        @return the single integer that this NestedInteger holds, if it holds a single integer
#        Return None if this NestedInteger holds a nested list
#        """
#
#    def getList(self) -> [NestedInteger]:
#        """
#        @return the nested list that this NestedInteger holds, if it holds a nested list
#        Return None if this NestedInteger holds a single integer
#        """

class NestedIterator:
    def __init__(self, nestedList: [NestedInteger]):
        """
        Initialize with nested list.
        
        Args:
            nestedList: The nested list to flatten
        """
        # Store elements in reverse order for LIFO processing
        self.stack = nestedList[::-1]
    
    def next(self) -> int:
        """
        Return the next integer.
        
        Returns:
            The next integer in the flattened list
        """
        # Ensure we have an integer at the top
        self.hasNext()
        # Pop and return the integer
        return self.stack.pop().getInteger()
    
    def hasNext(self) -> bool:
        """
        Check if there are more integers.
        
        Returns:
            True if there are more integers, False otherwise
        """
        while self.stack:
            top = self.stack[-1]
            if top.isInteger():
                return True
            else:
                # It's a list, flatten it
                lst = self.stack.pop().getList()
                # Add elements in reverse order
                self.stack.extend(lst[::-1])
        return False
```

<!-- slide -->
```java
/**
 * // This is the interface that allows you to provide nested lists.
 * // You should not implement it, nor should you investigate how it's implemented.
 * interface NestedInteger {
 *     // Returns true if this NestedInteger holds a single integer, rather than a list.
 *     public boolean isInteger();
 *
 *     // Returns the single integer that this NestedInteger holds, if it holds a single integer.
 *     // Return null if this NestedInteger holds a nested list.
 *     public Integer getInteger();
 *
 *     // Returns the nested list that this NestedInteger holds, if it holds a nested list.
 *     // Return null if this NestedInteger holds a single integer.
 *     public List<NestedInteger> getList();
 * }
 */

public class NestedIterator implements Iterator<Integer> {
    private Stack<NestedInteger> stack;
    
    public NestedIterator(List<NestedInteger> nestedList) {
        // Store elements in reverse order for LIFO processing
        stack = new Stack<>();
        for (int i = nestedList.size() - 1; i >= 0; i--) {
            stack.push(nestedList.get(i));
        }
    }

    @Override
    public Integer next() {
        // Ensure we have an integer at the top
        hasNext();
        // Pop and return the integer
        return stack.pop().getInteger();
    }

    @Override
    public boolean hasNext() {
        while (!stack.isEmpty()) {
            NestedInteger top = stack.peek();
            if (top.isInteger()) {
                return true;
            } else {
                // It's a list, flatten it
                stack.pop();
                List<NestedInteger> list = top.getList();
                for (int i = list.size() - 1; i >= 0; i--) {
                    stack.push(list.get(i));
                }
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * // This is the interface that allows you to provide nested lists.
 * // You should not implement it, nor should you investigate how it's implemented.
 * function NestedInteger(val, list) {
 *     this.val = val;
 *     this.list = list;
 *     
 *     this.isInteger = function() { return this.val !== undefined; }
 *     this.getInteger = function() { return this.val; }
 *     this.getList = function() { return this.list; }
 * }
 */

/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function(nestedList) {
    // Store elements in reverse order for LIFO processing
    this.stack = nestedList.slice().reverse();
};

/**
 * @this NestedIterator
 * @returns {number} the next integer in the array
 */
NestedIterator.prototype.next = function() {
    // Ensure we have an integer at the top
    this.hasNext();
    // Pop and return the integer
    return this.stack.pop().getInteger();
};

/**
 * @this NestedIterator
 * @returns {boolean} true if there are more elements
 */
NestedIterator.prototype.hasNext = function() {
    while (this.stack.length > 0) {
        const top = this.stack[this.stack.length - 1];
        if (top.isInteger()) {
            return true;
        } else {
            // It's a list, flatten it
            const list = this.stack.pop().getList();
            this.stack.push(...list.reverse());
        }
    }
    return false;
};
```

<!-- slide -->
```cpp
/**
 * // This is the interface that allows you to provide nested lists.
 * // You should not implement it, nor should you investigate how it's implemented.
 * class NestedInteger {
 * public:
 *     // Returns true if this NestedInteger holds a single integer, rather than a list.
 *     bool isInteger() const;
 *
 *     // Returns the single integer that this NestedInteger holds, if it holds a single integer.
 *     // The returned value is only defined if isInteger() returns true.
 *     int getInteger() const;
 *
 *     // Returns the nested list that this NestedInteger holds, if it holds a nested list.
 *     // The returned value is only defined if isInteger() returns false.
 *     const vector<NestedInteger>& getList() const;
 * };
 */

class NestedIterator {
private:
    stack<NestedInteger> st;
    
public:
    NestedIterator(const vector<NestedInteger>& nestedList) {
        // Store elements in reverse order for LIFO processing
        for (int i = nestedList.size() - 1; i >= 0; i--) {
            st.push(nestedList[i]);
        }
    }

    int next() {
        hasNext();
        int result = st.top().getInteger();
        st.pop();
        return result;
    }

    bool hasNext() {
        while (!st.empty()) {
            const NestedInteger& top = st.top();
            if (top.isInteger()) {
                return true;
            } else {
                // It's a list, flatten it
                st.pop();
                const vector<NestedInteger>& list = top.getList();
                for (int i = list.size() - 1; i >= 0; i--) {
                    st.push(list[i]);
                }
            }
        }
        return false;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Initialization** | O(n) - Processing all elements once |
| **next()** | O(1) amortized - Each element is processed once overall |
| **hasNext()** | O(1) amortized - Each element is processed once overall |
| **Space** | O(n) - Stack can hold all elements in worst case |

---

## Approach 2: Recursive with Queue

This approach pre-flattens the nested list using recursion and then uses a queue for O(1) access.

### Algorithm Steps

1. In constructor, recursively flatten the entire nested list into a queue
2. next() simply dequeues from the queue
3. hasNext() checks if queue is empty

### Code Implementation

````carousel
```python
from collections import deque

class NestedIterator:
    def __init__(self, nestedList: [NestedInteger]):
        """
        Initialize with nested list using recursive flattening.
        """
        self.queue = deque()
        self.flatten(nestedList)
    
    def flatten(self, nestedList):
        """Recursively flatten the nested list."""
        for item in nestedList:
            if item.isInteger():
                self.queue.append(item.getInteger())
            else:
                self.flatten(item.getList())
    
    def next(self) -> int:
        return self.queue.popleft()
    
    def hasNext(self) -> bool:
        return len(self.queue) > 0
```

<!-- slide -->
```java
public class NestedIterator implements Iterator<Integer> {
    private Queue<Integer> queue;
    
    public NestedIterator(List<NestedInteger> nestedList) {
        queue = new LinkedList<>();
        flatten(nestedList);
    }
    
    private void flatten(List<NestedInteger> nestedList) {
        for (NestedInteger item : nestedList) {
            if (item.isInteger()) {
                queue.offer(item.getInteger());
            } else {
                flatten(item.getList());
            }
        }
    }

    @Override
    public Integer next() {
        return queue.poll();
    }

    @Override
    public boolean hasNext() {
        return !queue.isEmpty();
    }
}
```

<!-- slide -->
```javascript
var NestedIterator = function(nestedList) {
    this.queue = [];
    this.flatten(nestedList);
};

NestedIterator.prototype.flatten = function(nestedList) {
    for (const item of nestedList) {
        if (item.isInteger()) {
            this.queue.push(item.getInteger());
        } else {
            this.flatten(item.getList());
        }
    }
};

NestedIterator.prototype.next = function() {
    return this.queue.shift();
};

NestedIterator.prototype.hasNext = function() {
    return this.queue.length > 0;
};
```

<!-- slide -->
```cpp
class NestedIterator {
private:
    queue<int> q;
    
    void flatten(const vector<NestedInteger>& nestedList) {
        for (const auto& item : nestedList) {
            if (item.isInteger()) {
                q.push(item.getInteger());
            } else {
                flatten(item.getList());
            }
        }
    }
    
public:
    NestedIterator(const vector<NestedInteger>& nestedList) {
        flatten(nestedList);
    }

    int next() {
        int val = q.front();
        q.pop();
        return val;
    }

    bool hasNext() {
        return !q.empty();
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Initialization** | O(n) - Flatten entire list |
| **next()** | O(1) |
| **hasNext()** | O(1) |
| **Space** | O(n) - Queue stores all integers |

---

## Comparison of Approaches

| Aspect | Stack-Based | Recursive with Queue |
|--------|-------------|---------------------|
| **Initialization** | O(n) | O(n) |
| **next()** | O(1) amortized | O(1) |
| **hasNext()** | O(1) amortized | O(1) |
| **Space** | O(n) worst case | O(n) |
| **Lazy Evaluation** | Yes | No |
| **Best For** | Large nested lists | Small to medium lists |

**Best Approach:** The stack-based approach is generally preferred as it processes elements lazily, which is more memory-efficient for very deep or large nested lists.

---

## Why Stack Works for This Problem

The stack approach is ideal because:

1. **LIFO Order**: Allows us to process nested elements in correct order
2. **Lazy Processing**: We only flatten lists when needed
3. **Arbitrary Depth**: Handles arbitrarily deep nesting
4. **Memory Efficiency**: Doesn't need to flatten everything upfront

---

## Related Problems

Based on similar themes (nested structures, iterator pattern):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Flatten Binary Tree to Linked List | [Link](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) | Flatten tree using stack |
| Binary Search Tree Iterator | [Link](https://leetcode.com/problems/binary-search-tree-iterator/) | Iterator for BST |
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Stack-based validation |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Flatten a Multilevel Doubly Linked List | [Link](https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/) | Flatten linked list |
| Nested List Weight Sum | [Link](https://leetcode.com/problems/nested-list-weight-sum/) | Sum nested integers |
| Array Nesting | [Link](https://leetcode.com/problems/array-nesting/) | Nested array iteration |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Stack-Based Iteration

- [NeetCode - Flatten Nested List Iterator](https://www.youtube.com/watch?v=ngtTQT2DNPc) - Clear explanation with visual examples
- [Back to Back SWE - Flatten Nested List Iterator](https://www.youtube.com/watch?v=AmBaa7W9XHQ) - Detailed walkthrough

### Related Concepts

- [Stack Data Structure](https://www.youtube.com/watch?v=1i2T7w0qY3E) - Understanding stacks
- [Iterator Pattern](https://www.youtube.com/watch?v=0i2oG9X5xXk) - Iterator design pattern

---

## Follow-up Questions

### Q1: How would you modify the solution to handle very deep nesting?

**Answer:** The stack-based solution already handles deep nesting efficiently. For extremely deep nesting (that might cause stack overflow in recursive solutions), the iterative stack approach is preferred.

---

### Q2: Can you implement this without using extra space for all integers at once?

**Answer:** Yes! The stack-based approach already does this - it only stores elements on the stack as needed and releases them after processing. The recursive approach with queue uses more memory upfront.

---

### Q3: How would you add a method to get the total count of integers without iterating twice?

**Answer:** You could maintain a counter during initialization (in both approaches) and update it as you flatten. However, this would require storing all integers or iterating twice.

---

### Q4: What if you need to support reset() to start over?

**Answer:** You would need to either:
1. Store the original nested list and reinitialize (simple)
2. Store all flattened integers in a separate structure (more memory)

---

### Q5: How would you modify for a doubly nested structure (each element can be a list or integer)?

**Answer:** The current solution already handles this case. The key is to check `isInteger()` vs `getList()` to determine the type.

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty nested list
- Single integer
- Deeply nested list
- List with only nested lists (no integers)
- Multiple levels of nesting
- Negative integers

---

## Common Pitfalls

### 1. Not Reversing Elements
**Issue:** Adding elements to stack in wrong order leads to incorrect sequence.

**Solution:** Always add elements in reverse order: `extend(lst[::-1])` in Python.

### 2. Forgetting hasNext() Call in next()
**Issue:** next() might return a list instead of an integer.

**Solution:** Always call hasNext() before accessing the integer, or ensure top is integer.

### 3. Memory Issues with Deep Nesting
**Issue:** Recursive approach can cause stack overflow.

**Solution:** Use iterative stack-based approach.

### 4. Modifying Original List
**Issue:** Accidentally modifying the nested list during iteration.

**Solution:** Make copies or use stack to avoid modifying input.

---

## Summary

The **Flatten Nested List Iterator** problem demonstrates:

- **Stack-Based Approach**: O(n) initialization, O(1) amortized per operation
- **Recursive Approach**: O(n) initialization, simpler but less memory-efficient
- **Lazy Evaluation**: Processing elements only when needed

The key insight is using a stack to manage nested elements, pushing lists in reverse order so they can be processed LIFO.

### Pattern Summary

This problem exemplifies the **Stack - Nested Structure** pattern, which is characterized by:
- Using stack to handle nested elements
- Lazy processing (only when needed)
- Handling arbitrary depth
- Flatenning without full preprocessing

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/flatten-nested-list-iterator/discuss/) - Community solutions
- [Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Understanding stacks
- [Iterator Pattern - Wikipedia](https://en.wikipedia.org/wiki/Iterator_pattern) - Iterator design pattern
