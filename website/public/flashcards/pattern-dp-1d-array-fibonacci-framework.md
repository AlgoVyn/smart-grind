## DP - 1D Array Fibonacci: Framework

What is the complete code template for solving Fibonacci-style DP problems?

<!-- front -->

---

### Framework: Fibonacci-Style DP

```
┌─────────────────────────────────────────────────────────────┐
│  FIBONACCI-STYLE DP - TEMPLATE                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: State depends on fixed number of prev states  │
│                                                             │
│  1. Define base cases:                                      │
│     - dp[0], dp[1] (or prev2, prev1 for space opt)          │
│                                                             │
│  2. State transition (typical):                            │
│     - dp[i] = dp[i-1] + dp[i-2]  (counting ways)            │
│     - dp[i] = max(dp[i-1], dp[i-2] + val)  (optimization)    │
│                                                             │
│  3. Space optimized (O(1)):                                  │
│     - prev2, prev1 = base cases                             │
│     - for i in range(2, n+1):                              │
│         current = f(prev1, prev2, i)                        │
│         prev2 = prev1                                       │
│         prev1 = current                                     │
│     - return prev1                                          │
│                                                             │
│  4. Full array (O(n)) - when path needed:                    │
│     - dp = [0] * (n + 1)                                    │
│     - fill iteratively                                      │
│     - backtrack if needed                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Space Optimized (O(1))

```python
def fibonacci_space_optimized(n: int) -> int:
    """
    Classic Fibonacci with O(1) space.
    Pattern: dp[i] = dp[i-1] + dp[i-2]
    """
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    prev2 = 0  # F(i-2)
    prev1 = 1  # F(i-1)
    
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


def climbing_stairs(n: int) -> int:
    """
    Count ways to climb n stairs (1 or 2 steps).
    Shifted Fibonacci: f(n) = f(n-1) + f(n-2)
    """
    if n <= 2:
        return n
    
    prev2 = 1  # 1 way to climb 1 stair
    prev1 = 2  # 2 ways to climb 2 stairs
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


def house_robber(nums: list) -> int:
    """
    Max money without robbing adjacent houses.
    Pattern: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = 0
    prev1 = nums[0]
    
    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

---

### Implementation: Full Array (for Path Reconstruction)

```python
def fibonacci_with_path(n: int):
    """
    Returns value and full DP array for analysis.
    """
    if n == 0:
        return 0, [0]
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n], dp


def house_robber_with_selection(nums: list):
    """
    Returns max money AND which houses to rob.
    """
    if not nums:
        return 0, []
    
    n = len(nums)
    dp = [0] * (n + 1)
    dp[1] = nums[0]
    
    for i in range(2, n + 1):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])
    
    # Backtrack to find robbed houses
    houses = []
    i = n
    while i >= 1:
        if dp[i] == dp[i - 1]:
            i -= 1  # Didn't rob house i-1
        else:
            houses.append(i - 1)
            i -= 2
    
    return dp[n], houses[::-1]
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `prev2`, `prev1` | Track last 2 states | `prev2=F(i-2), prev1=F(i-1)` |
| Base cases | Starting values | `dp[0]=0, dp[1]=1` |
| `current` | Compute new state | `current = prev1 + prev2` |
| Variable rotation | Shift for next iteration | `prev2, prev1 = prev1, current` |
| Loop range | Iterate through states | `range(2, n+1)` for Fibonacci |

<!-- back -->
