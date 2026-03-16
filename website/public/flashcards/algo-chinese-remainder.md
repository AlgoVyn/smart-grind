## Chinese Remainder Theorem

**Question:** Find N such that N % mi = ri for multiple remainders?

<!-- front -->

---

## Answer: Build Solution from Remainders

### Problem Setup
```
Find x such that:
x ≡ r1 (mod m1)
x ≡ r2 (mod m2)
x ≡ r3 (mod m3)
...

Where m1, m2, m3 are pairwise coprime
```

### Solution
```python
def extended_gcd(a, b):
    if b == 0:
        return (a, 1, 0)
    else:
        g, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        return (g, x, y)

def chinese_remainder(remainders, moduli):
    # moduli must be pairwise coprime
    x = 0
    M = 1
    
    # Product of all moduli
    for m in moduli:
        M *= m
    
    for ri, mi in zip(remainders, moduli):
        # Partial product
        Mi = M // mi
        
        # Modular inverse of Mi modulo mi
        g, inv, _ = extended_gcd(Mi, mi)
        
        x += ri * Mi * inv
    
    return x % M

# Example:
# x ≡ 2 (mod 3)
# x ≡ 3 (mod 4)  
# x ≡ 1 (mod 5)
# Result: x = 11
```

### Visual: CRT Construction
```
x = Σ (ri × Mi × inv_i) mod M

Where:
- M = m1 × m2 × m3 × ...
- Mi = M / mi
- inv_i = Mi^(-1) mod mi
```

### ⚠️ Tricky Parts

#### 1. Moduli Must Be Coprime
```python
# CRT works when gcd(mi, mj) = 1 for all i ≠ j

# If not coprime, solution may not exist
# Or need to check consistency
```

#### 2. Extended GCD
```python
# Need modular inverse
# a^(-1) mod m exists if gcd(a,m) = 1

# extended_gcd returns x, y such that:
# ax + by = gcd(a, b)
```

### Time Complexity

| Step | Complexity |
|------|------------|
| Extended GCD | O(log M) per modulus |
| Total | O(k × log M) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not coprime | Check gcd first |
| Wrong inverse | Use extended_gcd |
| Negative result | Apply mod at end |

<!-- back -->
