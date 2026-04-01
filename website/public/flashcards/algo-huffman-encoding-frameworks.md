## Huffman Encoding: Frameworks

What are the standard implementations for Huffman coding?

<!-- front -->

---

### Basic Huffman Framework

```python
import heapq
from collections import defaultdict

class HuffmanNode:
    def __init__(self, char=None, freq=0, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right
    
    def __lt__(self, other):
        return self.freq < other.freq

def build_huffman_tree(frequencies):
    """
    Build Huffman tree from character frequencies
    """
    # Create min-heap
    heap = [HuffmanNode(char, freq) for char, freq in frequencies.items()]
    heapq.heapify(heap)
    
    # Merge until single tree
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        
        merged = HuffmanNode(
            freq=left.freq + right.freq,
            left=left,
            right=right
        )
        heapq.heappush(heap, merged)
    
    return heap[0] if heap else None
```

---

### Code Generation Framework

```python
def generate_codes(root):
    """
    Generate Huffman codes from tree
    Returns dict: char -> code string
    """
    codes = {}
    
    def traverse(node, current_code):
        if node.char is not None:
            # Leaf node
            codes[node.char] = current_code or '0'  # Single char case
            return
        
        if node.left:
            traverse(node.left, current_code + '0')
        if node.right:
            traverse(node.right, current_code + '1')
    
    if root:
        traverse(root, '')
    
    return codes

def huffman_encode(text):
    """
    Complete Huffman encoding pipeline
    """
    # Count frequencies
    freq = defaultdict(int)
    for char in text:
        freq[char] += 1
    
    # Build tree
    tree = build_huffman_tree(freq)
    
    # Generate codes
    codes = generate_codes(tree)
    
    # Encode
    encoded = ''.join(codes[c] for c in text)
    
    return encoded, codes, tree
```

---

### Decode Framework

```python
def huffman_decode(encoded, root):
    """
    Decode bit string using Huffman tree
    """
    decoded = []
    current = root
    
    for bit in encoded:
        if bit == '0':
            current = current.left
        else:
            current = current.right
        
        if current.char is not None:
            decoded.append(current.char)
            current = root
    
    return ''.join(decoded)

# Alternative with code table (faster)
def huffman_decode_table(encoded, codes):
    """
    Reverse codes dict for decoding
    """
    reverse_codes = {v: k for k, v in codes.items()}
    
    decoded = []
    current = ''
    
    for bit in encoded:
        current += bit
        if current in reverse_codes:
            decoded.append(reverse_codes[current])
            current = ''
    
    return ''.join(decoded)
```

---

### Compression Efficiency Framework

```python
def analyze_compression(text, codes, freq):
    """
    Analyze compression efficiency
    """
    # Original size (8 bits per char)
    original_bits = len(text) * 8
    
    # Compressed size
    compressed_bits = sum(freq[c] * len(codes[c]) for c in freq)
    
    # Average bits per symbol
    avg_bits = compressed_bits / len(text)
    
    # Entropy (theoretical minimum)
    import math
    total = len(text)
    entropy = -sum((f/total) * math.log2(f/total) for f in freq.values())
    
    return {
        'original_bits': original_bits,
        'compressed_bits': compressed_bits,
        'ratio': compressed_bits / original_bits,
        'avg_bits_per_symbol': avg_bits,
        'entropy': entropy,
        'efficiency': entropy / avg_bits
    }
```

---

### Canonical Huffman Codes

```python
def canonical_huffman_codes(codes):
    """
    Generate canonical Huffman codes
    Properties:
    1. Codes of same length are consecutive integers
    2. Shorter codes have higher numeric value
    3. Only code lengths need to be stored
    """
    # Group by length
    by_length = defaultdict(list)
    for char, code in codes.items():
        by_length[len(code)].append(char)
    
    # Sort characters for deterministic ordering
    for length in by_length:
        by_length[length].sort()
    
    # Generate canonical codes
    canonical = {}
    code = 0
    
    for length in sorted(by_length.keys()):
        for char in by_length[length]:
            canonical[char] = format(code, f'0{length}b')
            code += 1
        code <<= 1  # Shift for next length
    
    return canonical
```

<!-- back -->
