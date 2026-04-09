## DP - 1D Array (Fibonacci Style): Framework

What is the complete framework for solving Fibonacci-style 1D array DP problems?

<!-- front -->

---

### Framework: Fibonacci-Style DP

```
┌─────────────────────────────────────────────────────────────┐
│  1D ARRAY DP (FIBONACCI STYLE) - TEMPLATE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: dp[i] depends on immediate previous states   │
│                                                             │
│  1. Define DP array:                                        │
│     - dp[i] = optimal value for state i                    │
│                                                             │
│  2. Identify base cases:                                    │
│     - dp[0], dp[1] (initial anchor values)                   │
│                                                             │
│  3. State transition/recurrence:                           │
│     - dp[i] = dp[i-1] + dp[i-2]  (counting ways)            │
│     - dp[i] = max(dp[i-1], dp[i-2] + val)  (optimization)   │
│                                                             │
│  4. Build bottom-up:                                        │
│     - for i from first_computed to target:                 │
│         dp[i] = transition(dp, i)                          │
│                                                             │
│  5. Space optimization (when only need final value):       │
│     - Replace array with variables: prev2, prev1           │
│     - current = f(prev1, prev2)                            │
│     - prev2, prev1 = prev1, current  (shift)              │
└─────────────────────────────────────────────────────────────┘
```

---

### Three Implementation Approaches

**Top-down with Memoization:**
```python
def solve_top_down(n, transition_func, base_cases):
    memo = {}
    
    def compute(i):
        if i in memo:
            return memo[i]
        if i in base_cases:
            memo[i] = base_cases[i]
            return memo[i]
        memo[i] = transition_func(memo, i)
        return memo[i]
    
    return compute(n)
```

**Bottom-up Tabulation:**
```python
def solve_tabulation(n, transition_func, base_cases):
    dp = [0] * n
    for i, val in base_cases.items():
        if i < n:
            dp[i] = val
    
    start = max(base_cases.keys()) + 1
    for i in range(start, n):
        dp[i] = transition_func(dp, i)
    
    return dp
```

**Space-Optimized O(1):**
```python
def solve_optimized(n, transition_func, base_values):
    if n <= len(base_values):
        return base_values[n - 1]
    
    prev2, prev1 = base_values[0], base_values[1]
    
    for i in range(len(base_values), n):
        current = transition_func(prev2, prev1, i)
        prev2, prev1 = prev1, current
    
    return prev1
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `dp[i]` | State representation | `dp[i]` = ways to reach step i |
| Base cases | Anchor recurrence | `dp[0] = 0, dp[1] = 1` |
| Transition | Compute current from past | `dp[i] = dp[i-1] + dp[i-2]` |
| `prev2`, `prev1` | Space-optimized tracking | `prev2=F(i-2), prev1=F(i-1)` |
| Variable rotation | Shift for next iteration | `prev2, prev1 = prev1, current` |
| Loop order | Bottom-up computation | `range(2, n+1)` |

---

### Pattern Checklist

- [ ] Does the problem have optimal substructure?
- [ ] Are there overlapping subproblems?
- [ ] Is the state space linear (1D)?
- [ ] Does dp[i] depend on only 1-2 previous states?
- [ ] Can base cases be clearly defined?
- [ ] Is space optimization possible (O(1) vs O(n))?

<!-- back -->
