# Subarray Product Less Than K

## Problem Description

Given an array of integers `nums` and an integer `k`, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than `k`.

**LeetCode Link:** [Subarray Product Less Than K - LeetCode 713](https://leetcode.com/problems/subarray-product-less-than-k/)

---

## Examples

### Example 1

**Input:**
```python
nums = [10,5,2,6], k = 100
```

**Output:**
```python
8
```

**Explanation:** The 8 subarrays that have product less than 100 are:
`[10]`, `[5]`, `[2]`, `[6]`, `[10, 5]`, `[5, 2]`, `[2, 6]`, `[5, 2, 6]`

Note that `[10, 5, 2]` is not included as the product of 100 is not strictly less than k.

### Example 2

**Input:**
```python
nums = [1,2,3], k = 0
```

**Output:**
```python
0
```

---

## Constraints

- `1 <= nums.length <= 3 * 10^4`
- `1 <= nums[i] <= 1000`
- `0 <= k <= 10^6`

---

## Pattern: Sliding Window (Product-based)

This problem uses a **sliding window** approach where we maintain a window with product less than k. The right pointer expands the window, and the left pointer shrinks it when the product exceeds or equals k. For each right position, all subarrays ending at right with product < k are counted.

---

## Intuition

The key insight for this problem is using the sliding window technique to efficiently count all valid subarrays.

### Key Observations

1. **Product Growth**: As we expand the window to the right, the product increases by multiplying the new element.

2. **Window Shrinking**: When the product becomes >= k, we need to shrink the window from the left until the product is again < k.

3. **Counting Subarrays**: For each position of the right pointer, if the window is valid (product < k), all subarrays ending at right with start index from left to right are valid. That's `(right - left + 1)` subarrays.

4. **Why This Works**: The key insight is that if we have a valid window [left, right], then:
   - Any subarray [i, j] where left ≤ i ≤ j ≤ right has product < k
   - Because removing elements from a valid window can only decrease (or keep same) the product

### Why It Works

The sliding window works because:
- We maintain a window where all elements have product < k
- When we add a new element, the product increases
- If product >= k, we remove elements from the left until valid again
- The number of valid subarrays ending at position `right` is exactly `right - left + 1`

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window (Optimal)** - O(n) time
2. **Brute Force** - O(n²) - for understanding only

---

## Approach 1: Sliding Window (Optimal)

### Algorithm Steps

1. **Handle edge case**: If k <= 1, return 0 (no valid subarrays)
2. **Initialize pointers**: left = 0, product = 1, count = 0
3. **Expand window**: Move right pointer, multiply product by new element
4. **Shrink window**: While product >= k, divide by left element and move left
5. **Count subarrays**: Add (right - left + 1) to count
6. **Return count**

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:
        """
        Count subarrays with product less than k using sliding window.
        
        Args:
            nums: List of positive integers
            k: Target product threshold
            
        Returns:
            Number of subarrays with product < k
        """
        if k <= 1:
            return 0
        
        prod = 1
        left = 0
        count = 0
        
        for right in range(len(nums)):
            # Expand window
            prod *= nums[right]
            
            # Shrink window while product >= k
            while prod >= k and left <= right:
                prod //= nums[left]
                left += 1
            
            # Count subarrays ending at right
            count += right - left + 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        if (k <= 1) return 0;
        
        long prod = 1;
        int left = 0;
        int count = 0;
        
        for (int right = 0; right < nums.size(); right++) {
            prod *= nums[right];
            
            while (prod >= k && left <= right) {
                prod /= nums[left];
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        if (k <= 1) return 0;
        
        long prod = 1;
        int left = 0;
        int count = 0;
        
        for (int right = 0; right < nums.length; right++) {
            prod *= nums[right];
            
            while (prod >= k && left <= right) {
                prod /= nums[left];
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var numSubarrayProductLessThanK = function(nums, k) {
    if (k <= 1) return 0;
    
    let prod = 1;
    let left = 0;
    let count = 0;
    
    for (let right = 0; right < nums.length; right++) {
        prod *= nums[right];
        
        while (prod >= k && left <= right) {
            prod /= nums[left];
            left++;
        }
        
        count += right - left + 1;
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each element is processed at most twice (added once, removed once) |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Brute Force (For Understanding)

### Algorithm Steps

1. For each starting point i
2. For each ending point j ≥ i
3. Calculate product of nums[i:j+1]
4. If product < k, increment count

### Why It Works

This is the straightforward approach - check all possible subarrays. It works but is too slow for large inputs.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:
        if k <= 1:
            return 0
        
        count = 0
        n = len(nums)
        
        for i in range(n):
            product = 1
            for j in range(i, n):
                product *= nums[j]
                if product < k:
                    count += 1
                else:
                    break
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        if (k <= 1) return 0;
        
        int count = 0;
        int n = nums.size();
        
        for (int i = 0; i < n; i++) {
            long product = 1;
            for (int j = i; j < n; j++) {
                product *= nums[j];
                if (product < k) {
                    count++;
                } else {
                    break;
                }
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        if (k <= 1) return 0;
        
        int count = 0;
        int n = nums.length;
        
        for (int i = 0; i < n; i++) {
            long product = 1;
            for (int j = i; j < n; j++) {
                product *= nums[j];
                if (product < k) {
                    count++;
                } else {
                    break;
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
 * @param {number} k
 * @return {number}
 */
var numSubarrayProductLessThanK = function(nums, k) {
    if (k <= 1) return 0;
    
    let count = 0;
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        let product = 1;
        for (let j = i; j < n; j++) {
            product *= nums[j];
            if (product < k) {
                count++;
            } else {
                break;
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
| **Time** | O(n²) - check all possible subarrays |
| **Space** | O(1) - constant extra space |

---

## Comparison of Approaches

| Aspect | Sliding Window | Brute Force |
|--------|----------------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(1) |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |

**Best Approach:** Use Approach 1 (Sliding Window) for optimal O(n) solution.

---

## Common Pitfalls

### 1. k <= 1 Edge Case
**Issue**: Not handling k <= 1 correctly.

**Solution**: If k <= 1, return 0 immediately since all positive products are >= 1.

### 2. Strictly Less Than k
**Issue**: Using `prod > k` instead of `prod >= k`.

**Solution**: The condition is strictly less than k, so shrink when product >= k.

### 3. Product Overflow
**Issue**: Product can grow very large.

**Solution**: Use long/long long to store product, or use Python's arbitrary precision.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google
- **Difficulty**: Medium
- **Concepts Tested**: Sliding window, two pointers

### Learning Outcomes

1. **Sliding Window**: Master the sliding window technique for array problems
2. **Product-based Windows**: Understand how to handle multiplicative constraints
3. **Counting Subarrays**: Learn efficient subarray counting

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subarray Sum Equals K | [Link](https://leetcode.com/problems/subarray-sum-equals-k/) | Sum-based sliding window |
| Maximum Size Subarray Sum Equals K | [Link](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/) | Sum with target |
| Number of Subarrays with Bounded Maximum | [Link](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/) | Similar counting |

---

## Video Tutorial Links

1. **[NeetCode - Subarray Product Less Than K](https://www.youtube.com/watch?v=L0Jk0DE4vQU)** - Clear explanation
2. **[Sliding Window Technique](https://www.youtube.com/watch?v=LsL3F1xQjqw)** - Understanding sliding window

---

## Follow-up Questions

### Q1: How would you modify the solution to handle negative numbers?

**Answer:** The sliding window approach wouldn't work directly with negative numbers because the product could become negative and the monotonicity property would be lost. You'd need a different approach like using prefix products with a balanced BST.

### Q2: What if k is very large (larger than any possible product)?

**Answer:** If k > max possible product, then all subarrays are valid. The answer would be n*(n+1)/2.

### Q3: How would you count subarrays with product <= k (not strictly less)?

**Answer:** Simply change the while condition from `prod >= k` to `prod > k`.

---

## Summary

The **Subarray Product Less Than K** problem demonstrates the power of the sliding window technique for counting subarrays with a multiplicative constraint.

Key takeaways:
1. Use sliding window to maintain a valid window with product < k
2. Expand right pointer to add elements, shrink left pointer when product >= k
3. For each right position, there are (right - left + 1) valid subarrays ending at right
4. Handle edge case k <= 1 separately
5. Time complexity is O(n) since each element is processed at most twice

This problem is a great example of how sliding window can convert an O(n²) brute force solution into an O(n) optimal solution.
