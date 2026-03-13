# 3Sum Closest

## Problem Description

Given an integer array `nums` of length n and an integer target, find three integers at distinct indices in nums such that the sum is closest to target.

Return the sum of the three integers.

You may assume that each input would have exactly one solution.

**Note:** This is LeetCode Problem 16. You can find the original problem [here](https://leetcode.com/problems/3sum-closest/).

---

## Examples

### Example

**Input:**
```python
nums = [-1,2,1,-4], target = 1
```

**Output:**
```python
2
```

**Explanation:** The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

### Example 2

**Input:**
```python
nums = [0,0,0], target = 1
```

**Output:**
```python
0
```

**Explanation:** The sum that is closest to the target is 0. (0 + 0 + 0 = 0).

---

## Constraints

- `3 <= nums.length <= 500`
- `-1000 <= nums[i] <= 1000`
- `-10^4 <= target <= 10^4`

---

## Pattern: Two Pointer with Sorting

This problem is a classic example of the **Two Pointer** pattern combined with **Sorting**. The key insight is to fix one element and use two pointers to find the pair that brings the sum closest to the remaining target.

### Core Concept

- **Sorting**: Enables efficient two-pointer movement
- **Two-pointer search**: For each element, find pair that sums closest to remaining target
- **Early termination**: Return immediately when exact match found
- **Binary search alternative**: Can also use binary search for the pair finding step

---

## Intuition

The key insight for this problem is understanding how to efficiently search for three numbers that sum closest to a target.

### Key Observations

1. **Sorting Enables Two Pointer**: After sorting, if the current sum is less than target, we need to increase the sum (move left pointer right). If greater, we need to decrease the sum (move right pointer left).

2. **Fix One, Find Pair**: We fix one element at index i, then use two pointers (left and right) to find the best pair from the remaining elements.

3. **Closest Not Equal**: Unlike 3Sum where we look for exact zeros, here we track the minimum absolute difference from target.

4. **Early Termination**: If we find an exact match (sum == target), we can return immediately as it's the closest possible.

### Algorithm Overview

1. **Sort the array**: Enable two-pointer technique
2. **Fix first element**: Iterate through array fixing one element
3. **Two-pointer search**: For each fixed element, use left/right pointers to find best pair
4. **Track closest**: Update closest sum when we find a better (smaller difference) sum
5. **Return**: Return the closest sum found

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointer with Sorting** - Optimal solution
2. **Binary Search** - Alternative approach

---

## Approach 1: Two Pointer with Sorting (Optimal)

### Algorithm Steps

1. Sort the input array in ascending order
2. Initialize `closest` to the sum of first three elements
3. For each element at index `i` from 0 to n-3:
   - Set `left = i + 1` and `right = n - 1`
   - While `left < right`:
     - Calculate `current_sum = nums[i] + nums[left] + nums[right]`
     - If `abs(current_sum - target) < abs(closest - target)`, update `closest`
     - If `current_sum < target`, move `left` right (increase sum)
     - If `current_sum > target`, move `right` left (decrease sum)
     - If `current_sum == target`, return immediately
4. Return `closest`

### Why It Works

The two-pointer technique works because:
- After sorting, the array is in ascending order
- Moving left pointer increases the sum, moving right decreases it
- This creates a binary-search-like behavior to find the closest sum
- By fixing one element and searching the rest, we explore all possible triplets efficiently

### Code Implementation

````carousel
```python
from typing import List
import sys

class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        """
        Find three integers that sum closest to the target.
        
        Uses two-pointer technique with sorting.
        
        Args:
            nums: List of integers
            target: Target sum
            
        Returns:
            Sum of three integers closest to target
        """
        # Edge case check
        if len(nums) < 3:
            return 0
            
        # Sort to enable two-pointer technique
        nums.sort()
        n = len(nums)
        
        # Initialize closest to sum of first three elements
        closest = nums[0] + nums[1] + nums[2]
        
        # Fix first element and search for best pair
        for i in range(n - 2):
            # Skip duplicate values for first element
            if i > 0 and nums[i] == nums[i - 1]:
                continue
                
            left, right = i + 1, n - 1
            
            while left < right:
                current_sum = nums[i] + nums[left] + nums[right]
                
                # Update closest if current is better
                if abs(current_sum - target) < abs(closest - target):
                    closest = current_sum
                
                # Move pointers based on comparison with target
                if current_sum < target:
                    left += 1
                elif current_sum > target:
                    right -= 1
                else:
                    # Exact match found - can't get closer than this
                    return current_sum
        
        return closest
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        if (nums.size() < 3) return 0;
        
        // Sort to enable two-pointer technique
        sort(nums.begin(), nums.end());
        int n = nums.size();
        
        // Initialize closest to sum of first three elements
        int closest = nums[0] + nums[1] + nums[2];
        
        // Fix first element and search for best pair
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicates
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1, right = n - 1;
            
            while (left < right) {
                int current_sum = nums[i] + nums[left] + nums[right];
                
                // Update closest if current is better
                if (abs(current_sum - target) < abs(closest - target)) {
                    closest = current_sum;
                }
                
                // Move pointers based on comparison with target
                if (current_sum < target) {
                    left++;
                } else if (current_sum > target) {
                    right--;
                } else {
                    // Exact match found
                    return current_sum;
                }
            }
        }
        
        return closest;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int threeSumClosest(int[] nums, int target) {
        if (nums == null || nums.length < 3) return 0;
        
        // Sort to enable two-pointer technique
        Arrays.sort(nums);
        int n = nums.length;
        
        // Initialize closest to sum of first three elements
        int closest = nums[0] + nums[1] + nums[2];
        
        // Fix first element and search for best pair
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicates
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1, right = n - 1;
            
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                
                // Update closest if current is better
                if (Math.abs(currentSum - target) < Math.abs(closest - target)) {
                    closest = currentSum;
                }
                
                // Move pointers based on comparison with target
                if (currentSum < target) {
                    left++;
                } else if (currentSum > target) {
                    right--;
                } else {
                    // Exact match found
                    return currentSum;
                }
            }
        }
        
        return closest;
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
var threeSumClosest = function(nums, target) {
    if (!nums || nums.length < 3) return 0;
    
    // Sort to enable two-pointer technique
    nums.sort((a, b) => a - b);
    const n = nums.length;
    
    // Initialize closest to sum of first three elements
    let closest = nums[0] + nums[1] + nums[2];
    
    // Fix first element and search for best pair
    for (let i = 0; i < n - 2; i++) {
        // Skip duplicates
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1, right = n - 1;
        
        while (left < right) {
            const currentSum = nums[i] + nums[left] + nums[right];
            
            // Update closest if current is better
            if (Math.abs(currentSum - target) < Math.abs(closest - target)) {
                closest = currentSum;
            }
            
            // Move pointers based on comparison with target
            if (currentSum < target) {
                left++;
            } else if (currentSum > target) {
                right--;
            } else {
                // Exact match found
                return currentSum;
            }
        }
    }
    
    return closest;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - two nested loops after sorting |
| **Space** | O(1) - sorts in place, no extra space |

---

## Approach 2: Binary Search (Alternative)

### Algorithm Steps

1. Sort the input array
2. For each pair of elements (i, j), use binary search to find the third element
3. Calculate the sum and track the closest
4. Return the closest sum

### Why It Works

Binary search can find the insertion point for the needed third element. For each pair, we search for the element that would make the sum closest to target.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        """Using binary search - alternative approach."""
        if len(nums) < 3:
            return 0
            
        nums.sort()
        n = len(nums)
        closest = float('inf')
        
        for i in range(n - 2):
            for j in range(i + 1, n - 1):
                # Binary search for the third element
                needed = target - nums[i] - nums[j]
                
                # Find insertion point
                k = bisect.bisect_left(nums, needed, j + 1, n)
                
                # Check k and k-1 (closest positions)
                if k < n:
                    closest = min(closest, nums[i] + nums[j] + nums[k], 
                                 key=lambda x: abs(x - target))
                if k > j + 1:
                    closest = min(closest, nums[i] + nums[j] + nums[k - 1],
                                 key=lambda x: abs(x - target))
        
        return closest
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        if (nums.size() < 3) return 0;
        
        sort(nums.begin(), nums.end());
        int n = nums.size();
        int closest = INT_MAX;
        
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                int needed = target - nums[i] - nums[j];
                
                // Binary search
                auto it = lower_bound(nums.begin() + j + 1, nums.end(), needed);
                
                if (it != nums.end()) {
                    closest = min(closest, nums[i] + nums[j] + *it,
                                [&](int a, int b) {
                                    return abs(a - target) < abs(b - target);
                                });
                }
                if (it != nums.begin() + j + 1) {
                    closest = min(closest, nums[i] + nums[j] + *(it - 1),
                                [&](int a, int b) {
                                    return abs(a - target) < abs(b - target);
                                });
                }
            }
        }
        
        return closest;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int threeSumClosest(int[] nums, int target) {
        if (nums == null || nums.length < 3) return 0;
        
        Arrays.sort(nums);
        int n = nums.length;
        int closest = Integer.MAX_VALUE;
        
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                int needed = target - nums[i] - nums[j];
                
                // Binary search
                int k = Arrays.binarySearch(nums, j + 1, n, needed);
                if (k < 0) k = -(k + 1);
                
                if (k < n) {
                    closest = Math.min(closest, nums[i] + nums[j] + nums[k]);
                }
                if (k > j + 1) {
                    closest = Math.min(closest, nums[i] + nums[j] + nums[k - 1]);
                }
                
                // Early termination if exact match found
                if (closest == target) return closest;
            }
        }
        
        return closest;
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
var threeSumClosest = function(nums, target) {
    if (!nums || nums.length < 3) return 0;
    
    nums.sort((a, b) => a - b);
    const n = nums.length;
    let closest = Infinity;
    
    for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
            const needed = target - nums[i] - nums[j];
            
            // Binary search using built-in method
            let k = binarySearch(nums, needed, j + 1, n);
            
            if (k < n) {
                closest = compareAndGet(closest, nums[i] + nums[j] + nums[k], target);
            }
            if (k > j + 1) {
                closest = compareAndGet(closest, nums[i] + nums[j] + nums[k - 1], target);
            }
        }
    }
    
    return closest;
};

function binarySearch(arr, target, left, right) {
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}

function compareAndGet(current, candidate, target) {
    return Math.abs(candidate - target) < Math.abs(current - target) ? candidate : current;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) - binary search for each pair |
| **Space** | O(1) - sorts in place |

---

## Comparison of Approaches

| Aspect | Two Pointer | Binary Search |
|--------|-------------|---------------|
| **Time Complexity** | O(n²) | O(n² log n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ❌ |
| **Difficulty** | Easy | Medium |

**Best Approach:** Use Approach 1 (Two Pointer with Sorting) for the optimal solution. It's simpler and more efficient.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Facebook, Microsoft, Amazon, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Two Pointers, Sorting, Array Manipulation

### Learning Outcomes

1. **Two Pointer Mastery**: Learn to use two pointers efficiently on sorted arrays
2. **Sorting Benefits**: Understand why sorting enables more efficient algorithms
3. **Closest Value**: Learn techniques for finding closest values (not exact matches)
4. **Edge Cases**: Handle duplicates, boundary conditions

---

## Related Problems

Based on similar themes (two early termination, and pointers, array, closest value):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| 3Sum | [Link](https://leetcode.com/problems/3sum/) | Find all unique triplets summing to zero |
| 3Sum Smaller | [Link](https://leetcode.com/problems/3sum-smaller/) | Count triplets with sum less than target |
| 4Sum | [Link](https://leetcode.com/problems/4sum/) | Find all unique target |
| Two quadruplets summing to Sum | [Link](https://leetcode.com/problems/two-sum/) | Find pair summing to target |
| Triangle Number | [Link](https://leetcode.com/problems/valid-triangle-number/) | Count triangles from side lengths |

### Pattern Reference

For more detailed explanations of the Two Pointer pattern, see:
- **[Two Pointer Pattern](/patterns/two-pointer)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - 3Sum Closest](https://www.youtube.com/watch?v=ByG2R2hUwU8)** - Clear explanation with visual examples
2. **[3Sum Closest - LeetCode 16](https://www.youtube.com/watch?v=qqRYk2ncqWw)** - Detailed walkthrough
3. **[Two Pointer Technique](https://www.youtube.com/watch?v=aS eyezmjmq4)** - Understanding two pointers

### Related Concepts

- **[Sorting Algorithms](https://www.youtube.com/watch?v=kQ1mXJLP4OE)** - Array sorting techniques
- **[Binary Search](https://www.youtube.com/watch?v=Moq9vDqDB-k)** - Alternative search technique

---

## Follow-up Questions

### Q1: How would you extend this to kSum Closest?

**Answer:** Use recursion to handle k-2 elements, then use two-pointer for the last two. Time complexity would be O(n^(k-1)). For each level, fix one element and recursively solve for k-1 elements.

### Q2: How would you find all unique triplets closest to target?

**Answer:** Instead of returning on first match, continue searching and collect all triplets within a threshold. Use a set to avoid duplicates and a list to store results within a small delta of the closest sum.

### Q3: How would you handle duplicate values?

**Answer:** Skip duplicates at each level to avoid duplicate triplets:
```python
if i > 0 and nums[i] == nums[i - 1]:
    continue
```

### Q4: Can you solve without sorting?

**Answer:** Yes, but time complexity would be O(n²) with hash set, and space would be O(n). Sorting gives O(1) space. Without sorting, you'd need to check all triplets which is O(n³).

### Q5: What if we need to return the actual triplet, not just the sum?

**Answer:** Track the indices along with the closest sum. Store (sum, i, j, k) tuples and return the indices when the sum is closest to target.

---

## Common Pitfalls

### 1. Not Handling Exact Match
**Issue**: Continuing after finding exact match.

**Solution**: Return immediately when current_sum equals target since we can't get closer than exact match.

### 2. Not Initializing Closest Properly
**Issue**: Initializing closest to wrong value (like 0 or infinity).

**Solution**: Initialize with sum of first three elements as default: `closest = nums[0] + nums[1] + nums[2]`

### 3. Wrong Pointer Movement
**Issue**: Moving pointers incorrectly based on comparison.

**Solution**: If sum < target, move left (increase). If sum > target, move right (decrease).

### 4. Not Using Absolute Difference
**Issue**: Comparing raw differences instead of absolute.

**Solution**: Use `abs(current_sum - target)` for comparison to handle both positive and negative differences equally.

### 5. Not Handling Duplicates
**Issue**: Counting duplicate triplets multiple times.

**Solution**: Skip duplicate values at each position:
```python
if i > 0 and nums[i] == nums[i-1]:
    continue
```

---

## Summary

The **3Sum Closest** problem demonstrates the **two-pointer with sorting** pattern:

- **Sorting first**: Enables efficient two-pointer movement
- **Two-pointer search**: For each element, find pair that sums closest to remaining target
- **Early termination**: Return immediately when exact match found
- **Time complexity**: O(n²) - optimal for this problem

Key takeaways:
1. Sort the array to enable two-pointer technique
2. For each element, search for complementary pair
3. Update closest when difference is smaller
4. Return exact match immediately if found
5. Use absolute difference for comparison

This pattern extends to:
- 4Sum Closest
- Any kSum closest problem
- Two-sum variants
- Problems requiring finding closest values

---

## Additional Resources

- [LeetCode Problem 16](https://leetcode.com/problems/3sum-closest/) - Official problem page
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/) - Detailed two-pointer explanation
- [Sorting Algorithms](https://www.geeksforgeeks.org/sorting-algorithms/) - Various sorting techniques
- [Pattern: Two Pointer](/patterns/two-pointer) - Comprehensive pattern guide
