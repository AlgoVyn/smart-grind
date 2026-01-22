# String Matching - Naive / KMP / Rabin-Karp

## Overview

The String Matching pattern is used to find occurrences of a substring (pattern) within a larger string (text). Three common approaches are the naive approach, the KMP algorithm, and the Rabin-Karp algorithm, each with different time complexity trade-offs.

## Key Concepts

- **Pattern and Text**: The substring to find and the string to search in.
- **Naive Approach**: Check every possible starting index in text for pattern match.
- **KMP Algorithm**: Uses a prefix function to skip unnecessary comparisons.
- **Rabin-Karp Algorithm**: Uses hashing to compare substrings quickly.

## Templates

```python
# Naive Approach
def naive_string_match(text, pattern):
    n, m = len(text), len(pattern)
    matches = []
    
    for i in range(n - m + 1):
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            matches.append(i)
    
    return matches

# KMP Algorithm
def kmp_string_match(text, pattern):
    n, m = len(text), len(pattern)
    lps = compute_lps(pattern)
    matches = []
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            
            if j == m:
                matches.append(i - j)
                j = lps[j - 1]
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return matches

def compute_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
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

# Rabin-Karp Algorithm
def rabin_karp_string_match(text, pattern, base=256, prime=101):
    n, m = len(text), len(pattern)
    matches = []
    p_hash = 0
    t_hash = 0
    h = 1
    
    for i in range(m - 1):
        h = (h * base) % prime
    
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % prime
        t_hash = (base * t_hash + ord(text[i])) % prime
    
    for i in range(n - m + 1):
        if p_hash == t_hash:
            match = True
            for j in range(m):
                if text[i + j] != pattern[j]:
                    match = False
                    break
            if match:
                matches.append(i)
        
        if i < n - m:
            t_hash = (base * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % prime
            if t_hash < 0:
                t_hash += prime
    
    return matches
```

## Detailed Algorithm Explanations

### 1. Naive Approach

The naive approach is the simplest string matching algorithm. It checks every possible starting index in the text from 0 to (text length - pattern length), and for each position, it compares the pattern character by character with the corresponding substring of the text.

**Key Features**:
- No preprocessing required
- Easy to implement
- Inefficient for large inputs

**Step-by-Step Process**:
1. Iterate through all possible starting positions in the text
2. For each position, compare characters one by one with the pattern
3. If all characters match, record the starting index
4. If a mismatch occurs, move to the next starting position

### 2. KMP Algorithm (Knuth-Morris-Pratt)

The KMP algorithm is an efficient string matching algorithm that preprocesses the pattern to create a **partial match table (LPS array - Longest Prefix Suffix)**. This table allows the algorithm to skip unnecessary comparisons when a mismatch occurs.

**Key Concept - LPS Array**:
The LPS array for a pattern of length `m` is an array `lps` where `lps[i]` is the length of the longest proper prefix of the substring `pattern[0..i]` which is also a suffix. This information helps determine how much the pattern can be shifted without rechecking characters that are already known to match.

**Step-by-Step Process**:
1. **Preprocess the pattern**: Compute the LPS array
2. **Initialize pointers**: `i` (text index) = 0, `j` (pattern index) = 0
3. **Compare characters**:
   - If characters match, increment both pointers
   - If `j` reaches the pattern length, record a match and update `j` using LPS
   - If mismatch and `j > 0`, update `j` using LPS
   - If mismatch and `j == 0`, increment `i`
4. Repeat until `i` reaches the end of the text

**Example LPS Array Calculation**:
For pattern "ABABC", the LPS array is [0, 0, 1, 2, 0]

### 3. Rabin-Karp Algorithm (Rolling Hash)

The Rabin-Karp algorithm uses hashing to compare substrings efficiently. It computes the hash value of the pattern and compares it with the hash values of all possible substrings of the text of the same length. To avoid recalculating hash values from scratch, it uses a **rolling hash technique**.

**Key Concept - Rolling Hash**:
The rolling hash allows the hash value of the next substring to be computed from the previous substring's hash value in constant time. This is done by:
- Removing the contribution of the leftmost character of the current window
- Shifting the window right by one character
- Adding the contribution of the new rightmost character

**Step-by-Step Process**:
1. **Precompute constants**: Calculate `base^(m-1) % prime` for efficient hash updates
2. **Compute pattern hash**: Calculate the hash value of the entire pattern
3. **Compute initial window hash**: Calculate hash for the first window of the text
4. **Check for match**: Compare initial hash with pattern hash and verify characters
5. **Slide the window**: For each subsequent window, compute new hash using rolling technique
6. **Verify matches**: For each hash match, verify characters to avoid collisions

**Hash Collisions**:
Since different strings can have the same hash value (collisions), it's important to verify matches by comparing characters directly when a hash match is found.

## Example Problems

1. **Implement strStr() (LeetCode 28)**: Find the index of the first occurrence of a substring. [Solution](../solutions/find-the-index-of-the-first-occurrence-in-a-string.md)
2. **Find All Anagrams in a String (LeetCode 438)**: Find all starting indices of anagrams.
3. **Repeated Substring Pattern (LeetCode 459)**: Check if string is repeated substring.

## Video Tutorials

Here are some helpful video explanations for understanding string matching algorithms:

- [Knuth-Morris-Pratt (KMP) algorithm](https://www.youtube.com/watch?v=4jY57Ehc14Y) - Knuth-Morris-Pratt (KMP) algorithm
- [KMP Algorithm Explained](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Comprehensive tutorial on the KMP algorithm and LPS array
- [Rabin-Karp Algorithm](https://www.youtube.com/watch?v=H4VrKHVG5qI) - Rolling hash technique and implementation explained
- [String Matching Algorithms](https://www.youtube.com/watch?v=5i7oKodCRJo) - Comparison of brute force, KMP, and other methods
- [LeetCode 28: Find the Index of the First Occurrence in a String](https://www.youtube.com/watch?v=Gjkhm1gYIMw) - Detailed walkthrough of the problem and solutions

## Time and Space Complexity

| Algorithm | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| **Naive Approach** | O(n*m) | O(1) |
| **KMP Algorithm** | O(n + m) | O(m) for LPS array |
| **Rabin-Karp Algorithm** | O(n + m) average, O(n*m) worst case | O(1) |

## Common Pitfalls

- **Naive approach for large strings**: Inefficient for large inputs.
- **Incorrect LPS array computation**: Causes KMP to fail.
- **Hash collisions in Rabin-Karp**: Can lead to incorrect matches.
- **Off-by-one errors in loop bounds**: Forgetting to adjust for pattern length.
- **Not handling empty pattern**: Trivial case needs special handling.

## Comparison of Approaches

| Approach | Pros | Cons |
|----------|------|------|
| **Naive Approach** | Simple, no preprocessing | Slow for large inputs |
| **KMP Algorithm** | Efficient, optimal time complexity, avoids backtracking | More complex to implement |
| **Rabin-Karp** | Efficient, easy to implement, rolling hash technique | Hash collisions possible, worst case O(n*m) |

**Recommendation**: Use KMP for guaranteed optimal performance, Rabin-Karp for simplicity, and the naive approach only for small inputs or quick implementations.
