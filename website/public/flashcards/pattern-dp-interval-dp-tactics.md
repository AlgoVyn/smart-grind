## DP - Interval DP: Tactics

What are the advanced techniques for Interval DP problems?

<!-- front -->

---

### Tactic 1: Add Virtual Boundaries

```python
def max_coins(nums):
    """
    Add virtual balloons with value 1 at boundaries.
    This simplifies edge handling.
    """
    n = len(nums)
    balloons = [1] + nums + [1]  # Virtual boundaries
    
    # Now we can always access balloons[left-1] and balloons[right+1]
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    
    for length in range(1, n + 1):
        for left in range(1, n - length + 2):
            right = left + length - 1
            for k in range(left, right + 1):
                coins = balloons[left - 1] * balloons[k] * balloons[right + 1]
                coins += dp[left][k - 1] + dp[k + 1][right]
                dp[left][right] = max(dp[left][right], coins)
    
    return dp[1][n]
```

**Key insight:** Virtual boundaries eliminate special cases for edges.

---

### Tactic 2: Precompute Palindromes

```python
def min_cut(s):
    """
    Precompute palindrome table for O(n²) solution.
    """
    n = len(s)
    
    # Precompute: is_pal[i][j] = True if s[i:j+1] is palindrome
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True
    
    # Now use precomputed table in DP
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

**Key insight:** Precomputation can reduce O(n³) to O(n²).

---

### Tactic 3: Memoization for Sparse States

```python
from functools import lru_cache

def interval_dp_memoization(arr):
    """
    Use memoization when many subproblems are not needed.
    """
    n = len(arr)
    
    @lru_cache(maxsize=None)
    def solve(i, j):
        if i > j:
            return 0
        if i == j:
            return base_value(i)
        
        best = float('inf')
        for k in range(i, j):
            left = solve(i, k)
            right = solve(k + 1, j)
            cost = compute_cost(i, k, j)
            best = min(best, left + right + cost)
        
        return best
    
    return solve(0, n - 1)
```

**When to use:** When recursive thinking is clearer or many states are unused.

---

### Tactic 4: Handle Circular Arrays

```python
def interval_dp_circular(arr):
    """
    For circular arrays, try all possible starting points
    or duplicate the array.
    """
    n = len(arr)
    
    # Method 1: Try all starting points
    best = float('inf')
    for start in range(n):
        # Solve for linear array from start
        rotated = arr[start:] + arr[:start]
        result = solve_linear(rotated)
        best = min(best, result)
    
    # Method 2: Duplicate array (for some problems)
    doubled = arr + arr
    # Solve on doubled array with constraint that interval length <= n
    
    return best
```

---

### Tactic 5: Path Reconstruction

```python
def interval_dp_with_path(arr):
    """
    Store choices to reconstruct the actual sequence.
    """
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    choice = [[-1] * n for _ in range(n)]  # Store split points
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + compute_cost(i, k, j)
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    choice[i][j] = k  # Remember best split point
    
    # Backtrack to reconstruct path
    def reconstruct(i, j):
        if i >= j:
            return []
        k = choice[i][j]
        return [(i, k, j)] + reconstruct(i, k) + reconstruct(k + 1, j)
    
    return dp[0][n - 1], reconstruct(0, n - 1)
```

---

### Tactic 6: Space Optimization (Rare)

```python
def interval_dp_space_optimized(arr):
    """
    For some problems, only need previous length intervals.
    Space can be reduced from O(n²) to O(n).
    """
    n = len(arr)
    # Only store intervals of the previous length
    prev = [0] * n  # dp for length - 1
    curr = [0] * n  # dp for current length
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            curr[i] = float('inf')
            for k in range(i, j):
                # Need to access dp[i][k] and dp[k+1][j]
                # This only works if we can compute from prev
                pass
        prev, curr = curr, prev
    
    return prev[0]
```

**Note:** Space optimization is difficult for general interval DP due to the need for all subintervals.

---

### Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Wrong iteration order | Process large intervals first | Always process by increasing length |
| Off-by-one in bounds | Index errors | Be consistent with [i,j] vs [i,j) |
| Not initializing base cases | Wrong results | Set dp[i][i] explicitly |
| Wrong split range | Missing or extra splits | k in range(i, j) for [i,k] and [k+1,j] |
| Integer overflow | Large intermediate values | Use long or check constraints |

<!-- back -->
