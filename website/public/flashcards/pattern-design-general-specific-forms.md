## Design - General/Specific: Forms & Variations

What are the common forms and variations of design problems?

<!-- front -->

---

### Form 1: LRU (Least Recently Used)

```
Eviction Policy: Remove least recently accessed item
Data Structures: HashMap + Doubly Linked List
Operations: get, put both O(1)

Example: Cache with capacity 2
put(1, A) → [1:A]
put(2, B) → [2:B, 1:A]
get(1) → A, move to front → [1:A, 2:B]
put(3, C) → evict 2 → [3:C, 1:A]
```

---

### Form 2: LFU (Least Frequently Used)

```
Eviction Policy: Remove least frequently accessed
If tie: remove least recently used among ties
Data Structures: 
  - HashMap: key → value & frequency
  - HashMap: frequency → linked list of keys
  - Min-heap or track min frequency

Complexity: O(1) for all operations with proper design
```

---

### Form 3: Min Stack

```
Standard Stack + getMin in O(1)
Data Structures: Two stacks (main + min tracking)

Operation Logic:
Push: 
  - Push to main
  - Push to min if empty OR val <= min.top
Pop:
  - Pop from main
  - If popped == min.top, pop min too
GetMin: return min.top
```

---

### Form 4: Insert Delete GetRandom O(1)

```
Requirements:
  - insert(val): O(1)
  - remove(val): O(1)
  - getRandom(): O(1)

Data Structures:
  - ArrayList: stores values (for random access)
  - HashMap: val → index in array

Remove Trick:
  - Swap with last element
  - Update HashMap for moved element
  - Remove last (O(1) instead of O(n))
```

---

### Form 5: Time-Based Key-Value Store

```
Requirements:
  - set(key, value, timestamp)
  - get(key, timestamp) → value at or before timestamp

Data Structures:
  - HashMap: key → list of (timestamp, value)
  - Binary search on list for get

Complexity:
  - set: O(1) append
  - get: O(log n) binary search
```

---

### Related Problem Matrix

| Problem | Difficulty | Key Twist |
|---------|-----------|-----------|
| LRU Cache | Medium | Classic combination |
| Min Stack | Easy | Two-stack pattern |
| LFU Cache | Hard | Multiple frequencies |
| Insert Delete GetRandom | Medium | Swap trick |
| Time Based KV Store | Medium | Binary search |
| Design File System | Hard | Tree + HashMap |

<!-- back -->
