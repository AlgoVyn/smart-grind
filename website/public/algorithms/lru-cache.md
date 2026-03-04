# LRU Cache

## Category
Advanced

## Description

A Least Recently Used (LRU) Cache is a data structure that provides O(1) time complexity for both retrieval and insertion operations while maintaining a fixed capacity. When the cache reaches its capacity, it evicts the least recently accessed item to make room for new entries. This algorithm is fundamental in system design and is used in real-world caching systems like Redis, Memcached, operating system page caches, and browser caches.

---

## When to Use

Use the LRU Cache algorithm when you need to solve problems involving:

- **Fixed-Size Caching**: When you need to store limited items with fast access
- **Recency-Based Eviction**: When least recently used items should be removed first
- **O(1) Operations**: When both get and put operations must be constant time
- **Frequency vs Recency Trade-offs**: When recent access patterns matter more than frequency

### Comparison with Alternatives

| Data Structure | Get Time | Put Time | Eviction Policy | Space Complexity |
|----------------|----------|----------|-----------------|------------------|
| **Hash Map** | O(1) | O(1) | None (unbounded) | O(n) |
| **Linked List** | O(n) | O(1)* | Natural (at ends) | O(n) |
| **LRU Cache** | O(1) | O(1) | Least Recently Used | O(capacity) |
| **LFU Cache** | O(1)* | O(1)* | Least Frequently Used | O(capacity) |
| **FIFO Cache** | O(1) | O(1) | First In First Out | O(capacity) |

*Amortized or with auxiliary data structures

### When to Choose LRU vs Other Cache Policies

- **Choose LRU Cache** when:
  - Recent access patterns are good predictors of future access
  - You need O(1) for both get and put operations
  - Items accessed recently are likely to be accessed again soon

- **Choose LFU Cache** when:
  - Frequency of access matters more than recency
  - Some items are accessed repeatedly over long periods
  - You want to keep "popular" items regardless of when they were last accessed

- **Choose FIFO Cache** when:
  - Simplicity is preferred over optimal hit rate
  - Order of insertion is the primary concern
  - Implementation complexity must be minimized

---

## Algorithm Explanation

### Core Concept

The LRU Cache combines two fundamental data structures to achieve O(1) operations:

1. **Hash Map (Dictionary)**: Provides O(1) lookup to find if a key exists and retrieve its associated node
2. **Doubly Linked List**: Maintains items in order of recency, allowing O(1) removal and insertion at both ends

**Key Insight**: By storing references to linked list nodes in the hash map, we can:
- Locate any item in O(1) time via the hash map
- Move items to the front (most recent) in O(1) time using linked list pointers
- Evict the least recently used item from the tail in O(1) time

### How It Works

#### Data Structure Layout:

```
Hash Map:                    Doubly Linked List (MRU → LRU)
┌─────────┬──────────┐       ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
│   Key   │  Node*   │       │ Head │ ↔  │  K1  │ ↔  │  K2  │ ↔  │ Tail │
├─────────┼──────────┤       │(dummy)│    │ V1   │    │ V2   │    │(dummy)│
│   K1    │  →Node   │       └──────┘    └──────┘    └──────┘    └──────┘
│   K2    │  →Node   │                    ↑ MRU       ↑ LRU
└─────────┴──────────┘
```

#### Operations:

**Get(key)**:
1. Check if key exists in hash map → O(1)
2. If not found, return -1
3. If found:
   - Move the node to front of linked list (mark as recently used) → O(1)
   - Return the value

**Put(key, value)**:
1. If key exists:
   - Update the value in the node
   - Move node to front → O(1)
2. If key doesn't exist:
   - Create new node and add to front → O(1)
   - Add to hash map → O(1)
   - If capacity exceeded:
     - Remove tail node (LRU) from linked list → O(1)
     - Remove corresponding key from hash map → O(1)

### Why Doubly Linked List?

- **O(1) removal**: Given a node reference, we can remove it in constant time by adjusting pointers
- **O(1) add to front**: Can insert at head immediately
- **O(1) remove from tail**: Can access the LRU item directly via tail.prev
- **Bidirectional traversal**: Needed for efficient removal

### Visual Walkthrough

Cache capacity = 2, initial state: `[]`

```
Step 1: put(1, 10)
        [1:10]           HashMap: {1→Node(1,10)}
        ↑
       MRU/LRU

Step 2: put(2, 20)
        [2:20] ↔ [1:10]  HashMap: {1→Node, 2→Node}
         ↑        ↑
        MRU      LRU

Step 3: get(1) → returns 10
        Move 1 to front:
        [1:10] ↔ [2:20]  HashMap unchanged
         ↑        ↑
        MRU      LRU

Step 4: put(3, 30) → Evicts key 2 (LRU)
        [3:30] ↔ [1:10]  HashMap: {1→Node, 3→Node} (removed 2)
         ↑        ↑
        MRU      LRU

Step 5: get(2) → returns -1 (evicted)
```

---

## Algorithm Steps

### Building the LRU Cache

1. **Initialize data structures**:
   - Create empty hash map for key → node lookup
   - Create dummy head and tail nodes for the linked list
   - Set capacity limit

2. **Implement helper operations**:
   - `_remove(node)`: Remove node from linked list by adjusting pointers
   - `_add_to_front(node)`: Insert node right after head (mark as MRU)
   - `_move_to_front(node)`: Combination of remove and add

3. **Implement get operation**:
   - Check hash map for key
   - Return -1 if not found
   - Move found node to front and return value

4. **Implement put operation**:
   - If key exists: update value and move to front
   - If new key: create node, add to front, add to hash map
   - If over capacity: remove tail node and delete from hash map

---

## Implementation

### Template Code (LRU Cache)

````carousel
```python
class DListNode:
    """Doubly linked list node."""
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    """
    Least Recently Used (LRU) cache implementation.
    Uses hashmap + doubly linked list for O(1) operations.
    
    Time Complexities:
        - get: O(1)
        - put: O(1)
    
    Space Complexity: O(capacity)
    """
    
    def __init__(self, capacity: int):
        """
        Initialize LRU cache.
        
        Args:
            capacity: Maximum number of items to store
        """
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail for easy operations
        self.head = DListNode()
        self.tail = DListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove(self, node: DListNode):
        """Remove node from the linked list."""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def _add_to_front(self, node: DListNode):
        """Add node right after head (most recently used)."""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_front(self, node: DListNode):
        """Move existing node to front (most recently used)."""
        self._remove(node)
        self._add_to_front(node)
    
    def get(self, key: int) -> int:
        """
        Get value by key. Returns -1 if not found.
        Marks item as recently used.
        
        Time: O(1)
        """
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_front(node)
        return node.val
    
    def put(self, key: int, value: int):
        """
        Put key-value pair into cache.
        If key exists, update value and mark as recently used.
        If cache is full, evict least recently used item.
        
        Time: O(1)
        """
        if key in self.cache:
            # Update existing node
            node = self.cache[key]
            node.val = value
            self._move_to_front(node)
        else:
            # Create new node
            node = DListNode(key, value)
            self.cache[key] = node
            self._add_to_front(node)
            
            # Evict if over capacity
            if len(self.cache) > self.capacity:
                # Remove from tail (least recently used)
                lru_node = self.tail.prev
                self._remove(lru_node)
                del self.cache[lru_node.key]


# Example usage and demonstration
if __name__ == "__main__":
    cache = LRUCache(2)
    
    print("Operations on LRUCache(capacity=2):")
    print("-" * 40)
    
    cache.put(1, 10)
    print(f"put(1, 10): Cache state: {list(cache.cache.keys())}")
    
    cache.put(2, 20)
    print(f"put(2, 20): Cache state: {list(cache.cache.keys())}")
    
    val = cache.get(1)
    print(f"get(1) = {val}: Accessed key 1, moved to MRU")
    
    cache.put(3, 30)
    print(f"put(3, 30): Evicted key 2, Cache state: {list(cache.cache.keys())}")
    
    val = cache.get(2)
    print(f"get(2) = {val}: Key 2 was evicted")
    
    val = cache.get(3)
    print(f"get(3) = {val}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <unordered_map>
using namespace std;

/**
 * Doubly Linked List Node
 */
struct DListNode {
    int key;
    int val;
    DListNode* prev;
    DListNode* next;
    
    DListNode(int k = 0, int v = 0) 
        : key(k), val(v), prev(nullptr), next(nullptr) {}
};

/**
 * LRU Cache Implementation
 * 
 * Time Complexities:
 *     - get: O(1)
 *     - put: O(1)
 * 
 * Space Complexity: O(capacity)
 */
class LRUCache {
private:
    int capacity;
    unordered_map<int, DListNode*> cache;
    DListNode* head;  // Dummy head (MRU side)
    DListNode* tail;  // Dummy tail (LRU side)
    
    void remove(DListNode* node) {
        DListNode* prevNode = node->prev;
        DListNode* nextNode = node->next;
        prevNode->next = nextNode;
        nextNode->prev = prevNode;
    }
    
    void addToFront(DListNode* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }
    
    void moveToFront(DListNode* node) {
        remove(node);
        addToFront(node);
    }

public:
    LRUCache(int cap) : capacity(cap) {
        head = new DListNode();
        tail = new DListNode();
        head->next = tail;
        tail->prev = head;
    }
    
    ~LRUCache() {
        // Clean up all nodes
        DListNode* curr = head;
        while (curr) {
            DListNode* next = curr->next;
            delete curr;
            curr = next;
        }
    }
    
    int get(int key) {
        if (cache.find(key) == cache.end()) {
            return -1;
        }
        
        DListNode* node = cache[key];
        moveToFront(node);
        return node->val;
    }
    
    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            // Update existing
            DListNode* node = cache[key];
            node->val = value;
            moveToFront(node);
        } else {
            // Create new node
            DListNode* node = new DListNode(key, value);
            cache[key] = node;
            addToFront(node);
            
            // Evict if necessary
            if (cache.size() > capacity) {
                DListNode* lru = tail->prev;
                remove(lru);
                cache.erase(lru->key);
                delete lru;
            }
        }
    }
};

int main() {
    LRUCache cache(2);
    
    cout << "Operations on LRUCache(capacity=2):" << endl;
    cout << string(40, '-') << endl;
    
    cache.put(1, 10);
    cout << "put(1, 10): Cache contains keys 1" << endl;
    
    cache.put(2, 20);
    cout << "put(2, 20): Cache contains keys 1, 2" << endl;
    
    cout << "get(1) = " << cache.get(1) << ": Accessed key 1, moved to MRU" << endl;
    
    cache.put(3, 30);
    cout << "put(3, 30): Evicted key 2" << endl;
    
    cout << "get(2) = " << cache.get(2) << ": Key 2 was evicted" << endl;
    cout << "get(3) = " << cache.get(3) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

/**
 * Doubly Linked List Node
 */
class DListNode {
    int key;
    int val;
    DListNode prev;
    DListNode next;
    
    DListNode() {}
    
    DListNode(int key, int val) {
        this.key = key;
        this.val = val;
    }
}

/**
 * LRU Cache Implementation
 * 
 * Time Complexities:
 *     - get: O(1)
 *     - put: O(1)
 * 
 * Space Complexity: O(capacity)
 */
public class LRUCache {
    private int capacity;
    private Map<Integer, DListNode> cache;
    private DListNode head;  // Dummy head (MRU side)
    private DListNode tail;  // Dummy tail (LRU side)
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        
        // Initialize dummy head and tail
        head = new DListNode();
        tail = new DListNode();
        head.next = tail;
        tail.prev = head;
    }
    
    private void remove(DListNode node) {
        DListNode prevNode = node.prev;
        DListNode nextNode = node.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }
    
    private void addToFront(DListNode node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }
    
    private void moveToFront(DListNode node) {
        remove(node);
        addToFront(node);
    }
    
    public int get(int key) {
        if (!cache.containsKey(key)) {
            return -1;
        }
        
        DListNode node = cache.get(key);
        moveToFront(node);
        return node.val;
    }
    
    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            // Update existing
            DListNode node = cache.get(key);
            node.val = value;
            moveToFront(node);
        } else {
            // Create new node
            DListNode node = new DListNode(key, value);
            cache.put(key, node);
            addToFront(node);
            
            // Evict if necessary
            if (cache.size() > capacity) {
                DListNode lru = tail.prev;
                remove(lru);
                cache.remove(lru.key);
            }
        }
    }
    
    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        
        System.out.println("Operations on LRUCache(capacity=2):");
        System.out.println("-".repeat(40));
        
        cache.put(1, 10);
        System.out.println("put(1, 10): Cache contains key 1");
        
        cache.put(2, 20);
        System.out.println("put(2, 20): Cache contains keys 1, 2");
        
        System.out.println("get(1) = " + cache.get(1) + ": Accessed key 1");
        
        cache.put(3, 30);
        System.out.println("put(3, 30): Evicted key 2");
        
        System.out.println("get(2) = " + cache.get(2) + ": Key 2 was evicted");
        System.out.println("get(3) = " + cache.get(3));
    }
}
```

<!-- slide -->
```javascript
/**
 * Doubly Linked List Node
 */
class DListNode {
    constructor(key = 0, val = 0) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

/**
 * LRU Cache Implementation
 * 
 * Time Complexities:
 *     - get: O(1)
 *     - put: O(1)
 * 
 * Space Complexity: O(capacity)
 */
class LRUCache {
    /**
     * @param {number} capacity - Maximum number of items
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // key -> node
        
        // Dummy head and tail
        this.head = new DListNode();
        this.tail = new DListNode();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    /**
     * Remove node from linked list
     * @param {DListNode} node
     * @private
     */
    _remove(node) {
        const prevNode = node.prev;
        const nextNode = node.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }
    
    /**
     * Add node to front (after head)
     * @param {DListNode} node
     * @private
     */
    _addToFront(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }
    
    /**
     * Move existing node to front
     * @param {DListNode} node
     * @private
     */
    _moveToFront(node) {
        this._remove(node);
        this._addToFront(node);
    }
    
    /**
     * Get value by key
     * @param {number} key
     * @returns {number} Value or -1 if not found
     * 
     * Time: O(1)
     */
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        
        const node = this.cache.get(key);
        this._moveToFront(node);
        return node.val;
    }
    
    /**
     * Put key-value pair into cache
     * @param {number} key
     * @param {number} value
     * 
     * Time: O(1)
     */
    put(key, value) {
        if (this.cache.has(key)) {
            // Update existing
            const node = this.cache.get(key);
            node.val = value;
            this._moveToFront(node);
        } else {
            // Create new node
            const node = new DListNode(key, value);
            this.cache.set(key, node);
            this._addToFront(node);
            
            // Evict if necessary
            if (this.cache.size > this.capacity) {
                const lru = this.tail.prev;
                this._remove(lru);
                this.cache.delete(lru.key);
            }
        }
    }
}

// Example usage
const cache = new LRUCache(2);

console.log("Operations on LRUCache(capacity=2):");
console.log("-".repeat(40));

cache.put(1, 10);
console.log("put(1, 10): Cache contains key 1");

cache.put(2, 20);
console.log("put(2, 20): Cache contains keys 1, 2");

console.log("get(1) =", cache.get(1), ": Accessed key 1");

cache.put(3, 30);
console.log("put(3, 30): Evicted key 2");

console.log("get(2) =", cache.get(2), ": Key 2 was evicted");
console.log("get(3) =", cache.get(3));
```
````

---

## Example Walkthrough

**Input:**
```
LRUCache capacity = 2
Operations:
  1. put(1, 1)
  2. put(2, 2)
  3. get(1)     -> returns 1
  4. put(3, 3)  -> evicts key 2
  5. get(2)     -> returns -1
  6. put(4, 4)  -> evicts key 1
  7. get(1)     -> returns -1
  8. get(3)     -> returns 3
  9. get(4)     -> returns 4
```

**Step-by-Step Execution:**

| Step | Operation | Cache State (MRU → LRU) | Evicted | Output |
|------|-----------|------------------------|---------|--------|
| 1 | put(1, 1) | [1] | - | - |
| 2 | put(2, 2) | [2, 1] | - | - |
| 3 | get(1) | [1, 2] | - | 1 |
| 4 | put(3, 3) | [3, 1] | 2 | - |
| 5 | get(2) | [3, 1] | - | -1 |
| 6 | put(4, 4) | [4, 3] | 1 | - |
| 7 | get(1) | [4, 3] | - | -1 |
| 8 | get(3) | [3, 4] | - | 3 |
| 9 | get(4) | [4, 3] | - | 4 |

**Key Observations:**
- After `get(1)`, key 1 becomes MRU (most recently used)
- When putting key 3 at capacity, key 2 (LRU) is evicted
- Key 2 and key 1 are permanently gone after eviction

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **get** | O(1) | Hash map lookup + linked list pointer updates |
| **put** | O(1) | Hash map operations + linked list pointer updates |
| **evict** | O(1) | Remove tail node and hash map entry |

### Detailed Breakdown

**Get Operation:**
- Hash map lookup: O(1) average case
- Move to front (3 pointer updates): O(1)
- **Total: O(1)**

**Put Operation:**
- Hash map lookup/insertion: O(1) average case
- Linked list operations (add/move): O(1)
- Possible eviction (remove tail): O(1)
- **Total: O(1)**

**Why O(1)?**
- Hash map provides direct access to any node
- Doubly linked list allows O(1) removal/insertion with node reference
- No iteration or searching required

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Hash Map** | O(capacity) | Stores at most `capacity` key-node pairs |
| **Linked List** | O(capacity) | Stores at most `capacity` nodes |
| **Total** | O(capacity) | Linear in cache capacity |

### Space Considerations

- **Fixed upper bound**: Space never exceeds O(capacity)
- **Overhead**: Each entry has hash map overhead + two pointer overhead in linked list
- **Capacity = 0**: Edge case, cache should reject all puts
- **Large capacities**: Consider memory constraints in embedded systems

---

## Common Variations

### 1. LFU (Least Frequently Used) Cache

Evicts the least frequently accessed item, not just the oldest.

````carousel
```python
class LFUCache:
    """
    LFU Cache - Evicts least frequently used item.
    Uses: key->value, key->freq, freq->keys (ordered dict)
    
    Time: O(1) for get and put
    Space: O(capacity)
    """
    from collections import defaultdict, OrderedDict
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.min_freq = 0
        self.key_to_val = {}  # key -> value
        self.key_to_freq = {}  # key -> frequency
        self.freq_to_keys = defaultdict(OrderedDict)  # freq -> {key: None}
    
    def get(self, key: int) -> int:
        if key not in self.key_to_val:
            return -1
        
        self._increase_freq(key)
        return self.key_to_val[key]
    
    def put(self, key: int, value: int):
        if self.capacity <= 0:
            return
        
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self._increase_freq(key)
            return
        
        # Evict if at capacity
        if len(self.key_to_val) >= self.capacity:
            self._evict_lfu()
        
        # Add new key
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1][key] = None
        self.min_freq = 1
    
    def _increase_freq(self, key: int):
        freq = self.key_to_freq[key]
        self.key_to_freq[key] = freq + 1
        
        # Remove from old freq list
        del self.freq_to_keys[freq][key]
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1
        
        # Add to new freq list
        self.freq_to_keys[freq + 1][key] = None
    
    def _evict_lfu(self):
        # Evict oldest key with min frequency
        key, _ = self.freq_to_keys[self.min_freq].popitem(last=False)
        del self.key_to_val[key]
        del self.key_to_freq[key]
```
````

### 2. LRU Cache with TTL (Time To Live)

Items expire after a certain time regardless of access.

````carousel
```python
import time

class TTLNode:
    def __init__(self, key, val, expiry):
        self.key = key
        self.val = val
        self.expiry = expiry  # Timestamp when item expires
        self.prev = None
        self.next = None

class TTLRUCache:
    """LRU Cache with Time-To-Live support."""
    
    def __init__(self, capacity: int, default_ttl: int = 60):
        self.capacity = capacity
        self.default_ttl = default_ttl  # seconds
        self.cache = {}
        self.head = TTLNode(0, 0, 0)
        self.tail = TTLNode(0, 0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        if time.time() > node.expiry:
            # Item expired
            self._remove(node)
            del self.cache[key]
            return -1
        
        self._move_to_front(node)
        return node.val
    
    def put(self, key: int, value: int, ttl: int = None):
        ttl = ttl or self.default_ttl
        expiry = time.time() + ttl
        
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            node.expiry = expiry
            self._move_to_front(node)
        else:
            node = TTLNode(key, value, expiry)
            self.cache[key] = node
            self._add_to_front(node)
            
            if len(self.cache) > self.capacity:
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_front(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_front(self, node):
        self._remove(node)
        self._add_to_front(node)
```
````

### 3. Thread-Safe LRU Cache

Concurrent access safe implementation using locks.

````carousel
```python
from threading import RLock

class ThreadSafeLRUCache:
    """Thread-safe LRU Cache using RLock."""
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = DListNode()
        self.tail = DListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
        self.lock = RLock()
    
    def get(self, key: int) -> int:
        with self.lock:
            if key not in self.cache:
                return -1
            node = self.cache[key]
            self._move_to_front(node)
            return node.val
    
    def put(self, key: int, value: int):
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                node.val = value
                self._move_to_front(node)
            else:
                node = DListNode(key, value)
                self.cache[key] = node
                self._add_to_front(node)
                
                if len(self.cache) > self.capacity:
                    lru = self.tail.prev
                    self._remove(lru)
                    del self.cache[lru.key]
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_front(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_front(self, node):
        self._remove(node)
        self._add_to_front(node)
```
````

### 4. LRU Cache Using OrderedDict (Python Only)

Simplified implementation using Python's OrderedDict.

````carousel
```python
from collections import OrderedDict

class SimpleLRUCache:
    """
    Simple LRU Cache using OrderedDict.
    Python 3.7+ maintains insertion order in dict, but OrderedDict
    provides move_to_end() which is convenient.
    """
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int):
        if key in self.cache:
            # Update and move to end
            self.cache.move_to_end(key)
        self.cache[key] = value
        
        # Evict oldest if over capacity
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```
````

---

## Practice Problems

### Problem 1: Basic LRU Cache

**Problem:** [LeetCode 146 - LRU Cache](https://leetcode.com/problems/lru-cache/)

**Description:** Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class with O(1) time complexity for get and put operations.

**Key Concepts:**
- Hash map + doubly linked list combination
- O(1) get and put operations
- Capacity-based eviction

---

### Problem 2: LFU Cache

**Problem:** [LeetCode 460 - LFU Cache](https://leetcode.com/problems/lfu-cache/)

**Description:** Design and implement a data structure for a Least Frequently Used (LFU) cache. When the cache reaches capacity, invalidate the least frequently used key before inserting.

**Key Concepts:**
- Multiple frequency buckets
- Maintaining min frequency
- O(1) operations with auxiliary data structures

---

### Problem 3: Design In-Memory File System

**Problem:** [LeetCode 588 - Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system/)

**Description:** Design an in-memory file system to simulate the following functions: ls, mkdir, addContentToFile, readContentFromFile. You can use LRU caching for file content.

**Key Concepts:**
- Tree structure for directories
- LRU cache for file contents
- Path parsing and traversal

---

### Problem 4: Logger Rate Limiter

**Problem:** [LeetCode 359 - Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter/)

**Description:** Design a logger system that receives a stream of messages along with their timestamps. Each unique message should only be printed at most every 10 seconds.

**Key Concepts:**
- Time-based eviction similar to LRU
- Hash map with timestamp tracking
- Simple cache invalidation logic

---

### Problem 5: Design Browser History

**Problem:** [LeetCode 1472 - Design Browser History](https://leetcode.com/problems/design-browser-history/)

**Description:** You have a browser with one tab where you start on the homepage. You can visit a new URL, go back in history, or go forward in history. Implement the BrowserHistory class.

**Key Concepts:**
- Doubly linked list pattern (similar to LRU)
- Navigation with back/forward pointers
- Truncation on new visits

---

## Video Tutorial Links

### Fundamentals

- [LRU Cache Implementation (NeetCode)](https://www.youtube.com/watch?v=7ABFKPK2hD4) - Detailed walkthrough of hash map + linked list approach
- [LRU Cache Data Structure (Tech With Tim)](https://www.youtube.com/watch?v=0PSB9y8ehbk) - Python implementation tutorial
- [Cache Eviction Policies (ByteByteGo)](https://www.youtube.com/watch?v=4d1z82Vg6MQ) - LRU, LFU, and FIFO comparison

### Advanced Topics

- [Design LRU Cache System Design](https://www.youtube.com/watch?v=S6IfqDXWa10) - Real-world distributed cache design
- [Redis LRU Implementation](https://www.youtube.com/watch?v=G39PpCsyyjA) - How Redis implements LRU
- [LFU vs LRU Cache](https://www.youtube.com/watch?v=3bQTTF9p8rI) - When to use which eviction policy

---

## Follow-up Questions

### Q1: Why use a doubly linked list instead of a singly linked list?

**Answer:** A doubly linked list is necessary because:
- **O(1) removal**: When we have a reference to a node (from the hash map), we need to remove it from its current position. With a singly linked list, we'd need to traverse from head to find the previous node, making it O(n).
- **Tail access**: We need direct access to both ends (head for MRU, tail for LRU). A doubly linked list with dummy nodes gives us this in O(1).
- **Pointer updates**: Moving a node requires updating 4 pointers (prev.next, next.prev, node's prev, node's next), which is only possible with bidirectional links.

### Q2: Can we implement LRU Cache with O(1) operations using a single data structure?

**Answer:** No, a single standard data structure cannot provide O(1) for both operations:
- **Hash Map alone**: Provides O(1) lookup but cannot track recency order
- **Linked List alone**: Can track order but O(n) lookup
- **Specialized structures**: Some languages offer ordered dictionaries (Python's OrderedDict, Java's LinkedHashMap) that internally use both structures, abstracting the complexity
- **Alternative**: In Python, `functools.lru_cache` decorator provides automatic LRU caching for function results

### Q3: What happens if capacity is set to 0?

**Answer:** With capacity = 0:
- The cache should not store any items
- `get()` should always return -1 (or null/undefined)
- `put()` should be a no-op (or immediately evict)
- This is an edge case that should be handled in initialization or operations
- Implementation tip: Add a guard clause `if capacity <= 0: return` in put operations

### Q4: How would you implement an LRU Cache for a distributed system?

**Answer:** Distributed LRU Cache considerations:
1. **Consistency**: Use write-through or write-back strategies with replication
2. **Sharding**: Partition data across multiple cache servers (consistent hashing)
3. **Eviction coordination**: Broadcast eviction events or use a centralized coordinator
4. **Clock synchronization**: Ensure consistent LRU ordering across nodes
5. **Popular solutions**: Redis Cluster, Memcached with consistent hashing, or custom implementations with gossip protocols

### Q5: What's the difference between LRU and LFU, and when should each be used?

**Answer:**

| Aspect | LRU | LFU |
|--------|-----|-----|
| **Eviction** | Removes least recently accessed | Removes least frequently accessed |
| **Best for** | Temporal locality (recent = likely soon) | Popularity (frequent = important) |
| **Memory** | Simpler (one counter: recency) | Complex (frequency buckets + recency tie-breaker) |
| **Problem** | Can evict frequently accessed items if accessed long ago | Can retain items that were popular but no longer needed |
| **Example** | Browser cache, OS page cache | CDN caching, database query cache |

**Hybrid approach**: Some systems use LFRU (Least Frequently/Recently Used) that combines both metrics.

---

## Summary

The LRU Cache is a fundamental data structure that provides **O(1) time complexity** for both retrieval and insertion while maintaining a fixed capacity with **recency-based eviction**. Key takeaways:

- **Two-data-structure approach**: Hash map for O(1) lookup + doubly linked list for O(1) order maintenance
- **O(1) operations**: Both get and put are constant time
- **Eviction policy**: Removes least recently used item when capacity is exceeded
- **Real-world applications**: Browser caches, OS page caches, Redis, Memcached, CDNs

When to use:
- ✅ Need fast O(1) get and put operations
- ✅ Limited memory/capacity requires eviction
- ✅ Recent access patterns predict future access (temporal locality)
- ✅ System design problems involving caching layers

When NOT to use:
- ❌ Frequency matters more than recency (use LFU)
- ❌ Simple FIFO suffices (use queue)
- ❌ Unbounded storage available (use hash map only)

This data structure is essential for technical interviews (especially at FAANG companies) and real-world system design, appearing frequently in problems related to caching, operating systems, and distributed systems.

---

## Related Algorithms

- [LFU Cache](./lfu-cache.md) - Frequency-based eviction
- [FIFO Cache](./fifo-cache.md) - First-in-first-out eviction
- [Hash Map](./hash-map.md) - Underlying lookup structure
- [Linked List](./linked-list.md) - Underlying order maintenance
