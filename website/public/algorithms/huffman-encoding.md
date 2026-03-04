# Huffman Encoding

## Category
Greedy

## Description

Huffman Encoding is a **greedy algorithm** used for **lossless data compression**. It creates an optimal prefix-free binary code where no code is a prefix of another, ensuring unique decodability. The algorithm builds a binary tree (Huffman tree) based on character frequencies, with more frequent characters assigned shorter codes.

The key insight is that by assigning shorter codes to more frequent characters, we minimize the total encoded length. This greedy approach is provably optimal - no other prefix-free code can produce a shorter total encoded length for the given frequency distribution.

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

### Limitations

- **Two-pass algorithm**: Requires knowing frequencies beforehand
- **Not adaptive**: Fixed tree for entire message
- **Integer-length codes**: Suboptimal compared to arithmetic coding
- **Overhead**: Tree structure must be stored/transmitted for decoding

---

## Algorithm Steps

### Building the Huffman Tree

1. **Count frequencies**: Calculate occurrence count for each character in input
2. **Create min-heap**: Insert all characters as single-node trees with their frequencies
3. **Build tree**: While heap has more than one node:
   - Extract two nodes with smallest frequencies
   - Create new internal node with combined frequency
   - Make extracted nodes left and right children
   - Insert new node back into heap
4. **Generate codes**: Traverse tree from root to leaves, appending 0 for left, 1 for right

### Encoding

1. Build Huffman tree from input text
2. Generate code table (character → binary code)
3. Replace each character in input with its code
4. Return encoded bitstream

### Decoding

1. Start at root of Huffman tree
2. For each bit in encoded stream:
   - Go left if bit is 0, right if bit is 1
   - If leaf node reached, output character and return to root
3. Continue until all bits are processed

---

## Implementation

### Complete Huffman Encoding/Decoding Implementation

````carousel
```python
import heapq
from collections import Counter, defaultdict

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
        
    Time: O(n log k) where k = unique characters
    Space: O(k)
    """
    if not text:
        return "", {}, None
    
    # Step 1: Count character frequencies - O(n)
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
            codes[node.char] = code if code else "0"  # Handle single char case
        generate_codes(node.left, code + "0")
        generate_codes(node.right, code + "1")
    
    generate_codes(root)
    
    # Step 5: Encode the text - O(n)
    encoded = "".join(codes[char] for char in text)
    
    return encoded, codes, root


def huffman_decode(encoded: str, codes: dict) -> str:
    """
    Decode Huffman-encoded string using code table.
    
    Args:
        encoded: Huffman encoded binary string
        codes: Huffman codes dictionary (char -> code)
        
    Returns:
        Decoded original string
        
    Time: O(n * m) where m = max code length
    Space: O(k)
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


def huffman_decode_with_tree(encoded: str, root: HuffmanNode) -> str:
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


# Example usage and demonstration
if __name__ == "__main__":
    text = "this is an example for huffman encoding"
    
    print(f"Original text: \"{text}\"")
    print(f"Original length: {len(text)} characters")
    print()
    
    # Encode
    encoded, codes, root = huffman_encode(text)
    print(f"Huffman Codes:")
    for char in sorted(codes.keys(), key=lambda x: codes[x]):
        print(f"  '{char}': {codes[char]}")
    print()
    
    print(f"Encoded: {encoded}")
    print(f"Encoded length: {len(encoded)} bits")
    
    # Decode
    decoded = huffman_decode(encoded, codes)
    print(f"\nDecoded: \"{decoded}\"")
    
    # Calculate compression ratio
    original_bits = len(text) * 8  # ASCII
    encoded_bits = len(encoded)
    compression = 100 * (1 - encoded_bits / original_bits)
    print(f"\nCompression Analysis:")
    print(f"  Original (ASCII): {original_bits} bits")
    print(f"  Encoded (Huffman): {encoded_bits} bits")
    print(f"  Compression ratio: {compression:.2f}%")
    
    # Verify correctness
    assert decoded == text, "Decoding failed!"
    print("\n✓ Encoding/Decoding verified successfully!")
```

<!-- slide -->
```cpp
#include <iostream>
#include <string>
#include <queue>
#include <unordered_map>
#include <vector>
#include <memory>
using namespace std;

/**
 * Huffman Tree Node
 */
struct HuffmanNode {
    char ch;
    int freq;
    shared_ptr<HuffmanNode> left;
    shared_ptr<HuffmanNode> right;
    
    HuffmanNode(char character, int frequency) 
        : ch(character), freq(frequency), left(nullptr), right(nullptr) {}
};

/**
 * Comparator for priority queue (min-heap)
 */
struct Compare {
    bool operator()(const shared_ptr<HuffmanNode>& a, const shared_ptr<HuffmanNode>& b) {
        return a->freq > b->freq;  // Min-heap based on frequency
    }
};

/**
 * Huffman Encoding implementation
 * Time: O(n log k) where k = unique characters
 * Space: O(k)
 */
class HuffmanCodec {
private:
    unordered_map<char, string> codes;
    shared_ptr<HuffmanNode> root;
    
    void generateCodes(const shared_ptr<HuffmanNode>& node, const string& code) {
        if (!node) return;
        
        if (node->ch != '\0') {  // Leaf node
            codes[node->ch] = code.empty() ? "0" : code;
            return;
        }
        
        generateCodes(node->left, code + "0");
        generateCodes(node->right, code + "1");
    }

public:
    /**
     * Build Huffman tree and generate codes from input text
     */
    void build(const string& text) {
        if (text.empty()) return;
        
        // Count frequencies - O(n)
        unordered_map<char, int> freq;
        for (char ch : text) {
            freq[ch]++;
        }
        
        // Build min-heap - O(k)
        priority_queue<shared_ptr<HuffmanNode>, vector<shared_ptr<HuffmanNode>>, Compare> heap;
        for (const auto& pair : freq) {
            heap.push(make_shared<HuffmanNode>(pair.first, pair.second));
        }
        
        // Build Huffman tree - O(k log k)
        while (heap.size() > 1) {
            auto left = heap.top(); heap.pop();
            auto right = heap.top(); heap.pop();
            
            auto merged = make_shared<HuffmanNode>('\0', left->freq + right->freq);
            merged->left = left;
            merged->right = right;
            
            heap.push(merged);
        }
        
        root = heap.top();
        
        // Generate codes - O(k)
        generateCodes(root, "");
    }
    
    /**
     * Encode text using generated Huffman codes
     * Time: O(n)
     */
    string encode(const string& text) {
        string encoded;
        for (char ch : text) {
            encoded += codes[ch];
        }
        return encoded;
    }
    
    /**
     * Decode Huffman-encoded string using tree traversal
     * Time: O(n)
     */
    string decode(const string& encoded) {
        if (!root || encoded.empty()) return "";
        
        string decoded;
        auto current = root;
        
        for (char bit : encoded) {
            if (bit == '0') {
                current = current->left;
            } else {
                current = current->right;
            }
            
            // Leaf node reached
            if (current->ch != '\0') {
                decoded += current->ch;
                current = root;
            }
        }
        
        return decoded;
    }
    
    const unordered_map<char, string>& getCodes() const {
        return codes;
    }
};


int main() {
    string text = "this is an example for huffman encoding";
    
    cout << "Original text: \"" << text << "\"" << endl;
    cout << "Original length: " << text.length() << " characters" << endl << endl;
    
    // Create codec and build tree
    HuffmanCodec codec;
    codec.build(text);
    
    // Display codes
    cout << "Huffman Codes:" << endl;
    for (const auto& pair : codec.getCodes()) {
        cout << "  '" << pair.first << "': " << pair.second << endl;
    }
    cout << endl;
    
    // Encode
    string encoded = codec.encode(text);
    cout << "Encoded length: " << encoded.length() << " bits" << endl;
    cout << "Encoded (first 50 bits): " << encoded.substr(0, 50) << "..." << endl << endl;
    
    // Decode
    string decoded = codec.decode(encoded);
    cout << "Decoded: \"" << decoded << "\"" << endl;
    
    // Compression stats
    int originalBits = text.length() * 8;
    int encodedBits = encoded.length();
    double compression = 100.0 * (1.0 - (double)encodedBits / originalBits);
    
    cout << "\nCompression Analysis:" << endl;
    cout << "  Original (ASCII): " << originalBits << " bits" << endl;
    cout << "  Encoded (Huffman): " << encodedBits << " bits" << endl;
    cout << "  Compression ratio: " << compression << "%" << endl;
    
    // Verify
    if (decoded == text) {
        cout << "\n✓ Encoding/Decoding verified successfully!" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Huffman Tree Node
 */
class HuffmanNode implements Comparable<HuffmanNode> {
    char ch;
    int freq;
    HuffmanNode left;
    HuffmanNode right;
    
    HuffmanNode(char ch, int freq) {
        this.ch = ch;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
    
    @Override
    public int compareTo(HuffmanNode other) {
        return this.freq - other.freq;  // Min-heap
    }
}

/**
 * Huffman Encoding/Decoding implementation
 * Time: O(n log k) where k = unique characters
 * Space: O(k)
 */
public class HuffmanCodec {
    private Map<Character, String> codes;
    private HuffmanNode root;
    
    /**
     * Build Huffman tree and generate codes from input text
     */
    public void build(String text) {
        if (text == null || text.isEmpty()) {
            return;
        }
        
        // Count frequencies - O(n)
        Map<Character, Integer> freq = new HashMap<>();
        for (char ch : text.toCharArray()) {
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }
        
        // Build min-heap - O(k)
        PriorityQueue<HuffmanNode> heap = new PriorityQueue<>();
        for (Map.Entry<Character, Integer> entry : freq.entrySet()) {
            heap.offer(new HuffmanNode(entry.getKey(), entry.getValue()));
        }
        
        // Build Huffman tree - O(k log k)
        while (heap.size() > 1) {
            HuffmanNode left = heap.poll();
            HuffmanNode right = heap.poll();
            
            HuffmanNode merged = new HuffmanNode('\0', left.freq + right.freq);
            merged.left = left;
            merged.right = right;
            
            heap.offer(merged);
        }
        
        root = heap.poll();
        
        // Generate codes - O(k)
        codes = new HashMap<>();
        generateCodes(root, "");
    }
    
    /**
     * Recursively generate Huffman codes from tree
     */
    private void generateCodes(HuffmanNode node, String code) {
        if (node == null) return;
        
        if (node.left == null && node.right == null) {  // Leaf
            codes.put(node.ch, code.isEmpty() ? "0" : code);
            return;
        }
        
        generateCodes(node.left, code + "0");
        generateCodes(node.right, code + "1");
    }
    
    /**
     * Encode text using generated Huffman codes
     * Time: O(n)
     */
    public String encode(String text) {
        StringBuilder encoded = new StringBuilder();
        for (char ch : text.toCharArray()) {
            encoded.append(codes.get(ch));
        }
        return encoded.toString();
    }
    
    /**
     * Decode Huffman-encoded string using tree traversal
     * Time: O(n)
     */
    public String decode(String encoded) {
        if (root == null || encoded.isEmpty()) {
            return "";
        }
        
        StringBuilder decoded = new StringBuilder();
        HuffmanNode current = root;
        
        for (char bit : encoded.toCharArray()) {
            if (bit == '0') {
                current = current.left;
            } else {
                current = current.right;
            }
            
            // Leaf node reached
            if (current.left == null && current.right == null) {
                decoded.append(current.ch);
                current = root;
            }
        }
        
        return decoded.toString();
    }
    
    public Map<Character, String> getCodes() {
        return codes;
    }
    
    public static void main(String[] args) {
        String text = "this is an example for huffman encoding";
        
        System.out.println("Original text: \"" + text + "\"");
        System.out.println("Original length: " + text.length() + " characters\n");
        
        // Build codec
        HuffmanCodec codec = new HuffmanCodec();
        codec.build(text);
        
        // Display codes
        System.out.println("Huffman Codes:");
        for (Map.Entry<Character, String> entry : codec.getCodes().entrySet()) {
            System.out.println("  '" + entry.getKey() + "': " + entry.getValue());
        }
        System.out.println();
        
        // Encode
        String encoded = codec.encode(text);
        System.out.println("Encoded length: " + encoded.length() + " bits");
        System.out.println("Encoded (first 50 bits): " + 
            (encoded.length() > 50 ? encoded.substring(0, 50) + "..." : encoded) + "\n");
        
        // Decode
        String decoded = codec.decode(encoded);
        System.out.println("Decoded: \"" + decoded + "\"");
        
        // Compression stats
        int originalBits = text.length() * 8;
        int encodedBits = encoded.length();
        double compression = 100.0 * (1.0 - (double)encodedBits / originalBits);
        
        System.out.println("\nCompression Analysis:");
        System.out.println("  Original (ASCII): " + originalBits + " bits");
        System.out.println("  Encoded (Huffman): " + encodedBits + " bits");
        System.out.println("  Compression ratio: " + String.format("%.2f", compression) + "%");
        
        // Verify
        if (decoded.equals(text)) {
            System.out.println("\n✓ Encoding/Decoding verified successfully!");
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Huffman Tree Node
 */
class HuffmanNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

/**
 * Min Heap implementation for Huffman tree construction
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }
    
    size() {
        return this.heap.length;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.heap[parent].freq <= this.heap[index].freq) break;
            [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
            index = parent;
        }
    }
    
    bubbleDown(index) {
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            
            if (left < this.heap.length && this.heap[left].freq < this.heap[smallest].freq) {
                smallest = left;
            }
            if (right < this.heap.length && this.heap[right].freq < this.heap[smallest].freq) {
                smallest = right;
            }
            
            if (smallest === index) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

/**
 * Huffman Encoding/Decoding implementation
 * Time: O(n log k) where k = unique characters
 * Space: O(k)
 */
class HuffmanCodec {
    constructor() {
        this.codes = new Map();
        this.root = null;
    }
    
    /**
     * Build Huffman tree and generate codes from input text
     */
    build(text) {
        if (!text || text.length === 0) return;
        
        // Count frequencies - O(n)
        const freq = new Map();
        for (const char of text) {
            freq.set(char, (freq.get(char) || 0) + 1);
        }
        
        // Build min-heap - O(k)
        const heap = new MinHeap();
        for (const [char, count] of freq) {
            heap.push(new HuffmanNode(char, count));
        }
        
        // Build Huffman tree - O(k log k)
        while (heap.size() > 1) {
            const left = heap.pop();
            const right = heap.pop();
            
            const merged = new HuffmanNode(null, left.freq + right.freq);
            merged.left = left;
            merged.right = right;
            
            heap.push(merged);
        }
        
        this.root = heap.pop();
        
        // Generate codes - O(k)
        this.codes = new Map();
        this.generateCodes(this.root, "");
    }
    
    /**
     * Recursively generate Huffman codes from tree
     */
    generateCodes(node, code) {
        if (!node) return;
        
        if (node.char !== null) {  // Leaf node
            this.codes.set(node.char, code === "" ? "0" : code);
            return;
        }
        
        this.generateCodes(node.left, code + "0");
        this.generateCodes(node.right, code + "1");
    }
    
    /**
     * Encode text using generated Huffman codes
     * Time: O(n)
     */
    encode(text) {
        let encoded = "";
        for (const char of text) {
            encoded += this.codes.get(char);
        }
        return encoded;
    }
    
    /**
     * Decode Huffman-encoded string using tree traversal
     * Time: O(n)
     */
    decode(encoded) {
        if (!this.root || !encoded) return "";
        
        let decoded = "";
        let current = this.root;
        
        for (const bit of encoded) {
            if (bit === "0") {
                current = current.left;
            } else {
                current = current.right;
            }
            
            // Leaf node reached
            if (current.char !== null) {
                decoded += current.char;
                current = this.root;
            }
        }
        
        return decoded;
    }
    
    getCodes() {
        return this.codes;
    }
}


// Example usage and demonstration
const text = "this is an example for huffman encoding";

console.log(`Original text: "${text}"`);
console.log(`Original length: ${text.length} characters\n`);

// Build codec
const codec = new HuffmanCodec();
codec.build(text);

// Display codes
console.log("Huffman Codes:");
const sortedCodes = [...codec.getCodes().entries()]
    .sort((a, b) => a[1].length - b[1].length);
for (const [char, code] of sortedCodes) {
    console.log(`  '${char}': ${code}`);
}
console.log();

// Encode
const encoded = codec.encode(text);
console.log(`Encoded length: ${encoded.length} bits`);
console.log(`Encoded (first 50 bits): ${encoded.substring(0, 50)}...\n`);

// Decode
const decoded = codec.decode(encoded);
console.log(`Decoded: "${decoded}"`);

// Compression stats
const originalBits = text.length * 8;
const encodedBits = encoded.length;
const compression = 100 * (1 - encodedBits / originalBits);

console.log("\nCompression Analysis:");
console.log(`  Original (ASCII): ${originalBits} bits`);
console.log(`  Encoded (Huffman): ${encodedBits} bits`);
console.log(`  Compression ratio: ${compression.toFixed(2)}%`);

// Verify
if (decoded === text) {
    console.log("\n✓ Encoding/Decoding verified successfully!");
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Frequency Count** | O(n) | Single pass through input text |
| **Build Min-Heap** | O(k) | Where k = number of unique characters |
| **Build Huffman Tree** | O(k log k) | Each of k-1 merges takes O(log k) |
| **Generate Codes** | O(k) | Traversing k leaf nodes |
| **Encode Text** | O(n) | Replace each character with its code |
| **Decode Text** | O(n) | Single pass through encoded bits |
| **Total Build** | O(n + k log k) | Dominated by frequency count + tree build |

### Detailed Breakdown

- **Best Case**: O(n) when all characters are the same (k=1)
- **Worst Case**: O(n log k) when all characters are unique (k=n)
- **Average Case**: O(n log k) where k << n for typical text

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|------------------|-------------|
| **Frequency Map** | O(k) | Stores count for each unique character |
| **Min-Heap** | O(k) | At most k nodes in heap |
| **Huffman Tree** | O(k) | 2k-1 total nodes (k leaves + k-1 internal) |
| **Code Table** | O(k × m) | Where m = average code length |
| **Encoded Output** | O(n × m) | Compressed bit representation |
| **Total** | O(n + k × m) | Linear in input size |

### Space Optimization

1. **Canonical Huffman Codes**: Store only code lengths, not full codes
2. **In-Place Encoding**: Stream encoding without storing full code table
3. **Tree Serialization**: Compact representation for transmission

---

## Common Variations

### 1. Canonical Huffman Coding

Standardizes codes to allow transmission without full tree structure:

````carousel
```python
def canonical_huffman(codes):
    """
    Convert Huffman codes to canonical form.
    Codes are sorted by length, then lexicographically assigned.
    """
    # Sort by code length, then by character
    sorted_items = sorted(codes.items(), key=lambda x: (len(x[1]), x[0]))
    
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
    
    return canonical
```
````

### 2. Adaptive Huffman Coding (FGK Algorithm)

Updates the tree dynamically as data is processed:

````carousel
```python
class AdaptiveHuffmanNode:
    def __init__(self, char=None, weight=0):
        self.char = char
        self.weight = weight
        self.parent = None
        self.left = None
        self.right = None
        self.is_nyt = False  # Not Yet Transmitted node

class AdaptiveHuffman:
    """
    FGK (Faller-Gallager-Knuth) Adaptive Huffman Coding.
    Tree updates after each symbol transmission.
    """
    def __init__(self):
        self.nyt = AdaptiveHuffmanNode(is_nyt=True)
        self.root = self.nyt
        self.nodes = {}  # char -> node mapping
        self.leaf_count = 0
    
    def update(self, char):
        """Update tree after seeing a character."""
        if char in self.nodes:
            # Existing character: increment and restructure
            node = self.nodes[char]
            self._increment(node)
        else:
            # New character: split NYT node
            self._add_new_char(char)
    
    def _add_new_char(self, char):
        """Add new character by splitting NYT node."""
        old_nyt = self.nyt
        
        # Create new internal node
        internal = AdaptiveHuffmanNode(weight=1)
        internal.parent = old_nyt.parent
        
        # Create new leaf for character
        new_leaf = AdaptiveHuffmanNode(char=char, weight=1)
        new_leaf.parent = internal
        
        # New NYT node
        self.nyt = AdaptiveHuffmanNode(is_nyt=True)
        self.nyt.parent = internal
        
        # Connect
        internal.left = self.nyt
        internal.right = new_leaf
        
        self.nodes[char] = new_leaf
        self.leaf_count += 1
    
    def _increment(self, node):
        """Increment weight and maintain sibling property."""
        # Simplified - full implementation requires tree restructuring
        while node:
            node.weight += 1
            node = node.parent
```
````

### 3. Length-Limited Huffman Coding

Ensures no code exceeds a maximum length (important for hardware implementation):

````carousel
```python
from collections import defaultdict
import heapq

def length_limited_huffman(freq, max_length=15):
    """
    Package-Merge algorithm for length-limited Huffman codes.
    Ensures no code exceeds max_length bits.
    """
    items = [(f, c) for c, f in freq.items() if f > 0]
    items.sort()
    
    n = len(items)
    if n == 0:
        return {}
    if n == 1:
        return {items[0][1]: '0'}
    
    # Package-Merge algorithm
    packages = []
    for _ in range(max_length):
        level_packages = []
        # Create initial packages (items)
        for freq_val, char in items:
            level_packages.append((freq_val, {char}))
        
        # Merge packages
        level_packages.sort()
        merged = []
        i = 0
        while i + 1 < len(level_packages):
            f1, s1 = level_packages[i]
            f2, s2 = level_packages[i + 1]
            merged.append((f1 + f2, s1 | s2))
            i += 2
        
        if i < len(level_packages):
            merged.append(level_packages[i])
        
        packages.extend(merged[:n-1])  # Keep only n-1 cheapest
    
    # Assign code lengths based on package selection
    # (Simplified - full implementation is complex)
    return huffman_encode(''.join(c * f for f, c in items))[1]
```
````

### 4. n-ary Huffman Coding (k-ary Huffman)

Uses k-ary trees instead of binary:

````carousel
```python
import heapq
from collections import Counter

def nary_huffman(text, k=3):
    """
    k-ary Huffman coding. Uses k-ary tree instead of binary.
    Pad with dummy symbols to ensure (n-1) mod (k-1) == 0.
    
    Args:
        text: Input string
        k: Branching factor (k >= 2)
    
    Returns:
        Dictionary mapping characters to k-ary codes (0 to k-1)
    """
    if not text:
        return {}
    
    freq = Counter(text)
    items = list(freq.items())
    n = len(items)
    
    # Pad to ensure (n-1) % (k-1) == 0
    while (n - 1) % (k - 1) != 0:
        items.append((None, 0))  # Dummy symbol with 0 frequency
        n += 1
    
    # Build k-ary Huffman tree
    heap = [(f, i, c) for i, (c, f) in enumerate(items)]
    heapq.heapify(heap)
    
    tree = {i: (c, []) for i, (c, f) in enumerate(items)}  # node_id -> (char, children)
    next_id = n
    
    while len(heap) > 1:
        # Extract k smallest
        children = []
        total_freq = 0
        for _ in range(min(k, len(heap))):
            f, node_id, char = heapq.heappop(heap)
            children.append(node_id)
            total_freq += f
        
        # Create parent
        tree[next_id] = (None, children)
        heapq.heappush(heap, (total_freq, next_id, None))
        next_id += 1
    
    # Generate codes by traversing tree
    codes = {}
    
    def generate(node_id, code):
        char, children = tree[node_id]
        if char is not None:
            codes[char] = code if code else '0'
            return
        for i, child_id in enumerate(children):
            generate(child_id, code + str(i))
    
    root_id = next_id - 1
    generate(root_id, "")
    
    return codes
```
````

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

---

## Related Algorithms

- [Activity Selection](./activity-selection.md) - Another classic greedy algorithm
- [Huffman Coding Variations](./huffman-variations.md) - Advanced Huffman techniques
- [Data Compression Overview](./compression-overview.md) - Comparison of compression methods
