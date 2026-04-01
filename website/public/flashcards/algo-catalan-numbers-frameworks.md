## Catalan Numbers: Algorithm Framework

What are the different methods for computing Catalan numbers efficiently?

<!-- front -->

---

### Direct Formula

```python
def catalan_direct(n):
    """
    C(n) = (2n)! / ((n+1)! * n!)
    = C(2n, n) / (n+1)
    """
    from math import comb
    return comb(2 * n, n) // (n + 1)

# Time: O(n) using efficient comb
# Space: O(1)
```

**Warning:** Factorials grow fast; use modular arithmetic for large n.

---

### Dynamic Programming

```python
def catalan_dp(n):
    """O(n²) time, O(n) space"""
    if n <= 1:
        return 1
    
    catalan = [0] * (n + 1)
    catalan[0] = catalan[1] = 1
    
    for i in range(2, n + 1):
        catalan[i] = 0
        for j in range(i):
            catalan[i] += catalan[j] * catalan[i - 1 - j]
    
    return catalan[n]

# Full table useful for multiple queries
def catalan_dp_table(n):
    catalan = [0] * (n + 1)
    catalan[0] = 1
    
    for i in range(1, n + 1):
        for j in range(i):
            catalan[i] += catalan[j] * catalan[i - 1 - j]
    
    return catalan  # Returns all C₀ to Cₙ
```

---

### Recurrence Relation (O(n))

```python
def catalan_iterative(n):
    """O(n) using recurrence: C(n+1) = C(n) * 2*(2n+1) / (n+2)"""
    if n <= 1:
        return 1
    
    result = 1
    for i in range(n):
        result = result * 2 * (2 * i + 1) // (i + 2)
    
    return result

# Derivation:
# C(n+1) / C(n) = [C(2n+2, n+1) / (n+2)] / [C(2n, n) / (n+1)]
#               = (2(2n+1) / (n+2))
```

---

### Modular Arithmetic

For competitive programming with large n:

```python
def catalan_mod(n, mod):
    """C(n) mod prime, using modular inverse"""
    # C(2n, n) * inv(n+1) mod MOD
    
    # Precompute factorials and inverse factorials
    fact = [1] * (2 * n + 1)
    for i in range(1, 2 * n + 1):
        fact[i] = fact[i-1] * i % mod
    
    # Fermat's little theorem for inverse: a^(p-2) ≡ a^(-1) (mod p)
    def mod_inv(a, m):
        return pow(a, m - 2, m)
    
    c_2n_n = fact[2*n] * mod_inv(fact[n] * fact[n] % mod, mod) % mod
    return c_2n_n * mod_inv(n + 1, mod) % mod
```

---

### Comparison Table

| Method | Time | Space | Use Case |
|--------|------|-------|----------|
| **Direct** | O(n) | O(1) | Single query, n small |
| **DP with table** | O(n²) | O(n) | Multiple queries |
| **Iterative recurrence** | O(n) | O(1) | Single query, large n |
| **Modular** | O(n) | O(n) | Large n, prime mod |

<!-- back -->
