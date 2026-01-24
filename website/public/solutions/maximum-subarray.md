# Maximum Subarray

## Problem Description

Given an integer array `nums`, find the contiguous subarray (containing at least one element) which has the largest sum and return its sum.

This is one of the most classic problems in dynamic programming and algorithm interviews. It tests your understanding of:
- Kadane's Algorithm (optimal O(n) solution)
- Dynamic Programming (top-down and bottom-up approaches)
- Divide and Conquer strategies
- Handling edge cases with negative numbers

The problem is also known as the "Maximum Sum Subarray Problem" or the "Kadane's Algorithm Problem."

---

## Examples

### Example 1
**Input:**
```python
nums = [-2,1,-3,4,-1,2,1,-5,4]
```

**Output:**
```python
6
```

**Explanation:** The subarray `[4,-1,2,1]` has the largest sum = 6.

### Example 2
**Input:**
```python
nums = [1]
```

**Output:**
```python
1
```

**Explanation:** Single element array, the maximum subarray sum is the element itself.

### Example 3
**Input:**
```python
nums = [5,4,-1,7,8]
```

**Output:**
```python
23
```

**Explanation:** The entire array has the maximum sum = 23.

### Example 4
**Input:**
```python
nums = [-2,-3,-1,-4]
```

**Output:**
```python
-1
```

**Explanation:** When all numbers are negative, the maximum subarray is the single largest element (-1).

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- The answer is guaranteed to fit in a 32-bit signed integer.

---

## Intuition

The key insight is that we don't need to check all possible subarrays explicitly. For each position in the array, we can determine:

1. **What's the maximum sum subarray ending at this position?**
2. **What's the overall maximum sum we've seen so far?**

For the first question, if we're at index `i`, we have two choices:
- Start a new subarray at `i`
- Extend the subarray that ended at `i-1`

We choose the option that gives us a larger sum. This leads directly to Kadane's Algorithm.

---

## Multiple Approaches with Code

### Approach 1: Brute Force (O(n²))

This approach checks all possible subarrays and keeps track of the maximum sum. While simple, it's not efficient for large arrays.

````carousel
```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        n = len(nums)
        maxSum = float('-inf')
        
        for i in range(n):
            currentSum = 0
            for j in range(i, n):
                currentSum += nums[j]
                maxSum = max(maxSum, currentSum)
        
        return maxSum
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
        int n = nums.size();
        int maxSum = INT_MIN;
        
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                maxSum = max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length;
        int maxSum = Integer.MIN_VALUE;
        
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                maxSum = Math.max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    const n = nums.length;
    let maxSum = -Infinity;
    
    for (let i = 0; i < n; i++) {
        let currentSum = 0;
        for (let j = i; j < n; j++) {
            currentSum += nums[j];
            maxSum = Math.max(maxSum, currentSum);
        }
    }
    
    return maxSum;
};
```
````

### Time Complexity
**O(n²)** - We have two nested loops, each potentially iterating n times.

### Space Complexity
**O(1)** - Only using constant extra space.

---

### Approach 2: Kadane's Algorithm (Optimal) ⭐

This is the optimal solution with O(n) time complexity. The key idea is to keep track of the maximum subarray ending at each position and update the global maximum accordingly.

````carousel
```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        currentSum = nums[0]
        maxSum = nums[0]
        
        for i in range(1, len(nums)):
            # Either extend the previous subarray or start fresh at current element
            currentSum = max(nums[i], currentSum + nums[i])
            maxSum = max(maxSum, currentSum)
        
        return maxSum
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        int currentSum = nums[0];
        int maxSum = nums[0];
        
        for (int i = 1; i < n; i++) {
            // Either extend the previous subarray or start fresh at current element
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }
        
        return maxSum;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length;
        int currentSum = nums[0];
        int maxSum = nums[0];
        
        for (int i = 1; i < n; i++) {
            // Either extend the previous subarray or start fresh at current element
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        
        return maxSum;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let currentSum = nums[0];
    let maxSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend the previous subarray or start fresh at current element
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
};
```
````

### Explanation

1. **Initialization**: Start with the first element as both `currentSum` and `maxSum`.
2. **Iteration**: For each subsequent element:
   - `currentSum = max(nums[i], currentSum + nums[i])`
   - This decides whether to start a new subarray at `i` or extend the previous one
   - Update `maxSum` to keep track of the best sum seen so far
3. **Return**: `maxSum` contains the answer

### Time Complexity
**O(n)** - Single pass through the array.

### Space Complexity
**O(1)** - Only using constant extra space.

---

### Approach 3: Top-Down Dynamic Programming with Memoization

This approach uses recursion with memoization to solve the problem. It's less efficient than Kadane's but demonstrates the DP approach clearly.

````carousel
```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        memo = {}
        return self.maxSubArrayHelper(nums, 0, memo)
    
    def maxSubArrayHelper(self, nums: List[int], index: int, memo: dict) -> int:
        # Base case: if we've reached the end
        if index >= len(nums):
            return float('-inf')
        
        # Check if already computed
        if index in memo:
            return memo[index]
        
        # Option 1: Start new subarray at current index
        startNew = nums[index]
        
        # Option 2: Extend from previous (or start fresh if better)
        extend = nums[index] + self.maxSubArrayHelper(nums, index + 1, memo)
        
        # Store the best for this starting index
        memo[index] = max(startNew, extend)
        
        # Return max of current, or max of extending to the end
        return max(extend, startNew)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        unordered_map<int, int> memo;
        return maxSubArrayHelper(nums, 0, memo);
    }
    
private:
    int maxSubArrayHelper(vector<int>& nums, int index, unordered_map<int, int>& memo) {
        // Base case: if we've reached the end
        if (index >= nums.size()) {
            return INT_MIN;
        }
        
        // Check if already computed
        if (memo.find(index) != memo.end()) {
            return memo[index];
        }
        
        // Option 1: Start new subarray at current index
        int startNew = nums[index];
        
        // Option 2: Extend from previous (or start fresh if better)
        int extend = nums[index] + maxSubArrayHelper(nums, index + 1, memo);
        
        // Store the best for this starting index
        memo[index] = max(startNew, extend);
        
        // Return max of current, or max of extending to the end
        return max(extend, startNew);
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private Map<Integer, Integer> memo;
    
    public int maxSubArray(int[] nums) {
        memo = new HashMap<>();
        return maxSubArrayHelper(nums, 0);
    }
    
    private int maxSubArrayHelper(int[] nums, int index) {
        // Base case: if we've reached the end
        if (index >= nums.length) {
            return Integer.MIN_VALUE;
        }
        
        // Check if already computed
        if (memo.containsKey(index)) {
            return memo.get(index);
        }
        
        // Option 1: Start new subarray at current index
        int startNew = nums[index];
        
        // Option 2: Extend from previous (or start fresh if better)
        int extend = nums[index] + maxSubArrayHelper(nums, index + 1);
        
        // Store the best for this starting index
        memo.put(index, Math.max(startNew, extend));
        
        // Return max of current, or max of extending to the end
        return Math.max(extend, startNew);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    const memo = new Map();
    
    function maxSubArrayHelper(index) {
        // Base case: if we've reached the end
        if (index >= nums.length) {
            return -Infinity;
        }
        
        // Check if already computed
        if (memo.has(index)) {
            return memo.get(index);
        }
        
        // Option 1: Start new subarray at current index
        const startNew = nums[index];
        
        // Option 2: Extend from previous (or start fresh if better)
        const extend = nums[index] + maxSubArrayHelper(index + 1);
        
        // Store the best for this starting index
        memo.set(index, Math.max(startNew, extend));
        
        // Return max of current, or max of extending to the end
        return Math.max(extend, startNew);
    }
    
    return maxSubArrayHelper(0);
};
```
````

### Explanation

1. **Recursive Formula**: For each index `i`, the maximum subarray starting at `i` is:
   - `max(nums[i], nums[i] + dp[i+1])`
   - Either start fresh or extend the best subarray from `i+1`
2. **Memoization**: Store computed results to avoid redundant calculations
3. **Result**: The best answer among all starting positions

### Time Complexity
**O(n)** - Each subproblem is computed once due to memoization.

### Space Complexity
**O(n)** - For the memoization table and recursion stack.

---

### Approach 4: Divide and Conquer

This approach splits the array into two halves, solves each half recursively, and combines the results. It demonstrates the classic divide and conquer pattern.

````carousel
```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        return self.maxSubArrayHelper(nums, 0, len(nums) - 1)
    
    def maxSubArrayHelper(self, nums: List[int], left: int, right: int) -> int:
        # Base case: single element
        if left == right:
            return nums[left]
        
        mid = left + (right - left) // 2
        
        # Recursively find max in left and right halves
        leftMax = self.maxSubArrayHelper(nums, left, mid)
        rightMax = self.maxSubArrayHelper(nums, mid + 1, right)
        
        # Find max crossing sum
        crossMax = self.maxCrossingSum(nums, left, mid, right)
        
        # Return the maximum of three
        return max(leftMax, rightMax, crossMax)
    
    def maxCrossingSum(self, nums: List[int], left: int, mid: int, right: int) -> int:
        # Find max sum on left side of mid
        leftSum = float('-inf')
        sum_val = 0
        for i in range(mid, left - 1, -1):
            sum_val += nums[i]
            leftSum = max(leftSum, sum_val)
        
        # Find max sum on right side of mid
        rightSum = float('-inf')
        sum_val = 0
        for i in range(mid + 1, right + 1):
            sum_val += nums[i]
            rightSum = max(rightSum, sum_val)
        
        return leftSum + rightSum
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
        return maxSubArrayHelper(nums, 0, nums.size() - 1);
    }
    
private:
    int maxSubArrayHelper(vector<int>& nums, int left, int right) {
        // Base case: single element
        if (left == right) {
            return nums[left];
        }
        
        int mid = left + (right - left) / 2;
        
        // Recursively find max in left and right halves
        int leftMax = maxSubArrayHelper(nums, left, mid);
        int rightMax = maxSubArrayHelper(nums, mid + 1, right);
        
        // Find max crossing sum
        int crossMax = maxCrossingSum(nums, left, mid, right);
        
        // Return the maximum of three
        return max({leftMax, rightMax, crossMax});
    }
    
    int maxCrossingSum(vector<int>& nums, int left, int mid, int right) {
        // Find max sum on left side of mid
        int leftSum = INT_MIN;
        int sum = 0;
        for (int i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = max(leftSum, sum);
        }
        
        // Find max sum on right side of mid
        int rightSum = INT_MIN;
        sum = 0;
        for (int i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = max(rightSum, sum);
        }
        
        return leftSum + rightSum;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubArray(int[] nums) {
        return maxSubArrayHelper(nums, 0, nums.length - 1);
    }
    
    private int maxSubArrayHelper(int[] nums, int left, int right) {
        // Base case: single element
        if (left == right) {
            return nums[left];
        }
        
        int mid = left + (right - left) / 2;
        
        // Recursively find max in left and right halves
        int leftMax = maxSubArrayHelper(nums, left, mid);
        int rightMax = maxSubArrayHelper(nums, mid + 1, right);
        
        // Find max crossing sum
        int crossMax = maxCrossingSum(nums, left, mid, right);
        
        // Return the maximum of three
        return Math.max(Math.max(leftMax, rightMax), crossMax);
    }
    
    private int maxCrossingSum(int[] nums, int left, int mid, int right) {
        // Find max sum on left side of mid
        int leftSum = Integer.MIN_VALUE;
        int sum = 0;
        for (int i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }
        
        // Find max sum on right side of mid
        int rightSum = Integer.MIN_VALUE;
        sum = 0;
        for (int i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }
        
        return leftSum + rightSum;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    function maxSubArrayHelper(left, right) {
        // Base case: single element
        if (left === right) {
            return nums[left];
        }
        
        const mid = Math.floor(left + (right - left) / 2);
        
        // Recursively find max in left and right halves
        const leftMax = maxSubArrayHelper(left, mid);
        const rightMax = maxSubArrayHelper(mid + 1, right);
        
        // Find max crossing sum
        const crossMax = maxCrossingSum(nums, left, mid, right);
        
        // Return the maximum of three
        return Math.max(leftMax, rightMax, crossMax);
    }
    
    function maxCrossingSum(nums, left, mid, right) {
        // Find max sum on left side of mid
        let leftSum = -Infinity;
        let sum = 0;
        for (let i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }
        
        // Find max sum on right side of mid
        let rightSum = -Infinity;
        sum = 0;
        for (let i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }
        
        return leftSum + rightSum;
    }
    
    return maxSubArrayHelper(0, nums.length - 1);
};
```
````

### Explanation

1. **Divide**: Split the array into two halves
2. **Conquer**: Recursively find the maximum subarray sum in each half
3. **Combine**: Calculate the maximum sum that crosses the midpoint and take the max of:
   - Left half maximum
   - Right half maximum
   - Crossing maximum

The crossing sum is found by:
- Starting from mid and going left to find the maximum left extension
- Starting from mid+1 and going right to find the maximum right extension
- Adding them together

### Time Complexity
**O(n log n)** - Each level of recursion processes the entire array once, and there are O(log n) levels.

### Space Complexity
**O(log n)** - Due to the recursion stack.

---

### Approach 5: Bottom-Up Dynamic Programming (Tabulation)

This approach builds up the solution iteratively, using a DP table to store intermediate results.

````carousel
```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [0] * n
        dp[0] = nums[0]
        maxSum = dp[0]
        
        for i in range(1, n):
            # dp[i] = max subarray sum ending at i
            dp[i] = max(nums[i], dp[i-1] + nums[i])
            maxSum = max(maxSum, dp[i])
        
        return maxSum
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n);
        dp[0] = nums[0];
        int maxSum = dp[0];
        
        for (int i = 1; i < n; i++) {
            // dp[i] = max subarray sum ending at i
            dp[i] = max(nums[i], dp[i-1] + nums[i]);
            maxSum = max(maxSum, dp[i]);
        }
        
        return maxSum;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        dp[0] = nums[0];
        int maxSum = dp[0];
        
        for (int i = 1; i < n; i++) {
            // dp[i] = max subarray sum ending at i
            dp[i] = Math.max(nums[i], dp[i-1] + nums[i]);
            maxSum = Math.max(maxSum, dp[i]);
        }
        
        return maxSum;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    const n = nums.length;
    const dp = new Array(n);
    dp[0] = nums[0];
    let maxSum = dp[0];
    
    for (let i = 1; i < n; i++) {
        // dp[i] = max subarray sum ending at i
        dp[i] = Math.max(nums[i], dp[i-1] + nums[i]);
        maxSum = Math.max(maxSum, dp[i]);
    }
    
    return maxSum;
};
```
````

### Explanation

1. **DP Table**: `dp[i]` stores the maximum subarray sum ending at index `i`
2. **Transition**: `dp[i] = max(nums[i], dp[i-1] + nums[i])`
3. **Answer**: The maximum value in the DP table

This is essentially the same as Kadane's Algorithm but stores all intermediate values.

### Time Complexity
**O(n)** - Single pass through the array.

### Space Complexity
**O(n)** - For the DP table (can be optimized to O(1)).

---

## Step-by-Step Example

Let's trace through `nums = [-2,1,-3,4,-1,2,1,-5,4]` using Kadane's Algorithm:

**Step 1: Initialize**
```
currentSum = maxSum = -2
```

**Step 2: Process index 1 (value = 1)**
```
currentSum = max(1, -2 + 1) = max(1, -1) = 1
maxSum = max(-2, 1) = 1
```

**Step 3: Process index 2 (value = -3)**
```
currentSum = max(-3, 1 + (-3)) = max(-3, -2) = -2
maxSum = max(1, -2) = 1
```

**Step 4: Process index 3 (value = 4)**
```
currentSum = max(4, -2 + 4) = max(4, 2) = 4
maxSum = max(1, 4) = 4
```

**Step 5: Process index 4 (value = -1)**
```
currentSum = max(-1, 4 + (-1)) = max(-1, 3) = 3
maxSum = max(4, 3) = 4
```

**Step 6: Process index 5 (value = 2)**
```
currentSum = max(2, 3 + 2) = max(2, 5) = 5
maxSum = max(4, 5) = 5
```

**Step 7: Process index 6 (value = 1)**
```
currentSum = max(1, 5 + 1) = max(1, 6) = 6
maxSum = max(5, 6) = 6
```

**Step 8: Process index 7 (value = -5)**
```
currentSum = max(-5, 6 + (-5)) = max(-5, 1) = 1
maxSum = max(6, 1) = 6
```

**Step 9: Process index 8 (value = 4)**
```
currentSum = max(4, 1 + 4) = max(4, 5) = 5
maxSum = max(6, 5) = 6
```

**Result: 6** ✓

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Brute Force | O(n²) | O(1) | Simple but inefficient for large n |
| Kadane's Algorithm | O(n) | O(1) | **Optimal** - most efficient |
| Top-Down DP | O(n) | O(n) | Good for understanding DP concepts |
| Divide and Conquer | O(n log n) | O(log n) | Demonstrates D&C pattern |
| Bottom-Up DP | O(n) | O(n) | Iterative DP, can be optimized |

---

## Related Problems

Here are related LeetCode problems that involve similar concepts:

1. **[Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/)** - Find max subarray in circular array
2. **[Maximum Subarray Sum with One Deletion](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/)** - Max subarray with at most one deletion
3. **[Maximum Subarray Min-Product](https://leetcode.com/problems/maximum-subarray-min-product/)** - Max subarray with min-product constraint
4. **[Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)** - Similar to max subarray
5. **[Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)** - Prefix sum approach
6. **[House Robber](https://leetcode.com/problems/house-robber/)** - Similar DP pattern
7. **[Kadane's Algorithm Pattern](dp-1d-array-kadane-s-algorithm-for-max-min-subarray.md)** - Learn the pattern

---

## Video Tutorials

For visual explanations and step-by-step tutorials, here are recommended YouTube videos:

- [NeetCode: Maximum Subarray - LeetCode 53](https://www.youtube.com/watch?v=5WZl3M3HzcU) - Clear explanation of Kadane's Algorithm
- [Abdul Bari: Maximum Subarray Problem](https://www.youtube.com/watch?v=86CQq3pKSUw) - Detailed explanation with visualizations
- [Back to Back SWE: Maximum Subarray](https://www.youtube.com/watch?v=KMPWy5ocWoo) - Multiple approaches explained
- [GeeksforGeeks: Kadane's Algorithm](https://www.youtube.com/watch?v=Loop_3xySjM) - Implementation and explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=A5xyusoV8M0) - Official solution walkthrough

---

## Follow-up Questions

1. **How would you modify Kadane's Algorithm to also return the actual subarray?**

   **Answer:** Keep track of the start and end indices of the current subarray. When `currentSum` becomes negative, reset it and update the start index. Update the global best whenever `maxSum` changes, storing the corresponding start and end indices.

2. **What if you need to find the maximum subarray sum with at most k deletions?**

   **Answer:** Use dynamic programming with two states: `dp[i][0]` = max sum ending at i with 0 deletions, `dp[i][1]` = max sum ending at i with 1 deletion. The recurrence would be: `dp[i][1] = max(dp[i-1][1] + nums[i], dp[i-1][0])` and `dp[i][0] = max(nums[i], dp[i-1][0] + nums[i])`.

3. **How would you solve the Maximum Circular Subarray problem?**

   **Answer:** There are two cases: (1) The maximum subarray doesn't wrap around (use regular Kadane's), (2) The maximum subarray wraps around (total sum - minimum subarray sum). The answer is the maximum of these two cases. Handle the edge case where all numbers are negative.

4. **Can Kadane's Algorithm be parallelized for very large arrays?**

   **Answer:** Yes, divide the array into chunks, find the max subarray in each chunk using parallel processing, then use divide and conquer to combine results. You need to track: max prefix, max suffix, max subarray, and total sum for each chunk.

5. **What if you need to find the minimum subarray sum instead?**

   **Answer:** Simply negate all numbers and find the maximum subarray sum, then negate the result. Or equivalently, change `max` to `min` in the algorithm.

6. **How would you handle the case where the array is extremely large and doesn't fit in memory?**

   **Answer:** Use a streaming approach where you process the array in chunks. For each chunk, maintain the current max ending at the chunk boundary. Between chunks, you need to track: max prefix, max suffix, total sum, and max subarray. Combine results as in divide and conquer.

7. **What's the difference between top-down and bottom-up DP?**

   **Answer:** Top-down (memoization) starts from the original problem and recursively breaks it down, storing results as needed. Bottom-up (tabulation) starts from base cases and builds up to the solution iteratively. Top-down is often more intuitive, while bottom-up is typically more efficient in practice.

---

## Common Mistakes to Avoid

1. **Not handling all negative arrays**: Ensure initialization uses the first element, not 0
2. **Integer overflow**: Use appropriate data types for large sums
3. **Forgetting to update both current and max sums**: Both need to be updated in each iteration
4. **Off-by-one errors**: Be careful with loop boundaries and index calculations
5. **Not considering edge cases**: Single element arrays, empty arrays (though constraints say at least 1 element)

---

## References

- [LeetCode 53 - Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
- Kadane, J. (1987). Maximum sum segmentation of a protein sequence. Manuscript.
- Introduction to Algorithms (CLRS) - Chapter 4 on Divide and Conquer
- Dynamic Programming: From Novice to Advanced

---

## LeetCode Link

[Maximum Subarray - LeetCode 53](https://leetcode.com/problems/maximum-subarray/)

