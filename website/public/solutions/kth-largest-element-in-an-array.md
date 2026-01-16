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

**Explanation:** The sorted array is `[1,2,3,4,5,6]`. The 2nd largest element is `5`.

### Example 2

| Input | Output |
|-------|--------|
| `nums = [3,2,3,1,2,4,5,5,6], k = 4` | `4` |

**Explanation:** The sorted array is `[1,2,3,4,5,5,6]`. The 4th largest element is `4`.

### Example 3 (Edge Case)

| Input | Output |
|-------|--------|
| `nums = [1], k = 1` | `1` |

**Explanation:** Single element array, the 1st largest is the only element.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ k ≤ nums.length ≤ 10^5` | Array size bounds |
| `-10^4 ≤ nums[i] ≤ 10^4` | Element value range |
| Time limit: 1 second | Performance requirement |
| Memory limit: 256 MB | Memory constraint |

---

## Intuition

The problem asks for the kth largest element, which is equivalent to finding the (n-k)th smallest element where n is the array length. Several approaches exist:

1. **Sorting**: Direct but inefficient for large arrays
2. **Heap**: Maintain k largest elements efficiently  
3. **QuickSelect**: Divide-and-conquer for average O(n) performance

The key insight is that we don't need to fully sort the array - we just need to find the element that would be at position k when sorted in descending order.

---

## Solution Approaches

### Approach 1: Heap-Based Solution (Recommended)

Use a min-heap to maintain the k largest elements seen so far. The smallest element in the heap will be the kth largest overall.

#### Explanation
1. **Initialize an empty min-heap** to store the k largest elements
2. **Iterate through each number** in the array:
   - Push the number onto the heap
   - If heap size exceeds k, pop the smallest element
3. **After processing all elements**, the heap contains exactly k elements - the k largest
4. **Return the heap's root**, which is the smallest among the k largest (i.e., the kth largest overall)

#### Why This Works
- The heap always contains the k largest elements seen so far
- When a new element arrives:
  - If it's smaller than the heap's root, it won't affect the top k
  - If it's larger, it pushes out the current kth largest element
- The root represents the boundary between the top k and the rest

#### Python Implementation
```python
import heapq
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Using heapq (min-heap by default)
        # Time: O(n log k), Space: O(k)
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]

# Alternative: Using heapq.nlargest (more concise)
class Solution2:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]
```

---

### Approach 2: QuickSelect (Average O(n))

Use the QuickSelect algorithm (a variant of QuickSort) to find the kth largest element without fully sorting the array.

#### Explanation
1. **Convert to kth smallest**: kth largest = (n-k)th smallest where n = len(nums)
2. **Random pivot selection**: Choose a random pivot to avoid worst-case O(n²) behavior
3. **Partition**: Rearrange array so elements < pivot are left, elements > pivot are right
4. **Recursion**: 
   - If pivot position = target, we found it
   - If target < pivot position, search left half
   - If target > pivot position, search right half

#### Why This Works
- QuickSelect is a divide-and-conquer algorithm similar to QuickSort
- It recursively narrows down the search space
- Average case is O(n) because each partition reduces the problem size by a constant factor
- Worst case is O(n²) but unlikely with random pivot

#### Python Implementation
```python
import random
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        QuickSelect algorithm for finding kth largest element.
        Time: O(n) average, O(n²) worst case
        Space: O(log n) for recursion stack
        """
        n = len(nums)
        target = n - k  # Convert to kth smallest
        
        def partition(left: int, right: int, pivot_idx: int) -> int:
            pivot = nums[pivot_idx]
            # Move pivot to end
            nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
            store_idx = left
            
            for i in range(left, right):
                if nums[i] < pivot:
                    nums[store_idx], nums[i] = nums[i], nums[store_idx]
                    store_idx += 1
            
            # Move pivot to its final place
            nums[store_idx], nums[right] = nums[right], nums[store_idx]
            return store_idx
        
        def quickSelect(left: int, right: int) -> int:
            if left == right:
                return nums[left]
            
            # Random pivot
            pivot_idx = random.randint(left, right)
            pivot_idx = partition(left, right, pivot_idx)
            
            if pivot_idx == target:
                return nums[pivot_idx]
            elif pivot_idx < target:
                return quickSelect(pivot_idx + 1, right)
            else:
                return quickSelect(left, pivot_idx - 1)
        
        return quickSelect(0, len(nums) - 1)
```

---

### Approach 3: Sorting (Simple but O(n log n))

Sort the array and return the kth largest element. Simple but not optimal for large arrays.

#### Algorithm
```python
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Sort in descending order
        nums.sort(reverse=True)
        return nums[k - 1]
```

#### Explanation
1. Sort the array in descending order
2. Return the element at index k-1 (0-based indexing)

#### Why This Works
- After sorting in descending order, the array is: [largest, 2nd largest, ..., kth largest, ...]
- The kth largest element is at index k-1

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Heap-Based** | O(n log k) | O(k) | General case, streaming data |
| **QuickSelect** | O(n) average, O(n²) worst | O(log n) recursion | One-time queries, no extra space |
| **Sorting** | O(n log n) | O(1) or O(n) | Small arrays, simplicity preferred |

### Detailed Comparison

#### Heap-Based Approach
- **Time**: O(n log k) - Each of n elements requires a heap push (O(log k)), and occasional pop (O(log k))
- **Space**: O(k) - Only stores k elements in the heap
- **Advantages**: Works well for streaming data, guaranteed O(n log k) performance
- **Disadvantages**: Slightly more complex than sorting

#### QuickSelect Approach
- **Time**: O(n) average case, O(n²) worst case (rare with random pivot)
- **Space**: O(log n) - Recursion stack depth
- **Advantages**: Best average performance, in-place possible
- **Disadvantages**: Worst case can be bad, recursive implementation

#### Sorting Approach
- **Time**: O(n log n) - Standard sort complexity
- **Space**: O(1) for in-place sort, O(n) for some languages
- **Advantages**: Simple, reliable, easy to understand
- **Disadvantages**: Not optimal when we only need kth element

---

## Real-World Applications

1. **Order Statistics**: Finding median, percentiles, quartiles
2. **Recommendation Systems**: Finding top-k items by rating
3. **Data Streaming**: Maintaining k largest values in a stream
4. **Statistical Analysis**: Finding outliers or extreme values
5. **Load Balancing**: Finding k busiest servers

---

## Related Problems

| Problem | Difficulty | Relation |
|---------|------------|----------|
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Medium | Uses two heaps, related concept |
| [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | Streaming version of this problem |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | Similar heap approach |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) | Medium | Uses heap for top-k |
| [Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | Medium | Heap-based k selection |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Medium | Extended k selection problem |
| [Kth Largest Element in a BST](https://leetcode.com/problems/kth-largest-element-in-a-bst/) | Medium | Tree-based variant |

---

## Video Tutorials

1. **NeetCode - Kth Largest Element in an Array**
   - YouTube: https://www.youtube.com/watch?v=XEmAW13BQhQ
   - Covers heap approach with detailed explanation

2. **William Fiset - Kth Largest Element**
   - YouTube: https://www.youtube.com/watch?v=aXJ-p3Qva4c
   - Comprehensive heap-based solution explanation

3. **Abdul Bari - QuickSelect Algorithm**
   - YouTube: https://www.youtube.com/watch?v=hpZ16g1b6T0
   - Detailed QuickSelect explanation

4. **LeetCode Official Solution**
   - YouTube: https://www.youtube.com/watch?v=hW8PrQrvMNc
   - Multiple approaches comparison

---

## Follow-up Questions & Challenges

### Basic Follow-ups
1. **What if we need to find the kth smallest element instead?**
   - Solution: Use max-heap instead of min-heap, or find (n-k+1)th largest

2. **How would you handle duplicate values?**
   - The algorithm naturally handles duplicates - it counts all occurrences

3. **What if k = 1 or k = n?**
   - k=1: Find maximum using heap (keep 1 element)
   - k=n: Find minimum using heap (keep n elements = entire array)

### Advanced Follow-ups
4. **Can you implement QuickSelect iteratively to avoid recursion?**
   ```python
   def findKthLargest(self, nums: List[int], k: int) -> int:
       target = len(nums) - k
       left, right = 0, len(nums) - 1
       
       while left <= right:
           pivot_idx = random.randint(left, right)
           pivot_idx = self.partition(nums, left, right, pivot_idx)
           
           if pivot_idx == target:
               return nums[pivot_idx]
           elif pivot_idx < target:
               left = pivot_idx + 1
           else:
               right = pivot_idx - 1
       
       return nums[left]
   ```

5. **How would you optimize for the case where array is mostly sorted?**
   - Use heap-based approach which adapts to partially sorted data
   - QuickSelect may perform worse on nearly sorted data

6. **Design a data structure that supports:**
   - `add(num)`: Add a number
   - `findKthLargest(k)`: Return kth largest
   - Both in O(log n) time?
   - Solution: Use two heaps (min-heap for top k, max-heap for rest)

7. **What if we need the top k largest elements (not just one)?**
   - Solution: Use heap with size k, return entire heap contents
   - Or use heapq.nlargest(k, nums)

8. **How would you solve this in external memory (data too large for RAM)?**
   - Solution: External selection algorithm using sampling and partitioning
   - Use disk-based QuickSelect or heap-based streaming

---

## Implementation Tips

### Python Tips
- Use `heapq` module for min-heap operations
- `heapq.heappush()` and `heapq.heappop()` are O(log n)
- `heapq.nlargest(k, nums)` is convenient but less memory efficient

---

## Summary

The **Kth Largest Element in an Array** problem has multiple solution approaches:

1. **Heap-Based (Recommended)**: O(n log k) time, O(k) space - Best balance of performance and simplicity
2. **QuickSelect**: O(n) average time, O(log n) space - Best average performance
3. **Sorting**: O(n log n) time, O(1) space - Simplest but not optimal

For most cases, the heap-based approach is recommended due to its:
- Guaranteed O(n log k) performance
- Simple implementation
- Adaptability to streaming data
- Low space complexity

QuickSelect is preferred when:
- Single query on static array
- Average case performance is critical
- Memory is extremely limited

Avoid sorting for large arrays when you only need the kth element, as it performs unnecessary work.

---

**LeetCode Problem**: [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Problem Link**: https://leetcode.com/problems/kth-largest-element-in-an-array/
