## Catalan Numbers: Problem-Solving Tactics

What are the key tactics for recognizing and solving Catalan number problems?

<!-- front -->

---

### Tactic 1: Pattern Recognition Checklist

**Ask these questions:**

| Question | Catalan? |
|----------|----------|
| Does it involve valid/nested structures? | ✓ Likely |
| Can I pick a "first" element that splits the problem? | ✓ Likely |
| Are left and right parts independent? | ✓ Likely |
| Do I multiply solutions of subproblems? | ✓ Likely |
| Is it about counting tree-like structures? | ✓ Likely |
| Do I sum across all split points? | ✓ Likely |

**If 4+ ✓ → Strong Catalan candidate**

---

### Tactic 2: Small Case Verification

**Always verify with n = 0, 1, 2, 3:**

```python
# Expected: 1, 1, 2, 5, 14, ...
# If your recurrence gives these values, you're likely correct!

def verify_catalan():
    expected = [1, 1, 2, 5, 14, 42, 132]
    # Test your implementation
    for i, exp in enumerate(expected):
        got = your_catalan(i)
        assert got == exp, f"Failed at C({i}): got {got}, expected {exp}"
```

---

### Tactic 3: Index Mapping for Different Problems

| Problem | dp[i] represents | Left | Right |
|---------|-----------------|------|-------|
| General Catalan | C(i) | j | i-1-j |
| Unique BSTs | trees with i nodes | root-1 | i-root |
| Parentheses | valid strings with i pairs | k | i-1-k |
| Triangulation | n-gon splits | k+1 | i-k |

**Key:** Adjust indices based on problem structure.

---

### Tactic 4: Space Optimization

**When to use mathematical formula:**

```python
# Use when you ONLY need C(n), not the sequence
from math import comb

def catalan_math(n):
    """O(n) time, O(1) space"""
    return comb(2 * n, n) // (n + 1)

# vs DP approach

def catalan_dp(n):
    """O(n²) time, O(n) space - but gives all values"""
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    return dp[n]  # Can return entire dp array if needed
```

**Decision:** Need sequence? → DP. Just C(n)? → Math formula.

---

### Tactic 5: Handling Large Numbers

```python
# With modulo (common in contests)
MOD = 10**9 + 7

def catalan_mod(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(i):
            dp[i] = (dp[i] + dp[j] * dp[i - 1 - j]) % MOD
    return dp[n]

# Precompute factorials for math formula with mod
def precompute_factorials(n, mod):
    fact = [1] * (2 * n + 1)
    for i in range(1, 2 * n + 1):
        fact[i] = fact[i - 1] * i % mod
    return fact
```

---

### Tactic 6: Debugging Common Errors

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Wrong for n=0,1 | Wrong base cases | Ensure C(0)=C(1)=1 |
| Too small by 1 | Loop bounds | Check inner loop range |
| Integer overflow | n > 15 | Use long long / modulo |
| Wrong pattern | Not Catalan | Verify with small cases |

<!-- back -->
