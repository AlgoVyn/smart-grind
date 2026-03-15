## Rabin-Karp - Rolling Hash

**Question:** Why use modulo and how to handle overflow?

<!-- front -->

---

## Rabin-Karp: Rolling Hash

### The Idea
Use hash to compare strings in O(1). Check actual string only when hashes match.

### Rolling Hash Formula
```
H(i) = (c0 × d^(m-1) + c1 × d^(m-2) + ... + cm-1 × d^0) mod q

Where:
- d = number of characters (alphabet size)
- m = pattern length
- q = prime modulo
```

### Implementation
```python
def rabin_karp(text, pattern, d=256, q=101):
    n, m = len(text), len(pattern)
    
    # Calculate d^(m-1) % q
    h = pow(d, m-1, q)
    
    # Initial hash for pattern and first window
    p_hash = 0
    t_hash = 0
    
    for i in range(m):
        p_hash = (d * p_hash + ord(pattern[i])) % q
        t_hash = (d * t_hash + ord(text[i])) % q
    
    # Slide window
    for i in range(n - m + 1):
        # Check hash first
        if p_hash == t_hash:
            # Verify actual string
            if text[i:i+m] == pattern:
                print(f\"Pattern found at {i}\")
        
        # Roll hash for next window
        if i < n - m:
            t_hash = (d * (t_hash - ord(text[i]) * h) 
                     + ord(text[i + m])) % q
            
            if t_hash < 0:
                t_hash += q
```

### Why Modulo q?
- Prevents integer overflow
- q should be a **large prime** to reduce collisions

### Complexity
- **Average:** O(n + m)
- **Worst:** O(nm) with many hash collisions

<!-- back -->
