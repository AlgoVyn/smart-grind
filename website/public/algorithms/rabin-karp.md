# Rabin-Karp

## Category
Advanced

## Description
Pattern matching using rolling hash.

## Algorithm Explanation
Rabin-Karp is a string matching algorithm that uses hashing to find patterns in text. It combines the idea of hashing with the sliding window technique to efficiently search for a pattern in a larger text.

**Key Concepts:**
1. **Rolling Hash**: Compute hash of a substring and efficiently update it when sliding the window
2. **Hash Comparison**: Compare hash values instead of comparing strings directly
3. **Collision Handling**: Use verification step when hashes match (to handle hash collisions)

**Algorithm Steps:**
1. **Precompute**: Calculate hash of the pattern
2. **Slide**: For each position in text, compute hash of substring of same length as pattern
3. **Compare**: If hashes match, verify the actual strings (to handle collisions)
4. **Roll**: Efficiently update hash using the rolling hash formula for next window

**Rolling Hash Formula:**
```
hash("abc") = (a*d² + b*d¹ + c*d⁰) mod m
hash("bcd") = ((hash("abc") - a*d²) * d + d) mod m
```
Where d is the base (usually prime like 101 or 256) and m is modulus

**Time Complexity:**
- Average: O(n + m)
- Worst case (with many collisions): O(nm)

**Space Complexity:** O(1)

**Advantages over Naive:**
- Can check multiple patterns simultaneously
- Efficient sliding window for single pattern

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
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
def rabin_karp(text, pattern):
    """
    Find pattern in text using Rabin-Karp algorithm.
    
    Args:
        text: String to search in
        pattern: Pattern to search for
    
    Returns:
        List of starting indices where pattern is found
    
    Time: O(n + m) average, O(nm) worst
    Space: O(1)
    """
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return [] if m == 0 else []
    
    # Base and modulus (using large prime for reduced collisions)
    d = 256  # Base (number of characters in alphabet)
    q = 101  # Large prime number
    
    # Calculate hash for pattern and first window of text
    pattern_hash = 0
    text_hash = 0
    
    # d^(m-1) for rolling hash
    h = 1
    for _ in range(m - 1):
        h = (h * d) % q
    
    # Calculate initial hashes
    for i in range(m):
        pattern_hash = (d * pattern_hash + ord(pattern[i])) % q
        text_hash = (d * text_hash + ord(text[i])) % q
    
    # Slide the pattern over the text
    results = []
    for i in range(n - m + 1):
        # Check if hashes match
        if pattern_hash == text_hash:
            # Verify the actual strings (handle collisions)
            if text[i:i+m] == pattern:
                results.append(i)
        
        # Calculate hash for next window
        if i < n - m:
            # Remove leftmost character, add rightmost
            text_hash = (d * (text_hash - ord(text[i]) * h) + ord(text[i + m])) % q
            
            # Handle negative hash value
            if text_hash < 0:
                text_hash += q
    
    return results


# Multiple pattern search
def rabin_karp_multi(text, patterns):
    """Search for multiple patterns at once."""
    results = {p: [] for p in patterns}
    
    # Precompute pattern hashes
    d = 256
    q = 101
    pattern_hashes = {}
    
    for pattern in patterns:
        m = len(pattern)
        if m == 0:
            continue
        h = 1
        for _ in range(m - 1):
            h = (h * d) % q
        
        ph = 0
        for ch in pattern:
            ph = (d * ph + ord(ch)) % q
        pattern_hashes[pattern] = (ph, m, h)
    
    # Search each pattern
    for pattern, (ph, m, h) in pattern_hashes.items():
        if m == 0 or len(text) < m:
            continue
        
        # Initial hash for text
        th = 0
        for i in range(m):
            th = (d * th + ord(text[i])) % q
        
        for i in range(len(text) - m + 1):
            if ph == th:
                if text[i:i+m] == pattern:
                    results[pattern].append(i)
            
            if i < len(text) - m:
                th = (d * (th - ord(text[i]) * h) + ord(text[i + m])) % q
                if th < 0:
                    th += q
    
    return results
```

```javascript
function rabinKarp(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    if (m === 0 || n < m) return m === 0 ? [0] : [];
    
    const d = 256;
    const q = 101;
    
    let patternHash = 0;
    let textHash = 0;
    let h = 1;
    
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    for (let i = 0; i < m; i++) {
        patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
        textHash = (d * textHash + text.charCodeAt(i)) % q;
    }
    
    const results = [];
    
    for (let i = 0; i <= n - m; i++) {
        if (patternHash === textHash) {
            if (text.substring(i, i + m) === pattern) {
                results.push(i);
            }
        }
        
        if (i < n - m) {
            textHash = (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (textHash < 0) textHash += q;
        }
    }
    
    return results;
}
```

---

## Example

**Input:**
```
text = "AABAACAADAABAABA"
pattern = "AABA"
```

**Output:**
```
[0, 9, 12]
```

**Explanation:**
- Pattern "AABA" found at index 0: "AABA"
- Pattern "AABA" found at index 9: "AABA"
- Pattern "AABA" found at index 12: "AABA"

**Input:**
```
text = "ABCDEFGH"
pattern = "DEF"
```

**Output:**
```
[3]
```

**Explanation:** "DEF" starts at index 3 in "ABCDEFGH"

**Input - Not found:**
```
text = "Hello World"
pattern = "Python"
```

**Output:**
```
[]
```

**Input - Multiple patterns:**
```
text = "AABAACAADAABAABA"
patterns = ["AABA", "CA"]
```

**Output:**
```
{"AABA": [0, 9, 12], "CA": [5]}
```

---

## Time Complexity
**O(n + m) average**

---

## Space Complexity
**O(1)**

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
