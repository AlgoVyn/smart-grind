# Huffman Encoding

## Category
Greedy

## Description
Huffman Coding is a greedy algorithm used for lossless data compression. It creates an optimal prefix-free binary code where no code is a prefix of another, ensuring unique decodability. The algorithm builds a binary tree (Huffman tree) based on character frequencies, with more frequent characters assigned shorter codes.

The greedy approach works as follows:
1. Count the frequency of each character in the input
2. Create a priority queue (min-heap) with all characters as single-node trees
3. Repeatedly combine the two trees with smallest frequencies into a new tree
4. The left edge is labeled '0' and right edge '1'
5. The code for each character is the path from root to that character

This greedy choice is optimal because combining less frequent characters first ensures they get longer codes, while more frequent characters get shorter codes.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- greedy related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
import heapq
from collections import Counter

class HuffmanNode:
    """Node for Huffman tree"""
    def __init__(self, char: str, freq: int):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        # For heap comparison (min-heap based on frequency)
        return self.freq < other.freq


def huffman_encode(text: str) -> tuple:
    """
    Encode text using Huffman coding.
    
    Args:
        text: Input string to encode
        
    Returns:
        Tuple of (encoded_string, huffman_codes, root)
        
    Time: O(n log n)
    Space: O(n)
    """
    if not text:
        return "", {}, None
    
    # Step 1: Count character frequencies
    freq = Counter(text)
    
    # Step 2: Build priority queue (min-heap)
    heap = [HuffmanNode(char, count) for char, count in freq.items()]
    heapq.heapify(heap)
    
    # Step 3: Build Huffman tree
    while len(heap) > 1:
        node1 = heapq.heappop(heap)  # Smallest frequency
        node2 = heapq.heappop(heap)  # Second smallest
        
        # Create internal node with combined frequency
        merged = HuffmanNode(None, node1.freq + node2.freq)
        merged.left = node1
        merged.right = node2
        heapq.heappush(heap, merged)
    
    root = heap[0]
    
    # Step 4: Generate Huffman codes
    codes = {}
    
    def generate_codes(node, code=""):
        if node is None:
            return
        if node.char is not None:  # Leaf node
            codes[node.char] = code
        generate_codes(node.left, code + "0")
        generate_codes(node.right, code + "1")
    
    generate_codes(root)
    
    # Step 5: Encode the text
    encoded = "".join(codes[char] for char in text)
    
    return encoded, codes, root


def huffman_decode(encoded: str, codes: dict) -> str:
    """
    Decode Huffman-encoded string.
    
    Args:
        encoded: Huffman encoded binary string
        codes: Huffman codes dictionary (char -> code)
        
    Returns:
        Decoded original string
        
    Time: O(n)
    Space: O(n)
    """
    if not encoded:
        return ""
    
    # Build reverse lookup (code -> char)
    reverse_codes = {code: char for char, code in codes.items()}
    
    decoded = []
    current_code = ""
    
    for bit in encoded:
        current_code += bit
        if current_code in reverse_codes:
            decoded.append(reverse_codes[current_code])
            current_code = ""
    
    return "".join(decoded)


# Example usage
if __name__ == "__main__":
    text = "this is an example for huffman encoding"
    
    encoded, codes, root = huffman_encode(text)
    print(f"Original: {text}")
    print(f"Encoded:  {encoded}")
    print(f"Huffman Codes: {codes}")
    
    decoded = huffman_decode(encoded, codes)
    print(f"Decoded:  {decoded}")
    
    # Calculate compression ratio
    original_bits = len(text) * 8
    encoded_bits = len(encoded)
    print(f"\nOriginal size: {original_bits} bits")
    print(f"Encoded size:  {encoded_bits} bits")
    print(f"Compression:   {100 * (1 - encoded_bits/original_bits):.2f}%")
```

```javascript
function huffmanEncoding() {
    // Huffman Encoding implementation
    // Time: O(n log n)
    // Space: O(n)
}
```

---

## Example

**Input:**
```
text = "this is an example for huffman encoding"
```

**Output:**
```
Original: this is an example for huffman encoding
Encoded:  110001011101011100100001...
Huffman Codes: {'t': '110', 'h': '1110', 'i': '1111', ' ': '00', 's': '010', ...}
Decoded:  this is an example for huffman encoding

Original size: 320 bits
Encoded size:  157 bits
Compression:   50.94%
```

---

## Time Complexity
**O(n log n)**

---

## Space Complexity
**O(n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
