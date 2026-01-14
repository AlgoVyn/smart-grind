# Burst Balloons

## Problem Description

You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons.

**Rules for Bursting:**
- If you burst the `i-th` balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins
- If `i - 1` or `i + 1` goes out of bounds of the array, then treat it as if there is a balloon with a `1` painted on it

**Goal:** Return the maximum coins you can collect by bursting the balloons in an optimal order.

---

## Examples

### Example 1

**Input:**
```python
nums = [3, 1, 5, 8]
```

**Output:**
```python
167
```

**Explanation:**
The optimal bursting order is `[1, 2, 0, 3]` (bursting indices 1, 2, 0, 3):

```
Initial: [3, 1, 5, 8] → Burst balloon at index 1 (value 1)
→ 3 * 1 * 5 = 15 coins
→ Remaining: [3, 5, 8]

[3, 5, 8] → Burst balloon at index 1 (value 5)
→ 3 * 5 * 8 = 120 coins
→ Remaining: [3, 8]

[3, 8] → Burst balloon at index 0 (value 3)
→ 1 * 3 * 8 = 24 coins
→ Remaining: [8]

[8] → Burst balloon at index 0 (value 8)
→ 1 * 8 * 1 = 8 coins

Total: 15 + 120 + 24 + 8 = 167 coins
```

### Example 2

**Input:**
```python
nums = [1, 5]
```

**Output:**
```python
10
```

**Explanation:**
```
Initial: [1, 5] → Burst balloon at index 0 (value 1)
→ 1 * 1 * 5 = 5 coins
→ Remaining: [5]

[5] → Burst balloon at index 0 (value 5)
→ 1 * 5 * 1 = 5 coins

Total: 5 + 5 = 10 coins
```

### Example 3

**Input:**
```python
nums = [2, 3, 4]
```

**Output:**
```python
36
```

**Explanation:**
The optimal bursting order is `[1, 0, 2]` (bursting indices 1, 0, 2):

```
With virtual balloons [1, 2, 3, 4, 1]:

Step 1: Burst balloon at index 2 (value 3)
→ 2 * 3 * 4 = 24 coins
→ Remaining: [2, 4]

Step 2: Burst balloon at index 1 (value 2)
→ 1 * 2 * 4 = 8 coins
→ Remaining: [4]

Step 3: Burst balloon at index 2 (value 4)
→ 1 * 4 * 1 = 4 coins
→ Remaining: []

Total: 24 + 8 + 4 = 36 coins
```

**Alternative order analysis:**
- Burst index 0 (2) first: 1 * 2 * 3 = 6 → [3, 4] → 1 * 3 * 4 = 12 → [4] → 1 * 4 * 1 = 4 = **22 coins**
- Burst index 2 (4) first: 3 * 4 * 1 = 12 → [2, 3] → 1 * 2 * 3 = 6 → [3] → 1 * 3 * 1 = 3 = **21 coins**

The maximum is **36 coins**.

---

## Constraints

- `n == nums.length`
- `1 <= n <= 300`
- `0 <= nums[i] <= 100`

---

## Intuition

The key insight in this problem is that **the last balloon burst in any interval determines the coins earned from that interval**. This is because:

1. When you burst a balloon `k` between balloons `i` and `j`, the coins earned are `nums[i] * nums[k] * nums[j]`
2. After bursting `k`, the balloons `i` and `j` become adjacent
3. The order in which you burst balloons within an interval only affects the intermediate states, not the final result

This leads to a classic **interval dynamic programming** approach where we:
1. Add virtual balloons with value 1 at both ends
2. Use DP to find the maximum coins for each interval
3. Consider each balloon as the "last" one burst in its interval

### Why Dynamic Programming?

The problem has optimal substructure:
- The optimal solution for an interval `[i, j]` depends on the optimal solutions for smaller sub-intervals
- When we choose balloon `k` as the last to burst in `[i, j]`, the problem splits into:
  - `[i, k]`: maximum coins from bursting balloons between `i` and `k`
  - `[k, j]`: maximum coins from bursting balloons between `k` and `j`

### Key Observations

1. **Boundary handling**: Adding 1s at both ends simplifies the boundary condition
2. **Last burst matters**: The balloon burst last in an interval determines the coins for that interval
3. **Overlapping subproblems**: We solve the same sub-intervals multiple times, making DP efficient

---

## Approach 1: Top-Down Dynamic Programming with Memoization

### Algorithm

1. Add 1s at the beginning and end of the array
2. Use recursion with memoization to compute `dp(i, j)`: maximum coins from bursting balloons in interval `(i, j)`
3. For each possible `k` between `i` and `j`, compute:
   ```
   dp(i, j) = max(dp(i, j), dp(i, k) + dp(k, j) + nums[i] * nums[k] * nums[j])
   ```

### Solution Code

```python
from typing import List
from functools import lru_cache

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        """
        Top-down DP with memoization.
        
        Time: O(n^3) - Each state tries all possible k values
        Space: O(n^2) - Memoization table
        """
        # Add virtual balloons with value 1
        nums = [1] + nums + [1]
        n = len(nums)
        
        @lru_cache(None)
        def dp(i: int, j: int) -> int:
            """
            Returns maximum coins from bursting balloons in interval (i, j)
            where i and j are indices of the virtual balloons.
            """
            # Base case: no balloons between i and j
            if i + 1 >= j:
                return 0
            
            max_coins = 0
            # Try making each balloon k the last one burst in (i, j)
            for k in range(i + 1, j):
                coins = dp(i, k) + dp(k, j) + nums[i] * nums[k] * nums[j]
                max_coins = max(max_coins, coins)
            
            return max_coins
        
        return dp(0, n - 1)
```

### Dry Run Example

For `nums = [3, 1, 5, 8]`:

```
nums with boundaries: [1, 3, 1, 5, 1, 8, 1]

dp(0, 6) considers k = 1, 2, 3, 4, 5:
  - k=1: dp(0,1) + dp(1,6) + 1*3*1 = 0 + dp(1,6) + 3
  - k=2: dp(0,2) + dp(2,6) + 1*1*1 = 0 + dp(2,6) + 1
  - k=3: dp(0,3) + dp(3,6) + 1*5*1 = 0 + dp(3,6) + 5
  - k=4: dp(0,4) + dp(4,6) + 1*1*1 = 0 + dp(4,6) + 1
  - k=5: dp(0,5) + dp(5,6) + 1*8*1 = 0 + 0 + 8
  
Each dp(i, j) further splits into smaller intervals...
```

---

## Approach 2: Bottom-Up Dynamic Programming

### Algorithm

1. Add 1s at both ends of the array
2. Initialize a DP table `dp[n][n]` where `dp[i][j]` represents maximum coins for interval `[i, j]`
3. Fill the table by increasing interval length
4. For each interval `[i, j]`, try each `k` as the last burst balloon

### Solution Code

```python
from typing import List

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        """
        Bottom-up DP approach.
        
        Time: O(n^3) - Three nested loops
        Space: O(n^2) - DP table
        """
        # Add virtual balloons with value 1
        nums = [1] + nums + [1]
        n = len(nums)
        
        # dp[i][j] = max coins from bursting balloons in interval [i, j]
        dp = [[0] * n for _ in range(n)]
        
        # length is the distance between i and j
        for length in range(2, n):  # At least 2 apart (one balloon between)
            for i in range(n - length):
                j = i + length
                for k in range(i + 1, j):
                    # dp[i][k] handles balloons left of k
                    # dp[k][j] handles balloons right of k
                    # nums[i] * nums[k] * nums[j] is coins from bursting k last
                    dp[i][j] = max(
                        dp[i][j],
                        dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]
                    )
        
        return dp[0][n - 1]
```

### Dry Run Example

For `nums = [3, 1, 5, 8]` → `nums = [1, 3, 1, 5, 1, 8, 1]`

**Initialization:**
```
dp[0][6] = 0 (final answer will be here)
dp = [[0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]]
```

**Processing intervals of length 2 (distance 2):**
- `dp[0][2]`: k=1 → max(0, 0+0+1*3*1) = 3
- `dp[1][3]`: k=2 → max(0, 0+0+3*1*1) = 3
- `dp[2][4]`: k=3 → max(0, 0+0+1*5*1) = 5
- `dp[3][5]`: k=4 → max(0, 0+0+5*1*1) = 5
- `dp[4][6]`: k=5 → max(0, 0+0+1*8*1) = 8

**Processing intervals of length 3:**
- `dp[0][3]`: k=1, k=2
  - k=1: 0 + dp[1][3] + 1*3*1 = 3 + 3 = 6
  - k=2: dp[0][2] + 0 + 1*1*1 = 3 + 1 = 4
  - dp[0][3] = 6
- And so on...

**Final result:** `dp[0][6] = 167`

---

## Approach 3: Space-Optimized Approach

### Algorithm

The core DP approach can't be significantly space-optimized since each state depends on previous states. However, we can note that the DP table is sparse and use a more efficient storage method.

### Solution Code

```python
from typing import List

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        """
        Optimized space using dictionary for sparse storage.
        
        Time: O(n^3)
        Space: O(n^2) in worst case, but can be less in practice
        """
        nums = [1] + nums + [1]
        n = len(nums)
        
        # Use dict for potentially sparse storage
        dp = {}
        
        def get_dp(i: int, j: int) -> int:
            if i + 1 >= j:
                return 0
            return dp.get((i, j), 0)
        
        for length in range(2, n):
            for i in range(n - length):
                j = i + length
                max_val = 0
                for k in range(i + 1, j):
                    val = get_dp(i, k) + get_dp(k, j) + nums[i] * nums[k] * nums[j]
                    if val > max_val:
                        max_val = val
                dp[(i, j)] = max_val
        
        return dp.get((0, n - 1), 0)
```

---

## Time Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|----------------|------------------|-------|
| Top-Down DP | O(n³) | O(n²) | Memoization overhead |
| Bottom-Up DP | O(n³) | O(n²) | Iterative, no recursion overhead |
| Space-Optimized | O(n³) | O(n²) | Similar to bottom-up |

### Detailed Breakdown

- **Outer loop**: O(n) iterations (interval lengths)
- **Middle loop**: O(n) iterations (start positions)
- **Inner loop**: O(n) iterations (k choices)
- **Total**: O(n³) time complexity

For n = 300 (maximum constraint):
- Worst case: 300³ = 27,000,000 operations
- This is acceptable in Python with optimizations

---

## Space Complexity Analysis

### DP Table Size

The DP table is `n × n` where `n = len(nums) + 2`:
- For n = 300: table size = 302 × 302 ≈ 91,000 integers
- Each integer: 8 bytes (in Python, more due to object overhead)
- Total space: O(n²)

### Call Stack (Top-Down Only)

- Maximum recursion depth: O(n)
- Each recursive call adds to the stack
- Total: O(n) additional space

---

## Why This Problem is Hard

1. **Non-obvious DP formulation**: The insight that the last balloon burst determines the interval's coins is not intuitive
2. **Overlapping subproblems**: Many intervals are solved multiple times without memoization
3. **Boundary handling**: The virtual 1s at boundaries require careful handling
4. **Order dependency**: The order of bursting affects all subsequent calculations

---

## Common Mistakes

1. **Forgetting virtual balloons**: Not adding 1s at both ends
2. **Wrong interval definition**: Confusing inclusive vs exclusive intervals
3. **Incorrect base cases**: Not handling single-balloon intervals properly
4. **Wrong recurrence**: Using wrong formula for coins calculation

---

## Alternative Approaches

### Greedy Approach (Doesn't Work)

A common misconception is that greedy works. Consider `[3, 1, 5, 8]`:
- Greedy might pick balloon 3 (8) first → 1*3*8 = 24, then balloon 2 (5) → 3*5*1 = 15, etc.
- Total: 24 + 15 + 1*3*1 + 1*1*1 = 43 (far from optimal 167!)

The greedy approach fails because bursting a balloon affects the neighbors for all future bursts.

---

## Related Problems

1. **[Minimum Cost Tree From Leaf Values (LC 1130)](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/)** - Similar interval DP problem with multiplication
2. **[Remove Boxes (LC 546)](https://leetcode.com/problems/remove-boxes/)** - Advanced interval DP with additional state
3. **[Strange Printer (LC 664)](https://leetcode.com/problems/strange-printer/)** - Another interval DP problem
4. **[Remove Colored Pieces (LC 2038)](https://leetcode.com/problems/remove-colored-pieces/)** - Simpler version of interval DP
5. **[Merge Stones (LC 1000)](https://leetcode.com/problems/merge-stones/)** - Interval DP with merging costs

---

## Video Tutorials

1. **[NeetCode - Burst Balloons](https://www.youtube.com/watch?v=VFtsT3yH01A)** - Clear explanation of the DP approach
2. **[Backtracking to Dynamic Programming](https://www.youtube.com/watch?v=zK37aTTdF88)** - Shows the evolution from brute force to DP
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=VFtsT3yH01A)** - Official solution walkthrough
4. **[Tech Dose - Burst Balloons](https://www.youtube.com/watch?v=FLbqODdgMKo)** - Detailed explanation with visualization
5. **[Tushar Roy - Burst Balloons](https://www.youtube.com/watch?v=VL7r1A96jLE)** - In-depth explanation with dry runs

---

## Summary

The "Burst Balloons" problem is a classic example of **interval dynamic programming**. The key insights are:

1. **Virtual boundaries**: Adding 1s at both ends simplifies boundary handling
2. **Last burst matters**: The balloon burst last in an interval determines the coins
3. **Optimal substructure**: The problem splits into smaller subproblems
4. **Overlapping subproblems**: Memoization or bottom-up DP is essential

The problem teaches important DP concepts:
- Interval DP formulation
- Handling boundary cases
- Transition from top-down to bottom-up
- Time/space complexity tradeoffs

This problem is frequently asked in technical interviews at major tech companies (Google, Meta, Amazon, etc.) and is an excellent way to practice dynamic programming skills.
