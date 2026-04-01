## Chinese Remainder: Algorithm Framework

How do you implement the Chinese Remainder Theorem to solve simultaneous congruences?

<!-- front -->

---

### Standard CRT Algorithm

```python
def chinese_remainder(remainders, moduli):
    """
    Solve: x ≡ r[i] (mod m[i]) for all i
    Precondition: all m[i] are pairwise coprime
    
    Returns: smallest non-negative solution
    """
    n = len(remainders)
    
    # Compute product of all moduli
    M = 1
    for m in moduli:
        M *= m
    
    result = 0
    
    for i in range(n):
        # Partial product: M_i = M / m_i
        M_i = M // moduli[i]
        
        # Modular inverse of M_i modulo m_i
        inv = mod_inverse(M_i, moduli[i])
        
        # Add contribution
        result += remainders[i] * M_i * inv
    
    return result % M

def mod_inverse(a, m):
    """Extended Euclidean Algorithm"""
    g, x, _ = extended_gcd(a, m)
    if g != 1:
        raise ValueError("Inverse doesn't exist")
    return (x % m + m) % m

def extended_gcd(a, b):
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return (g, x, y)
```

---

### Step-by-Step Construction

| Step | Formula | What It Does |
|------|---------|--------------|
| Compute M | `∏ mᵢ` | Total modulus range |
| Compute Mᵢ | `M / mᵢ` | Product of all moduli except mᵢ |
| Find inverse | `yᵢ = Mᵢ⁻¹ (mod mᵢ)` | Modular inverse |
| Combine | `Σ (aᵢ × Mᵢ × yᵢ)` | Garner's formula |
| Modulo | `% M` | Unique solution |

---

### Two-Case CRT (Iterative)

```python
def crt_iterative(rems, mods):
    """Build solution incrementally"""
    x = rems[0]  # Current solution
    m = mods[0]  # Current modulus
    
    for i in range(1, len(rems)):
        # Find k such that: x + m*k ≡ rems[i] (mod mods[i])
        # => m*k ≡ (rems[i] - x) (mod mods[i])
        
        diff = (rems[i] - x) % mods[i]
        g = gcd(m, mods[i])
        
        if diff % g != 0:
            return None  # No solution
        
        # Scale down
        m_g = m // g
        mods_i_g = mods[i] // g
        diff_g = diff // g
        
        # Solve: m_g * k ≡ diff_g (mod mods_i_g)
        inv = mod_inverse(m_g % mods_i_g, mods_i_g)
        k = (diff_g * inv) % mods_i_g
        
        # Update solution
        x = x + m * k
        m = m * mods[i] // g  # lcm(m, mods[i])
        x %= m
    
    return x
```

---

### Edge Cases

| Case | Handling |
|------|----------|
| Empty input | Return 0 or raise error |
| Single congruence | Return remainder mod modulus |
| Non-coprime moduli | Use iterative with GCD handling |
| Large numbers | Use Python's big integers or Garner's algorithm |

---

### Complexity Analysis

| Aspect | Complexity |
|--------|------------|
| Time | O(n × log(max(mᵢ))) - n modular inverses |
| Space | O(1) - just a few variables |
| Extended GCD | O(log(min(a,b))) per inverse |

<!-- back -->
