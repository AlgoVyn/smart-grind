## Huffman Encoding: Tactics & Applications

What tactical patterns leverage Huffman coding?

<!-- front -->

---

### Tactic 1: Combined with Run-Length Encoding

```python
def compress_rle_huffman(data):
    """
    Two-stage compression:
    1. Run-length encoding for repeated sequences
    2. Huffman coding on RLE output
    """
    # Stage 1: RLE
    rle = []
    i = 0
    while i < len(data):
        count = 1
        while i + 1 < len(data) and data[i] == data[i+1] and count < 255:
            count += 1
            i += 1
        rle.append((data[i], count))
        i += 1
    
    # Stage 2: Huffman on (char, count) pairs
    freq = defaultdict(int)
    for item in rle:
        freq[item] += 1
    
    tree = build_huffman_tree(freq)
    codes = generate_codes(tree)
    
    # Encode
    encoded = ''.join(codes[item] for item in rle)
    
    return encoded, codes, rle
```

---

### Tactic 2: Huffman with LZ77/LZ78 (DEFLATE-style)

```python
def deflate_style_compress(data):
    """
    Simplified DEFLATE: LZ77 + Huffman
    """
    # Stage 1: LZ77 sliding window compression
    # Produces: (offset, length, next_char) or just literals
    
    lz77_output = []
    window_size = 32768
    
    i = 0
    while i < len(data):
        # Find best match in sliding window
        best_len = 0
        best_offset = 0
        
        for j in range(max(0, i - window_size), i):
            match_len = 0
            while (i + match_len < len(data) and 
                   data[j + match_len] == data[i + match_len] and
                   match_len < 258):
                match_len += 1
            
            if match_len > best_len:
                best_len = match_len
                best_offset = i - j
        
        if best_len >= 3:  # Worth encoding as match
            lz77_output.append(('match', best_offset, best_len))
            i += best_len
        else:
            lz77_output.append(('literal', data[i]))
            i += 1
    
    # Stage 2: Huffman code the LZ77 output
    # Separate trees for literals/lengths and distances
    
    return lz77_output
```

---

### Tactic 3: Minimum Variance Huffman

```python
def minimum_variance_huffman(frequencies):
    """
    Among all optimal Huffman codes, choose one with
    minimum variance in code lengths (more balanced)
    """
    # When merging, if two nodes have same frequency,
    # prefer the one with more balanced subtree
    
    def get_depth(node):
        if node.char is not None:
            return 0
        return 1 + max(get_depth(node.left), get_depth(node.right))
    
    class BalancedNode:
        def __init__(self, node):
            self.node = node
            self.depth = get_depth(node)
        
        def __lt__(self, other):
            if self.node.freq != other.node.freq:
                return self.node.freq < other.node.freq
            # Tie-break by depth (prefer shallower)
            return self.depth < other.depth
    
    # Build tree with tie-breaking
    heap = [BalancedNode(HuffmanNode(c, f)) for c, f in frequencies.items()]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        n1 = heapq.heappop(heap)
        n2 = heapq.heappop(heap)
        
        merged = HuffmanNode(
            None, 
            n1.node.freq + n2.node.freq,
            n1.node, n2.node
        )
        heapq.heappush(heap, BalancedNode(merged))
    
    return heap[0].node if heap else None
```

---

### Tactic 4: Huffman for Decision Trees

```python
def optimal_decision_tree(weights):
    """
    Build optimal binary decision tree
    Similar to Huffman but with different objective
    """
    # Problem: Given probabilities of outcomes,
    # build decision tree minimizing expected number of tests
    
    # For binary search like problems, use Huffman-like approach
    # but with different merge criterion
    
    # Example: Animal guessing game
    # Weights = probability of each animal
    # Questions should split as evenly as possible
    
    # Modified Huffman: merge by weight but aim for balance
    
    pass
```

---

### Tactic 5: Weighted Path Length Optimization

```python
def compute_weighted_path_length(root, depth=0):
    """
    Compute Σ(frequency × depth) for a Huffman tree
    """
    if root.char is not None:
        return root.freq * depth
    
    total = 0
    if root.left:
        total += compute_weighted_path_length(root.left, depth + 1)
    if root.right:
        total += compute_weighted_path_length(root.right, depth + 1)
    
    return total

def verify_optimality(frequencies, huffman_tree):
    """
    Verify Huffman tree is optimal
    """
    wpl = compute_weighted_path_length(huffman_tree)
    
    # Kraft inequality: sum of 2^(-length) <= 1
    codes = generate_codes(huffman_tree)
    kraft_sum = sum(2 ** (-len(code)) for code in codes.values())
    
    return {
        'weighted_path_length': wpl,
        'kraft_sum': kraft_sum,
        'is_valid': kraft_sum <= 1.00001  # Allow small floating error
    }
```

<!-- back -->
