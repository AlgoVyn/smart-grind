## Huffman Encoding

**Question:** How does Huffman encoding work for lossless compression?

<!-- front -->

---

## Answer: Greedy + Priority Queue

### Solution
```python
import heapq
from collections import Counter

def huffman_encode(s):
    # Count frequency
    freq = Counter(s)
    
    # Create min heap (frequency, char)
    heap = [(f, c) for c, f in freq.items()]
    heapq.heapify(heap)
    
    # Build Huffman tree
    while len(heap) > 1:
        f1, c1 = heapq.heappop(heap)
        f2, c2 = heapq.heappop(heap)
        heapq.heappush(heap, (f1 + f2, c1 + c2))
    
    # Generate codes (recursive)
    codes = {}
    
    def generate_codes(node, code=''):
        if len(node) == 1:
            codes[node] = code if code else '0'
        else:
            generate_codes(node[:len(node)//2], code + '0')
            generate_codes(node[len(node)//2:], code + '1')
    
    root = heap[0][1]
    generate_codes(root)
    
    # Encode
    encoded = ''.join(codes[c] for c in s)
    return encoded, codes

def huffman_decode(encoded, codes):
    # Reverse codes
    rev_codes = {v: k for k, v in codes.items()}
    
    decoded = ''
    current = ''
    for bit in encoded:
        current += bit
        if current in rev_codes:
            decoded += rev_codes[current]
            current = ''
    
    return decoded
```

### Visual: Huffman Tree
```
String: "abbcccddddeeeee"

Frequency:
a:1, b:2, c:3, d:4, e:5

Build tree:
1. Combine a(1)+b(2)=3
2. Combine c(3)+d(4)=7
3. Combine 3+7=10
4. Combine 10+e(5)=15

Tree:           (15)
               /    \
            (10)     e(5)
            /   \
         (7)    a/b
         /  \
       (4)   (3)
       d    c   a   b

Codes: e=0, a=100, b=101, c=110, d=111
```

### ⚠️ Tricky Parts

#### 1. Why Greedy Works
```python
# Always combine two smallest frequencies
# This ensures optimal prefix-free codes
# No code is prefix of another

# Proof: Any optimal tree must have
# two smallest frequencies at deepest level
```

#### 2. Prefix-Free Codes
```python
# Huffman produces prefix-free codes
# No code is a prefix of another
# Decoding is unambiguous
```

#### 3. Edge Cases
```python
# Single character: code = '0'
# All same character: simple code
# Empty string: handle separately
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Build heap | O(n log n) | O(n) |
| Build tree | O(n log n) | O(n) |
| Encode/Decode | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong heap order | Use (freq, char) tuples |
| Single char edge | Handle length 1 specially |
| Not prefix-free | Greedy ensures this |

<!-- back -->
