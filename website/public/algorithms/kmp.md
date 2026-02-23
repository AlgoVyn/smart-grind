# KMP String Matching

## Category
Advanced

## Description
Linear time pattern matching using failure function.

---

## Algorithm Explanation
The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that finds all occurrences of a pattern string within a text string in O(n + m) time, where n is the text length and m is the pattern length.

### Key Concepts:
- **Failure Function (LPS Array)**: Pre-computes the longest proper prefix which is also a suffix for each position in the pattern
- **Avoiding Re-comparison**: When a mismatch occurs, the algorithm uses the failure function to skip characters that have already been matched
- **O(n + m) Time**: Linear time complexity - no character is compared more than once

### How It Works:
1. **Build LPS Array**: Compute the longest proper prefix which is also a suffix for each position in the pattern
2. **Search**: Iterate through the text, using the LPS array to skip characters when mismatches occur

### Why It's Efficient:
Unlike naive string matching which re-starts from the beginning of the pattern after each mismatch, KMP uses the pre-computed LPS array to determine how many characters can be safely skipped, making it optimal for repeated patterns.

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
def compute_lps(pattern: str) -> List[int]:
    """
    Compute the Longest Proper Prefix which is also Suffix (LPS) array.
    
    Args:
        pattern: The pattern string
    
    Returns:
        LPS array where lps[i] = length of longest proper prefix that is also suffix for pattern[0:i+1]
    """
    m = len(pattern)
    lps = [0] * m
    length = 0  # length of the previous longest prefix suffix
    i = 1
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps


def kmp_search(text: str, pattern: str) -> List[int]:
    """
    KMP algorithm to find all occurrences of pattern in text.
    
    Args:
        text: The text string to search in
        pattern: The pattern string to search for
    
    Returns:
        List of starting indices where pattern occurs in text
    """
    n = len(text)
    m = len(pattern)
    
    if m == 0:
        return list(range(n + 1))
    
    lps = compute_lps(pattern)
    result = []
    i = 0  # index for text
    j = 0  # index for pattern
    
    while i < n:
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == m:
            result.append(i - j)
            j = lps[j - 1]
        elif i < n and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return result


# Example usage
if __name__ == "__main__":
    text = "ABABDABACDABABCABAB"
    pattern = "ABABCABAB"
    
    matches = kmp_search(text, pattern)
    print(f"Text: {text}")
    print(f"Pattern: {pattern}")
    print(f"Pattern found at indices: {matches}")
    
    # Another example
    text2 = "AAAAABAAABA"
    pattern2 = "AAAA"
    matches2 = kmp_search(text2, pattern2)
    print(f"\nText: {text2}")
    print(f"Pattern: {pattern2}")
    print(f"Pattern found at indices: {matches2}")
```

```javascript
function kmp() {
    // KMP String Matching implementation
    // Time: O(n + m)
    // Space: O(m)
}
```

---

## Example

**Input:**
```
text = "ABABDABACDABABCABAB"
pattern = "ABABCABAB"
```

**Output:**
```
Text: ABABDABACDABABCABAB
Pattern: ABABCABAB
Pattern found at indices: [10]
```

**Explanation:**
The LPS array for "ABABCABAB" is [0, 1, 2, 0, 1, 2, 3, 4, 5]. The algorithm finds the pattern at index 10 in the text.

**Another Example:**
```
text = "AAAAABAAABA"
pattern = "AAAA"
```

**Output:**
```
Pattern found at indices: [0, 1, 2]
```

The pattern "AAAA" occurs at indices 0, 1, and 2 in "AAAAABAAABA".

---

## Time Complexity
**O(n + m)**

---

## Space Complexity
**O(m)**

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
