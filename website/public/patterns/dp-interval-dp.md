# DP - Interval Dynamic Programming

## Problem Description

Interval DP is a dynamic programming technique for solving problems involving intervals, ranges, or contiguous segments. The core idea is to break down a problem into smaller overlapping subproblems based on intervals and build up solutions for larger intervals from optimal solutions of smaller ones.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n³) typically, O(n²) for some optimizations |
| Space Complexity | O(n²) for the DP table |
| Input | Array/string representing a sequence |
| Output | Optimal value for the entire interval [0, n-1] |
| Approach | Process intervals by increasing length |

### When to Use

- **Burst Balloons**: Burst balloons to maximize coins
- **Matrix Chain Multiplication**: Optimal parenthesization
- **Palindrome Partitioning**: Minimum cuts for palindromes
- **Remove Boxes**: Remove colored boxes for max points
- **Strange Printer**: Print string with minimum turns
- **Merge Stones**: Minimum cost to merge stones
- **Tree Problems**: Optimal BST, tree DP on intervals

## Intuition

The key insight is that many problems have optimal substructure where the optimal solution for interval [i, j] can be constructed from optimal solutions of smaller intervals [i, k] and [k+1, j].

The "aha!" moments:

1. **Interval state**: dp[i][j] represents optimal value for subproblem covering interval [i, j]
2. **Split point**: Try all possible partition points k in [i, j]
3. **Build up**: Process intervals from small to large (by length)
4. **Last operation**: Often easier to think about what happens LAST in the interval
5. **Combine results**: dp[i][j] = combine(dp[i][k], dp[k+1][j], cost_at_k)

## Solution Approaches

### Approach 1: Bottom-Up Interval DP ✅ Recommended

Build solution iteratively by increasing interval length.

#### Algorithm

1. Initialize DP table dp[n][n] with base values
2. For length from 2 to n:
   - For each starting index i:
     - Calculate j = i + length - 1
     - For each partition point k in [i, j):
       - Compute candidate = combine(dp[i][k], dp[k+1][j], cost)
       - Update dp[i][j] with best candidate
3. Return dp[0][n-1]

#### Implementation

````carousel
```python
def interval_dp_template(arr):
    """
    Bottom-Up Interval DP Template
    
    Time: O(n³), Space: O(n²)
    """
    n = len(arr)
    
    # dp[i][j] = optimal value for interval [i, j]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: intervals of length 1
    for i in range(n):
        dp[i][i] = 0  # or base value
    
    # Process intervals of increasing length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')  # or -inf for max
            
            # Try all partition points
            for k in range(i, j):
                left = dp[i][k]
                right = dp[k + 1][j]
                cost = compute_cost(i, k, j, arr)
                
                dp[i][j] = min(dp[i][j], left + right + cost)
    
    return dp[0][n - 1]

def compute_cost(i, k, j, arr):
    """Customize based on specific problem."""
    pass
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int intervalDP(vector<int>& arr) {
        int n = arr.size();
        vector<vector<int>> dp(n, vector<int>(n, 0));
        
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                dp[i][j] = INT_MAX;
                
                for (int k = i; k < j; k++) {
                    int left = dp[i][k];
                    int right = dp[k + 1][j];
                    int cost = computeCost(i, k, j, arr);
                    
                    dp[i][j] = min(dp[i][j], left + right + cost);
                }
            }
        }
        
        return dp[0][n - 1];
    }
    
private:
    int computeCost(int i, int k, int j, vector<int>& arr) {
        return 0; // Customize
    }
};
```
<!-- slide -->
```java
class Solution {
    public int intervalDP(int[] arr) {
        int n = arr.length;
        int[][] dp = new int[n][n];
        
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                dp[i][j] = Integer.MAX_VALUE;
                
                for (int k = i; k < j; k++) {
                    int left = dp[i][k];
                    int right = dp[k + 1][j];
                    int cost = computeCost(i, k, j, arr);
                    
                    dp[i][j] = Math.min(dp[i][j], left + right + cost);
                }
            }
        }
        
        return dp[0][n - 1];
    }
    
    private int computeCost(int i, int k, int j, int[] arr) {
        return 0; // Customize
    }
}
```
<!-- slide -->
```javascript
function intervalDP(arr) {
    const n = arr.length;
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            dp[i][j] = Infinity;
            
            for (let k = i; k < j; k++) {
                const left = dp[i][k];
                const right = dp[k + 1][j];
                const cost = computeCost(i, k, j, arr);
                
                dp[i][j] = Math.min(dp[i][j], left + right + cost);
            }
        }
    }
    
    return dp[0][n - 1];
}

function computeCost(i, k, j, arr) {
    return 0; // Customize
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n³) |
| Space | O(n²) |

### Approach 2: Burst Balloons (Classic Example)

Burst balloons to maximize coins collected.

#### Implementation

````carousel
```python
def max_coins(nums):
    """
    Burst balloons to maximize coins.
    LeetCode 312 - Burst Balloons
    
    Time: O(n³), Space: O(n²)
    """
    n = len(nums)
    # Add virtual balloons with value 1 at boundaries
    balloons = [1] + nums + [1]
    
    # dp[i][j] = max coins from bursting all balloons in (i, j)
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    
    # Process by interval length
    for length in range(1, n + 1):
        for left in range(1, n - length + 2):
            right = left + length - 1
            
            # Try bursting each balloon last in [left, right]
            for k in range(left, right + 1):
                coins = balloons[left - 1] * balloons[k] * balloons[right + 1]
                coins += dp[left][k - 1] + dp[k + 1][right]
                dp[left][right] = max(dp[left][right], coins)
    
    return dp[1][n]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        vector<int> balloons(n + 2, 1);
        for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];
        
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
        
        for (int length = 1; length <= n; length++) {
            for (int left = 1; left <= n - length + 1; left++) {
                int right = left + length - 1;
                
                for (int k = left; k <= right; k++) {
                    int coins = balloons[left - 1] * balloons[k] * balloons[right + 1];
                    coins += dp[left][k - 1] + dp[k + 1][right];
                    dp[left][right] = max(dp[left][right], coins);
                }
            }
        }
        
        return dp[1][n];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] balloons = new int[n + 2];
        balloons[0] = balloons[n + 1] = 1;
        for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];
        
        int[][] dp = new int[n + 2][n + 2];
        
        for (int length = 1; length <= n; length++) {
            for (int left = 1; left <= n - length + 1; left++) {
                int right = left + length - 1;
                
                for (int k = left; k <= right; k++) {
                    int coins = balloons[left - 1] * balloons[k] * balloons[right + 1];
                    coins += dp[left][k - 1] + dp[k + 1][right];
                    dp[left][right] = Math.max(dp[left][right], coins);
                }
            }
        }
        
        return dp[1][n];
    }
}
```
<!-- slide -->
```javascript
function maxCoins(nums) {
    const n = nums.length;
    const balloons = [1, ...nums, 1];
    
    const dp = Array(n + 2).fill(null).map(() => Array(n + 2).fill(0));
    
    for (let length = 1; length <= n; length++) {
        for (let left = 1; left <= n - length + 1; left++) {
            const right = left + length - 1;
            
            for (let k = left; k <= right; k++) {
                let coins = balloons[left - 1] * balloons[k] * balloons[right + 1];
                coins += dp[left][k - 1] + dp[k + 1][right];
                dp[left][right] = Math.max(dp[left][right], coins);
            }
        }
    }
    
    return dp[1][n];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n³) |
| Space | O(n²) |

### Approach 3: Palindrome Partitioning II

Find minimum cuts needed for palindrome partitioning.

#### Implementation

````carousel
```python
def min_cut(s):
    """
    Minimum cuts for palindrome partitioning.
    LeetCode 132 - Palindrome Partitioning II
    
    Time: O(n²), Space: O(n²)
    """
    n = len(s)
    
    # Precompute palindrome table
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True
    
    # dp[i] = min cuts for s[0:i+1]
    dp = [float('inf')] * n
    
    for i in range(n):
        if is_pal[0][i]:
            dp[i] = 0
        else:
            for j in range(i):
                if is_pal[j + 1][i]:
                    dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n - 1]
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minCut(string s) {
        int n = s.size();
        vector<vector<bool>> isPal(n, vector<bool>(n, false));
        
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s[i] == s[j] && (j - i < 2 || isPal[i + 1][j - 1])) {
                    isPal[i][j] = true;
                }
            }
        }
        
        vector<int> dp(n, INT_MAX);
        for (int i = 0; i < n; i++) {
            if (isPal[0][i]) {
                dp[i] = 0;
            } else {
                for (int j = 0; j < i; j++) {
                    if (isPal[j + 1][i]) {
                        dp[i] = min(dp[i], dp[j] + 1);
                    }
                }
            }
        }
        
        return dp[n - 1];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int minCut(String s) {
        int n = s.length();
        boolean[][] isPal = new boolean[n][n];
        
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s.charAt(i) == s.charAt(j) && (j - i < 2 || isPal[i + 1][j - 1])) {
                    isPal[i][j] = true;
                }
            }
        }
        
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        
        for (int i = 0; i < n; i++) {
            if (isPal[0][i]) {
                dp[i] = 0;
            } else {
                for (int j = 0; j < i; j++) {
                    if (isPal[j + 1][i]) {
                        dp[i] = Math.min(dp[i], dp[j] + 1);
                    }
                }
            }
        }
        
        return dp[n - 1];
    }
}
```
<!-- slide -->
```javascript
function minCut(s) {
    const n = s.length;
    const isPal = Array(n).fill(null).map(() => Array(n).fill(false));
    
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1])) {
                isPal[i][j] = true;
            }
        }
    }
    
    const dp = new Array(n).fill(Infinity);
    
    for (let i = 0; i < n; i++) {
        if (isPal[0][i]) {
            dp[i] = 0;
        } else {
            for (let j = 0; j < i; j++) {
                if (isPal[j + 1][i]) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
    }
    
    return dp[n - 1];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(n²) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard Interval DP | O(n³) | O(n²) | General interval problems |
| Optimized Palindrome | O(n²) | O(n²) | Palindrome-specific problems |
| Memoization | O(n³) | O(n²) | When recursive is clearer |
| Space Optimized | O(n³) | O(n) | Memory-constrained (rare) |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Burst Balloons](https://leetcode.com/problems/burst-balloons/) | 312 | Hard | Max coins by bursting balloons |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/) | 132 | Hard | Min cuts for palindromes |
| [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/) | 1000 | Hard | Merge stones with min cost |
| [Remove Boxes](https://leetcode.com/problems/remove-boxes/) | 546 | Hard | Remove boxes for max points |
| [Strange Printer](https://leetcode.com/problems/strange-printer/) | 664 | Hard | Print string with min turns |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner/) | 486 | Medium | Game theory on intervals |
| [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | 516 | Medium | LPS using interval DP |
| [Stone Game VII](https://leetcode.com/problems/stone-game-vii/) | 1690 | Medium | Stone game variation |

## Video Tutorial Links

1. **[NeetCode - Burst Balloons](https://www.youtube.com/watch?v=VFtsQ3Y2W6Q)** - Interval DP explained
2. **[Back To Back SWE - Interval DP](https://www.youtube.com/watch?v=3YDILjpKs9s)** - Pattern walkthrough
3. **[Kevin Naughton Jr. - Burst Balloons](https://www.youtube.com/watch?v=Ja3lLJ8-Lzg)** - Step-by-step solution
4. **[William Lin - Interval DP](https://www.youtube.com/watch?v=2waW4xJvtDo)** - Competitive programming perspective
5. **[Techdose - Interval DP Playlist](https://www.youtube.com/watch?v=Im1_X4hD3dQ)** - All interval DP problems

## Summary

### Key Takeaways

- **Process by length**: Always process smaller intervals before larger ones
- **Try all split points**: For each [i, j], try every k in between
- **Think "last operation"**: Often easier to consider what happens last
- **Base cases**: Single element intervals are the base case
- **Time is O(n³)**: n² intervals × n split points
- **Space is O(n²)**: 2D DP table for interval tracking

### Common Pitfalls

- **Wrong iteration order**: Must process by increasing interval length
- **Off-by-one in bounds**: Careful with inclusive/exclusive boundaries
- **Not initializing base cases**: Single element intervals need values
- **Wrong split range**: k should range from i to j (or i to j-1)
- **Integer overflow**: Use long for large intermediate values
- **Confusing open/closed intervals**: Be consistent with [i, j) vs [i, j]

### Follow-up Questions

1. **How to reconstruct the actual sequence of operations?**
   - Store choice of k at each dp[i][j], then backtrack

2. **Can you reduce time complexity?**
   - Sometimes O(n²) is possible with optimizations (Knuth's optimization, Monge property)

3. **What about circular arrays?**
   - Duplicate array or try all starting points

4. **When is memoization better than bottom-up?**
   - When many subproblems are not needed

## Pattern Source

[Interval DP Pattern](patterns/dp-interval-dp.md)
