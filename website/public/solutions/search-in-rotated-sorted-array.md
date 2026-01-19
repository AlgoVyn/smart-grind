# Search in Rotated Sorted Array

## Problem Description

There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`0 <= k < nums.length`) such that the resulting array is:

```
[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]
```

For example, the array `[0,1,2,4,5,6,7]` might be rotated at pivot index 3 and become `[4,5,6,7,0,1,2]`.

Given the rotated array `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.

**You must write an algorithm with O(log n) runtime complexity.**

---

## Examples

### Example 1:
**Input:**
```python
nums = [4,5,6,7,0,1,2], target = 0
```

**Output:**
```python
4
```

**Explanation:** 0 is at index 4 in the array.

---

### Example 2:
**Input:**
```python
nums = [4,5,6,7,0,1,2], target = 3
```

**Output:**
```python
-1
```

**Explanation:** 3 is not in the array, so return -1.

---

### Example 3:
**Input:**
```python
nums = [1], target = 0
```

**Output:**
```python
-1
```

**Explanation:** Single element array, 0 is not present.

---

### Example 4:
**Input:**
```python
nums = [5,1,3], target = 5
```

**Output:**
```python
0
```

**Explanation:** Target found at index 0.

---

### Example 5:
**Input:**
```python
nums = [6,7,0,1,2,3,4,5], target = 2
```

**Output:**
```python
4
```

**Explanation:** The array was rotated, and 2 is at index 4.

---

## Constraints

- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- All values of `nums` are unique
- `nums` is an ascending array that is possibly rotated at an unknown pivot
- `-10^4 <= target <= 10^4`

---

## Intuition

The key insight is that even though the array is rotated, it still maintains a partial sorting property:

1. **At least one half is always sorted**: In any rotated sorted array, either the left half (from `left` to `mid`) or the right half (from `mid` to `right`) will be in sorted order.

2. **We can determine which half is sorted**: By comparing `nums[left]` with `nums[mid]`, we can check if the left half is sorted:
   - If `nums[left] <= nums[mid]`, the left half is sorted
   - Otherwise, the right half must be sorted

3. **Binary search with extra checks**: Once we know which half is sorted, we can determine if the target lies within that sorted half. If yes, search that half; otherwise, search the other half.

This allows us to reduce the search space by half at each step, achieving O(log n) time complexity.

---

## Multiple Approaches

### Approach 1: Single-Pass Modified Binary Search (Recommended)

**Idea:** Perform binary search while determining which half is sorted at each step.

**Code:**
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        while left <= right:
            mid = (left + right) // 2
            
            # Found the target
            if nums[mid] == target:
                return mid
            
            # Check if left half is sorted
            if nums[left] <= nums[mid]:
                # Left half is sorted
                if nums[left] <= target < nums[mid]:
                    # Target is in left half
                    right = mid - 1
                else:
                    # Target is in right half
                    left = mid + 1
            else:
                # Right half is sorted
                if nums[mid] < target <= nums[right]:
                    # Target is in right half
                    left = mid + 1
                else:
                    # Target is in left half
                    right = mid - 1
        
        return -1
```

**Explanation:**
- At each iteration, we check which half (left or right of mid) is sorted
- If left half is sorted and target is within that range, search left
- Otherwise, search the right half
- This single-pass approach finds the target in O(log n) time

---

### Approach 2: Find Pivot + Binary Search (Two-Pass)

**Idea:** First find the pivot (minimum element) index, then perform binary search on the appropriate half.

**Code:**
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums:
            return -1
        
        # Step 1: Find the pivot (index of minimum element)
        left, right = 0, len(nums) - 1
        
        # Find the pivot using binary search
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        
        pivot = left
        
        # Step 2: Determine which half to search
        # Compare target with first element to decide the search space
        if nums[0] <= target <= nums[pivot - 1] if pivot > 0 else False:
            # Search in left half (0 to pivot-1)
            left, right = 0, pivot - 1
        else:
            # Search in right half (pivot to end)
            left, right = pivot, len(nums) - 1
        
        # Step 3: Standard binary search
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
```

**Explanation:**
- First pass finds the pivot (minimum element) which indicates where the rotation occurred
- Second pass searches the appropriate half based on where the target should be
- Both passes use binary search, maintaining O(log n) total complexity

---

### Approach 3: Linear Scan (Brute Force)

**Idea:** Simply iterate through the array to find the target.

**Code:**
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        for i, num in enumerate(nums):
            if num == target:
                return i
        return -1
```

**Explanation:**
- Straightforward approach: check each element
- Returns immediately when target is found
- O(n) time complexity, not optimal but works

---

### Approach 4: Recursive Binary Search

**Idea:** Implement the modified binary search recursively.

**Code:**
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        def binary_search(left: int, right: int) -> int:
            if left > right:
                return -1
            
            mid = (left + right) // 2
            
            if nums[mid] == target:
                return mid
            
            # Check if left half is sorted
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    return binary_search(left, mid - 1)
                else:
                    return binary_search(mid + 1, right)
            else:
                if nums[mid] < target <= nums[right]:
                    return binary_search(mid + 1, right)
                else:
                    return binary_search(left, mid - 1)
        
        return binary_search(0, len(nums) - 1)
```

**Explanation:**
- Same logic as Approach 1 but implemented recursively
- Base case: when left > right, target not found, return -1
- Recursive case: determine which half to search and recurse
- O(log n) time but O(log n) space due to recursion stack

---

### Approach 5: Binary Search with Shift (Calculate Rotation Offset)

**Idea:** First calculate the shift amount (rotation count), then adjust indices to perform standard binary search. This approach transforms the problem into a regular binary search by accounting for the rotation.

**Code:**
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums:
            return -1
        
        n = len(nums)
        
        # Step 1: Find the shift amount (rotation count)
        left, right = 0, n - 1
        
        # Find the index of the minimum element (pivot)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        
        shift = left  # Number of positions the array was rotated
        
        # Step 2: Determine which half contains the target
        # Compare target with first element to decide the search space
        if nums[0] <= target <= nums[shift - 1] if shift > 0 else False:
            # Target is in the first half (before pivot)
            left, right = 0, shift - 1
        elif shift < n and nums[shift] <= target <= nums[n - 1]:
            # Target is in the second half (from pivot to end)
            left, right = shift, n - 1
        else:
            return -1
        
        # Step 3: Standard binary search in the determined range
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
```

**Alternative Implementation - Direct Index Transformation:**
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums:
            return -1
        
        n = len(nums)
        
        # Find the shift amount using binary search
        left, right = 0, n - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        
        shift = left
        
        # Binary search with index transformation
        def transform(idx: int) -> int:
            """Transform adjusted index to rotated array index"""
            return (idx + shift) % n
        
        # Perform binary search as if the array wasn't rotated
        left, right = 0, n - 1
        
        while left <= right:
            mid = (left + right) // 2
            rotated_mid = transform(mid)
            
            if nums[rotated_mid] == target:
                return rotated_mid
            elif nums[rotated_mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
```

**Explanation:**
- **Step 1 (Find Shift):** Use binary search to find the pivot (minimum element). The pivot index is the rotation count (shift).
- **Step 2 (Determine Range):** Based on the shift, determine which half of the array contains the target.
- **Step 3 (Binary Search):** Perform standard binary search in the appropriate range.

**Key Insight:** The shift tells us how many positions the original sorted array was rotated. By knowing this:
- We can "virtually unrotate" the array for binary search
- The element at index `i` in the original sorted array is now at index `(i + shift) % n`
- We can either adjust our search range OR transform indices during comparison

**Why This Approach is Useful:**
- Reuses standard binary search logic without modification
- Makes the concept of rotation explicit and clear
- Useful when you also need to know the rotation count for other purposes

---

## Time/Space Complexity Summary

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Single-Pass Modified Binary Search | O(log n) | O(1) | Recommended, most efficient |
| Find Pivot + Binary Search | O(log n) | O(1) | Two-pass approach, clear steps |
| Linear Scan | O(n) | O(1) | Simple but too slow for large arrays |
| Recursive Binary Search | O(log n) | O(log n) | Stack space for recursion |
| Binary Search with Shift | O(log n) | O(1) | Explicit rotation calculation |

---

## Detailed Complexity Analysis

### Why O(log n) for Binary Search Approaches?

In binary search, we start with a search range of n elements:
- After 1 comparison: n/2 elements remain
- After 2 comparisons: n/4 elements remain
- After k comparisons: n/2^k elements remain

The search continues until the range is empty or target is found, i.e., n/2^k < 1 or target found, which means k > log₂(n).

Thus, the number of comparisons is O(log n).

### Why O(n) for Linear Scan?

The linear scan visits each element exactly once in the worst case (target not found or at the end), resulting in O(n) time complexity.

### Space Complexity Analysis

- **Iterative approaches**: O(1) - only uses a few variables (left, right, mid)
- **Recursive approach**: O(log n) - each recursive call adds to the call stack
- **Linear scan**: O(1) - no additional space used

---

## Related Problems

| Problem | Description | Link |
|---------|-------------|------|
| **Search in Rotated Sorted Array II** | Search with duplicates allowed | [LC 81](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) / [Solution](./search-in-rotated-sorted-array-ii.md) |
| **Find Minimum in Rotated Sorted Array** | Find the minimum element | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) / [Solution](./find-minimum-in-rotated-sorted-array.md) |
| **Find Minimum in Rotated Sorted Array II** | Find minimum with duplicates | [LC 154](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) |
| **Search Insert Position** | Find or insert position in sorted array | [LC 35](https://leetcode.com/problems/search-insert-position/) / [Solution](./search-insert-position.md) |
| **Find First and Last Position** | Find first/last occurrence in sorted array | [LC 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) / [Solution](./binary-search-find-first-last-occurrence.md) |
| **Binary Search** | Basic binary search | [LC 704](https://leetcode.com/problems/binary-search/) / [Solution](./binary-search.md) |
| **Find in Mountain Array** | Search in mountain array | [LC 1095](https://leetcode.com/problems/find-in-mountain-array/) / [Solution](./find-in-mountain-array.md) |
| **Search a 2D Matrix** | Search in 2D matrix | [LC 74](https://leetcode.com/problems/search-a-2d-matrix/) |

---

## Video Tutorials

1. [NeetCode - Search in Rotated Sorted Array](https://www.youtube.com/watch?v=ID-9t3t-F28)
2. [Fraz - Search in Rotated Sorted Array](https://www.youtube.com/watch?v=5Fr2HK2T1qQ)
3. [Binary Search on Rotated Array - Detailed Explanation](https://www.youtube.com/watch?v=5qGrJ3A4pus)
4. [Abdul Bari - Rotated Array Search](https://www.youtube.com/watch?v=vGDrW9J7f7A)
5. [Two Methods to Solve - LeetCode Discuss](https://www.youtube.com/watch?v=u4n7y4Z-e1Q)

---

## Follow-up Questions

1. **What if the array can contain duplicates?**  
   When duplicates are present, the standard approach may fail because `nums[left] == nums[mid]` doesn't tell us which half is sorted. In this case, we need to handle duplicates by incrementing `left` when `nums[left] == nums[mid]`. However, this degrades to O(n) in the worst case. See [Search in Rotated Sorted Array II](./search-in-rotated-sorted-array-ii.md).

2. **How would you modify the solution to find the rotation count?**  
   The rotation count is equal to the index of the minimum element. You can find this by locating the pivot using binary search that finds the minimum element.

3. **What if the array is rotated right instead of left?**  
   The approach remains the same; you just need to adjust the pivot logic. A right rotation can be treated as a left rotation by `n - k` positions.

4. **How would you search for all occurrences of the target?**  
   First find one occurrence using the rotated binary search, then expand left and right to find all occurrences. Alternatively, find the pivot and use two binary searches.

5. **Can you solve this without comparing with nums[left]?**  
   Yes, you can compare with `nums[right]` instead. The logic is symmetric: if `nums[mid] <= nums[right]`, the right half is sorted.

6. **How would you handle a very large array that doesn't fit in memory?**  
   For external sorting scenarios, you'd need to adapt the algorithm for disk-based access patterns, possibly using a modified binary search that minimizes disk reads.

7. **What if the array is rotated multiple times (more than once)?**  
   The solution still works because the array is still a rotated sorted array regardless of how many times it's rotated. The pivot detection logic handles any number of rotations.

8. **How would you modify the solution to count how many times the array is rotated?**  
   The rotation count equals the index of the minimum element. After finding the pivot (minimum element's index), return that index as the rotation count.

9. **What if you need to search for a range of values instead of a single target?**  
   You can use the rotated binary search to find the lower bound (first element >= min of range) and upper bound (first element > max of range), then return all indices in that range.

10. **How would you test edge cases for this problem?**  
    Test with: empty array (if allowed), single element, no rotation, target at beginning, target at end, target not present, target is minimum, target is maximum, all rotations.

11. **What is the difference between Approach 2 (Find Pivot + Binary Search) and Approach 5 (Binary Search with Shift)?**  
    Both approaches calculate the rotation count, but they use it differently:
    - Approach 2 searches in a specific half determined by comparing target with the first element
    - Approach 5 transforms the indices using modulo arithmetic, allowing standard binary search on the "virtually unrotated" array
    - Approach 5 is more elegant when you need to perform multiple searches on the same rotated array

12. **How would you modify the shift-based approach to find all occurrences of the target?**  
    After finding one occurrence using the shift-based binary search, you can expand outward to find all adjacent occurrences since the array contains unique elements, you only need to verify one occurrence. If duplicates were allowed, you would need to search left and right from the found index.

---

## Summary

The **Search in Rotated Sorted Array** problem demonstrates the power of modified binary search:

- **Key Insight**: At least one half of the array is always sorted, allowing us to eliminate half the search space at each step
- **Algorithm**: Modified binary search that checks which half is sorted and narrows the search accordingly
- **Time Complexity**: O(log n) for binary search approaches
- **Space Complexity**: O(1) for iterative approaches, O(log n) for recursive
- **Variations**: Handle duplicates (Search in Rotated Sorted Array II), find minimum (Find Minimum in Rotated Sorted Array)

The single-pass modified binary search is the most efficient and recommended approach, achieving O(log n) time with O(1) space.

