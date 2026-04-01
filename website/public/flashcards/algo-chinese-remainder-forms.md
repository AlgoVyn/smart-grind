## Chinese Remainder: Problem Forms

What are the different problem variations and applications of the Chinese Remainder Theorem?

<!-- front -->

---

### Standard Simultaneous Congruences

**Form:** Find x such that:
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
x ≡ aₖ (mod mₖ)
```

**When moduli are coprime:** Direct CRT application
**Solution:** `x = Σ aᵢ × Mᵢ × yᵢ (mod M)`

---

### Non-Coprime Moduli (Generalized CRT)

| Condition | Solution |
|-----------|----------|
| `aᵢ ≡ aⱼ (mod gcd(mᵢ, mⱼ))` for all i,j | Unique solution mod lcm(m₁, ..., mₖ) |
| Inconsistent remainders | No solution |

```python
def generalized_crt(rems, mods):
    """Handle non-coprime moduli"""
    x, m = 0, 1
    
    for rem, mod in zip(rems, mods):
        g = gcd(m, mod)
        
        # Check consistency
        if (rem - x) % g != 0:
            return None
        
        # Merge congruences
        # x ≡ rem (mod mod) with current solution
        lcm_m_mod = (m // g) * mod
        
        # Find solution to both
        # x + m*t ≡ rem (mod mod)
        # m*t ≡ rem - x (mod mod)
        diff = (rem - x) // g
        mod_g = mod // g
        inv = mod_inverse(m // g, mod_g)
        t = (diff * inv) % mod_g
        
        x = x + m * t
        m = lcm_m_mod
        x %= m
    
    return x
```

---

### Large Number Arithmetic (Garner's Algorithm)

**Problem:** CRT coefficients overflow standard integers

**Garner's Algorithm:** Reconstruct mixed-radix representation
```python
def garner_algorithm(rems, mods):
    """
    Express solution as:
    x = v[0] + v[1]*m[0] + v[2]*m[0]*m[1] + ...
    
    Where each v[i] < m[i]
    """
    k = len(rems)
    x = [0] * k
    
    for i in range(k):
        x[i] = rems[i]
        for j in range(i):
            # x[i] = (rems[i] - x[j]) * inv(m[j], m[i]) mod m[i]
            x[i] = (x[i] - x[j]) * mod_inverse(mods[j], mods[i])
            x[i] %= mods[i]
    
    # Reconstruct final answer
    result = x[0]
    prod = 1
    for i in range(1, k):
        prod *= mods[i-1]
        result += x[i] * prod
    
    return result
```

---

### Secret Sharing

**Shamir's Secret Sharing with CRT:**
```
Choose pairwise coprime moduli m₁ < m₂ < ... < mₙ
Secret S < m₁ × m₂ × ... × mₖ (threshold k)
Give share i: S mod mᵢ

Any k shares can reconstruct S via CRT
k-1 shares reveal nothing (product < S)
```

---

### RSA Acceleration

**CRT-RSA decryption:**
```
Given: ciphertext c, private key (d, n=pq)

Standard: m = c^d mod n (slow for large d)

CRT version:
  m₁ = c^d mod p
  m₂ = c^d mod q
  
  # Combine with CRT
  q_inv = q^(-1) mod p
  h = q_inv * (m₁ - m₂) mod p
  m = m₂ + h*q
  
# ~4x faster than standard RSA
```

| Method | Time | Speedup |
|--------|------|---------|
| Standard | O(log d × M(n)) | 1x |
| CRT-RSA | O(log d × M(n/2)) | ~4x |

<!-- back -->
