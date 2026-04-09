## Catalan Numbers: Approach Comparison

How do you choose between DP recurrence vs mathematical formula? What about generating vs counting?

<!-- front -->

---

### Approach 1: DP Recurrence

**When to use:** Need the sequence, multiple queries, or building up solution

```python
def catalan_dp(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    
    for i in range(2, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    
    return dp  # Can return entire array
```

| Aspect | Value |
|--------|-------|
| Time | O(n²) |
| Space | O(n) |
| Output | All C(0)...C(n) |
| Best for | Preprocessing, sequence needed |

---

### Approach 2: Mathematical Formula

**When to use:** Just need C(n) once, optimize for speed

```python
from math import comb

def catalan_math(n):
    return comb(2 * n, n) // (n + 1)
```

| Aspect | Value |
|--------|-------|
| Time | O(n) |
| Space | O(1) |
| Output | Only C(n) |
| Best for | Single query, large n |

---

### Comparison Matrix

| Criteria | DP Recurrence | Math Formula |
|----------|--------------|--------------|
| **Time** | O(n²) | O(n) |
| **Space** | O(n) | O(1) |
| **All values** | ✓ Yes | ✗ No |
| **Single C(n)** | ✓ Yes | ✓ Yes |
| **Extensibility** | ✓ Easy to modify | ✗ Fixed formula |
| **Intuition** | ✓ Shows structure | ✗ Black box |
| **Modulo support** | ✓ Easy | ⚠ Needs inverse |

---

### Counting vs Generation

| Task | Approach | Complexity |
|------|----------|------------|
| **Count** (how many?) | DP or Math | O(n²) or O(n) |
| **Generate** (list all) | Backtracking/Recursion | O(n × C(n)) |

**Generate Parentheses Example:**

```python
# Count: O(n²) - just need the number
def count_parentheses(n):
    return catalan_dp(n)

# Generate: O(n × 4ⁿ/√n) - enumerate all valid strings
def generate_parentheses(n):
    result = []
    def backtrack(s, left, right):
        if len(s) == 2 * n:
            result.append(s)
            return
        if left < n: backtrack(s + '(', left + 1, right)
        if right < left: backtrack(s + ')', left, right + 1)
    backtrack('', 0, 0)
    return result
```

---

### Decision Tree

```
Problem asks for Catalan:
│
├── Need just the number C(n)?
│   ├── n is small (< 20) and need all values? → DP
│   └── n is large or single query? → Math formula
│
└── Need to generate/construct all objects?
    ├── Use backtracking/recursion
    └── Time: O(n × C(n)) - can't be faster (must output C(n) items)
```

<!-- back -->
