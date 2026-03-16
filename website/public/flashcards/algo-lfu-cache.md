## LFU Cache (Least Frequently Used)

**Question:** Design cache that evicts least frequently used item?

<!-- front -->

---

## Answer: HashMap + Doubly Linked Lists

### Solution
```python
from collections import defaultdict

class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.min_freq = 0
        self.cache = {}  # key: [value, freq]
        self.freq_map = defaultdict(list)  # freq: [keys]
        self.key_to_node = {}
    
    def get(self, key):
        if key not in self.cache:
            return -1
        
        # Update frequency
        freq = self.cache[key][1]
        self.freq_map[freq].remove(key)
        if not self.freq_map[freq]:
            del self.freq_map[freq]
            if self.min_freq == freq:
                self.min_freq += 1
        
        freq += 1
        self.cache[key][1] = freq
        self.freq_map[freq].append(key)
        
        return self.cache[key][0]
    
    def put(self, key, value):
        if self.capacity == 0:
            return
        
        if key in self.cache:
            # Update existing
            freq = self.cache[key][1]
            self.freq_map[freq].remove(key)
            if not self.freq_map[freq]:
                del self.freq_map[freq]
                if self.min_freq == freq:
                    self.min_freq += 1
            
            freq += 1
            self.cache[key] = [value, freq]
            self.freq_map[freq].append(key)
        else:
            # Evict if full
            if len(self.cache) >= self.capacity:
                # Remove LFU (first in freq_map[min_freq])
                lfu_key = self.freq_map[self.min_freq].pop(0)
                if not self.freq_map[self.min_freq]:
                    del self.freq_map[self.min_freq]
                del self.cache[lfu_key]
            
            # Insert new
            self.cache[key] = [value, 1]
            self.freq_map[1].append(key)
            self.min_freq = 1
```

### Visual: LFU Structure
```
Cache: {A:5, B:3, C:3}, capacity=3

freq_map:
  3: [B, C]  (B inserted first)
  5: [A]

get(A): freq becomes 6
freq_map: {3:[B,C], 6:[A]}

put(D, 4):
  Evict B (freq=3, oldest)
  Insert D with freq=1
  min_freq = 1
```

### ⚠️ Tricky Parts

#### 1. Multiple Items Same Frequency
```python
# When evicting, need to remove oldest
# Use list (ordered) or another linked list
# LRU within same frequency
```

#### 2. Updating min_freq
```python
# When frequency becomes empty
# And min_freq was that frequency
# Need to increment min_freq
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| get | O(1) | O(capacity) |
| put | O(1) | O(capacity) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not tracking min_freq | Update on access/insert |
| Not removing from freq_map | Clean empty frequencies |
| Wrong eviction order | LFU, then LRU within freq |

<!-- back -->
