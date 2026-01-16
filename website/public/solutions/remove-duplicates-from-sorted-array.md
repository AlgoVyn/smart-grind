# Remove Duplicates From Sorted Array

## Problem Description

Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Consider the number of unique elements in `nums` to be `k`. After removing duplicates, return the number of unique elements `k`.

The first `k` elements of `nums` should contain the unique numbers in sorted order. The remaining elements beyond index `k - 1` can be ignored.

### Custom Judge

The judge will test your solution with the following code:

```python
nums = [...]          # Input array
expectedNums = [...]  # The expected answer with correct length

k = removeDuplicates(nums)  # Calls your implementation

assert k == expectedNums.length
for i in range(k):
    assert nums[i] == expectedNums[i]
```

If all assertions pass, then your solution will be accepted.

---

## Examples

### Example 1

**Input:**
```python
nums = [1,1,2]
```

**Output:**
```python
2, nums = [1,2,_]
```

**Explanation:** Your function should return `k = 2`, with the first two elements of `nums` being `1` and `2` respectively. It does not matter what you leave beyond the returned `k$ (hence they are underscores).

---

### Example 2

**Input:**
```python
nums = [0,0,1,1,1,2,2,3,3,4]
```

**Output:**
```python
5, nums = [0,1,2,3,4,_,_,_,_,_]
```

**Explanation:** Your function should return `k = 5`, with the first five elements of `nums` being `0, 1, 2, 3,` and `4` respectively. It does not matter what you leave beyond the returned `k` (hence they are underscores).

---

### Example 3 (Edge Cases)

**Input:**
```python
nums = [1,1,1,1]
```

**Output:**
```python
1, nums = [1,_,_,_]
```

**Explanation:** All elements are duplicates, so the result contains only one unique element.

---

### Example 4 (All Unique)

**Input:**
```python
nums = [1,2,3,4,5]
```

**Output:**
```python
5, nums = [1,2,3,4,5]
```

**Explanation:** No duplicates to remove, so all elements are preserved.

---

### Example 5 (Single Element)

**Input:**
```python
nums = [1]
```

**Output:**
```python
1, nums = [1]
```

**Explanation:** Single element array, already has no duplicates.

---

## Constraints

- $1 \leq \text{nums.length} \leq 3 \times 10^4$
- $-100 \leq \text{nums[i]} \leq 100$
- `nums` is sorted in non-decreasing order.

---

## Intuition

The key insight for this problem lies in the fact that the array is **already sorted**. This means that all duplicates will be **adjacent** to each other. 

### Key Observations

1. **Sorted Property**: Since the array is sorted, duplicate elements will always appear consecutively.

2. **Two-Pointer Technique**: We can use two pointers - one to read through the array and another to write unique elements.

3. **In-Place Modification**: We need to modify the array without using extra space proportional to the input size.

### Visual Example

For input: `[0,0,1,1,1,2,2,3,3,4]`

```
Index:     0   1   2   3   4   5   6   7   8   9
Values: [0,   0,  1,  1,  1,  2,  2,  3,  3,  4]
          ↑                                   ↑
       read pointer                      write pointer

Step 1: nums[1] == nums[0] → duplicate, skip
Step 2: nums[2] != nums[1] → unique, write to position 1
Step 3: nums[3] == nums[2] → duplicate, skip
Step 4: nums[4] == nums[2] → duplicate, skip
Step 5: nums[5] != nums[3] → unique, write to position 2
... and so on

Result: [0, 1, 2, 3, 4, _, _, _, _, _]
```

---

## Solution Approaches

### Approach 1: Two-Pointer Technique (Optimal)

This is the most efficient and commonly used approach for this problem.

**Algorithm:**
1. Handle edge case: if array is empty, return 0
2. Initialize a `write` pointer at index 1 (since first element is always unique)
3. Iterate through the array starting from index 1 using a `read` pointer
4. For each element, compare it with the element at `write - 1`
5. If different, write it to the `write` position and increment `write`
6. Return `write` as the count of unique elements

**Why it works:** The `write` pointer always points to the position where the next unique element should be placed. By comparing each element with the element just before the `write` position, we ensure that we only keep unique elements while maintaining their relative order.

**Code Implementation:**

```python
from typing import List

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Removes duplicates from a sorted array in-place.
        
        Args:
            nums: List of integers sorted in non-decreasing order
            
        Returns:
            The number of unique elements in the array
        """
        if not nums:
            return 0
        
        # write pointer starts at 1 (first element is always unique)
        write = 1
        
        # read pointer traverses the array
        for read in range(1, len(nums)):
            # If current element is different from the last unique element
            if nums[read] != nums[write - 1]:
                # Write it to the write position
                nums[write] = nums[read]
                # Move write pointer forward
                write += 1
        
        return write
```

---

### Approach 2: Using Enumerate (Pythonic)

A more Pythonic version using `enumerate()` for cleaner code.

**Code Implementation:**

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Pythonic approach using enumerate.
        """
        if not nums:
            return 0
        
        write = 1
        for i, num in enumerate(nums[1:], start=1):
            if num != nums[write - 1]:
                nums[write] = num
                write += 1
        
        return write
```

---

### Approach 3: Using itertools.groupby (Functional)

A functional programming approach using Python's `itertools.groupby`.

**Code Implementation:**

```python
from typing import List
from itertools import groupby

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Functional approach using groupby.
        Note: This modifies nums in-place but reads from an iterator.
        """
        if not nums:
            return 0
        
        # Get unique elements using groupby
        unique_elements = [key for key, _ in groupby(nums)]
        
        # Copy unique elements back to nums
        for i, val in enumerate(unique_elements):
            nums[i] = val
        
        return len(unique_elements)
```

**Note:** This approach is less memory-efficient but demonstrates different programming paradigms.

---

### Approach 4: Recursive Solution (Educational)

A recursive approach for educational purposes (not recommended for production).

**Code Implementation:**

```python
from typing import List

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Recursive approach (not recommended for production).
        """
        def helper(index: int, write: int) -> int:
            if index == len(nums):
                return write
            
            if nums[index] != nums[write - 1]:
                write += 1
                if write != index + 1:
                    nums[write - 1] = nums[index]
            
            return helper(index + 1, write)
        
        if not nums:
            return 0
        
        return helper(1, 1)
```

---

## Time and Space Complexity Analysis

### Approach 1: Two-Pointer Technique (Recommended)

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | $O(n)$ | Each element is visited exactly once |
| **Space** | $O(1)$ | Only uses two pointers, no extra space |

### Approach 2: Using Enumerate

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | $O(n)$ | Each element is visited exactly once |
| **Space** | $O(1)$ | Only uses one extra variable |

### Approach 3: Using itertools.groupby

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | $O(n)$ | groupby iterates through the list once |
| **Space** | $O(n)$ | Creates a new list of unique elements |

### Approach 4: Recursive Solution

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | $O(n)$ | Each element is visited once |
| **Space** | $O(n)$ | Recursive call stack uses O(n) space |

**Best Approach:** Approach 1 (Two-Pointer) is optimal with $O(n)$ time and $O(1)$ space complexity.

---

## Related Problems

### Easy Problems

1. **[Remove Duplicates From Sorted List (83)](https://leetcode.com/problems/remove-duplicates-from-sorted-list/)**
   - Linked list version of this problem
   - Similar two-pointer approach but for linked list

2. **[Remove Duplicates From Sorted Array II (80)](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)**
   - Allow at most two occurrences of each element
   - Slight modification to the two-pointer approach

3. **[Contains Duplicate (217)](https://leetcode.com/problems/contains-duplicate/)**
   - Check if any duplicate exists in an array
   - Uses a hash set for O(1) lookups

4. **[Contains Duplicate II (219)](https://leetcode.com/problems/contains-duplicate-ii/)**
   - Check for duplicates within distance k
   - Uses sliding window with hash set

### Medium Problems

5. **[Remove Element (27)](https://leetcode.com/problems/remove-element/)**
   - Remove all instances of a value in-place
   - Similar two-pointer technique

6. **[Sort Colors (75)](https://leetcode.com/problems/sort-colors/)**
   - Dutch National Flag problem
   - Three-way partitioning

7. **[Merge Sorted Array (88)](https://leetcode.com/problems/merge-sorted-array/)**
   - Merge two sorted arrays in-place
   - Uses backward two-pointer approach

### Hard Problems

8. **[Remove Duplicates From Sorted List II (82)](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/)**
   - Remove all nodes with duplicates from sorted linked list
   - More complex due to removing all occurrences

9. **[First Missing Positive (41)](https://leetcode.com/problems/first-missing-positive/)**
   - Find smallest missing positive integer
   - Uses in-place array manipulation

---

## Video Tutorials

### Beginner-Friendly

1. **[NeetCode - Remove Duplicates From Sorted Array](https://www.youtube.com/watch?v=DEJQA4L9CtQ)**
   - Clear explanation with visual examples
   - Step-by-step walkthrough of the two-pointer approach

2. **[Take U Forward - Remove Duplicates](https://www.youtube.com/watch?v=1U1ccr3X1bI)**
   - Indian educational channel
   - Multiple approaches explained

### In-Depth Analysis

3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=xy-Ud7ySB24)**
   - Official problem solution
   - Contains multiple language implementations

4. **[Two Pointers Technique - CodeWithJulius](https://www.youtube.com/watch?v=p5cXwJ3X1wQ)**
   - Explains the two-pointer technique in detail
   - Visual animations

### Advanced Topics

5. **[Remove Duplicates From Sorted Array II - NeetCode](https://www.youtube.com/watch?v=qD2DpqtqN6Y)**
   - Follow-up problem with at most two occurrences
   - Demonstrates algorithm adaptation

---

## Follow-up Questions

### Performance and Complexity

1. **Can you solve it in O(n) time and O(1) space?**
   - Yes! The two-pointer approach achieves O(n) time and O(1) space. This is the optimal solution.

2. **What if the array wasn't sorted? How would your approach change?**
   - Without sorting, you would need:
     - A hash set for O(1) lookups (O(n) space)
     - Or sorting first (O(n log n) time)
   - The in-place O(1) space solution would not be possible

3. **How would you count the number of duplicates removed?**
   ```python
   def count_removed_duplicates(nums):
       if not nums:
           return 0
       unique = removeDuplicates(nums)
       return len(nums) - unique
   ```

### Algorithmic Extensions

4. **How would you modify the solution to allow at most k occurrences of each element?**
   ```python
   def remove_duplicates_k(nums, k):
       if len(nums) <= k:
           return len(nums)
       
       write = k
       for i in range(k, len(nums)):
           if nums[i] != nums[write - k]:
               nums[write] = nums[i]
               write += 1
       
       return write
   ```

5. **How would you handle removing duplicates from a descending sorted array?**
   - The solution works the same way since duplicates are still adjacent
   - Simply replace `nums[read] != nums[write - 1]` with the same comparison

6. **What if you needed to remove duplicates while preserving the last occurrence instead of the first?**
   - Process the array in reverse order
   - Use `nums[read] != nums[write + 1]` comparison

### Practical Applications

7. **How would you extend this to work with a custom comparator?**
   ```python
   def remove_duplicates_custom(nums, key=lambda x: x):
       if not nums:
           return 0
       
       write = 1
       for read in range(1, len(nums)):
           if key(nums[read]) != key(nums[write - 1]):
               nums[write] = nums[read]
               write += 1
       
       return write
   ```

8. **How would you modify the solution for a circular array?**
   - The algorithm works the same for circular arrays
   - Duplicates are still adjacent in the sorted portion

### Edge Cases and Testing

9. **What edge cases should be tested?**
   - Empty array: `[]` → return 0
   - Single element: `[1]` → return 1
   - All duplicates: `[1,1,1,1]` → return 1
   - No duplicates: `[1,2,3,4,5]` → return 5
   - Negative numbers: `[-1,-1,0,0,1,1]` → return 3
   - Mixed positive/negative: `[-2,-2,-1,0,0,1,1]` → return 4

10. **How would you verify correctness without a custom judge?**
    ```python
    def verify_solution(nums, k):
        # Check first k elements are unique and sorted
        unique_set = set()
        for i in range(k):
            if nums[i] in unique_set:
                return False
            unique_set.add(nums[i])
        
        # Check original order is preserved
        original_unique = []
        prev = None
        for num in nums:
            if num != prev:
                original_unique.append(num)
                prev = num
        
        return original_unique[:k] == list(unique_set)
    ```

### Real-World Applications

11. **How is this problem relevant in real-world applications?**
    - **Data cleaning**: Removing duplicate records from sorted datasets
    - **Compression**: Preparing data for run-length encoding
    - **Database optimization**: Removing duplicate entries in queries
    - **Signal processing**: Removing duplicate samples in sorted signals

12. **How would you parallelize this algorithm for very large arrays?**
    - Since the array is sorted, you can split it into chunks
    - Each processor removes duplicates in its chunk
    - Merge results and remove duplicates at chunk boundaries
    - Note: This adds overhead and complexity; sequential is usually better for this problem

---

## Summary

The **Remove Duplicates From Sorted Array** problem is a classic two-pointer problem that demonstrates the power of leveraging problem constraints (sorted array) to achieve optimal time and space complexity.

### Key Takeaways

1. **Two-Pointer Technique**: Using read and write pointers allows in-place modification
2. **Sorted Property**: The sorted nature ensures duplicates are adjacent, simplifying detection
3. **Optimal Complexity**: Achieves O(n) time and O(1) space
4. **Real-World Relevance**: Applicable in data cleaning, compression, and optimization tasks

### Comparison of Approaches

| Approach | Time | Space | Recommended |
|----------|------|-------|-------------|
| Two-Pointer | O(n) | O(1) | ✅ Yes |
| Enumerate | O(n) | O(1) | ✅ Yes (Pythonic) |
| groupby | O(n) | O(n) | ❌ Less efficient |
| Recursive | O(n) | O(n) | ❌ Stack overflow risk |

The two-pointer approach is the optimal solution for this problem and should be the first choice in interviews and production code.

---

## References

- [LeetCode 26 - Remove Duplicates From Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- Problem constraints and examples from LeetCode
- Two-pointer technique patterns from algorithm literature

