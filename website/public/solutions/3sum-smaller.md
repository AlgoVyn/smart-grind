# 3Sum Smaller

## LeetCode Link

[3Sum Smaller - LeetCode](https://leetcode.com/problems/3sum-smaller/)

---

## Problem Description

Given an integer array `nums` and an integer `target`, return the number of triplets `i`, `j`, `k` such that `i < j < k` and `nums[i] + nums[j] + nums[k] < target`.

---

## Intuition

The key insight is that we need to count triplets where the sum is less than target. A brute force O(n³) approach would check all triplets, but we can do better.

**Key observations:**
1. If we sort the array, we can use two pointers to find valid pairs efficiently
2. When `nums[i] + nums[left] + nums[right] < target` with sorted array, we know all elements between left and right will also form valid triplets with nums[i]
3. This is because the array is sorted - if the sum with nums[right] is valid, sums with smaller elements (left through right-1) will also be valid

This leads to an O(n²) solution instead of O(n³).

---

## Examples

**Example 1:**
**Input:**
```python
nums = [-2,0,1,3], target = 2
```
**Output:**
```python
2
```
**Explanation:** There are 2 triplets whose sum is less than 2: [-2,0,1] and [-2,0,3].

**Example 2:**
**Input:**
```python
nums = [], target = 0
```
**Output:**
```python
0
```

**Example 3:**
**Input:**
```python
nums = [0], target = 0
```
**Output:**
```python
0
```

---

## Constraints
- 0 <= nums.length <= 1000
- -1000 <= nums[i] <= 1000
- -1000 <= target <= 1000

---

## Pattern: Two Pointer with Counting

This problem follows the **Two Pointer with Counting** pattern, commonly used in problems that require counting triplets or pairs that satisfy certain conditions.

### Core Concept

- **Sorting**: Enables efficient two-pointer movement
- **Counting optimization**: When a valid triplet is found, count all elements between pointers
- **Pruning**: Skip unnecessary iterations by leveraging sorted order

### When to Use This Pattern

This pattern is applicable when:
1. Counting triplets/pairs with sum less than/greater than target
2. Problems requiring O(n²) solution with sorting
3. Any bounded sum counting problem

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Brute Force | O(n³) - Check all triplets |
| Hash Set | O(n²) with extra space |
| Binary Search | O(n² log n) for each pair |

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointer with Sorting** - Optimal solution
2. **Binary Search Approach** - Alternative method

---

## Approach 1: Two Pointer with Sorting (Optimal)

### Algorithm Steps

1. **Sort the array**: This enables the two-pointer technique
2. **Fix first element**: Iterate through each possible first element at index i
3. **Use two pointers**: For each i, use left and right pointers to find valid pairs
4. **Count efficiently**: When a valid triplet is found, add (right - left) to count
5. **Return result**: After processing all elements, return the count

### Why It Works

When we have a sorted array and find that `nums[i] + nums[left] + nums[right] < target`, we know that for any position between left and right, the sum will also be valid. This is because the array is sorted, so replacing nums[right] with any smaller element will only decrease the sum. This allows us to count multiple triplets in O(1) time each.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def threeSumSmaller(self, nums: List[int], target: int) -> int:
        """
        Count triplets with sum less than target using two-pointer technique.
        
        Args:
            nums: List of integers
            target: Target sum threshold
            
        Returns:
            Number of triplets with sum less than target
        """
        if len(nums) < 3:
            return 0
        
        nums.sort()
        count = 0
        n = len(nums)
        
        for i in range(n - 2):
            left, right = i + 1, n - 1
            while left < right:
                current_sum = nums[i] + nums[left] + nums[right]
                if current_sum < target:
                    # All elements between left and right form valid triplets
                    count += right - left
                    left += 1
                else:
                    right -= 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int threeSumSmaller(vector<int>& nums, int target) {
        if (nums.size() < 3) return 0;
        
        sort(nums.begin(), nums.end());
        int count = 0;
        int n = nums.size();
        
        for (int i = 0; i < n - 2; i++) {
            int left = i + 1;
            int right = n - 1;
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                if (currentSum < target) {
                    count += right - left;
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int threeSumSmaller(int[] nums, int target) {
        if (nums == null || nums.length < 3) return 0;
        
        Arrays.sort(nums);
        int count = 0;
        int n = nums.length;
        
        for (int i = 0; i < n - 2; i++) {
            int left = i + 1;
            int right = n - 1;
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                if (currentSum < target) {
                    count += right - left;
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumSmaller = function(nums, target) {
    if (!nums || nums.length < 3) return 0;
    
    nums.sort((a, b) => a - b);
    let count = 0;
    const n = nums.length;
    
    for (let i = 0; i < n - 2; i++) {
        let left = i + 1;
        let right = n - 1;
        while (left < right) {
            const currentSum = nums[i] + nums[left] + nums[right];
            if (currentSum < target) {
                count += right - left;
                left++;
            } else {
                right--;
            }
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - sorting O(n log n) + two-pointer loops O(n²) |
| **Space** | O(1) - sorting done in place |

---

## Approach 2: Binary Search Approach

### Algorithm Steps

1. **Sort the array**: Required for binary search to work
2. **Fix first two elements**: Use nested loops for first two elements
3. **Binary search**: Find the rightmost position where sum < target
4. **Count positions**: All positions from left+1 to found position are valid
5. **Return result**: Sum up all counts

### Why It Works

For each pair (i, j) where i < j, we need to find how many k > j such that nums[i] + nums[j] + nums[k] < target. Since the array is sorted, we can binary search for the largest k that satisfies this condition.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def threeSumSmaller(self, nums: List[int], target: int) -> int:
        """
        Count triplets using binary search approach.
        
        Time Complexity: O(n² log n)
        """
        if len(nums) < 3:
            return 0
        
        nums.sort()
        count = 0
        n = len(nums)
        
        for i in range(n - 2):
            for j in range(i + 1, n - 1):
                # Find the rightmost position where sum < target
                remaining = target - nums[i] - nums[j]
                # Binary search for the largest k where nums[k] < remaining
                left = j + 1
                right = n
                while left < right:
                    mid = (left + right) // 2
                    if nums[mid] < remaining:
                        left = mid + 1
                    else:
                        right = mid
                count += left - j - 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int threeSumSmaller(vector<int>& nums, int target) {
        if (nums.size() < 3) return 0;
        
        sort(nums.begin(), nums.end());
        int count = 0;
        int n = nums.size();
        
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                int remaining = target - nums[i] - nums[j];
                // Binary search
                int left = j + 1;
                int right = n;
                while (left < right) {
                    int mid = (left + right) / 2;
                    if (nums[mid] < remaining) {
                        left = mid + 1;
                    } else {
                        right = mid;
                    }
                }
                count += left - j - 1;
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int threeSumSmaller(int[] nums, int target) {
        if (nums == null || nums.length < 3) return 0;
        
        Arrays.sort(nums);
        int count = 0;
        int n = nums.length;
        
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                int remaining = target - nums[i] - nums[j];
                // Binary search
                int left = j + 1;
                int right = n;
                while (left < right) {
                    int mid = (left + right) / 2;
                    if (nums[mid] < remaining) {
                        left = mid + 1;
                    } else {
                        right = mid;
                    }
                }
                count += left - j - 1;
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumSmaller = function(nums, target) {
    if (!nums || nums.length < 3) return 0;
    
    nums.sort((a, b) => a - b);
    let count = 0;
    const n = nums.length;
    
    for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
            const remaining = target - nums[i] - nums[j];
            // Binary search
            let left = j + 1;
            let right = n;
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                if (nums[mid] < remaining) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            count += left - j - 1;
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) - nested loops + binary search |
| **Space** | O(1) - sorting done in place |

---

## Comparison of Approaches

| Aspect | Two Pointer | Binary Search |
|--------|-------------|---------------|
| **Time Complexity** | O(n²) | O(n² log n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simpler | More complex |
| **LeetCode Optimal** | ✅ | ❌ |

**Best Approach:** Use Approach 1 (Two Pointer) for the optimal solution.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Facebook, Microsoft, Bloomberg
- **Difficulty**: Medium
- **Concepts Tested**: Two Pointers, Sorting, Counting Optimization

### Learning Outcomes

1. **Two Pointer Mastery**: Learn to use two pointers with counting
2. **Sorting Benefits**: Understand how sorting enables efficient algorithms
3. **Counting Optimization**: Learn to count multiple valid cases at once

---

## Related Problems

Based on similar themes (two-pointer, counting triplets):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| 3Sum | [Link](https://leetcode.com/problems/3sum/) | Find all unique triplets summing to zero |
| 3Sum Closest | [Link](https://leetcode.com/problems/3sum-closest/) | Find triplet closest to target |
| 4Sum | [Link](https://leetcode.com/problems/4sum/) | Find unique quadruplets |
| Two Sum Less Than K | [Link](https://leetcode.com/problems/two-sum-less-than-k/) | Count pairs with sum less than K |
| Count Good Triplets | [Link](https://leetcode.com/problems/count-good-triplets/) | Count triplets satisfying condition |

### Pattern Reference

For more detailed explanations of the Two Pointer pattern, see:
- **[Two Pointer Pattern](/patterns/two-pointer)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - 3Sum Smaller](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation with visual examples
2. **[Two Pointer Technique](https://www.youtube.com/watch?v=-gjxg6dN8Ds)** - Understanding two-pointer pattern
3. **[3Sum Smaller - LeetCode 259](https://www.youtube.com/watch?v=yQq1H0WkisU)** - Detailed walkthrough

### Related Concepts

- **[Sorting Algorithms](https://www.youtube.com/watch?v=kM2z50BfK54)** - Understanding sorting
- **[Binary Search](https://www.youtube.com/watch?v=Moq9b75aSU8)** - Binary search fundamentals

---

## Follow-up Questions

### Q1: How would you return all triplets instead of just count?

**Answer:** Instead of adding (right-left) to count, iterate through all valid combinations and add to result list:
```python
result = []
while left < right:
    if nums[i] + nums[left] + nums[right] < target:
        for k in range(left, right):
            result.append([nums[i], nums[left], nums[k]])
        left += 1
    else:
        right -= 1
```

### Q2: How would you extend to kSum Smaller?

**Answer:** Use recursion for k-2 elements, then use two-pointer for last two. Time complexity O(n^(k-1)).

### Q3: How would you handle duplicates?

**Answer:** Skip duplicates at each level:
```python
if i > 0 and nums[i] == nums[i-1]: continue
```

### Q4: What if you need unique triplets?

**Answer:** Use a set to track unique triplets, or skip duplicates during processing.

---

## Common Pitfalls

### 1. Not Adding Right-Left
**Issue:** Iterating through all triplets individually.

**Solution:** When sum < target, all elements from left to right-1 are valid, add (right - left).

### 2. Wrong Pointer Movement
**Issue:** Moving pointers incorrectly after valid/invalid comparison.

**Solution:** After valid, move left++. After invalid, move right--.

### 3. Not Handling Empty/Small Arrays
**Issue:** Not checking for arrays with less than 3 elements.

**Solution:** Loop range handles this naturally (n-2).

### 4. Not Sorting
**Issue:** Trying to solve without sorting.

**Solution:** Sorting is essential for the two-pointer optimization.

---

## Summary

The **3Sum Smaller** problem demonstrates the **two-pointer counting** pattern:

- **Sorting first**: Enables efficient two-pointer technique
- **Counting optimization**: Add (right - left) when valid triplet found
- **Time complexity**: O(n²) - optimal for this counting problem

Key insights:
1. Sort the array to use two-pointer
2. When sum < target, all elements between left and right form valid triplets
3. Add (right - left) to count instead of iterating individually
4. Move left pointer to find more valid triplets

This pattern extends to:
- kSum Smaller problems
- Counting triplet problems
- Any bounded sum problem
