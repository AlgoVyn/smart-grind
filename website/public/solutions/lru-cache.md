# LRU Cache

## Problem Description

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the `LRUCache` class:
- `LRUCache(int capacity)` Initialize the LRU cache with **positive** size `capacity`.
- `int get(int key)` Return the value of the `key` if it exists, otherwise return -1.
- `void put(int key, int value)` Update the value of the `key` if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the `capacity`, evict the least recently used key.

The functions `get` and `put` must each run in O(1) average time complexity.

**Link to problem:** [LRU Cache - LeetCode 146](https://leetcode.com/problems/lru-cache/)

---

## Examples

### Example

**Input:**
```
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
```

**Output:**
```
[null, null, null, 1, null, -1, null, -1, 3, 4]
```

**Explanation:**
- LRUCache capacity = 2
- put(1, 1): cache = {1=1}
- put(2, 2): cache = {1=1, 2=2}
- get(1): returns 1, cache = {2=2, 1=1} (1 moved to end)
- put(3, 3): cache full, evict key 2, cache = {1=1, 3=3}
- get(2): returns -1 (not found)
- put(4, 4): cache full, evict key 1, cache = {3=3, 4=4}
- get(1): returns -1 (not found)
- get(3): returns 3
- get(4): returns 4

---

## Intuition

The key to solving this problem efficiently is maintaining the order of access:

1. **Need for Ordering**: We need to know which items were used most recently vs. least recently

2. **Hash Map alone isn't enough**: While Hash Map gives O(1) lookup, it doesn't maintain any order

3. **Linked List maintains order**: Doubly linked list can maintain items in access order (MRU at head, LRU at tail)

4. **Combined Approach**: Use Hash Map for O(1) lookup + Doubly Linked List for O(1) order management

5. **Operations**:
   - **Get**: Look up in hash map, move node to front (most recently used)
   - **Put**: If key exists, update and move to front; if not, create new node at front; if over capacity, remove from back

## Constraints
- `1 <= capacity <= 3000`
- `1 <= key <= 10^4`
- `0 <= value <= 10^5`
- At most 2 * 10^5 calls will be made to get and put.

---

## Pattern: Hash Map + Doubly Linked List

This problem is a classic example of the **Hash Map + Doubly Linked List** pattern. This combination provides O(1) time for both get and put operations.

### Core Concept

The fundamental idea is:
- **Hash Map**: O(1) lookup by key
- **Doubly Linked List**: O(1) insertion/deletion, maintains order
- **Combined**: Best of both worlds - fast lookup + ordered access

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Hash Map + Doubly Linked List** - O(1) for both get and put (Optimal)
2. **OrderedDict (Python) / LinkedHashMap (Java)** - Using built-in data structures

---

## Approach: Hash Map + Doubly Linked List (Optimal)

This is the optimal approach that achieves O(1) for both get and put.

### Data Structure Design

1. **Hash Map**: Maps key to the node in the linked list
2. **Doubly Linked List**: Nodes in most-recently-used to least-recently-used order
3. **Head/Tail**: Sentinel nodes for easier operations

### Code Implementation

````carousel
```python
class DNode:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        """
        Initialize LRU cache with capacity.
        
        Args:
            capacity: Maximum number of items in cache
        """
        self.capacity = capacity
        self.cache = {}  # key -> DNode
        
        # Sentinel head and tail
        self.head = DNode()
        self.tail = DNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove(self, node):
        """Remove node from list."""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_head(self, node):
        """Add node right after head."""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_head(self, node):
        """Move existing node to head."""
        self._remove(node)
        self._add_to_head(node)
    
    def get(self, key: int) -> int:
        """
        Get value by key, -1 if not found.
        Moves accessed node to head.
        
        Args:
            key: Key to look up
            
        Returns:
            Value or -1
        """
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_head(node)
        return node.value
    
    def put(self, key: int, value: int) -> None:
        """
        Put key-value pair into cache.
        Evicts LRU if over capacity.
        
        Args:
            key: Key to insert/update
            value: Value to store
        """
        if key in self.cache:
            node = self.cache[key]
            node.value = value
            self._move_to_head(node)
        else:
            node = DNode(key, value)
            self.cache[key] = node
            self._add_to_head(node)
            
            if len(self.cache) > self.capacity:
                # Remove LRU (tail.prev)
                tail_prev = self.tail.prev
                self._remove(tail_prev)
                del self.cache[tail_prev.key]
```

<!-- slide -->
```cpp
struct DNode {
    int key;
    int value;
    DNode* prev;
    DNode* next;
    DNode() : key(0), value(0), prev(nullptr), next(nullptr) {}
    DNode(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
private:
    int capacity;
    unordered_map<int, DNode*> cache;
    DNode* head;
    DNode* tail;
    
    void remove(DNode* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    
    void addToHead(DNode* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }
    
    void moveToHead(DNode* node) {
        remove(node);
        addToHead(node);
    }
    
    DNode* removeTail() {
        DNode* node = tail->prev;
        remove(node);
        return node;
    }

public:
    LRUCache(int capacity) : capacity(capacity) {
        head = new DNode();
        tail = new DNode();
        head->next = tail;
        tail->prev = head;
    }
    
    int get(int key) {
        if (cache.find(key) == cache.end()) {
            return -1;
        }
        DNode* node = cache[key];
        moveToHead(node);
        return node->value;
    }
    
    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            DNode* node = cache[key];
            node->value = value;
            moveToHead(node);
        } else {
            DNode* node = new DNode(key, value);
            cache[key] = node;
            addToHead(node);
            
            if (cache.size() > capacity) {
                DNode* tailNode = removeTail();
                cache.erase(tailNode->key);
                delete tailNode;
            }
        }
    }
};
```

<!-- slide -->
```java
class LRUCache {
    private class DNode {
        int key;
        int value;
        DNode prev;
        DNode next;
        DNode() {}
        DNode(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }
    
    private int capacity;
    private Map<Integer, DNode> cache;
    private DNode head, tail;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        head = new DNode();
        tail = new DNode();
        head.next = tail;
        tail.prev = head;
    }
    
    private void addToHead(DNode node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }
    
    private void removeNode(DNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    private void moveToHead(DNode node) {
        removeNode(node);
        addToHead(node);
    }
    
    public int get(int key) {
        DNode node = cache.get(key);
        if (node == null) return -1;
        moveToHead(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        DNode node = cache.get(key);
        if (node == null) {
            node = new DNode(key, value);
            cache.put(key, node);
            addToHead(node);
            if (cache.size() > capacity) {
                DNode tailNode = tail.prev;
                removeNode(tailNode);
                cache.remove(tailNode.key);
            }
        } else {
            node.value = value;
            moveToHead(node);
        }
    }
}
```

<!-- slide -->
```javascript
class LRUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    /**
     * @param {number} key
     * @return {number}
     */
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    
    /**
     * @param {number} key
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Delete first item (least recently used)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) - Both get and put |
| **Space** | O(capacity) |

---

## Approach 2: OrderedDict / LinkedHashMap (Using Built-in)

### Algorithm Steps

1. Use Python's `collections.OrderedDict` or Java's `LinkedHashMap`
2. These data structures maintain insertion order and support move-to-end
3. For get: Check if key exists, move to end if it does, return value or -1
4. For put: If key exists, update and move to end; If cache full, remove first item; Add new item

### Why It Works

OrderedDict maintains the order of key insertions. Moving a key to the end simulates recent access. When the cache is full, removing from the left removes the least recently used item.

### Code Implementation

````carousel
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        """
        Initialize LRU cache with capacity.
        
        Args:
            capacity: Maximum number of items to store
        """
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key: int) -> int:
        """
        Get value by key, moving it to end (most recently used).
        
        Args:
            key: The key to look up
            
        Returns:
            Value if found, -1 otherwise
        """
        if key not in self.cache:
            return -1
        
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        """
        Put key-value pair into cache.
        
        Args:
            key: The key
            value: The value
        """
        if key in self.cache:
            # Update and move to end
            self.cache.move_to_end(key)
        
        self.cache[key] = value
        
        # Evict least recently used if over capacity
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

<!-- slide -->
```java
import java.util.*;

class LRUCache {
    private int capacity;
    private LinkedHashMap<Integer, Integer> cache;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        // accessOrder = true makes it maintain access order
        this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry eldest) {
                return size() > LRUCache.this.capacity;
            }
        };
    }
    
    public int get(int key) {
        return cache.getOrDefault(key, -1);
    }
    
    public void put(int key, int value) {
        cache.put(key, value);
    }
}
```

<!-- slide -->
```javascript
/**
 * LRU Cache using JavaScript Map
 * JavaScript Maps maintain insertion order
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
};

LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) {
        return -1;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
};

LRUCache.prototype.put = function(key, value) {
    if (this.cache.has(key)) {
        // Delete first to update position
        this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
        // Delete least recently used (first item)
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
};
```

<!-- slide -->
```cpp
// C++ doesn't have built-in OrderedDict, use list + unordered_map
class LRUCache {
private:
    int capacity;
    list<pair<int, int>> lru;  // {key, value} in MRU order
    unordered_map<int, list<pair<int, int>>::iterator> cache;
    
public:
    LRUCache(int capacity) {
        this->capacity = capacity;
    }
    
    int get(int key) {
        if (cache.find(key) == cache.end()) {
            return -1;
        }
        
        // Move to front (most recently used)
        auto it = cache[key];
        lru.splice(lru.begin(), lru, it);
        
        return it->second;
    }
    
    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            // Update and move to front
            auto it = cache[key];
            it->second = value;
            lru.splice(lru.begin(), lru, it);
            return;
        }
        
        // Add new entry
        lru.push_front({key, value});
        cache[key] = lru.begin();
        
        // Evict if over capacity
        if (cache.size() > capacity) {
            auto last = lru.end();
            --last;
            cache.erase(last->first);
            lru.erase(last);
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) - Both get and put |
| **Space** | O(capacity) |

---

## Comparison of Approaches

| Aspect | HashMap + Doubly Linked List | OrderedDict / LinkedHashMap |
|--------|------------------------------|----------------------------|
| **Time** | O(1) | O(1) |
| **Space** | O(capacity) | O(capacity) |
| **Implementation** | Custom | Built-in |
| **Pros** | Full control, language agnostic | Simpler code |
| **Cons** | More code to maintain | Language-specific |

---

## Why Hash Map + Linked List

The combination provides:
1. **Hash Map**: O(1) key lookup
2. **Linked List**: O(1) insertion/deletion and ordering
3. **Together**: Best of both worlds

---

## Related Problems

| Problem | LeetCode Link |
|---------|---------------|
| LFU Cache | [Link](https://leetcode.com/problems/lfu-cache/) |
| Design In-Memory File System | [Link](https://leetcode.com/problems/design-in-memory-file-system/) |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - LRU Cache](https://www.youtube.com/watch?v=7uH0rPq8qF0)** - Clear explanation with implementation details
2. **[LRU Cache - LeetCode 146](https://www.youtube.com/watch?v=xDDEcV_yL6Q)** - Detailed walkthrough
3. **[Back to Back SWE - LRU Cache](https://www.youtube.com/watch?v=8hQPLSSjkMY)** - Comprehensive explanation

---

## Follow-up Questions

### Q1: What's the time complexity?

**Answer:** O(1) for both get and put operations.

### Q2: How does the linked list maintain order?

**Answer:** Most recently used items are at the head, least recently used at tail.

### Q3: What's the difference between LRU and LFU?

**Answer:** LRU evicts least recently used, LFU evicts least frequently used.

---

## Common Pitfalls

### 1. Head/Tail Initialization
**Issue**: Not properly initializing dummy head and tail nodes.

**Solution**: Create sentinel nodes to simplify edge case handling for empty cache operations.

### 2. Update on Access
**Issue**: Not moving accessed nodes to head.

**Solution**: Always call move_to_head after get() to mark as recently used.

### 3. Eviction Logic
**Issue**: Not removing LRU node correctly when capacity is exceeded.

**Solution**: Remove tail.prev (the node before dummy tail) when cache is full.

### 4. Key Deletion
**Issue**: Not deleting key from cache when evicting.

**Solution**: Use `del self.cache[tail_prev.key]` to remove the evicted key.

---

## Summary

The **LRU Cache** problem demonstrates the **Hash Map + Doubly Linked List** pattern:
- Hash Map provides O(1) key lookup
- Doubly Linked List provides O(1) insertion/deletion and ordering
- Combined: best of both worlds - fast lookup + ordered access
- O(1) time for both get and put operations

This is a classic system design problem that appears frequently in interviews and real-world applications like cache implementation.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/lru-cache/discuss/)
- [LRU Cache - GeeksforGeeks](https://www.geeksforgeeks.org/lru-cache-implementation/)
