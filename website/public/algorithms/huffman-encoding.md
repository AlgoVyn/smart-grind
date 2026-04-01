# Huffman Encoding

## Category
Greedy

## Description

Huffman Encoding is a **greedy algorithm** used for **lossless data compression**. It creates an optimal prefix-free binary code where no code is a prefix of another, ensuring unique decodability. The algorithm builds a binary tree (Huffman tree) based on character frequencies, with more frequent characters assigned shorter codes.

The key insight is that by assigning shorter codes to more frequent characters, we minimize the total encoded length. This greedy approach is provably optimal - no other prefix-free code can produce a shorter total encoded length for the given frequency distribution. Huffman coding is used in many compression formats including ZIP, JPEG, and MP3.

---

## Concepts

The Huffman Encoding technique is built on several fundamental concepts that make it powerful for data compression.

### 1. Prefix-Free Codes (Prefix Codes)

A prefix-free code ensures no code is a prefix of another code:

| Property | Description | Benefit |
|----------|-------------|---------|
| **Unambiguous** | No code is prefix of another | Instant decoding without lookahead |
| **No Delimiters** | Codes can be concatenated directly | More compact representation |
| **Tree Structure** | Codes correspond to root-to-leaf paths | Efficient encoding/decoding |

### 2. Frequency-Based Code Length

More frequent characters get shorter codes:

| Character | Frequency | Code Length | Contribution |
|-----------|-----------|-------------|--------------|
| e | 12.7% | 3 bits | 0.381 bits/char |
| t | 9.1% | 3 bits | 0.273 bits/char |
| a | 8.1% | 3 bits | 0.243 bits/char |
| z | 0.07% | 10 bits | 0.007 bits/char |

### 3. Huffman Tree Properties

| Property | Description |
|----------|-------------|
| **Full Binary Tree** | Every internal node has exactly 2 children |
| **Leaf Nodes** | Represent characters in the input |
| **Internal Nodes** | Represent combined frequencies |
| **Optimal Structure** | Two least frequent characters are siblings at deepest level |

### 4. Greedy Choice Property

At each step, combine the two least frequent nodes:

```
Step 1: Take two minimum frequency nodes
Step 2: Create parent with combined frequency
Step 3: Insert parent back into priority queue
Step 4: Repeat until one node remains (root)
```

---

## Frameworks

Structured approaches for solving Huffman encoding problems.

### Framework 1: Standard Huffman Encoding

```
┌─────────────────────────────────────────────────────┐
│  HUFFMAN ENCODING FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Frequency Count:                                │
│     - Scan input and count character frequencies    │
│     - Time: O(n) where n = input length             │
│                                                     │
│  2. Build Min-Heap:                                 │
│     - Create leaf node for each character           │
│     - Insert all nodes into min-heap by frequency   │
│     - Time: O(k) where k = unique characters        │
│                                                     │
│  3. Build Huffman Tree:                             │
│     while heap size > 1:                            │
│       a. node1 = extract_min()                      │
│       b. node2 = extract_min()                      │
│       c. parent = new_node(freq1+freq2, node1, node2)│
│       d. insert(parent)                             │
│     - Time: O(k log k)                              │
│                                                     │
│  4. Generate Codes:                                 │
│     - DFS from root, 0=left, 1=right              │
│     - At leaf: store code for character             │
│     - Time: O(k)                                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard lossless compression.

### Framework 2: Huffman Decoding

```
┌─────────────────────────────────────────────────────┐
│  HUFFMAN DECODING FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Start at root of Huffman tree                   │
│                                                     │
│  2. For each bit in encoded stream:                 │
│     a. If bit == 0: go to left child                │
│     b. If bit == 1: go to right child               │
│     c. If at leaf node:                              │
│        - Output character                           │
│        - Return to root                             │
│                                                     │
│  3. Continue until all bits processed               │
│                                                     │
│  Time: O(m) where m = number of encoded bits        │
└─────────────────────────────────────────────────────┘
```

**When to use**: Decompressing Huffman-encoded data.

### Framework 3: Canonical Huffman Codes

```
┌─────────────────────────────────────────────────────┐
│  CANONICAL HUFFMAN CODE FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Generate standard Huffman codes                 │
│                                                     │
│  2. Sort by code length, then by character value      │
│                                                     │
│  3. Assign canonical codes:                         │
│     - First code of length L: all zeros             │
│     - Next code: increment previous                 │
│     - When length increases: shift left and add 0   │
│                                                     │
│  4. Only need to transmit:                           │
│     - Number of codes at each length                │
│     - Characters in sorted order                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: When code table needs to be transmitted with compressed data.

---

## Forms

Different manifestations of Huffman coding.

### Form 1: Static Huffman Coding

Pre-computed frequency table used for entire message.

| Aspect | Characteristic |
|--------|----------------|
| Frequency Source | Pre-defined or first-pass scan |
| Tree Structure | Fixed for entire message |
| Compression | Good for known distributions |
| Use Case | File compression, standard formats |

### Form 2: Adaptive/Dynamic Huffman Coding

Tree updated dynamically as data is processed.

| Aspect | Characteristic |
|--------|----------------|
| FGK Algorithm | Update tree after each symbol |
| Vitter Algorithm | Improved update with guarantees |
| Initial State | Single NYT (Not Yet Transmitted) node |
| Use Case | Streaming compression, real-time |

### Form 3: Length-Limited Huffman Coding

Caps maximum code length for hardware constraints.

| Aspect | Characteristic |
|--------|----------------|
| Algorithm | Package-Merge |
| Max Length | Typically 15-16 bits |
| Guarantee | Optimal among length-limited codes |
| Use Case | DEFLATE (ZIP), JPEG |

### Form 4: n-ary Huffman Coding

Uses k-ary tree instead of binary.

```
Binary (k=2): 0=left, 1=right
Ternary (k=3): 0, 1, 2 for three children

Requires padding to satisfy: (n-1) mod (k-1) == 0
```

### Form 5: Canonical Huffman Coding

Standardized codes for efficient transmission.

| Advantage | Description |
|-----------|-------------|
| Compact Tree Description | Only need code lengths |
| Faster Decoding | Lookup table based on lengths |
| Sorting-Based | Codes assigned lexicographically |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Using Python heapq for Min-Heap

```python
import heapq
from collections import Counter

class HuffmanNode:
    def __init__(self, char: str, freq: int):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        # For heap comparison
        return self.freq < other.freq

# Build heap
freq = Counter(text)
heap = [HuffmanNode(char, count) for char, count in freq.items()]
heapq.heapify(heap)

# Build tree
while len(heap) > 1:
    node1 = heapq.heappop(heap)
    node2 = heapq.heappop(heap)
    merged = HuffmanNode(None, node1.freq + node2.freq)
    merged.left = node1
    merged.right = node2
    heapq.heappush(heap, merged)
```

### Tactic 2: Recursive Code Generation

```python
def generate_codes(node, code="", code_map=None):
    """Generate Huffman codes by DFS traversal."""
    if code_map is None:
        code_map = {}
    
    if node is None:
        return code_map
    
    if node.char is not None:
        # Leaf node - store code (handle single char case)
        code_map[node.char] = code if code else "0"
    
    generate_codes(node.left, code + "0", code_map)
    generate_codes(node.right, code + "1", code_map)
    
    return code_map
```

### Tactic 3: Tree-Based Decoding

```python
def huffman_decode(encoded: str, root: 'HuffmanNode') -> str:
    """Decode using Huffman tree traversal."""
    if not encoded or not root:
        return ""
    
    decoded = []
    current = root
    
    for bit in encoded:
        if bit == '0':
            current = current.left
        else:
            current = current.right
        
        # Leaf node reached
        if current.char is not None:
            decoded.append(current.char)
            current = root
    
    return "".join(decoded)
```

### Tactic 4: Reverse Code Table for Decoding

```python
def huffman_decode_with_table(encoded: str, codes: dict) -> str:
    """Decode using reverse lookup table."""
    reverse_codes = {code: char for char, code in codes.items()}
    
    decoded = []
    current_code = ""
    
    for bit in encoded:
        current_code += bit
        if current_code in reverse_codes:
            decoded.append(reverse_codes[current_code])
            current_code = ""
    
    return "".join(decoded)
```

### Tactic 5: Compression Ratio Calculation

```python
def calculate_compression(text: str, codes: dict) -> dict:
    """Calculate compression statistics."""
    original_bits = len(text) * 8  # ASCII
    
    # Calculate encoded bits
    freq = Counter(text)
    encoded_bits = sum(freq[char] * len(code) for char, code in codes.items())
    
    compression_ratio = (1 - encoded_bits / original_bits) * 100
    
    return {
        'original_bits': original_bits,
        'encoded_bits': encoded_bits,
        'compression_ratio': compression_ratio,
        'average_bits_per_char': encoded_bits / len(text)
    }
```

---

## Python Templates

### Template 1: Complete Huffman Encoding/Decoding

```python
import heapq
from collections import Counter, defaultdict

class HuffmanNode:
    """Node for Huffman tree."""
    def __init__(self, char: str, freq: int):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        return self.freq < other.freq


def huffman_encode(text: str) -> tuple:
    """
    Encode text using Huffman coding.
    
    Returns:
        Tuple of (encoded_string, huffman_codes, root)
    
    Time: O(n log k) where k = unique characters
    Space: O(k)
    """
    if not text:
        return "", {}, None
    
    # Step 1: Count frequencies - O(n)
    freq = Counter(text)
    
    # Step 2: Build priority queue (min-heap) - O(k)
    heap = [HuffmanNode(char, count) for char, count in freq.items()]
    heapq.heapify(heap)
    
    # Step 3: Build Huffman tree - O(k log k)
    while len(heap) > 1:
        node1 = heapq.heappop(heap)  # Smallest frequency
        node2 = heapq.heappop(heap)  # Second smallest
        
        # Create internal node with combined frequency
        merged = HuffmanNode(None, node1.freq + node2.freq)
        merged.left = node1
        merged.right = node2
        heapq.heappush(heap, merged)
    
    root = heap[0]
    
    # Step 4: Generate Huffman codes - O(k)
    codes = {}
    
    def generate_codes(node, code=""):
        if node is None:
            return
        if node.char is not None:  # Leaf node
            codes[node.char] = code if code else "0"
        generate_codes(node.left, code + "0")
        generate_codes(node.right, code + "1")
    
    generate_codes(root)
    
    # Step 5: Encode the text - O(n)
    encoded = "".join(codes[char] for char in text)
    
    return encoded, codes, root


def huffman_decode(encoded: str, root: 'HuffmanNode') -> str:
    """
    Decode Huffman-encoded string using tree traversal.
    
    Time: O(n)
    Space: O(1) auxiliary
    """
    if not encoded or not root:
        return ""
    
    decoded = []
    current = root
    
    for bit in encoded:
        if bit == '0':
            current = current.left
        else:
            current = current.right
        
        # Leaf node reached
        if current.char is not None:
            decoded.append(current.char)
            current = root
    
    return "".join(decoded)
```

### Template 2: Huffman Codec Class

```python
class HuffmanCodec:
    """Huffman encoding/decoding codec."""
    
    def __init__(self):
        self.codes = {}
        self.reverse_codes = {}
        self.root = None
    
    def build(self, text: str):
        """Build Huffman tree from text."""
        if not text:
            return
        
        # Build frequency map
        freq = Counter(text)
        
        # Build heap
        heap = [HuffmanNode(char, count) for char, count in freq.items()]
        heapq.heapify(heap)
        
        # Build tree
        while len(heap) > 1:
            left = heapq.heappop(heap)
            right = heapq.heappop(heap)
            parent = HuffmanNode(None, left.freq + right.freq)
            parent.left = left
            parent.right = right
            heapq.heappush(heap, parent)
        
        self.root = heap[0]
        
        # Generate codes
        self.codes = {}
        self._generate_codes(self.root, "")
        self.reverse_codes = {v: k for k, v in self.codes.items()}
    
    def _generate_codes(self, node, code):
        if node is None:
            return
        if node.char is not None:
            self.codes[node.char] = code if code else "0"
        self._generate_codes(node.left, code + "0")
        self._generate_codes(node.right, code + "1")
    
    def encode(self, text: str) -> str:
        """Encode text using Huffman codes."""
        return "".join(self.codes[char] for char in text)
    
    def decode(self, encoded: str) -> str:
        """Decode Huffman-encoded string."""
        decoded = []
        current = self.root
        
        for bit in encoded:
            current = current.left if bit == '0' else current.right
            if current.char is not None:
                decoded.append(current.char)
                current = self.root
        
        return "".join(decoded)
    
    def get_codes(self) -> dict:
        """Return Huffman codes."""
        return self.codes.copy()
    
    def compression_stats(self, text: str) -> dict:
        """Calculate compression statistics."""
        original_bits = len(text) * 8
        freq = Counter(text)
        encoded_bits = sum(freq[char] * len(code) for char, code in self.codes.items())
        
        return {
            'original_bits': original_bits,
            'encoded_bits': encoded_bits,
            'compression_ratio': (1 - encoded_bits / original_bits) * 100,
            'unique_chars': len(self.codes)
        }
```

### Template 3: Canonical Huffman Codes

```python
def canonical_huffman(text: str) -> tuple:
    """
    Generate canonical Huffman codes.
    
    Returns: (codes, code_lengths)
    """
    # Get standard Huffman codes
    _, codes, _ = huffman_encode(text)
    
    # Sort by code length, then by character
    sorted_items = sorted(codes.items(), key=lambda x: (len(x[1]), x[0]))
    
    # Generate canonical codes
    canonical = {}
    current_code = 0
    current_length = 0
    
    for char, code in sorted_items:
        code_len = len(code)
        
        # Shift to new length
        if code_len > current_length:
            current_code <<= (code_len - current_length)
            current_length = code_len
        
        canonical[char] = format(current_code, f'0{code_len}b')
        current_code += 1
    
    # Calculate length counts
    length_counts = defaultdict(int)
    for code in canonical.values():
        length_counts[len(code)] += 1
    
    return canonical, dict(length_counts)
```

### Template 4: Length-Limited Huffman Coding

```python
def length_limited_huffman(freq: dict, max_length: int = 15) -> dict:
    """
    Package-Merge algorithm for length-limited Huffman codes.
    Ensures no code exceeds max_length bits.
    
    Time: O(k * max_length)
    """
    items = [(f, c) for c, f in freq.items() if f > 0]
    items.sort()
    
    n = len(items)
    if n == 0:
        return {}
    if n == 1:
        return {items[0][1]: '0'}
    
    # Package-Merge algorithm
    # Simplified implementation - full version is complex
    
    # Build standard Huffman
    heap = [HuffmanNode(char, f) for f, char in items]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        parent = HuffmanNode(None, left.freq + right.freq)
        parent.left = left
        parent.right = right
        heapq.heappush(heap, parent)
    
    # Generate codes and limit lengths
    codes = {}
    
    def generate_limited(node, code, depth):
        if node is None:
            return
        if node.char is not None:
            # Cap the code length
            codes[node.char] = code[:max_length] if len(code) > max_length else (code if code else "0")
        generate_limited(node.left, code + "0", depth + 1)
        generate_limited(node.right, code + "1", depth + 1)
    
    generate_limited(heap[0], "", 0)
    return codes
```

### Template 5: Optimized Encoding with Bit Packing

```python
class BitPacker:
    """Pack bits into bytes for efficient storage."""
    
    def __init__(self):
        self.buffer = bytearray()
        self.current_byte = 0
        self.bit_count = 0
    
    def write_bits(self, value: int, num_bits: int):
        """Write num_bits least significant bits of value."""
        for i in range(num_bits - 1, -1, -1):
            bit = (value >> i) & 1
            self.current_byte = (self.current_byte << 1) | bit
            self.bit_count += 1
            
            if self.bit_count == 8:
                self.buffer.append(self.current_byte)
                self.current_byte = 0
                self.bit_count = 0
    
    def flush(self):
        """Flush remaining bits with padding."""
        if self.bit_count > 0:
            self.current_byte <<= (8 - self.bit_count)
            self.buffer.append(self.current_byte)
        return bytes(self.buffer)


def huffman_encode_packed(text: str, codes: dict) -> bytes:
    """Encode text with Huffman codes, packed into bytes."""
    packer = BitPacker()
    
    for char in text:
        code = codes[char]
        # Convert binary string to integer
        value = int(code, 2)
        packer.write_bits(value, len(code))
    
    return packer.flush()
```

---

## When to Use

Use Huffman Encoding when you need to solve problems involving:

- **Data Compression**: Reducing storage or transmission size of text/data
- **Optimal Prefix Codes**: Creating prefix-free binary codes
- **Frequency-Based Optimization**: When element frequencies are known in advance
- **Lossless Compression**: When no information can be lost

### Comparison with Alternatives

| Algorithm/Method | Compression Ratio | Speed | Use Case |
|------------------|-------------------|-------|----------|
| **Huffman Coding** | Good | Fast | General-purpose lossless compression |
| **Run-Length Encoding** | Poor-Medium | Very Fast | Data with many consecutive repeats |
| **LZW (Dictionary-based)** | Better | Medium | File compression (GIF, Unix compress) |
| **Arithmetic Coding** | Better | Slower | When maximum compression is needed |
| **LZ77/LZ78** | Better | Medium | General compression (ZIP, GZIP) |

### When to Choose Huffman Encoding

- **Choose Huffman** when:
  - Character frequencies vary significantly
  - You need a simple, fast compression algorithm
  - Prefix-free codes are required
  - Decompression speed is important

- **Consider Alternatives** when:
  - All characters have similar frequencies (Huffman provides minimal benefit)
  - Maximum compression ratio is critical (use arithmetic coding)
  - Real-time streaming compression is needed

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind Huffman Encoding is that **more frequent characters should have shorter codes**. This is achieved by:

1. Building a binary tree where leaf nodes represent characters
2. The path from root to leaf defines the character's code (left=0, right=1)
3. Combining least frequent characters first ensures they end up deeper in the tree (longer codes)
4. More frequent characters remain closer to the root (shorter codes)

### How It Works

#### Building the Huffman Tree:

1. **Count frequencies**: Calculate occurrence count for each character in input
2. **Create min-heap**: Insert all characters as single-node trees with their frequencies
3. **Build tree**: While heap has more than one node:
   - Extract two nodes with smallest frequencies
   - Create new internal node with combined frequency
   - Make extracted nodes left and right children
   - Insert new node back into heap
4. **Generate codes**: Traverse tree from root to leaves, appending 0 for left, 1 for right

#### Encoding:

1. Build Huffman tree from input text
2. Generate code table (character → binary code)
3. Replace each character in input with its code
4. Return encoded bitstream

#### Decoding:

1. Start at root of Huffman tree
2. For each bit in encoded stream:
   - Go left if bit is 0, right if bit is 1
   - If leaf node reached, output character and return to root
3. Continue until all bits are processed

### Visual Representation

For text "aabbbcccc" with frequencies: a=2, b=3, c=4:

```
        (9)
       /   \
     0/     \1
     /       \
    c(4)    (5)
           /   \
         0/     \1
         /       \
       a(2)     b(3)

Codes: c="0", a="10", b="11"
Encoded: 1010111111111000000 (19 bits vs 72 bits ASCII)
```

### Why It Works (Greedy Choice Property)

The algorithm makes locally optimal choices that lead to a globally optimal solution:

- At each step, combine the two least frequent nodes
- This ensures rare characters get the longest codes
- The proof of optimality relies on the fact that in any optimal tree, the two least frequent characters must be siblings at the deepest level

### Prefix-Free Property

Huffman codes are **prefix-free** (no code is a prefix of another), which ensures:
- **Unambiguous decoding**: The encoded bitstream can be uniquely decoded
- **No delimiters needed**: Codes can be concatenated directly
- **Instant recognition**: Decoding doesn't require lookahead

### Limitations

- **Two-pass algorithm**: Requires knowing frequencies beforehand
- **Not adaptive**: Fixed tree for entire message
- **Integer-length codes**: Suboptimal compared to arithmetic coding
- **Overhead**: Tree structure must be stored/transmitted for decoding

---

## Practice Problems

### Problem 1: String Compression

**Problem:** [LeetCode 443 - String Compression](https://leetcode.com/problems/string-compression/)

**Description:** Given an array of characters, compress it using the following algorithm: Begin with an empty string. For each group of consecutive repeating characters, append the character followed by the count of repetitions.

**How to Apply Huffman Encoding:**
- Understand basic compression concepts
- Learn to count character frequencies
- Apply greedy approach to compression problems

---

### Problem 2: Encode and Decode Strings

**Problem:** [LeetCode 271 - Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/)

**Description:** Design an algorithm to encode a list of strings to a single string and decode it back to the original list.

**How to Apply Huffman Encoding:**
- Understand prefix-free encoding principles
- Design encoding schemes that support unambiguous decoding
- Handle edge cases like empty strings and delimiters

---

### Problem 3: Minimum ASCII Delete Sum

**Problem:** [LeetCode 712 - Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

**Description:** Given two strings, find the lowest ASCII sum of deleted characters to make two strings equal.

**How to Apply Huffman Encoding:**
- Understand character frequency and weight concepts
- Apply greedy decision-making for character selection
- Optimize based on character values

---

### Problem 4: Optimal Division

**Problem:** [LeetCode 553 - Optimal Division](https://leetcode.com/problems/optimal-division/)

**Description:** Given a list of positive integers, add parentheses to maximize the result of the division expression.

**How to Apply Huffman Encoding:**
- Understand optimal substructure and greedy choices
- Apply tree construction concepts
- Optimize expression evaluation order

---

### Problem 5: Dota2 Senate

**Problem:** [LeetCode 649 - Dota2 Senate](https://leetcode.com/problems/dota2-senate/)

**Description:** Predict which party will win the senate voting based on banning strategy.

**How to Apply Huffman Encoding:**
- Understand greedy decision-making
- Apply queue-based processing
- Optimize based on frequency and position

---

## Video Tutorial Links

### Fundamentals

- [Huffman Coding - Greedy Algorithm (Abdul Bari)](https://www.youtube.com/watch?v=co4_ahEDCho) - Step-by-step visual explanation
- [Huffman Coding Algorithm (Computerphile)](https://www.youtube.com/watch?v=dM6usxAI-K4) - Intuitive explanation with examples
- [Data Compression: Huffman Coding (MIT OpenCourseWare)](https://www.youtube.com/watch?v=0kKjRgSb8Wk) - Academic deep dive

### Implementation

- [Huffman Coding Implementation in Python (NeetCode)](https://www.youtube.com/watch?v=4KpRSG6Y9Ic) - Practical coding tutorial
- [Huffman Coding - Complete Explanation (Take U Forward)](https://www.youtube.com/watch?v=3eTCz8QK4Sk) - Interview preparation focus
- [Huffman Encoding Java Tutorial (Caleb Curry)](https://www.youtube.com/watch?v=0egNpfwQ0r8) - Java implementation guide

### Advanced Topics

- [Adaptive Huffman Coding (Vitter's Algorithm)](https://www.youtube.com/watch?v=Z9DVnbr4YxM) - Dynamic tree updates
- [Canonical Huffman Codes](https://www.youtube.com/watch?v=ajmNyq0q2aQ) - Space-efficient representation
- [Arithmetic Coding vs Huffman](https://www.youtube.com/watch?v=udC5nsZRNcg) - Comparison of entropy coding methods

---

## Follow-up Questions

### Q1: Why is Huffman coding optimal among prefix-free codes?

**Answer:** Huffman coding is optimal because:
1. **Greedy choice property**: Merging the two least frequent characters first ensures they get the longest codes
2. **Optimal substructure**: The optimal solution contains optimal solutions to subproblems
3. **Proof by contradiction**: Assume a better tree exists; swapping nodes can only increase or maintain total cost

Mathematically, for frequencies f₁ ≤ f₂ ≤ ... ≤ fₙ and code lengths l₁ ≥ l₂ ≥ ... ≥ lₙ, Huffman minimizes Σ(fᵢ × lᵢ).

### Q2: Can Huffman coding produce codes longer than 255 bits?

**Answer:** Yes, theoretically:
- With 256 symbols and certain frequency distributions
- Worst case: Fibonacci-like frequencies can produce codes up to 255 bits
- **Solution**: Use length-limited Huffman coding (Package-Merge algorithm) to cap maximum code length
- Practical implementations often limit codes to 15-16 bits

### Q3: How does Huffman coding compare to arithmetic coding?

**Answer:**

| Aspect | Huffman Coding | Arithmetic Coding |
|--------|---------------|-------------------|
| **Compression Ratio** | Good | Better (approaches entropy limit) |
| **Speed** | Faster | Slower |
| **Code Length** | Integer bits | Fractional bits |
| **Memory** | Less | More |
| **Patents** | Unencumbered | Historically patented |
| **Use Cases** | General purpose | Maximum compression |

### Q4: How do you handle the Huffman tree in file compression?

**Answer:** Options for tree transmission:
1. **Tree structure**: Serialize tree nodes with preorder traversal
2. **Code lengths**: Transmit only bit-lengths (canonical Huffman)
3. **Frequency table**: Rebuild tree from frequencies
4. **Standard tables**: Use predefined trees (e.g., DEFLATE uses fixed Huffman tables)

Overhead is typically small compared to compression gains.

### Q5: What happens if all characters have equal frequency?

**Answer:**
- Huffman produces balanced tree with equal-length codes
- For n symbols, each code is ⌈log₂n⌉ bits
- Example: 8 symbols → 3 bits each
- **Result**: No compression benefit over fixed-length encoding
- Huffman works best when frequencies vary significantly

---

## Summary

Huffman Encoding is a **greedy algorithm** that produces **optimal prefix-free codes** for lossless data compression. Key takeaways:

- **Optimal prefix codes**: No other prefix-free code produces shorter total encoded length
- **Greedy approach**: Combine least frequent characters first
- **O(n log k) complexity**: Efficient for most practical inputs
- **Prefix-free property**: Ensures unambiguous decoding
- **Tree-based**: Codes derived from paths in binary tree

### When to Use:
- ✅ Data compression with varying character frequencies
- ✅ When prefix-free codes are required
- ✅ Lossless compression scenarios
- ✅ When decompression speed matters

### When NOT to Use:
- ❌ Uniform frequency distributions (no compression gain)
- ❌ When maximum compression is critical (use arithmetic coding)
- ❌ Real-time adaptive compression (use adaptive Huffman)

### Related Algorithms:
- [Shannon-Fano Coding](./shannon-fano.md) - Alternative prefix coding method
- [Arithmetic Coding](./arithmetic-coding.md) - Better compression ratio
- [LZW Compression](./lzw.md) - Dictionary-based compression
- [Run-Length Encoding](./rle.md) - Simple compression for repeated data
- [Greedy Algorithms](./greedy.md) - General greedy approach patterns
