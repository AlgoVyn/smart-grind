## Heap - Top K Elements: Core Concepts

What are the fundamental concepts behind the Top K Elements pattern?

<!-- front -->

---

### Core Concept

Use a **heap of fixed size K** to efficiently track the most relevant elements without sorting the entire dataset.

**Key insight**: We only need the boundary element (K-th largest/smallest), not the complete ordering.

---

### Why Heaps?

```
Comparison: Sorting vs Heap

Array: [3, 1, 4, 1, 5, 9, 2, 6], K = 3

Sorting Approach:
  Sort entire array: [1, 1, 2, 3, 4, 5, 6, 9]
  Take last K: [5, 6, 9]
  Time: O(N log N) = O(8 × 3) = 24 operations

Heap Approach:
  Maintain min-heap of size 3:
  [3] → [1,3] → [1,3,4] → [1,3,4] (pop 1) → [3,4,5]
  → [3,4,5] (pop 3) → [4,5,6] → [4,5,6] (pop 4) → [5,6,9]
  Time: O(N log K) = O(8 × 2) = 16 operations
  
  When K << N: Heap is significantly faster!
```

---

### Min-Heap vs Max-Heap Selection

| Goal | Heap Type | Reasoning |
|------|-----------|-----------|
| **K largest elements** | Min-heap | Root = smallest of top K. New larger element displaces root. |
| **K smallest elements** | Max-heap | Root = largest of bottom K. New smaller element displaces root. |
| **K most frequent** | Min-heap | Compare by frequency. Least frequent at root gets displaced. |

```
Visual: Min-heap for K Largest (K=3)

Current top 3: [5, 6, 9] stored as min-heap:
        5  ← Root: smallest of the top K
       / \
      6   9

New element 7 arrives:
  1. Push 7: [5, 6, 9, 7] → heapify → [5, 6, 9, 7]
  2. Size > 3, pop root (5)
  3. New heap: [6, 7, 9]

Now top 3: [6, 7, 9] ✓
```

---

### Heap Operations Complexity

| Operation | Time | Description |
|-----------|------|-------------|
| `push()` | O(log K) | Insert element, maintain heap property |
| `pop()` | O(log K) | Remove root, re-heapify |
| `peek()` | O(1) | Access root without removal |
| `size` | O(1) | Current heap size |

**Overall**: N elements × O(log K) = **O(N log K)**

---

### When to Use This Pattern

✅ **Ideal scenarios:**
- Large datasets (N is huge)
- K is small relative to N (K << N)
- Streaming data (elements arrive continuously)
- Memory constraints (only O(K) space needed)

❌ **Avoid when:**
- K is close to N (e.g., K = N/2) → Sorting may be simpler
- Full sorted order is required anyway
- Array is already mostly sorted

---

### Common Applications

| Problem Type | Key Metric | Example |
|--------------|------------|---------|
| Top K largest/smallest | Value | Kth Largest Element in Array |
| Top K frequent | Frequency | Top K Frequent Elements |
| K closest | Distance | K Closest Points to Origin |
| K popular | Count | Top K popular search queries |
| K expensive | Cost | Top K most expensive items |

<!-- back -->
