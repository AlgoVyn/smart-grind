# Search Insert Position

## Problem Description

Given a sorted array of distinct integers `nums` and a target value `target`, return the index if the `target` is found. If not, return the index where it would be inserted to maintain the sorted order.

You must write an algorithm with O(log n) runtime complexity.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 3, 5, 6], target = 5
```

**Output:**
```python
2
```

**Explanation:** 5 exists in nums at index 2

---

### Example 2

**Input:**
```python
nums = [1, 3, 5, 6], target = 2
```

**Output:**
```python
1
```

**Explanation:** 2 does not exist in nums, but it would be inserted at index 1 to maintain sorted order

---

### Example 3

**Input:**
```python
nums = [1, 3, 5, 6], target = 7
```

**Output:**
```python
4
```

**Explanation:** 7 does not exist in nums, but it would be inserted at index 4 (after all elements)

---

### Example 4

**Input:**
```python
nums = [1, 3, 5, 6], target = 0
```

**Output:**
```python
0
```

**Explanation:** 0 does not exist in nums, but it would be inserted at index 0 (before all elements)

---

## Constraints

- `1 <= nums.length <= 10^4`
- `-10^4 < nums[i], target < 10^4`
- All the integers in `nums` are unique
- `nums` is sorted in ascending order

---

## Intuition

The problem asks us to find the position of a target value in a sorted array. If the target is not found, we need to return the position where it should be inserted to maintain the sorted order.

This is a perfect use case for **Binary Search** because:
1. The array is sorted
2. We need O(log n) time complexity
3. The answer is the point where the target would fit in the sorted order

The key insight is that in a binary search:
- If we find the target, we return its index
- If we don't find it, the `left` pointer will end up at the insertion position

When the search terminates:
- `left` will be at the first position where `nums[left] >= target`
- This is exactly where `target` should be inserted

---

## Multiple Approaches

### Approach 1: Standard Binary Search (Recommended)

**Idea:** Use binary search to find the target. If not found, return the `left` pointer which indicates the insertion position.

**Code:**
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        # When target is not found, left is the insertion position
        return left
```

**Explanation:**
- We maintain `left` and `right` pointers defining the search range
- At each step, we check the middle element
- If `nums[mid] < target`, the target must be in the right half → `left = mid + 1`
- If `nums[mid] > target`, the target must be in the left half → `right = mid - 1`
- When the loop ends, `left` is the first position where `nums[left] >= target`

---

### Approach 2: Lower Bound Binary Search

**Idea:** Find the lower bound (first element >= target) directly.

**Code:**
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums)
        
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        
        return left
```

**Explanation:**
- We use the "lower bound" pattern where `right` starts at `len(nums)`
- The loop continues while `left < right`
- When `nums[mid] < target`, we need to search right → `left = mid + 1`
- Otherwise, we search left → `right = mid`
- When loop ends, `left == right` is the insertion position

---

### Approach 3: Recursive Binary Search

**Idea:** Implement binary search recursively.

**Code:**
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        def binary_search(left: int, right: int) -> int:
            if left > right:
                return left
            
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                return binary_search(mid + 1, right)
            else:
                return binary_search(left, mid - 1)
        
        return binary_search(0, len(nums) - 1)
```

**Explanation:**
- Base case: when `left > right`, return `left` as insertion position
- Recursive case: same logic as iterative approach
- Returns immediately if target is found

---

### Approach 4: Linear Scan (Brute Force)

**Idea:** Scan through the array until we find a position where target should be inserted.

**Code:**
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        for i, num in enumerate(nums):
            if num >= target:
                return i
        return len(nums)
```

**Explanation:**
- Simple but inefficient approach
- Returns first index where `nums[i] >= target`
- If no such index exists, return `len(nums)` (insert at end)

---

### Approach 5: Using bisect Module (Pythonic)

**Idea:** Use Python's built-in `bisect` module which implements binary search.

**Code:**
```python
from typing import List
import bisect

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        return bisect.bisect_left(nums, target)
```

**Explanation:**
- `bisect_left` returns the insertion position to maintain sorted order
- If target exists, it returns the leftmost position of target
- If target doesn't exist, it returns where target should be inserted
- This is the most Pythonic and concise solution

---

## Time/Space Complexity Summary

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Standard Binary Search | O(log n) | O(1) | Recommended, clean and efficient |
| Lower Bound Binary Search | O(log n) | O(1) | Elegant variant |
| Recursive Binary Search | O(log n) | O(log n) | Stack space for recursion |
| Linear Scan | O(n) | O(1) | Simple but too slow for large arrays |
| bisect Module | O(log n) | O(1) | Pythonic, uses built-in |

---

## Detailed Complexity Analysis

### Why O(log n) for Binary Search?

In binary search, we start with a search range of n elements.
- After 1 comparison: n/2 elements remain
- After 2 comparisons: n/4 elements remain
- After k comparisons: n/2^k elements remain

The search continues until the range is empty, i.e., n/2^k < 1, which means k > log₂(n).

Thus, the number of comparisons is O(log n).

### Why return `left` when target not found?

Consider the invariant during binary search:
- All elements at indices < `left` are < target
- All elements at indices > `right` are > target

When the loop terminates (`left > right`):
- `left` is the first position where `nums[left] >= target`
- This is exactly where target should be inserted

---

## Related Problems

| Problem | Description | Link |
|---------|-------------|------|
| **Binary Search** | Basic binary search implementation | [LC 704](https://leetcode.com/problems/binary-search/) / [Solution](./binary-search.md) |
| **Find First and Last Occurrence** | Find first/last position of target in sorted array with duplicates | [LC 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) / [Solution](./binary-search-find-first-last-occurrence.md) |
| **Search in Rotated Sorted Array** | Search in a rotated sorted array | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| **Search a 2D Matrix** | Search in a 2D matrix with sorted rows and columns | [LC 74](https://leetcode.com/problems/search-a-2d-matrix/) |
| **Find Minimum in Rotated Sorted Array** | Find minimum in rotated sorted array | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| **Guess Number Higher or Lower** | Guess number with hint (higher/lower) | [LC 374](https://leetcode.com/problems/guess-number-higher-or-lower/) |
| **Search Insert Position (Variations)** | With duplicates, 2D matrix, etc. | Practice variations |

---

## Video Tutorials

1. [NeetCode - Search Insert Position](https://www.youtube.com/watch?v=FYYE3D4eS7E)
2. [Binary Search - Find Insert Position](https://www.youtube.com/watch?v=KA7xKdDsV6E)
3. [Fraz - Binary Search Playlist](https://www.youtube.com/watch?v=13YBuu2X1cA)
4. [Abdul Bari - Binary Search Explanation](https://www.youtube.com/watch?v=C2ap5_0pTuM)

---

## Follow-up Questions

1. **What if the array contains duplicates?**  
   Use `bisect_left` to find the leftmost position, or modify binary search to continue searching left after finding a match for the first occurrence.

2. **How would you modify the solution for a 2D matrix?**  
   First perform binary search on rows to find the target row, then binary search within that row. See "Search a 2D Matrix" (LC 74).

3. **What if the array is rotated (like in Search in Rotated Sorted Array)?**  
   You need to determine which half is sorted at each step and adjust the search accordingly.

4. **How would you count how many numbers are less than the target?**  
   The answer is exactly the insertion position! `searchInsert(nums, target)` returns the count of elements < target.

5. **Can you solve this without binary search using built-in functions?**  
   In Python, you can use `bisect.bisect_left(nums, target)` which implements binary search internally.

6. **What if you need to insert multiple values efficiently?**  
   Consider using a data structure like a balanced BST or skip list for O(log n) insertions.

7. **How would you handle the case where you need to return the insertion position for multiple queries?**  
   Preprocess the array into a structure that supports fast queries, or use fractional cascading if queries are related.

---

## Summary

The Search Insert Position problem demonstrates the power of binary search on sorted arrays:

- **Key Insight**: The insertion position is the first index where `nums[i] >= target`
- **Algorithm**: Binary search with O(log n) time complexity
- **Return Value**: Return the index if found, otherwise return `left` (or `right` + 1)
- **Variations**: Can be extended to handle duplicates, 2D matrices, rotated arrays

The standard binary search approach is both intuitive and efficient, making it the recommended solution for this problem.

