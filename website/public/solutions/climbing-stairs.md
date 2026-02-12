# Climbing Stairs

## Problem Description

You are climbing a staircase.` steps to reach It takes `n the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

This is a classic dynamic programming problem that demonstrates the relationship between recursion and DP optimization through memoization.

### Understanding the Problem

The problem asks for the number of ways to reach the top of a staircase with `n` steps, where each move can be either:
- **1 step**: Move from step `i` to step `i + 1`
- **2 steps**: Move from step `i` to step `i + 2`

For example, if there are 3 steps:
- Method 1: 1 → 1 → 1 (three single steps)
- Method 2: 1 → 2 (one single step, then one double step)
- Method 3: 2 → 1 (one double step, then one single step)

So there are 3 distinct ways to climb 3 steps.

---

## Constraints

- `1 <= n <= 45`
- The answer will fit within a 32-bit integer

---

## Example 1

**Input:**
```python
n = 2
```

**Output:**
```python
2
```

**Visual:**
```
Step 0 (Start) → Step 1 → Step 2 (Top)
                 OR
Step 0 (Start) → Step 2 (Top) [2-step jump]
```

**Explanation:**
- Way 1: 1 step + 1 step
- Way 2: 2 steps

Total: 2 ways

---

## Example 2

**Input:**
```python
n = 3
```

**Output:**
```python
3
```

**Visual:**
```
Way 1: 1 → 1 → 1
Way 2: 1 → 2
Way 3: 2 → 1
```

**Explanation:**
- Way 1: Three single steps
- Way 2: One single step, then one double step
- Way 3: One double step, then one single step

Total: 3 ways

---

## Example 3

**Input:**
```python
n = 4
```

**Output:**
```python
5
```

**Visual:**
```
Way 1: 1 → 1 → 1 → 1
Way 2: 1 → 1 → 2
Way 3: 1 → 2 → 1
Way 4: 2 → 1 → 1
Way 5: 2 → 2
```

**Explanation:**
There are 5 distinct ways to climb 4 steps.

---

## Example 4

**Input:**
```python
n = 5
```

**Output:**
```python
8
```

**Explanation:**
The pattern continues: 1, 2, 3, 5, 8, ... (Fibonacci sequence)

---

## Solution

This problem has multiple solutions ranging from simple recursion to mathematical formulas. We explore:

1. **Recursive Approach** - Simple but exponential time
2. **Memoization (Top-down DP)** - Optimized recursion
3. **Tabulation (Bottom-up DP)** - Iterative with O(n) time
4. **Space-optimized DP** - O(1) space
5. **Matrix Exponentiation** - O(log n) time for large n

---

## Approach 1: Recursive Approach

### Algorithm

The recursive approach is based on the observation:
- To reach step `n`, you must have come from step `n-1` (taking 1 step) or step `n-2` (taking 2 steps)
- Therefore: `ways(n) = ways(n-1) + ways(n-2)`

This is exactly the Fibonacci recurrence!

### Base Cases

- `ways(1) = 1` (only one way: one single step)
- `ways(2) = 2` (two ways: two single steps or one double step)

### Code Implementation

````carousel
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        Calculate the number of ways to climb n stairs.
        
        Args:
            n: Number of stairs
            
        Returns:
            Number of distinct ways to reach the top
        """
        # Base cases
        if n == 1:
            return 1
        if n == 2:
            return 2
        
        # Recursive case: ways(n) = ways(n-1) + ways(n-2)
        return self.climbStairs(n - 1) + self.climbStairs(n - 2)
```

<!-- slide -->
```cpp
class Solution {
public:
    int climbStairs(int n) {
        // Base cases
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // Recursive case: ways(n) = ways(n-1) + ways(n-2)
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int climbStairs(int n) {
        // Base cases
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // Recursive case: ways(n) = ways(n-1) + ways(n-2)
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    // Base cases
    if (n === 1) return 1;
    if (n === 2) return 2;
    
    // Recursive case: ways(n) = ways(n-1) + ways(n-2)
    return climbStairs(n - 1) + climbStairs(n - 2);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n) - Exponential due to repeated calculations |
| **Space** | O(n) - Recursion stack depth |
| **Problem** | Severely inefficient for n > 40 |

The recursive solution recalculates the same subproblems many times. For example, `climbStairs(5)` calculates:
- `climbStairs(4)` and `climbStairs(3)`
- `climbStairs(4)` calculates `climbStairs(3)` and `climbStairs(2)`
- `climbStairs(3)` calculates `climbStairs(2)` and `climbStairs(1)`

This leads to a tree of exponential size.

---

## Approach 2: Memoization (Top-down DP)

### Algorithm

Memoization stores previously computed results to avoid redundant calculations. We use an array or hash map to cache results.

### Code Implementation

````carousel
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        Calculate the number of ways to climb n stairs using memoization.
        
        Args:
            n: Number of stairs
            
        Returns:
            Number of distinct ways to reach the top
        """
        memo = {}
        
        def dp(i: int) -> int:
            # Base cases
            if i == 1:
                return 1
            if i == 2:
                return 2
            
            # Check if already computed
            if i in memo:
                return memo[i]
            
            # Compute and cache
            memo[i] = dp(i - 1) + dp(i - 2)
            return memo[i]
        
        return dp(n)
```

<!-- slide -->
```cpp
class Solution {
private:
    unordered_map<int, int> memo;
    
    int dp(int n) {
        // Base cases
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // Check if already computed
        if (memo.find(n) != memo.end()) {
            return memo[n];
        }
        
        // Compute and cache
        memo[n] = dp(n - 1) + dp(n - 2);
        return memo[n];
    }
    
public:
    int climbStairs(int n) {
        return dp(n);
    }
};
```

<!-- slide -->
```java
class Solution {
    private int[] memo;
    
    private int dp(int n) {
        // Base cases
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // Check if already computed
        if (memo[n] != 0) {
            return memo[n];
        }
        
        // Compute and cache
        memo[n] = dp(n - 1) + dp(n - 2);
        return memo[n];
    }
    
    public int climbStairs(int n) {
        memo = new int[n + 1];
        return dp(n);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    const memo = new Map();
    
    function dp(i) {
        // Base cases
        if (i === 1) return 1;
        if (i === 2) return 2;
        
        // Check if already computed
        if (memo.has(i)) {
            return memo.get(i);
        }
        
        // Compute and cache
        const result = dp(i - 1) + dp(i - 2);
        memo.set(i, result);
        return result;
    }
    
    return dp(n);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each subproblem computed once |
| **Space** | O(n) - Memoization cache + recursion stack |
| **Improvement** | Dramatic reduction from exponential to linear |

---

## Approach 3: Tabulation (Bottom-up DP)

### Algorithm

Tabulation builds the solution iteratively from the bottom up, starting from base cases and working toward the target.

### Code Implementation

````carousel
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        Calculate the number of ways to climb n stairs using tabulation.
        
        Args:
            n: Number of stairs
            
        Returns:
            Number of distinct ways to reach the top
        """
        if n == 1:
            return 1
        if n == 2:
            return 2
        
        # dp[i] = number of ways to reach step i
        dp = [0] * (n + 1)
        dp[1] = 1
        dp[2] = 2
        
        for i in range(3, n + 1):
            dp[i] = dp[i - 1] + dp[i - 2]
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // dp[i] = number of ways to reach step i
        vector<int> dp(n + 1);
        dp[1] = 1;
        dp[2] = 2;
        
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // dp[i] = number of ways to reach step i
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    
    // dp[i] = number of ways to reach step i
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through 1 to n |
| **Space** | O(n) - DP array of size n+1 |

---

## Approach 4: Space-optimized DP

### Algorithm

Notice that `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`. We can optimize space by keeping only the last two values.

### Code Implementation

````carousel
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        Calculate the number of ways to climb n stairs with O(1) space.
        
        Args:
            n: Number of stairs
            
        Returns:
            Number of distinct ways to reach the top
        """
        if n == 1:
            return 1
        if n == 2:
            return 2
        
        # Only keep track of the last two values
        prev2 = 1  # dp[1]
        prev1 = 2  # dp[2]
        
        for i in range(3, n + 1):
            current = prev1 + prev2
            prev2, prev1 = prev1, current
        
        return prev1
```

<!-- slide -->
```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // Only keep track of the last two values
        int prev2 = 1;  // dp[1]
        int prev1 = 2;  // dp[2]
        int current;
        
        for (int i = 3; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        // Only keep track of the last two values
        int prev2 = 1;  // dp[1]
        int prev1 = 2;  // dp[2]
        int current;
        
        for (int i = 3; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    
    // Only keep track of the last two values
    let prev2 = 1;  // dp[1]
    let prev1 = 2;  // dp[2]
    let current;
    
    for (let i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass |
| **Space** | O(1) - Constant space (only 3 variables) |
| **Best For** | Production code with large n |

---

## Approach 5: Matrix Exponentiation (Advanced)

### Algorithm

The recurrence `F(n) = F(n-1) + F(n-2)` can be represented as matrix multiplication:

```
| F(n)   |   | 1  1 |   | F(n-1) |
| F(n-1) | = | 1  0 | * | F(n-2) |
```

This allows us to compute F(n) in O(log n) time using exponentiation by squaring.

### Mathematical Derivation

```
| F(n)   |   | 1  1 |^(n-1)   | F(1) |
| F(n-1) | = | 1  0 |      * | F(0) |
```

Where F(1) = 1, F(2) = 2, F(0) = 1

### Code Implementation

````carousel
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        Calculate the number of ways to climb n stairs using matrix exponentiation.
        O(log n) time complexity.
        
        Args:
            n: Number of stairs
            
        Returns:
            Number of distinct ways to reach the top
        """
        def matrix_multiply(A, B):
            """Multiply two 2x2 matrices."""
            return [
                [A[0][0] * B[0][0] + A[0][1] * B[1][0], 
                 A[0][0] * B[0][1] + A[0][1] * B[1][1]],
                [A[1][0] * B[0][0] + A[1][1] * B[1][0], 
                 A[1][0] * B[0][1] + A[1][1] * B[1][1]]
            ]
        
        def matrix_power(matrix, power):
            """Raise a 2x2 matrix to a power using exponentiation by squaring."""
            # Identity matrix
            result = [[1, 0], [0, 1]]
            base = matrix
            
            while power > 0:
                if power % 2 == 1:
                    result = matrix_multiply(result, base)
                base = matrix_multiply(base, base)
                power //= 2
            
            return result
        
        if n == 1:
            return 1
        if n == 2:
            return 2
        
        # Transformation matrix
        T = [[1, 1], [1, 0]]
        
        # Compute T^(n-2) and multiply by [F(2), F(1)]
        T_power = matrix_power(T, n - 2)
        
        # F(n) = T^(n-2)[0][0] * F(2) + T^(n-2)[0][1] * F(1)
        return T_power[0][0] * 2 + T_power[0][1] * 1
```

<!-- slide -->
```cpp
class Solution {
private:
    vector<vector<long long>> multiply(const vector<vector<long long>>& A, 
                                       const vector<vector<long long>>& B) {
        vector<vector<long long>> C(2, vector<long long>(2, 0));
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 2; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C;
    }
    
    vector<vector<long long>> power(vector<vector<long long>> matrix, int n) {
        vector<vector<long long>> result = {{1, 0}, {0, 1}};
        while (n > 0) {
            if (n % 2 == 1) {
                result = multiply(result, matrix);
            }
            matrix = multiply(matrix, matrix);
            n /= 2;
        }
        return result;
    }
    
public:
    int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        vector<vector<long long>> T = {{1, 1}, {1, 0}};
        vector<vector<long long>> T_power = power(T, n - 2);
        
        // F(n) = T^(n-2)[0][0] * F(2) + T^(n-2)[0][1] * F(1)
        return T_power[0][0] * 2 + T_power[0][1] * 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    private long[][] multiply(long[][] A, long[][] B) {
        long[][] C = new long[2][2];
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 2; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C;
    }
    
    private long[][] power(long[][] matrix, int n) {
        long[][] result = {{1, 0}, {0, 1}};
        while (n > 0) {
            if (n % 2 == 1) {
                result = multiply(result, matrix);
            }
            matrix = multiply(matrix, matrix);
            n /= 2;
        }
        return result;
    }
    
    public int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        long[][] T = {{1, 1}, {1, 0}};
        long[][] T_power = power(T, n - 2);
        
        // F(n) = T^(n-2)[0][0] * F(2) + T^(n-2)[0][1] * F(1)
        return (int)(T_power[0][0] * 2 + T_power[0][1] * 1);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    function multiply(A, B) {
        const C = [[0, 0], [0, 0]];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C;
    }
    
    function power(matrix, power) {
        const result = [[1, 0], [0, 1]];
        while (power > 0) {
            if (power % 2 === 1) {
                result = multiply(result, matrix);
            }
            matrix = multiply(matrix, matrix);
            power = Math.floor(power / 2);
        }
        return result;
    }
    
    if (n === 1) return 1;
    if (n === 2) return 2;
    
    const T = [[1, 1], [1, 0]];
    const T_power = power(T, n - 2);
    
    // F(n) = T^(n-2)[0][0] * F(2) + T^(n-2)[0][1] * F(1)
    return T_power[0][0] * 2 + T_power[0][1] * 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Exponentiation by squaring |
| **Space** | O(1) - Constant space for matrices |
| **Use Case** | Very large n (beyond typical constraints) |

---

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **Recursive** | O(2^n) | O(n) | Simple, intuitive | Extremely slow |
| **Memoization** | O(n) | O(n) | Efficient, readable | Needs extra space |
| **Tabulation** | O(n) | O(n) | Iterative, no recursion limit | O(n) space |
| **Space-optimized** | O(n) | O(1) | Optimal space | Slightly less intuitive |
| **Matrix Exponentiation** | O(log n) | O(1) | Fastest for large n | Complex implementation |

**Recommendation:** Use the space-optimized DP approach for most cases—it's efficient and easy to understand.

---

## Explanation

### Why This Problem is Fibonacci

The climbing stairs problem is essentially the Fibonacci sequence with slightly different starting values:

| Stairs (n) | Ways | Fibonacci (F) |
|------------|------|---------------|
| 1 | 1 | F(1) = 1 |
| 2 | 2 | F(2) = 2 |
| 3 | 3 | F(3) = 3 |
| 4 | 5 | F(4) = 5 |
| 5 | 8 | F(5) = 8 |
| 6 | 13 | F(6) = 13 |

The relationship: `ways(n) = ways(n-1) + ways(n-2)`

This is because to reach step `n`:
- You must have been at step `n-1` and taken 1 step, OR
- You must have been at step `n-2` and taken 2 steps

### Key Insights

1. **Overlapping Subproblems**: The same subproblems are solved multiple times in the naive recursive approach
2. **Optimal Substructure**: The solution to the larger problem depends on solutions to smaller problems
3. **Space-Time Trade-off**: We can reduce time complexity by trading space (memoization/tabulation)

### Visualizing the Recursion Tree

For n = 5:
```
                    f(5)
                   /    \
                f(4)    f(3)
               /   \    /   \
            f(3)  f(2) f(2)  f(1)
            /   \
         f(2)  f(1)
```

Notice how `f(3)` is calculated twice, `f(2)` three times, and `f(1)` twice. Memoization eliminates these redundant calculations.

---

## Followup Questions

### Q1: How would you modify the solution if you could climb 1, 2, or 3 steps?

**Answer:** The recurrence becomes `ways(n) = ways(n-1) + ways(n-2) + ways(n-3)`. You would:
- Add a third base case: `ways(3) = 4` (1+1+1, 1+2, 2+1, 3)
- Include all three terms in the recurrence
- Update all DP approaches to account for the third predecessor

### Q2: How would you count ways with minimum number of moves?

**Answer:** The minimum number of moves is always `ceil(n/2)` (using as many 2-steps as possible). If you want to count only those ways:
- Only count combinations where `2-steps + 1-steps = n` and `2-steps` is maximized
- This becomes a combinatorial problem: C(k, n-k) where k = floor(n/2)

### Q3: How would you reconstruct all valid paths?

**Answer:** Instead of just counting, store the actual paths:
- Use backtracking to generate all sequences
- Each sequence is a list of step sizes (1 or 2)
- Time complexity is O(2^n) in worst case (exponential output)

### Q4: What's the relationship between climbing stairs and binomial coefficients?

**Answer:** For n stairs with k 2-steps (and n-2k 1-steps):
- Number of ways = C(k + n-2k, k) = C(n-k, k)
- Sum over all valid k (where 2k ≤ n)

For example, n=4:
- k=0: C(4,0)=1 (1+1+1+1)
- k=1: C(3,1)=3 (2+1+1, 1+2+1, 1+1+2)
- k=2: C(2,2)=1 (2+2)
- Total: 1+3+1=5

### Q5: How would you solve this for a variable number of allowed steps?

**Answer:** Generalize the recurrence:
- Let `steps[]` be the allowed step sizes
- `ways(n) = sum(ways(n - s))` for all s in steps where n-s ≥ 0
- The DP approaches remain the same, just iterate through allowed steps

### Q6: Can you use combinatorics to solve this directly?

**Answer:** Yes! For n stairs with k 2-steps:
- You need exactly k 2-steps and (n-2k) 1-steps
- Total steps: k + (n-2k) = n-k
- Number of arrangements: C(n-k, k)

The answer is the sum of binomial coefficients: `sum(C(n-k, k))` for k=0 to floor(n/2)

### Q7: How would you handle large n where the answer exceeds 32-bit?

**Answer:** Use:
- Python's arbitrary precision integers
- Java's BigInteger class
- C++'s boost::multiprecision or string manipulation
- JavaScript's BigInt type

### Q8: What's the space-optimized solution for k-step climbing?

**Answer:** Maintain a sliding window of size k:
```python
def climbStairs(n, k):
    if n < k: return n + 1
    dp = [0] * (k + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        dp[i % k] = sum(dp[(i - j) % k] for j in range(1, k + 1) if i >= j)
    return dp[n % k]
```

---

## Related Problems

- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) - The classic Fibonacci problem
- [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) - DP with costs
- [Climbing Stairs with Minimum Moves](https://leetcode.com/problems/climbing-stairs/) - Variant with constraints
- [N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/) - Extended recurrence
- [House Robber](https://leetcode.com/problems/house-robber/) - Similar DP pattern
- [Decode Ways](https://leetcode.com/problems/decode-ways/) - String interpretation problem
- [Fibonacci in O(log n)](https://leetcode.com/problems/fibonacci-number/) - Matrix exponentiation approach

---

## Video Tutorials

- [Climbing Stairs - LeetCode 70](.com/watch?v=Yhttps://www.youtube0lT9Fck2qI)
- [Dynamic Programming - Climbing Stairs Explained](https://www.youtube.com/watch?v=0bEN5i4kUu8)
- [Fibonacci Sequence and Climbing Stairs](https://www.youtube.com/watch?v=qRnNdEExS2k)
- [Matrix Exponentiation for Fibonacci](https://www.youtube.com/watch?v=EEbY9sE8WKo)

---

## Summary

The Climbing Stairs problem is a classic introduction to dynamic programming. Key takeaways:

1. **Recognize patterns**: The problem is Fibonacci in disguise
2. **Avoid naive recursion**: It leads to exponential time
3. **Use DP**: Either memoization or tabulation for O(n) time
4. **Optimize space**: Keep only the last two values for O(1) space
5. **Understand the math**: The recurrence emerges from the problem structure

The space-optimized bottom-up DP is the recommended solution for interviews and production code.
