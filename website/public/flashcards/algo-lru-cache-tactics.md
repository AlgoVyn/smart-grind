## Title: LRU Cache Tactics

What are the key implementation tactics for cache design?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| Dummy head/tail | No null checks |
| Sentinel nodes | Simplify edge cases |
| Size tracking | O(1) capacity check |
| Lazy eviction | Batch removals |

### Thread-Safe LRU
```python
from threading import Lock

class ThreadSafeLRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.lock = Lock()
        # ... linked list setup ...
    
    def get(self, key):
        with self.lock:
            if key not in self.cache:
                return -1
            node = self.cache[key]
            self._move_to_front(node)
            return node.val
    
    def put(self, key, value):
        with self.lock:
            # ... same as single-threaded ...
            pass
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| Concurrent access | Race conditions | Add locks |
| Memory leaks | Not removing from dict | Delete on eviction |
| Integer overflow | Capacity < 0 | Validate input |
| Stale pointers | Node reallocation | Update all refs |
| Not handling get/put same key | Wrong ordering | Move to front |

### Size-Bounded with Weight
```python
class WeightedLRUCache:
    def __init__(self, max_weight: int):
        self.max_weight = max_weight
        self.current_weight = 0
        self.cache = {}  # key -> (value, weight, node)
        # ... linked list ...
    
    def put(self, key, value, weight):
        if key in self.cache:
            old_weight = self.cache[key][1]
            self.current_weight -= old_weight
            self._remove(self.cache[key][2])
        
        while self.current_weight + weight > self.max_weight:
            lru = self._pop_tail()
            self.current_weight -= self.cache[lru.key][1]
            del self.cache[lru.key]
        
        # Add new item
        self.current_weight += weight
        # ... add to front ...
```

<!-- back -->
