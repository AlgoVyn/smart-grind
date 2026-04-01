## Catalan Numbers: Tactics & Tricks

What are the essential tactics for recognizing and solving Catalan-related problems?

<!-- front -->

---

### Tactic 1: Recognition Patterns

| Pattern | Check For | Confirm By |
|---------|-----------|------------|
| **Recurrence** | Sum of products Cᵢ×Cₙ₋ᵢ | Small cases match 1,1,2,5,14 |
| **Bijection** | Parentheses, trees, paths | Map to known Catalan structure |
| **Non-crossing** | Geometric non-intersection | Triangulation, matching |
| **First return** | Decomposition at first return | Recursive split |

**Test sequence:** Generate small cases, check if 1, 1, 2, 5, 14, 42, 132...

---

### Tactic 2: Recurrence to Solution

When recurrence matches Cₙ = Σ CᵢCₙ₋ᵢ:

```python
def solve_catalan_structure(n):
    """Generic template for Catalan-like DP"""
    dp = [0] * (n + 1)
    dp[0] = 1  # Base case
    
    for i in range(1, n + 1):
        for j in range(i):
            # Split at position j
            # Left part: j elements → dp[j]
            # Right part: i-1-j elements → dp[i-1-j]
            dp[i] += dp[j] * dp[i - 1 - j]
    
    return dp[n]

# Optimize to O(n) if possible using closed form
```

---

### Tactic 3: Bijection Proof Technique

To prove count is Catalan, show bijection with known Catalan object:

```
1. Define mapping from your objects to known Catalan objects
2. Show mapping is one-to-one (injective)
3. Show mapping is onto (surjective)
4. Conclude: |your objects| = Cₙ

Common bijections:
- Binary trees ↔ Parentheses (inorder traversal)
- Triangulations ↔ Binary trees (dual graph)
- Dyck paths ↔ Parentheses (up='(', down=')')
```

---

### Tactic 4: Modulo Handling

For large n in competitive programming:

```python
MOD = 10**9 + 7

def catalan_precompute(max_n, mod):
    """Precompute all Catalan numbers up to max_n"""
    catalan = [0] * (max_n + 1)
    catalan[0] = 1
    
    for n in range(max_n):
        # C(n+1) = C(n) * 2*(2n+1) / (n+2)
        # Use modular inverse for division
        catalan[n + 1] = catalan[n] * 2 * (2 * n + 1) % mod
        catalan[n + 1] = catalan[n + 1] * pow(n + 2, mod - 2, mod) % mod
    
    return catalan

# Precompute once, answer queries in O(1)
```

---

### Tactic 5: Generating Function Approach

Catalan generating function:
```
C(x) = Σ Cₙxⁿ = 1 + xC(x)²

Solving: C(x) = (1 - √(1-4x)) / 2x
```

**Application:** Extract coefficients for asymptotics or identities

**Common identity:**
```
Cₙ = C(2n,n) - C(2n, n+1) = C(2n,n) / (n+1)
Sum of Cᵢ from i=0 to n = C(n+1, n) - 1  (hockey-stick)
```

<!-- back -->
