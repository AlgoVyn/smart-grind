## Title: LRU Cache

What is an LRU Cache and how is it implemented?

<!-- front -->

---

### Definition
Least Recently Used (LRU) Cache is a fixed-size cache that evicts the least recently accessed item when capacity is exceeded. Supports get and put operations in O(1) time.

### Requirements
| Operation | Time | Description |
|-----------|------|-------------|
| get(key) | O(1) | Return value, mark as recently used |
| put(key, value) | O(1) | Insert/update, evict if needed |

### Core Data Structures
- **Hash Map**: O(1) key → node lookup
- **Doubly Linked List**: O(1) move to front / remove

---

### Implementation
```python
class ListNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove(self, node):
        """Remove node from list"""
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev
    
    def _add_to_front(self, node):
        """Add right after head (most recent)"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_front(self, node):
        """Move existing node to front"""
        self._remove(node)
        self._add_to_front(node)
    
    def _pop_tail(self):
        """Remove least recent (before tail)"""
        res = self.tail.prev
        self._remove(res)
        return res
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_front(node)
        return node.val
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_front(node)
        else:
            new_node = ListNode(key, value)
            self.cache[key] = new_node
            self._add_to_front(new_node)
            
            if len(self.cache) > self.capacity:
                tail = self._pop_tail()
                del self.cache[tail.key]
```

---

### Complexity
| Operation | Time | Space |
|-----------|------|-------|
| get | O(1) | O(capacity) |
| put | O(1) | O(capacity) |

<!-- back -->
