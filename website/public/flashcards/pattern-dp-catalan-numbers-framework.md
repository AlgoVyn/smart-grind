## Catalan Numbers: Algorithm Framework

What is the DP implementation structure for Catalan numbers, and how do you apply it to problems?

<!-- front -->

---

### DP Algorithm Template

```python
def catalan_dp(n):
    """
    Calculate nth Catalan number using DP.
    Time: O(n²), Space: O(n)
    """
    if n <= 1:
        return 1
    
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1  # Base cases
    
    for i in range(2, n + 1):
        for j in range(i):
            # C(i) += C(j) × C(i-1-j)
            dp[i] += dp[j] * dp[i - 1 - j]
    
    return dp[n]
```

---

### Pattern Application Template (Unique BSTs Example)

```python
def count_unique_structures(n):
    """
    Template for Catalan-like counting problems.
    """
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    
    for size in range(2, n + 1):
        for split in range(1, size + 1):
            left = dp[split - 1]      # Left subproblem
            right = dp[size - split]    # Right subproblem
            dp[size] += left * right    # Multiply independent solutions
    
    return dp[n]
```

---

### Key Components

| Component | Purpose | Value |
|-----------|---------|-------|
| **Base cases** | Starting values | C(0) = C(1) = 1 |
| **Outer loop** | Build solutions bottom-up | i from 2 to n |
| **Inner loop** | Try all split points | j from 0 to i-1 |
| **Recurrence** | Combine subproblems | dp[i] += dp[j] × dp[i-1-j] |

---

### Mathematical Formula (Alternative)

```python
from math import comb

def catalan_math(n):
    """
    Direct formula: C(n) = C(2n, n) / (n + 1)
    Time: O(n), Space: O(1)
    """
    return comb(2 * n, n) // (n + 1)

# Manual calculation (no library)
def catalan_manual(n):
    result = 1
    for i in range(n):
        result = result * (2 * n - i) // (i + 1)
    return result // (n + 1)
```

---

### First 10 Catalan Numbers (Memorize!)

| n | C(n) |
|---|------|
| 0 | 1 |
| 1 | 1 |
| 2 | 2 |
| 3 | 5 |
| 4 | 14 |
| 5 | 42 |
| 6 | 132 |
| 7 | 429 |
| 8 | 1430 |
| 9 | 4862 |

<!-- back -->
