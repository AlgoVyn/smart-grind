# LRU Cache

## Problem Description

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the `LRUCache` class:

- `LRUCache(int capacity)` — Initialize the LRU cache with positive size `capacity`.
- `int get(int key)` — Return the value of the key if the key exists, otherwise return `-1`.
- `void put(int key, int value)` — Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions `get` and `put` must each run in `O(1)` average time complexity.

---

## Examples

**Example 1:**

**Input:**
```python
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
```

**Output:**
```python
[null, null, null, 1, null, -1, null, -1, 3, 4]
```

**Explanation:**
```python
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4
```

---

## Constraints

- `1 <= capacity <= 3000`
- `0 <= key <= 10^4`
- `0 <= value <= 10^5`
- At most `2 * 10^5` calls will be made to `get` and `put`.

---

## Solution

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key in self.cache:
            self.cache.move_to_end(key)
            return self.cache[key]
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

---

## Explanation

We use an `OrderedDict` to store the key-value pairs, which maintains the order of insertion and allows `O(1)` access and modification.

- In `get`, if the key exists, move it to the end (most recently used) and return the value.
- In `put`, if the key exists, move it to the end, then set the value. If the size exceeds capacity, remove the least recently used item (first item in `OrderedDict`).

This ensures all operations are `O(1)` on average.

---

## Complexity Analysis

- **Time Complexity:** `O(1)` for `get` and `put`.
- **Space Complexity:** `O(capacity)`, as we store at most `capacity` items.
