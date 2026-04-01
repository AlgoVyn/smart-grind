## Huffman Encoding: Comparison with Alternatives

How does Huffman coding compare to other compression methods?

<!-- front -->

---

### Huffman vs Shannon-Fano vs Arithmetic

| Method | Time | Optimality | Implementation | Use Case |
|--------|------|------------|----------------|----------|
| **Huffman** | O(n log n) | Near optimal | Simple | General purpose |
| **Shannon-Fano** | O(n log n) | Suboptimal | Simple | Historical |
| **Arithmetic** | O(n) | Optimal | Complex | Best compression |
| **LZW** | O(n) | Good | Simple | GIF, Unix compress |

```python
# Shannon-Fano (suboptimal but simple)
def shannon_fano(symbols, prefix=''):
    if len(symbols) == 1:
        return {symbols[0][0]: prefix or '0'}
    
    # Sort by frequency
    symbols = sorted(symbols, key=lambda x: -x[1])
    
    # Split into two groups with roughly equal frequency sum
    total = sum(f for _, f in symbols)
    half = total / 2
    
    split = 0
    cumsum = 0
    for i, (_, f) in enumerate(symbols):
        cumsum += f
        if cumsum >= half:
            split = i + 1
            break
    
    left = shannon_fano(symbols[:split], prefix + '0')
    right = shannon_fano(symbols[split:], prefix + '1')
    
    return {**left, **right}
```

---

### Huffman vs Lempel-Ziv Methods

| Aspect | Huffman | LZ77/LZ78 |
|--------|---------|-----------|
| **Approach** | Statistical | Dictionary |
| **Preprocessing** | Needs frequencies | Streaming |
| **Memory** | O(alphabet) | O(window) |
| **Best for** | Skewed distribution | Repetitive data |
| **Standard uses** | JPEG, MP3 | ZIP, GZIP |

```python
# Huffman: Works on symbol frequencies
# Good when some symbols much more frequent

# LZ77: Works on repeated patterns
# Good when data has repeated substrings

def lz77_simple(data, window=1024):
    """
    Simplified LZ77 for comparison
    """
    i = 0
    result = []
    while i < len(data):
        best_offset = 0
        best_length = 0
        
        for j in range(max(0, i - window), i):
            length = 0
            while (i + length < len(data) and
                   j + length < i and
                   data[j + length] == data[i + length]):
                length += 1
            
            if length > best_length:
                best_length = length
                best_offset = i - j
        
        if best_length > 2:
            result.append((best_offset, best_length, data[i + best_length]))
            i += best_length + 1
        else:
            result.append((0, 0, data[i]))
            i += 1
    
    return result
```

---

### Fixed-Length vs Variable-Length Codes

| Code Type | Efficiency | Complexity | Use When |
|-----------|------------|------------|----------|
| **Fixed (ASCII)** | Low | Trivial | Uniform distribution |
| **Huffman** | High | Medium | Known frequencies |
| **Canonical Huffman** | High | Simple decode | Limited code lengths |

```python
# Fixed length: always 8 bits per char
def fixed_encode(text):
    return ''.join(format(ord(c), '08b') for c in text)

# Huffman: variable, optimal
# Best case: some chars get 1-2 bits
# Worst case: all get similar length

# Huffman limit: average length >= entropy
import math
def entropy(freqs):
    total = sum(freqs.values())
    return -sum((f/total) * math.log2(f/total) for f in freqs.values())
```

---

### When to Use Each Compression Method

| Data Characteristic | Best Method | Why |
|---------------------|-------------|-----|
| **Text, skewed freq** | Huffman | Exploits frequency differences |
| **Text, repetitive** | LZ + Huffman (DEFLATE) | Patterns + stats |
| **Images** | JPEG (DCT + Huffman) | Frequency domain + stats |
| **Audio** | MP3 (psychoacoustic + Huffman) | Perceptual + stats |
| **Uniform random** | None / Fixed | No structure to exploit |
| **Already compressed** | None | Huffman won't help |

```python
# Two-stage compression decision
def choose_compression(data):
    # Analyze data characteristics
    
    # 1. Check if already compressed (high entropy)
    # 2. Check for repetition (good for LZ)
    # 3. Check frequency skew (good for Huffman)
    
    entropy_ratio = compute_entropy(data) / 8  # vs 8-bit fixed
    
    if entropy_ratio > 0.95:
        return 'none'  # Already near random
    
    if has_repetition(data):
        return 'lz77+huffman'
    
    if has_frequency_skew(data):
        return 'huffman'
    
    return 'fixed'
```

<!-- back -->
