## DP - 1D Array (Fibonacci Style): Tactics

What are the key implementation tactics and strategies for Fibonacci-style DP problems?

<!-- front -->

---

### Tactic 1: Space Optimization Decision Tree

```
Need to reconstruct path?
├── YES → Use full DP array O(n)
│   └── Enables backtracking to find choices made
│
└── NO → Can optimize to O(1) or O(k)
    └── Only need final value?
        ├── YES → Use O(1) space with variables
        └── Need last k states? → Use circular buffer
```

**Circular Buffer for k-state dependency:**
```python
from collections import deque

def tribonacci_optimized(n):
    if n == 0: return 0
    if n <= 2: return 1
    
    dq = deque([0, 1, 1])  # Last 3 states
    for i in range(3, n + 1):
        current = sum(dq)
        dq.append(current)
        dq.popleft()
    
    return dq[-1]
```

---

### Tactic 2: Base Case Setup

**Common patterns:**

```python
# Pattern 1: Zero-based with dp[0]
dp = [0] * (n + 1)
dp[0] = 0  # Base
dp[1] = 1  # Base

# Pattern 2: Problem-defined bases (Climbing Stairs)
if n <= 2:
    return n  # dp[1]=1, dp[2]=2

# Pattern 3: Array input bases (House Robber)
if not nums: return 0
if len(nums) == 1: return nums[0]
prev2, prev1 = nums[0], max(nums[0], nums[1])
```

---

### Tactic 3: Transition Function Design

**Counting ways (additive):**
```python
# Ways to reach i (can take 1 or 2 steps)
dp[i] = dp[i-1] + dp[i-2]
```

**Optimization (max/min):**
```python
# House Robber: max money at i
dp[i] = max(dp[i-1],           # Skip house i
            dp[i-2] + nums[i])  # Rob house i
```

**With constraints:**
```python
# Decode ways: valid if s[i-2:i] forms 10-26
dp[i] = dp[i-1] if s[i-1] != '0' else 0
dp[i] += dp[i-2] if 10 <= int(s[i-2:i]) <= 26 else 0
```

---

### Tactic 4: Modulo Handling for Large Numbers

```python
MOD = 10**9 + 7

# Apply modulo at each computation
dp[i] = (dp[i-1] + dp[i-2]) % MOD

# For subtraction (add MOD before taking %)
dp[i] = (dp[i-1] - dp[i-2] + MOD) % MOD
```

---

### Tactic 5: Debugging with Full Array

```python
def fib_with_debug(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
        print(f"dp[{i}] = {dp[i-1]} + {dp[i-2]} = {dp[i]}")
    
    print(f"Full DP array: {dp}")
    return dp[n]

# Use during development, switch to optimized for submission
```

---

### Tactic 6: Edge Case Handling

```python
# Always handle these cases first:
if n < 0: return 0
if n == 0: return base_case_0
if n == 1: return base_case_1
if not array: return 0
if len(array) == 1: return array[0]
```

**Common off-by-one errors:**
- Array size: `n` vs `n+1` for 0-indexed with dp[0]
- Loop bounds: `range(2, n)` vs `range(2, n+1)`
- Final answer: `dp[n]` vs `dp[n-1]` vs `prev1`

<!-- back -->
