## Huffman Encoding: Forms & Variations

What are the different forms and specialized Huffman coding implementations?

<!-- front -->

---

### Standard Huffman Form

```python
# Standard Huffman as described above
def huffman_standard(frequencies):
    """
    Optimal prefix-free code construction
    """
    heap = [(f, HuffmanNode(c, f)) for c, f in frequencies.items()]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        f1, n1 = heapq.heappop(heap)
        f2, n2 = heapq.heappop(heap)
        merged = HuffmanNode(None, f1 + f2, n1, n2)
        heapq.heappush(heap, (f1 + f2, merged))
    
    return heap[0][1] if heap else None
```

**Properties:**
- Optimal for given frequencies
- Prefix-free
- Variable-length codes

---

### Length-Limited Huffman Form

```python
def length_limited_huffman(frequencies, max_length):
    """
    Huffman with constraint: no code longer than max_length
    Uses Package-Merge algorithm
    """
    # Standard Huffman can produce arbitrary length codes
    # For practical implementations (e.g., DEFLATE), limit length
    
    # Package-Merge approach:
    # 1. Create packages of symbols
    # 2. Merge packages while respecting length limit
    
    # Implementation is complex, uses dynamic programming
    
    n = len(frequencies)
    items = sorted(frequencies.items(), key=lambda x: x[1])
    
    # DP: dp[i][l] = min cost to assign lengths <= l to first i items
    INF = float('inf')
    dp = [[INF] * (max_length + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    
    # Complex DP with package-merge logic
    # (Implementation omitted for brevity)
    
    return extract_codes_from_dp(dp, items)
```

---

### Adaptive Huffman Form

```python
class AdaptiveHuffman:
    """
    Huffman coding that updates frequencies dynamically
    Used when frequencies not known in advance
    """
    def __init__(self):
        self.tree = None
        self.freq = defaultdict(int)
        self.codes = {}
    
    def update(self, char):
        """Update tree with new character"""
        self.freq[char] += 1
        # Rebuild tree (expensive) or incrementally update
        self.tree = build_huffman_tree(self.freq)
        self.codes = generate_codes(self.tree)
    
    def encode_stream(self, stream):
        """Encode streaming data"""
        result = []
        for char in stream:
            if char in self.codes:
                result.append(self.codes[char])
            else:
                # New character: use escape code
                result.append('ESCAPE')
                result.append(format(ord(char), '08b'))
            
            self.update(char)
        
        return ''.join(result)
```

---

### n-ary Huffman Form

```python
def nary_huffman(frequencies, n):
    """
    n-ary Huffman coding (not just binary)
    Each internal node has n children
    """
    # Add dummy symbols if needed
    # (n - 1) must divide (num_symbols - 1)
    
    num_symbols = len(frequencies)
    while (num_symbols - 1) % (n - 1) != 0:
        frequencies[f'DUMMY_{num_symbols}'] = 0
        num_symbols += 1
    
    # Use n-ary heap
    heap = [(f, HuffmanNode(c, f)) for c, f in frequencies.items()]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        # Pop n smallest
        children = [heapq.heappop(heap) for _ in range(n)]
        total_freq = sum(f for f, _ in children)
        
        # Create n-ary node
        node = HuffmanNode(None, total_freq)
        node.children = [c for _, c in children]
        
        heapq.heappush(heap, (total_freq, node))
    
    return heap[0][1]
```

---

### Block Huffman Form

```python
def block_huffman(text, block_size):
    """
    Huffman coding on blocks of characters
    Better compression for correlated data
    """
    # Create blocks
    blocks = []
    for i in range(0, len(text), block_size):
        block = text[i:i+block_size]
        blocks.append(block)
    
    # Count block frequencies
    freq = defaultdict(int)
    for block in blocks:
        freq[block] += 1
    
    # Build Huffman tree on blocks
    tree = build_huffman_tree(freq)
    codes = generate_codes(tree)
    
    # Encode
    encoded = ''.join(codes[b] for b in blocks)
    
    return encoded, codes
```

<!-- back -->
