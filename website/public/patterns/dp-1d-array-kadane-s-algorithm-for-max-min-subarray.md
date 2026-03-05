# DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)

## Problem Description

Kadane's Algorithm is a dynamic programming pattern used to find the maximum (or minimum) sum subarray within a one-dimensional array of numbers. This pattern efficiently handles arrays containing both positive and negative numbers, providing an optimal solution for contiguous subarray problems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n), single pass through the array |
| Space Complexity | O(1), only tracking current and global max |
| Input | Array of integers (positive, negative, or mixed) |
| Output | Maximum sum of any contiguous subarray |
| Approach | Greedy choice at each step: extend or restart |

### When to Use

- **Maximum/Minimum Subarray**: Finding contiguous subarray with maximum sum
- **Circular Array Problems**: Maximum sum in circular array
- **2D Variations**: Maximum sum rectangle in 2D matrix
- **Stock Problems**: Maximum profit with single transaction
- **Problems with local/global optimization**: Track both running and best-so-far values

## Intuition

The key insight is that at each position, we decide whether to extend the previous subarray or start fresh from the current element.

The "aha!" moments:

1. **Local maximum**: The max sum ending at current position
2. **Global maximum**: The best sum seen so far across all positions
3. **Greedy choice**: `local_max = max(num, local_max + num)` - either start new or extend
4. **Reset condition**: When local_max becomes negative, future sums are better without it
5. **Single pass**: We only need one scan since each decision depends only on the previous position

## Solution Approaches

### Approach 1: Classic Kadane's Algorithm ✅ Recommended

Find the maximum sum of any contiguous subarray.

#### Algorithm

1. Initialize `max_current` and `max_global` with first element
2. Iterate from second element to end:
   - `max_current = max(num, max_current + num)`
   - `max_global = max(max_global, max_current)`
3. Return `max_global`

#### Implementation

````carousel
```python
def max_subarray_kadane(nums):
    """
    Classic Kadane's Algorithm for maximum subarray sum.
    LeetCode 53 - Maximum Subarray
    
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    
    max_current = max_global = nums[0]
    
    for num in nums[1:]:
        # Either extend previous subarray or start new
        max_current = max(num, max_current + num)
        # Update global maximum
        max_global = max(max_global, max_current)
    
    return max_global

def max_subarray_with_indices(nums):
    """Kadane's with start/end indices tracking."""
    if not nums:
        return 0, -1, -1
    
    max_current = max_global = nums[0]
    start = end = temp_start = 0
    
    for i in range(1, len(nums)):
        if max_current + nums[i] < nums[i]:
            max_current = nums[i]
            temp_start = i
        else:
            max_current += nums[i]
        
        if max_current > max_global:
            max_global = max_current
            start = temp_start
            end = i
    
    return max_global, start, end
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int max_current = nums[0];
        int max_global = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // Either extend or start new
            max_current = max(nums[i], max_current + nums[i]);
            max_global = max(max_global, max_current);
        }
        
        return max_global;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubArray(int[] nums) {
        if (nums.length == 0) return 0;
        
        int maxCurrent = nums[0];
        int maxGlobal = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            // Either extend or start new
            maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
            maxGlobal = Math.max(maxGlobal, maxCurrent);
        }
        
        return maxGlobal;
    }
}
```
<!-- slide -->
```javascript
function maxSubArray(nums) {
    if (nums.length === 0) return 0;
    
    let maxCurrent = nums[0];
    let maxGlobal = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend or start new
        maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
        maxGlobal = Math.max(maxGlobal, maxCurrent);
    }
    
    return maxGlobal;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 2: Maximum Sum Circular Subarray

Handle circular arrays where subarray can wrap around.

#### Algorithm

1. Find max subarray sum using Kadane's (non-circular)
2. Find min subarray sum using modified Kadane's
3. Total sum - min subarray = max circular subarray
4. Return max of circular and non-circular (handle all-negative case)

#### Implementation

````carousel
```python
def max_subarray_circular(nums):
    """
    Maximum sum circular subarray.
    LeetCode 918 - Maximum Sum Circular Subarray
    
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    
    # Standard Kadane's for max subarray
    def kadane_max(arr):
        max_current = max_global = arr[0]
        for num in arr[1:]:
            max_current = max(num, max_current + num)
            max_global = max(max_global, max_current)
        return max_global
    
    # Modified Kadane's for min subarray
    def kadane_min(arr):
        min_current = min_global = arr[0]
        for num in arr[1:]:
            min_current = min(num, min_current + num)
            min_global = min(min_global, min_current)
        return min_global
    
    max_kadane = kadane_max(nums)
    min_kadane = kadane_min(nums)
    total = sum(nums)
    
    # If all numbers are negative, max_kadane is the answer
    # Otherwise, compare non-circular vs circular (total - min)
    if max_kadane < 0:
        return max_kadane
    
    return max(max_kadane, total - min_kadane)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        int maxCurrent = nums[0], maxGlobal = nums[0];
        int minCurrent = nums[0], minGlobal = nums[0];
        int total = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // Kadane's for max
            maxCurrent = max(nums[i], maxCurrent + nums[i]);
            maxGlobal = max(maxGlobal, maxCurrent);
            
            // Kadane's for min
            minCurrent = min(nums[i], minCurrent + nums[i]);
            minGlobal = min(minGlobal, minCurrent);
            
            total += nums[i];
        }
        
        // If all negative, return maxGlobal
        if (maxGlobal < 0) return maxGlobal;
        
        return max(maxGlobal, total - minGlobal);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int maxCurrent = nums[0], maxGlobal = nums[0];
        int minCurrent = nums[0], minGlobal = nums[0];
        int total = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            // Kadane's for max
            maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
            maxGlobal = Math.max(maxGlobal, maxCurrent);
            
            // Kadane's for min
            minCurrent = Math.min(nums[i], minCurrent + nums[i]);
            minGlobal = Math.min(minGlobal, minCurrent);
            
            total += nums[i];
        }
        
        // If all negative, return maxGlobal
        if (maxGlobal < 0) return maxGlobal;
        
        return Math.max(maxGlobal, total - minGlobal);
    }
}
```
<!-- slide -->
```javascript
function maxSubarraySumCircular(nums) {
    let maxCurrent = nums[0], maxGlobal = nums[0];
    let minCurrent = nums[0], minGlobal = nums[0];
    let total = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Kadane's for max
        maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
        maxGlobal = Math.max(maxGlobal, maxCurrent);
        
        // Kadane's for min
        minCurrent = Math.min(nums[i], minCurrent + nums[i]);
        minGlobal = Math.min(minGlobal, minCurrent);
        
        total += nums[i];
    }
    
    // If all negative, return maxGlobal
    if (maxGlobal < 0) return maxGlobal;
    
    return Math.max(maxGlobal, total - minGlobal);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 3: Maximum Product Subarray

Find subarray with maximum product (handles negative numbers).

#### Implementation

````carousel
```python
def max_product_subarray(nums):
    """
    Maximum product subarray.
    LeetCode 152 - Maximum Product Subarray
    
    Track both max and min because negative * negative = positive
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        # Negative number swaps max and min
        if num < 0:
            max_prod, min_prod = min_prod, max_prod
        
        # Update max and min products ending at current position
        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        
        result = max(result, max_prod)
    
    return result
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // Negative swaps max and min
            if (nums[i] < 0) {
                swap(maxProd, minProd);
            }
            
            maxProd = max(nums[i], maxProd * nums[i]);
            minProd = min(nums[i], minProd * nums[i]);
            
            result = max(result, maxProd);
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            // Negative swaps max and min
            if (nums[i] < 0) {
                int temp = maxProd;
                maxProd = minProd;
                minProd = temp;
            }
            
            maxProd = Math.max(nums[i], maxProd * nums[i]);
            minProd = Math.min(nums[i], minProd * nums[i]);
            
            result = Math.max(result, maxProd);
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function maxProduct(nums) {
    let maxProd = nums[0];
    let minProd = nums[0];
    let result = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Negative swaps max and min
        if (nums[i] < 0) {
            [maxProd, minProd] = [minProd, maxProd];
        }
        
        maxProd = Math.max(nums[i], maxProd * nums[i]);
        minProd = Math.min(nums[i], minProd * nums[i]);
        
        result = Math.max(result, maxProd);
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Classic Kadane's | O(n) | O(1) | Standard max subarray sum |
| Circular Kadane's | O(n) | O(1) | Wrap-around allowed |
| Maximum Product | O(n) | O(1) | Product instead of sum |
| 2D Extension | O(n³) or O(n²) | O(n²) | Matrix/rectangle problems |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) | 53 | Easy | Classic Kadane's algorithm |
| [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/) | 918 | Medium | Wrap-around variation |
| [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) | 152 | Medium | Product instead of sum |
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | 121 | Easy | Kadane's on price differences |
| [Maximum Absolute Sum of Any Subarray](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) | 1749 | Medium | Track both max and min |
| [Maximum Subarray Sum After One Operation](https://leetcode.com/problems/maximum-subarray-sum-after-one-operation/) | 1746 | Medium | Modified Kadane's |
| [Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/) | 1031 | Medium | Two subarrays problem |

## Video Tutorial Links

1. **[NeetCode - Maximum Subarray](https://www.youtube.com/watch?v=5WZl3MMT0Eg)** - Kadane's algorithm explained
2. **[Back To Back SWE - Kadane's Algorithm](https://www.youtube.com/watch?v=2MmGzdiKR9Y)** - Visual explanation
3. **[Kevin Naughton Jr. - Maximum Subarray](https://www.youtube.com/watch?v=2MmGzdiKR9Y)** - Step-by-step walkthrough
4. **[Abdul Bari - Kadane's Algorithm](https://www.youtube.com/watch?v=86CQq3pKSUw)** - Detailed theory
5. **[Techdose - Maximum Subarray Variations](https://www.youtube.com/watch?v=0pTN0uNH9dE)** - All variations covered

## Summary

### Key Takeaways

- **Local vs Global**: Track both the best ending at current position and overall best
- **Greedy decision**: At each step, choose to extend or restart
- **O(n) time**: Single pass is sufficient - optimal time complexity
- **O(1) space**: Only need to track a few variables
- **Circular variation**: Use total - min_subarray for wrap-around case
- **Product variation**: Track both max and min (negative swaps them)

### Common Pitfalls

- **Not handling empty array**: Always check if input is empty
- **Wrong initialization**: Must initialize with first element, not 0
- **All-negative arrays**: Classic Kadane's handles this, but circular needs special case
- **Integer overflow**: Products can overflow quickly; consider using long
- **Confusing subarray vs subsequence**: Subarray must be contiguous
- **Not tracking min for product**: Product of two negatives is positive

### Follow-up Questions

1. **How would you find the actual subarray indices?**
   - Track start index when resetting, update end when finding new max

2. **Can you solve this with divide and conquer?**
   - Yes, in O(n log n), but Kadane's O(n) is optimal

3. **How to handle maximum sum of k non-overlapping subarrays?**
   - Use DP with state tracking number of subarrays used

4. **What about 2D maximum subarray (rectangle)?**
   - Compress to 1D using prefix sums, then apply Kadane's

## Pattern Source

[Kadane's Algorithm Pattern](patterns/dp-1d-array-kadane-s-algorithm-for-max-min-subarray.md)
