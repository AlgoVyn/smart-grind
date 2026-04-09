## Heap - Top K Elements: Comparison

How do different approaches for Top K Elements problems compare?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Min-Heap (Top K)** | O(N log K) | O(K) | K << N, streaming data |
| **Max-Heap (Top K)** | O(N log K) | O(K) | K << N, Python users (negation) |
| **Full Sort** | O(N log N) | O(N) | K ≈ N, or sorted output needed |
| **QuickSelect** | O(N) avg, O(N²) worst | O(1) | Single Kth element, mutable input |
| **Bucket Sort** | O(N) | O(N) | Frequency problems with bounded range |
| **Partial Sort** | O(N log K) | O(K) | Language built-ins (C++ `nth_element`) |

---

### Scenario Analysis

```
Scenario 1: K is very small (K = 3, N = 10^6)
┌────────────────────────────────────────────────────────┐
│                                                        │
│ Heap (N log K):  10^6 × log(3) ≈ 1.6 × 10^6 ops    ✓✓  │
│ Sort (N log N): 10^6 × log(10^6) ≈ 20 × 10^6 ops    ✗   │
│ QuickSelect:    O(N) ≈ 10^6 ops                     ✓✓  │
│                                                        │
│ Winner: Heap or QuickSelect                           │
└────────────────────────────────────────────────────────┘

Scenario 2: K is large (K = N/2 = 500,000)
┌────────────────────────────────────────────────────────┐
│                                                        │
│ Heap:           10^6 × log(5×10^5) ≈ 19 × 10^6 ops   ~  │
│ Sort:           10^6 × log(10^6) ≈ 20 × 10^6 ops      ~  │
│ QuickSelect:    O(N) ≈ 10^6 ops                       ✓✓ │
│                                                        │
│ Winner: QuickSelect or just sort the array             │
└────────────────────────────────────────────────────────┘

Scenario 3: Streaming data (elements arrive continuously)
┌────────────────────────────────────────────────────────┐
│                                                        │
│ Heap:           O(log K) per update                  ✓✓  │
│ Sort:           Must re-sort each time                ✗  │
│ QuickSelect:    Must re-run each time                 ✗  │
│                                                        │
│ Winner: Heap (maintain state between updates)          │
└────────────────────────────────────────────────────────┘
```

---

### Min-Heap vs Max-Heap: When to Use

| Task | Heap Type | Python Implementation |
|------|-----------|---------------------|
| K largest | Min-heap | `heapq.heappush(heap, num)` |
| K smallest | Max-heap | `heapq.heappush(heap, -num)` |
| K closest | Min-heap by distance | `heapq.heappush(heap, (dist, point))` |
| K most frequent | Min-heap by frequency | `heapq.heappush(heap, (freq, item))` |

```python
# K Largest: Min-heap (root = smallest of top K)
def k_largest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)  # Remove smallest
    return heap  # Contains K largest

# K Smallest: Max-heap simulation
def k_smallest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, -num)  # Negate
        if len(heap) > k:
            heapq.heappop(heap)
    return [-x for x in heap]  # Un-negate
```

---

### Heap vs QuickSelect Decision Tree

```
Need Top K Elements?
        │
        ▼
┌───────────────────────┐
│ Can modify input?    │
└─────────┬─────────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
   Yes          No
    │           │
    ▼           ▼
┌──────────┐ ┌──────────────┐
│ Need all │ │ Streaming?   │
│ K elements│ └──────┬───────┘
└────┬─────┘        │
     │           ┌──┴──┐
     │           ▼     ▼
     │          Yes    No
     │           │      │
     │           ▼      ▼
     │      ┌─────────┐ ┌─────────┐
     │      │  Heap   │ │ QuickSelect│
     │      └─────────┘ │ if single │
     │                  │  Kth only │
     ▼                  └─────────┘
┌──────────────┐
│ QuickSelect  │  ← O(N) avg, single pass
│ or Heap      │  ← Heap more flexible
└──────────────┘
```

---

### Trade-off Summary

| Criterion | Heap | QuickSelect | Sorting |
|-----------|------|-------------|---------|
| Time Complexity | O(N log K) | O(N) avg | O(N log N) |
| Space Complexity | O(K) | O(1) | O(N) or O(1) |
| Output | Unsorted | Partitioned | Sorted |
| Streaming | ✓ Yes | ✗ No | ✗ No |
| Stable | ✓ Yes | ✗ No | ✓ Yes |
| Implementation | Easy | Medium | Very Easy |
| Worst Case | O(N log K) | O(N²) | O(N log N) |

<!-- back -->
