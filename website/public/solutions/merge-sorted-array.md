# Merge Sorted Array

## Problem Description

You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n` representing the number of elements in `nums1` and `nums2` respectively.

Merge `nums1` and `nums2` into a single array sorted in non-decreasing order. The result should be stored in `nums1` in place.

### Important Notes

- `nums1` has length `m + n`, where the first `m` elements are valid and the last `n` elements are placeholders (initialized to 0).
- `nums2` has length `n`.
- The merge must be done **in-place** within `nums1`.
- The final merged array should also be sorted in non-decreasing order.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3` | `[1,2,2,3,5,6]` |

**Explanation:** Merging `[1,2,3]` and `[2,5,6]` produces `[1,2,2,3,5,6]`.

**Example 2:**

| Input | Output |
|-------|--------|
| `nums1 = [1], m = 1, nums2 = [], n = 0` | `[1]` |

**Explanation:** When `nums2` is empty, the result is just `nums1`.

**Example 3:**

| Input | Output |
|-------|--------|
| `nums1 = [0], m = 0, nums2 = [1], n = 1` | `[1]` |

**Explanation:** When `nums1` has no valid elements, the result is just `nums2`.

**Example 4:**

| Input | Output |
|-------|--------|
| `nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3` | `[1,2,3,4,5,6]` |

**Explanation:** All elements from `nums2` are smaller than those in `nums1`.

**Example 5:**

| Input | Output |
|-------|--------|
| `nums1 = [1,2,3,0,0], m = 3, nums2 = [4,5], n = 2` | `[1,2,3,4,5]` |

**Explanation:** All elements from `nums1` are smaller than those in `nums2`.

---

## Constraints

- `nums1.length == m + n`
- `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`
- `-10^9 <= nums1[i], nums2[j] <= 10^9`

**Follow-up:** Can you achieve this in `O(m + n)` time with `O(1)` extra space?

---

## Intuition

The key insight for solving this problem efficiently is to **merge from the end** rather than the beginning. 

When we try to merge from the beginning (like we would with extra space available), we would overwrite elements in `nums1` that haven't been processed yet. Since `nums1` has extra space at the end (the last `n` positions), we can use this to our advantage.

**Why merging from the end works:**
1. The largest elements should be placed at the end of the array
2. By placing elements from largest to smallest, we avoid overwriting elements that still need to be processed
3. We can use three pointers to track positions in both arrays and the destination

**Visual Example:**
```
Initial: nums1 = [1,2,3,0,0,0], nums2 = [2,5,6]
          i=2    j=2    k=5

Step 1: Compare nums1[2]=3 and nums2[2]=6 → 6 > 3
        nums1[5] = 6, j=1, k=4
        nums1 = [1,2,3,0,0,6]

Step 2: Compare nums1[2]=3 and nums2[1]=5 → 5 > 3
        nums1[4] = 5, j=0, k=3
        nums1 = [1,2,3,0,5,6]

Step 3: Compare nums1[2]=3 and nums2[0]=2 → 3 > 2
        nums1[3] = 3, i=1, k=2
        nums1 = [1,2,3,3,5,6]

Step 4: Compare nums1[1]=2 and nums2[0]=2 → 2 == 2
        nums1[2] = 2, j=-1, k=1
        nums1 = [1,2,2,3,5,6]

Step 5: j < 0, copy remaining nums1 elements (already in place)
        nums1 = [1,2,2,3,5,6]
```

---

## Approach

### Approach 1: Three Pointer (In-place from End) - OPTIMAL

This is the optimal approach that achieves O(m + n) time and O(1) space complexity. We use three pointers:
- `i`: Points to the last valid element in `nums1` (initialized to `m - 1`)
- `j`: Points to the last element in `nums2` (initialized to `n - 1`)
- `k`: Points to the last position in `nums1` (initialized to `m + n - 1`)

We compare elements from both arrays starting from the end and place the larger one at position `k`, then decrement the appropriate pointer.

### Approach 2: Two Pointer (From Beginning with Extra Space)

This approach uses O(m + n) extra space by creating a copy of `nums1` first. We then merge elements from the beginning, comparing and placing the smaller element at each position.

### Approach 3: Built-in Sort (Simple)

The simplest approach concatenates both arrays and sorts them using the built-in sort function. While simple, this has O((m+n) log(m+n)) time complexity.

---

## Solution

### Approach 1: Three Pointer (In-place from End) - Optimal

```python
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Merge two sorted arrays in place using three pointers.
        Pointers: i (end of nums1 valid), j (end of nums2), k (end of nums1 total)
        
        Time: O(m + n)
        Space: O(1)
        """
        i, j, k = m - 1, n - 1, m + n - 1
        
        # Merge from the end to avoid overwriting unprocessed elements
        while i >= 0 and j >= 0:
            if nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
        
        # Copy remaining elements from nums2 if any
        # (No need to copy remaining nums1 elements - they're already in place)
        while j >= 0:
            nums1[k] = nums2[j]
            j -= 1
            k -= 1
```

### Approach 2: Two Pointer (From Beginning with Extra Space)

```python
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Merge two sorted arrays using two pointers from the beginning.
        Uses O(m + n) extra space by copying nums1 first.
        
        Time: O(m + n)
        Space: O(m + n)
        """
        # Create a copy of the first m elements of nums1
        nums1_copy = nums1[:m]
        
        i, j, k = 0, 0, 0
        
        # Merge from the beginning
        while i < m and j < n:
            if nums1_copy[i] <= nums2[j]:
                nums1[k] = nums1_copy[i]
                i += 1
            else:
                nums1[k] = nums2[j]
                j += 1
            k += 1
        
        # Copy remaining elements from nums1_copy if any
        while i < m:
            nums1[k] = nums1_copy[i]
            i += 1
            k += 1
        
        # Copy remaining elements from nums2 if any
        while j < n:
            nums1[k] = nums2[j]
            j += 1
            k += 1
```

### Approach 3: Built-in Sort (Simple)

```python
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Merge two sorted arrays using built-in sort.
        Simplest approach but has higher time complexity.
        
        Time: O((m + n) * log(m + n))
        Space: O(1) additional (sort is in-place)
        """
        # Copy nums2 elements into the placeholder positions of nums1
        nums1[m:] = nums2
        
        # Sort the entire array
        nums1.sort()
```

---

## Explanation

### Approach 1: Three Pointer (In-place from End) - Detailed

**Step-by-step breakdown:**

1. **Initialize pointers:**
   - `i = m - 1`: Points to the last valid element in `nums1`
   - `j = n - 1`: Points to the last element in `nums2`
   - `k = m + n - 1`: Points to the last position in `nums1` (where the largest element should go)

2. **Compare and place elements:**
   - While both `i >= 0` and `j >= 0`:
     - If `nums1[i] > nums2[j]`: Place `nums1[i]` at position `k`, decrement `i`
     - Otherwise: Place `nums2[j]` at position `k`, decrement `j`
     - Decrement `k` after each placement

3. **Handle remaining elements:**
   - If `j >= 0` after the first loop: Copy remaining elements from `nums2` to `nums1`
   - If `i >= 0`: No action needed - these elements are already in their correct positions

**Why this works:**
- We always place the larger of the two current elements at position `k`
- This ensures that larger elements are placed toward the end of the array
- By starting from the end, we never overwrite elements that haven't been processed yet

### Approach 2: Two Pointer (From Beginning) - Detailed

**Step-by-step breakdown:**

1. **Create a copy** of the first `m` elements of `nums1` to preserve them
2. **Initialize pointers:**
   - `i = 0`: Points to current position in `nums1_copy`
   - `j = 0`: Points to current position in `nums2`
   - `k = 0`: Points to current position in `nums1`

3. **Merge from the beginning:**
   - While both `i < m` and `j < n`:
     - Compare `nums1_copy[i]` and `nums2[j]`
     - Place the smaller element at `nums1[k]`
     - Increment the appropriate pointer

4. **Copy remaining elements** from whichever array still has elements

### Approach 3: Built-in Sort - Detailed

**Step-by-step breakdown:**

1. **Copy `nums2` elements** into the placeholder positions of `nums1` using slice assignment
2. **Sort the entire `nums1` array** using Python's built-in sort
3. Done! The array is now merged and sorted

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | In-place | Notes |
|----------|----------------|------------------|----------|-------|
| Three Pointer (from end) | O(m + n) | O(1) | ✅ | Optimal - most efficient |
| Two Pointer (from beginning) | O(m + n) | O(m + n) | ❌ | Uses extra space |
| Built-in Sort | O((m + n) log(m + n)) | O(1) | ✅ | Simple but less efficient |

**Detailed Analysis:**

- **Three Pointer Approach:**
  - Each element is processed exactly once
  - At most `m + n` comparisons and placements
  - Constant extra space (just three pointer variables)

- **Two Pointer Approach:**
  - Each element is processed exactly once
  - Additional O(m + n) space for the copy of `nums1`
  - Useful when in-place operation is not required

- **Built-in Sort Approach:**
  - Sorting takes O((m + n) log(m + n)) comparisons
  - No additional space (sort is in-place)
  - Simpler code but less efficient for large arrays

---

## Edge Cases

1. **Empty nums1 (m = 0):**
   ```python
   nums1 = [0], m = 0, nums2 = [1], n = 1
   Result: nums1 = [1]
   ```
   The second while loop handles this by copying all of `nums2` to `nums1`.

2. **Empty nums2 (n = 0):**
   ```python
   nums1 = [1], m = 1, nums2 = [], n = 0
   Result: nums1 = [1]
   ```
   The first while loop doesn't execute, and no elements need to be copied from `nums2`.

3. **All elements from nums2 are smaller:**
   ```python
   nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3
   Result: nums1 = [1,2,3,4,5,6]
   ```
   All elements from `nums2` are placed first, then remaining `nums1` elements are already in place.

4. **All elements from nums1 are smaller:**
   ```python
   nums1 = [1,2,3,0,0], m = 3, nums2 = [4,5], n = 2
   Result: nums1 = [1,2,3,4,5]
   ```
   After the first while loop, `j < 0`, so no elements need to be copied from `nums2`.

5. **Single element arrays:**
   ```python
   nums1 = [2,0], m = 1, nums2 = [1], n = 1
   Result: nums1 = [1,2]
   ```
   Works correctly for minimum input sizes.

6. **Duplicate elements:**
   ```python
   nums1 = [2,2,3,0,0,0], m = 3, nums2 = [2,2,2], n = 3
   Result: nums1 = [2,2,2,2,2,3]
   ```
   Correctly handles duplicates by maintaining relative order.

---

## Related Problems

1. **[Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)**
   - Merge two sorted linked lists into one sorted list
   - Similar concept but with linked list data structure

2. **[Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)**
   - Merge k sorted linked lists into one sorted list
   - Uses heap/priority queue for efficient merging

3. **[Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)**
   - Find the median of two sorted arrays
   - Uses binary search for O(log(min(m,n))) solution

4. **[Intersection of Two Sorted Arrays](https://leetcode.com/problems/intersection-of-two-arrays-ii/)**
   - Find intersection of two sorted arrays
   - Uses two-pointer approach

5. **[Move Zeroes](https://leetcode.com/problems/move-zeroes/)**
   - Move all zeroes to the end while maintaining non-zero order
   - Uses two-pointer approach

6. **[Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)**
   - Remove duplicates from sorted array in-place
   - Uses two-pointer approach

7. **[Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)**
   - Return squares of sorted array in sorted order
   - Uses two-pointer from end approach

---

## Video Tutorials

1. **[Merge Sorted Array - LeetCode 88](https://www.youtube.com/watch?v=2wWhQaTE4jI)**
   - Detailed explanation with visual animations
   - Covers the three-pointer approach

2. **[Merge Sorted Array - NeetCode](https://www.youtube.com/watch?v=0DnM0Z5_2Wk)**
   - Clear explanation of the optimal approach
   - Includes step-by-step walkthrough

3. **[Merge Sorted Array - FreeCodeCamp](https://www.youtube.com/watch?v=3M_9o2W4qGQ)**
   - Comprehensive tutorial with multiple approaches
   - Time and space complexity analysis

4. **[Merge Sorted Array - Algorithms Made Easy](https://www.youtube.com/watch?v=3DjKxq8p2Tc)**
   - Visual explanation of pointer movements
   - Covers edge cases

---

## Follow-up Questions

1. **Can we do better than O(m + n) time?**
   - No, we must look at each element at least once, so O(m + n) is the lower bound.

2. **Can we do better than O(1) space?**
   - For in-place requirement, O(1) is the minimum.
   - If we don't need in-place, we could use O(m + n) space with the two-pointer approach.

3. **What if nums1 doesn't have enough space?**
   - The problem guarantees `nums1.length == m + n`
   - If this weren't guaranteed, we'd need to create a new array or use a different data structure.

4. **How would this problem change if the arrays were sorted in descending order?**
   - We would still merge from the end, but we would place the **smaller** element first
   - The comparison logic would be reversed

5. **What if we needed to merge more than two arrays?**
   - We could use a min-heap to efficiently merge k sorted arrays
   - Time complexity would be O((m + n) log k)

---

## Summary

The Merge Sorted Array problem is a classic example of using the **two-pointer technique** with a clever twist - merging from the **end** to avoid overwriting unprocessed elements. The optimal solution:

- **Time Complexity:** O(m + n) - each element is processed exactly once
- **Space Complexity:** O(1) - constant extra space for three pointers
- **Key Insight:** Start from the end and place the larger element at the current position
- **Main Challenge:** Managing pointer updates correctly to avoid off-by-one errors

This pattern is widely applicable and forms the foundation for many other array manipulation problems.

