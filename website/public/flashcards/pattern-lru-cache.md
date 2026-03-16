## LRU Cache: Design Pattern

**Question:** How do you implement an LRU cache with O(1) operations?

<!-- front -->

---

## Answer: HashMap + Doubly Linked List

### Solution
```python
class DLinkedNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cache = {}
        self.head = DLinkedNode()
        self.tail = DLinkedNode()
        self.head.next = self.tail
        self.tail.prev = self.head
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_head(node)
        return node.val
    
    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            node = DLinkedNode(key, value)
            self.cache[key] = node
            self._add_node(node)
            
            if len(self.cache) > self.capacity:
                tail = self._remove_tail()
                del self.cache[tail.key]
    
    def _add_node(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _move_to_head(self, node):
        self._remove_node(node)
        self._add_node(node)
    
    def _remove_tail(self):
        node = self.tail.prev
        self._remove_node(node)
        return node
```

### Visual: Operations
```
Initial: head <-> tail (empty cache)

put(1,1): head <-> [1,1] <-> tail

put(2,2): head <-> [2,2] <-> [1,1] <-> tail

get(1): head <-> [1,1] <-> [2,2] <-> tail
        (moves 1 to front)

put(3,3): head <-> [3,3] <-> [1,1] <-> [2,2] <-> tail
        (removes 2 from tail)
```

### ⚠️ Tricky Parts

#### 1. Dummy Head and Tail
```python
# Don't use None as boundaries!
# Use dummy nodes to avoid special cases

self.head = DLinkedNode()
self.tail = DLinkedNode()
self.head.next = self.tail
self.tail.prev = self.head
```

#### 2. Order of Operations in Put
```python
# When updating existing key:
# 1. Update value
# 2. Move to head

# When adding new key:
# 1. Add to cache
# 2. Add to head
# 3. If over capacity, remove tail
```

#### 3. Python OrderedDict Alternative
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| get | O(1) | O(1) |
| put | O(1) | O(1) |

### Why HashMap + Linked List?

| Data Structure | Search | Insert/Delete |
|---------------|--------|---------------|
| HashMap | O(1) | O(1) |
| Array | O(1) | O(n) |
| Linked List | O(n) | O(1) |
| **HashMap + DLL** | O(1) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using only dict | Can't track order |
| Using list | O(n) operations |
| Forgetting capacity check | Check after every put |
| Not removing from tail | Must remove oldest |

### LFU Cache Variation
```python
# Use multiple frequency lists
# freq[i] = doubly linked list of nodes with frequency i

class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.min_freq = 0
        self.cache = {}
        self.freq = defaultdict(DLinkedList)
```

<!-- back -->
