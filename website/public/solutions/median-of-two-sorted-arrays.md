# Median Of Two Sorted Arrays

## Problem Description

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`.

### Example 1

**Input:** `nums1 = [1,3]`, `nums2 = [2]`

**Output:** `2.00000`

**Explanation:** Merged array = `[1,2,3]` and median is `2`.

### Example 2

**Input:** `nums1 = [1,2]`, `nums2 = [3,4]`

**Output:** `2.50000`

**Explanation:** Merged array = `[1,2,3,4]` and median is `(2 + 3) / 2 = 2.5`.

### Constraints

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

---

## Intuition

The median of a sorted array divides it into two equal parts. For two sorted arrays, the goal is to find a partition that divides both arrays such that:
1. All elements on the left are ≤ all elements on the right
2. The number of elements on the left is equal to or one more than on the right (for odd totals)

This allows us to find the median without merging the entire arrays, achieving logarithmic time complexity.

---

## Approach 1: Binary Search (Optimal - Iterative)

### Solution Code

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        m, n = len(nums1), len(nums2)
        total = m + n
        half = (total + 1) // 2
        left, right = 0, m

        while left <= right:
            i = (left + right) // 2
            j = half - i

            nums1_left = nums1[i-1] if i > 0 else float('-inf')
            nums1_right = nums1[i] if i < m else float('inf')
            nums2_left = nums2[j-1] if j > 0 else float('-inf')
            nums2_right = nums2[j] if j < n else float('inf')

            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                if total % 2 == 1:
                    return max(nums1_left, nums2_left)
                else:
                    return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
            elif nums1_left > nums2_right:
                right = i - 1
            else:
                left = i + 1

        raise ValueError("Input arrays are not sorted")
```

### Explanation

1. **Ensure `nums1` is the smaller array** for efficiency.
2. **Binary search on `nums1`:** Find the correct partition `i` such that the left partition has `(m+n+1)/2` elements.
3. **Calculate partition for `nums2`:** `j = half - i`
4. **Check partition validity:** `nums1[i-1] <= nums2[j]` and `nums2[j-1] <= nums1[i]`
5. **Calculate median:**
   - For odd total: median is `max` of left elements
   - For even total: median is `average` of `max` left and `min` right
6. **Adjust search:** If `nums1[i-1] > nums2[j]`, search left; else, search right

### Complexity Analysis

- **Time Complexity:** O(log(min(m,n))), binary search on the smaller array
- **Space Complexity:** O(1), using only a few variables

### Why This Works: Deep Dive

The key insight behind this binary search solution is treating the problem as finding a **partition point** rather than explicitly merging arrays. Here's why this works:

**The Median Property:**
For any sorted array of length L, the median position is at index L/2 (0-indexed). The median splits the array into two equal halves where:
- All elements in the left half ≤ all elements in the right half

**Extending to Two Arrays:**
When we have two sorted arrays, we need to find a partition in each array such that:
1. The total number of elements on the left equals the total on the right (or differs by 1)
2. All elements in the left partition ≤ all elements in the right partition

**The Magic of Partitioning:**
If we denote:
- `i` = number of elements taken from `nums1` for the left partition
- `j` = number of elements taken from `nums2` for the left partition

Then we need: `i + j = (m + n + 1) // 2` (for odd totals) or the floor of half for even.

The conditions for a valid partition are:
- `nums1[i-1] ≤ nums2[j]` (last element of left partition from nums1 ≤ first element of right partition from nums2)
- `nums2[j-1] ≤ nums1[i]` (last element of left partition from nums2 ≤ first element of right partition from nums1)

If both conditions are true, we've found the correct partition and can compute the median directly.

**Binary Search on the Partition:**
Instead of trying all possible partitions (which would be O(m+n)), we binary search on the partition index `i` in the smaller array. This gives us O(log(min(m,n))) time because:
- The partition in `nums2` is determined by `j = half - i`
- We only need to find the correct `i`, and `j` follows
- Binary search eliminates half the search space in each iteration

### Step-by-Step Example

Let's walk through `nums1 = [1, 3]` and `nums2 = [2, 4]`:

**Step 1: Ensure nums1 is smaller (already true)**
```
nums1 = [1, 3]    # m = 2
nums2 = [2, 4]    # n = 2
```

**Step 2: Initialize binary search**
```
left = 0, right = 2
half = (2 + 2 + 1) // 2 = 2
```

**Step 3: First iteration**
```
i = (0 + 2) // 2 = 1
j = 2 - 1 = 1

nums1_left  = nums1[0] = 1
nums1_right = nums1[1] = 3
nums2_left  = nums2[0] = 2
nums2_right = nums2[1] = 4

Check: nums1_left (1) ≤ nums2_right (4)? ✓
Check: nums2_left (2) ≤ nums1_right (3)? ✓

Valid partition found! Total is even, so median = (max left + min right) / 2
max(left) = max(1, 2) = 2
min(right) = min(3, 4) = 3
median = (2 + 3) / 2 = 2.5
```

### Partition Logic Visualization

```
nums1 = [1, 3, 5, 7]
nums2 = [2, 4, 6, 8]

After finding partition i=2, j=3:

nums1:  [1, 3 | 5, 7]
             ↑    ↑
           i-1   i

nums2:  [2, 4, 6 | 8]
                ↑    ↑
              j-1   j

Left partition:  [1, 3, 2, 4, 6]
Right partition: [5, 7, 8]

All left ≤ All right ✓
Count: left = 5, right = 3 (for odd total of 8)
```

### Why We Swap Arrays

We swap arrays to ensure `nums1` is the smaller one. This is crucial for efficiency:

1. **Binary Search Range:** We binary search on `nums1`, so the search range is `[0, m]`. If we searched on the larger array, we'd have more iterations.

2. **Proof:** 
   - Without swap: O(log(max(m,n)))
   - With swap: O(log(min(m,n)))
   
   Since log(min(m,n)) ≤ log(max(m,n)), this optimization is always beneficial.

3. **Edge Case Handling:** When one array is much smaller than the other, swapping ensures we don't have empty partitions on one side during binary search.

### Boundary Conditions and Edge Cases

**Case 1: Empty array in partition**
```python
nums1_left = nums1[i-1] if i > 0 else float('-inf')
```
When `i = 0`, there's no element to the left of the partition in `nums1`. We use `-∞` to ensure the condition `nums1_left ≤ nums2_right` always passes.

**Case 2: Entire array in left partition**
```python
nums1_right = nums1[i] if i < m else float('inf')
```
When `i = m`, there's no element to the right of the partition in `nums1`. We use `+∞` to ensure the condition `nums2_left ≤ nums1_right` always passes.

**Case 3: Odd vs Even total**
- **Odd total:** Median is the maximum of all left elements (the last element of the combined left partition)
- **Even total:** Median is the average of max(left) and min(right)

### Time Complexity Derivation

The binary search runs on the smaller array of size `min(m, n)`:

1. **Initial search space:** `[0, m]` where `m = min(len(nums1), len(nums2))`
2. **Each iteration:** Reduces search space by half
3. **Number of iterations:** `⌈log₂(m + 1)⌉` ≈ `O(log m)`

Since `m = min(m, n)`, the time complexity is `O(log(min(m, n)))`.

### Common Pitfalls

**1. Off-by-one errors in partition calculation**
```python
# Correct: half includes the middle element for odd totals
half = (total + 1) // 2

# Wrong: Would give wrong partition for odd totals
half = total // 2
```

**2. Incorrect boundary values**
Using `None` or `float('inf')` incorrectly can cause comparison failures. Always use:
- `-float('inf')` for non-existent left boundary
- `+float('inf')` for non-existent right boundary

**3. Not swapping arrays when nums1 is larger**
This causes the binary search to run on the wrong array, increasing time complexity.

**4. Integer division vs float division**
```python
# For Python 3, use true division for median
return (max(left) + min(right)) / 2  # Correct
# return (max(left) + min(right)) // 2  # Wrong - integer division
```

**5. Forgetting to handle empty arrays**
The algorithm naturally handles empty arrays due to boundary conditions, but edge cases like `nums1 = []` and `nums2 = [1]` work correctly because `i = 0` and `j = 1`, giving `nums1_left = -inf`, `nums1_right = inf`, `nums2_left = 1`, `nums2_right = inf`.

---

## Approach 4: Binary Search (Recursive)

### Solution Code

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        
        m, n = len(nums1), len(nums2)
        total = m + n
        
        return self._find_median(nums1, nums2, 0, m, total)
    
    def _find_median(self, nums1: List[int], nums2: List[int], left: int, right: int, total: int) -> float:
        if left > right:
            raise ValueError("Input arrays are not sorted")
            
        i = (left + right) // 2
        j = (total + 1) // 2 - i
        
        nums1_left = nums1[i-1] if i > 0 else float('-inf')
        nums1_right = nums1[i] if i < len(nums1) else float('inf')
        nums2_left = nums2[j-1] if j > 0 else float('-inf')
        nums2_right = nums2[j] if j < len(nums2) else float('inf')
        
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            if total % 2 == 1:
                return max(nums1_left, nums2_left)
            else:
                return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
        elif nums1_left > nums2_right:
            return self._find_median(nums1, nums2, left, i - 1, total)
        else:
            return self._find_median(nums1, nums2, i + 1, right, total)
```

### Explanation

The recursive binary search approach follows the same logic as the iterative version but uses recursion instead of a loop to explore the search space. The key differences are:

1. **Recursive function call** instead of a while loop
2. **Base case check** for left > right
3. **Recursive calls** to adjust the search space

### Complexity Analysis

- **Time Complexity:** O(log(min(m,n))), same as the iterative approach
- **Space Complexity:** O(log(min(m,n))), due to recursion stack depth

---

## Approach 2: Merge and Find Median (Brute Force)

### Solution Code

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        merged = []
        i = j = 0
        m, n = len(nums1), len(nums2)
        
        while i < m and j < n:
            if nums1[i] < nums2[j]:
                merged.append(nums1[i])
                i += 1
            else:
                merged.append(nums2[j])
                j += 1
        
        while i < m:
            merged.append(nums1[i])
            i += 1
        
        while j < n:
            merged.append(nums2[j])
            j += 1
        
        total = m + n
        if total % 2 == 1:
            return merged[total // 2]
        else:
            mid1 = merged[total // 2 - 1]
            mid2 = merged[total // 2]
            return (mid1 + mid2) / 2
```

### Explanation

1. **Merge the two sorted arrays** using the standard two-pointer technique
2. **Find the median** in the merged array:
   - For odd length: middle element
   - For even length: average of the two middle elements

### Complexity Analysis

- **Time Complexity:** O(m + n), merging both arrays
- **Space Complexity:** O(m + n), storing the merged array

---

## Approach 3: Two Pointers Without Merging (Optimized Brute Force)

### Solution Code

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        m, n = len(nums1), len(nums2)
        total = m + n
        mid1 = total // 2
        mid2 = mid1 - 1 if total % 2 == 0 else -1
        
        i = j = count = 0
        val1 = val2 = 0
        
        while i < m and j < n and count <= mid1:
            if nums1[i] < nums2[j]:
                if count == mid1:
                    val1 = nums1[i]
                if count == mid2:
                    val2 = nums1[i]
                i += 1
            else:
                if count == mid1:
                    val1 = nums2[j]
                if count == mid2:
                    val2 = nums2[j]
                j += 1
            count += 1
        
        while i < m and count <= mid1:
            if count == mid1:
                val1 = nums1[i]
            if count == mid2:
                val2 = nums1[i]
            i += 1
            count += 1
        
        while j < n and count <= mid1:
            if count == mid1:
                val1 = nums2[j]
            if count == mid2:
                val2 = nums2[j]
            j += 1
            count += 1
        
        return val1 if total % 2 == 1 else (val1 + val2) / 2
```

### Explanation

1. **Find the required positions** without merging the entire arrays
2. **Track the middle elements** using two pointers
3. **Stop early** once we've found the necessary elements

### Complexity Analysis

- **Time Complexity:** O(m + n), but stops early once middle elements are found
- **Space Complexity:** O(1), using only a few variables

---

## Related Problems

1. [Find Median from Data Stream](find-median-from-data-stream.md) - Median of dynamic data stream
2. [Kth Smallest Element in a Sorted Matrix](kth-smallest-element-in-a-sorted-matrix.md) - Kth smallest in 2D sorted matrix
3. [Merge K Sorted Lists](merge-k-sorted-lists.md) - Merging multiple sorted lists
4. [Find K Pairs with Smallest Sums](find-k-pairs-with-smallest-sums.md) - Finding pairs from two sorted arrays

---

## Followup Questions

1. **How would you handle the case where one of the arrays is empty?**  
   If one array is empty, the median is simply the median of the non-empty array. We can check if either array length is 0 and return the median of the other array directly.

2. **What if the arrays contain duplicate elements?**  
   Duplicates are handled naturally by the binary search approach since the partitioning logic works the same way - we still check if left elements are ≤ right elements regardless of duplicates.

3. **How to generalize this approach to find the kth smallest element in two sorted arrays?**  
   Instead of partitioning for the median position, we partition to find the position where there are exactly k-1 elements on the left side of the partition. This is a common extension of the median finding problem.

4. **What if the arrays are very large and can't fit into memory?**  
   For very large arrays, we can use external sorting or modified binary search that reads only the necessary elements from disk. However, this complicates the implementation significantly.

5. **How would you handle the case where the arrays are sorted in descending order?**  
   We can either reverse the arrays first (O(m+n) time) or modify the binary search conditions to work with descending order. The latter approach is more efficient.

---

## Video Tutorials

1. [LeetCode Median of Two Sorted Arrays - Binary Search Approach](https://www.youtube.com/watch?v=q6IEA26hvXc)
2. [Median of Two Sorted Arrays Explained](https://www.youtube.com/watch?v=LPFhl65R7ww)
3. [Binary Search Solution for Median of Two Sorted Arrays](https://www.youtube.com/watch?v=ScCg9v921ns)

---

## Complexity Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| Binary Search (Iterative) | O(log(min(m,n))) | O(1) | Most efficient, optimal for large arrays |
| Binary Search (Recursive) | O(log(min(m,n))) | O(log(min(m,n))) | Same logic as iterative, uses recursion stack |
| Merge and Find | O(m + n) | O(m + n) | Simple to implement, uses extra space |
| Two Pointers Without Merging | O(m + n) | O(1) | Optimized brute force, no extra space |
