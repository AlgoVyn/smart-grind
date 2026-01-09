# Kth Smallest Element In A Sorted Matrix

## Problem Description

Given an `n x n` matrix where each row and column is sorted in **ascending order**, return the kth smallest element in the matrix.

> **Note:** It is the kth smallest element in sorted order, not the kth distinct element.

You must find a solution with **better than O(n²) memory**.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8` | `13` |

**Explanation:** The elements in sorted order are `[1,5,9,10,11,12,13,13,15]`. The 8th smallest is `13`.

### Example 2

| Input | Output |
|-------|--------|
| `matrix = [[-5]], k = 1` | `-5` |

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `n == matrix.length == matrix[i].length` | Square matrix |
| `1 ≤ n ≤ 300` | Matrix size |
| `-10^9 ≤ matrix[i][j] ≤ 10^9` | Element range |
| `1 ≤ k ≤ n²` | Valid k range |

> All rows and columns are guaranteed to be sorted in non-decreasing order.

---

## Solution

```python
from typing import List

class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        low, high = matrix[0][0], matrix[n-1][n-1]
        
        while low < high:
            mid = (low + high) // 2
            count = self._count_less_equal(matrix, mid)
            
            if count < k:
                low = mid + 1
            else:
                high = mid
        
        return low
    
    def _count_less_equal(self, matrix: List[List[int]], target: int) -> int:
        """Count elements less than or equal to target."""
        n = len(matrix)
        count = 0
        row = n - 1
        col = 0
        
        # Start from bottom-left corner
        while row >= 0 and col < n:
            if matrix[row][col] <= target:
                count += (row + 1)  # All elements in this column up to 'row'
                col += 1
            else:
                row -= 1
        
        return count
```

---

## Explanation

We use **binary search on the value range** from smallest to largest element:

1. **Binary search bounds:**
   - `low = matrix[0][0]` (smallest)
   - `high = matrix[n-1][n-1]` (largest)

2. **Count function:**
   - Count elements ≤ mid using a two-pointer technique
   - Start from bottom-left corner
   - Move right if element ≤ target, up otherwise
   - This is `O(n)` time

3. **Binary search logic:**
   - If `count < k`: kth element is larger → search right half
   - Otherwise: Search left half

4. **Result:** When `low == high`, we found the kth smallest

---

## Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | `O(n log(max - min))` | `n` for count, `log(max-min)` for binary search |
| **Space** | `O(1)` | Constant extra space |

---

## Alternative Solution: Min-Heap

For comparison, here's a heap-based approach:

```python
import heapq
from typing import List, Tuple

class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        min_heap: List[Tuple[int, int, int]] = []
        
        # Push first element of each row
        for i in range(min(k, n)):
            heapq.heappush(min_heap, (matrix[i][0], i, 0))
        
        # Extract k-1 times
        count = 0
        while min_heap:
            val, row, col = heapq.heappop(min_heap)
            count += 1
            if count == k:
                return val
            
            # Push next element in the same row
            if col + 1 < n:
                heapq.heappush(min_heap, (matrix[row][col + 1], row, col + 1))
```

**Heap approach complexity:** `O(k log n)` time, `O(n)` space

---

## Follow-up Challenge

1. **Constant memory:** Can you solve this with `O(1)` space?
2. **Linear time:** Can you achieve `O(n)` time? (Hint: This is an advanced technique involving selection algorithms)
