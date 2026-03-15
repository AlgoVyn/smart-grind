## LRU Cache - Hash + Doubly Linked List

**Question:** Why use a doubly linked list?

<!-- front -->

---

## LRU Cache Design

### Why This Combination?
| Operation | Hash | DLL |
|-----------|------|-----|
| Get | O(1) | - |
| Put | O(1) | - |
| Move to front | - | O(1) |
| Evict LRU | - | O(1) |

### Implementation
```python
class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail
        self.head = Node(-1, -1)
        self.tail = Node(-1, -1)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
    
    def get(self, key):
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._remove(node)
        self._add_to_front(node)
        return node.value
    
    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.value = value
            self._remove(node)
            self._add_to_front(node)
        else:
            node = Node(key, value)
            self.cache[key] = node
            self._add_to_front(node)
            
            if len(self.cache) > self.cap:
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
```

### Why Doubly Linked List?
- **Singly:** Can not remove from middle in O(1)
- **Doubly:** Can remove any node knowing just that node

### Complexity: O(1) for both get and put

<!-- back -->
