# Split Array Largest Sum

## Problem Description

Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized.

Return the minimized largest sum of the split.

A subarray is a contiguous part of the array.

### Examples

**Example 1:**
```python
Input: nums = [7,2,5,10,8], k = 2
Output: 18
```

**Explanation:**
We can split the array into two subarrays:
- Option 1: `[7,2,5]` and `[10,8]` → sums are 14 and 18 → max = 18
- Option 2: `[7,2]` and `[5,10,8]` → sums are 9 and 23 → max = 23
- Option 3: `[7]` and `[2,5,10,8]` → sums are 7 and 25 → max = 25

The minimized largest sum is 18.

**Example 2:**
```python
Input: nums = [1,2,3,4,5], k = 2
Output: 9
```

**Explanation:**
We can split the array into two subarrays:
- Option 1: `[1,2,3]` and `[4,5]` → sums are 6 and 9 → max = 9
- Option 2: `[1,2]` and `[3,4,5]` → sums are 3 and 12 → max = 12
- Option 3: `[1]` and `[2,3,4,5]` → sums are 1 and 14 → max = 14

The minimized largest sum is 9.

**Example 3:**
```python
Input: nums = [1,4,4], k = 3
Output: 4
```

**Explanation:**
We must split into 3 subarrays (each element becomes its own subarray):
- `[1]`, `[4]`, `[4]` → sums are 1, 4, 4 → max = 4

### Constraints

- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= min(50, nums.length)`

---

## Intuition

The key insight is that the answer (minimized largest sum) lies between two bounds:

1. **Lower bound**: The maximum single element in the array. We can't split a single element into smaller parts, so the largest subarray sum must be at least as big as the largest element.

2. **Upper bound**: The sum of all elements. If we put all elements in one subarray, that's the maximum possible sum.

The relationship between the candidate largest sum and the number of subarrays needed is **monotonic**:
- If we can split the array into ≤ k subarrays with maximum sum = X, then we can also split it with maximum sum = Y for any Y ≥ X.
- Conversely, if we cannot split with maximum sum = X, we cannot split with any smaller value.

This monotonicity allows us to use binary search on the answer space.

---

## Solution Approaches

### Approach 1: Binary Search on Answer (Optimal)

This is the most efficient approach that leverages binary search on the possible values of the largest subarray sum.

#### Algorithm

1. Set `low = max(nums)` (minimum possible answer)
2. Set `high = sum(nums)` (maximum possible answer)
3. While `low < high`:
   - Compute `mid = (low + high) // 2`
   - Check if we can split the array into ≤ k subarrays where each subarray sum ≤ mid
   - If yes, `high = mid` (try smaller)
   - If no, `low = mid + 1` (need larger)
4. Return `low` (the minimized largest sum)

#### Code

````carousel
```python
from typing import List

class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def can_split(mid: int) -> bool:
            """Check if we can split array into <= k subarrays with each sum <= mid"""
            count = 1
            current_sum = 0
            
            for num in nums:
                current_sum += num
                if current_sum > mid:
                    count += 1
                    current_sum = num
                    if count > k:
                        return False
            
            return True
        
        left = max(nums)
        right = sum(nums)
        
        while left < right:
            mid = (left + right) // 2
            if can_split(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    bool canSplit(vector<int>& nums, int k, long long mid) {
        int count = 1;
        long long current_sum = 0;
        
        for (int num : nums) {
            current_sum += num;
            if (current_sum > mid) {
                count++;
                current_sum = num;
                if (count > k) return false;
            }
        }
        return true;
    }
    
    int splitArray(vector<int>& nums, int k) {
        long long left = *max_element(nums.begin(), nums.end());
        long long right = 0;
        for (int num : nums) right += num;
        
        while (left < right) {
            long long mid = left + (right - left) / 2;
            if (canSplit(nums, k, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private boolean canSplit(int[] nums, int k, long mid) {
        int count = 1;
        long currentSum = 0;
        
        for (int num : nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
                if (count > k) return false;
            }
        }
        return true;
    }
    
    public int splitArray(int[] nums, int k) {
        long left = Arrays.stream(nums).max().getAsInt();
        long right = Arrays.stream(nums).sum();
        
        while (left < right) {
            long mid = left + (right - left) / 2;
            if (canSplit(nums, k, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return (int)left;
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
var splitArray = function(nums, k) {
    const canSplit = (mid) => {
        let count = 1;
        let currentSum = 0;
        
        for (const num of nums) {
            currentSum += num;
            if (currentSum > mid) {
                count++;
                currentSum = num;
                if (count > k) return false;
            }
        }
        return true;
    };
    
    const left = Math.max(...nums);
    const right = nums.reduce((a, b) => a + b, 0);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canSplit(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
};
```
````

#### Step-by-Step Example

For `nums = [7,2,5,10,8]` and `k = 2`:

- Initial: `low = 10` (max element), `high = 32` (total sum)
- Iteration 1: `mid = 21`
  - Try to split with max sum 21:
    - Current sum: 7 + 2 + 5 = 14 (≤ 21)
    - Next: 10 + 8 = 18 (≤ 21)
    - Total subarrays: 2 (≤ k) ✓
  - Since possible, `high = 21`
- Iteration 2: `mid = 15`
  - Try to split with max sum 15:
    - Current sum: 7 + 2 + 5 = 14 (≤ 15)
    - Next: 10 (≤ 15)
    - Next: 8 (≤ 15)
    - Total subarrays: 3 (> k) ✗
  - Since not possible, `low = 16`
- Iteration 3: `mid = 18`
  - Try to split with max sum 18:
    - Current sum: 7 + 2 + 5 = 14 (≤ 18)
    - Next: 10 + 8 = 18 (≤ 18)
    - Total subarrays: 2 (≤ k) ✓
  - Since possible, `high = 18`
- Iteration 4: `mid = 17`
  - Try to split with max sum 17:
    - Current sum: 7 + 2 + 5 = 14 (≤ 17)
    - Next: 10 (≤ 17)
    - Next: 8 (≤ 17)
    - Total subarrays: 3 (> k) ✗
  - Since not possible, `low = 18`
- Result: `low = 18` (answer found)

### Approach 2: Dynamic Programming (Naive)

This approach uses DP to explore all possible ways to split the array, but is less efficient for large inputs.

#### Algorithm

Let `dp[i][j]` be the minimum possible largest sum when considering the first `i` elements split into `j` subarrays.

1. Initialize `dp[0][0] = 0`, others = infinity
2. For each position `i` from 1 to n:
   - For each split count `j` from 1 to min(i, k):
     - Consider all previous split points `p` (from j-1 to i-1)
     - `dp[i][j] = min(dp[i][j], max(dp[p][j-1], sum(p...i-1)))`
3. Answer is `dp[n][k]`

#### Code

````carousel
```python
from typing import List
import math

class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        
        # Prefix sums for O(1) subarray sum queries
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        # dp[i][j] = minimum largest sum for first i elements with j subarrays
        dp = [[math.inf] * (k + 1) for _ in range(n + 1)]
        dp[0][0] = 0
        
        for i in range(1, n + 1):
            for j in range(1, min(i, k) + 1):
                for p in range(j - 1, i):
                    current_sum = prefix[i] - prefix[p]
                    dp[i][j] = min(dp[i][j], max(dp[p][j - 1], current_sum))
        
        return dp[n][k]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int splitArray(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Prefix sums
        vector<long long> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        // dp[i][j] = minimum largest sum for first i elements with j subarrays
        vector<vector<long long>> dp(n + 1, vector<long long>(k + 1, LLONG_MAX));
        dp[0][0] = 0;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= min(i, k); j++) {
                for (int p = j - 1; p < i; p++) {
                    long long current_sum = prefix[i] - prefix[p];
                    dp[i][j] = min(dp[i][j], max(dp[p][j - 1], current_sum));
                }
            }
        }
        
        return (int)dp[n][k];
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int splitArray(int[] nums, int k) {
        int n = nums.length;
        
        // Prefix sums
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        // dp[i][j] = minimum largest sum for first i elements with j subarrays
        long[][] dp = new long[n + 1][k + 1];
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], Long.MAX_VALUE);
        }
        dp[0][0] = 0;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= Math.min(i, k); j++) {
                for (int p = j - 1; p < i; p++) {
                    long current_sum = prefix[i] - prefix[p];
                    dp[i][j] = Math.min(dp[i][j], Math.max(dp[p][j - 1], current_sum));
                }
            }
        }
        
        return (int)dp[n][k];
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
var splitArray = function(nums, k) {
    const n = nums.length;
    
    // Prefix sums
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    // dp[i][j] = minimum largest sum for first i elements with j subarrays
    const dp = Array.from({ length: n + 1 }, () => 
        Array(k + 1).fill(Infinity)
    );
    dp[0][0] = 0;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= Math.min(i, k); j++) {
            for (let p = j - 1; p < i; p++) {
                const current_sum = prefix[i] - prefix[p];
                dp[i][j] = Math.min(dp[i][j], Math.max(dp[p][j - 1], current_sum));
            }
        }
    }
    
    return dp[n][k];
};
```
````

### Approach 3: Dynamic Programming - Top-Down with Memoization

This approach uses recursion with memoization to explore all possible ways to split the array. It has the same time complexity as bottom-up DP but can be more intuitive to implement.

#### Algorithm

Let `dp(i, j)` be the minimum possible largest sum when considering the subarray from index `i` to end, split into `j` subarrays.

1. Use memoization cache to store computed results
2. Base cases:
   - If `j == 1`: return sum of remaining elements
   - If `j == i`: return max element (each element is its own subarray)
3. Recursive case:
   - For each possible split point `p` (from `i` to `n - j + 1`):
     - `current_sum = sum(i...p)`
     - `result = min(result, max(current_sum, dp(p + 1, j - 1)))`
4. Return and cache the result

#### Code

````carousel
```python
from typing import List
import functools

class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        
        # Prefix sums for O(1) subarray sum queries
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        # Helper function to get sum from i to j (inclusive)
        def get_sum(i: int, j: int) -> int:
            return prefix[j + 1] - prefix[i]
        
        @functools.lru_cache(maxsize=None)
        def dp(i: int, j: int) -> int:
            """Minimum largest sum for subarray starting at i with j subarrays"""
            # Base case: only one subarray, take all remaining elements
            if j == 1:
                return get_sum(i, n - 1)
            
            # Base case: each element is its own subarray
            if j == n - i:
                return max(nums[i:])
            
            min_result = float('inf')
            
            # Try all possible split points
            # We need at least j-1 elements remaining after split
            for p in range(i, n - j + 1):
                current_sum = get_sum(i, p)
                # The largest sum is max of current subarray and recursive result
                next_result = dp(p + 1, j - 1)
                min_result = min(min_result, max(current_sum, next_result))
                # Optimization: if current_sum already exceeds min_result, break
                if min_result == current_sum:
                    break
            
            return min_result
        
        return dp(0, k)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
#include <functional>
#include <cstring>
using namespace std;

class Solution {
private:
    vector<int> nums;
    vector<long long> prefix;
    vector<vector<long long>> memo;
    int n;
    
    long long get_sum(int i, int j) {
        return prefix[j + 1] - prefix[i];
    }
    
    long long dp(int i, int j) {
        // Base case: only one subarray
        if (j == 1) {
            return get_sum(i, n - 1);
        }
        
        // Base case: each element is its own subarray
        if (j == n - i) {
            return *max_element(nums.begin() + i, nums.end());
        }
        
        if (memo[i][j] != -1) return memo[i][j];
        
        long long min_result = LLONG_MAX;
        
        // Try all possible split points
        for (int p = i; p <= n - j; p++) {
            long long current_sum = get_sum(i, p);
            long long next_result = dp(p + 1, j - 1);
            min_result = min(min_result, max(current_sum, next_result));
        }
        
        memo[i][j] = min_result;
        return min_result;
    }
    
public:
    int splitArray(vector<int>& nums, int k) {
        this->nums = nums;
        this->n = nums.size();
        
        // Prefix sums
        prefix.assign(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        // Memo table: -1 means not computed
        memo.assign(n + 1, vector<long long>(k + 1, -1));
        
        return (int)dp(0, k);
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private int[] nums;
    private long[] prefix;
    private Long[][] memo;
    private int n;
    
    private long get_sum(int i, int j) {
        return prefix[j + 1] - prefix[i];
    }
    
    private long dp(int i, int j) {
        // Base case: only one subarray
        if (j == 1) {
            return get_sum(i, n - 1);
        }
        
        // Base case: each element is its own subarray
        if (j == n - i) {
            return Arrays.stream(nums, i, n).max().getAsInt();
        }
        
        if (memo[i][j] != null) return memo[i][j];
        
        long minResult = Long.MAX_VALUE;
        
        // Try all possible split points
        for (int p = i; p <= n - j; p++) {
            long currentSum = get_sum(i, p);
            long nextResult = dp(p + 1, j - 1);
            minResult = Math.min(minResult, Math.max(currentSum, nextResult));
        }
        
        memo[i][j] = minResult;
        return minResult;
    }
    
    public int splitArray(int[] nums, int k) {
        this.nums = nums;
        this.n = nums.length;
        
        // Prefix sums
        prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        // Memo table: null means not computed
        memo = new Long[n + 1][k + 1];
        
        return (int)dp(0, k);
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
var splitArray = function(nums, k) {
    const n = nums.length;
    
    // Prefix sums
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    const get_sum = (i, j) => prefix[j + 1] - prefix[i];
    
    // Memoization cache
    const memo = new Map();
    
    const dp = (i, j) => {
        // Create cache key
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);
        
        // Base case: only one subarray
        if (j === 1) {
            return get_sum(i, n - 1);
        }
        
        // Base case: each element is its own subarray
        if (j === n - i) {
            return Math.max(...nums.slice(i));
        }
        
        let minResult = Infinity;
        
        // Try all possible split points
        for (let p = i; p <= n - j; p++) {
            const currentSum = get_sum(i, p);
            const nextResult = dp(p + 1, j - 1);
            minResult = Math.min(minResult, Math.max(currentSum, nextResult));
        }
        
        memo.set(key, minResult);
        return minResult;
    };
    
    return dp(0, k);
};
```
````

---

## Time and Space Complexity Analysis

### Binary Search Approach
- **Time Complexity**: O(n × log(sum(nums) - max(nums) + 1))
  - Binary search on answer space: O(log S) where S is the sum range
  - Each feasibility check: O(n)
  - Total: O(n log S)
- **Space Complexity**: O(1)
  - Only uses a few variables for the check

### Dynamic Programming (Bottom-Up)
- **Time Complexity**: O(n² × k)
  - Three nested loops: i (1 to n), j (1 to k), p (j-1 to i-1)
- **Space Complexity**: O(n × k)
  - DP table stores n × k values

### Dynamic Programming (Top-Down with Memoization)
- **Time Complexity**: O(n² × k)
  - Each state (i, j) is computed once
  - For each state, we iterate through possible split points (O(n))
- **Space Complexity**: O(n × k)
  - Memoization cache stores n × k states
  - Recursion stack depth: O(k)

### Comparison
| Approach | Time | Space | Practical? |
|----------|------|-------|------------|
| Binary Search | O(n log S) | O(1) | ✅ Optimal |
| DP Bottom-Up | O(n² k) | O(n k) | ❌ Too slow for n=1000 |
| DP Top-Down | O(n² k) | O(n k) | ❌ Too slow for n=1000 |

---

## Related Problems

1. **[Capacity to Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)**
   - Similar binary search on answer pattern with different condition function
   
2. **[Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)**
   - Find minimum eating speed given time constraint

3. **[Painters Partition Problem](https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1)**
   - Distribute books among students with minimum maximum pages

4. **[Minimum Largest Sum of M Subarrays](https://www.geeksforgeeks.org/split-the-given-array-into-k-subarrays-such-that-sum-of-each-subarray-is-minimum/)**
   - Similar problem with additional constraints

5. **[Maximum Subarray Sum with One Deletion](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/)**
   - Uses similar prefix sum concepts

---

## Video Tutorial Links

1. **[Split Array Largest Sum - Binary Search Solution](https://www.youtube.com/watch?v=hmV1s1q5k9I)** by Nick White
2. **[LeetCode 410 - Split Array Largest Sum](https://www.youtube.com/watch?v=oah_ZBjuKtQ)** by Back to Back SWE
3. **[Binary Search on Answer - Pattern Explanation](https://www.youtube.com/watch?v=Si3PIaXE5uE)** by AlgoExpert

---

## Follow-up Questions

1. **How would you modify the solution if subarrays must have a minimum length constraint?**
   - **Answer:** Track the length of current subarray during the feasibility check. When starting a new subarray, ensure enough elements remain to satisfy the minimum length requirement. Adjust the check: if `remaining_elements < min_length * remaining_subarrays`, return False.

2. **Can you implement this using a greedy approach instead of binary search?**
   - **Answer:** A greedy approach alone cannot guarantee the optimal solution because local optimization doesn't lead to global optimization. Binary search on answer is necessary to find the minimum possible maximum sum. However, the feasibility check itself is greedy (accumulate until sum exceeds limit).

3. **How would you track the actual split points (not just the sum)?**
   - **Answer:** Modify the `can_split` function to return the split indices. When creating a new subarray, record the index. After binary search completes with the optimal value, run the feasibility check once more to capture and return the actual split positions.

4. **What if you need to minimize the sum of squares of subarray sums instead of the largest sum?**
   - **Answer:** This becomes a different optimization problem. Binary search on answer won't work directly. Use dynamic programming with the objective of minimizing Σ(subarray_sum)². The DP state would track minimum total squared sum for first i elements with j subarrays.

5. **How would you handle this problem if the array could be split into at most k subarrays (not exactly k)?**
   - **Answer:** The solution remains the same! The feasibility check uses `<= k`, so it naturally handles "at most k" subarrays. Using fewer subarrays produces smaller or equal maximum sums, which is acceptable.

6. **Can you solve this problem using a priority queue/heap approach?**
   - **Answer:** A heap-based approach can find a valid split but not necessarily the optimal one. Strategy: use a max-heap of subarray sums, repeatedly split the largest subarray until you have k subarrays. This is greedy and suboptimal but works for approximation.

7. **What if you need to output all possible ways to achieve the minimized largest sum?**
   - **Answer:** After finding the optimal value X, use backtracking/DFS to find all split combinations where each subarray sum ≤ X. Use pruning: if accumulating sum exceeds X, backtrack. Store each valid split configuration found during the search.

---

## Summary

The **Split Array Largest Sum** problem is a classic example of binary search on answer space. The key insight is the monotonic relationship between the candidate maximum sum and the number of subarrays needed. By leveraging this property, we can efficiently search for the optimal answer in O(n log S) time where S is the sum range.

The binary search approach is superior to dynamic programming because:
- It avoids exploring exponential possibilities
- It has much better time complexity
- It uses constant extra space

Understanding this pattern is crucial for solving many similar optimization problems involving partitioning or allocation.
