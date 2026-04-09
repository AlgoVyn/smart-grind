## Design - General/Specific: Core Concepts

What are the fundamental principles of the General/Specific Design pattern?

<!-- front -->

---

### Core Concept

**No single data structure is perfect for all operations. The key is analyzing requirements and combining data structures to meet constraints.**

```
The "Aha!" Moments:

1. Why not just HashMap?
   └── HashMaps don't maintain order!
   └── For LRU, need both fast lookup AND recency tracking

2. Why Doubly Linked List?
   └── Need to move items to "most recent" in O(1)
   └── Singly linked list can't remove from middle efficiently

3. Why combine data structures?
   └── HashMap: key → node pointer (O(1) lookup)
   └── Linked List: maintains recency order (O(1) move)
   └── Together: both operations in O(1)
```

---

### Design Process Visualization

```
Problem: LRU Cache
Requirements:
├── get(key) - O(1)
├── put(key, value) - O(1)
└── evict when capacity reached

Analysis:
├── Fast lookup → HashMap
├── Fast removal of oldest → Linked List
└── Fast reordering → Doubly Linked List

Solution: HashMap + Doubly Linked List
├── HashMap: key → node pointer
└── Linked List: maintains recency order
```

---

### The Golden Rule

**Optimize for the common case, accept slower less frequent operations.**

| Scenario | Common Operation | Rare Operation | Trade-off |
|----------|-----------------|---------------|-----------|
| LRU Cache | get/put (O(1)) | eviction (O(1)) | None |
| Min Stack | push/pop (O(1)) | getMin (O(1)) | Extra space |
| Random access | lookup (O(1)) | insert (O(n)) | Array choice |

<!-- back -->
