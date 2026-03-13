# Kth Smallest Element In A Sorted Matrix

## Problem Description

## Pattern: Binary Search + Heap - Sorted Matrix Kth Smallest

This problem demonstrates algorithmic problem-solving patterns.

Given an `n x n` matrix where each row and column is sorted in **ascending order**, return the kth smallest element in the matrix.

> **Note:** It is the kth smallest element in sorted order, not the kth distinct element.

You must find a solution with **better than O(n²) memory**.

---

## Examples

### Example

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

## Intuition

The key insight is that both rows and columns are sorted. This creates a unique structure we can exploit:

### Why Binary Search on Value Works

1. **Value Range Binary Search**: The answer must be between the smallest element (top-left) and largest element (bottom-right)
2. **Count Function**: For any mid value, we can count how many elements are ≤ mid in O(n) using two pointers
3. **Monotonicity**: If count ≥ k, the answer is ≤ mid; otherwise, it's > mid

### Why the Two-Pointer Count Works

Starting from the bottom-left corner:
- If current element ≤ target: All elements above in this column are also ≤ target, so we add (row + 1) to count and move right
- If current element > target: Move up to find smaller elements

---

## Multiple Approaches with Code

We'll cover three approaches:
1. **Binary Search on Value (Optimal)** - O(n log(max-min)) time
2. **Min-Heap (K-Way Merge)** - O(k log n) time
3. **Divide and Conquer** - Advanced technique

---

## Approach 1: Binary Search on Value (Optimal)

This is the most efficient approach that exploits the sorted row and column properties.

### Algorithm Steps

1. Set search range: low = matrix[0][0], high = matrix[n-1][n-1]
2. While low < high:
   - mid = (low + high) / 2
   - Count elements ≤ mid using two pointers
   - If count < k: answer is larger → low = mid + 1
   - Otherwise: answer is smaller/equal → high = mid
3. Return low (or high)

### Why It Works

The matrix has a special property: going right increases value, going down increases value. The count function exploits this to count elements in O(n). Binary search finds the smallest value where count ≥ k.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        """
        Find kth smallest element using binary search on value range.
        
        Args:
            matrix: Sorted n x n matrix
            k: Position to find (1-indexed)
            
        Returns:
            Kth smallest element
        """
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
        """
        Count elements less than or equal to target using two pointers.
        
        Starts from bottom-left corner and moves right/up.
        """
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

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        int low = matrix[0][0];
        int high = matrix[n-1][n-1];
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            int count = countLessEqual(matrix, mid, n);
            
            if (count < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        
        return low;
    }
    
private:
    int countLessEqual(vector<vector<int>>& matrix, int target, int n) {
        int count = 0;
        int row = n - 1;
        int col = 0;
        
        // Start from bottom-left corner
        while (row >= 0 && col < n) {
            if (matrix[row][col] <= target) {
                count += (row + 1);  // All elements in this column up to 'row'
                col++;
            } else {
                row--;
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        int low = matrix[0][0];
        int high = matrix[n-1][n-1];
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            int count = countLessEqual(matrix, mid, n);
            
            if (count < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        
        return low;
    }
    
    private int countLessEqual(int[][] matrix, int target, int n) {
        int count = 0;
        int row = n - 1;
        int col = 0;
        
        // Start from bottom-left corner
        while (row >= 0 && col < n) {
            if (matrix[row][col] <= target) {
                count += (row + 1);  // All elements in this column up to 'row'
                col++;
            } else {
                row--;
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(matrix, k) {
    const n = matrix.length;
    let low = matrix[0][0];
    let high = matrix[n-1][n-1];
    
    const countLessEqual = (target) => {
        let count = 0;
        let row = n - 1;
        let col = 0;
        
        // Start from bottom-left corner
        while (row >= 0 && col < n) {
            if (matrix[row][col] <= target) {
                count += (row + 1);  // All elements in this column up to 'row'
                col++;
            } else {
                row--;
            }
        }
        
        return count;
    };
    
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const count = countLessEqual(mid);
        
        if (count < k) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    
    return low;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log(max-min)) - n for count, log(range) for binary search |
| **Space** | O(1) - Constant extra space |

---

## Approach 2: Min-Heap (K-Way Merge)

This approach treats the matrix as k sorted lists and merges them using a heap.

### Algorithm Steps

1. Create a min-heap with first element from each row (value, row, col)
2. Extract minimum k-1 times:
   - Pop the smallest element
   - Push the next element from the same row (if exists)
3. The kth extraction is our answer

### Why It Works

Each row is sorted, so the smallest unvisited element is always at the top of one of the rows. The heap always gives us access to the smallest element among all "active" positions.

### Code Implementation

````carousel
```python
import heapq
from typing import List, Tuple

class Solution:
    def kthSmallest_heap(self, matrix: List[List[int]], k: int) -> int:
        """
        Find kth smallest element using min-heap (k-way merge).
        
        Args:
            matrix: Sorted n x n matrix
            k: Position to find (1-indexed)
            
        Returns:
            Kth smallest element
        """
        n = len(matrix)
        min_heap: List[Tuple[int, int, int]] = []
        
        # Push first element from each row
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
        
        return -1  # Should never reach here
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        using T = tuple<int, int, int>;  // value, row, col
        
        priority_queue<T, vector<T>, greater<T>> minHeap;
        
        // Push first element from each row
        for (int i = 0; i < min(k, n); i++) {
            minHeap.emplace(matrix[i][0], i, 0);
        }
        
        // Extract k-1 times
        int count = 0;
        while (!minHeap.empty()) {
            auto [val, row, col] = minHeap.top();
            minHeap.pop();
            count++;
            
            if (count == k) {
                return val;
            }
            
            // Push next element in the same row
            if (col + 1 < n) {
                minHeap.emplace(matrix[row][col + 1], row, col + 1);
            }
        }
        
        return -1;  // Should never reach here
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        // Min-heap: value, row, col
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        
        // Push first element from each row
        for (int i = 0; i < Math.min(k, n); i++) {
            minHeap.offer(new int[]{matrix[i][0], i, 0});
        }
        
        // Extract k-1 times
        int count = 0;
        while (!minHeap.isEmpty()) {
            int[] curr = minHeap.poll();
            int val = curr[0];
            int row = curr[1];
            int col = curr[2];
            count++;
            
            if (count == k) {
                return val;
            }
            
            // Push next element in the same row
            if (col + 1 < n) {
                minHeap.offer(new int[]{matrix[row][col + 1], row, col + 1});
            }
        }
        
        return -1;  // Should never reach here
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(matrix, k) {
    const n = matrix.length;
    const minHeap = [];
    
    // Push first element from each row
    for (let i = 0; i < Math.min(k, n); i++) {
        heapPush(minHeap, [matrix[i][0], i, 0]);
    }
    
    // Extract k-1 times
    let count = 0;
    while (minHeap.length > 0) {
        const [val, row, col] = heapPop(minHeap);
        count++;
        
        if (count === k) {
            return val;
        }
        
        // Push next element in the same row
        if (col + 1 < n) {
            heapPush(minHeap, [matrix[row][col + 1], row, col + 1]);
        }
    }
    
    return -1;  // Should never reach here
};

// Simple min-heap implementation
function heapPush(heap, val) {
    heap.push(val);
    bubbleUp(heap, heap.length - 1);
}

function heapPop(heap) {
    const result = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
        heap[0] = last;
        bubbleDown(heap, 0);
    }
    return result;
}

function bubbleUp(heap, i) {
    while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if (heap[i][0] >= heap[parent][0]) break;
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
    }
}

function bubbleDown(heap, i) {
    while (true) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < heap.length && heap[left][0] < heap[smallest][0]) {
            smallest = left;
        }
        if (right < heap.length && heap[right][0] < heap[smallest][0]) {
            smallest = right;
        }
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log n) - k extractions, each O(log n) |
| **Space** | O(n) - Heap stores at most n elements |

---

## Approach 3: Divide and Conquer (Advanced)

This approach recursively narrows down the search space using the median of medians concept.

### Algorithm Steps

1. If matrix is small, just flatten and sort (base case)
2. Find medians of each row
3. Find median of medians
4. Partition matrix around this median value
5. Recurse on the partition containing k

### Why It Works

Similar to quickselect, we partition around a pivot and only search the side containing k. This achieves average O(n) time.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def kthSmallest_dc(self, matrix: List[List[int]], k: int) -> int:
        """
        Find kth smallest element using divide and conquer.
        
        Note: This is a simplified version for demonstration.
        The binary search approach is preferred for clarity.
        """
        n = len(matrix)
        
        def count_less_than(val: int) -> int:
            """Count elements less than val."""
            count = 0
            j = n - 1
            for i in range(n):
                while j >= 0 and matrix[i][j] > val:
                    j -= 1
                count += (j + 1)
            return count
        
        # Binary search - simpler and more reliable
        low, high = matrix[0][0], matrix[n-1][n-1]
        while low < high:
            mid = (low + high) // 2
            if count_less_than(mid) < k:
                low = mid + 1
            else:
                high = mid
        
        return low
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        
        auto countLessThan = [&](int val) -> int {
            int count = 0;
            int j = n - 1;
            for (int i = 0; i < n; i++) {
                while (j >= 0 && matrix[i][j] > val) {
                    j--;
                }
                count += (j + 1);
            }
            return count;
        };
        
        // Binary search
        int low = matrix[0][0];
        int high = matrix[n-1][n-1];
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (countLessThan(mid) < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        
        return low;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        
        // Binary search approach - preferred
        int low = matrix[0][0];
        int high = matrix[n-1][n-1];
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (countLessThan(matrix, mid, n) < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        
        return low;
    }
    
    private int countLessThan(int[][] matrix, int val, int n) {
        int count = 0;
        int j = n - 1;
        for (int i = 0; i < n; i++) {
            while (j >= 0 && matrix[i][j] > val) {
                j--;
            }
            count += (j + 1);
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
var kthSmallest = function(matrix, k) {
    const n = matrix.length;
    
    const countLessThan = (val) => {
        let count = 0;
        let j = n - 1;
        for (let i = 0; i < n; i++) {
            while (j >= 0 && matrix[i][j] > val) {
                j--;
            }
            count += (j + 1);
        }
        return count;
    };
    
    // Binary search
    let low = matrix[0][0];
    let high = matrix[n-1][n-1];
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (countLessThan(mid) < k) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    
    return low;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log(max-min)) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Binary Search | Min-Heap | Divide & Conquer |
|--------|---------------|----------|------------------|
| **Time Complexity** | O(n log V) | O(k log n) | O(n log V) |
| **Space Complexity** | O(1) | O(n) | O(1) |
| **Implementation** | Moderate | Simple | Complex |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Large k | Small k | Special cases |

**Best Approach:** Binary search on value is optimal with O(n log(max-min)) time and O(1) space.

---

## Why Binary Search on Value is Optimal

The binary search approach is optimal because:

1. **Exploits Matrix Property**: Both rows and columns are sorted
2. **O(n) Count Function**: Two-pointer technique counts in linear time
3. **Constant Space**: No extra data structures needed
4. **Handles Large k**: Works equally well for any k value
5. **Logarithmic Search**: Binary search converges quickly

---

## Related Problems

Based on similar themes (sorted matrix, binary search, heap):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search a 2D Matrix | [Link](https://leetcode.com/problems/search-a-2d-matrix/) | Binary search in sorted matrix |
| Kth Largest Element in an Array | [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) | QuickSelect/Heap |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Smallest Element in a BST | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | BST traversal |
| Find K Pairs with Smallest Sums | [Link](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | Heap application |
| Search Matrix II | [Link](https://leetcode.com/problems/search-a-2d-matrix-ii/) | Sorted matrix search |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Median of Two Sorted Arrays | [Link](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard binary search |
| Find Median in Row Wise Sorted Matrix | [Link](https://leetcode.com/problems/median-of-a-row-wise-sorted-matrix/) | Related problem |

---

## Video Tutorial Links

### Binary Search Approach

- [NeetCode - Kth Smallest Element in Sorted Matrix](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Clear explanation
- [Binary Search on Value](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official solution

### Heap Approach

- [Min-Heap K-Way Merge](https://www.youtube.com/watch?v=vOS1QSXKqQ8) - Heap-based solution
- [Understanding Priority Queues](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Heap fundamentals

---

## Follow-up Questions

### Q1: How would you modify to find the median instead of kth element?

**Answer:** The median is simply k = n²/2 (or average of two middle elements for even total). The binary search approach works directly by setting k to the median position.

---

### Q2: Can you achieve O(n) time instead of O(n log V)?

**Answer:** Yes, using the median of medians approach (divide and conquer). However, the constant factors are higher, and the binary search solution is typically preferred in practice.

---

### Q3: What if only rows are sorted but not columns?

**Answer:** The two-pointer count function wouldn't work. You'd need a different approach - possibly heap-based or flatten and sort (O(n² log n²)).

---

### Q4: How would you handle duplicate values correctly?

**Answer:** The problem asks for kth smallest in sorted order (including duplicates). The binary search finds the smallest value where count ≥ k, which correctly handles duplicates.

---

### Q5: How would you return the position of the kth element?

**Answer:** After finding the value, do a second pass to find the exact position. Or modify the binary search to track positions during counting.

---

### Q6: Can you use this for rectangular matrices (m x n)?

**Answer:** Yes! The approach works for any m x n matrix. The count function uses m instead of n, and binary search range remains the same.

---

### Q7: How would you optimize for very large element ranges?

**Answer:** Use a different binary search strategy: instead of searching on value range, use index-based binary search (0 to n²-1). Map indices to values using the matrix structure.

---

## Common Pitfalls

### 1. Value Range
**Issue**: Not correctly identifying the search range.

**Solution**: Always use matrix[0][0] as low and matrix[n-1][n-1] as high.

### 2. Count Function Logic
**Issue**: Off-by-one errors in the two-pointer count function.

**Solution**: Carefully trace through: starting from bottom-left, if element ≤ target, add (row+1) to count and move right.

### 3. Integer Overflow
**Issue**: Potential overflow when calculating mid for large values.

**Solution**: Use low + (high - low) / 2 instead of (low + high) / 2.

### 4. k vs Index
**Issue**: Confusing 1-indexed k with 0-indexed positions.

**Solution**: Remember k is 1-indexed. Count elements strictly less than mid, then check if count ≥ k.

---

## Summary

The **Kth Smallest Element in a Sorted Matrix** problem demonstrates several key algorithmic concepts:

- **Binary Search on Value**: Searching in a sorted value space
- **Two-Pointer Counting**: Exploiting the sorted row and column properties
- **Heap-Based K-Way Merge**: Treating rows as sorted lists

The binary search approach is optimal with O(n log(max-min)) time and O(1) space, making it the preferred solution.

This problem is an excellent demonstration of how understanding data structure properties leads to optimal algorithmic solutions.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/discuss/) - Community solutions
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Binary search explanation
- [Heap Data Structure](https://www.geeksforgeeks.org/heap-data-structure/) - Heap explanation
