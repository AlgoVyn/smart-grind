# LRU Cache

## Category
Advanced

## Description

The LRU (Least Recently Used) Cache is a data structure that provides O(1) time complexity for both retrieval and insertion operations while maintaining a fixed capacity. When the cache reaches its capacity, it evicts the least recently accessed item to make room for new entries. This algorithm is fundamental in system design and is used in real-world caching systems like Redis, Memcached, operating system page caches, and browser caches.

This pattern combines two fundamental data structures - a hash map for O(1) lookup and a doubly linked list for O(1) order maintenance. Understanding this algorithm is essential for technical interviews at major tech companies and for designing performant systems.

---

## Concepts

The LRU Cache is built on several fundamental concepts that enable its efficient operations.

### 1. Recency Tracking

The cache must track access order to identify which item is least recently used:

| Tracking Method | Time Complexity | Space Complexity | Implementation |
|-----------------|-----------------|------------------|----------------|
| **Linked List** | O(1) move | O(n) | Doubly linked with head/tail |
| **Timestamp** | O(1) update | O(n) | Unix timestamp per entry |
| **Counter** | O(1) update | O(n) | Incrementing access counter |
| **Array** | O(n) shift | O(n) | Linear scan for LRU |

### 2. Fast Lookup

Hash map provides O(1) access to any cached item:

- **Key → Node Reference**: Direct pointer to linked list node
- **Eliminates Search**: No traversal needed to find items
- **Critical Integration**: Enables O(1) move-to-front operation

### 3. Eviction Policy

When cache is full and new item arrives:

```
1. Check if key exists → Update value, move to front
2. If new key → Create node, add to front
3. If capacity exceeded → Remove tail node (LRU)
4. Return value or -1 for cache miss
```

### 4. Memory Management

Considerations for production systems:

| Aspect | Strategy | Trade-off |
|--------|----------|-----------|
| **Fixed Capacity** | Hard limit at initialization | Predictable memory |
| **Dynamic Growth** | Expand under load | Risk of OOM |
| **TTL Support** | Time-based expiration | Additional complexity |
| **Lazy Eviction** | Clean on access | Delayed cleanup |

---

## Frameworks

Structured approaches for implementing LRU Cache.

### Framework 1: Hash Map + Doubly Linked List

```
┌─────────────────────────────────────────────────────┐
│  LRU CACHE FRAMEWORK (Hash Map + Linked List)       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Data Structures:                                   │
│  ┌─────────────┐      ┌─────────────────────────┐   │
│  │ Hash Map    │      │ Doubly Linked List      │   │
│  │ Key→Node    │      │ Head ↔ ... ↔ Tail       │   │
│  └─────────────┘      └─────────────────────────┘   │
│                                                     │
│  Operations:                                        │
│  1. GET(key):                                       │
│     - Lookup in hash map → O(1)                     │
│     - Move node to front → O(1)                     │
│     - Return value                                  │
│                                                     │
│  2. PUT(key, value):                                │
│     - If exists: update, move to front → O(1)       │
│     - If new: create node, add to front → O(1)      │
│     - If full: remove tail, evict from map → O(1)   │
│                                                     │
│  Helper Methods:                                    │
│  - _remove(node): Unlink from current position      │
│  - _add_to_front(node): Insert after head           │
│  - _move_to_front(node): Remove + Add to front     │
└─────────────────────────────────────────────────────┘
```

### Framework 2: Ordered Dictionary (Python)

```
┌─────────────────────────────────────────────────────┐
│  LRU CACHE FRAMEWORK (OrderedDict)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Python's collections.OrderedDict:                  │
│  - Maintains insertion order                        │
│  - move_to_end(key) for marking recent            │
│  - popitem(last=False) for LRU eviction            │
│                                                     │
│  Operations:                                        │
│  1. GET(key):                                       │
│     - if key in cache: cache.move_to_end(key)       │
│     - return cache.get(key, -1)                     │
│                                                     │
│  2. PUT(key, value):                                │
│     - if key in cache: cache.move_to_end(key)       │
│     - cache[key] = value                            │
│     - if len(cache) > capacity:                     │
│         cache.popitem(last=False)  # Remove LRU     │
│                                                     │
│  Trade-offs:                                        │
│  + Simpler implementation                           │
│  + No custom node class needed                      │
│  - Less control over internals                      │
│  - Language-specific (Python only)                  │
└─────────────────────────────────────────────────────┘
```

### Framework 3: LFU Extension Pattern

```
┌─────────────────────────────────────────────────────┐
│  LFU CACHE FRAMEWORK (Frequency-Based)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Data Structures:                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Key→Value   │  │ Key→Freq    │  │ Freq→Keys  │  │
│  │ (Hash Map)  │  │ (Hash Map)  │  │ (Ordered)  │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                     │
│  Operations:                                        │
│  1. GET(key):                                       │
│     - Increment frequency                           │
│     - Move to higher frequency bucket               │
│     - Update min_freq if needed                     │
│                                                     │
│  2. PUT(key, value):                                │
│     - If full: evict from min_freq bucket           │
│     - Add new key with frequency = 1                │
│     - Set min_freq = 1                              │
│                                                     │
│  Eviction: Remove least frequent, then oldest      │
└─────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the LRU Cache pattern.

### Form 1: Standard LRU Cache

Fixed capacity with recency-based eviction.

| Component | Implementation | Purpose |
|-----------|----------------|---------|
| **Hash Map** | dict / unordered_map | O(1) key lookup |
| **Linked List** | Doubly linked | O(1) move/remove |
| **Dummy Nodes** | Head and Tail sentinels | Simplify edge cases |
| **Node Storage** | Key, Value, Prev, Next | Complete cache entry |

### Form 2: LRU with TTL (Time To Live)

Items expire after a specified time regardless of access.

| Feature | Implementation | Consideration |
|---------|----------------|---------------|
| **Expiry Tracking** | Timestamp per node | Unix time or datetime |
| **Lazy Expiration** | Check on access | Simple but stale data possible |
| **Active Cleanup** | Background thread | More complex, prevents staleness |
| **TTL per Item** | Configurable duration | Default + custom per key |

### Form 3: Size-Based LRU

Eviction based on total memory size, not item count.

```
Traditional LRU:     Size-Based LRU:
capacity = 3         max_size = 100 bytes
items = 3            items = variable

[A:10B]              [A:30B]
[B:20B]              [B:40B]
[C:30B]              [C:30B] ← total 100B

Add D:25B:           Add D:40B:
→ Evict A            → Cannot add (would exceed)
→ Or reject D        → Or evict A+B to fit D
```

### Form 4: Multi-Level LRU (L1/L2 Cache)

Hierarchical caching with different speeds.

| Level | Speed | Size | Eviction Policy |
|-------|-------|------|-----------------|
| **L1 (Hot)** | Fastest (In-Memory) | Small | LRU |
| **L2 (Warm)** | Medium (Local Disk) | Medium | LRU |
| **L3 (Cold)** | Slow (Network/DB) | Large | FIFO or LRU |

### Form 5: Distributed LRU

Cache shared across multiple servers.

| Approach | Consistency | Complexity | Use Case |
|----------|-------------|------------|----------|
| **Consistent Hashing** | Eventual | Medium | Sharded cache |
| **Replicated** | Strong | High | Small cluster |
| **Single Writer** | Strong | Low | Single cache server |

---

## Tactics

Specific techniques and optimizations for LRU Cache.

### Tactic 1: Dummy Head and Tail Pattern

Eliminate null checks with sentinel nodes:

```python
class DListNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        
        # Dummy head and tail - never removed
        self.head = DListNode()
        self.tail = DListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
```

**Benefits:**
- No null checks in `_remove()` or `_add_to_front()`
- `_move_to_front()` always has valid neighbors
- Simpler, cleaner code with fewer edge cases

### Tactic 2: Move-to-Front Optimization

Combine remove and add operations efficiently:

```python
def _move_to_front(self, node: DListNode):
    """Move existing node to front in O(1)."""
    # Remove from current position
    prev_node = node.prev
    next_node = node.next
    prev_node.next = next_node
    next_node.prev = prev_node
    
    # Add to front
    node.prev = self.head
    node.next = self.head.next
    self.head.next.prev = node
    self.head.next = node
```

**Key Points:**
- 4 pointer updates for removal
- 4 pointer updates for insertion
- Total 8 operations, all O(1)

### Tactic 3: Reference Equality Check for XOR Swap Safety

When using XOR swap (if applicable), ensure different memory locations:

```python
def _remove(self, node: DListNode):
    """Remove node with safety check (if using XOR swap)."""
    # Standard approach (always safe):
    prev_node = node.prev
    next_node = node.next
    prev_node.next = next_node
    next_node.prev = prev_node
    
    # XOR swap would fail if prev == next (should never happen with dummy nodes)
```

### Tactic 4: Capacity Zero Handling

Handle edge case of zero capacity gracefully:

```python
def put(self, key: int, value: int):
    """Handle zero capacity as no-op."""
    if self.capacity <= 0:
        return
    
    # Rest of implementation...
```

### Tactic 5: Thread Safety with RLock

Make LRU Cache thread-safe for concurrent access:

```python
from threading import RLock

class ThreadSafeLRUCache:
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
            # ... implementation
```

### Tactic 6: LRU Cache for Function Memoization

Decorator pattern for automatic function result caching:

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    """LRU cache handles memoization automatically."""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Manual implementation for learning:
class MemoizeLRU:
    def __init__(self, func, capacity=128):
        self.func = func
        self.cache = LRUCache(capacity)
    
    def __call__(self, *args):
        key = str(args)
        result = self.cache.get(key)
        if result == -1:
            result = self.func(*args)
            self.cache.put(key, result)
        return result
```

---

## Python Templates

### Template 1: Complete LRU Cache Implementation

```python
class DListNode:
    """Doubly linked list node for LRU Cache."""
    def __init__(self, key: int = 0, val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    """
    Least Recently Used (LRU) cache implementation.
    Uses hashmap + doubly linked list for O(1) operations.
    
    Time: O(1) for get and put
    Space: O(capacity)
    """
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail for easy operations
        self.head = DListNode()
        self.tail = DListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove(self, node: DListNode) -> None:
        """Remove node from linked list."""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def _add_to_front(self, node: DListNode) -> None:
        """Add node right after head (most recently used)."""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_front(self, node: DListNode) -> None:
        """Move existing node to front."""
        self._remove(node)
        self._add_to_front(node)
    
    def get(self, key: int) -> int:
        """Get value by key. Returns -1 if not found."""
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_front(node)
        return node.val
    
    def put(self, key: int, value: int) -> None:
        """Put key-value pair into cache."""
        if self.capacity <= 0:
            return
        
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_front(node)
        else:
            node = DListNode(key, value)
            self.cache[key] = node
            self._add_to_front(node)
            
            if len(self.cache) > self.capacity:
                lru_node = self.tail.prev
                self._remove(lru_node)
                del self.cache[lru_node.key]
```

### Template 2: Simplified OrderedDict LRU

```python
from collections import OrderedDict

class LRUCacheOrderedDict:
    """
    LRU Cache using OrderedDict (Python 3.7+).
    Simpler but less control over internals.
    
    Time: O(1) for get and put
    Space: O(capacity)
    """
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        """Get value by key. Returns -1 if not found."""
        if key not in self.cache:
            return -1
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        """Put key-value pair into cache."""
        if key in self.cache:
            self.cache.move_to_end(key)
        
        self.cache[key] = value
        
        if len(self.cache) > self.capacity:
            # Remove first item (least recently used)
            self.cache.popitem(last=False)
```

### Template 3: LFU Cache Implementation

```python
from collections import defaultdict, OrderedDict

class LFUCache:
    """
    Least Frequently Used (LFU) cache.
    Evicts least frequently used item when full.
    
    Time: O(1) for get and put
    Space: O(capacity)
    """
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.min_freq = 0
        self.key_to_val = {}  # key -> value
        self.key_to_freq = {}  # key -> frequency
        # freq -> {key: None} (OrderedDict for LRU within same freq)
        self.freq_to_keys = defaultdict(OrderedDict)
    
    def get(self, key: int) -> int:
        """Get value by key. Returns -1 if not found."""
        if key not in self.key_to_val:
            return -1
        
        self._increase_freq(key)
        return self.key_to_val[key]
    
    def put(self, key: int, value: int) -> None:
        """Put key-value pair into cache."""
        if self.capacity <= 0:
            return
        
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self._increase_freq(key)
            return
        
        # Evict if at capacity
        if len(self.key_to_val) >= self.capacity:
            self._evict_lfu()
        
        # Add new key with frequency 1
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1][key] = None
        self.min_freq = 1
    
    def _increase_freq(self, key: int) -> None:
        """Increase frequency of key."""
        freq = self.key_to_freq[key]
        self.key_to_freq[key] = freq + 1
        
        # Remove from old frequency list
        del self.freq_to_keys[freq][key]
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1
        
        # Add to new frequency list
        self.freq_to_keys[freq + 1][key] = None
    
    def _evict_lfu(self) -> None:
        """Evict least frequently used item."""
        # Remove oldest key with minimum frequency
        key, _ = self.freq_to_keys[self.min_freq].popitem(last=False)
        del self.key_to_val[key]
        del self.key_to_freq[key]
```

### Template 4: LRU Cache with TTL Support

```python
import time
from typing import Optional

class TTLNode:
    """Node with time-to-live support."""
    def __init__(self, key: int, val: int, expiry: float):
        self.key = key
        self.val = val
        self.expiry = expiry
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
    
    def _remove(self, node: TTLNode) -> None:
        """Remove node from linked list."""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_front(self, node: TTLNode) -> None:
        """Add node to front (most recent)."""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def get(self, key: int) -> int:
        """Get value, checking expiry first."""
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        if time.time() > node.expiry:
            # Item expired
            self._remove(node)
            del self.cache[key]
            return -1
        
        # Update expiry on access (optional)
        node.expiry = time.time() + self.default_ttl
        self._remove(node)
        self._add_to_front(node)
        return node.val
    
    def put(self, key: int, value: int, ttl: Optional[int] = None) -> None:
        """Put with optional custom TTL."""
        ttl = ttl or self.default_ttl
        expiry = time.time() + ttl
        
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            node.expiry = expiry
            self._remove(node)
            self._add_to_front(node)
        else:
            node = TTLNode(key, value, expiry)
            self.cache[key] = node
            self._add_to_front(node)
            
            if len(self.cache) > self.capacity:
                # Remove expired items first
                self._cleanup_expired()
                
                if len(self.cache) > self.capacity:
                    lru = self.tail.prev
                    self._remove(lru)
                    del self.cache[lru.key]
    
    def _cleanup_expired(self) -> None:
        """Remove all expired entries."""
        current = self.head.next
        now = time.time()
        while current != self.tail:
            next_node = current.next
            if now > current.expiry:
                self._remove(current)
                del self.cache[current.key]
            current = next_node
```

### Template 5: Thread-Safe LRU Cache

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
    
    def _remove(self, node: DListNode) -> None:
        """Remove node from linked list."""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_front(self, node: DListNode) -> None:
        """Add node to front."""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def get(self, key: int) -> int:
        """Thread-safe get."""
        with self.lock:
            if key not in self.cache:
                return -1
            node = self.cache[key]
            self._remove(node)
            self._add_to_front(node)
            return node.val
    
    def put(self, key: int, value: int) -> None:
        """Thread-safe put."""
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                node.val = value
                self._remove(node)
                self._add_to_front(node)
            else:
                node = DListNode(key, value)
                self.cache[key] = node
                self._add_to_front(node)
                
                if len(self.cache) > self.capacity:
                    lru = self.tail.prev
                    self._remove(lru)
                    del self.cache[lru.key]
```

---

## When to Use

Use the LRU Cache when you need to solve problems involving:

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

### Visual Representation

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

### Why It Works

- **O(1) get**: Hash map provides direct node access
- **O(1) put**: Hash map insertion + linked list operations
- **O(1) eviction**: Tail pointer gives immediate LRU access
- **Doubly linked list**: Enables O(1) removal given a node reference

### Limitations

- **Fixed capacity**: Must be set at initialization (though some implementations support dynamic resizing)
- **No persistence**: Data lost when program terminates (unless extended)
- **Not thread-safe by default**: Requires locking for concurrent access
- **Memory overhead**: Each entry requires hash map + node overhead

---

## Practice Problems

### Problem 1: LRU Cache

**Problem:** [LeetCode 146 - LRU Cache](https://leetcode.com/problems/lru-cache/)

**Description:** Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class with O(1) time complexity for get and put operations.

**How to Apply:**
- Implement hash map + doubly linked list combination
- Handle edge cases: capacity 0, duplicate keys
- Ensure O(1) for both get and put operations

---

### Problem 2: LFU Cache

**Problem:** [LeetCode 460 - LFU Cache](https://leetcode.com/problems/lfu-cache/)

**Description:** Design and implement a data structure for a Least Frequently Used (LFU) cache. When the cache reaches capacity, invalidate the least frequently used key before inserting.

**How to Apply:**
- Use multiple frequency buckets
- Maintain min frequency for O(1) eviction
- Track frequency per key and keys per frequency

---

### Problem 3: Design In-Memory File System

**Problem:** [LeetCode 588 - Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system/)

**Description:** Design an in-memory file system to simulate the following functions: ls, mkdir, addContentToFile, readContentFromFile. You can use LRU caching for file content.

**How to Apply:**
- Use tree structure for directories
- LRU cache for frequently accessed file contents
- Path parsing and traversal

---

### Problem 4: Logger Rate Limiter

**Problem:** [LeetCode 359 - Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter/)

**Description:** Design a logger system that receives a stream of messages along with their timestamps. Each unique message should only be printed at most every 10 seconds.

**How to Apply:**
- Use hash map with timestamp (similar to LRU cache structure)
- Time-based eviction logic
- Simple cache invalidation

---

### Problem 5: Design Browser History

**Problem:** [LeetCode 1472 - Design Browser History](https://leetcode.com/problems/design-browser-history/)

**Description:** You have a browser with one tab where you start on the homepage. You can visit a new URL, go back in history, or go forward in history. Implement the BrowserHistory class.

**How to Apply:**
- Use doubly linked list pattern (similar to LRU list structure)
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
