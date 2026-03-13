# Smallest Range Covering Elements from K Lists

## Problem Description

You have `k` lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the `k` lists.

We define the range `[a, b]` is smaller than range `[c, d]` if `b - a < d - c` or `a < c` if `b - a == d - c`.

**LeetCode Link:** [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/)

---

## Examples

**Example 1:**
```python
Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
Output: [20,24]
```

**Example 2:**
```python
Input: nums = [[1,2,3],[1,2,3],[1,2,3]]
Output: [1,1]
```

---

## Constraints

- `nums.length == k`
- `1 <= k <= 3500`
- `1 <= nums[i].length <= 50`
- `-10^5 <= nums[i][j] <= 10^5`
- `nums[i]` is sorted in non-decreasing order.

---

## Pattern: Heap-based Sliding Window

This problem uses a **Min-Heap** to maintain current elements from each list. Expand window, find range, advance smallest element.

### Core Concept

- **Min-Heap**: Always access smallest element from all lists
- **Sliding Window**: Maintain window covering all k lists
- **Range Tracking**: Track current max to compute range

---

## Intuition

The key insight for this problem is using a min-heap to efficiently explore all possible ranges:

1. **Initial Setup**:
   - Push first element from each list into min-heap
   - Track current maximum among all first elements
   - This gives us initial range [min, max]

2. **Iterative Process**:
   - Pop smallest element from heap (this is our current min)
   - Calculate range: [current_min, current_max]
   - If smaller than best, update best range
   - Advance the popped list by taking its next element
   - Update current_max if needed

3. **Why This Works**:
   - Min-heap gives us smallest element in O(log k)
   - Each iteration explores next possible range
   - Stop when any list is exhausted

4. **Time Complexity**:
   - Each element is pushed/popped once: O(n) where n = total elements
   - Heap operations: O(n log k)
   - Overall: O(n log k)

---

## Multiple Approaches with Code

We'll cover one main approach:

1. **Min-Heap** - Optimal solution

---

## Approach 1: Min-Heap (Optimal)

### Algorithm Steps

1. **Initialize**:
   - Push (value, list_index, element_index) for first element of each list
   - Track current_max among all first elements

2. **Iterate**:
   - While heap is not empty:
     - Pop smallest (val, list_idx, idx)
     - Calculate range: [val, current_max]
     - Update best range if smaller
     - If current list has more elements, push next
     - Update current_max
     - Else, break (can't cover all k lists)

3. **Return**: Best range found

### Why It Works

The algorithm systematically explores all potential ranges by:
- Always having one element from each list in our window
- Using min-heap to efficiently get the minimum
- Tracking maximum to compute range
- Advancing the smallest element to explore new ranges

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        k = len(nums)
        
        # Initialize heap with first element from each list
        min_heap = []
        current_max = float('-inf')
        
        for i in range(k):
            heapq.heappush(min_heap, (nums[i][0], i, 0))
            current_max = max(current_max, nums[i][0])
        
        # Track best range
        best_range = [float('-inf'), float('inf')]
        
        while min_heap:
            # Get smallest element
            val, list_idx, idx = heapq.heappop(min_heap)
            
            # Check current range
            current_range = current_max - val
            best_range_size = best_range[1] - best_range[0]
            
            if current_range < best_range_size:
                best_range = [val, current_max]
            
            # If this list is exhausted, can't cover all k lists
            if idx + 1 >= len(nums[list_idx]):
                break
            
            # Move to next element in this list
            next_val = nums[list_idx][idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, idx + 1))
            current_max = max(current_max, next_val)
        
        return best_range
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <climits>
using namespace std;

class Solution {
public:
    vector<int> smallestRange(vector<vector<int>>& nums) {
        int k = nums.size();
        
        // Min-heap: (value, list_index, element_index)
        priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> pq;
        int currentMax = INT_MIN;
        
        // Initialize with first element from each list
        for (int i = 0; i < k; i++) {
            pq.push({nums[i][0], i, 0});
            currentMax = max(currentMax, nums[i][0]);
        }
        
        // Track best range
        vector<int> bestRange = {INT_MIN, INT_MAX};
        
        while (!pq.empty()) {
            // Get smallest
            auto top = pq.top();
            pq.pop();
            int val = top[0], listIdx = top[1], idx = top[2];
            
            // Check current range
            int currentRange = currentMax - val;
            int bestRangeSize = bestRange[1] - bestRange[0];
            
            if (currentRange < bestRangeSize) {
                bestRange = {val, currentMax};
            }
            
            // If this list is exhausted
            if (idx + 1 >= nums[listIdx].size()) {
                break;
            }
            
            // Push next element
            int nextVal = nums[listIdx][idx + 1];
            pq.push({nextVal, listIdx, idx + 1});
            currentMax = max(currentMax, nextVal);
        }
        
        return bestRange;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> smallestRange(List<List<Integer>> nums) {
        int k = nums.size();
        
        // Min-heap
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        int currentMax = Integer.MIN_VALUE;
        
        // Initialize
        for (int i = 0; i < k; i++) {
            pq.offer(new int[]{nums.get(i).get(0), i, 0});
            currentMax = Math.max(currentMax, nums.get(i).get(0));
        }
        
        // Track best
        int[] bestRange = {Integer.MIN_VALUE, Integer.MAX_VALUE};
        
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int val = top[0], listIdx = top[1], idx = top[2];
            
            int currentRange = currentMax - val;
            int bestRangeSize = bestRange[1] - bestRange[0];
            
            if (currentRange < bestRangeSize) {
                bestRange[0] = val;
                bestRange[1] = currentMax;
            }
            
            // Check if list exhausted
            if (idx + 1 >= nums.get(listIdx).size()) {
                break;
            }
            
            int nextVal = nums.get(listIdx).get(idx + 1);
            pq.offer(new int[]{nextVal, listIdx, idx + 1});
            currentMax = Math.max(currentMax, nextVal);
        }
        
        return Arrays.asList(bestRange[0], bestRange[1]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} nums
 * @return {number[]}
 */
var smallestRange = function(nums) {
    const k = nums.length;
    
    // Min-heap
    const pq = [];
    let currentMax = -Infinity;
    
    // Initialize with first element from each list
    for (let i = 0; i < k; i++) {
        pq.push([nums[i][0], i, 0]);
        currentMax = Math.max(currentMax, nums[i][0]);
    }
    
    // Sort initially for proper heap
    pq.sort((a, b) => a[0] - b[0]);
    
    // Track best range
    let bestRange = [-Infinity, Infinity];
    
    while (pq.length > 0) {
        // Get smallest
        const [val, listIdx, idx] = pq.shift();
        
        // Check current range
        const currentRange = currentMax - val;
        const bestRangeSize = bestRange[1] - bestRange[0];
        
        if (currentRange < bestRangeSize) {
            bestRange = [val, currentMax];
        }
        
        // If this list is exhausted
        if (idx + 1 >= nums[listIdx].length) {
            break;
        }
        
        // Push next element
        const nextVal = nums[listIdx][idx + 1];
        pq.push([nextVal, listIdx, idx + 1]);
        currentMax = Math.max(currentMax, nextVal);
        
        // Re-sort (simulating heap push + heapify)
        pq.sort((a, b) => a[0] - b[0]);
    }
    
    return bestRange;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) where n is total elements |
| **Space** | O(k) for heap |

---

## Approach 2: Priority Queue with Custom Comparator

### Algorithm Steps

1. Use custom comparator instead of default heap
2. Track both current element and its list index
3. Similar expansion and contraction process

### Why It Works

Same algorithm, different implementation using custom comparators for clarity.

### Code Implementation

`````carousel
```python
# Alternative with custom heap comparator
# Same logic, different implementation
```
``"

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) where n is total elements |
| **Space** | O(k) for heap |

---

## Comparison of Approaches

| Aspect | Min-Heap |
|--------|----------|
| **Time Complexity** | O(n log k) |
| **Space Complexity** | O(k) |
| **Implementation** | Moderate |
| **LeetCode Optimal** | ✅ |
| **Difficulty** | Hard |

**Best Approach:** Use the min-heap approach as shown.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge K Sorted Lists | [Link](https://leetcode.com/problems/merge-k-sorted-lists/) | Heap with k lists |
| Kth Smallest Element in a Sorted Matrix | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Heap 2D |

---

## Video Tutorial Links

1. **[NeetCode - Smallest Range](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Heap Data Structure](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding heaps

---

## Follow-up Questions

### Q1: How would you find all ranges, not just the smallest?

**Answer:** Store all ranges during iteration, not just update the best.

---

### Q2: Can you solve without heap?

**Answer:** Yes, but it would be less efficient. Could use pointers and linear scan.

---

### Q3: How does this relate to merging k sorted lists?

**Answer:** Similar technique - using heap to efficiently process k sorted sequences.

---

## Common Pitfalls

### 1. Initial Max Tracking
**Issue**: Not tracking current maximum properly.

**Solution**: Initialize with first element of each list and update when advancing.

### 2. Stop Condition
**Issue**: Not stopping when a list is exhausted.

**Solution**: Break when any list is exhausted - can't cover all k lists.

### 3. Range Calculation
**Issue**: Using wrong values for range.

**Solution**: Range = [current_min, current_max], size = max - min.

### 4. Heap Element Format
**Issue**: Not storing enough information in heap.

**Solution**: Store (value, list_index, element_index) to know where to advance.

---

## Summary

The **Smallest Range Covering Elements from K Lists** problem demonstrates:
- **Heap-based exploration**: Using min-heap to efficiently explore ranges
- **Sliding window**: Maintaining window covering all k lists
- **Optimal exploration**: Each iteration advances one list

Key takeaways:
1. Initialize heap with first element from each list
2. Track current max to compute range
3. Advance the smallest element to explore new ranges
4. Stop when any list is exhausted

This problem is essential for understanding heap-based algorithms with multiple sorted sequences.

---

### Pattern Summary

This problem exemplifies the **Heap-based Sliding Window** pattern, characterized by:
- Using heap to process multiple sorted sequences
- Maintaining window covering all sequences
- Efficient exploration of solution space
- O(n log k) time complexity

For more details on this pattern, see the **[Heap Pattern](/patterns/heap)**.
