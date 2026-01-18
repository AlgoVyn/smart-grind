# Stack - Min Stack Design

## Overview

The Min Stack Design pattern implements a stack data structure that supports standard stack operations (push, pop, top) plus a getMin operation that retrieves the minimum element in constant time. This is achieved by storing additional information with each element to track the current minimum value.

This pattern should be used when:
- You need O(1) time complexity for finding the minimum element
- Implementing data structures that require frequent min/max queries
- Building more complex data structures like monotonic stacks
- Solving problems that involve tracking minimum values during stack operations

Benefits include:
- Constant time minimum retrieval
- Standard stack operations remain O(1)
- Space efficient (O(n) total space)
- Can be extended to support maximum values as well

## Key Concepts

- **Pair Storage**: Store each element as (value, current_min) tuple
- **Minimum Tracking**: Update minimum when pushing new elements
- **Lazy Minimum**: Minimum is always available at stack top
- **Two-Stack Approach**: Alternative implementation using separate min stack

## Template

```python
class MinStack:
    def __init__(self):
        # Stack stores tuples: (value, current_minimum)
        self.stack = []
    
    def push(self, val: int) -> None:
        # Calculate new minimum: min of val and current min (if stack exists)
        current_min = min(val, self.stack[-1][1]) if self.stack else val
        # Push tuple of (value, current_min)
        self.stack.append((val, current_min))
    
    def pop(self) -> None:
        # Remove top element
        self.stack.pop()
    
    def top(self) -> int:
        # Return the value part of top tuple
        return self.stack[-1][0]
    
    def getMin(self) -> int:
        # Return the minimum part of top tuple
        return self.stack[-1][1]
```

## Example Problems

1. **Min Stack** (LeetCode 155): Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
2. **Max Stack**: Similar to min stack but tracks maximum values.
3. **Stack with Increment Operation** (LeetCode 1381): Implement a stack with increment operation that adds value to bottom k elements.

## Time and Space Complexity

- **Time Complexity**: O(1) for all operations (push, pop, top, getMin)
- **Space Complexity**: O(n) where n is the number of elements in the stack

## Common Pitfalls

- Forgetting to update the minimum when pushing elements
- Not handling the case when stack is empty for getMin or top operations
- Incorrectly calculating the new minimum (should be min of new value and current min)
- Using a separate min variable instead of storing min with each element
- Edge cases: pushing same values, popping all elements, empty stack operations