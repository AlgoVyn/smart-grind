# String Matching - Naive / KMP / Rabin-Karp

## Overview

The String Matching pattern is used to find occurrences of a substring (pattern) within a larger string (text). This is one of the most fundamental problems in computer science with applications in text editors, search engines, bioinformatics, and data mining.

Three common approaches exist, each with different time complexity trade-offs:

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|-------------------|---------------|
| **Naive** | O(n × m) | O(1) | Small strings, simple implementation |
| **KMP** | O(n + m) | O(m) | Large strings, guaranteed optimal |
| **Rabin-Karp** | O(n + m) avg | O(1) | Multiple pattern matching, simple hashing |

---

## Intuition

### Why Multiple Approaches?

Consider searching for "ABAB" in "ABABABABABAB":

1. **Naive approach** would check each position, wasting comparisons when partial matches fail
2. **KMP** uses previously computed information to skip unnecessary comparisons
3. **Rabin-Karp** uses hashing to quickly filter out non-matching positions

The key insight is that when a mismatch occurs, we can use information from previous comparisons to avoid rechecking characters we already know match.

---

## 1. Naive Approach

### Intuition

The naive approach is the most straightforward method: check every possible starting position in the text and compare the pattern character by character.

### When to Use

- Pattern and text are small (length < 1000)
- When simplicity is preferred over performance
- One-time searches where preprocessing overhead isn't justified

### Code Template

````carousel
```python
# Naive String Matching - Python
def naive_string_match(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using naive approach.
    
    Args:
        text: The string to search in
        pattern: The substring to find
    
    Returns:
        List of starting indices where pattern occurs
    """
    n, m = len(text), len(pattern)
    matches = []
    
    # Edge case: empty pattern
    if m == 0:
        return list(range(n + 1))
    
    # Check each possible starting position
    for i in range(n - m + 1):
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            matches.append(i)
    
    return matches


# Example usage
if __name__ == "__main__":
    text = "ABABDABACDABABCABAB"
    pattern = "ABABCABAB"
    result = naive_string_match(text, pattern)
    print(f"Pattern found at indices: {result}")  # Output: [10]
```
<!-- slide -->
```cpp
// Naive String Matching - C++
#include <vector>
#include <string>
using namespace std;

vector<int> naiveStringMatch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    
    // Edge case: empty pattern
    if (m == 0) {
        for (int i = 0; i <= n; i++) matches.push_back(i);
        return matches;
    }
    
    // Check each possible starting position
    for (int i = 0; i <= n - m; i++) {
        bool match = true;
        for (int j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                match = false;
                break;
            }
        }
        if (match) matches.push_back(i);
    }
    
    return matches;
}

// Example usage
int main() {
    string text = "ABABDABACDABABCABAB";
    string pattern = "ABABCABAB";
    vector<int> result = naiveStringMatch(text, pattern);
    // Output: 10
    return 0;
}
```
<!-- slide -->
```java
// Naive String Matching - Java
import java.util.ArrayList;
import java.util.List;

public class NaiveStringMatch {
    
    public static List<Integer> naiveStringMatch(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        
        // Edge case: empty pattern
        if (m == 0) {
            for (int i = 0; i <= n; i++) matches.add(i);
            return matches;
        }
        
        // Check each possible starting position
        for (int i = 0; i <= n - m; i++) {
            boolean match = true;
            for (int j = 0; j < m; j++) {
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    match = false;
                    break;
                }
            }
            if (match) matches.add(i);
        }
        
        return matches;
    }
    
    // Example usage
    public static void main(String[] args) {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        List<Integer> result = naiveStringMatch(text, pattern);
        System.out.println("Pattern found at indices: " + result);  // [10]
    }
}
```
<!-- slide -->
```javascript
// Naive String Matching - JavaScript
/**
 * Find all occurrences of pattern in text using naive approach.
 * @param {string} text - The string to search in
 * @param {string} pattern - The substring to find
 * @returns {number[]} Array of starting indices where pattern occurs
 */
function naiveStringMatch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const matches = [];
    
    // Edge case: empty pattern
    if (m === 0) {
        for (let i = 0; i <= n; i++) matches.push(i);
        return matches;
    }
    
    // Check each possible starting position
    for (let i = 0; i <= n - m; i++) {
        let match = true;
        for (let j = 0; j < m; j++) {
            if (text[i + j] !== pattern[j]) {
                match = false;
                break;
            }
        }
        if (match) matches.push(i);
    }
    
    return matches;
}

// Example usage
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
const result = naiveStringMatch(text, pattern);
console.log(`Pattern found at indices: ${result}`);  // [10]
```
````

---

## 2. KMP Algorithm (Knuth-Morris-Pratt)

### Intuition

KMP uses a **preprocessed LPS (Longest Prefix Suffix) array** that tells us how much to skip when a mismatch occurs. This prevents backtracking in the text.

**Key Insight**: When we have a partial match like "ABAB" and the next character doesn't match, we already know the last two characters "AB" are also the beginning of our pattern. We can shift the pattern to align these known matches.

### LPS Array Explanation

For pattern "ABABC":
- `lps[0]` = 0 (no proper prefix that's also suffix)
- `lps[1]` = 0 ("B" has no prefix=suffix)
- `lps[2]` = 1 ("AB" prefix matches suffix "AB")
- `lps[3]` = 2 ("AB" prefix matches suffix "AB")
- `lps[4]` = 0 ("C" has no prefix=suffix)

**Result**: `lps = [0, 0, 1, 2, 0]`

### When to Use

- Large texts and patterns
- When guaranteed O(n + m) performance is required
- When pattern is searched multiple times

### Code Template

````carousel
```python
# KMP Algorithm - Python
def compute_lps(pattern: str) -> list[int]:
    """
    Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
    
    Args:
        pattern: The pattern string
    
    Returns:
        LPS array where lps[i] is the length of longest proper prefix
        which is also suffix for pattern[0..i]
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


def kmp_string_match(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using KMP algorithm.
    
    Args:
        text: The string to search in
        pattern: The substring to find
    
    Returns:
        List of starting indices where pattern occurs
    """
    n, m = len(text), len(pattern)
    
    # Edge cases
    if m == 0:
        return list(range(n + 1))
    if n == 0 or m > n:
        return []
    
    # Preprocess pattern
    lps = compute_lps(pattern)
    
    matches = []
    i = j = 0  # i: text index, j: pattern index
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            
            if j == m:  # Full pattern match
                matches.append(i - j)
                j = lps[j - 1]  # Continue searching
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return matches


# LeetCode 28: Implement strStr()
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        """Return the first index of needle in haystack, or -1 if not found."""
        matches = kmp_string_match(haystack, needle)
        return matches[0] if matches else -1


# Example usage
if __name__ == "__main__":
    text = "ABABDABACDABABCABAB"
    pattern = "ABABCABAB"
    result = kmp_string_match(text, pattern)
    print(f"Pattern found at indices: {result}")  # Output: [10]
    
    # Test LeetCode problem
    sol = Solution()
    print(sol.strStr("sadbutsad", "sad"))  # Output: 0
    print(sol.strStr("leetcode", "leeto"))  # Output: -1
```
<!-- slide -->
```cpp
// KMP Algorithm - C++
#include <vector>
#include <string>
using namespace std;

vector<int> computeLPS(const string& pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int length = 0;  // length of the previous longest prefix suffix
    int i = 1;
    
    while (i < m) {
        if (pattern[i] == pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

vector<int> kmpStringMatch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    
    // Edge cases
    if (m == 0) {
        for (int i = 0; i <= n; i++) matches.push_back(i);
        return matches;
    }
    if (n == 0 || m > n) return matches;
    
    // Preprocess pattern
    vector<int> lps = computeLPS(pattern);
    
    int i = 0, j = 0;  // i: text index, j: pattern index
    
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
            
            if (j == m) {  // Full pattern match
                matches.push_back(i - j);
                j = lps[j - 1];  // Continue searching
            }
        } else {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return matches;
}

// LeetCode 28: Implement strStr()
class Solution {
public:
    int strStr(string haystack, string needle) {
        vector<int> matches = kmpStringMatch(haystack, needle);
        return matches.empty() ? -1 : matches[0];
    }
};

// Example usage
int main() {
    string text = "ABABDABACDABABCABAB";
    string pattern = "ABABCABAB";
    vector<int> result = kmpStringMatch(text, pattern);
    // Output: 10
    
    Solution sol;
    cout << sol.strStr("sadbutsad", "sad") << endl;  // 0
    cout << sol.strStr("leetcode", "leeto") << endl;  // -1
    return 0;
}
```
<!-- slide -->
```java
// KMP Algorithm - Java
import java.util.ArrayList;
import java.util.List;

public class KMPStringMatch {
    
    private static int[] computeLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int length = 0;  // length of the previous longest prefix suffix
        int i = 1;
        
        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(length)) {
                length++;
                lps[i] = length;
                i++;
            } else {
                if (length != 0) {
                    length = lps[length - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        
        return lps;
    }
    
    public static List<Integer> kmpStringMatch(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        
        // Edge cases
        if (m == 0) {
            for (int i = 0; i <= n; i++) matches.add(i);
            return matches;
        }
        if (n == 0 || m > n) return matches;
        
        // Preprocess pattern
        int[] lps = computeLPS(pattern);
        
        int i = 0, j = 0;  // i: text index, j: pattern index
        
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
                
                if (j == m) {  // Full pattern match
                    matches.add(i - j);
                    j = lps[j - 1];  // Continue searching
                }
            } else {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return matches;
    }
    
    // LeetCode 28: Implement strStr()
    static class Solution {
        public int strStr(String haystack, String needle) {
            List<Integer> matches = kmpStringMatch(haystack, needle);
            return matches.isEmpty() ? -1 : matches.get(0);
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        List<Integer> result = kmpStringMatch(text, pattern);
        System.out.println("Pattern found at indices: " + result);  // [10]
        
        Solution sol = new Solution();
        System.out.println(sol.strStr("sadbutsad", "sad"));  // 0
        System.out.println(sol.strStr("leetcode", "leeto"));  // -1
    }
}
```
<!-- slide -->
```javascript
// KMP Algorithm - JavaScript

/**
 * Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
 * @param {string} pattern - The pattern string
 * @returns {number[]} LPS array
 */
function computeLPS(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let length = 0;  // length of the previous longest prefix suffix
    let i = 1;
    
    while (i < m) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

/**
 * Find all occurrences of pattern in text using KMP algorithm.
 * @param {string} text - The string to search in
 * @param {string} pattern - The substring to find
 * @returns {number[]} Array of starting indices where pattern occurs
 */
function kmpStringMatch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const matches = [];
    
    // Edge cases
    if (m === 0) {
        for (let i = 0; i <= n; i++) matches.push(i);
        return matches;
    }
    if (n === 0 || m > n) return matches;
    
    // Preprocess pattern
    const lps = computeLPS(pattern);
    
    let i = 0, j = 0;  // i: text index, j: pattern index
    
    while (i < n) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
            
            if (j === m) {  // Full pattern match
                matches.push(i - j);
                j = lps[j - 1];  // Continue searching
            }
        } else {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return matches;
}

/**
 * LeetCode 28: Implement strStr()
 * @param {string} haystack
 * @param {string} needle
 * @returns {number} First index of needle in haystack, or -1
 */
function strStr(haystack, needle) {
    const matches = kmpStringMatch(haystack, needle);
    return matches.length > 0 ? matches[0] : -1;
}

// Example usage
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
const result = kmpStringMatch(text, pattern);
console.log(`Pattern found at indices: ${result}`);  // [10]

// Test LeetCode problem
console.log(strStr("sadbutsad", "sad"));  // 0
console.log(strStr("leetcode", "leeto"));  // -1
```
````

---

## 3. Rabin-Karp Algorithm (Rolling Hash)

### Intuition

Rabin-Karp uses **rolling hash** to compute a hash value for substrings. If the hash of a window matches the pattern's hash, we verify character by character (to handle hash collisions).

**Rolling Hash Formula**:
```
H(s[i..i+m-1]) = (s[i] * base^(m-1) + s[i+1] * base^(m-2) + ... + s[i+m-1]) % prime
```

### When to Use

- Searching for multiple patterns simultaneously
- When pattern length is fixed and relatively short
- When a simple hashing solution is preferred over complex prefix tables

### Code Template

````carousel
```python
# Rabin-Karp Algorithm - Python
def rabin_karp_string_match(text: str, pattern: str, base: int = 256, prime: int = 101) -> list[int]:
    """
    Find all occurrences of pattern in text using Rabin-Karp algorithm.
    
    Args:
        text: The string to search in
        pattern: The substring to find
        base: Base for polynomial hashing
        prime: Prime modulus for hash calculation
    
    Returns:
        List of starting indices where pattern occurs
    """
    n, m = len(text), len(pattern)
    matches = []
    
    # Edge cases
    if m == 0:
        return list(range(n + 1))
    if n == 0 or m > n:
        return []
    
    # Precompute base^(m-1) % prime
    h = 1
    for _ in range(m - 1):
        h = (h * base) % prime
    
    # Compute initial hash values
    p_hash = 0  # pattern hash
    t_hash = 0  # text hash for first window
    
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % prime
        t_hash = (base * t_hash + ord(text[i])) % prime
    
    # Slide pattern over text
    for i in range(n - m + 1):
        # Check if hash values match
        if p_hash == t_hash:
            # Verify character by character (handle collisions)
            match = True
            for j in range(m):
                if text[i + j] != pattern[j]:
                    match = False
                    break
            if match:
                matches.append(i)
        
        # Calculate hash for next window using rolling technique
        if i < n - m:
            # Remove leftmost character
            t_hash = (base * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % prime
            
            # Handle negative hash values
            if t_hash < 0:
                t_hash += prime
    
    return matches


# Example usage
if __name__ == "__main__":
    text = "ABABDABACDABABCABAB"
    pattern = "ABABCABAB"
    result = rabin_karp_string_match(text, pattern)
    print(f"Pattern found at indices: {result}")  # Output: [10]
    
    # Test with different parameters
    result2 = rabin_karp_string_match("hello world", "world", 256, 101)
    print(f"Pattern 'world' found at: {result2}")  # Output: [6]
```
<!-- slide -->
```cpp
// Rabin-Karp Algorithm - C++
#include <vector>
#include <string>
#include <cmath>
using namespace std;

vector<int> rabinKarpStringMatch(const string& text, const string& pattern, 
                                 int base = 256, int prime = 101) {
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    
    // Edge cases
    if (m == 0) {
        for (int i = 0; i <= n; i++) matches.push_back(i);
        return matches;
    }
    if (n == 0 || m > n) return matches;
    
    // Precompute base^(m-1) % prime
    int h = 1;
    for (int i = 0; i < m - 1; i++) {
        h = (h * base) % prime;
    }
    
    // Compute initial hash values
    int p_hash = 0;  // pattern hash
    int t_hash = 0;  // text hash for first window
    
    for (int i = 0; i < m; i++) {
        p_hash = (base * p_hash + pattern[i]) % prime;
        t_hash = (base * t_hash + text[i]) % prime;
    }
    
    // Slide pattern over text
    for (int i = 0; i <= n - m; i++) {
        // Check if hash values match
        if (p_hash == t_hash) {
            // Verify character by character (handle collisions)
            bool match = true;
            for (int j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) matches.push_back(i);
        }
        
        // Calculate hash for next window using rolling technique
        if (i < n - m) {
            // Remove leftmost character
            t_hash = (base * (t_hash - text[i] * h) + text[i + m]) % prime;
            
            // Handle negative hash values
            if (t_hash < 0) {
                t_hash += prime;
            }
        }
    }
    
    return matches;
}

// Example usage
int main() {
    string text = "ABABDABACDABABCABAB";
    string pattern = "ABABCABAB";
    vector<int> result = rabinKarpStringMatch(text, pattern);
    // Output: 10
    
    vector<int> result2 = rabinKarpStringMatch("hello world", "world", 256, 101);
    // Output: [6]
    return 0;
}
```
<!-- slide -->
```java
// Rabin-Karp Algorithm - Java
import java.util.ArrayList;
import java.util.List;

public class RabinKarpStringMatch {
    
    public static List<Integer> rabinKarpStringMatch(String text, String pattern, int base, int prime) {
        int n = text.length();
        int m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        
        // Edge cases
        if (m == 0) {
            for (int i = 0; i <= n; i++) matches.add(i);
            return matches;
        }
        if (n == 0 || m > n) return matches;
        
        // Precompute base^(m-1) % prime
        int h = 1;
        for (int i = 0; i < m - 1; i++) {
            h = (h * base) % prime;
        }
        
        // Compute initial hash values
        int pHash = 0;  // pattern hash
        int tHash = 0;  // text hash for first window
        
        for (int i = 0; i < m; i++) {
            pHash = (base * pHash + pattern.charAt(i)) % prime;
            tHash = (base * tHash + text.charAt(i)) % prime;
        }
        
        // Slide pattern over text
        for (int i = 0; i <= n - m; i++) {
            // Check if hash values match
            if (pHash == tHash) {
                // Verify character by character (handle collisions)
                boolean match = true;
                for (int j = 0; j < m; j++) {
                    if (text.charAt(i + j) != pattern.charAt(j)) {
                        match = false;
                        break;
                    }
                }
                if (match) matches.add(i);
            }
            
            // Calculate hash for next window using rolling technique
            if (i < n - m) {
                // Remove leftmost character
                tHash = (base * (tHash - text.charAt(i) * h) + text.charAt(i + m)) % prime;
                
                // Handle negative hash values
                if (tHash < 0) {
                    tHash += prime;
                }
            }
        }
        
        return matches;
    }
    
    // Overloaded method with default parameters
    public static List<Integer> rabinKarpStringMatch(String text, String pattern) {
        return rabinKarpStringMatch(text, pattern, 256, 101);
    }
    
    // Example usage
    public static void main(String[] args) {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        List<Integer> result = rabinKarpStringMatch(text, pattern);
        System.out.println("Pattern found at indices: " + result);  // [10]
        
        List<Integer> result2 = rabinKarpStringMatch("hello world", "world");
        System.out.println("Pattern 'world' found at: " + result2);  // [6]
    }
}
```
<!-- slide -->
```javascript
// Rabin-Karp Algorithm - JavaScript

/**
 * Find all occurrences of pattern in text using Rabin-Karp algorithm.
 * @param {string} text - The string to search in
 * @param {string} pattern - The substring to find
 * @param {number} base - Base for polynomial hashing (default: 256)
 * @param {number} prime - Prime modulus for hash calculation (default: 101)
 * @returns {number[]} Array of starting indices where pattern occurs
 */
function rabinKarpStringMatch(text, pattern, base = 256, prime = 101) {
    const n = text.length;
    const m = pattern.length;
    const matches = [];
    
    // Edge cases
    if (m === 0) {
        for (let i = 0; i <= n; i++) matches.push(i);
        return matches;
    }
    if (n === 0 || m > n) return matches;
    
    // Precompute base^(m-1) % prime
    let h = 1;
    for (let i = 0; i < m - 1; i++) {
        h = (h * base) % prime;
    }
    
    // Compute initial hash values
    let pHash = 0;  // pattern hash
    let tHash = 0;  // text hash for first window
    
    for (let i = 0; i < m; i++) {
        pHash = (base * pHash + text.charCodeAt(i)) % prime;
        tHash = (base * tHash + text.charCodeAt(i)) % prime;
    }
    
    // Slide pattern over text
    for (let i = 0; i <= n - m; i++) {
        // Check if hash values match
        if (pHash === tHash) {
            // Verify character by character (handle collisions)
            let match = true;
            for (let j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) matches.push(i);
        }
        
        // Calculate hash for next window using rolling technique
        if (i < n - m) {
            // Remove leftmost character
            tHash = (base * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime;
            
            // Handle negative hash values
            if (tHash < 0) {
                tHash += prime;
            }
        }
    }
    
    return matches;
}

// Example usage
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
const result = rabinKarpStringMatch(text, pattern);
console.log(`Pattern found at indices: ${result}`);  // [10]

// Test with different parameters
const result2 = rabinKarpStringMatch("hello world", "world", 256, 101);
console.log(`Pattern 'world' found at: ${result2}`);  // [6]
```
````

---

## Comparison Summary

| Aspect | Naive | KMP | Rabin-Karp |
|--------|-------|-----|------------|
| **Time Complexity** | O(n × m) | O(n + m) | O(n + m) avg, O(n × m) worst |
| **Space Complexity** | O(1) | O(m) | O(1) |
| **Preprocessing** | None | O(m) | None |
| **Hash Collisions** | N/A | No | Yes (possible) |
| **Multiple Patterns** | Poor | Good | Excellent |
| **Implementation** | Simple | Moderate | Moderate |

### Algorithm Selection Guide

1. **Choose Naive when**:
   - Strings are small (< 1000 characters)
   - Simplicity is preferred
   - Only one-time search needed

2. **Choose KMP when**:
   - Large texts and patterns
   - Guaranteed O(n + m) performance needed
   - Pattern is searched repeatedly

3. **Choose Rabin-Karp when**:
   - Multiple pattern matching needed
   - Simple hashing is acceptable
   - Pattern length is fixed and short

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [28. Implement strStr()](https://leetcode.com/problems/implement-strstr/) | Easy | Find first occurrence of substring |
| [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) | Medium | Check if string is repeated substring |
| [686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/) | Medium | Find minimum repeats needed |
| [796. Rotate String](https://leetcode.com/problems/rotate-string/) | Easy | Check if one string is rotation of another |
| [1071. Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) | Easy | Find GCD of string patterns |
| [1790. Check if One String Swap Can Make Strings Equal](https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/) | Medium | String equality with one swap |
| [205. Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/) | Easy | Character mapping pattern check |
| [290. Word Pattern](https://leetcode.com/problems/word-pattern/) | Easy | Pattern matching with words |
| [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Medium | Find anagram occurrences |
| [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium | Check if permutation exists |

---

## Video Tutorials

### KMP Algorithm
- [Knuth-Morris-Pratt (KMP) Algorithm - Abdul Bari](https://www.youtube.com/watch?v=4jY57Ehc14Y) - Comprehensive explanation by Abdul Bari
- [KMP Algorithm Explained - CodeHelp](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Detailed tutorial with examples
- [KMP Algorithm - GeeksforGeeks](https://www.youtube.com/watch?v=Vg5mJK4moeE) - GFG explanation

### Rabin-Karp Algorithm
- [Rabin-Karp Algorithm - Abdul Bari](https://www.youtube.com/watch?v=H4VrKHVG5qI) - Rolling hash technique explained
- [Rabin-Karp Algorithm - GeeksforGeeks](https://www.youtube.com/watch?v=qQ8vU6V0u8Y) - Practical implementation

### String Matching Overview
- [String Matching Algorithms - Introduction](https://www.youtube.com/watch?v=5i7oKodCRJo) - Comparison of all methods
- [LeetCode 28 Solution Walkthrough](https://www.youtube.com/watch?v=Gjkhm1gYIMw) - Problem-solving session

---

## Common Pitfalls

### 1. Off-by-One Errors
```python
# Wrong: range(n - m)
# Correct: range(n - m + 1) for inclusive check
```

### 2. Hash Collisions in Rabin-Karp
Always verify character by character when hash values match:
```python
if p_hash == t_hash:
    # VERIFY! Different strings can have same hash
    for j in range(m):
        if text[i + j] != pattern[j]:
            break
```

### 3. Empty Pattern Handling
```python
# Edge case: empty pattern should match at every position
if m == 0:
    return list(range(n + 1))
```

### 4. LPS Array Index
When resuming pattern search after a match:
```python
# Wrong: j = lps[j]
# Correct: j = lps[j - 1]  # Use j-1 because we want previous position
```

### 5. Negative Hash Values
In Rabin-Karp, the rolling formula can produce negative values:
```python
# Fix: Add prime to make positive
if t_hash < 0:
    t_hash += prime
```

---

## Practice Problems

### Beginner
1. [28. Implement strStr()](https://leetcode.com/problems/implement-strstr/) - Use KMP or built-in
2. [796. Rotate String](https://leetcode.com/problems/rotate-string/) - Simple string check

### Intermediate
1. [686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/) - String repetition + search
2. [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) - Pattern detection

### Advanced
1. [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - Multiple pattern matching
2. [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) - Sliding window with KMP

---

## Summary

String matching algorithms are fundamental tools in a programmer's toolkit. The **naive approach** provides simplicity, **KMP** offers guaranteed optimal performance, and **Rabin-Karp** excels at multiple pattern scenarios. Understanding the intuition behind each algorithm—how they leverage previously computed information to avoid redundant comparisons—is key to mastering this pattern.

**Key Takeaways**:
- KMP's LPS array is the key to avoiding backtracking
- Rabin-Karp's rolling hash enables O(1) window updates
- Always handle edge cases (empty strings, single characters)
- Verify hash matches in Rabin-Karp to prevent false positives
