# Median of Two Sorted Arrays - Comprehensive Solution

## 📋 Problem Description

Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be `O(log(m+n))`.

The median is the middle value in an ordered integer list. If the size of the list is even, the median is the mean of the two middle values.

---

## 🔍 Examples

### Example 1
**Input:** `nums1 = [1,3]`, `nums2 = [2]`

**Output:** `2.00000`

**Explanation:** The merged and sorted array is `[1,2,3]`, and since it has an odd number of elements (3), the median is the middle element which is `2`.

### Example 2
**Input:** `nums1 = [1,2]`, `nums2 = [3,4]`

**Output:** `2.50000`

**Explanation:** The merged and sorted array is `[1,2,3,4]`, and since it has an even number of elements (4), the median is the average of the two middle elements: `(2 + 3) / 2 = 2.5`.

### Example 3
**Input:** `nums1 = []`, `nums2 = [1]`

**Output:** `1.00000`

**Explanation:** When one array is empty, the median is simply the median of the non-empty array.

### Example 4
**Input:** `nums1 = [2]`, `nums2 = [1,3,4,5,6]`

**Output:** `4.00000`

**Explanation:** The merged array is `[1,2,3,4,5,6]` and the median is `4`.

---

## 📏 Constraints

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

---

## 💡 Intuition

The key insight is that we don't need to actually merge the two arrays to find the median. Instead, we can use a **divide and conquer** approach with binary search.

### Why Binary Search?
- We need to achieve `O(log(m+n))` time complexity
- Binary search on a sorted array gives us `O(log n)` complexity
- We can apply binary search to find the correct partition point

### Key Concept: Partition
We need to find a way to partition both arrays such that:
1. All elements on the left side of both partitions are less than or equal to all elements on the right side
2. The total number of elements on the left equals (or is one more than) the total on the right

---

## 🚀 Multiple Approaches

### Approach 1: Brute Force (Merge and Find)
**Idea:** Merge both arrays into one sorted array and find the median.

**Time Complexity:** O(m+n)  
**Space Complexity:** O(m+n)

```python
from typing import List

class Solution:
    def findMedianSortedArrays_bruteforce(self, nums1: List[int], nums2: List[int]) -> float:
        """
        Brute force approach: Merge arrays and find median.
        
        Args:
            nums1: First sorted array
            nums2: Second sorted array
            
        Returns:
            float: The median value
        """
        merged = []
        i, j = 0, 0
        
        # Merge two sorted arrays
        while i < len(nums1) and j < len(nums2):
            if nums1[i] <= nums2[j]:
                merged.append(nums1[i])
                i += 1
            else:
                merged.append(nums2[j])
                j += 1
        
        # Add remaining elements
        while i < len(nums1):
            merged.append(nums1[i])
            i += 1
        
        while j < len(nums2):
            merged.append(nums2[j])
            j += 1
        
        # Find median
        n = len(merged)
        if n % 2 == 1:
            return float(merged[n // 2])
        else:
            return (merged[n // 2 - 1] + merged[n // 2]) / 2.0
```

**Explanation:** This approach simply merges both arrays like in merge sort and then finds the median. It's straightforward but not optimal for large arrays.

---

### Approach 2: Binary Search (Optimal Solution) ✨
**Idea:** Use binary search on the smaller array to find the correct partition.

**Time Complexity:** O(log(min(m,n)))  
**Space Complexity:** O(1)

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        """
        Optimal binary search solution for median of two sorted arrays.
        
        Args:
            nums1: First sorted array
            nums2: Second sorted array
            
        Returns:
            float: The median value
            
        Raises:
            ValueError: If input arrays are not sorted
        """
        # Ensure nums1 is the smaller array for efficiency
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        
        m, n = len(nums1), len(nums2)
        total = m + n
        half = (total + 1) // 2  # Elements in left partition
        
        left, right = 0, m  # Binary search range on nums1
        
        while left <= right:
            # Partition nums1 at i, nums2 at j
            i = (left + right) // 2
            j = half - i
            
            # Edge cases: use infinities when partition is at boundaries
            nums1_left = nums1[i-1] if i > 0 else float('-inf')
            nums1_right = nums1[i] if i < m else float('inf')
            nums2_left = nums2[j-1] if j > 0 else float('-inf')
            nums2_right = nums2[j] if j < n else float('inf')
            
            # Check if we found the correct partition
            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                # Correct partition found
                if total % 2 == 1:
                    # Odd total: median is max of left elements
                    return max(nums1_left, nums2_left)
                else:
                    # Even total: median is average of max left and min right
                    left_max = max(nums1_left, nums2_left)
                    right_min = min(nums1_right, nums2_right)
                    return (left_max + right_min) / 2.0
            
            elif nums1_left > nums2_right:
                # Too many elements from nums1 on left, need to move left
                right = i - 1
            else:
                # Not enough elements from nums1 on left, need to move right
                left = i + 1
        
        raise ValueError("Input arrays are not sorted")
```

**Detailed Explanation:**

1. **Ensure smaller array first:** We swap arrays if needed to make `nums1` the smaller one, minimizing the binary search range.

2. **Binary search setup:** We search for partition `i` in `nums1`, which determines partition `j` in `nums2`.

3. **Partition conditions:**
   - `nums1_left <= nums2_right`: All left elements are ≤ all right elements across arrays
   - `nums2_left <= nums1_right`: Symmetric condition

4. **Median calculation:**
   - Odd total: Return `max(nums1_left, nums2_left)` (the middle element)
   - Even total: Return average of `max(left)` and `min(right)`

5. **Binary search adjustment:**
   - If `nums1_left > nums2_right`: Move partition left in nums1
   - Otherwise: Move partition right in nums1

---

### Approach 3: Two Heaps (Streaming Approach)
**Idea:** Use two heaps to maintain the median as we merge the arrays.

**Time Complexity:** O(m+n)  
**Space Complexity:** O(m+n)

```python
import heapq
from typing import List

class Solution:
    def findMedianSortedArrays_two_heaps(self, nums1: List[int], nums2: List[int]) -> float:
        """
        Two heaps approach for median finding.
        
        Args:
            nums1: First sorted array
            nums2: Second sorted array
            
        Returns:
            float: The median value
        """
        # Merge using two heaps approach
        def two_heaps_merge(nums1, nums2):
            small = []  # max-heap (negative values)
            large = []  # min-heap
            
            for num in nums1 + nums2:
                heapq.heappush(small, -num)
                heapq.heappush(large, -heapq.heappop(small))
                
                if len(large) > len(small):
                    heapq.heappush(small, -heapq.heappop(large))
            
            # Extract sorted elements
            result = []
            while small:
                result.append(-heapq.heappop(small))
            
            return result
        
        merged = two_heaps_merge(nums1, nums2)
        n = len(merged)
        
        if n % 2 == 1:
            return float(merged[n // 2])
        else:
            return (merged[n // 2 - 1] + merged[n // 2]) / 2.0
```

---

### Approach 4: Kth Element Approach (Generalization)
**Idea:** Find the kth smallest element in both arrays and use it to find the median.

**Time Complexity:** O(log(k))  
**Space Complexity:** O(1)

```python
from typing import List

class Solution:
    def find_kth_element(self, nums1: List[int], nums2: List[int], k: int) -> float:
        """
        Find the kth smallest element in two sorted arrays.
        
        Args:
            nums1: First sorted array
            nums2: Second sorted array
            k: The kth position (1-based)
            
        Returns:
            float: The kth smallest element
        """
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        
        if k > len(nums1) + len(nums2) or k < 1:
            raise ValueError("Invalid k value")
        
        low, high = max(0, k - len(nums2)), min(k, len(nums1))
        
        while low <= high:
            i = (low + high) // 2
            j = k - i
            
            a_left = nums1[i-1] if i > 0 else float('-inf')
            a_right = nums1[i] if i < len(nums1) else float('inf')
            b_left = nums2[j-1] if j > 0 else float('-inf')
            b_right = nums2[j] if j < len(nums2) else float('inf')
            
            if a_left <= b_right and b_left <= a_right:
                return max(a_left, b_left)
            elif a_left > b_right:
                high = i - 1
            else:
                low = i + 1
        
        raise ValueError("Arrays not sorted or invalid k")
    
    def findMedianSortedArrays_kth(self, nums1: List[int], nums2: List[int]) -> float:
        """
        Find median using the kth element approach.
        
        Args:
            nums1: First sorted array
            nums2: Second sorted array
            
        Returns:
            float: The median value
        """
        m, n = len(nums1), len(nums2)
        total = m + n
        
        if total % 2 == 1:
            # Odd: find (total//2 + 1)th element
            return self.find_kth_element(nums1, nums2, total // 2 + 1)
        else:
            # Even: find two middle elements and average
            left = self.find_kth_element(nums1, nums2, total // 2)
            right = self.find_kth_element(nums1, nums2, total // 2 + 1)
            return (left + right) / 2.0
```

---

## ⏱️ Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Brute Force (Merge) | O(m+n) | O(m+n) | Simple cases, small arrays |
| Binary Search (Optimal) | O(log(min(m,n))) | O(1) | **Production use, large arrays** |
| Two Heaps | O(m+n) | O(m+n) | Streaming data |
| Kth Element | O(log(k)) | O(1) | Finding any kth element |

### Why Binary Search is Optimal:
- **Logarithmic time:** `O(log(min(m,n)))` is the theoretical lower bound for this problem
- **Constant space:** Only uses a few variables, no additional data structures
- **Scalable:** Works efficiently even for maximum input sizes (1000 elements each)

---

## 🎯 Related Problems

| Problem | Difficulty | Related Concept |
|---------|------------|-----------------|
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Medium | Two heaps for median |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | Kth element selection |
| [Sliding Window Median](https://leetcode.com/problems/sliding-window-median/) | Hard | Median in dynamic window |
| [Find the Kth Smallest Sum of Two Arrays](https://leetcode.com/problems/find-the-kth-smallest-sum-of-two-sorted-arrays/) | Hard | Kth smallest sums |
| [Median of Two Sorted Arrays of Different Sizes](https://www.geeksforgeeks.org/median-of-two-sorted-arrays-of-different-sizes/) | Hard | Variant with different sizes |

---

## 📺 Video Tutorial Links

1. **[NeetCode - Median of Two Sorted Arrays](https://www.youtube.com/watch?v=q6IEA26tjXc)** - Excellent visual explanation with animations
2. **[Abdul Bari - Median of Two Sorted Arrays](https://www.youtube.com/watch?v=LPFhl5R5weI)** - Detailed algorithm explanation
3. **[Back to Back SWE](https://www.youtube.com/watch?v=1Pnt-9g7n9Q)** - Comprehensive walkthrough
4. **[TechDiffer - Binary Search Approach](https://www.youtube.com/watch?v=ScCgIqvSJWg)** - Step-by-step implementation
5. **[Interview Kickstart](https://www.interviewkickstart.com/learn/median-of-two-sorted-arrays-leetcode-problem)** - Professional preparation content

---

## ❓ Follow-up Questions

### Easy Follow-ups
1. **What if the arrays can contain duplicate elements?**
   - The algorithm still works correctly since we're using comparisons, not uniqueness

2. **How would you handle very large numbers (potential overflow)?**
   - Use Python's arbitrary precision integers or handle division carefully
   - In languages like C++, use `long long` for calculations

3. **What if one array is empty?**
   - The algorithm handles this with boundary checks using infinities

### Medium Follow-ups
4. **How would you modify the solution to find the mean of two sorted arrays?**
   - Calculate mean as `sum(nums1) + sum(nums2) / (m + n)`

5. **Can you find the mode (most frequent element) of two sorted arrays?**
   - Merge and count frequencies, tracking the maximum

### Hard Follow-ups
6. **How would you find the median of k sorted arrays?**
   - Use a min-heap to merge k arrays or apply divide and conquer recursively

7. **How would you handle this problem if the arrays were in a circular buffer?**
   - Need to handle wrap-around indices and adjust partition logic

8. **How would you modify the solution to find the median of two sorted arrays in O(1) space without binary search?**
   - Not possible with better than O(log n) time complexity in the general case

9. **How would you implement a solution that finds all percentiles (25th, 50th, 75th) efficiently?**
   - Modify the partition logic to find multiple partition points simultaneously

10. **How would you handle this in a distributed system with very large arrays?**
    - Use MapReduce to find global partition points, then combine results

---

## 🏆 Key Takeaways

1. **Binary search is optimal:** Achieves O(log(min(m,n))) time complexity
2. **Partition logic is crucial:** Finding the correct split point is the heart of the solution
3. **Edge cases matter:** Empty arrays, single elements, odd/even lengths
4. **Space efficiency:** The optimal solution uses only O(1) additional space
5. **Generalization:** The same approach can find any kth element