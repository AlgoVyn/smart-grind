## Heap - Top K Elements: Framework

What is the complete framework for solving Top K Elements problems using heaps?

<!-- front -->

---

### Framework: Top K Elements with Heap

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP K ELEMENTS - HEAP FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Identify Goal                                           │
│  ├── Find K largest elements  → Use MIN-HEAP of size K          │
│  ├── Find K smallest elements → Use MAX-HEAP of size K          │
│  └── Find K most frequent       → MIN-HEAP by frequency          │
│                                                                  │
│  Step 2: Initialize                                              │
│  ├── Empty heap                                                  │
│  └── (Optional) Frequency map for frequency-based problems       │
│                                                                  │
│  Step 3: Process Elements                                        │
│  for each element:                                               │
│      heap.push(element)                                          │
│      if heap.size > K:                                           │
│          heap.pop()  # Remove smallest (or largest for max-heap) │
│                                                                  │
│  Step 4: Extract Results                                         │
│  ├── Heap contains K elements (unsorted)                        │
│  └── If sorted needed: sort(heap)                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Core Algorithm Template

```python
import heapq
from typing import List

def top_k_framework(nums: List[int], k: int, find_largest: bool = True) -> List[int]:
    """
    Universal template for Top K Elements.
    
    Args:
        nums: Input array
        k: Number of elements to find
        find_largest: True for K largest, False for K smallest
    
    Time: O(N log K), Space: O(K)
    """
    if not nums or k <= 0:
        return []
    
    heap = []
    
    for num in nums:
        if find_largest:
            # Min-heap for K largest
            heapq.heappush(heap, num)
        else:
            # Use negative for max-heap (K smallest)
            heapq.heappush(heap, -num)
        
        # Maintain heap size of k
        if len(heap) > k:
            heapq.heappop(heap)
    
    # Convert back if using max-heap simulation
    if not find_largest:
        return [-x for x in heap]
    return heap
```

---

### Top K Frequent Elements Template

```python
from collections import Counter

def top_k_frequent_framework(nums: List[int], k: int) -> List[int]:
    """
    Template for K most frequent elements.
    Time: O(N log K), Space: O(N)
    """
    # Step 1: Count frequencies
    freq = Counter(nums)
    
    # Step 2: Use min-heap to keep top k frequent
    min_heap = []
    for num, count in freq.items():
        heapq.heappush(min_heap, (count, num))
        if len(min_heap) > k:
            heapq.heappop(min_heap)  # Remove least frequent
    
    # Step 3: Extract elements
    return [num for count, num in min_heap]
```

---

### Decision Framework

```
Problem Statement
        │
        ▼
┌───────────────────────┐
│ What are we finding? │
└─────────┬─────────────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
 K largest  K smallest  K most frequent
    │         │              │
    ▼         ▼              ▼
 Min-heap   Max-heap      Min-heap by freq
 (size K)   (size K)       (size K)
    │         │              │
    └─────────┴──────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Push element,       │
    │ pop if size > K     │
    └─────────────────────┘
```

---

### Key Framework Elements

| Element | Purpose | Heap Type |
|---------|---------|-----------|
| `min_heap` | Track K largest elements | Min-heap (smallest at top) |
| `max_heap` | Track K smallest elements | Max-heap (largest at top) |
| `freq_heap` | Track K most frequent | Min-heap by (frequency, element) |
| Size limit | Maintain exactly K elements | Pop when size exceeds K |

<!-- back -->
