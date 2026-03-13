# Maximum Score Of Spliced Array

## Problem Description

You are given two 0-indexed integer arrays `nums1` and `nums2`, both of length `n`. You can choose two integers `left` and `right` where `0 <= left <= right < n` and swap the subarray `nums1[left...right]` with the subarray `nums2[left...right]`.

For example, if `nums1 = [1,2,3,4,5]` and `nums2 = [11,12,13,14,15]` and you choose `left = 1` and `right = 2`, `nums1` becomes `[1,12,13,4,5]` and `nums2` becomes `[11,2,3,14,15]`.

You may choose to apply the mentioned operation once or not do anything. The score of the arrays is the maximum of `sum(nums1)` and `sum(nums2)`, where `sum(arr)` is the sum of all the elements in the array `arr`. Return the maximum possible score.

A subarray is a contiguous sequence of elements within an array. `arr[left...right]` denotes the subarray that contains the elements of `nums` between indices `left` and `right` (inclusive).

---

## Examples

### Example 1

**Input:** `nums1 = [60,60,60]`, `nums2 = [10,90,10]`

**Output:** `210`

**Explanation:**

Choosing `left = 1` and `right = 1`, we have `nums1 = [60,90,60]` and `nums2 = [10,60,10]`. The score is `max(sum(nums1), sum(nums2)) = max(210, 80) = 210`.

### Example 2

**Input:** `nums1 = [20,40,20,70,30]`, `nums2 = [50,20,50,40,20]`

**Output:** `220`

**Explanation:**

Choosing `left = 3, right = 4`, we have `nums1 = [20,40,20,40,20]` and `nums2 = [50,20,50,70,30]`. The score is `max(sum(nums1), sum(nums2)) = max(140, 220) = 220`.

### Example 3

**Input:** `nums1 = [7,11,13]`, `nums2 = [1,1,1]`

**Output:** `31`

**Explanation:**

We choose not to swap any subarray. The score is `max(sum(nums1), sum(nums2)) = max(31, 3) = 31`.

---

## Constraints

- `n == nums1.length == nums2.length`
- `1 <= n <= 10^5`
- `1 <= nums1[i], nums2[i] <= 10^4`

---

## Pattern: Kadane's Algorithm on Difference Array

This problem uses **Kadane's Algorithm** applied to a difference array. The key insight is that swapping a subarray `[left...right]` changes `sum1` by `diff[left] + diff[left+1] + ... + diff[right]` where `diff[i] = nums2[i] - nums1[i]`. Finding the maximum gain is equivalent to finding the maximum subarray sum in `diff`.

---

## Intuition

The key insight for this problem is understanding how swapping a subarray affects the sums of both arrays:

### Key Observations

1. **Difference Array**: Create `diff[i] = nums2[i] - nums1[i]`. This represents the "gain" in nums1's sum if we swap position i.

2. **Swap Effect**: When we swap subarray [l, r]:
   - nums1 gains: `sum(nums2[l:r+1]) - sum(nums1[l:r+1]) = sum(diff[l:r+1])`
   - nums2 loses the same amount

3. **Maximum Gain**: Finding the best subarray to swap is equivalent to finding the maximum subarray sum in `diff`

4. **Two Possibilities**: We can either:
   - Improve nums1 (by taking positive gain from diff)
   - Improve nums2 (by removing negative gain from diff, i.e., taking -min_subarray)

### Why Kadane's Algorithm?

- The gain from swapping any subarray [l, r] is exactly the sum of diff[l:r+1]
- Maximum gain = maximum subarray sum (Kadane's algorithm)
- Minimum gain (for nums2) = minimum subarray sum

### Algorithm Overview

1. Compute sum1 and sum2
2. Compute diff array: diff[i] = nums2[i] - nums1[i]
3. Find max subarray sum (for improving nums1)
4. Find min subarray sum (for improving nums2)
5. Return max of: no swap, improved nums1, improved nums2

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kadane's on Difference Array** - Optimal solution
2. **Prefix Sum Approach** - Alternative approach

---

## Approach 1: Kadane's on Difference Array (Optimal)

### Algorithm Steps

1. Compute initial sums of nums1 and nums2
2. Create difference array diff[i] = nums2[i] - nums1[i]
3. Use Kadane's algorithm to find maximum subarray sum (improving nums1)
4. Use modified Kadane to find minimum subarray sum (improving nums2)
5. Return maximum of: original sums, improved sums

### Why It Works

- Swapping subarray [l, r] changes nums1's sum by the sum of diff[l:r+1]
- Maximum such gain = maximum subarray sum in diff
- Similarly, improving nums2 means minimizing the loss = minimum subarray sum
- Kadane's efficiently finds these in O(n)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumsSplicedArray(self, nums1: List[int], nums2: List[int]) -> int:
        """
        Find maximum score after splicing arrays.
        
        Uses Kadane's algorithm on difference array.
        
        Args:
            nums1: First array
            nums2: Second array
            
        Returns:
            Maximum possible score
        """
        def kadane(arr):
            """Find maximum subarray sum."""
            max_sum = float('-inf')
            current = 0
            for num in arr:
                current = max(num, current + num)
                max_sum = max(max_sum, current)
            return max_sum

        def min_kadane(arr):
            """Find minimum subarray sum."""
            min_sum = float('inf')
            current = 0
            for num in arr:
                current = min(num, current + num)
                min_sum = min(min_sum, current)
            return min_sum

        # Step 1: Compute initial sums
        sum1 = sum(nums1)
        sum2 = sum(nums2)

        # Step 2: Create difference array
        diff = [b - a for a, b in zip(nums1, nums2)]

        # Step 3: Find max and min subarray sums
        max_sub = kadane(diff)
        min_sub = min_kadane(diff)

        # Step 4: Consider all options
        ans = max(sum1, sum2)
        
        # Option: Improve nums1 (positive gain)
        if max_sub > 0:
            ans = max(ans, sum1 + max_sub)
        
        # Option: Improve nums2 (negative gain becomes positive)
        if min_sub < 0:
            ans = max(ans, sum2 - min_sub)

        return ans
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maximumsSplicedArray(vector<int>& nums1, vector<int>& nums2) {
        // Step 1: Compute initial sums
        int sum1 = 0, sum2 = 0;
        int n = nums1.size();
        
        for (int i = 0; i < n; i++) {
            sum1 += nums1[i];
            sum2 += nums2[i];
        }
        
        // Step 2: Create difference array and find max/min subarray
        int maxSub = INT_MIN, minSub = INT_MAX;
        int currentMax = 0, currentMin = 0;
        
        for (int i = 0; i < n; i++) {
            int diff = nums2[i] - nums1[i];
            
            // Kadane for max subarray
            currentMax = max(diff, currentMax + diff);
            maxSub = max(maxSub, currentMax);
            
            // Kadane for min subarray
            currentMin = min(diff, currentMin + diff);
            minSub = min(minSub, currentMin);
        }
        
        // Step 3: Consider all options
        int ans = max(sum1, sum2);
        
        if (maxSub > 0) {
            ans = max(ans, sum1 + maxSub);
        }
        
        if (minSub < 0) {
            ans = max(ans, sum2 - minSub);
        }
        
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumsSplicedArray(int[] nums1, int[] nums2) {
        // Step 1: Compute initial sums
        int sum1 = 0, sum2 = 0;
        int n = nums1.length;
        
        for (int i = 0; i < n; i++) {
            sum1 += nums1[i];
            sum2 += nums2[i];
        }
        
        // Step 2: Find max and min subarray sums
        int maxSub = Integer.MIN_VALUE;
        int minSub = Integer.MAX_VALUE;
        int currentMax = 0, currentMin = 0;
        
        for (int i = 0; i < n; i++) {
            int diff = nums2[i] - nums1[i];
            
            // Kadane for max subarray
            currentMax = Math.max(diff, currentMax + diff);
            maxSub = Math.max(maxSub, currentMax);
            
            // Kadane for min subarray
            currentMin = Math.min(diff, currentMin + diff);
            minSub = Math.min(minSub, currentMin);
        }
        
        // Step 3: Consider all options
        int ans = Math.max(sum1, sum2);
        
        if (maxSub > 0) {
            ans = Math.max(ans, sum1 + maxSub);
        }
        
        if (minSub < 0) {
            ans = Math.max(ans, sum2 - minSub);
        }
        
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var maximumsSplicedArray = function(nums1, nums2) {
    // Step 1: Compute initial sums
    const sum1 = nums1.reduce((a, b) => a + b, 0);
    const sum2 = nums2.reduce((a, b) => a + b, 0);
    
    // Step 2: Find max and min subarray sums
    let maxSub = -Infinity;
    let minSub = Infinity;
    let currentMax = 0, currentMin = 0;
    
    for (let i = 0; i < nums1.length; i++) {
        const diff = nums2[i] - nums1[i];
        
        // Kadane for max subarray
        currentMax = Math.max(diff, currentMax + diff);
        maxSub = Math.max(maxSub, currentMax);
        
        // Kadane for min subarray
        currentMin = Math.min(diff, currentMin + diff);
        minSub = Math.min(minSub, currentMin);
    }
    
    // Step 3: Consider all options
    let ans = Math.max(sum1, sum2);
    
    if (maxSub > 0) {
        ans = Math.max(ans, sum1 + maxSub);
    }
    
    if (minSub < 0) {
        ans = Math.max(ans, sum2 - minSub);
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — Single pass through arrays |
| **Space** | O(n) for diff array, can be O(1) if computed on the fly |

---

## Approach 2: Prefix Sum Approach (Alternative)

### Algorithm Steps

1. Compute prefix sums of both arrays
2. For each possible subarray, compute the gain using prefix sums
3. Track maximum gain and minimum loss
4. Return best option

### Why It Works

This is conceptually similar but uses prefix sums directly. It's less elegant but helps understand the underlying mathematics.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumsSplicedArray(self, nums1: List[int], nums2: List[int]) -> int:
        """Alternative: Prefix sum approach."""
        n = len(nums1)
        
        # Compute sums
        sum1 = sum(nums1)
        sum2 = sum(nums2)
        
        # Prefix sums
        prefix1 = [0] * (n + 1)
        prefix2 = [0] * (n + 1)
        
        for i in range(n):
            prefix1[i + 1] = prefix1[i] + nums1[i]
            prefix2[i + 1] = prefix2[i] + nums2[i]
        
        max_gain = 0
        min_loss = 0
        
        # Try all subarrays
        for i in range(n):
            for j in range(i, n):
                gain = (prefix2[j + 1] - prefix2[i]) - (prefix1[j + 1] - prefix1[i])
                max_gain = max(max_gain, gain)
                min_loss = min(min_loss, gain)
        
        ans = max(sum1, sum2)
        ans = max(ans, sum1 + max_gain)
        ans = max(ans, sum2 - min_loss)
        
        return ans
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximumsSplicedArray(vector<int>& nums1, vector<int>& nums2) {
        int n = nums1.size();
        int sum1 = 0, sum2 = 0;
        
        for (int i = 0; i < n; i++) {
            sum1 += nums1[i];
            sum2 += nums2[i];
        }
        
        // Simplified approach - compute diff and find max subarray
        int maxGain = 0, minLoss = 0;
        int currentGain = 0, currentLoss = 0;
        
        for (int i = 0; i < n; i++) {
            int diff = nums2[i] - nums1[i];
            
            currentGain = max(diff, currentGain + diff);
            maxGain = max(maxGain, currentGain);
            
            currentLoss = min(diff, currentLoss + diff);
            minLoss = min(minLoss, currentLoss);
        }
        
        int ans = max(sum1, sum2);
        ans = max(ans, sum1 + maxGain);
        ans = max(ans, sum2 - minLoss);
        
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumsSplicedArray(int[] nums1, int[] nums2) {
        int n = nums1.length;
        int sum1 = 0, sum2 = 0;
        
        for (int i = 0; i < n; i++) {
            sum1 += nums1[i];
            sum2 += nums2[i];
        }
        
        int maxGain = 0, minLoss = 0;
        int currentGain = 0, currentLoss = 0;
        
        for (int i = 0; i < n; i++) {
            int diff = nums2[i] - nums1[i];
            
            currentGain = Math.max(diff, currentGain + diff);
            maxGain = Math.max(maxGain, currentGain);
            
            currentLoss = Math.min(diff, currentLoss + diff);
            minLoss = Math.min(minLoss, currentLoss);
        }
        
        int ans = Math.max(sum1, sum2);
        ans = Math.max(ans, sum1 + maxGain);
        ans = Math.max(ans, sum2 - minLoss);
        
        return ans;
    }
}
```

<!-- slide -->
```javascript
var maximumsSplicedArray = function(nums1, nums2) {
    const sum1 = nums1.reduce((a, b) => a + b, 0);
    const sum2 = nums2.reduce((a, b) => a + b, 0);
    
    let maxGain = 0, minLoss = 0;
    let currentGain = 0, currentLoss = 0;
    
    for (let i = 0; i < nums1.length; i++) {
        const diff = nums2[i] - nums1[i];
        
        currentGain = Math.max(diff, currentGain + diff);
        maxGain = Math.max(maxGain, currentGain);
        
        currentLoss = Math.min(diff, currentLoss + diff);
        minLoss = Math.min(minLoss, currentLoss);
    }
    
    let ans = Math.max(sum1, sum2);
    ans = Math.max(ans, sum1 + maxGain);
    ans = Math.max(ans, sum2 - minLoss);
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) for naive, O(n) optimized |
| **Space** | O(1) with optimization |

---

## Comparison of Approaches

| Aspect | Kadane's | Prefix Sum |
|--------|----------|------------|
| **Time Complexity** | O(n) | O(n²) naive, O(n) optimized |
| **Space Complexity** | O(1) | O(n) or O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |
| **Difficulty** | Medium | Easy |

**Best Approach:** Use Approach 1 (Kadane's) - it's optimal and elegant.

---

## Related Problems

Based on similar themes (Kadane's algorithm, array manipulation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Classic Kadane |
| Maximum Sum Circular Subarray | [Link](https://leetcode.com/problems/maximum-sum-circular-subarray/) | Kadane with wrap |
| Maximum Absolute Sum | [Link](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) | Dual Kadane |
| Swap and Maximize Sum | [Link](https://leetcode.com/problems/swap-and-maximize-sum/) | Similar concept |

### Pattern Reference

For more detailed explanations of Kadane's algorithm, see:
- **[Kadane's Algorithm Pattern](/patterns/kadane-algorithm)**
- **[Sliding Window Pattern](/patterns/sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximum Score of Spliced Array - LeetCode 2355](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Kadane's Algorithm Explained](https://www.youtube.com/watch?v=example)** - Understanding the core algorithm
3. **[Difference Array Technique](https://www.youtube.com/watch?v=example)** - How diff helps

### Related Concepts

- **[Maximum Subarray](https://www.youtube.com/watch?v=example)** - Foundation of this problem
- **[Array Swapping](https://www.youtube.com/watch?v=example)** - Operation mechanics

---

## Follow-up Questions

### Q1: What if we could perform the swap operation multiple times?

**Answer:** Multiple swaps could be beneficial, but it becomes a different optimization problem. You might need dynamic programming to handle multiple swaps optimally.

---

### Q2: How would you find the actual subarray that gives maximum score?

**Answer:** Track the start and end indices when updating max_sub and min_sub using Kadane's algorithm. Store the indices that achieve the maximum gain.

---

### Q3: What if we could swap any subarray from nums1 with any (potentially different) subarray from nums2?

**Answer:** This changes the problem significantly. You'd need to consider non-contiguous swaps, which is more complex and might be NP-hard.

---

### Q4: Can this problem be solved using dynamic programming?

**Answer:** While possible, DP would be overkill here. The Kadane's approach is optimal because the subarray swap is a linear operation that can be computed directly.

---

### Q5: What if both arrays have negative numbers?

**Answer:** The algorithm still works! The difference array can have negative values, and Kadane's handles them correctly. You'd need to be careful about initial values.

---

## Common Pitfalls

### 1. Not Considering Both Arrays
**Issue**: Only improving one array and missing the other.

**Solution**: Check both sum1 + max_sub and sum2 - min_sub.

### 2. Forgetting Baseline
**Issue**: Not comparing with max(sum1, sum2) - no swap might be best.

**Solution**: Always include ans = max(sum1, sum2) as baseline.

### 3. Wrong Sign for nums2
**Issue**: Using wrong formula for improving nums2.

**Solution**: When improving nums2, we remove negative gain: ans = max(ans, sum2 - min_sub).

### 4. Empty Subarray
**Issue**: Considering empty subarray (gain = 0).

**Solution**: Problem requires non-empty subarray. The check max_sub > 0 and min_sub < 0 handles this.

### 5. Integer Overflow
**Issue**: Large sums causing overflow in some languages.

**Solution**: Use appropriate data types (long long in C++, long in Java).

---

## Summary

The **Maximum Score of Spliced Array** problem demonstrates the power of **Kadane's algorithm on a difference array**. The key insight is that swapping a subarray is equivalent to adding a subarray sum from the difference array.

Key takeaways:
1. Create diff[i] = nums2[i] - nums1[i] to represent gain
2. Maximum gain = maximum subarray sum (Kadane's)
3. Check both arrays: improving nums1 or nums2
4. Always compare with baseline (no swap)
5. O(n) time with O(1) space

This problem is essential for understanding how to transform array manipulation problems into classic algorithmic patterns.

### Pattern Summary

This problem exemplifies the **Kadane's on Difference Array** pattern, characterized by:
- Creating a difference array to represent changes
- Applying Kadane's to find optimal subarray
- Considering both positive and negative gains
- O(n) solution with elegant mathematics

For more details on this pattern and its variations, see the **[Kadane's Algorithm Pattern](/patterns/kadane-algorithm)**.

---

## Additional Resources

- [LeetCode Problem 2355](https://leetcode.com/problems/maximum-score-of-spliced-array/) - Official problem page
- [Kadane's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kadanes-algorithm/) - Detailed explanation
- [Difference Array - Wikipedia](https://en.wikipedia.org/wiki/Difference_array) - Concept explanation
- [Pattern: Kadane's Algorithm](/patterns/kadane-algorithm) - Comprehensive pattern guide
