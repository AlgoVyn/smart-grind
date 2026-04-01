## FFT/NTT: Tactics & Applications

What tactical patterns leverage FFT/NTT for problem solving?

<!-- front -->

---

### Tactic 1: String Matching with Wildcards

**Pattern:** Find pattern in text where '?' matches any character.

```python
def wildcard_match(text, pattern):
    """
    Find all positions where pattern matches (with '?' wildcard)
    Using convolution with character encoding
    """
    n, m = len(text), len(pattern)
    
    # Encode: map chars to complex numbers on unit circle
    # Pattern reversed for convolution
    
    # For each character c:
    # Create binary array: 1 if text[i] == c, 0 otherwise
    # Create binary array: 1 if pattern[j] == c, 0 otherwise (reversed)
    # Convolution gives matches for char c
    
    matches = [0] * n
    
    for c in set(pattern) - {'?'}:
        a = [1 if x == c else 0 for x in text]
        b = [1 if x == c else 0 for x in reversed(pattern)]
        conv = multiply_polynomials(a, b)
        
        # Add to match count at appropriate positions
        for i in range(m - 1, n):
            matches[i - m + 1] += conv[i]
    
    # Positions where matches == non-wildcard chars in pattern
    wildcard_count = pattern.count('?')
    target = m - wildcard_count
    
    return [i for i in range(n - m + 1) if matches[i] == target]
```

---

### Tactic 2: Counting Pairs with Constraints

```python
def count_pairs_fft(arr, target):
    """
    Count pairs (i,j) where arr[i] + arr[j] == target
    Using generating functions
    """
    max_val = max(arr)
    size = 1
    while size <= 2 * max_val:
        size <<= 1
    
    # Frequency array
    freq = [0] * size
    for x in arr:
        freq[x] += 1
    
    # FFT
    fa = [complex(x) for x in freq]
    fft(fa)
    
    # Square (convolution gives pair sums)
    for i in range(size):
        fa[i] *= fa[i]
    
    # Inverse FFT
    fft(fa, invert=True)
    
    # Extract result
    result = [int(round(fa[i].real)) for i in range(size)]
    
    # result[k] = count of pairs summing to k
    # Adjust for i=j pairs counted twice
    for x in arr:
        result[2 * x] -= 1  # Remove i=j
    
    return result[target] // 2  # Each pair counted twice
```

---

### Tactic 3: Closest Pair of Points (1D/2D)

```python
def closest_pair_1d_fft(points):
    """
    Find closest pair using FFT-based distance computation
    (Alternative to sweep line for specific constraints)
    """
    # For 1D: sort and scan adjacent is O(n log n)
    # FFT approach for high-dimensional or specific constraints
    
    # In 2D: use FFT for fast distance transforms
    # Create indicator array and use FFT for fast convolution
    
    # Practical: use sweep line for 1D/2D
    # FFT useful for: all-pairs distances, kernel methods
    
    pass
```

---

### Tactic 4: Polynomial Exponentiation

```python
def polynomial_exp(p, k, mod=None):
    """
    Compute p(x)^k efficiently
    Useful for counting combinations with repetition
    """
    if k == 0:
        return [1]
    if k == 1:
        return p[:]
    
    # Binary exponentiation
    result = [1]
    base = p[:]
    
    while k > 0:
        if k & 1:
            result = multiply_ntt(result, base, mod) if mod else multiply_polynomials(result, base)
        base = multiply_ntt(base, base, mod) if mod else multiply_polynomials(base, base)
        k >>= 1
    
    return result

# Application: rolling dice
# Ways to get sum s with n dice = coefficient of x^s in (x + x^2 + ... + x^6)^n
def dice_sums(n, max_sum):
    """All possible sums from n dice"""
    poly = [0, 1, 1, 1, 1, 1, 1]  # 1 way each for 1-6
    result = polynomial_exp(poly, n)
    return result[:max_sum + 1]
```

---

### Tactic 5: Cross-Correlation for Pattern Matching

```python
def cross_correlation(a, b):
    """
    Cross-correlation: (a ⋆ b)[n] = sum_k a[k] * conj(b[k+n])
    Useful for finding best alignment
    """
    # FFT approach: Correlation(a, b) = IFFT(FFT(a) * conj(FFT(b)))
    n = len(a)
    m = len(b)
    size = 1
    while size < n + m:
        size <<= 1
    
    fa = [complex(x) for x in a] + [0j] * (size - n)
    fb = [complex(x) for x in b] + [0j] * (size - m)
    
    fft(fa)
    fft(fb)
    
    # Cross-correlation: multiply by conjugate
    for i in range(size):
        fa[i] *= fb[i].conjugate()
    
    fft(fa, invert=True)
    
    return [int(round(x.real)) for x in fa[:n + m - 1]]

# Signal processing: find where pattern best matches
best_shift = max(range(n), key=lambda i: correlation[i])
```

<!-- back -->
