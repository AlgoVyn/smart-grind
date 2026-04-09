## DP - Fibonacci Style: Framework

What is the complete code template for Fibonacci-style DP?

<!-- front -->

---

### Framework 1: Fibonacci with Space Optimization

```
┌─────────────────────────────────────────────────────┐
│  FIBONACCI-STYLE DP - TEMPLATE                         │
├─────────────────────────────────────────────────────┤
│  Key: Only need last k states, use O(1) space          │
│                                                        │
│  1. Handle base cases (n <= 1)                       │
│  2. Initialize:                                       │
│     prev2 = base_case_0                               │
│     prev1 = base_case_1                               │
│                                                        │
│  3. For i from 2 to n:                                 │
│     current = f(prev1, prev2)  // state transition    │
│     prev2 = prev1                                     │
│     prev1 = current                                   │
│                                                        │
│  4. Return prev1                                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Fibonacci

```python
def fibonacci(n):
    """
    Calculate nth Fibonacci number.
    Time: O(n), Space: O(1)
    """
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    
    for _ in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

---

### Implementation: Climbing Stairs

```python
def climb_stairs(n):
    """
    Number of ways to climb n stairs (1 or 2 steps).
    LeetCode 70
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2  # Ways to reach 1 and 2 stairs
    
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

---

### Key Pattern Elements

| Variable | Purpose | Initial Value |
|----------|---------|---------------|
| `prev2` | f(n-2) | base case 0 |
| `prev1` | f(n-1) | base case 1 |
| `current` | f(n) | computed |

<!-- back -->
