# Sort Array by Parity

## Problem Description

Given an integer array `nums`, move all even integers to the front of the array followed by all odd integers.

Return any array that satisfies this condition.

**Link to problem:** [Sort Array by Parity - LeetCode 905](https://leetcode.com/problems/sort-array-by-parity/)

## Constraints
- `1 <= nums.length <= 5000`
- `0 <= nums[i] <= 5000`

---

## Pattern: Two Pointers - Partition

This problem is a classic example of the **Two Pointers - Partition** pattern. The pattern involves using two pointers moving in opposite directions to partition an array based on a condition.

### Core Concept

The fundamental idea is similar to the partition step in QuickSort:
- Use one pointer at the start (left) and one at the end (right)
- Move the left pointer forward until you find an odd number
- Move the right pointer backward until you find an even number
- Swap them and continue

This achieves O(n) time and O(1) space - optimal for this problem.

---

## Examples

### Example

**Input:**
```
nums = [3, 1, 2, 4]
```

**Output:**
```
[2, 4, 3, 1]
```

**Explanation:** Even numbers (2, 4) are placed at the front, followed by odd numbers (3, 1). The exact order of each group doesn't matter.

### Example 2

**Input:**
```
nums = [0]
```

**Output:**
```
[0]
```

**Explanation:** Single element array is already valid (0 is even).

### Example 3

**Input:**
```
nums = [1, 3, 5, 7]
```

**Output:**
```
[1, 3, 5, 7]
```

**Explanation:** All odd numbers - they all go at the end (which can be the front too).

### Example 4

**Input:**
```
nums = [2, 4, 6, 8]
```

**Output:**
```
[2, 4, 6, 8]
```

**Explanation:** All even numbers - they all go at the front.

---

## Intuition

The key insight is recognizing this as a partitioning problem, similar to:
- Partitioning in QuickSort
- Separating zeros and ones
- Moving all negative numbers to one side

### Why Two Pointers Works

1. **Efficiency**: We process each element at most once
2. **In-Place**: No extra space needed beyond the two pointers
3. **Simple Logic**: The swap-based approach is easy to understand

### Alternative Views

- Think of it as "even numbers are wanted at the front"
- Left pointer finds unwanted (odd), right pointer finds wanted (even)
- Swap to place them correctly

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers (Optimal)** - O(n) time, O(1) space
2. **Two-Pass (Simple)** - O(n) time, O(n) space
3. **Stable Partition** - Preserves relative order

---

## Approach 1: Two Pointers (Optimal)

This is the most efficient approach with O(n) time and O(1) space.

### Algorithm Steps

1. Initialize `left = 0` and `right = len(nums) - 1`
2. While `left < right`:
   - If `nums[left]` is even, increment `left`
   - Otherwise, swap `nums[left]` and `nums[right]`, decrement `right`
3. Return the array

### Why It Works

Each iteration:
- Left pointer skips all even numbers (already in correct position)
- When left finds odd, right pointer finds even to swap with
- After swap, the odd moves to the back (correct position)
- Pointers continue until they meet

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        """
        Sort array by parity (even numbers first, odd numbers second).
        
        Args:
            nums: List of integers
            
        Returns:
            Array with evens in front, odds at back
        """
        left, right = 0, len(nums) - 1
        
        while left < right:
            # Left pointer: find odd number
            if nums[left] % 2 == 0:
                left += 1
            else:
                # Swap with right pointer
                nums[left], nums[right] = nums[right], nums[left]
                right -= 1
        
        return nums
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> sortArrayByParity(vector<int>& nums) {
        /**
         * Sort array by parity (even numbers first, odd numbers second).
         * 
         * Args:
         *     nums: Reference to vector of integers
         * 
         * Returns:
         *     Vector with evens in front, odds at back
         */
        int left = 0;
        int right = nums.size() - 1;
        
        while (left < right) {
            // Left pointer: find odd number
            if (nums[left] % 2 == 0) {
                left++;
            } else {
                // Swap with right pointer
                swap(nums[left], nums[right]);
                right--;
            }
        }
        
        return nums;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] sortArrayByParity(int[] nums) {
        /**
         * Sort array by parity (even numbers first, odd numbers second).
         * 
         * Args:
         *     nums: Array of integers
         * 
         * Returns:
         *     Array with evens in front, odds at back
         */
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            // Left pointer: find odd number
            if (nums[left] % 2 == 0) {
                left++;
            } else {
                // Swap with right pointer
                int temp = nums[left];
                nums[left] = nums[right];
                nums[right] = temp;
                right--;
            }
        }
        
        return nums;
    }
}
```

<!-- slide -->
```javascript
/**
 * Sort array by parity (even numbers first, odd numbers second).
 * 
 * @param {number[]} nums - Array of integers
 * @return {number[]} - Array with evens in front, odds at back
 */
var sortArrayByParity = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        // Left pointer: find odd number
        if (nums[left] % 2 === 0) {
            left++;
        } else {
            // Swap with right pointer
            [nums[left], nums[right]] = [nums[right], nums[left]];
            right--;
        }
    }
    
    return nums;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most once |
| **Space** | O(1) - In-place modification, no extra space |

---

## Approach 2: Two-Pass (Simple)

This approach uses two passes - collect evens first, then odds.

### Algorithm Steps

1. Create a result array
2. First pass: add all even numbers to result
3. Second pass: add all odd numbers to result
4. Return result

### Code Implementation

````carousel
```python
class Solution:
    def sortArrayByParity_two_pass(self, nums: List[int]) -> List[int]:
        """
        Two-pass approach: collect evens then odds.
        """
        result = []
        
        # First pass: add evens
        for num in nums:
            if num % 2 == 0:
                result.append(num)
        
        # Second pass: add odds
        for num in nums:
            if num % 2 == 1:
                result.append(num)
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> sortArrayByParity(vector<int>& nums) {
        vector<int> result;
        
        // First pass: add evens
        for (int num : nums) {
            if (num % 2 == 0) {
                result.push_back(num);
            }
        }
        
        // Second pass: add odds
        for (int num : nums) {
            if (num % 2 == 1) {
                result.push_back(num);
            }
        }
        
        return result;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through array |
| **Space** | O(n) - Requires extra result array |

---

## Approach 3: Stable Partition

This approach preserves the relative order of elements within each group.

### Code Implementation

````carousel
```python
class Solution:
    def sortArrayByParity_stable(self, nums: List[int]) -> List[int]:
        """
        Stable partition: preserves relative order.
        """
        # Insert odds at their relative positions
        result = []
        even_count = 0
        
        for num in nums:
            if num % 2 == 0:
                result.insert(even_count, num)
                even_count += 1
            else:
                result.append(num)
        
        return result
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) worst case - insert is O(n) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Two Pointers | Two-Pass | Stable |
|--------|-------------|----------|--------|
| **Time Complexity** | O(n) | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(n) | O(n) |
| **Stability** | No | No | Yes |
| **Recommended** | ✅ Yes | For simplicity | When order matters |

**Best Approach:** Two Pointers (Approach 1) is optimal with O(n) time and O(1) space.

---

## Why Two Pointers is Optimal for This Problem

The two-pointer approach is optimal because:

1. **Single Pass**: Each element is visited at most once
2. **No Extra Space**: Operates in-place
3. **Simple Logic**: Easy to understand and implement
4. **Cache Friendly**: Sequential memory access pattern
5. **Industry Standard**: Commonly used for partition problems

---

## Related Problems

Based on similar themes (array partitioning, two pointers):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Partition Array by Odd and Even | [Link](https://leetcode.com/problems/partition-array-by-odd-and-even/) | Similar problem |
| Move Zeroes | [Link](https://leetcode.com/problems/move-zeroes/) | Move zeros to end |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sort Colors | [Link](https://leetcode.com/problems/sort-colors/) | Three-way partition |
| Partition Array for Maximum Sum | [Link](https://leetcode.com/problems/partition-array-for-maximum-subarray-sum/) | DP with partition |

### Pattern Reference

For more detailed explanations of the Two Pointers pattern, see:
- **[Two Pointers Pattern](/patterns/two-pointers-partition)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Two Pointers Technique

- [NeetCode - Sort Array by Parity](https://www.youtube.com/watch?v=1dOLMyR4NwM) - Clear explanation
- [Two Pointers Pattern](https://www.youtube.com/watch?v=Mq6i5T4j5lQ) - Pattern explanation
- [Partition in Arrays](https://www.youtube.com/watch?v=V7N0B4k3kzs) - Partition concept

---

## Follow-up Questions

### Q1: How would you sort in descending order (odds first)?

**Answer:** Swap the parity check: if `num % 2 == 1` (odd), skip it; otherwise swap with right.

---

### Q2: Can you do this without modifying the original array?

**Answer:** Use the two-pass approach (Approach 2) which creates a new array.

---

### Q3: How would you handle a stable sort (preserve relative order)?

**Answer:** Use the stable partition approach (Approach 3), but be aware of the O(n²) time complexity.

---

### Q4: What if you need to partition into three groups (negative, zero, positive)?

**Answer:** Use the Dutch National Flag algorithm (three-way partition) - similar to Sort Colors problem.

---

### Q5: How does this compare to using Python's built-in sort?

**Answer:** Custom key sort: `sorted(nums, key=lambda x: x % 2)` - simpler but O(n log n).

---

### Q6: What are the edge cases?

**Answer:**
- Single element array
- All even numbers
- All odd numbers
- Array with zeros (even)
- Alternating even/odd

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue**: Using `<=` instead of `<` in the while condition causing infinite loop.

**Solution**: Use `while left < right` to ensure pointers converge.

### 2. Not Decrementing Right
**Issue**: Forgetting to decrement right after swapping, causing infinite loop.

**Solution**: Always decrement right after swap: `right -= 1`.

### 3. Wrong Parity Check
**Issue**: Using `num % 2 != 0` vs `num % 2 == 1` - both work but be consistent.

**Solution**: Use `num % 2 == 0` for even, `num % 2 == 1` for odd.

### 4. Not Handling Empty Array
**Issue**: Assuming array has at least one element.

**Solution**: The algorithm naturally handles empty arrays.

### 5. Modifying Input When Not Allowed
**Issue**: Problem doesn't require in-place, but solution assumes it.

**Solution**: Use two-pass approach if in-place modification isn't allowed.

---

## Summary

The **Sort Array by Parity** problem demonstrates the power of the two-pointer partition pattern:

- **Two Pointers**: Optimal O(n) time, O(1) space
- **Two-Pass**: Simple O(n) time, O(n) space
- **Stable**: Preserves order but O(n²) time

The key insight is recognizing this as a partition problem similar to QuickSort. By using two pointers moving toward each other, we can efficiently separate evens from odds in a single pass.

This problem is an excellent demonstration of how simple algorithmic patterns can solve seemingly complex problems efficiently.

### Pattern Summary

This problem exemplifies the **Two Pointers - Partition** pattern, characterized by:
- Using two pointers moving in opposite directions
- Partitioning based on a condition
- Achieving O(n) time with O(1) space

For more details on this pattern and its variations, see the **[Two Pointers Pattern](/patterns/two-pointers-partition)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/sort-array-by-parity/discuss/) - Community solutions
- [Two Pointers Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [QuickSort Partition](https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme) - Related algorithm
