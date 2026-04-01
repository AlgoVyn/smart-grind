## FFT/NTT: Frameworks

What are the standard implementations for FFT and NTT?

<!-- front -->

---

### FFT Framework (Iterative)

```python
import cmath

def fft(a, invert=False):
    """
    Cooley-Tukey iterative FFT
    a: list of complex numbers (length must be power of 2)
    invert: False for DFT, True for IDFT
    """
    n = len(a)
    j = 0
    
    # Bit-reversal permutation
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    
    # Butterfly operations
    length = 2
    while length <= n:
        ang = 2 * cmath.pi / length * (-1 if not invert else 1)
        wlen = complex(cmath.cos(ang), cmath.sin(ang))
        
        for i in range(0, n, length):
            w = 1 + 0j
            half = length // 2
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w
                a[j] = u + v
                a[j + half] = u - v
                w *= wlen
        length <<= 1
    
    if invert:
        for i in range(n):
            a[i] /= n
    
    return a

def multiply_polynomials(a, b):
    """Multiply two polynomials using FFT"""
    n = 1
    while n < len(a) + len(b):
        n <<= 1
    
    fa = [complex(x) for x in a] + [0j] * (n - len(a))
    fb = [complex(x) for x in b] + [0j] * (n - len(b))
    
    fft(fa)
    fft(fb)
    
    for i in range(n):
        fa[i] *= fb[i]
    
    fft(fa, invert=True)
    
    result = [int(round(fa[i].real)) for i in range(len(a) + len(b) - 1)]
    return result
```

---

### NTT Framework

```python
def ntt(a, mod, root, invert=False):
    """
    Number Theoretic Transform
    mod: prime of form c·2^k + 1
    root: primitive root of order len(a)
    """
    n = len(a)
    j = 0
    
    # Bit-reversal permutation
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    
    # Butterfly with modular arithmetic
    length = 2
    while length <= n:
        wlen = pow(root, (mod - 1) // length, mod)
        if invert:
            wlen = pow(wlen, mod - 2, mod)
        
        for i in range(0, n, length):
            w = 1
            half = length // 2
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w % mod
                a[j] = (u + v) % mod
                a[j + half] = (u - v + mod) % mod
                w = w * wlen % mod
        length <<= 1
    
    if invert:
        n_inv = pow(n, mod - 2, mod)
        for i in range(n):
            a[i] = a[i] * n_inv % mod
    
    return a

# Common moduli
MOD_998244353 = 998244353  # 119 * 2^23 + 1, root = 3
MOD_167772161 = 167772161  # 5 * 2^25 + 1

def multiply_ntt(a, b, mod=MOD_998244353, root=3):
    n = 1
    while n < len(a) + len(b):
        n <<= 1
    
    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))
    
    ntt(fa, mod, root)
    ntt(fb, mod, root)
    
    for i in range(n):
        fa[i] = fa[i] * fb[i] % mod
    
    ntt(fa, mod, root, invert=True)
    
    return fa[:len(a) + len(b) - 1]
```

---

### 3-Modulus CRT for Large Results

```python
def multiply_large(a, b):
    """
    Multiply with result larger than single modulus
    Using CRT with 3 NTT-friendly primes
    """
    mods = [998244353, 1004535809, 104857601]
    roots = [3, 3, 3]
    
    results = []
    for mod, root in zip(mods, roots):
        results.append(multiply_ntt(a, b, mod, root))
    
    # CRT to combine
    def crt(rems, mods):
        x = 0
        prod = 1
        for m in mods:
            prod *= m
        
        for r, m in zip(rems, mods):
            p = prod // m
            x += r * p * pow(p, -1, m)
        
        return x % prod
    
    final = []
    for i in range(len(results[0])):
        rems = [r[i] for r in results]
        final.append(crt(rems, mods))
    
    return final
```

---

### Polynomial Operations via Convolution

```python
def poly_operations():
    """
    Common operations using FFT/NTT
    """
    # 1. Polynomial multiplication: O(n log n)
    c = multiply_polynomials(a, b)
    
    # 2. Polynomial exponentiation
    def poly_pow(p, k):
        """p(x)^k using binary exponentiation"""
        result = [1]
        base = p[:]
        while k:
            if k & 1:
                result = multiply_polynomials(result, base)
            base = multiply_polynomials(base, base)
            k >>= 1
        return result
    
    # 3. All-subset sums (using generating functions)
    # If we want sum of products of all k-subsets
    # Use (1 + a[0]x)(1 + a[1]x)...(1 + a[n-1]x)
    def subset_sums(arr):
        result = [1]
        for x in arr:
            result = multiply_polynomials(result, [1, x])
        return result  # result[k] = sum of all k-subset products
```

<!-- back -->
