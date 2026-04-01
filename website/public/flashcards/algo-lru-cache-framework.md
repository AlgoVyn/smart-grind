## Title: LRU Cache Framework

What is the standard framework for implementing LRU Cache?

<!-- front -->

---

### LRU Cache Framework
```
DATA STRUCTURES:
  HashMap<key, Node>: O(1) lookup
  DoublyLinkedList: O(1) reordering
    Head → Most Recent → ... → Least Recent → Tail

OPERATIONS:

GET(key):
  if key not in map: return -1
  node = map[key]
  move_to_front(node)
  return node.value

PUT(key, value):
  if key in map:
    node = map[key]
    node.value = value
    move_to_front(node)
  else:
    create new_node(key, value)
    map[key] = new_node
    add_to_front(new_node)
    
    if map.size > capacity:
      lru = remove_tail()
      map.remove(lru.key)

HELPERS:
  move_to_front(node): remove(node) + add_to_front(node)
  remove(node): connect prev.next to next, next.prev to prev
  add_to_front(node): insert after head
  remove_tail(): remove and return node before tail
```

---

### Design Patterns
| Component | Purpose | Alternative |
|-----------|---------|-------------|
| Doubly Linked List | O(1) move/remove | OrderedDict (Python) |
| Hash Map | O(1) lookup | Built-in dict |
| Dummy head/tail | Simplify edge cases | Check null pointers |

### Python Alternative
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)  # LRU
```

---

### Variations
| Cache Type | Eviction Policy |
|------------|-----------------|
| LRU | Least Recently Used |
| LFU | Least Frequently Used |
| FIFO | First In First Out |
| TLRU | Time-aware LRU |

<!-- back -->
