# LFU Cache

## Problem Description

Design and implement a data structure for a **Least Frequently Used (LFU)** cache. Implement the `LFUCache` class:

### Methods

| Method | Description |
|--------|-------------|
| `LFUCache(int capacity)` | Initializes the object with the capacity of the data structure |
| `int get(int key)` | Gets the value of the key if the key exists in the cache. Otherwise, returns `-1` |
| `void put(int key, int value)` | Update the value of the key if present, or inserts the key if not already present |

When the cache reaches its capacity, it should **invalidate and remove the least frequently used key** before inserting a new item. When there is a tie (i.e., two or more keys with the same frequency), the **least recently used key** would be invalidated.

> The functions `get` and `put` must each run in **O(1) average time complexity**.

## Examples

### Example

```
Input
["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]

Output
[null, null, null, 1, null, -1, 3, null, -1, 3, 4]
```

**Explanation:**
- `cnt(x)` = the use counter for key `x`
- `cache=[]` will show the last used order for tiebreakers (leftmost element is most recent)

```
LFUCache lfu = new LFUCache(2);
lfu.put(1, 1);   // cache=[1,_], cnt(1)=1
lfu.put(2, 2);   // cache=[2,1], cnt(2)=1, cnt(1)=1
lfu.get(1);      // return 1
                  // cache=[1,2], cnt(2)=1, cnt(1)=2
lfu.put(3, 3);   // 2 is the LFU key because cnt(2)=1 is the smallest, invalidate 2.
                  // cache=[3,1], cnt(3)=1, cnt(1)=2
lfu.get(2);      // return -1 (not found)
lfu.get(3);      // return 3
                  // cache=[3,1], cnt(3)=2, cnt(1)=2
lfu.put(4, 4);   // Both 1 and 3 have the same cnt, but 1 is LRU, invalidate 1.
                  // cache=[4,3], cnt(4)=1, cnt(3)=2
lfu.get(1);      // return -1 (not found)
lfu.get(3);      // return 3
                  // cache=[3,4], cnt(4)=1, cnt(3)=3
lfu.get(4);      // return 4
                  // cache=[4,3], cnt(4)=2, cnt(3)=3
```

---

## Constraints

- `1 <= capacity <= 10^4`
- `0 <= key <= 10^5`
- `0 <= value <= 10^9`
- At most `2 * 10^5` calls will be made to `get` and `put`

---

## LeetCode Link

[LeetCode Problem 460: LFU Cache](https://leetcode.com/problems/lfu-cache/)

---

## Pattern: Multi-Level Data Structure

This problem follows the **Multi-Level Data Structure** pattern combining multiple data structures.

### Core Concept

- **HashMap**: O(1) key-value and key-frequency lookups
- **OrderedDict per Frequency**: LRU order within each frequency level
- **min_freq Tracking**: Quick identification of eviction candidate

### When to Use This Pattern

This pattern is applicable when:
1. Combining multiple data structures for efficiency
2. Cache with complex eviction policies
3. Problems requiring O(1) operations with multiple constraints

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Doubly Linked List | Manual implementation of OrderedDict |
| Single HashMap | Simpler but less efficient |

---

## Intuition

The key insight is combining **HashMap for O(1) access** with **frequency-based buckets** where each bucket maintains LRU order. We need to track both frequency and recency.

### Key Observations

1. **Three-Level Structure**: 
   - key → value (for O(1) value lookup)
   - key → frequency (for O(1) freq lookup)
   - frequency → OrderedDict of keys (for LRU within frequency)

2. **min_freq Tracking**: Track minimum frequency to quickly find eviction candidate
3. **Frequency Update**: On get/put, increment frequency and move key to new freq bucket
4. **Eviction**: Remove from min_freq bucket (LRU order), then insert new key

### Why Multiple Data Structures

No single data structure can handle both requirements:
- HashMap gives O(1) access by key
- OrderedDict gives O(1) LRU order within each frequency
- Together they enable O(1) for all operations

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **HashMap + OrderedDict** - Standard solution
2. **HashMap + Doubly Linked List** - Manual implementation

---

## Approach 1: HashMap + OrderedDict (Standard)

### Algorithm Steps

1. Maintain three data structures:
   - key_to_val: HashMap for key→value
   - key_to_freq: HashMap for key→frequency
   - freq_to_keys: HashMap from frequency to OrderedDict of keys
2. Track min_freq for quick eviction
3. On get(): return value if exists, update frequency
4. On put(): if key exists, update value and frequency; if not, check capacity and evict if needed

### Why It Works

Using OrderedDict within each frequency bucket gives us O(1) access to both ends - we can get the LRU key (first item) and add new keys to the end in O(1) time.

### Code Implementation

````carousel
```python
from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):
        """
        Initialize LFU cache with given capacity.
        
        Args:
            capacity: Maximum number of key-value pairs to store
        """
        self.capacity = capacity
        self.key_to_val = {}
        self.key_to_freq = {}
        self.freq_to_keys = defaultdict(OrderedDict)
        self.min_freq = 0
    
    def get(self, key: int) -> int:
        """
        Get value for key, return -1 if not found.
        Updates frequency of the key.
        
        Args:
            key: The key to look up
            
        Returns:
            The value if found, -1 otherwise
        """
        if key not in self.key_to_val:
            return -1
        self._update_freq(key)
        return self.key_to_val[key]
    
    def put(self, key: int, value: int) -> None:
        """
        Put key-value pair into cache.
        Evicts LFU item if at capacity.
        
        Args:
            key: The key to insert/update
            value: The value to store
        """
        if self.capacity == 0:
            return
        
        # If key exists, update value and frequency
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self._update_freq(key)
            return
        
        # If at capacity, evict LFU (LRU if tie)
        if len(self.key_to_val) == self.capacity:
            # Remove LFU, LRU
            lfu_key, _ = self.freq_to_keys[self.min_freq].popitem(last=False)
            del self.key_to_val[lfu_key]
            del self.key_to_freq[lfu_key]
        
        # Insert new key
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1][key] = None
        self.min_freq = 1
    
    def _update_freq(self, key: int) -> None:
        """Update frequency of a key."""
        freq = self.key_to_freq[key]
        
        # Remove from current frequency bucket
        del self.freq_to_keys[freq][key]
        
        # Clean up empty frequency bucket
        if not self.freq_to_keys[freq]:
            del self.freq_to_keys[freq]
            # Update min_freq if needed
            if self.min_freq == freq:
                self.min_freq += 1
        
        # Add to next frequency bucket
        self.key_to_freq[key] = freq + 1
        self.freq_to_keys[freq + 1][key] = None
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <list>
using namespace std;

class LFUCache {
    int capacity;
    int minFreq;
    unordered_map<int, pair<int, int>> keyValFreq; // key -> {value, freq}
    unordered_map<int, list<int>> freqKeys; // freq -> list of keys (LRU)
    unordered_map<int, list<int>::iterator> keyIter; // key -> iterator in list
    
public:
    LFUCache(int capacity) {
        this->capacity = capacity;
        this->minFreq = 0;
    }
    
    int get(int key) {
        if (keyValFreq.find(key) == keyValFreq.end()) {
            return -1;
        }
        
        int freq = keyValFreq[key].second;
        int value = keyValFreq[key].first;
        
        // Remove from current freq list
        freqKeys[freq].erase(keyIter[key]);
        if (freqKeys[freq].empty()) {
            freqKeys.erase(freq);
            if (minFreq == freq) minFreq++;
        }
        
        // Add to next freq list
        freqKeys[freq + 1].push_front(key);
        keyIter[key] = freqKeys[freq + 1].begin();
        keyValFreq[key] = {value, freq + 1};
        
        return value;
    }
    
    void put(int key, int value) {
        if (capacity == 0) return;
        
        if (keyValFreq.find(key) != keyValFreq.end()) {
            // Update existing key
            keyValFreq[key].first = value;
            get(key); // This will update frequency
            return;
        }
        
        // Evict if at capacity
        if (keyValFreq.size() == capacity) {
            int lfuKey = freqKeys[minFreq].back();
            freqKeys[minFreq].pop_back();
            keyIter.erase(lfuKey);
            keyValFreq.erase(lfuKey);
        }
        
        // Insert new key
        keyValFreq[key] = {value, 1};
        freqKeys[1].push_front(key);
        keyIter[key] = freqKeys[1].begin();
        minFreq = 1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class LFUCache {
    private int capacity;
    private int minFreq;
    private Map<Integer, int[]> keyValFreq; // key -> {value, freq}
    private Map<Integer, LinkedHashSet<Integer>> freqKeys; // freq -> set of keys
    
    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyValFreq = new HashMap<>();
        this.freqKeys = new HashMap<>();
    }
    
    public int get(int key) {
        if (!keyValFreq.containsKey(key)) {
            return -1;
        }
        
        int[] valFreq = keyValFreq.get(key);
        int freq = valFreq[1];
        
        // Remove from current freq set
        freqKeys.get(freq).remove(key);
        if (freqKeys.get(freq).isEmpty()) {
            freqKeys.remove(freq);
            if (minFreq == freq) minFreq++;
        }
        
        // Add to next freq set
        freqKeys.computeIfAbsent(freq + 1, k -> new LinkedHashSet<>()).add(key);
        keyValFreq.put(key, new int[]{valFreq[0], freq + 1});
        
        return valFreq[0];
    }
    
    public void put(int key, int value) {
        if (capacity == 0) return;
        
        if (keyValFreq.containsKey(key)) {
            keyValFreq.get(key)[0] = value;
            get(key);
            return;
        }
        
        // Evict if at capacity
        if (keyValFreq.size() == capacity) {
            int lfuKey = freqKeys.get(minFreq).iterator().next();
            freqKeys.get(minFreq).remove(lfuKey);
            if (freqKeys.get(minFreq).isEmpty()) {
                freqKeys.remove(minFreq);
            }
            keyValFreq.remove(lfuKey);
        }
        
        // Insert new key
        keyValFreq.put(key, new int[]{value, 1});
        freqKeys.computeIfAbsent(1, k -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }
}
```

<!-- slide -->
```javascript
class LFUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyValFreq = new Map(); // key -> {value, freq}
        this.freqKeys = new Map(); // freq -> Map of key -> null (for order)
    }
    
    /**
     * @param {number} key
     * @return {number}
     */
    get(key) {
        if (!this.keyValFreq.has(key)) {
            return -1;
        }
        
        const [value, freq] = this.keyValFreq.get(key);
        
        // Remove from current freq
        const currentSet = this.freqKeys.get(freq);
        currentSet.delete(key);
        if (currentSet.size === 0) {
            this.freqKeys.delete(freq);
            if (this.minFreq === freq) this.minFreq++;
        }
        
        // Add to next freq
        const newFreq = freq + 1;
        if (!this.freqKeys.has(newFreq)) {
            this.freqKeys.set(newFreq, new Map());
        }
        this.freqKeys.get(newFreq).set(key, null);
        
        this.keyValFreq.set(key, [value, newFreq]);
        
        return value;
    }
    
    /**
     * @param {number} key 
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        if (this.capacity === 0) return;
        
        if (this.keyValFreq.has(key)) {
            this.keyValFreq.set(key, [value, this.keyValFreq.get(key)[1]]);
            this.get(key);
            return;
        }
        
        // Evict if at capacity
        if (this.keyValFreq.size() === this.capacity) {
            const lfuSet = this.freqKeys.get(this.minFreq);
            const lfuKey = lfuSet.keys().next().value;
            lfuSet.delete(lfuKey);
            if (lfuSet.size === 0) {
                this.freqKeys.delete(this.minFreq);
            }
            this.keyValFreq.delete(lfuKey);
        }
        
        // Insert new key
        if (!this.freqKeys.has(1)) {
            this.freqKeys.set(1, new Map());
        }
        this.freqKeys.get(1).set(key, null);
        this.keyValFreq.set(key, [value, 1]);
        this.minFreq = 1;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized for get and put |
| **Space** | O(capacity) |

---

## Approach 2: HashMap + LinkedHashSet (Alternative)

### Algorithm Steps

1. Use LinkedHashSet within each frequency bucket to maintain LRU order
2. Track key-to-value, key-to-frequency mappings using HashMaps
3. Use a separate HashMap to track frequency-to-LinkedHashSet
4. On get(): update frequency and move key to new frequency bucket
5. On put(): evict LFU/LRU if at capacity

### Why It Works

LinkedHashSet provides O(1) insertion and removal while maintaining insertion order. This serves the same purpose as OrderedDict - maintaining LRU order within each frequency level.

### Code Implementation

````carousel
```python
from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.key_to_val = {}
        self.key_to_freq = {}
        self.freq_to_keys = defaultdict(OrderedDict)
        self.min_freq = 0
    
    def get(self, key: int) -> int:
        if key not in self.key_to_val:
            return -1
        freq = self.key_to_freq[key]
        # Remove from current frequency bucket (last item = LRU)
        del self.freq_to_keys[freq][key]
        if not self.freq_to_keys[freq]:
            del self.freq_to_keys[freq]
            if self.min_freq == freq:
                self.min_freq += 1
        self.key_to_freq[key] = freq + 1
        self.freq_to_keys[freq + 1][key] = None
        return self.key_to_val[key]
    
    def put(self, key: int, value: int) -> None:
        if self.capacity == 0:
            return
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self.get(key)
            return
        if len(self.key_to_val) == self.capacity:
            # Remove LRU (first item in OrderedDict)
            lfu_key = next(iter(self.freq_to_keys[self.min_freq]))
            del self.freq_to_keys[self.min_freq][lfu_key]
            del self.key_to_val[lfu_key]
            del self.key_to_freq[lfu_key]
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1][key] = None
        self.min_freq = 1
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <set>
using namespace std;

class LFUCache {
    int capacity;
    int minFreq;
    unordered_map<int, pair<int, int>> keyValFreq;
    unordered_map<int, set<int>> freqKeys;
    
public:
    LFUCache(int capacity) : capacity(capacity), minFreq(0) {}
    
    int get(int key) {
        if (keyValFreq.find(key) == keyValFreq.end()) return -1;
        
        int freq = keyValFreq[key].second;
        freqKeys[freq].erase(key);
        if (freqKeys[freq].empty()) {
            freqKeys.erase(freq);
            if (minFreq == freq) minFreq++;
        }
        
        keyValFreq[key].second = freq + 1;
        freqKeys[freq + 1].insert(key);
        return keyValFreq[key].first;
    }
    
    void put(int key, int value) {
        if (capacity == 0) return;
        
        if (keyValFreq.find(key) != keyValFreq.end()) {
            keyValFreq[key].first = value;
            get(key);
            return;
        }
        
        if (keyValFreq.size() == capacity) {
            int lfuKey = *freqKeys[minFreq].begin();
            freqKeys[minFreq].erase(lfuKey);
            keyValFreq.erase(lfuKey);
        }
        
        keyValFreq[key] = {value, 1};
        freqKeys[1].insert(key);
        minFreq = 1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class LFUCache {
    private int capacity;
    private int minFreq;
    private Map<Integer, int[]> keyValFreq;
    private Map<Integer, LinkedHashSet<Integer>> freqKeys;
    
    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyValFreq = new HashMap<>();
        this.freqKeys = new HashMap<>();
    }
    
    public int get(int key) {
        if (!keyValFreq.containsKey(key)) return -1;
        
        int freq = keyValFreq.get(key)[1];
        freqKeys.get(freq).remove(key);
        if (freqKeys.get(freq).isEmpty()) {
            freqKeys.remove(freq);
            if (minFreq == freq) minFreq++;
        }
        
        keyValFreq.put(key, new int[]{keyValFreq.get(key)[0], freq + 1});
        freqKeys.computeIfAbsent(freq + 1, k -> new LinkedHashSet<>()).add(key);
        return keyValFreq.get(key)[0];
    }
    
    public void put(int key, int value) {
        if (capacity == 0) return;
        
        if (keyValFreq.containsKey(key)) {
            keyValFreq.get(key)[0] = value;
            get(key);
            return;
        }
        
        if (keyValFreq.size() == capacity) {
            int lfuKey = freqKeys.get(minFreq).iterator().next();
            freqKeys.get(minFreq).remove(lfuKey);
            keyValFreq.remove(lfuKey);
        }
        
        keyValFreq.put(key, new int[]{value, 1});
        freqKeys.computeIfAbsent(1, k -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }
}
```

<!-- slide -->
```javascript
class LFUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyValFreq = new Map();
        this.freqKeys = new Map();
    }
    
    get(key) {
        if (!this.keyValFreq.has(key)) return -1;
        
        const [value, freq] = this.keyValFreq.get(key);
        const currentSet = this.freqKeys.get(freq);
        currentSet.delete(key);
        if (currentSet.size === 0) {
            this.freqKeys.delete(freq);
            if (this.minFreq === freq) this.minFreq++;
        }
        
        const newFreq = freq + 1;
        if (!this.freqKeys.has(newFreq)) {
            this.freqKeys.set(newFreq, new Set());
        }
        this.freqKeys.get(newFreq).add(key);
        this.keyValFreq.set(key, [value, newFreq]);
        
        return value;
    }
    
    put(key, value) {
        if (this.capacity === 0) return;
        
        if (this.keyValFreq.has(key)) {
            this.keyValFreq.set(key, [value, this.keyValFreq.get(key)[1]]);
            this.get(key);
            return;
        }
        
        if (this.keyValFreq.size === this.capacity) {
            const lfuSet = this.freqKeys.get(this.minFreq);
            const lfuKey = lfuSet.values().next().value;
            lfuSet.delete(lfuKey);
            this.keyValFreq.delete(lfuKey);
        }
        
        if (!this.freqKeys.has(1)) {
            this.freqKeys.set(1, new Set());
        }
        this.freqKeys.get(1).add(key);
        this.keyValFreq.set(key, [value, 1]);
        this.minFreq = 1;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized for get and put |
| **Space** | O(capacity) |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Data Structure Design, HashMap, LRU/LFU

### Learning Outcomes

1. **Complex Data Structures**: Combine multiple data structures
2. **O(1) Operations**: Achieve constant time for all operations
3. **Edge Cases**: Handle frequency updates and eviction

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| LRU Cache | [Link](https://leetcode.com/problems/lru-cache/) | Least Recently Used |
| Design In-Memory File System | [Link](https://leetcode.com/problems/design-in-memory-file-system/) | Data structure design |

---

## Video Tutorial Links

1. **[NeetCode - LFU Cache](https://www.youtube.com/watch?v=0bD6Ol7Ojw)** - Clear explanation
2. **[LFU Cache - LeetCode 460](https://www.youtube.com/watch?v=0bD6Ol7Ojw)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you implement this with a doubly linked list instead of OrderedDict?

**Answer:** Use a custom doubly linked list where each node represents a key-value pair. Maintain separate lists for each frequency level.

---

### Q2: How would you handle concurrent access?

**Answer:** Add locks (mutex) around critical sections, or use thread-safe data structures.

---

### Q3: What's the difference between LRU and LFU?

**Answer:** LRU (Least Recently Used) tracks access time, LFU (Least Frequently Used) tracks access frequency.

---

## Common Pitfalls

1. **Updating min_freq incorrectly**: When a key's frequency is updated, if the old frequency bucket becomes empty, update min_freq to the new frequency.
2. **LRU vs LFU confusion**: When frequencies are equal, LRU determines eviction.
3. **Not handling get on existing key**: get() should increment frequency, not just return value.
4. **Capacity check timing**: Check capacity before inserting new key, but after handling update for existing key.

---

## Summary

The **LFU Cache** problem demonstrates a **Multi-Level Data Structure** combining:

- **HashMap**: O(1) key-value and key-frequency lookups
- **OrderedDict per Frequency**: LRU order within each frequency level
- **Time**: O(1) amortized for get and put operations
- **Space**: O(capacity)

Key insight: Track minimum frequency to quickly identify eviction candidate, use OrderedDict for LRU within same frequency.

### Pattern Summary

This problem exemplifies the **Complex Data Structure Design** pattern, characterized by:
- Combining multiple data structures
- Achieving O(1) operations through careful design
- Handling frequency-based and recency-based eviction

---

## Additional Resources

- [LeetCode Problem 460](https://leetcode.com/problems/lfu-cache/) - Official problem page
- [LRU Cache - GeeksforGeeks](https://www.geeksforgeeks.org/lru-cache-implementation/) - Related problem
