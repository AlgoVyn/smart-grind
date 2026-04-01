## Rabin-Karp: Tactics & Techniques

What are the tactical patterns for Rabin-Karp algorithm?

<!-- front -->

---

### Tactic 1: Choose Base and Mod Wisely

| Base | Use Case | Notes |
|------|----------|-------|
| 256 | ASCII text | Common choice |
| 911, 357 | Competitive programming | Reduce collisions |
| Random | Security | Harder to attack |

| Mod | Property | Risk |
|-----|----------|------|
| 2^64 | Fast (uint overflow) | Needs verification |
| Large prime (10^9+7) | Good distribution | Slower |
| Multiple primes | Very safe | More computation |

```python
# Safe defaults
default_base = 911382629  # Random large odd number
default_mod = 10**18 + 3  # Large prime
```

---

### Tactic 2: Always Verify on Match

```python
def safe_rabin_karp(text, pattern):
    """
    Always verify character-by-character on hash match.
    Prevents false positives.
    """
    for i in rabin_karp(text, pattern):
        # Additional verification
        if text[i:i+len(pattern)] == pattern:
            yield i
```

---

### Tactic 3: Precompute Powers

```python
def optimized_rabin_karp(text, pattern):
    """Precompute powers for efficiency."""
    base, mod = 256, 10**9 + 7
    n, m = len(text), len(pattern)
    
    # Precompute base powers
    powers = [1] * (m + 1)
    for i in range(1, m + 1):
        powers[i] = (powers[i - 1] * base) % mod
    
    h = powers[m - 1]  # base^(m-1) % mod
    
    # Rest of algorithm using precomputed powers...
```

---

### Tactic 4: Modular Arithmetic Handling

```python
def safe_mod_sub(a, b, mod):
    """Safe subtraction that handles negative."""
    return (a - b) % mod

def rolling_hash_step(old_hash, out_char, in_char, h, base, mod):
    """
    Single step of rolling hash with proper modular handling.
    """
    # Remove outgoing
    new_hash = (old_hash - out_char * h) % mod
    # Shift
    new_hash = (new_hash * base) % mod
    # Add incoming
    new_hash = (new_hash + in_char) % mod
    return new_hash
```

---

### Tactic 5: Combining with Other Algorithms

```python
def hybrid_search(text, pattern):
    """
    Use Rabin-Karp for filtering, KMP or Z-algo for verification.
    Or: Use different algorithms based on pattern characteristics.
    """
    m = len(pattern)
    
    # Short pattern: naive is faster
    if m <= 3:
        return naive_search(text, pattern)
    
    # Pattern with few unique chars: Boyer-Moore is better
    if len(set(pattern)) <= 2:
        return boyer_moore(text, pattern)
    
    # Otherwise: Rabin-Karp
    return rabin_karp(text, pattern)
```

| Algorithm | Best For | Worst Case |
|-----------|----------|------------|
| Naive | Very short patterns | O(n×m) |
| Rabin-Karp | Multiple patterns | O(n×m) |
| KMP | Single pattern, guaranteed | O(n+m) |
| Boyer-Moore | Large alphabet | O(n×m) |

<!-- back -->
