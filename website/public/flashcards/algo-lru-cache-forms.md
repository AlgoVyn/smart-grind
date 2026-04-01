## Title: LRU Cache Forms

What are the different forms and cache eviction policies?

<!-- front -->

---

### Cache Types

| Type | Eviction | Use Case |
|------|----------|----------|
| LRU | Least Recently Used | Temporal locality |
| LFU | Least Frequently Used | Frequency-based |
| FIFO | First In First Out | Simple queue |
| MRU | Most Recently Used | Stack-like access |
| TTL | Time To Live | Expiring entries |

### LFU Cache Implementation
```python
class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.key_to_val_freq = {}  # key -> (value, freq)
        self.freq_to_keys = defaultdict(OrderedDict)  # freq -> keys
        self.min_freq = 0
    
    def get(self, key: int) -> int:
        if key not in self.key_to_val_freq:
            return -1
        val, freq = self.key_to_val_freq[key]
        self._update_freq(key, freq)
        return val
    
    def _update_freq(self, key, old_freq):
        val = self.key_to_val_freq[key][0]
        del self.freq_to_keys[old_freq][key]
        if not self.freq_to_keys[old_freq]:
            del self.freq_to_keys[old_freq]
            if self.min_freq == old_freq:
                self.min_freq += 1
        
        new_freq = old_freq + 1
        self.key_to_val_freq[key] = (val, new_freq)
        self.freq_to_keys[new_freq][key] = None
    
    def put(self, key: int, value: int) -> None:
        if self.capacity <= 0:
            return
        if key in self.key_to_val_freq:
            self.key_to_val_freq[key] = (value, self.key_to_val_freq[key][1])
            self.get(key)
            return
        
        if len(self.key_to_val_freq) >= self.capacity:
            lfu_key = next(iter(self.freq_to_keys[self.min_freq]))
            del self.freq_to_keys[self.min_freq][lfu_key]
            del self.key_to_val_freq[lfu_key]
        
        self.key_to_val_freq[key] = (value, 1)
        self.freq_to_keys[1][key] = None
        self.min_freq = 1
```

---

### TTL Cache
```python
class TTLCache:
    def __init__(self, capacity: int, ttl: float):
        self.capacity = capacity
        self.ttl = ttl
        self.cache = OrderedDict()  # key -> (value, expiry_time)
    
    def _evict_expired(self):
        now = time.time()
        while self.cache and self.cache.peekitem(0)[1][1] < now:
            self.cache.popitem(last=False)
    
    def get(self, key):
        self._evict_expired()
        if key not in self.cache:
            return None
        val, _ = self.cache[key]
        self.cache.move_to_end(key)
        return val
    
    def put(self, key, value):
        self._evict_expired()
        expiry = time.time() + self.ttl
        self.cache[key] = (value, expiry)
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

---

### Cache Form Comparison
| Form | Lookup | Update | Eviction |
|------|--------|--------|----------|
| LRU | O(1) | O(1) | O(1) |
| LFU | O(1) | O(1) | O(1) |
| Simple | O(1) | O(1) | O(n) scan |
| LinkedHashMap | O(1) | O(1) | O(1) |

<!-- back -->
