## FFT/NTT: Forms & Variations

What are the different forms and specialized FFT/NTT implementations?

<!-- front -->

---

### Recursive FFT Form

```python
def fft_recursive(a, invert=False):
    """
    Recursive divide-and-conquer FFT
    Simpler to understand but slower in Python
    """
    n = len(a)
    if n == 1:
        return a
    
    # Split
    a_even = fft_recursive(a[0::2], invert)
    a_odd = fft_recursive(a[1::2], invert)
    
    # Combine
    angle = 2 * math.pi / n * (-1 if not invert else 1)
    w, wn = 1, complex(math.cos(angle), math.sin(angle))
    
    result = [0] * n
    for j in range(n // 2):
        result[j] = a_even[j] + w * a_odd[j]
        result[j + n // 2] = a_even[j] - w * a_odd[j]
        w *= wn
    
    return result

# Usage requires copying back
```

**Trade-off:** Cleaner conceptually, higher overhead due to list creation.

---

### Bluestein's Algorithm (Chirp-Z)

```python
def bluestein_fft(a, invert=False):
    """
    FFT for arbitrary lengths (not just powers of 2)
    Uses convolution via padding to power of 2
    """
    n = len(a)
    m = 1
    while m < 2 * n - 1:
        m <<= 1
    
    # Chirp factors
    chirp = [cmath.exp(1j * math.pi * k * k / n) for k in range(n)]
    
    # Create padded arrays
    A = [a[i] * chirp[i].conjugate() for i in range(n)] + [0] * (m - n)
    B = [chirp[i] for i in range(n)] + [0] * (m - 2 * n + 1) + [chirp[i] for i in range(n-1, 0, -1)]
    
    # Convolve via FFT
    A = fft(A)
    B = fft(B)
    for i in range(m):
        A[i] *= B[i]
    A = fft(A, invert=True)
    
    result = [A[i] * chirp[i].conjugate() for i in range(n)]
    if invert:
        result = [x / n for x in result]
    
    return result
```

---

### Bluestein's Chirp Z-Transform

For arbitrary-length FFT when n is not power of 2:

```python
def chirp_z(a, invert=False):
    """
    Chirp Z-transform for any n
    Useful when n is prime or has large factors
    """
    n = len(a)
    
    # Next power of 2 >= 2*n - 1
    m = 1
    while m < 2 * n - 1:
        m <<= 1
    
    # Chirp sequence
    chirp = [cmath.exp((1j if not invert else -1j) * math.pi * k * k / n) 
             for k in range(-n + 1, n)]
    
    # Create convolvable arrays
    fa = [0] * m
    fb = [0] * m
    
    for i in range(n):
        fa[i] = a[i] * chirp[n - 1 + i].conjugate()
    
    for i in range(2 * n - 1):
        fb[i] = chirp[i]
    
    # FFT-based convolution
    fa = fft(fa)
    fb = fft(fb)
    for i in range(m):
        fa[i] *= fb[i]
    fa = fft(fa, invert=True)
    
    result = [fa[n - 1 + i] * chirp[n - 1 + i].conjugate() for i in range(n)]
    
    if invert:
        result = [x / n for x in result]
    
    return result
```

---

### FMT (Fast Möbius Transform) Form

For subset convolution problems:

```python
def subset_convolution(a, b, n):
    """
    Convolution over subsets: c[S] = sum_{T subset S} a[T] * b[S\T]
    """
    size = 1 << n
    
    # SOS DP for each rank
    def sos_transform(f, invert=False):
        for i in range(n):
            for mask in range(size):
                if mask & (1 << i):
                    if invert:
                        f[mask] -= f[mask ^ (1 << i)]
                    else:
                        f[mask] += f[mask ^ (1 << i)]
        return f
    
    # Transform both arrays
    A = sos_transform(a[:])
    B = sos_transform(b[:])
    
    # Pointwise multiply
    C = [A[i] * B[i] for i in range(size)]
    
    # Inverse transform
    return sos_transform(C, invert=True)
```

---

### Arbitrary Precision Form

```python
def multiply_big_integers(a_str, b_str):
    """
    Multiply big integers using FFT
    Handles numbers with thousands of digits
    """
    # Convert to digit arrays (9 digits per chunk for precision)
    BASE = 10 ** 4
    
    a = []
    for i in range(len(a_str), 0, -4):
        start = max(0, i - 4)
        a.append(int(a_str[start:i]))
    
    b = []
    for i in range(len(b_str), 0, -4):
        start = max(0, i - 4)
        b.append(int(b_str[start:i]))
    
    # FFT multiplication
    result = multiply_polynomials(a, b)
    
    # Handle carries
    carry = 0
    for i in range(len(result)):
        result[i] += carry
        carry = result[i] // BASE
        result[i] %= BASE
    
    while carry:
        result.append(carry % BASE)
        carry //= BASE
    
    # Convert back to string
    return ''.join(str(x).zfill(4) for x in reversed(result)).lstrip('0') or '0'
```

<!-- back -->
