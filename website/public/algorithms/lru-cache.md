# LRU Cache

## Category
Advanced

## Description
Implement Least Recently Used cache using HashMap and Doubly Linked List.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

LRU (Least Recently Used) Cache is a data structure that evicts the least recently used items when capacity is exceeded. It supports two operations:
- **get(key)**: Retrieve value if exists, mark as recently used
- **put(key, value)**: Insert or update value, mark as recently used

**Key Data Structures:**
1. **HashMap/Dictionary**: O(1) lookup by key
2. **Doubly Linked List**: O(1) move to front and remove from back

**Why Doubly Linked List?**
- O(1) removal from any position when you have the node
- Can be easily maintained in order of recency
- Head = most recently used, Tail = least recently used

**Operations:**
- **Get**: Find in hashmap, move node to front (most recently used)
- **Put**: If exists, update value and move to front. If at capacity, remove from tail and add new to front.

**Time Complexity:** O(1) for both get and put
**Space Complexity:** O(capacity)

This is a classic system design problem used in caches like Redis, Memcached, browser caches, etc.

---

## Implementation

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
    
    Time: O(1) for get and put
    Space: O(capacity)
    """
    
    def __init__(self, capacity):
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
    
    def _remove(self, node):
        """Remove node from the linked list."""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_front(self, node):
        """Add node right after head (most recently used)."""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_front(self, node):
        """Move existing node to front (most recently used)."""
        self._remove(node)
        self._add_to_front(node)
    
    def get(self, key):
        """
        Get value by key. Returns -1 if not found.
        Marks item as recently used.
        """
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_front(node)
        return node.val
    
    def put(self, key, value):
        """
        Put key-value pair into cache.
        If key exists, update value and mark as recently used.
        If cache is full, evict least recently used item.
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
    
    def __repr__(self):
        values = []
        node = self.head.next
        while node != self.tail:
            values.append(f"({node.key}:{node.val})")
            node = node.next
        return f"LRUCache({' -> '.join(values)})")
```

```javascript
function lruCache() {
    // LRU Cache implementation
    // Time: O(1) for get and put
    // Space: O(capacity)
}
```

---

## Example

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

**Output:**
```
get(1) = 1
get(2) = -1
get(1) = -1
get(3) = 3
get(4) = 4
```

**Explanation:**
- After put(1,1): [1:1]
- After put(2,2): [1:1, 2:2]
- get(1): moves 1 to front, cache: [2:2, 1:1] (1 is MRU)
- put(3,3): cache full, evict LRU (2), add 3: [1:1, 3:3]
- get(2): -1 (key 2 was evicted)
- put(4,4): evict LRU (1): [3:3, 4:4]
- get(1): -1 (key 1 was evicted)
- get(3): 3
- get(4): 4

**LRU Order:** Head (MRU) → ... → Tail (LRU)

---

## Time Complexity
**O(1) for get and put**

---

## Space Complexity
**O(capacity)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
