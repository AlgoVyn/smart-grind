# First Missing Positive

## Problem Description

Given an unsorted integer array `nums`, find the smallest missing positive integer.

The algorithm should run in **O(n)** time and use **O(1)** extra space.

---

## Detailed Problem Statement

You are given an integer array `nums`. You need to find the smallest positive integer that is **not** present in the array.

**Constraints:**
- `1 <= len(nums) <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`

**Note:** You must achieve O(n) time complexity and O(1) space complexity.

---

## Examples

### Example 1:
```
Input: nums = [1, 2, 0]
Output: 3
Explanation: The array contains 1, 2, and 0. The smallest missing positive is 3.
```

### Example 2:
```
Input: nums = [3, 4, -1, 1]
Output: 2
Explanation: The array contains 1, 3, and 4. The smallest missing positive is 2.
```

### Example 3:
```
Input: nums = [7, 8, 9, 11, 12]
Output: 1
Explanation: The array does not contain 1. The smallest missing positive is 1.
```

### Example 4:
```
Input: nums = [1]
Output: 2
Explanation: The array contains 1, so the smallest missing positive is 2.
```

### Example 5:
```
Input: nums = [-1, -2, -3]
Output: 1
Explanation: The array contains no positive integers. The smallest missing positive is 1.
```

---

## Intuition

The key insight is that for an array of length `n`, the smallest missing positive must be in the range `[1, n+1]`. This is because:

1. If the array contains all numbers from `1` to `n`, the answer is `n+1`.
2. If any number in `[1, n]` is missing, that's our answer.

Therefore, we only care about values in the range `[1, n]`. We can use the array itself as a hash table by placing each number in its "correct" position - the value `k` should be at index `k-1`.

---

## Approach 1: Cyclic Sort (Optimal)

### Algorithm

1. **First Pass - Cyclic Sort:**
   - Iterate through the array
   - For each element at index `i`, if it's in the range `[1, n]`, swap it to its correct position (index = nums[i] - 1)
   - Continue until the element is in the correct position or out of range

2. **Second Pass - Find Missing:**
   - Iterate through the sorted array
   - The first index `i` where `nums[i] != i + 1` indicates the missing positive
   - If all positions are correct, return `n + 1`

### Python Implementation

```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        """
        Finds the smallest missing positive integer using cyclic sort.
        
        Args:
            nums: List of integers (may be unsorted and contain negatives)
            
        Returns:
            The smallest missing positive integer
        """
        n = len(nums)
        
        # First pass: place each number in its correct position
        i = 0
        while i < n:
            correct = nums[i] - 1
            
            # Check if current element should be swapped:
            # 1. It's in range [1, n]
            # 2. It's not already in its correct position
            # 3. No duplicates (to avoid infinite loop)
            if 1 <= nums[i] <= n and nums[i] != nums[correct]:
                # Swap nums[i] with nums[correct]
                nums[i], nums[correct] = nums[correct], nums[i]
            else:
                i += 1
        
        # Second pass: find the first index where value doesn't match
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        
        # If all positions [1, n] are correct, answer is n+1
        return n + 1
```

---

## Approach 2: Hash Set (Simpler but O(n) Space)

### Algorithm

1. Create a hash set from all positive numbers in the array
2. Iterate from `1` to `n+1`
3. Return the first number not in the set

### Python Implementation

```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        num_set = set()
        
        # Add all positive numbers to the set
        for num in nums:
            if num > 0:
                num_set.add(num)
        
        # Check from 1 to n+1
        for i in range(1, len(nums) + 2):
            if i not in num_set:
                return i
                
        return len(nums) + 1  # Should never reach here
```

### Time Complexity
- **Time Complexity**: O(n)
- **Space Complexity**: O(n) for the hash set

---

## Approach 3: Marking with Negatives (O(1) Space Alternative)

### Algorithm

1. Replace all negative numbers and zeros with a dummy value (n+1)
2. Mark presence of numbers by negating the value at index `abs(num) - 1`
3. Find the first index where the value is not negative

### Python Implementation

```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        
        # First: replace negatives and zeros with a value > n
        for i in range(n):
            if nums[i] <= 0 or nums[i] > n:
                nums[i] = n + 1
        
        # Second: mark presence by negating
        for i in range(n):
            val = abs(nums[i])
            if 1 <= val <= n:
                nums[val - 1] = -abs(nums[val - 1])
        
        # Third: find first positive
        for i in range(n):
            if nums[i] > 0:
                return i + 1
        
        return n + 1
```

---

## Complexity Analysis

### Cyclic Sort Approach (Recommended)

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Each element is visited at most once during cyclic sort, and once during the final scan |
| **Space** | O(1) | In-place sorting, only uses constant extra variables |

### Hash Set Approach

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Building the set and scanning are both O(n) |
| **Space** | O(n) | Additional hash set stores up to n elements |

### Marking with Negatives Approach

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Three linear passes through the array |
| **Space** | O(1) | In-place modifications |

---

## Why Cyclic Sort is Optimal

1. **Time**: O(n) - optimal for this problem
2. **Space**: O(1) - meets the strict constraint
3. **No Extra Data Structures**: Uses the array itself as a hash table
4. **Simple Logic**: Easy to understand and implement correctly

---

## Common Pitfalls

1. **Infinite Loop**: When swapping, make sure the element at the target position isn't the same (check for duplicates)
2. **Index Out of Bounds**: When calculating `nums[i] - 1`, ensure `nums[i]` is in range `[1, n]`
3. **Wrong Answer for Edge Cases**: Remember to return `n + 1` if all positions `[1, n]` are correct
4. **Modifying Original Array**: The problem allows in-place modification

---

## Related Problems

| Problem | LeetCode # | Difficulty | Similarity |
|---------|------------|------------|------------|
| [Find the Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Finding missing value using cyclic sort |
| [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) | 448 | Easy | Uses similar marking technique |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch/) | 645 | Easy | Finding duplicate and missing |
| [Find Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) | 287 | Medium | Uses array as hash table |
| [First Missing Positive](https://leetcode.com/problems/first-missing-positive/) | 41 | Hard | **This problem** |

---

## Video Tutorial Links

1. **[First Missing Positive - NeetCode](https://www.youtube.com/watch?v=8g78s1fT9nE)** - Excellent explanation with visual examples
2. **[Cyclic Sort Pattern - BacktoBack SWE](https://www.youtube.com/watch?v=Hc2mHCrKnbs)** - Deep dive into cyclic sort
3. **[First Missing Positive - William Lin](https://www.youtube.com/watch?v=2G4D9hX7pLo)** - Clean and concise explanation
4. **[First Missing Positive - LeetCode Official Solution](https://www.youtube.com/watch?v=YK2D4m3v0IY)** - Official solution walkthrough
5. **[Blind 75 - First Missing Positive](https://www.youtube.com/watch?v=2M_f22S2pEQ)** - Part of popular interview prep list

---

## Summary

The **First Missing Positive** problem is a classic example of using the array itself as a hash table. The key insights are:

1. The answer is always in `[1, n+1]`
2. We can place each number in its correct position without extra space
3. Cyclic sort is the optimal approach achieving O(n) time and O(1) space

This problem frequently appears in technical interviews and is essential for understanding in-place algorithms and cyclic sort patterns.

