## Heap - K-way Merge: Core Concepts

What are the fundamental principles of k-way merge?

<!-- front -->

---

### Core Concept

**Only the heads of the K lists can be the next minimum. Use a min-heap to get the smallest in O(log K) time.**

**Visual:**
```
List 1: [1, 5, 9]
List 2: [2, 6, 10]
List 3: [3, 7, 11]

Heap: [1, 2, 3] (min = 1 from List 1)
Pop 1, push 5 (next from List 1)
Heap: [2, 3, 5] (min = 2 from List 2)
Pop 2, push 6
...

Result: [1, 2, 3, 5, 6, 7, 9, 10, 11]
```

---

### The Pattern

```
1. Push first element of each list into heap
2. While heap not empty:
   - Pop smallest
   - Add to result
   - Push next element from same list

Why O(N log K)?
- N elements total
- Each heap operation O(log K)
- Total O(N log K)
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Merge K lists | Combine sorted | LeetCode 23 |
| Kth smallest | In sorted matrix | LeetCode 378 |
| External sort | Large files | Database |
| Stream merge | Real-time | Data pipeline |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(N log K) | N total, K lists |
| Space | O(K) | Heap size |
| Better than merge | Yes | O(N log K) vs O(N K) |

<!-- back -->
