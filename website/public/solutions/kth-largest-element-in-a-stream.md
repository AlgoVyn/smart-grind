# Kth Largest Element in a Stream

## Problem Description

You are part of a university admissions office and need to keep track of the kth highest test score from applicants in real-time. This helps to determine cut-off marks for interviews and admissions dynamically as new applicants submit their scores.

You need to implement a class that, for a given integer `k`, maintains a stream of test scores and continuously returns the kth largest test score after a new score has been submitted.

### Class Definition

**`KthLargest(int k, int[] nums)`** — Initializes the object with the integer `k` and the stream of test scores `nums`.

**`int add(int val)`** — Adds a new test score `val` to the stream and returns the kth largest element in the pool of test scores so far.

### Example 1

**Input:**
```python
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
```

**Output:** `[null, 4, 5, 5, 8, 8]`

**Explanation:**
```python
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3);  // return 4
kthLargest.add(5);  // return 5
kthLargest.add(10); // return 5
kthLargest.add(9);  // return 8
kthLargest.add(4);  // return 8
```

### Example 2

**Input:**
```python
["KthLargest", "add", "add", "add", "add"]
[[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]
```

**Output:** `[null, 7, 7, 7, 8]`

**Explanation:**
```python
KthLargest kthLargest = new KthLargest(4, [7, 7, 7, 7, 8, 3]);
kthLargest.add(2);  // return 7
kthLargest.add(10); // return 7
kthLargest.add(9);  // return 7
kthLargest.add(9);  // return 8
```

---

## Constraints

- `0 <= nums.length <= 10^4`
- `1 <= k <= nums.length + 1`
- `-10^4 <= nums[i] <= 10^4`
- `-10^4 <= val <= 10^4`
- At most `10^4` calls will be made to `add`.

---

## Solution

```python
import heapq
from typing import List

class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = []
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
```

---

## Explanation

This problem uses a min-heap to efficiently maintain the kth largest element in a stream.

### Data Structure

The heap stores exactly `k` elements — the `k` largest values seen so far. The smallest element in the heap (at the root) is the kth largest overall.

### Operations

**Initialization (`__init__`):**
- Store `k` as an instance variable.
- Initialize an empty heap.
- Add all initial numbers using the `add` method.

**Adding a value (`add`):**
1. Push the new value onto the heap.
2. If the heap size exceeds `k`, pop the smallest element.
3. Return the root of the heap (the kth largest element).

### Why This Works

By always keeping only the `k` largest elements, the smallest among them is exactly the kth largest overall. When a new value is added:
- If the heap has fewer than `k` elements, the new value is included.
- If the heap already has `k` elements, only values larger than the current kth largest can enter the heap (by replacing the current kth largest).

---

## Complexity Analysis

- **Initialization:** O(n log k) — adding `n` elements to the heap.
- **`add` operation:** O(log k) — each push/pop is O(log k).
- **Space Complexity:** O(k) — the heap stores at most `k` elements.
