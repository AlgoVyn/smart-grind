# Find First and Last Position of Element in Sorted Array

**LeetCode Problem #34** | **Difficulty:** Medium | **Pattern:** Binary Search

---

## Problem Description

Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If the target is not found in the array, return `[-1, -1]`.

You must write an algorithm with **O(log n)** runtime complexity, which means you cannot simply iterate through the entire array.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `0 <= nums.length <= 10^5` | Array size can be up to 100,000 elements |
| `-10^9 <= nums[i] <= 10^9` | Integer values can be large (use 64-bit) |
| `nums` is non-decreasing | Sorted in ascending order (may contain duplicates) |
| `-10^9 <= target <= 10^9` | Target value within same range |

---

## Examples

### Example 1
**Input:**
```python
nums = [5, 7, 7, 8, 8, 10], target = 8
```

**Output:**
```python
[3, 4]
```

**Explanation:** The target `8` first appears at index `3` and last appears at index `4`.

---

### Example 2
**Input:**
```python
nums = [5, 7, 7, 8, 8, 10], target = 6
```

**Output:**
```python
[-1, -1]
```

**Explanation:** The target `6` does not exist in the array.

---

### Example 3
**Input:**
```python
nums = [], target = 0
```

**Output:**
```python
[-1, -1]
```

**Explanation:** Empty array, target not found.

---

### Example 4 (Single Element)
**Input:**
```python
nums = [1], target = 1
```

**Output:**
```python
[0, 0]
```

**Explanation:** Target appears only once at index 0.

---

### Example 5 (All Duplicates)
**Input:**
```python
nums = [2, 2, 2, 2, 2], target = 2
```

**Output:**
```python
[0, 4]
```

**Explanation:** Target spans the entire array.

---

## Intuition

The array is **sorted** but contains **duplicates**, so the target may appear multiple times consecutively. To find both boundaries efficiently:

1. **Binary Search for Left Boundary:** Find where the target **first appears** (smallest index where `nums[index] == target`)
2. **Binary Search for Right Boundary:** Find where the target **last appears** (largest index where `nums[index] == target`)

The key insight is that binary search can find the **lower bound** and **upper bound** of a value in a sorted array, even when duplicates exist.

---

## Approach 1: Two Binary Searches (Optimal)

This is the optimal solution that achieves O(log n) time complexity using two separate binary searches.

### Algorithm
1. **Find Left Boundary (Lower Bound):**
   - Initialize `left = 0`, `right = len(nums) - 1`
   - While `left <= right`:
     - Calculate `mid = left + (right - left) // 2`
     - If `nums[mid] < target`: Search right half (`left = mid + 1`)
     - Else: Search left half (`right = mid - 1`)
   - After loop, `left` is the first position where `nums[left] >= target`

2. **Find Right Boundary (Upper Bound):**
   - Initialize `left = 0`, `right = len(nums) - 1`
   - While `left <= right`:
     - Calculate `mid = left + (right - left) // 2`
     - If `nums[mid] <= target`: Search right half (`left = mid + 1`)
     - Else: Search left half (`right = mid - 1`)
   - After loop, `right` is the last position where `nums[right] <= target`

3. **Validate and Return:**
   - If `left >= len(nums)` or `nums[left] != target`: Return `[-1, -1]`
   - Otherwise return `[left, right]`

### Python Code
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        Find the first and last position of target in sorted array.
        Uses two binary searches for O(log n) time complexity.
        
        Args:
            nums: Sorted list of integers
            target: Target value to search for
            
        Returns:
            List of two integers [first_position, last_position] or [-1, -1]
        """
        if not nums:
            return [-1, -1]
        
        def find_left_boundary() -> int:
            """Find the leftmost (first) occurrence of target."""
            left, right = 0, len(nums) - 1
            while left <= right:
                mid = left + (right - left) // 2
                if nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid - 1
            return left
        
        def find_right_boundary() -> int:
            """Find the rightmost (last) occurrence of target."""
            left, right = 0, len(nums) - 1
            while left <= right:
                mid = left + (right - left) // 2
                if nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid - 1
            return right
        
        left = find_left_boundary()
        # Validate: target must exist and left must be within bounds
        if left >= len(nums) or nums[left] != target:
            return [-1, -1]
        
        right = find_right_boundary()
        return [left, right]
```

---

## Approach 2: Single Binary Search with Range Expansion

This approach finds one occurrence and then expands linearly. However, this is **not O(log n)** in the worst case and is shown for comparison.

### Algorithm
1. Use binary search to find any occurrence of target
2. Once found, expand left to find first occurrence
3. Expand right to find last occurrence

### Python Code
```python
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        if not nums:
            return [-1, -1]
        
        # Step 1: Find any occurrence of target
        left, right = 0, len(nums) - 1
        found = -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                found = mid
                break
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        if found == -1:
            return [-1, -1]
        
        # Step 2: Expand left to find first occurrence
        first = found
        while first > 0 and nums[first - 1] == target:
            first -= 1
        
        # Step 3: Expand right to find last occurrence
        last = found
        while last < len(nums) - 1 and nums[last + 1] == target:
            last += 1
        
        return [first, last]
```

**Time Complexity:** O(log n + k) where k is the number of occurrences  
**Space Complexity:** O(1)

---

## Approach 3: Using Built-in Functions (Python)

Python provides convenient functions for this problem.

### Python Code
```python
from typing import List
import bisect

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        if not nums:
            return [-1, -1]
        
        # bisect_left finds the first position where target could be inserted
        left = bisect.bisect_left(nums, target)
        
        # If target not found, return [-1, -1]
        if left >= len(nums) or nums[left] != target:
            return [-1, -1]
        
        # bisect_right finds the position after the last occurrence
        right = bisect.bisect_right(nums, target) - 1
        
        return [left, right]
```

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Two Binary Searches | O(log n) | O(1) | Optimal solution |
| Single Search + Expand | O(log n + k) | O(1) | Not optimal when k is large |
| Built-in Functions | O(log n) | O(1) | Python-specific, cleanest |

Where:
- `n` = length of the array
- `k` = number of occurrences of target

---

## Related Problems

| Problem | Pattern | Difficulty | Description |
|---------|---------|------------|-------------|
| [LeetCode 35](https://leetcode.com/problems/search-insert-position/) | Binary Search | Easy | Find where target would be inserted |
| [LeetCode 704](https://leetcode.com/problems/binary-search/) | Binary Search | Easy | Basic binary search implementation |
| [LeetCode 1539](https://leetcode.com/problems/kth-missing-positive-number/) | Binary Search | Easy | Find kth missing positive number |
| [LeetCode 162](https://leetcode.com/problems/find-peak-element/) | Binary Search | Medium | Find any peak element |
| [LeetCode 278](https://leetcode.com/problems/first-bad-version/) | Binary Search | Easy | Find first bad version (similar pattern) |
| [LeetCode 852](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Binary Search | Easy | Find peak in mountain array |
| [LeetCode 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Binary Search | Medium | Search in rotated sorted array |
| [LeetCode 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Binary Search | Medium | Find min in rotated sorted array |

---

## Video Tutorials

| Platform | Link | Description |
|----------|------|-------------|
| NeetCode | [YouTube](https://www.youtube.com/watch?v=4sQL7R5yS1U) | Clear explanation with visual examples |
| LeetCode | [YouTube](https://www.youtube.com/watch?v=1LUxhI21Bjw) | Official solution walkthrough |
| Abdul Bari | [YouTube](https://www.youtube.com/watch?v=3J8k9v5L-Wk) | Algorithm explanation in depth |
| GeeksforGeeks | [YouTube](https://www.youtube.com/watch?v=hZ1ncLDLSa4) | Multiple approaches explained |

---

## Follow-up Questions

1. **What if the array is sorted in descending order instead of ascending?**
   - Would need to adjust comparison operators in binary search

2. **How would you modify the solution to count the number of occurrences?**
   - `count = right - left + 1`

3. **What if you need to find all occurrences at once using a single binary search?**
   - Could be done but more complex; typically two searches is cleaner

4. **How would you handle very large arrays that don't fit in memory?**
   - Would need external memory techniques or streaming approach

5. **Can this problem be solved without binary search? What are the trade-offs?**
   - Yes, linear scan works but is O(n) vs O(log n)

6. **How would you parallelize this search?**
   - Could search both halves simultaneously, but overhead may not be worth it

---

## Key Takeaways

1. **Binary search is optimal** for sorted arrays - always think of it first
2. **Two binary searches** give the cleanest O(log n) solution
3. **Lower bound** (first occurrence) uses `nums[mid] < target`
4. **Upper bound** (last occurrence) uses `nums[mid] <= target`
5. **Always validate** that the target actually exists before returning

---

**Happy Coding! 🚀**

