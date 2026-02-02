# DP - Interval Dynamic Programming

## Overview

**Interval DP** is a powerful dynamic programming technique used to solve problems involving intervals, ranges, or contiguous segments. The core idea is to break down a problem into smaller overlapping subproblems based on intervals and build up solutions for larger intervals from smaller ones.

This pattern is particularly effective for problems where:
- The solution depends on contiguous subarrays or substrings
- Breaking points or partition points are important
- The optimal solution can be constructed from optimal solutions of subintervals

### What You'll Learn

- How to identify Interval DP problems
- The key components of Interval DP solutions
- Multiple implementation approaches
- Common patterns and templates
- Related problems for practice

---

## Intuition and Core Concept

### The Fundamental Idea

Interval DP leverages the observation that many problems have **optimal substructure** - the optimal solution for a larger interval can be constructed from optimal solutions of smaller intervals. The key steps are:

1. **Define the DP state**: `dp[i][j]` represents the optimal value for the subproblem covering interval `[i, j]`
2. **Identify the recurrence**: How to compute `dp[i][j]` using smaller subproblems
3. **Determine the order of computation**: Process intervals from small to large
4. **Handle base cases**: Intervals of length 1 (or 0) as starting points

### Why Interval DP Works

```
Consider breaking interval [i, j] at position k:

[i.......k.......j]
     ^         ^
   left      right

If we burst/remove/process k last:
dp[i][j] = combine(dp[i][k-1], dp[k+1][j], k's contribution)

The key insight: When k is the "last" element,
its neighbors are fixed (i-1 and j+1 boundaries)
```

### Key Characteristics of Interval DP Problems

| Characteristic | Description |
|----------------|-------------|
| **Contiguous structure** | Problems involve contiguous ranges or segments |
| **Optimal substructure** | Optimal solution for [i, j] uses optimal solutions for subintervals |
| **Overlapping subproblems** | Same subintervals are solved multiple times |
| **Partition points** | A position k divides the interval into left and right parts |

---

## Identifying Interval DP Problems

### Problem Patterns That Indicate Interval DP

1. **Matrix Chain Multiplication**: Parenthesize matrix multiplication to minimize cost
2. **Palindrome Partitioning**: Split a string into palindromic substrings
3. **Burst Balloons**: Burst balloons to maximize coins
4. **Remove Boxes**: Remove colored boxes for maximum points
5. **Strange Printer**: Print a string with minimum turns

### Questions to Ask

- Does the problem involve a contiguous sequence?
- Can we divide the problem at a point k?
- Does the solution for [i, j] depend on solutions for smaller intervals?
- Is there an optimal "last" or "first" operation that splits the problem?

---

## Solution Approaches

### Approach 1: Bottom-Up Interval DP (Tabulation)

This is the most common and recommended approach for Interval DP problems. We build the solution iteratively by increasing interval length.

#### Algorithm

1. **Initialize DP table**: Create a 2D array `dp[n][n]` initialized to 0 or infinity
2. **Iterate by length**: For `length` from 1 to n:
   - For each starting index `i`:
     - Calculate ending index `j = i + length - 1`
     - For each partition point `k` in `[i, j]`:
       - Compute candidate solution using `dp[i][k-1]` and `dp[k+1][j]`
       - Update `dp[i][j]` with the best candidate
3. **Return result**: `dp[0][n-1]` (or appropriate bounds)

#### Implementation

````carousel
```python
def interval_dp_bottom_up(arr):
    """
    Bottom-Up Interval DP Template
    
    Strategy:
    1. Initialize dp table for all intervals
    2. Process intervals by increasing length
    3. For each interval [i, j], try all partition points k
    4. Combine results from subintervals
    
    Time Complexity: O(n³) - n² intervals × O(n) partition points
    Space Complexity: O(n²) - DP table stores n² values
    """
    n = len(arr)
    
    # Initialize DP table
    # dp[i][j] = optimal value for interval [i, j]
    dp = [[0] * n for _ in range(n)]
    
    # For minimum cost problems, initialize with infinity
    # INF = float('inf')
    # dp = [[INF] * n for _ in range(n)]
    
    # Base case: intervals of length 1
    for i in range(n):
        dp[i][i] = 0  # or base value depending on problem
    
    # Process intervals of increasing length
    for length in range(2, n + 1):  # length of interval
        for i in range(n - length + 1):
            j = i + length - 1  # ending index
            
            # Initialize with a large value for minimization problems
            best = float('inf') if "min" in str(arr).lower() else 0
            
            # Try all possible partition points k
            for k in range(i, j):
                # Compute candidate solution
                # This is the key recurrence - customize for your problem
                left = dp[i][k]      # solution for left subinterval
                right = dp[k + 1][j] # solution for right subinterval
                cost = combine_cost(i, k, j, arr)  # cost of combining at k
                
                candidate = left + right + cost
                best = min(best, candidate) if "min" in str(arr).lower() else max(best, candidate)
            
            dp[i][j] = best
    
    return dp[0][n - 1]

def combine_cost(i, k, j, arr):
    """
    Compute the cost of combining left and right subintervals at partition k.
    Customize this function based on the specific problem.
    """
    # Example for matrix chain multiplication:
    # cost = arr[i] * arr[k] * arr[j]
    # Example for burst balloons:
    # cost = arr[i-1] * arr[k] * arr[j+1] (with boundary handling)
    pass
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

template<typename T>
T interval_dp_bottom_up(const vector<T>& arr) {
    """
    Bottom-Up Interval DP Template (C++)
    
    Strategy:
    1. Initialize dp table for all intervals
    2. Process intervals by increasing length
    3. For each interval [i, j], try all partition points k
    4. Combine results from subintervals
    
    Time Complexity: O(n³)
    Space Complexity: O(n²)
    """
    int n = arr.size();
    
    // Initialize DP table
    vector<vector<T>> dp(n, vector<T>(n, 0));
    
    // For minimum cost problems, initialize with infinity
    // const T INF = numeric_limits<T>::max();
    // vector<vector<T>> dp(n, vector<T>(n, INF));
    
    // Base case: intervals of length 1
    for (int i = 0; i < n; i++) {
        dp[i][i] = 0;  // or base value depending on problem
    }
    
    // Process intervals of increasing length
    for (int length = 2; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;
            
            // Initialize with a large value for minimization problems
            T best = numeric_limits<T>::max();
            
            // Try all possible partition points k
            for (int k = i; k < j; k++) {
                T left = dp[i][k];
                T right = dp[k + 1][j];
                T cost = combine_cost(i, k, j, arr);
                
                best = min(best, left + right + cost);
            }
            
            dp[i][j] = best;
        }
    }
    
    return dp[0][n - 1];
}

template<typename T>
T combine_cost(int i, int k, int j, const vector<T>& arr) {
    // Customize based on specific problem
    return T();
}
```
<!-- slide -->
```java
public class IntervalDP {
    
    public static long intervalDPBottomUp(int[] arr) {
        """
        Bottom-Up Interval DP Template (Java)
        
        Time Complexity: O(n³)
        Space Complexity: O(n²)
        """
        int n = arr.length;
        
        // Initialize DP table
        long[][] dp = new long[n][n];
        
        // Base case: intervals of length 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = 0;  // or base value depending on problem
        }
        
        // Process intervals of increasing length
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                
                // Initialize with a large value for minimization problems
                long best = Long.MAX_VALUE;
                
                // Try all possible partition points k
                for (int k = i; k < j; k++) {
                    long left = dp[i][k];
                    long right = dp[k + 1][j];
                    long cost = combineCost(i, k, j, arr);
                    
                    best = Math.min(best, left + right + cost);
                }
                
                dp[i][j] = best;
            }
        }
        
        return dp[0][n - 1];
    }
    
    private static long combineCost(int i, int k, int j, int[] arr) {
        // Customize based on specific problem
        return 0;
    }
}
```
<!-- slide -->
```javascript
/**
 * Bottom-Up Interval DP Template (JavaScript)
 * 
 * @param {number[]} arr - Input array
 * @returns {number} - Optimal value
 */
function intervalDPBottomUp(arr) {
    """
    Bottom-Up Interval DP Template
    
    Time Complexity: O(n³)
    Space Complexity: O(n²)
    """
    const n = arr.length;
    
    // Initialize DP table
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    
    // Base case: intervals of length 1
    for (let i = 0; i < n; i++) {
        dp[i][i] = 0;  // or base value depending on problem
    }
    
    // Process intervals of increasing length
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            
            // Initialize with a large value for minimization problems
            let best = Infinity;
            
            // Try all possible partition points k
            for (let k = i; k < j; k++) {
                const left = dp[i][k];
                const right = dp[k + 1][j];
                const cost = combineCost(i, k, j, arr);
                
                best = Math.min(best, left + right + cost);
            }
            
            dp[i][j] = best;
        }
    }
    
    return dp[0][n - 1];
}

function combineCost(i, k, j, arr) {
    // Customize based on specific problem
    return 0;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n³) | n² intervals × O(n) partition points |
| **Space** | O(n²) | DP table stores n² values |

---

### Approach 2: Top-Down Interval DP (Memoization)

This approach uses recursion with memoization to avoid recalculating overlapping subproblems. It's often more intuitive and easier to debug.

#### Algorithm

1. **Create memoization cache**: A 2D array or hash map to store computed results
2. **Define recursive function**: `solve(i, j)` returns the optimal value for interval `[i, j]`
3. **Check cache first**: If result is already computed, return it
4. **Try all partition points**: For each k in `[i, j]`, compute candidate solution
5. **Store and return**: Cache the result before returning

#### Implementation

````carousel
```python
def interval_dp_top_down(arr):
    """
    Top-Down Interval DP with Memoization
    
    Strategy:
    1. Use recursion to explore intervals
    2. Cache results to avoid redundant computation
    3. Try all partition points and combine results
    
    Time Complexity: O(n³) - Same as bottom-up, but potentially faster in practice
    Space Complexity: O(n²) for memoization + O(n) recursion stack
    """
    n = len(arr)
    
    # Memoization cache
    memo = {}
    
    def solve(i: int, j: int) -> int:
        """Returns optimal value for interval [i, j]"""
        
        # Check cache first
        if (i, j) in memo:
            return memo[(i, j)]
        
        # Base case: single element
        if i == j:
            return 0  # or base value
        
        # Initialize best value
        best = float('inf')
        
        # Try all partition points
        for k in range(i, j):
            left = solve(i, k)
            right = solve(k + 1, j)
            cost = combine_cost(i, k, j, arr)
            
            candidate = left + right + cost
            best = min(best, candidate)
        
        # Cache and return
        memo[(i, j)] = best
        return best
    
    return solve(0, n - 1)
```
<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <climits>
using namespace std;

class IntervalDPTopDown {
private:
    vector<int> arr;
    unordered_map<long long, int> memo;  // Use 64-bit key for (i, j)
    
    int solve(int i, int j) {
        // Create a unique key for (i, j)
        long long key = ((long long)i << 32) | (unsigned int)j;
        
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        // Base case
        if (i == j) {
            return 0;
        }
        
        int best = INT_MAX;
        for (int k = i; k < j; k++) {
            int left = solve(i, k);
            int right = solve(k + 1, j);
            int cost = combineCost(i, k, j, arr);
            
            best = min(best, left + right + cost);
        }
        
        memo[key] = best;
        return best;
    }
    
    int combineCost(int i, int k, int j, const vector<int>& arr) {
        // Customize based on specific problem
        return 0;
    }
    
public:
    int intervalDPTopDown(vector<int>& input) {
        arr = input;
        memo.clear();
        return solve(0, arr.size() - 1);
    }
};
```
<!-- slide -->
```java
public class IntervalDPTopDown {
    private int[] arr;
    private Integer[][] memo;
    
    private int solve(int i, int j) {
        if (memo[i][j] != null) {
            return memo[i][j];
        }
        
        // Base case
        if (i == j) {
            memo[i][j] = 0;
            return 0;
        }
        
        int best = Integer.MAX_VALUE;
        for (int k = i; k < j; k++) {
            int left = solve(i, k);
            int right = solve(k + 1, j);
            int cost = combineCost(i, k, j, arr);
            
            best = Math.min(best, left + right + cost);
        }
        
        memo[i][j] = best;
        return best;
    }
    
    private int combineCost(int i, int k, int j, int[] arr) {
        // Customize based on specific problem
        return 0;
    }
    
    public int intervalDPTopDown(int[] input) {
        arr = input;
        int n = arr.length;
        memo = new Integer[n][n];
        return solve(0, n - 1);
    }
}
```
<!-- slide -->
```javascript
/**
 * Top-Down Interval DP with Memoization (JavaScript)
 * 
 * @param {number[]} arr - Input array
 * @returns {number} - Optimal value
 */
function intervalDPTopDown(arr) {
    const n = arr.length;
    const memo = new Map();
    
    function solve(i, j) {
        const key = `${i}-${j}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        // Base case
        if (i === j) {
            return 0;
        }
        
        let best = Infinity;
        for (let k = i; k < j; k++) {
            const left = solve(i, k);
            const right = solve(k + 1, j);
            const cost = combineCost(i, k, j, arr);
            
            best = Math.min(best, left + right + cost);
        }
        
        memo.set(key, best);
        return best;
    }
    
    return solve(0, n - 1);
}

function combineCost(i, k, j, arr) {
    // Customize based on specific problem
    return 0;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n³) | Each state computed once, O(n) transitions |
| **Space** | O(n²) | Memoization cache + O(n) recursion stack |

---

### Approach 3: Optimized Space DP

For some Interval DP problems, we can optimize space usage by using 1D arrays or by noting that only certain DP states are needed.

#### Algorithm

1. **Identify dependencies**: Determine which DP states are needed to compute the current state
2. **Use rolling arrays**: Keep only necessary rows/columns
3. **In-place updates**: When safe, update DP in place

#### Implementation

````carousel
```python
def interval_dp_optimized_space(arr):
    """
    Space-Optimized Interval DP
    
    Strategy:
    1. Use 1D DP array instead of 2D
    2. Process intervals in reverse order to avoid overwriting needed values
    3. Only keep current and previous states
    
    Time Complexity: O(n³)
    Space Complexity: O(n)
    """
    n = len(arr)
    
    # 1D DP array
    dp = [0] * n
    
    # Process from right to left
    for i in range(n - 1, -1, -1):
        # Store original value for interval [i, i]
        original = dp[i]
        
        # Reset dp[i] for new computation
        dp[i] = 0
        
        # Update for all j >= i
        for j in range(i + 1, n):
            best = float('inf')
            for k in range(i, j):
                left = dp[k] if k > i else 0
                right = dp[j]
                cost = combine_cost(i, k, j, arr)
                
                candidate = left + right + cost
                best = min(best, candidate)
            
            dp[j] = best
    
    return dp[n - 1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

vector<int> intervalDPOptimizedSpace(const vector<int>& arr) {
    """
    Space-Optimized Interval DP (C++)
    
    Time Complexity: O(n³)
    Space Complexity: O(n)
    """
    int n = arr.size();
    vector<int> dp(n, 0);
    
    // Process from right to left
    for (int i = n - 1; i >= 0; i--) {
        int original = dp[i];
        dp[i] = 0;
        
        for (int j = i + 1; j < n; j++) {
            int best = INT_MAX;
            for (int k = i; k < j; k++) {
                int left = (k > i) ? dp[k] : 0;
                int right = dp[j];
                int cost = combineCost(i, k, j, arr);
                
                best = min(best, left + right + cost);
            }
            
            dp[j] = best;
        }
    }
    
    return dp;
}
```
<!-- slide -->
```java
public class IntervalDPOptimizedSpace {
    
    public static int intervalDPOptimizedSpace(int[] arr) {
        """
        Space-Optimized Interval DP (Java)
        
        Time Complexity: O(n³)
        Space Complexity: O(n)
        """
        int n = arr.length;
        int[] dp = new int[n];
        
        // Process from right to left
        for (int i = n - 1; i >= 0; i--) {
            int original = dp[i];
            dp[i] = 0;
            
            for (int j = i + 1; j < n; j++) {
                int best = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int left = (k > i) ? dp[k] : 0;
                    int right = dp[j];
                    int cost = combineCost(i, k, j, arr);
                    
                    best = Math.min(best, left + right + cost);
                }
                
                dp[j] = best;
            }
        }
        
        return dp[n - 1];
    }
    
    private static int combineCost(int i, int k, int j, int[] arr) {
        // Customize based on specific problem
        return 0;
    }
}
```
<!-- slide -->
```javascript
/**
 * Space-Optimized Interval DP (JavaScript)
 * 
 * @param {number[]} arr - Input array
 * @returns {number} - Optimal value
 */
function intervalDPOptimizedSpace(arr) {
    const n = arr.length;
    const dp = new Array(n).fill(0);
    
    // Process from right to left
    for (let i = n - 1; i >= 0; i--) {
        const original = dp[i];
        dp[i] = 0;
        
        for (let j = i + 1; j < n; j++) {
            let best = Infinity;
            for (let k = i; k < j; k++) {
                const left = k > i ? dp[k] : 0;
                const right = dp[j];
                const cost = combineCost(i, k, j, arr);
                
                best = Math.min(best, left + right + cost);
            }
            
            dp[j] = best;
        }
    }
    
    return dp[n - 1];
}

function combineCost(i, k, j, arr) {
    // Customize based on specific problem
    return 0;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n³) | Same as other approaches |
| **Space** | O(n) | Only O(n) storage instead of O(n²) |

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| **Bottom-Up (Tabulation)** | O(n³) | O(n²) | Production code, when iterative approach is preferred |
| **Top-Down (Memoization)** | O(n³) | O(n²) | Debugging, when recursive structure is clearer |
| **Space Optimized** | O(n³) | O(n) | Memory-constrained environments |

### When to Use Each Approach

- **Bottom-Up**: Default choice for most problems. Iterative, easy to understand.
- **Top-Down**: When the recursive structure is more natural or debugging is needed.
- **Space Optimized**: When memory is limited and the problem allows it.

---

## Complete Problem Examples

### Example 1: Minimum Cost to Merge Stones

**Problem**: Given an array of piles of stones, merge them one by one. When merging piles [i, j] into one pile, the cost is the sum of stones in that range. Find the minimum cost to merge all piles into one.

````carousel
```python
def mergeStones(arr, K):
    """
    Minimum Cost to Merge Stones
    
    LeetCode: 1000
    
    Strategy:
    - Use interval DP with special handling for K
    - dp[i][j][m] = min cost to merge [i, j] into m piles
    
    Time Complexity: O(n³)
    Space Complexity: O(n² × K)
    """
    n = len(arr)
    if (n - 1) % (K - 1) != 0:
        return -1  # Cannot merge into one pile
    
    # Prefix sums for range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    # dp[i][j] = min cost to merge [i, j] into one pile
    dp = [[0] * n for _ in range(n)]
    
    # Length from K to n
    for length in range(K, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            # Try all possible splits
            for k in range(i, j, K - 1):
                left = dp[i][k]
                right = dp[k + 1][j]
                dp[i][j] = min(dp[i][j], left + right)
            
            # Add merge cost if we can merge into one pile
            if (length - 1) % (K - 1) == 0:
                dp[i][j] += prefix[j + 1] - prefix[i]
    
    return dp[0][n - 1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int mergeStones(vector<int>& stones, int K) {
        int n = stones.size();
        if ((n - 1) % (K - 1) != 0) return -1;
        
        // Prefix sums
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + stones[i];
        }
        
        // DP table
        vector<vector<int>> dp(n, vector<int>(n, 0));
        
        for (int len = K; len <= n; len++) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len - 1;
                dp[i][j] = INT_MAX;
                
                for (int k = i; k < j; k += K - 1) {
                    dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j]);
                }
                
                if ((len - 1) % (K - 1) == 0) {
                    dp[i][j] += prefix[j + 1] - prefix[i];
                }
            }
        }
        
        return dp[0][n - 1];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int mergeStones(int[] stones, int K) {
        int n = stones.length;
        if ((n - 1) % (K - 1) != 0) return -1;
        
        // Prefix sums
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + stones[i];
        }
        
        // DP table
        int[][] dp = new int[n][n];
        
        for (int len = K; len <= n; len++) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                
                for (int k = i; k < j; k += K - 1) {
                    dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j]);
                }
                
                if ((len - 1) % (K - 1) == 0) {
                    dp[i][j] += prefix[j + 1] - prefix[i];
                }
            }
        }
        
        return dp[0][n - 1];
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} stones
 * @param {number} K
 * @return {number}
 */
var mergeStones = function(stones, K) {
    const n = stones.length;
    if ((n - 1) % (K - 1) !== 0) return -1;
    
    // Prefix sums
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + stones[i];
    }
    
    // DP table
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let len = K; len <= n; len++) {
        for (let i = 0; i + len <= n; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            for (let k = i; k < j; k += K - 1) {
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j]);
            }
            
            if ((len - 1) % (K - 1) === 0) {
                dp[i][j] += prefix[j + 1] - prefix[i];
            }
        }
    }
    
    return dp[0][n - 1];
};
```
````

### Example 2: Palindrome Partitioning II

**Problem**: Given a string, partition it into palindromic substrings with minimum cuts.

````carousel
```python
def minCut(s):
    """
    Palindrome Partitioning II
    
    LeetCode: 132
    
    Strategy:
    - dp[i] = min cuts for substring [0, i]
    - Expand around centers to find palindromes
    
    Time Complexity: O(n²)
    Space Complexity: O(n)
    """
    n = len(s)
    if n <= 1:
        return 0
    
    # Precompute palindrome table
    is_pal = [[False] * n for _ in range(n)]
    
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True
    
    # dp[i] = min cuts for s[0:i+1]
    dp = [0] * n
    
    for i in range(n):
        # If s[0:i+1] is palindrome, no cuts needed
        if is_pal[0][i]:
            dp[i] = 0
        else:
            # Try all possible cut positions
            dp[i] = i  # maximum cuts is i
            for j in range(i + 1):
                if is_pal[j][i]:
                    dp[i] = min(dp[i], 0 if j == 0 else dp[j - 1] + 1)
    
    return dp[n - 1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

class Solution {
public:
    int minCut(string s) {
        int n = s.size();
        if (n <= 1) return 0;
        
        // Precompute palindrome table
        vector<vector<bool>> is_pal(n, vector<bool>(n, false));
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s[i] == s[j] && (j - i < 2 || is_pal[i + 1][j - 1])) {
                    is_pal[i][j] = true;
                }
            }
        }
        
        // dp[i] = min cuts for s[0:i+1]
        vector<int> dp(n);
        for (int i = 0; i < n; i++) {
            if (is_pal[0][i]) {
                dp[i] = 0;
            } else {
                dp[i] = i;
                for (int j = 1; j <= i; j++) {
                    if (is_pal[j][i]) {
                        dp[i] = min(dp[i], dp[j - 1] + 1);
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
        if (n <= 1) return 0;
        
        // Precompute palindrome table
        boolean[][] isPal = new boolean[n][n];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s.charAt(i) == s.charAt(j) && 
                    (j - i < 2 || isPal[i + 1][j - 1])) {
                    isPal[i][j] = true;
                }
            }
        }
        
        // dp[i] = min cuts for s[0:i+1]
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) {
            if (isPal[0][i]) {
                dp[i] = 0;
            } else {
                dp[i] = i;
                for (int j = 1; j <= i; j++) {
                    if (isPal[j][i]) {
                        dp[i] = Math.min(dp[i], dp[j - 1] + 1);
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
/**
 * @param {string} s
 * @return {number}
 */
var minCut = function(s) {
    const n = s.length;
    if (n <= 1) return 0;
    
    // Precompute palindrome table
    const isPal = Array(n).fill(null).map(() => Array(n).fill(false));
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1])) {
                isPal[i][j] = true;
            }
        }
    }
    
    // dp[i] = min cuts for s[0:i+1]
    const dp = new Array(n);
    for (let i = 0; i < n; i++) {
        if (isPal[0][i]) {
            dp[i] = 0;
        } else {
            dp[i] = i;
            for (let j = 1; j <= i; j++) {
                if (isPal[j][i]) {
                    dp[i] = Math.min(dp[i], dp[j - 1] + 1);
                }
            }
        }
    }
    
    return dp[n - 1];
};
```
````

---

## Common Patterns and Variations

### Pattern 1: Matrix Chain Multiplication

```python
# dp[i][j] = minimum cost to multiply matrices i to j
# dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + cost of multiplying result
```

### Pattern 2: Burst Balloons

```python
# dp[i][j] = maximum coins from bursting balloons in (i, j) interval
# dp[i][j] = max over k of dp[i][k-1] + dp[k+1][j] + nums[i-1] * nums[k] * nums[j+1]
```

### Pattern 3: Remove Boxes

```python
# dp[i][j][k] = maximum points for boxes[i:j+1] with k extra boxes of same color
# dp[i][j][k] = max of removing i-th box now vs. merging with same colors later
```

### Pattern 4: Strange Printer

```python
# dp[i][j] = minimum turns to print s[i:j+1]
# dp[i][j] = min over k of dp[i][k] + dp[k+1][j] - (s[i] == s[k+1] ? 1 : 0)
```

---

## Related Problems

### Interval DP Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Burst Balloons](https://leetcode.com/problems/burst-balloons/) | 312 | Hard | Burst balloons to maximize coins |
| [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/) | 1000 | Hard | Merge stones with minimum cost |
| [Remove Boxes](https://leetcode.com/problems/remove-boxes/) | 546 | Hard | Remove boxes for maximum points |
| [Strange Printer](https://leetcode.com/problems/strange-printer/) | 664 | Hard | Print string with minimum turns |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/) | 132 | Medium | Minimum cuts for palindromes |
| [Remove Palindromic Subsequences](https://leetcode.com/problems/remove-palindromic-subsequences/) | 1332 | Easy | Remove palindromic subsequences |
| [Decode String](https://leetcode.com/problems/decode-string/) | 394 | Medium | Decode encoded string |

### Related Pattern Problems

| Problem | LeetCode # | Pattern | Description |
|---------|------------|---------|-------------|
| [Matrix Chain Multiplication](https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/) | - | DP | Parenthesize matrix multiplication |
| [Optimal Binary Search Tree](https://www.geeksforgeeks.org/optimal-binary-search-tree-dp-24/) | - | DP | Build optimal BST |
| [Edit Distance](https://leetcode.com/problems/edit-distance/) | 72 | DP | Minimum edit operations |
| [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | 516 | DP | Longest palindromic subsequence |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Interval DP - NeetCode](https://www.youtube.com/watch?v=VFtsQ3Y2W6Q)**
   - Excellent visual explanation of interval DP concepts
   - Step-by-step walkthrough of burst balloons
   - Part of popular NeetCode playlist

2. **[Interval DP - William Lin](https://www.youtube.com/watch?v=2waW4xJvtDo)**
   - Clean and concise explanation
   - Multiple approaches covered
   - Great for interview preparation

3. **[Dynamic Programming - MIT OCW](https://www.youtube.com/watch?v=oKIThgoh2p4)**
   - Comprehensive DP lecture from MIT
   - Interval DP concepts explained
   - Academic perspective

4. **[BackToBack SWE - Interval DP](https://www.youtube.com/watch?v=1E6Y5jFzGKg)**
   - Detailed explanation with animations
   - Time complexity analysis
   - Common pitfalls covered

### Additional Resources

- **[Interval DP - CP Algorithms](https://cp-algorithms.com/dynamic_programming/interval.html)** - Comprehensive interval DP guide
- **[LeetCode Discuss - Interval DP](https://leetcode.com/tag/interval-dp/)** - Community solutions and tips
- **[GeeksforGeeks - Interval DP](https://www.geeksforgeeks.org/interval-dp-introduction/)** - Detailed tutorials with examples

---

## Common Pitfalls and Best Practices

### Pitfalls to Avoid

1. **Wrong iteration order**: Always process intervals from small to large (by length)
2. **Off-by-one errors**: Be careful with interval bounds (inclusive vs. exclusive)
3. **Forgetting base cases**: Handle intervals of length 1 properly
4. **Inefficient partition enumeration**: Use step size K-1 when applicable (merge stones)
5. **Not using proper data types**: Use long/int64 for potentially large values

### Best Practices

1. **Start with small examples**: Work through a small case manually first
2. **Draw the DP table**: Visualize how values propagate
3. **Use meaningful variable names**: `dp[i][j]` is clear, avoid single letters
4. **Add comments**: Explain the recurrence relation clearly
5. **Test edge cases**: Single element, empty array, all same elements
6. **Consider optimization**: Can we reduce from O(n³) to O(n²)?

### Debugging Tips

1. **Print DP table**: For small n, visualize the table
2. **Trace specific intervals**: Compute manually for a small interval
3. **Check base cases**: Verify length 1 intervals are correct
4. **Verify recurrence**: Test the recurrence on a simple case
5. **Use assertions**: Add checks for invariant properties

---

## Summary

### Key Takeaways

1. **Interval DP** is ideal for problems involving contiguous segments
2. **Bottom-up** is usually preferred for production code
3. **Time complexity** is typically O(n³) for most interval DP problems
4. **Space can often be optimized** from O(n²) to O(n) in some cases
5. **The key is finding the right recurrence relation**

### Pattern Recognition

When you see:
- Contiguous segments/subarrays
- Need to partition at a point
- Optimal solution built from smaller intervals
- Overlapping subproblems

Think: **Interval DP!**

### Next Steps

1. Practice the problems listed in "Related Problems"
2. Try implementing each approach for the same problem
3. Work on optimizing from O(n³) to O(n²) where possible
4. Study the relationship between interval DP and other DP patterns
5. Apply this pattern to new problems you encounter

---

## References

- [LeetCode - Burst Balloons](https://leetcode.com/problems/burst-balloons/)
- [LeetCode - Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/)
- [CP Algorithms - Interval DP](https://cp-algorithms.com/dynamic_programming/interval.html)
- [MIT OCW - Dynamic Programming](https://www.youtube.com/watch?v=oKIThgoh2p4)
