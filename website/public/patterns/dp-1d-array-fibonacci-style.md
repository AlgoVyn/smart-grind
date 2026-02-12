# TDP - 1D Array (Fibonacci Style)

## Overview

The **TDP - 1D Array (Fibonacci Style)** pattern is a fundamental dynamic programming approach where solutions are built by computing and storing results for smaller subproblems in a 1-dimensional array. This pattern is characterized by recurrence relations that depend on the immediate preceding states, similar to how the Fibonacci sequence is computed.

This pattern is applicable when:
- The solution for a state `dp[i]` depends on previous states (typically `dp[i-1]` and/or `dp[i-2]`)
- The problem can be broken down into overlapping subproblems
- We need to compute an optimal value by considering choices at each step
- The state space is linear (1D) rather than multi-dimensional

## Key Concepts

- **DP Array**: A 1D array `dp[i]` where each index represents a state and the value represents the optimal solution for that state
- **Base Cases**: Initial values that anchor the recurrence relation
- **Transition/Recurrence**: The formula that computes `dp[i]` from previous states
- **Bottom-up Building**: Computing states in order from smallest to largest
- **State Dependencies**: Typically `dp[i]` depends on `dp[i-1]` and/or `dp[i-2]`

---

## Intuition and Core Insight

### Why Fibonacci Style Works

The Fibonacci sequence is the classic example:
- `F(n) = F(n-1) + F(n-2)`
- `F(0) = 0`, `F(1) = 1`

This pattern extends to many problems where:
1. **Optimal Substructure**: The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: The same subproblems are computed multiple times
3. **Linear State Space**: The problem can be modeled as a sequence of states

### Key Insight

Instead of recomputing values repeatedly (as in naive recursion), we:
1. **Store** computed results in an array
2. **Build up** solutions from base cases
3. **Reuse** previously computed values to compute new states

This transforms exponential time complexity (O(2^n)) to linear time complexity (O(n)).

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Top-down with Memoization** - Recursive with caching
2. **Bottom-up Tabulation** - Iterative building from base cases
3. **Space-Optimized** - O(1) space using only necessary variables

---

## Approach 1: Top-down with Memoization

### Algorithm Steps

1. Define a recursive function that computes `dp[i]`
2. Before computing, check if `dp[i]` is already computed (memoization)
3. If not, compute using recurrence and store the result
4. Return the cached value

### Why It Works

This approach:
- Avoids recomputation by caching results
- Naturally expresses the problem in terms of the recurrence
- Is easier to understand and debug

### Code Implementation

````carousel
```python
def fib_memoization(n, memo=None):
    """
    Compute nth Fibonacci number using top-down memoization.
    
    Args:
        n: The Fibonacci number to compute
        memo: Optional memoization dictionary
        
    Returns:
        The nth Fibonacci number
    """
    if memo is None:
        memo = {}
    
    # Base cases
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    # Check if already computed
    if n in memo:
        return memo[n]
    
    # Compute and store
    memo[n] = fib_memoization(n - 1, memo) + fib_memoization(n - 2, memo)
    return memo[n]


# Generic template for Fibonacci-style DP
def solve_dp_top_down(states, transition_func, base_cases):
    """
    Generic top-down DP solver for Fibonacci-style problems.
    
    Args:
        states: List of state values (e.g., n)
        transition_func: Function that computes dp[i] from previous states
        base_cases: Dictionary of base case values
        
    Returns:
        dp array with computed values
    """
    n = len(states)
    dp = [None] * n
    memo = {}
    
    def compute(i):
        if i in memo:
            return memo[i]
        
        # Base case
        if i in base_cases:
            memo[i] = base_cases[i]
            return memo[i]
        
        # Compute using transition
        memo[i] = transition_func(memo, i)
        return memo[i]
    
    for i in range(n):
        dp[i] = compute(i)
    
    return dp
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

// Fibonacci with memoization
int fibMemoization(int n, unordered_map<int, int>& memo) {
    // Base cases
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    // Check if already computed
    if (memo.find(n) != memo.end()) {
        return memo[n];
    }
    
    // Compute and store
    memo[n] = fibMemoization(n - 1, memo) + fibMemoization(n - 2, memo);
    return memo[n];
}

// Generic template for Fibonacci-style DP
vector<long long> solveDPTopDown(int n, 
                                  function<long long(int, unordered_map<int, long long>&)> transitionFunc,
                                  unordered_map<int, long long> baseCases) {
    vector<long long> dp(n, 0);
    unordered_map<int, long long> memo;
    
    function<long long(int)> compute = [&](int i) -> long long {
        if (memo.find(i) != memo.end()) {
            return memo[i];
        }
        
        // Base case
        if (baseCases.find(i) != baseCases.end()) {
            memo[i] = baseCases[i];
            return memo[i];
        }
        
        // Compute using transition
        memo[i] = transitionFunc(memo, i);
        return memo[i];
    };
    
    for (int i = 0; i < n; i++) {
        dp[i] = compute(i);
    }
    
    return dp;
}
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;

public class FibonacciDP {
    
    // Fibonacci with memoization
    public static int fibMemoization(int n, Map<Integer, Integer> memo) {
        if (memo == null) {
            memo = new HashMap<>();
        }
        
        // Base cases
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        // Check if already computed
        if (memo.containsKey(n)) {
            return memo.get(n);
        }
        
        // Compute and store
        int result = fibMemoization(n - 1, memo) + fibMemoization(n - 2, memo);
        memo.put(n, result);
        return result;
    }
    
    // Generic template for Fibonacci-style DP
    public static long[] solveDPTopDown(int n,
                                         BiFunction<Map<Integer, Long>, Integer, Long> transitionFunc,
                                         Map<Integer, Long> baseCases) {
        long[] dp = new long[n];
        Map<Integer, Long> memo = new HashMap<>();
        
        java.util.function.Function<Integer, Long> compute = i -> {
            if (memo.containsKey(i)) {
                return memo.get(i);
            }
            
            // Base case
            if (baseCases.containsKey(i)) {
                memo.put(i, baseCases.get(i));
                return baseCases.get(i);
            }
            
            // Compute using transition
            Long result = transitionFunc.apply(memo, i);
            memo.put(i, result);
            return result;
        };
        
        for (int i = 0; i < n; i++) {
            dp[i] = compute.apply(i);
        }
        
        return dp;
    }
}
```

<!-- slide -->
```javascript
// Fibonacci with memoization
function fibMemoization(n, memo = new Map()) {
    // Base cases
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    // Check if already computed
    if (memo.has(n)) {
        return memo.get(n);
    }
    
    // Compute and store
    const result = fibMemoization(n - 1, memo) + fibMemoization(n - 2, memo);
    memo.set(n, result);
    return result;
}

// Generic template for Fibonacci-style DP
function solveDPTopDown(n, transitionFunc, baseCases) {
    const dp = new Array(n).fill(null);
    const memo = new Map();
    
    const compute = (i) => {
        if (memo.has(i)) {
            return memo.get(i);
        }
        
        // Base case
        if (baseCases.has(i)) {
            memo.set(i, baseCases.get(i));
            return baseCases.get(i);
        }
        
        // Compute using transition
        const result = transitionFunc(memo, i);
        memo.set(i, result);
        return result;
    };
    
    for (let i = 0; i < n; i++) {
        dp[i] = compute(i);
    }
    
    return dp;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each state computed once |
| **Space** | O(n) - Memoization dictionary + recursion stack |
| **Auxiliary Space** | O(n) recursion depth |

---

## Approach 2: Bottom-up Tabulation

### Algorithm Steps

1. Initialize the DP array with base cases
2. Iterate from the first non-base state to the target state
3. Apply the transition formula to compute each state
4. Return the final computed value

### Why It Works

Bottom-up approach:
- Eliminates recursion overhead
- More memory-efficient for large inputs
- Easier to convert to iterative solutions
- Better cache locality

### Code Implementation

````carousel
```python
def fib_tabulation(n):
    """
    Compute nth Fibonacci number using bottom-up tabulation.
    
    Args:
        n: The Fibonacci number to compute
        
    Returns:
        The nth Fibonacci number
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    # DP array with base cases
    dp = [0] * (n + 1)
    dp[0] = 0  # Base case
    dp[1] = 1  # Base case
    
    # Build up from base cases
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]


# Generic template for Fibonacci-style DP
def solve_dp_tabulation(n, transition_func, base_cases):
    """
    Generic bottom-up DP solver for Fibonacci-style problems.
    
    Args:
        n: Number of states to compute
        transition_func: Function that computes dp[i] from previous states
        base_cases: Dictionary of base case values
        
    Returns:
        dp array with computed values
    """
    dp = [0] * n
    
    # Initialize base cases
    for i, value in base_cases.items():
        if i < n:
            dp[i] = value
    
    # Build up from base cases
    for i in range(len(base_cases), n):
        dp[i] = transition_func(dp, i)
    
    return dp


# Example: Climbing Stairs (LeetCode 70)
def climb_stairs(n):
    """
    Count ways to climb n stairs taking 1 or 2 steps at a time.
    
    Args:
        n: Number of stairs
        
    Returns:
        Number of ways to reach the top
    """
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1  # One way to climb 1 stair
    dp[2] = 2  # Two ways to climb 2 stairs
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

// Fibonacci with tabulation
int fibTabulation(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    // DP array with base cases
    vector<int> dp(n + 1);
    dp[0] = 0;  // Base case
    dp[1] = 1;  // Base case
    
    // Build up from base cases
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Generic template for Fibonacci-style DP
vector<long long> solveDPTabulation(int n,
                                      function<long long(const vector<long long>&, int)> transitionFunc,
                                      unordered_map<int, long long> baseCases) {
    vector<long long> dp(n, 0);
    
    // Initialize base cases
    for (const auto& [i, value] : baseCases) {
        if (i < n) {
            dp[i] = value;
        }
    }
    
    // Find the first index that needs computation
    int startIdx = 0;
    while (startIdx < n && baseCases.find(startIdx) != baseCases.end()) {
        startIdx++;
    }
    
    // Build up from base cases
    for (int i = startIdx; i < n; i++) {
        dp[i] = transitionFunc(dp, i);
    }
    
    return dp;
}

// Example: Climbing Stairs (LeetCode 70)
int climbStairs(int n) {
    if (n <= 2) return n;
    
    vector<int> dp(n + 1);
    dp[1] = 1;  // One way to climb 1 stair
    dp[2] = 2;  // Two ways to climb 2 stairs
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```

<!-- slide -->
```java
public class FibonacciTabulation {
    
    // Fibonacci with tabulation
    public static int fibTabulation(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        // DP array with base cases
        int[] dp = new int[n + 1];
        dp[0] = 0;  // Base case
        dp[1] = 1;  // Base case
        
        // Build up from base cases
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
    
    // Generic template for Fibonacci-style DP
    public static long[] solveDPTabulation(int n,
                                            java.util.function.BiFunction<long[], Integer, Long> transitionFunc,
                                            java.util.Map<Integer, Long> baseCases) {
        long[] dp = new long[n];
        
        // Initialize base cases
        for (java.util.Map.Entry<Integer, Long> entry : baseCases.entrySet()) {
            int i = entry.getKey();
            if (i < n) {
                dp[i] = entry.getValue();
            }
        }
        
        // Find the first index that needs computation
        int startIdx = 0;
        while (startIdx < n && baseCases.containsKey(startIdx)) {
            startIdx++;
        }
        
        // Build up from base cases
        for (int i = startIdx; i < n; i++) {
            dp[i] = transitionFunc.apply(dp, i);
        }
        
        return dp;
    }
    
    // Example: Climbing Stairs (LeetCode 70)
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        
        int[] dp = new int[n + 1];
        dp[1] = 1;  // One way to climb 1 stair
        dp[2] = 2;  // Two ways to climb 2 stairs
        
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
// Fibonacci with tabulation
function fibTabulation(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    // DP array with base cases
    const dp = new Array(n + 1);
    dp[0] = 0;  // Base case
    dp[1] = 1;  // Base case
    
    // Build up from base cases
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Generic template for Fibonacci-style DP
function solveDPTabulation(n, transitionFunc, baseCases) {
    const dp = new Array(n).fill(0);
    
    // Initialize base cases
    for (const [i, value] of baseCases.entries()) {
        if (i < n) {
            dp[i] = value;
        }
    }
    
    // Find the first index that needs computation
    let startIdx = 0;
    while (startIdx < n && baseCases.has(startIdx)) {
        startIdx++;
    }
    
    // Build up from base cases
    for (let i = startIdx; i < n; i++) {
        dp[i] = transitionFunc(dp, i);
    }
    
    return dp;
}

// Example: Climbing Stairs (LeetCode 70)
function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1;  // One way to climb 1 stair
    dp[2] = 2;  // Two ways to climb 2 stairs
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each state computed once |
| **Space** | O(n) - DP array storage |
| **Auxiliary Space** | O(1) - No recursion overhead |

---

## Approach 3: Space-Optimized (O(1) Space)

### Algorithm Steps

1. Recognize that we only need the last 1-2 states to compute the current state
2. Replace the DP array with just the necessary variables
3. Update variables iteratively to compute the final result

### Why It Works

For Fibonacci-style problems where `dp[i]` depends only on `dp[i-1]` and `dp[i-2]`, we don't need to store the entire array. We only need:
- The current result
- The previous result
- Optionally, the result before that

This reduces space complexity from O(n) to O(1).

### Code Implementation

````carousel
```python
def fib_optimized(n):
    """
    Compute nth Fibonacci number using O(1) space.
    
    Args:
        n: The Fibonacci number to compute
        
    Returns:
        The nth Fibonacci number
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    # Only need two variables
    prev2 = 0  # F(0)
    prev1 = 1  # F(1)
    current = 0
    
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return current


# Example: House Robber (LeetCode 198)
def house_robber(nums):
    """
    Find maximum money you can rob without robbing two adjacent houses.
    
    Args:
        nums: Array of money in each house
        
    Returns:
        Maximum amount that can be robbed
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    if len(nums) == 2:
        return max(nums[0], nums[1])
    
    # Space optimized: only need two variables
    prev2 = nums[0]  # Rob first house
    prev1 = max(nums[0], nums[1])  # Max of first two
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1


# Example: Maximum Subarray Sum (Kadane's variant)
def max_subarray_sum(nums):
    """
    Find maximum sum of contiguous subarray (Kadane's algorithm).
    
    Args:
        nums: Array of integers
        
    Returns:
        Maximum subarray sum
    """
    if not nums:
        return 0
    
    max_ending_here = nums[0]
    max_so_far = nums[0]
    
    for i in range(1, len(nums)):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far


# Generic template for Fibonacci-style DP with O(1) space
def solve_dp_optimized(n, transition_func, base_cases):
    """
    Generic space-optimized DP solver for Fibonacci-style problems.
    
    Args:
        n: Number of states to compute
        transition_func: Function that computes current from previous states
        base_cases: Dictionary of base case values
        
    Returns:
        Final computed value
    """
    if n == 0:
        return base_cases.get(0, 0)
    
    # Extract base values based on problem requirements
    base_keys = sorted(base_cases.keys())
    values = [base_cases[k] for k in base_keys]
    
    # For 1-state dependency
    if len(values) == 1:
        prev = values[0]
        for i in range(base_keys[0] + 1, n):
            current = transition_func(prev, i)
            prev = current
        return prev
    
    # For 2-state dependency (Fibonacci style)
    if len(values) >= 2:
        prev2 = values[0]
        prev1 = values[1]
        
        start_idx = max(base_keys) + 1
        for i in range(start_idx, n):
            current = transition_func(prev2, prev1, i)
            prev2 = prev1
            prev1 = current
        
        return prev1
    
    return 0
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

// Fibonacci with O(1) space
int fibOptimized(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    // Only need two variables
    int prev2 = 0;  // F(0)
    int prev1 = 1;  // F(1)
    int current = 0;
    
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}

// Example: House Robber (LeetCode 198)
int houseRobber(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    if (nums.size() == 2) return max(nums[0], nums[1]);
    
    // Space optimized: only need two variables
    int prev2 = nums[0];  // Rob first house
    int prev1 = max(nums[0], nums[1]);  // Max of first two
    
    for (int i = 2; i < nums.size(); i++) {
        int current = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// Example: Maximum Subarray Sum (Kadane's variant)
int maxSubarraySum(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int maxEndingHere = nums[0];
    int maxSoFar = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// Generic template for Fibonacci-style DP with O(1) space
template<typename T>
T solveDPOptimized(int n,
                   function<T(const T&, const T&, int)> transitionFunc,
                   vector<T> baseValues) {
    if (n == 0) return baseValues[0];
    
    // For 2-state dependency (Fibonacci style)
    T prev2 = baseValues[0];
    T prev1 = baseValues[1];
    
    int startIdx = 2;
    for (int i = startIdx; i < n; i++) {
        T current = transitionFunc(prev2, prev1, i);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

<!-- slide -->
```java
public class FibonacciOptimized {
    
    // Fibonacci with O(1) space
    public static int fibOptimized(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        // Only need two variables
        int prev2 = 0;  // F(0)
        int prev1 = 1;  // F(1)
        int current = 0;
        
        for (int i = 2; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return current;
    }
    
    // Example: House Robber (LeetCode 198)
    public static int houseRobber(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];
        if (nums.length == 2) return Math.max(nums[0], nums[1]);
        
        // Space optimized: only need two variables
        int prev2 = nums[0];  // Rob first house
        int prev1 = Math.max(nums[0], nums[1]);  // Max of first two
        
        for (int i = 2; i < nums.length; i++) {
            int current = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    // Example: Maximum Subarray Sum (Kadane's variant)
    public static int maxSubarraySum(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int maxEndingHere = nums[0];
        int maxSoFar = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
    }
    
    // Generic template for Fibonacci-style DP with O(1) space
    public static long solveDPOptimized(int n,
                                        java.util.function.BiFunction<Long, Long, Long> transitionFunc,
                                        long[] baseValues) {
        if (n == 0) return baseValues[0];
        if (n == 1) return baseValues[1];
        
        // For 2-state dependency (Fibonacci style)
        long prev2 = baseValues[0];
        long prev1 = baseValues[1];
        
        for (int i = 2; i < n; i++) {
            long current = transitionFunc.apply(prev2, prev1);
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
}
```

<!-- slide -->
```javascript
// Fibonacci with O(1) space
function fibOptimized(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    // Only need two variables
    let prev2 = 0;  // F(0)
    let prev1 = 1;  // F(1)
    let current = 0;
    
    for (let i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}

// Example: House Robber (LeetCode 198)
function houseRobber(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return Math.max(nums[0], nums[1]);
    
    // Space optimized: only need two variables
    let prev2 = nums[0];  // Rob first house
    let prev1 = Math.max(nums[0], nums[1]);  // Max of first two
    
    for (let i = 2; i < nums.length; i++) {
        let current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// Example: Maximum Subarray Sum (Kadane's variant)
function maxSubarraySum(nums) {
    if (!nums || nums.length === 0) return 0;
    
    let maxEndingHere = nums[0];
    let maxSoFar = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// Generic template for Fibonacci-style DP with O(1) space
function solveDPOptimized(n, transitionFunc, baseValues) {
    if (n === 0) return baseValues[0];
    if (n === 1) return baseValues[1];
    
    // For 2-state dependency (Fibonacci style)
    let prev2 = baseValues[0];
    let prev1 = baseValues[1];
    
    for (let i = 2; i < n; i++) {
        let current = transitionFunc(prev2, prev1, i);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each state computed once |
| **Space** | O(1) - Only constant number of variables |
| **Auxiliary Space** | O(1) - No recursion, no arrays |

---

## Comparison of Approaches

| Aspect | Top-down (Memoization) | Bottom-up (Tabulation) | Space-Optimized |
|--------|------------------------|------------------------|-----------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(1) |
| **Implementation** | Moderate | Simple | Simple |
| **Readability** | High (recursive) | High (iterative) | High |
| **Debugging** | Easier (stack trace) | Moderate | Moderate |
| **Recursion Depth** | O(n) | None | None |
| **Cache Efficiency** | Good | Excellent | Excellent |
| **Best For** | Understanding, small n | Large n, production | Production, large n |

---

## Example Problems

### Easy Problems

| Problem | LeetCode Link | Pattern |
|---------|---------------|---------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Fibonacci-style (dp[i] = dp[i-1] + dp[i-2]) |
| Fibonacci Number | [Link](https://leetcode.com/problems/fibonacci-number/) | Classic Fibonacci |
| N-th Tribonacci Number | [Link](https://leetcode.com/problems/n-th-tribonacci-number/) | Three-state dependency |
| Count Ways to Reach the Top of Stairs | [Link](https://leetcode.com/problems/count-ways-to-reach-the-top-of-a-staircase/) | Climbing stairs variant |

### Medium Problems

| Problem | LeetCode Link | Pattern |
|---------|---------------|---------|
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | dp[i] = max(dp[i-1], dp[i-2] + nums[i]) |
| House Robber II | [Link](https://leetcode.com/problems/house-robber-ii/) | Circular variant |
| Decode Ways | [Link](https://leetcode.com/problems/decode-ways/) | String DP with constraints |
| Word Break | [Link](https://leetcode.com/problems/word-break/) | String segmentation DP |
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Greedy/DP hybrid |
| Longest Increasing Subsequence | [Link](https://leetcode.com/problems/longest-increasing-subsequence/) | LIS with binary search variant |
| Best Time to Buy and Sell Stock | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Single transaction |
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Kadane's algorithm |

### Hard Problems

| Problem | LeetCode Link | Pattern |
|---------|---------------|---------|
| House Robber III | [Link](https://leetcode.com/problems/house-robber-iii/) | Tree + DP |
| Decode Ways II | [Link](https://leetcode.com/problems/decode-ways-ii/) | Large numbers modulo |
| Number of Ways to Reach a Target Score | [Link](https://leetcode.com/problems/number-of-ways-to-reach-a-target-score/) | Combinatorial DP |
| Minimum Cost to Reach the End | [Link](https://leetcode.com/problems/minimum-cost-to-reach-the-end-in-two-queues/) | Queue DP |

---

## Video Tutorial Links

### Fibonacci and Basic DP

- [Fibonacci Number - LeetCode Official](https://www.youtube.com/watch?v=Qk0bU0Z3f6M) - Official solution explanation
- [Dynamic Programming - Fibonacci Sequence](https://www.youtube.com/watch?v=vYquumkDk1A) - Detailed DP explanation
- [Memoization vs Tabulation](https://www.youtube.com/watch?v=oBt53YbR9Kk) - Comparison of approaches

### Climbing Stairs Problems

- [Climbing Stairs - NeetCode](https://www.youtube.com/watch?v=mLfjz6_N1uc) - Visual explanation
- [Climbing Stairs - Back to Back SWE](https://www.youtube.com/watch?v=mC3ZPVKSjKo) - Step-by-step solution
- [LeetCode 70 - Climbing Stairs](https://www.youtube.com/watch?v=ZlN8-FqV4T8) - Multiple approaches

### House Robber Problems

- [House Robber - NeetCode](https://www.youtube.com/watch?v=Zr5ouU8dTjI) - Clear explanation
- [House Robber II - NeetCode](https://www.youtube.com/watch?v=r1EAeKy4LLo) - Circular variant
- [House Robber III - NeetCode](https://www.youtube.com/watch?v=nGhK9g_6jXw) - Tree DP

### General DP Tutorials

- [Dynamic Programming - Complete Playlist](https://www.youtube.com/playlist?list=PLot-XpVEJr_4D2m1zNqKKAuwh14H9ar0Y) - Comprehensive DP playlist
- [DP for Beginners](https://www.youtube.com/watch?v=VB1vG_B9wJU) - Beginner-friendly introduction
- [Space Optimized DP](https://www.youtube.com/watch?v=LoMq2j6C7qA) - Optimizing DP space

---

## Follow-up Questions

### Q1: How do you decide between top-down and bottom-up approaches?

**Answer:** Consider these factors:
- **Top-down**: Better for understanding, easier to implement for problems with irregular dependencies
- **Bottom-up**: Better for performance, avoids recursion overhead, more cache-friendly
- **Space-optimized**: Best for production when you only need the final answer

### Q2: When can you use space optimization?

**Answer:** Space optimization is possible when `dp[i]` depends only on a constant number of previous states (typically 1 or 2). For example:
- Fibonacci: `dp[i]` depends on `dp[i-1]` and `dp[i-2]`
- House Robber: `dp[i]` depends on `dp[i-1]` and `dp[i-2]`

If `dp[i]` depends on all previous states (like in longest increasing subsequence), you cannot use O(1) space optimization.

### Q3: How do you handle different base cases?

**Answer:** 
1. **Single base case**: `dp[0] = value`
2. **Multiple base cases**: Initialize multiple positions
3. **No base cases**: Use the problem's natural starting conditions

Example for climbing stairs with 1, 2, or 3 steps:
```python
dp[1] = 1  # One way to climb 1 stair
dp[2] = 2  # Two ways to climb 2 stairs
dp[3] = 4  # Four ways to climb 3 stairs
```

### Q4: How do you handle modulo operations in DP?

**Answer:** Apply modulo at each computation to prevent overflow:
```python
MOD = 10**9 + 7
dp[i] = (dp[i-1] + dp[i-2]) % MOD
```

### Q5: What if the recurrence depends on more than 2 previous states?

**Answer:** Use a deque or circular buffer:
```python
# Tribonacci example
dp[i] = dp[i-1] + dp[i-2] + dp[i-3]

# Space optimized with queue
from collections import deque
dq = deque([0, 0, 1])  # T(0), T(1), T(2)
for i in range(3, n+1):
    current = sum(dq)
    dq.append(current)
    dq.popleft()
```

---

## Common Pitfalls

### 1. Incorrect Base Cases
**Issue**: Setting wrong initial values breaks the entire computation.

**Solution**: Carefully identify and set all base cases:
```python
# Fibonacci
dp[0] = 0
dp[1] = 1

# Climbing Stairs
dp[1] = 1
dp[2] = 2
```

### 2. Off-by-One Errors
**Issue**: Array indices don't match problem states.

**Solution**: Use consistent indexing:
- If `dp[i]` represents state at position `i`, use array of size `n+1`
- Remember: Python uses 0-based indexing

### 3. Integer Overflow
**Issue**: Large numbers exceed integer limits.

**Solution**: Use modulo or appropriate data types:
```python
MOD = 10**9 + 7
dp[i] = (dp[i-1] + dp[i-2]) % MOD
```

### 4. Unnecessary Space
**Issue**: Using O(n) space when O(1) is possible.

**Solution**: Analyze dependencies and optimize:
- Fibonacci-style: Only need 2 variables
- Window-based: Use a deque or circular buffer

### 5. Not Handling Edge Cases
**Issue**: Failing to handle n=0, n=1, empty arrays.

**Solution**: Add explicit checks:
```python
if n <= 2:
    return n
if not nums:
    return 0
```

---

## Summary

The **TDP - 1D Array (Fibonacci Style)** pattern is a powerful dynamic programming approach that:

1. **Breaks Down Problems**: Splits complex problems into smaller, manageable subproblems
2. **Builds Solutions**: Computes answers incrementally from base cases
3. **Optimizes Space**: Reduces memory usage when dependencies are limited
4. **Solves Efficiently**: Transforms exponential algorithms to linear time

### Key Takeaways

- **Optimal Substructure**: Problems can be solved by combining solutions to subproblems
- **Overlapping Subproblems**: Same subproblems are solved multiple times
- **Bottom-up vs Top-down**: Choose based on readability vs performance needs
- **Space Optimization**: Available when dependencies are limited (1-2 states)
- **Modulo Handling**: Essential for large numbers in production code

### Pattern Summary

| Characteristic | Description |
|----------------|-------------|
| **State** | `dp[i]` represents the optimal solution for position/state `i` |
| **Transition** | `dp[i] = f(dp[i-1], dp[i-2], ...)` based on problem |
| **Base Cases** | Initial values that anchor the recurrence |
| **Order** | Compute from small to large (bottom-up) |
| **Space** | O(n) standard, O(1) when dependencies are limited |

This pattern is fundamental to dynamic programming and appears in numerous LeetCode problems. Mastery of this pattern opens the door to solving more complex DP problems involving 2D arrays, graphs, and advanced optimizations.

---

## Additional Resources

- [LeetCode DP Problems](https://leetcode.com/tag/dynamic-programming/) - Practice problems
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - Detailed explanations
- [DP Cheat Sheet](https://github.com/halfrost/LeetCode-Go/blob/master/Notes/12.dp.md) - Quick reference
- [Pattern: TDP - 1D Array (Fibonacci Style)](dp-1d-array-fibonacci-style) - Back to top
