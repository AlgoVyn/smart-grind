# Rabin-Karp

## Category
Advanced

## Description
Rabin-Karp is a string matching algorithm that uses **rolling hash** to find patterns in text efficiently. It combines the power of hashing with the sliding window technique to search for one or more patterns in a larger text string in average O(n + m) time complexity.

---

## When to Use

Use the Rabin-Karp algorithm when you need to solve problems involving:

- **Single Pattern Matching**: Find a pattern within a text string
- **Multiple Pattern Search**: Search for multiple patterns simultaneously (the algorithm's key advantage)
- **Plagiarism Detection**: Compare documents for similarity
- **String Searching in DNA Sequences**: Find substrings in biological data
- **Text Editing**: Find and replace operations

### Comparison with Alternatives

| Algorithm | Best Case | Average Case | Worst Case | Space | Multiple Patterns |
|-----------|-----------|--------------|-------------|-------|-------------------|
| **Rabin-Karp** | O(n + m) | O(n + m) | O(nm) | O(1) | ✅ Yes |
| **Naive** | O(m) | O(nm) | O(nm) | O(1) | ❌ No |
| **KMP** | O(n + m) | O(n + m) | O(n + m) | O(m) | ❌ No |
| **Boyer-Moore** | O(n/m) | O(n/m) | O(nm) | O(m) | ❌ No |

### When to Choose Rabin-Karp vs Other Algorithms

- **Choose Rabin-Karp** when:
  - You need to search for multiple patterns at once
  - You want a simple implementation with good average performance
  - Hash collisions can be handled with verification

- **Choose KMP** when:
  - You need guaranteed linear time performance
  - You only search for a single pattern
  - Worst-case guarantee matters more than average case

- **Choose Boyer-Moore** when:
  - Alphabet size is large
  - Patterns are long
  - You want best practical performance for single pattern

---

## Algorithm Explanation

### Core Concept

The Rabin-Karp algorithm uses the concept of **rolling hash** - a hash function where the input is hashed in a window that slides through the text. Instead of comparing strings character by character, we compare their hash values. If hash values match, we verify the actual strings to handle hash collisions.

### How It Works

#### Rolling Hash Formula:
```
hash("s[0...m-1]") = s[0] × d^(m-1) + s[1] × d^(m-2) + ... + s[m-1] × d^0 (mod q)

Where:
- d = base (number of possible characters, e.g., 256 for ASCII)
- q = large prime number (modulus to prevent overflow)
```

#### Rolling Update:
```
hash("s[i+1...i+m]") = (d × (hash("s[i...i+m-1]") - s[i] × h) + s[i+m]) mod q

Where h = d^(m-1) mod q
```

### Algorithm Steps

1. **Precompute**: Calculate hash value of the pattern
2. **Initialize**: Calculate hash of the first window in text (same length as pattern)
3. **Compare**: For each position, if hash values match, verify with direct string comparison
4. **Roll**: Efficiently update hash using the rolling formula for next window
5. **Repeat**: Continue until end of text

### Visual Example

```
Text: "AABAACAADAABAABA"
Pattern: "AABA"

Step 1: Calculate pattern hash
hash("AABA") → some hash value based on characters

Step 2: Slide through text
Position 0: "AABA" → hash matches → verify ✓ → found at index 0
Position 1: "ABAA" → hash doesn't match
Position 2: "BAAC" → hash doesn't match
...
Position 9: "AABA" → hash matches → verify ✓ → found at index 9
Position 12: "AABA" → hash matches → verify ✓ → found at index 12

Result: [0, 9, 12]
```

### Why Verification is Important

Since multiple strings can have the same hash value (collision), we must verify the actual strings when hashes match. This ensures correctness at the cost of only O(1) extra check per potential match.

### Limitations

- **Hash Collisions**: Can cause false positives (mitigated by verification)
- **Worst Case**: O(nm) when many spurious hits occur
- **Prime Selection**: Choosing a good prime affects collision rate
- **Numerical Overflow**: Use modulo to prevent overflow

---

## Algorithm Steps

### Step-by-Step Approach

1. **Choose Parameters**:
   - Select base `d` (typically 256 for ASCII characters)
   - Select modulus `q` (a large prime number like 101, 1000003)

2. **Calculate Pattern Hash**:
   - Convert each character to numeric value
   - Compute: `pattern_hash = Σ(pattern[i] × d^(m-1-i)) mod q`

3. **Calculate Initial Text Hash**:
   - Compute hash for first `m` characters of text

4. **Slide Window**:
   - For each position i from 0 to n-m:
     - If `pattern_hash == text_hash`: verify by comparing strings
     - Update `text_hash` for next position using rolling formula

5. **Handle Negative Values**:
   - After subtraction, add modulus if value is negative

---

## Implementation

### Template Code (Pattern Matching)

````carousel
```python
def rabin_karp(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using Rabin-Karp algorithm.
    
    Args:
        text: String to search in
        pattern: Pattern to search for
    
    Returns:
        List of starting indices where pattern is found
    
    Time: O(n + m) average, O(nm) worst
    Space: O(1)
    """
    n, m = len(text), len(pattern)
    
    # Edge cases
    if m == 0:
        return [0]  # Empty pattern matches at start
    if n < m:
        return []
    
    # Base and modulus
    d = 256          # Number of characters in alphabet
    q = 101          # Large prime number
    
    # Precompute d^(m-1) mod q
    h = 1
    for _ in range(m - 1):
        h = (h * d) % q
    
    # Calculate initial hash values
    pattern_hash = 0
    text_hash = 0
    
    for i in range(m):
        pattern_hash = (d * pattern_hash + ord(pattern[i])) % q
        text_hash = (d * text_hash + ord(text[i])) % q
    
    # Slide the pattern over the text
    results = []
    
    for i in range(n - m + 1):
        # Check if hashes match
        if pattern_hash == text_hash:
            # Verify the actual strings (handle collisions)
            if text[i:i + m] == pattern:
                results.append(i)
        
        # Calculate hash for next window
        if i < n - m:
            # Remove leftmost character, add rightmost
            text_hash = (d * (text_hash - ord(text[i]) * h) + ord(text[i + m])) % q
            
            # Handle negative hash value
            if text_hash < 0:
                text_hash += q
    
    return results


def rabin_karp_multi(text: str, patterns: list[str]) -> dict[str, list[int]]:
    """
    Search for multiple patterns simultaneously.
    
    This is the key advantage of Rabin-Karp - efficient multi-pattern search.
    
    Args:
        text: String to search in
        patterns: List of patterns to search for
    
    Returns:
        Dictionary mapping each pattern to list of occurrence indices
    
    Time: O(n + m1 + m2 + ... + mk) average
    Space: O(k) where k is number of patterns
    """
    n = len(text)
    if n == 0 or not patterns:
        return {p: [] for p in patterns} if patterns else {}
    
    # Base and modulus
    d = 256
    q = 101
    
    results = {p: [] for p in patterns}
    
    # Precompute pattern hashes
    pattern_hashes = {}
    pattern_lengths = {}
    h_values = {}
    
    for pattern in patterns:
        m = len(pattern)
        if m == 0 or n < m:
            continue
        
        # Calculate h = d^(m-1) mod q
        h = 1
        for _ in range(m - 1):
            h = (h * d) % q
        
        # Calculate pattern hash
        ph = 0
        for ch in pattern:
            ph = (d * ph + ord(ch)) % q
        
        pattern_hashes[pattern] = ph
        pattern_lengths[pattern] = m
        h_values[pattern] = h
    
    # Search for each unique pattern length
    length_groups = {}
    for pattern, m in pattern_lengths.items():
        if m not in length_groups:
            length_groups[m] = []
        length_groups[m].append(pattern)
    
    # For each length group, slide through text once
    for m, patterns_of_length in length_groups.items():
        if m > n:
            continue
        
        h = 1
        for _ in range(m - 1):
            h = (h * d) % q
        
        # Calculate initial hash for first window
        th = 0
        for i in range(m):
            th = (d * th + ord(text[i])) % q
        
        # Slide through text
        for i in range(n - m + 1):
            # Check all patterns of this length
            for pattern in patterns_of_length:
                ph = pattern_hashes[pattern]
                if ph == th:
                    if text[i:i + m] == pattern:
                        results[pattern].append(i)
            
            # Roll to next window
            if i < n - m:
                th = (d * (th - ord(text[i]) * h) + ord(text[i + m])) % q
                if th < 0:
                    th += q
    
    return results


# Example usage
if __name__ == "__main__":
    # Test single pattern
    text = "AABAACAADAABAABA"
    pattern = "AABA"
    
    result = rabin_karp(text, pattern)
    print(f"Text: {text}")
    print(f"Pattern: {pattern}")
    print(f"Found at indices: {result}")
    # Output: [0, 9, 12]
    
    print()
    
    # Test multiple patterns
    patterns = ["AABA", "CA", "ABA"]
    results = rabin_karp_multi(text, patterns)
    print(f"Searching for: {patterns}")
    for pattern, indices in results.items():
        print(f"  '{pattern}': {indices}")
    # Output: {'AABA': [0, 9, 12], 'CA': [5], 'ABA': [1, 10]}
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <cmath>
using namespace std;

/**
 * Rabin-Karp string matching algorithm.
 * 
 * Time: O(n + m) average, O(nm) worst
 * Space: O(1)
 */
class RabinKarp {
private:
    static const int d = 256;    // Number of characters in alphabet
    int q;                        // Large prime number
    
public:
    RabinKarp(int prime = 101) : q(prime) {}
    
    /**
     * Find all occurrences of pattern in text.
     * @param text Text to search in
     * @param pattern Pattern to search for
     * @return Vector of starting indices
     */
    vector<int> search(const string& text, const string& pattern) {
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0) return {0};
        if (n < m) return {};
        
        vector<int> results;
        
        // Calculate h = d^(m-1) mod q
        int h = 1;
        for (int i = 0; i < m - 1; i++) {
            h = (h * d) % q;
        }
        
        // Calculate initial hashes
        int patternHash = 0;
        int textHash = 0;
        
        for (int i = 0; i < m; i++) {
            patternHash = (d * patternHash + pattern[i]) % q;
            textHash = (d * textHash + text[i]) % q;
        }
        
        // Slide the pattern
        for (int i = 0; i <= n - m; i++) {
            // Check if hashes match
            if (patternHash == textHash) {
                // Verify the actual strings
                bool match = true;
                for (int j = 0; j < m; j++) {
                    if (text[i + j] != pattern[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    results.push_back(i);
                }
            }
            
            // Calculate hash for next window
            if (i < n - m) {
                textHash = (d * (textHash - text[i] * h) + text[i + m]) % q;
                if (textHash < 0) {
                    textHash += q;
                }
            }
        }
        
        return results;
    }
    
    /**
     * Search for multiple patterns simultaneously.
     * @param text Text to search in
     * @param patterns Vector of patterns
     * @return Vector of vectors, one for each pattern
     */
    vector<vector<int>> searchMultiple(const string& text, 
                                       const vector<string>& patterns) {
        vector<vector<int>> results(patterns.size());
        
        for (size_t i = 0; i < patterns.size(); i++) {
            results[i] = search(text, patterns[i]);
        }
        
        return results;
    }
};

int main() {
    RabinKarp rk(101);
    
    // Test single pattern
    string text = "AABAACAADAABAABA";
    string pattern = "AABA";
    
    vector<int> result = rk.search(text, pattern);
    
    cout << "Text: " << text << endl;
    cout << "Pattern: " << pattern << endl;
    cout << "Found at indices: ";
    for (int idx : result) {
        cout << idx << " ";
    }
    cout << endl;
    // Output: 0 9 12
    
    cout << endl;
    
    // Test multiple patterns
    vector<string> patterns = {"AABA", "CA", "ABA"};
    auto results = rk.searchMultiple(text, patterns);
    
    cout << "Searching for: ";
    for (const auto& p : patterns) cout << p << " ";
    cout << endl;
    
    for (size_t i = 0; i < patterns.size(); i++) {
        cout << "  '" << patterns[i] << "': ";
        for (int idx : results[i]) {
            cout << idx << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Rabin-Karp string matching algorithm.
 * 
 * Time: O(n + m) average, O(nm) worst
 * Space: O(1)
 */
public class RabinKarp {
    
    private static final int d = 256;  // Number of characters
    private final int q;               // Large prime number
    
    public RabinKarp(int q) {
        this.q = q;
    }
    
    public RabinKarp() {
        this(101);
    }
    
    /**
     * Find all occurrences of pattern in text.
     * @param text Text to search in
     * @param pattern Pattern to search for
     * @return ArrayList of starting indices
     */
    public int[] search(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0) return new int[]{0};
        if (n < m) return new int[]{};
        
        List<Integer> results = new ArrayList<>();
        
        // Calculate h = d^(m-1) mod q
        int h = 1;
        for (int i = 0; i < m - 1; i++) {
            h = (h * d) % q;
        }
        
        // Calculate initial hashes
        int patternHash = 0;
        int textHash = 0;
        
        for (int i = 0; i < m; i++) {
            patternHash = (d * patternHash + pattern.charAt(i)) % q;
            textHash = (d * textHash + text.charAt(i)) % q;
        }
        
        // Slide the pattern over text
        for (int i = 0; i <= n - m; i++) {
            // Check if hashes match
            if (patternHash == textHash) {
                // Verify the actual strings (handle collisions)
                if (text.substring(i, i + m).equals(pattern)) {
                    results.add(i);
                }
            }
            
            // Calculate hash for next window
            if (i < n - m) {
                textHash = (d * (textHash - text.charAt(i) * h) 
                           + text.charAt(i + m)) % q;
                
                if (textHash < 0) {
                    textHash += q;
                }
            }
        }
        
        return results.stream().mapToInt(Integer::intValue).toArray();
    }
    
    /**
     * Search for multiple patterns.
     * @param text Text to search in
     * @param patterns Array of patterns
     * @return Array of arrays, one for each pattern
     */
    public int[][] searchMultiple(String text, String[] patterns) {
        int[][] results = new int[patterns.length][];
        
        for (int i = 0; i < patterns.length; i++) {
            results[i] = search(text, patterns[i]);
        }
        
        return results;
    }
    
    public static void main(String[] args) {
        RabinKarp rk = new RabinKarp(101);
        
        // Test single pattern
        String text = "AABAACAADAABAABA";
        String pattern = "AABA";
        
        int[] result = rk.search(text, pattern);
        
        System.out.println("Text: " + text);
        System.out.println("Pattern: " + pattern);
        System.out.print("Found at indices: ");
        for (int idx : result) {
            System.out.print(idx + " ");
        }
        System.out.println();
        // Output: 0 9 12
        
        System.out.println();
        
        // Test multiple patterns
        String[] patterns = {"AABA", "CA", "ABA"};
        int[][] results = rk.searchMultiple(text, patterns);
        
        System.out.print("Searching for: ");
        for (String p : patterns) System.out.print(p + " ");
        System.out.println();
        
        for (int i = 0; i < patterns.length; i++) {
            System.out.print("  '" + patterns[i] + "': ");
            for (int idx : results[i]) {
                System.out.print(idx + " ");
            }
            System.out.println();
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Rabin-Karp string matching algorithm.
 * 
 * Time: O(n + m) average, O(nm) worst
 * Space: O(1)
 */
class RabinKarp {
    constructor(prime = 101) {
        this.d = 256;  // Number of characters in alphabet
        this.q = prime; // Large prime number
    }
    
    /**
     * Find all occurrences of pattern in text.
     * @param {string} text - Text to search in
     * @param {string} pattern - Pattern to search for
     * @returns {number[]} Array of starting indices
     */
    search(text, pattern) {
        const n = text.length;
        const m = pattern.length;
        
        if (m === 0) return [0];
        if (n < m) return [];
        
        const results = [];
        
        // Calculate h = d^(m-1) mod q
        let h = 1;
        for (let i = 0; i < m - 1; i++) {
            h = (h * this.d) % this.q;
        }
        
        // Calculate initial hashes
        let patternHash = 0;
        let textHash = 0;
        
        for (let i = 0; i < m; i++) {
            patternHash = (this.d * patternHash + text.charCodeAt(i)) % this.q;
            textHash = (this.d * textHash + text.charCodeAt(i)) % this.q;
        }
        
        // Slide the pattern over text
        for (let i = 0; i <= n - m; i++) {
            // Check if hashes match
            if (patternHash === textHash) {
                // Verify the actual strings (handle collisions)
                if (text.substring(i, i + m) === pattern) {
                    results.push(i);
                }
            }
            
            // Calculate hash for next window
            if (i < n - m) {
                textHash = (
                    this.d * (textHash - text.charCodeAt(i) * h) 
                    + text.charCodeAt(i + m)
                ) % this.q;
                
                if (textHash < 0) {
                    textHash += this.q;
                }
            }
        }
        
        return results;
    }
    
    /**
     * Search for multiple patterns simultaneously.
     * @param {string} text - Text to search in
     * @param {string[]} patterns - Array of patterns
     * @returns {Object} Object with pattern -> indices mapping
     */
    searchMultiple(text, patterns) {
        const results = {};
        
        for (const pattern of patterns) {
            results[pattern] = this.search(text, pattern);
        }
        
        return results;
    }
}

// Example usage
const rk = new RabinKarp(101);

// Test single pattern
const text = "AABAACAADAABAABA";
const pattern = "AABA";

const result = rk.search(text, pattern);
console.log(`Text: ${text}`);
console.log(`Pattern: ${pattern}`);
console.log(`Found at indices: ${result.join(', ')}`);
// Output: 0, 9, 12

console.log();

// Test multiple patterns
const patterns = ["AABA", "CA", "ABA"];
const multiResults = rk.searchMultiple(text, patterns);

console.log(`Searching for: ${patterns.join(', ')}`);
for (const [pattern, indices] of Object.entries(multiResults)) {
    console.log(`  '${pattern}': ${indices.join(', ')}`);
}
// Output: { 'AABA': [0, 9, 12], 'CA': [5], 'ABA': [1, 10] }
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Preprocessing** | O(m) | Calculate pattern hash |
| **Search** | O(n - m + 1) | Slide through text |
| **Character Comparison** | O(m) per match | Only when hashes match |
| **Total Average** | O(n + m) | With good hash function |
| **Total Worst** | O(nm) | When many hash collisions |

### Detailed Breakdown

- **Hash Calculation**: O(m) for pattern + O(m) for initial text window
- **Rolling Hash Update**: O(1) per window shift
- **Verification**: Only performed when hashes match (rare with good hash function)
- **Space**: O(1) - only storing a few integer variables

---

## Space Complexity Analysis

- **Main Algorithm**: O(1) - only stores hash values and indices
- **Multiple Pattern Version**: O(k) where k = number of patterns
- **Total**: O(1) for single pattern search

### Space Optimization

For extremely long texts, consider:
1. **Chunk processing**: Process text in chunks to manage memory
2. **Streaming**: Use rolling hash to stream through text
3. **Mmap files**: For file-based searching, memory-map the file

---

## Common Variations

### 1. Polynomial Rolling Hash

Use different base and modulus combinations:

````carousel
```python
def polynomial_hash(s: str, base: int = 911382323, mod: int = 1000000007) -> int:
    """Compute polynomial hash for a string."""
    hash_val = 0
    for ch in s:
        hash_val = (hash_val * base + ord(ch)) % mod
    return hash_val


def rabin_karp_custom(text: str, pattern: str, base: int = 911382323, 
                      mod: int = 1000000007) -> list[int]:
    """Rabin-Karp with custom hash parameters."""
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return [] if m > 0 else [0]
    
    # Precompute base^(m-1) mod mod
    h = pow(base, m - 1, mod)
    
    # Calculate hashes
    pattern_hash = polynomial_hash(pattern, base, mod)
    text_hash = polynomial_hash(text[:m], base, mod)
    
    results = []
    for i in range(n - m + 1):
        if pattern_hash == text_hash and text[i:i+m] == pattern:
            results.append(i)
        
        if i < n - m:
            text_hash = (base * (text_hash - ord(text[i]) * h) 
                        + ord(text[i + m])) % mod
    
    return results
```
````

### 2. Double Hashing

Use two different hash functions to reduce collision probability:

````carousel
```python
def rabin_karp_double(text: str, pattern: str) -> list[int]:
    """Rabin-Karp with double hashing to reduce collisions."""
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return [] if m > 0 else [0]
    
    # Two different hash functions
    d1, q1 = 256, 1000003
    d2, q2 = 256, 1000033
    
    # Precompute powers
    h1 = pow(d1, m - 1, q1)
    h2 = pow(d2, m - 1, q2)
    
    # Initial hashes
    p1 = p2 = t1 = t2 = 0
    for i in range(m):
        p1 = (d1 * p1 + ord(pattern[i])) % q1
        p2 = (d2 * p2 + ord(pattern[i])) % q2
        t1 = (d1 * t1 + ord(text[i])) % q1
        t2 = (d2 * t2 + ord(text[i])) % q2
    
    results = []
    for i in range(n - m + 1):
        # Both hashes must match
        if p1 == t1 and p2 == t2:
            if text[i:i+m] == pattern:
                results.append(i)
        
        if i < n - m:
            t1 = (d1 * (t1 - ord(text[i]) * h1) + ord(text[i + m])) % q1
            t2 = (d2 * (t2 - ord(text[i]) * h2) + ord(text[i + m])) % q2
            if t1 < 0: t1 += q1
            if t2 < 0: t2 += q2
    
    return results
```
````

### 3. DNA Sequence Matching

Optimized for DNA characters (A, C, G, T):

````carousel
```python
def dna_rabin_karp(text: str, pattern: str) -> list[int]:
    """Rabin-Karp optimized for DNA sequences (A, C, G, T)."""
    # Map DNA bases to numbers
    dna_map = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
    
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return [] if m > 0 else [0]
    
    d = 4  # Only 4 possible characters
    q = 1000003
    
    h = pow(d, m - 1, q)
    
    # Calculate hashes
    pattern_hash = 0
    text_hash = 0
    
    for i in range(m):
        pattern_hash = (d * pattern_hash + dna_map.get(pattern[i], 0)) % q
        text_hash = (d * text_hash + dna_map.get(text[i], 0)) % q
    
    results = []
    for i in range(n - m + 1):
        if pattern_hash == text_hash and text[i:i+m] == pattern:
            results.append(i)
        
        if i < n - m:
            text_hash = (d * (text_hash - dna_map.get(text[i], 0) * h) 
                        + dna_map.get(text[i + m], 0)) % q
    
    return results
```
````

### 4. Unicode Support

Handle multi-byte characters:

````carousel
```python
def unicode_rabin_karp(text: str, pattern: str) -> list[int]:
    """Rabin-Karp with Unicode support."""
    import sys
    
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return [] if m > 0 else [0]
    
    # Use Unicode code points
    d = 65537  # Large base for Unicode
    q = 1000003
    
    h = pow(d, m - 1, q)
    
    # Calculate hashes using code points
    pattern_hash = sum(ord(pattern[i]) * pow(d, m - 1 - i, q) for i in range(m)) % q
    text_hash = sum(ord(text[i]) * pow(d, m - 1 - i, q) for i in range(m)) % q
    
    results = []
    for i in range(n - m + 1):
        if pattern_hash == text_hash and text[i:i+m] == pattern:
            results.append(i)
        
        if i < n - m:
            text_hash = (d * (text_hash - ord(text[i]) * h) + ord(text[i + m])) % q
    
    return results
```
````

---

## Practice Problems

### Problem 1: Implement strStr()

**Problem:** [LeetCode 28 - Implement strStr()](https://leetcode.com/problems/implement-strstr/)

**Description:** Return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.

**How to Apply Rabin-Karp:**
- Use Rabin-Karp to find the first occurrence of needle
- Rolling hash enables efficient O(n + m) search
- Handle edge cases: empty needle returns 0

---

### Problem 2: Repeated String Match

**Problem:** [LeetCode 686 - Repeated String Match](https://leetcode.com/problems/repeated-string-match/)

**Description:** Given strings A and B, find the minimum number of times A should be repeated such that B is a substring of the repeated string.

**How to Apply Rabin-Karp:**
- Use Rabin-Karp to check if B exists in repeated A
- Optimize by limiting search to reasonable number of repetitions
- Hash comparison helps quickly rule out non-matches

---

### Problem 3: Shortest Palindrome

**Problem:** [LeetCode 214 - Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Add characters in front of the string to make it a palindrome.

**How to Apply Rabin-Karp:**
- Use rolling hash to find longest palindromic prefix
- Hash forward and reverse strings for efficient comparison
- Can combine with KMP for guaranteed linear time

---

### Problem 4: Count Unique Substrings

**Problem:** [LeetCode 1160 - Count Unique Substrings](https://leetcode.com/problems/count-unique-substrings-of-a-given-string/)

**Description:** Given a string s, return the number of unique substrings of length k.

**How to Apply Rabin-Karp:**
- Use rolling hash to generate all substring hashes
- Use a set to track unique hashes
- O(n) time to count all k-length substrings

---

### Problem 5: Find All Anagrams in a String

**Problem:** [LeetCode 438 - Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)

**Description:** Find all start indices of p's anagrams in s.

**How to Apply Rabin-Karp:**
- Use rolling hash with character frequency
- Compare hash of pattern with hash of each window
- Note: Requires modified hash that considers character counts

---

## Video Tutorial Links

### Fundamentals

- [Rabin-Karp Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=rohK5c5JjgA) - Comprehensive introduction
- [Rabin-Karp Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=qQ8v0xqnGuE) - Detailed explanation with code
- [Rolling Hash - Rabin Karp (NeetCode)](https://www.youtube.com/watch?v=5co5G4D2wGA) - Practical implementation

### Advanced Topics

- [Multiple Pattern Matching with Rabin-Karp](https://www.youtube.com/watch?v=BSJKjgtakE0) - Using Rabin-Karp for multiple patterns
- [Rabin Karp vs KMP vs Boyer-Moore](https://www.youtube.com/watch?v=1w7gqSY7oAQ) - Algorithm comparison
- [Rolling Hash Implementation Tips](https://www.youtube.com/watch?v=4fR6nV7al_k) - Common pitfalls and solutions

---

## Follow-up Questions

### Q1: What makes Rabin-Karp better than KMP for multiple pattern search?

**Answer:** Rabin-Karp naturally extends to multiple patterns because:
- Each pattern gets its own hash
- One pass through text can check all patterns
- Adding a new pattern doesn't require reprocessing the text
- KMP would require running the algorithm separately for each pattern

### Q2: How do you choose the prime number q?

**Answer:** Consider these factors:
- **Size**: Larger prime = fewer collisions but more overflow risk
- **Common choices**: 101, 1000003, 1000000007
- **Avoid**: Powers of 2 (can cause issues with modulo)
- **Trade-off**: q affects collision probability vs. performance

### Q3: Can Rabin-Karp be used for approximate matching?

**Answer:** Yes, with modifications:
- Use multiple hash functions with different bases
- Allow k mismatches by checking hashes within a window
- More complex but possible for fuzzy matching

### Q4: Why is verification necessary even when hashes match?

**Answer:** Because hash functions can have collisions:
- Two different strings can produce same hash
- This is called a "spurious hit"
- Verification ensures correctness at minimal cost
- With good hash function, false positives are rare

### Q5: How does base d affect performance?

**Answer:** Base selection matters:
- **Too small**: More collisions, slower verification
- **Too large**: Faster overflow, need larger modulus
- **Common**: 256 for ASCII, 911382323 for polynomial
- **DNA**: 4 works well for small alphabets

---

## Summary

Rabin-Karp is a versatile string matching algorithm that uses **rolling hash** for efficient pattern searching. Key takeaways:

- **Average O(n + m)**: Much better than naive O(nm) in practice
- **Multi-pattern support**: Unique advantage over KMP and Boyer-Moore
- **Rolling hash**: Enables O(1) window updates
- **Verification step**: Required for correctness (handles collisions)
- **Space efficient**: O(1) space for single pattern

When to use:
- ✅ Multiple pattern matching (primary use case)
- ✅ General string searching with good average case
- ✅ DNA sequence matching with small alphabets
- ❌ When worst-case guarantee is critical (use KMP)
- ❌ Very long patterns with poor hash function

This algorithm is essential for competitive programming and technical interviews, especially for problems involving string searching and pattern matching.

---

## Related Algorithms

- [KMP](./knuth-morris-pratt.md) - Linear time single pattern matching
- [Boyer-Moore](./boyer-moore.md) - Best practical performance for single pattern
- [Rolling Hash](./rolling-hash.md) - Foundation of Rabin-Karp
- [Z-Algorithm](./z-algorithm.md) - Another linear time string matching approach
