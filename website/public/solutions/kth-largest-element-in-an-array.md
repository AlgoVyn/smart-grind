# Kth Largest Element In An Array

## Problem Description

Given an integer array `nums` and an integer `k`, return the **kth largest element** in the array.

> **Note:** It is the kth largest element in sorted order, not the kth distinct element.

Can you solve it without sorting?

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `nums = [3,2,1,5,6,4], k = 2` | `5` |

### Example 2

| Input | Output |
|-------|--------|
| `nums = [3,2,3,1,2,4,5,5,6], k = 4` | `4` |

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ k ≤ nums.length ≤ 10^5` | Array size bounds |
| `-10^4 ≤ nums[i] ≤ 10^4` | Element value range |

---

## Solution

```python
import heapq
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Min-heap to keep track of k largest elements
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            # Maintain only k elements in the heap
            if len(heap) > k:
                heapq.heappop(heap)
        # The root is the kth largest element
        return heap[0]
```

---

## Explanation

We use a **min-heap** to keep track of the k largest elements:

1. Iterate through the array, pushing each number onto the heap
2. If heap size exceeds k, pop the smallest element
3. After processing all elements, the heap contains the k largest elements
4. The root (smallest in heap) is the kth largest overall

### Why This Works

The heap always contains the k largest elements seen so far. When a new element arrives:
- If it's smaller than the heap's root, it won't affect the top k
- If it's larger, it pushes out the current kth largest

---

## Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | `O(n log k)` | Each heap operation is `O(log k)` |
| **Space** | `O(k)` | Heap stores k elements |

---

## Follow-up Challenge

Can you achieve `O(n)` average time using the QuickSelect algorithm?
