# Design (General/Specific)

## Overview

The Design pattern is used to solve problems requiring the design of data structures or systems with specific constraints. This pattern involves careful consideration of trade-offs between time complexity, space complexity, and usability based on problem requirements.

## Key Concepts

- **Requirements Analysis**: Identify the key operations that need to be efficient.
- **Data Structure Selection**: Choose appropriate data structures (arrays, linked lists, hash tables, trees, etc.).
- **Trade-off Evaluation**: Balance between time complexity of operations and space requirements.
- **Edge Case Handling**: Consider scenarios like empty inputs, large data, or frequent operations.

## Template - LRU Cache Example

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Move accessed key to end to mark as most recently used
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            # Remove the least recently used key (first item)
            self.cache.popitem(last=False)
```

## Example Problems

1. **LRU Cache (LeetCode 146)**: Design a data structure that follows LRU cache eviction policy.
2. **Min Stack (LeetCode 155)**: Design a stack that supports push, pop, top, and retrieving min in O(1).
3. **Implement Queue using Stacks (LeetCode 232)**: Implement a queue using two stacks.
4. **Design Underground System (LeetCode 1396)**: Design a system to track customer travel times.

## Time and Space Complexity

- **LRU Cache**: O(1) time per get/put, O(capacity) space.
- **Min Stack**: O(1) time per operation, O(n) space.
- **Queue using Stacks**: O(1) amortized time per operation, O(n) space.

## Common Pitfalls

- **Overcomplicating the design**: Adding unnecessary features or complexity.
- **Ignoring time/space constraints**: Failing to prioritize required operations.
- **Not handling edge cases**: Forgetting to test scenarios like empty cache or full capacity.
- **Poor data structure selection**: Using a list when a hash table or tree would be more efficient.
- **Not considering concurrency**: Ignoring thread safety in multi-threaded environments.
