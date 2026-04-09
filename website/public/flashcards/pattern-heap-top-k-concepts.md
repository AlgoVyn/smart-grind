## Heap - Top K Elements: Core Concepts

What are the fundamental principles of using heaps for Top K problems?

<!-- front -->

---

### Core Concept

Use **a min-heap of size K to efficiently track the K largest elements** (or max-heap for K smallest), maintaining only the best candidates.

**Key insight**: A heap of size K lets us process N elements in O(N log K) time, better than O(N log N) sorting for small K.

---

### The Pattern

```
Find K=3 largest in [5, 3, 8, 1, 9, 2, 7]:

Min-Heap (size ≤ 3):

Process 5: Heap: [5]
Process 3: Heap: [3, 5] (min at root)
Process 8: Heap: [3, 5, 8]

Process 1: 1 < 3 (root), ignore
Process 9: 9 > 3, pop 3, push 9
  Heap: [5, 8, 9] (after heapify)

Process 2: 2 < 5, ignore
Process 7: 7 > 5, pop 5, push 7
  Heap: [7, 8, 9]

Result: [7, 8, 9] are 3 largest ✓

Time: O(N log K) vs O(N log N) for sorting
```

---

### Two Approaches

| Approach | Heap Type | Use When |
|----------|-----------|----------|
| **Min-Heap (size K)** | Root = K-th largest | Find K largest |
| **Max-Heap (size K)** | Root = K-th smallest | Find K smallest |
| **Full sort** | - | When K ≈ N |
| **Quick Select** | - | Single query, O(N) |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **K Largest** | Top K elements | Kth Largest Element |
| **K Smallest** | Smallest K elements | Kth Smallest |
| **K Closest** | Closest to target | K Closest to Origin |
| **K Frequent** | Most frequent elements | Top K Frequent |
| **Merge K Lists** | Combine sorted lists | Merge K Sorted Lists |
| **Median Finder** | Running median | Find Median from Stream |

---

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| **Add element** | O(log K) | O(K) |
| **Get top K** | O(K log K) to sort | O(K) |
| **Process N elements** | O(N log K) | O(K) |
| **Full sort** | O(N log N) | O(N) or O(1) |

<!-- back -->
