# Design Hashmap

## Problem Description

Design a HashMap without using any built-in hash table libraries.
Implement the MyHashMap class:

- `MyHashMap()` initializes the object with an empty map.
- `void put(int key, int value)` inserts a (key, value) pair into the HashMap. If the key already exists in the map, update the corresponding value.
- `int get(int key)` returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key.
- `void remove(key)` removes the key and its corresponding value if the map contains the mapping for the key.

**LeetCode Link:** [Design HashMap - LeetCode 706](https://leetcode.com/problems/design-hashmap/)

---

## Examples

### Example 1:

**Input:**
```python
["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"]
[[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]
```

**Output:**
```python
[null, null, null, 1, -1, null, 1, null, -1]
```

---

## Constraints

- `0 <= key, value <= 10^6`
- At most `10^4` calls will be made to put, get, and remove.

---

## Pattern: Direct Addressing Table (DAT)

This problem follows the **Direct Addressing Table (DAT)** pattern, using array indexing for O(1) operations.

### Core Concept

- **Array as hash map**: Use array index as key directly
- **Fixed size**: Since key range is known (0 to 10^6), use fixed array
- **Sentinel value**: Use -1 to indicate empty/missing entries

### When to Use This Pattern

This pattern is applicable when:
1. Key range is bounded and relatively small
2. Need O(1) operations without collision handling
3. Memory is not a concern for the key space

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Hash Map | Standard hash table with chaining |
| Hash Set | Set implementation using hashing |
| Direct Addressing | Array-based direct lookup |

### Pattern Summary

This problem exemplifies **Direct Addressing with Array**, characterized by:
- O(1) operations via array indexing
- Simple sentinel-based empty detection
- Trade-off of space for simplicity

---

## Intuition

The key insight is leveraging the bounded key range (0 to 10^6) to use direct addressing instead of traditional hashing.

### Key Observations

1. **Direct Addressing**: Since keys are in a known, limited range (0 to 10^6), we can use the key directly as an array index.

2. **Sentinel Value**: We use -1 to indicate "no value" since problem guarantees all values are >= 0.

3. **O(1) Operations**: Array indexing is O(1), making all operations constant time.

4. **Space Trade-off**: We use O(10^6) space to achieve O(1) time - a classic space-time trade-off.

### Why Direct Addressing Works

Traditional hash maps handle collisions through chaining or open addressing. However, when the key range is small and known (like 0 to 10^6), we can skip hashing entirely and use the key directly as an index. This eliminates:
- Hash computation overhead
- Collision handling complexity
- Worst-case O(n) scenarios

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Direct Addressing** - Using array as lookup table (Optimal for this problem)
2. **Chaining with Linked List** - Traditional hash map approach

---

## Approach 1: Direct Addressing (Optimal)

### Algorithm Steps

1. Create a fixed-size array of length 1,000,001 (for keys 0 to 10^6)
2. Initialize all entries to -1 (sentinel for "empty")
3. For put(key, value): Simply assign data[key] = value
4. For get(key): Return data[key]
5. For remove(key): Set data[key] = -1

### Why It Works

This approach works because the key range is bounded and known. Each key maps directly to an array index, eliminating the need for hashing and collision handling.

### Code Implementation

````carousel
```python
class MyHashMap:
    def __init__(self):
        """
        Initialize your data structure here.
        Uses direct addressing with fixed-size array.
        """
        self.size = 1000001  # Keys 0 to 10^6
        self.data = [-1] * self.size

    def put(self, key: int, value: int) -> None:
        """
        Inserts a (key, value) pair into the HashMap.
        
        Args:
            key: The key
            value: The value to associate with the key
        """
        self.data[key] = value

    def get(self, key: int) -> int:
        """
        Returns the value to which the specified key is mapped.
        
        Args:
            key: The key to look up
            
        Returns:
            The value mapped to the key, or -1 if not found
        """
        return self.data[key]

    def remove(self, key: int) -> None:
        """
        Removes the key and its corresponding value.
        
        Args:
            key: The key to remove
        """
        self.data[key] = -1
```

<!-- slide -->
```cpp
class MyHashMap {
private:
    static const int SIZE = 1000001;
    vector<int> data;

public:
    /** Initialize your data structure here. */
    MyHashMap() {
        data.resize(SIZE, -1);
    }
    
    /** value will always be non-negative. */
    void put(int key, int value) {
        data[key] = value;
    }
    
    /** Returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key */
    int get(int key) {
        return data[key];
    }
    
    /** Removes the mapping of the specified value key if this map contains the mapping for the key */
    void remove(int key) {
        data[key] = -1;
    }
};
```

<!-- slide -->
```java
class MyHashMap {
    private static final int SIZE = 1000001;
    private int[] data;
    
    /** Initialize your data structure here. */
    public MyHashMap() {
        data = new int[SIZE];
        Arrays.fill(data, -1);
    }
    
    /** value will always be non-negative. */
    public void put(int key, int value) {
        data[key] = value;
    }
    
    /** Returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key */
    public int get(int key) {
        return data[key];
    }
    
    /** Removes the mapping of the specified key if this map contains the mapping for the key */
    public void remove(int key) {
        data[key] = -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var MyHashMap = function() {
    this.SIZE = 1000001;
    this.data = new Array(this.SIZE).fill(-1);
};

/**
 * value will always be non-negative.
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
MyHashMap.prototype.put = function(key, value) {
    this.data[key] = value;
};

/**
 * Returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key 
 * @param {number} key
 * @return {number}
 */
MyHashMap.prototype.get = function(key) {
    return this.data[key];
};

/**
 * Removes the mapping of the specified key if this map contains the mapping for the key 
 * @param {number} key
 * @return {void}
 */
MyHashMap.prototype.remove = function(key) {
    this.data[key] = -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for all operations |
| **Space** | O(10^6) = O(1) fixed |

---

## Approach 2: Chaining with Array of Vectors

### Algorithm Steps

1. Create an array of vectors (buckets) of size N (typically a prime number)
2. For hash function: use key % N (simple modulo hashing)
3. For put: compute bucket index, handle collisions via chaining
4. For get: compute bucket index, search in the chain
5. For remove: compute bucket index, remove from chain

### Why It Works

This is the traditional hash map implementation using separate chaining. Each bucket holds a list of key-value pairs that hash to the same index.

### Code Implementation

````carousel
```python
class MyHashMap:
    def __init__(self):
        """Using chaining with array of lists."""
        self.bucket_size = 1009  # Prime number for better distribution
        self.buckets = [[] for _ in range(self.bucket_size)]
    
    def _hash(self, key: int) -> int:
        return key % self.bucket_size
    
    def put(self, key: int, value: int) -> None:
        bucket = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[bucket]):
            if k == key:
                self.buckets[bucket][i] = (key, value)
                return
        self.buckets[bucket].append((key, value))
    
    def get(self, key: int) -> int:
        bucket = self._hash(key)
        for k, v in self.buckets[bucket]:
            if k == key:
                return v
        return -1
    
    def remove(self, key: int) -> None:
        bucket = self._hash(key)
        self.buckets[bucket] = [(k, v) for k, v in self.buckets[bucket] if k != key]
```

<!-- slide -->
```cpp
class MyHashMap {
private:
    static const int BUCKET_SIZE = 1009;
    vector<pair<int, int>> buckets[BUCKET_SIZE];
    
    int hash(int key) {
        return key % BUCKET_SIZE;
    }

public:
    MyHashMap() {}
    
    void put(int key, int value) {
        int h = hash(key);
        for (auto& pair : buckets[h]) {
            if (pair.first == key) {
                pair.second = value;
                return;
            }
        }
        buckets[h].push_back({key, value});
    }
    
    int get(int key) {
        int h = hash(key);
        for (auto& pair : buckets[h]) {
            if (pair.first == key) {
                return pair.second;
            }
        }
        return -1;
    }
    
    void remove(int key) {
        int h = hash(key);
        auto& bucket = buckets[h];
        bucket.erase(remove_if(bucket.begin(), bucket.end(), 
            [key](const pair<int, int>& p) { return p.first == key; }), bucket.end());
    }
};
```

<!-- slide -->
```java
class MyHashMap {
    private static final int BUCKET_SIZE = 1009;
    private List<int[]>[] buckets;
    
    public MyHashMap() {
        buckets = new ArrayList[BUCKET_SIZE];
        for (int i = 0; i < BUCKET_SIZE; i++) {
            buckets[i] = new ArrayList<>();
        }
    }
    
    private int hash(int key) {
        return key % BUCKET_SIZE;
    }
    
    public void put(int key, int value) {
        int h = hash(key);
        for (int[] pair : buckets[h]) {
            if (pair[0] == key) {
                pair[1] = value;
                return;
            }
        }
        buckets[h].add(new int[]{key, value});
    }
    
    public int get(int key) {
        int h = hash(key);
        for (int[] pair : buckets[h]) {
            if (pair[0] == key) {
                return pair[1];
            }
        }
        return -1;
    }
    
    public void remove(int key) {
        int h = hash(key);
        buckets[h].removeIf(pair -> pair[0] == key);
    }
}
```

<!-- slide -->
```javascript
/**
 * Using chaining with arrays
 */
var MyHashMap = function() {
    this.BUCKET_SIZE = 1009;
    this.buckets = Array.from({ length: this.BUCKET_SIZE }, () => []);
};

MyHashMap.prototype.hash = function(key) {
    return key % this.BUCKET_SIZE;
};

MyHashMap.prototype.put = function(key, value) {
    const h = this.hash(key);
    const bucket = this.buckets[h];
    for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
            bucket[i][1] = value;
            return;
        }
    }
    bucket.push([key, value]);
};

MyHashMap.prototype.get = function(key) {
    const h = this.hash(key);
    const bucket = this.buckets[h];
    for (const [k, v] of bucket) {
        if (k === key) return v;
    }
    return -1;
};

MyHashMap.prototype.remove = function(key) {
    const h = this.hash(key);
    this.buckets[h] = this.buckets[h].filter(([k]) => k !== key);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N/B) average, O(N) worst case where N is number of keys |
| **Space** | O(N + B) |

---

## Comparison of Approaches

| Aspect | Direct Addressing | Chaining |
|--------|------------------|----------|
| **Time Complexity** | O(1) | O(N/B) average |
| **Space Complexity** | O(10^6) | O(N) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ (more general) |

**Best Approach:** Use Approach 1 (Direct Addressing) for this problem since keys are bounded.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Google
- **Difficulty**: Easy
- **Concepts Tested**: Hash Map Design, Data Structures, Space-Time Trade-off

### Learning Outcomes

1. **Hash Map Internals**: Understand how hash maps work under the hood
2. **Direct Addressing**: Learn when direct indexing is better than hashing
3. **Space-Time Trade-off**: Master the balance between memory and speed
4. **Sentinel Values**: Learn to use special values for empty indicators

---

## Related Problems

Based on similar themes (Data Structure Design):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design HashSet | [Link](https://leetcode.com/problems/design-hashset/) | Design HashSet |
| Design Linked List | [Link](https://leetcode.com/problems/design-linked-list/) | Linked list design |
| LRU Cache | [Link](https://leetcode.com/problems/lru-cache/) | Cache design |

### Pattern Reference

For more detailed explanations, see:
- **[Data Structure Design](/patterns/data-structures)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Design HashMap](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Hash Map Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding hash maps
3. **[Direct Addressing](https://www.youtube.com/watch?v=8grsX-cB0jU)** - DAT explanation

---

## Follow-up Questions

### Q1: How would you handle a large key range (e.g., 0 to 10^9)?

**Answer:** Use traditional hash map with chaining or open addressing. The hash function would be key % bucket_size, and you'd handle collisions.

---

### Q2: What if you need to store custom objects as keys?

**Answer:** You'd need to implement hashCode() (or equivalent) and equals() for the custom object. The hash function should distribute keys uniformly.

---

### Q3: How does this compare to using Python's built-in dict?

**Answer:** Python's dict is a hash map implementation. For this problem, using direct addressing is simpler and faster because keys are bounded.

---

## Common Pitfalls

### 1. Using wrong array size
**Issue:** Array size too small causes index out of bounds.

**Solution:** Use size 1000001 (10^6 + 1) for keys 0 to 10^6.

### 2. Confusing with real hash map
**Issue:** Trying to implement hashing when direct addressing works.

**Solution:** Direct addressing is simpler and O(1) for bounded keys.

### 3. Sentinel value conflict
**Issue:** -1 might be a valid value.

**Solution:** Problem guarantees values >= 0, so -1 is safe sentinel.

### 4. Space for large key ranges
**Issue:** Very large key ranges waste memory.

**Solution:** Only use when key range is reasonably small.

### 5. Not handling negative keys
**Issue:** Problem specifies non-negative keys only.

**Solution:** Assume non-negative keys per constraints.

---

## Summary

The **Design HashMap** problem demonstrates the **Direct Addressing** pattern:

- **Approach**: Use array index directly as key (when range is bounded)
- **All Operations**: O(1) time complexity
- **Space**: O(10^6) fixed

Key insight: When keys are bounded and known, direct addressing is simpler and faster than traditional hashing.

### Pattern Summary

This problem exemplifies **Direct Addressing**, characterized by:
- Using key directly as array index
- Sentinel-based empty detection
- Space-time trade-off (space for time)

For more details on this pattern, see the **[Data Structure Design](/patterns/data-structures)** pattern.

---

## Additional Resources

- [LeetCode Problem 706](https://leetcode.com/problems/design-hashmap/) - Official problem page
- [Hash Table - Wikipedia](https://en.wikipedia.org/wiki/Hash_table) - Hash table theory
- [Direct Addressing Table](https://en.wikipedia.org/wiki/Array_(data_type)#Direct_addressing) - DAT explanation
- [Pattern: Data Structures](/patterns/data-structures) - Comprehensive pattern guide
