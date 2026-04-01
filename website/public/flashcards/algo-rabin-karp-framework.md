## Rabin-Karp: Framework

What are the complete implementations for Rabin-Karp pattern matching?

<!-- front -->

---

### Basic Rabin-Karp

```python
def rabin_karp(text, pattern, base=256, mod=10**9 + 7):
    """
    Find all occurrences of pattern in text.
    Returns list of starting indices.
    """
    n, m = len(text), len(pattern)
    if m > n:
        return []
    
    # Precompute base^(m-1) % mod
    h = pow(base, m - 1, mod)
    
    # Compute hash function
    def compute_hash(s):
        hash_val = 0
        for c in s:
            hash_val = (hash_val * base + ord(c)) % mod
        return hash_val
    
    pattern_hash = compute_hash(pattern)
    window_hash = compute_hash(text[:m])
    
    results = []
    
    for i in range(n - m + 1):
        if window_hash == pattern_hash:
            # Verify to avoid false positive
            if text[i:i+m] == pattern:
                results.append(i)
        
        # Roll hash to next window
        if i < n - m:
            # Remove leftmost, shift, add rightmost
            window_hash = (window_hash - ord(text[i]) * h) % mod
            window_hash = (window_hash * base) % mod
            window_hash = (window_hash + ord(text[i + m])) % mod
            window_hash = (window_hash + mod) % mod  # Ensure positive
    
    return results
```

---

### Double Hash (Collision Resistant)

```python
def rabin_karp_double(text, pattern):
    """
    Use two different mods to reduce collision probability.
    """
    base = 256
    mod1, mod2 = 10**9 + 7, 10**9 + 9
    
    n, m = len(text), len(pattern)
    h1 = pow(base, m - 1, mod1)
    h2 = pow(base, m - 1, mod2)
    
    def hash_double(s):
        h1_val = h2_val = 0
        for c in s:
            h1_val = (h1_val * base + ord(c)) % mod1
            h2_val = (h2_val * base + ord(c)) % mod2
        return (h1_val, h2_val)
    
    pattern_hash = hash_double(pattern)
    window_hash = hash_double(text[:m])
    
    results = []
    for i in range(n - m + 1):
        if window_hash == pattern_hash:
            if text[i:i+m] == pattern:
                results.append(i)
        
        if i < n - m:
            # Roll both hashes
            c_out, c_in = ord(text[i]), ord(text[i + m])
            
            # First hash
            h1_val = (window_hash[0] - c_out * h1) % mod1
            h1_val = (h1_val * base + c_in) % mod1
            
            # Second hash
            h2_val = (window_hash[1] - c_out * h2) % mod2
            h2_val = (h2_val * base + c_in) % mod2
            
            window_hash = (h1_val, h2_val)
    
    return results
```

---

### Multiple Pattern Search (Aho-Corasick Alternative)

```python
def rabin_karp_multiple(text, patterns):
    """
    Search for multiple patterns simultaneously.
    """
    from collections import defaultdict
    
    base, mod = 256, 10**9 + 7
    pattern_hashes = defaultdict(list)
    
    # Group patterns by length and hash
    for pattern in patterns:
        h = 0
        for c in pattern:
            h = (h * base + ord(c)) % mod
        pattern_hashes[len(pattern)][h].append(pattern)
    
    results = defaultdict(list)
    
    # Check each pattern length
    for length, hash_dict in pattern_hashes.items():
        # Run rolling hash for this length
        if len(text) < length:
            continue
        
        h = pow(base, length - 1, mod)
        window_hash = 0
        for i in range(length):
            window_hash = (window_hash * base + ord(text[i])) % mod
        
        for i in range(len(text) - length + 1):
            if window_hash in hash_dict:
                # Verify all patterns with this hash
                substring = text[i:i+length]
                for pattern in hash_dict[window_hash]:
                    if substring == pattern:
                        results[pattern].append(i)
            
            # Roll
            if i < len(text) - length:
                window_hash = (window_hash - ord(text[i]) * h) % mod
                window_hash = (window_hash * base) % mod
                window_hash = (window_hash + ord(text[i + length])) % mod
    
    return results
```

---

### 2D Pattern Matching

```python
def rabin_karp_2d(matrix, pattern):
    """
    Find 2D pattern in 2D matrix.
    Hash rows first, then hash row hashes.
    """
    rows, cols = len(matrix), len(matrix[0])
    p_rows, p_cols = len(pattern), len(pattern[0])
    
    base_col, base_row = 256, 257
    mod = 10**9 + 7
    
    # Precompute pattern hash
    pattern_hash = 0
    for r in range(p_rows):
        row_hash = 0
        for c in range(p_cols):
            row_hash = (row_hash * base_col + pattern[r][c]) % mod
        pattern_hash = (pattern_hash * base_row + row_hash) % mod
    
    # Compute row hashes for all windows
    row_hashes = [[0] * (cols - p_cols + 1) for _ in range(rows)]
    
    for r in range(rows):
        # First window in row
        h = 0
        for c in range(p_cols):
            h = (h * base_col + matrix[r][c]) % mod
        row_hashes[r][0] = h
        
        # Roll across row
        h_pow = pow(base_col, p_cols - 1, mod)
        for c in range(1, cols - p_cols + 1):
            h = (h - matrix[r][c-1] * h_pow) % mod
            h = (h * base_col) % mod
            h = (h + matrix[r][c + p_cols - 1]) % mod
            row_hashes[r][c] = h
    
    # Now match column-wise
    results = []
    h_row_pow = pow(base_row, p_rows - 1, mod)
    
    for c in range(cols - p_cols + 1):
        # First column of hashes
        col_hash = 0
        for r in range(p_rows):
            col_hash = (col_hash * base_row + row_hashes[r][c]) % mod
        
        if col_hash == pattern_hash:
            if verify_2d(matrix, pattern, 0, c):
                results.append((0, c))
        
        # Roll down
        for r in range(1, rows - p_rows + 1):
            col_hash = (col_hash - row_hashes[r-1][c] * h_row_pow) % mod
            col_hash = (col_hash * base_row) % mod
            col_hash = (col_hash + row_hashes[r + p_rows - 1][c]) % mod
            
            if col_hash == pattern_hash:
                if verify_2d(matrix, pattern, r, c):
                    results.append((r, c))
    
    return results
```

---

### Fingerprint for Plagiarism Detection

```python
def fingerprint_windows(text, window_size):
    """
    Generate fingerprints for all windows.
    Useful for plagiarism detection.
    """
    base, mod = 256, 10**9 + 7
    n = len(text)
    
    if n < window_size:
        return []
    
    fingerprints = []
    h = pow(base, window_size - 1, mod)
    
    # First window
    window_hash = 0
    for i in range(window_size):
        window_hash = (window_hash * base + ord(text[i])) % mod
    fingerprints.append(window_hash)
    
    # Roll through text
    for i in range(n - window_size):
        window_hash = (window_hash - ord(text[i]) * h) % mod
        window_hash = (window_hash * base) % mod
        window_hash = (window_hash + ord(text[i + window_size])) % mod
        fingerprints.append(window_hash)
    
    return fingerprints
```

<!-- back -->
