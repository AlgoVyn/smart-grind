# Insert Delete GetRandom O(1)

## Problem Description

Implement the `RandomizedSet` class that supports the following operations in **average O(1)** time:

- `RandomizedSet()` - Initializes the RandomizedSet object.
- `bool insert(int val)` - Inserts an item `val` into the set if not present. Returns `true` if the item was not present, `false` otherwise.
- `bool remove(int val)` - Removes an item `val` from the set if present. Returns `true` if the item was present, `false` otherwise.
- `int getRandom()` - Returns a random element from the current set of elements. Each element must have the same probability of being returned.

> **Note:** It is guaranteed that at least one element exists when `getRandom` is called.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]`<br>`[[], [1], [2], [2], [], [1], [2], []]` | `[null, true, false, true, 2, true, false, 2]` |

**Explanation:**
```python
RandomizedSet randomizedSet = new RandomizedSet();
randomizedSet.insert(1);    // Inserts 1, returns true
randomizedSet.remove(2);    // Returns false (2 does not exist)
randomizedSet.insert(2);    // Inserts 2, returns true. Set now contains [1, 2]
randomizedSet.getRandom();  // Returns 1 or 2 randomly
randomizedSet.remove(1);    // Removes 1, returns true. Set now contains [2]
randomizedSet.insert(2);    // Returns false (2 already exists)
randomizedSet.getRandom();  // Returns 2 (only element)
```

## Constraints

- `-2³¹ <= val <= 2³¹ - 1`
- At most `2 * 10⁵` calls will be made to `insert`, `remove`, and `getRandom`.
- There will be at least one element when `getRandom` is called.

## Solution

```python
import random

class RandomizedSet:

    def __init__(self):
        self.list = []   # List for O(1) random access
        self.dict = {}   # Maps value to index in list

    def insert(self, val: int) -> bool:
        """Inserts val into the set. Returns True if successful."""
        if val in self.dict:
            return False
        self.dict[val] = len(self.list)
        self.list.append(val)
        return True

    def remove(self, val: int) -> bool:
        """Removes val from the set. Returns True if successful."""
        if val not in self.dict:
            return False
        idx = self.dict[val]
        last = self.list[-1]
        self.list[idx] = last
        self.dict[last] = idx
        self.list.pop()
        del self.dict[val]
        return True

    def getRandom(self) -> int:
        """Returns a random element from the set."""
        return random.choice(self.list)
```

## Explanation

This problem implements a set with O(1) average time complexity for all operations by combining a list and a dictionary.

### Data Structure Design

- **`list`**: Maintains elements in insertion order for O(1) random access via `random.choice()`.
- **`dict`**: Maps each value to its index in the list for O(1) lookups.

### Operations

1. **Insert:**
   - Check if value exists in dict (O(1)).
   - Add to dict with index = current list length.
   - Append to list.
   - Return `True` if new, `False` if duplicate.

2. **Remove:**
   - Check if value exists in dict (O(1)).
   - Get index of value.
   - Swap with last element in list.
   - Update dictionary mapping for swapped element.
   - Remove last element from list and delete from dict.
   - Return `True` if removed, `False` if not found.

3. **getRandom:**
   - Use `random.choice()` on the list (O(1)).

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Insert | O(1) average | O(1) |
| Remove | O(1) average | O(1) |
| getRandom | O(1) | O(1) |

**Overall Space:** O(n) for storing n elements.
