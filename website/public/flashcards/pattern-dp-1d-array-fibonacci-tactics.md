## DP - 1D Array Fibonacci: Tactics & Tricks

What are the essential tactics for solving Fibonacci-style DP problems?

<!-- front -->

---

### Tactic 1: Variable Swap Pattern

```python
def optimized_fibonacci(n):
    """
    Elegant single-line variable update.
    """
    if n <= 1:
        return n
    
    a, b = 0, 1  # prev2, prev1
    
    for _ in range(2, n + 1):
        # Pythonic way: simultaneous assignment
        a, b = b, a + b
    
    return b


# Works in other languages too:
# Java/C++:
# for (int i = 2; i <= n; i++) {
#     int temp = a + b;
#     a = b;
#     b = temp;
# }
```

**Key:** `a, b = b, a + b` computes both sides first, then assigns.

---

### Tactic 2: Handle Extended Dependencies (Tribonacci+)

```python
def tribonacci(n: int) -> int:
    """
    F(n) = F(n-1) + F(n-2) + F(n-3)
    Pattern extends to any fixed dependency count.
    """
    if n == 0:
        return 0
    if n <= 2:
        return 1
    
    # Track 3 previous values
    prev3, prev2, prev1 = 0, 1, 1
    
    for i in range(3, n + 1):
        current = prev1 + prev2 + prev3
        prev3, prev2, prev1 = prev2, prev1, current
    
    return prev1


def generalized_k_deps(n: int, k: int, base: list) -> int:
    """
    General pattern for k dependencies.
    """
    if n < len(base):
        return base[n]
    
    # Keep last k values in array
    window = base[-k:]  # Last k base cases
    
    for i in range(len(base), n + 1):
        current = sum(window)
        window = window[1:] + [current]  # Slide window
    
    return window[-1]
```

---

### Tactic 3: Circular Array Handling (House Robber II)

```python
def house_robber_circular(nums: list) -> int:
    """
    First and last houses are adjacent (circular).
    Trick: Solve two linear problems.
    """
    if len(nums) == 1:
        return nums[0]
    
    # Case 1: Rob houses [0..n-2] (exclude last)
    # Case 2: Rob houses [1..n-1] (exclude first)
    return max(
        rob_linear(nums[:-1]),   # Exclude last
        rob_linear(nums[1:])     # Exclude first
    )


def rob_linear(nums: list) -> int:
    """Standard linear house robber."""
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1
```

**Key Insight:** Break circular constraint by trying both linear cases.

---

### Tactic 4: Multiple State Tracking

```python
def max_product_subarray(nums: list) -> int:
    """
    Track both max AND min at each step.
    Negative numbers can flip max to min.
    """
    max_so_far = min_so_far = result = nums[0]
    
    for num in nums[1:]:
        # Current num could extend either
        candidates = [num, num * max_so_far, num * min_so_far]
        
        max_so_far = max(candidates)
        min_so_far = min(candidates)
        
        result = max(result, max_so_far)
    
    return result
```

**Pattern:** When sign flips matter, track both extremes.

---

### Tactic 5: Cost-Adjusted DP

```python
def min_cost_climbing_stairs(cost: list) -> int:
    """
    Pay cost to step on a stair.
    Start at step 0 or 1 with no cost.
    """
    n = len(cost)
    
    # dp[i] = min cost to REACH step i
    # Can come from i-1 (pay cost[i-1]) or i-2 (pay cost[i-2])
    
    prev2, prev1 = 0, 0  # dp[0], dp[1]
    
    for i in range(2, n + 1):
        current = min(
            prev1 + cost[i - 1],  # From i-1
            prev2 + cost[i - 2]   # From i-2
        )
        prev2, prev1 = prev1, current
    
    return prev1  # Min cost to reach top (beyond last step)


# With full array (for debugging):
def min_cost_debug(cost: list) -> int:
    n = len(cost)
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 0
    
    for i in range(2, n + 1):
        dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
        print(f"dp[{i}] = min({dp[i-1]}+{cost[i-1]}, {dp[i-2]}+{cost[i-2]}) = {dp[i]}")
    
    return dp[n]
```

---

### Tactic 6: Fast Fibonacci (Matrix Exponentiation)

```python
def matrix_mult(A, B):
    """Multiply two 2x2 matrices."""
    return [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ]

def matrix_pow(M, n):
    """Matrix exponentiation by squaring."""
    if n == 1:
        return M
    if n % 2 == 0:
        half = matrix_pow(M, n // 2)
        return matrix_mult(half, half)
    else:
        return matrix_mult(M, matrix_pow(M, n - 1))

def fibonacci_log_n(n):
    """
    O(log n) Fibonacci using matrix exponentiation.
    [[1,1],[1,0]]^n = [[F(n+1), F(n)],[F(n), F(n-1)]]
    """
    if n <= 1:
        return n
    
    M = [[1, 1], [1, 0]]
    result = matrix_pow(M, n)
    return result[0][1]
```

**Use case:** Very large n (n > 10^6) or many queries.

---

### Tactic 7: Backtracking from DP Array

```python
def climb_stairs_with_path(n: int):
    """
    Return count AND one valid path.
    """
    if n <= 2:
        return n, [1] * n if n > 0 else []
    
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    # Backtrack: prefer larger step (2) if possible
    path = []
    remaining = n
    while remaining > 0:
        if remaining >= 2 and dp[remaining - 2] > 0:
            path.append(2)
            remaining -= 2
        else:
            path.append(1)
            remaining -= 1
    
    return dp[n], path
```

<!-- back -->
