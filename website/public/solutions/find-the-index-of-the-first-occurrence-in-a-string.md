# Find the Index of the First Occurrence in a String

## Problem Statement

LeetCode Problem 28: Find the Index of the First Occurrence in a String

Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

### Key Details:
- If `needle` is an empty string, return 0 (per LeetCode's historical behavior)
- Both inputs consist of lowercase English letters
- The solution should handle all edge cases including:
  - Needle longer than haystack (return -1)
  - Needle equals haystack (return 0)
  - Multiple occurrences of needle

### Constraints:
- `0 ≤ haystack.length, needle.length ≤ 5 * 10⁴`
- `haystack` and `needle` consist of only lowercase English characters

---

## Examples

### Example 1:
**Input:** `haystack = "sadbutsad"`, `needle = "sad"`

**Output:** `0`

**Explanation:** "sad" occurs at index 0 and 6. The first occurrence is at index 0.

---

### Example 2:
**Input:** `haystack = "leetcode"`, `needle = "leeto"`

**Output:** `-1`

**Explanation:** "leeto" does not occur in "leetcode".

---

### Example 3:
**Input:** `haystack = "hello"`, `needle = "ll"`

**Output:** `2`

**Explanation:** "ll" occurs at index 2 in "hello".

---

### Example 4:
**Input:** `haystack = "a"`, `needle = "a"`

**Output:** `0`

**Explanation:** Both strings are identical.

---

### Example 5:
**Input:** `haystack = "abc"`, `needle = "abcd"`

**Output:** `-1`

**Explanation:** Needle is longer than haystack.

---

## Intuition

The problem asks to find the first occurrence of a substring (needle) within a larger string (haystack). This is a classic string matching problem with several possible approaches:

1. **Brute Force:** Check each possible starting position in haystack and compare characters with needle
2. **KMP Algorithm:** Preprocess the needle to create a failure function (partial match table) for efficient matching
3. **Rabin-Karp Algorithm:** Use rolling hash to compare substrings in constant time after preprocessing
4. **Built-in Methods:** Many programming languages provide built-in string search methods

The choice of approach depends on:
- Input size constraints
- Performance requirements
- Code simplicity

For small inputs, brute force is acceptable, but for large inputs, KMP or Rabin-Karp are more efficient.

---

## Approach 1: Brute Force

Check each possible starting index in haystack from 0 to (haystack.length - needle.length). For each starting index, compare characters one by one until either:
- All characters match (return the starting index)
- A mismatch is found (move to the next starting index)

### Implementation

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
            
        m, n = len(haystack), len(needle)
        
        if n > m:
            return -1
            
        for i in range(m - n + 1):
            j = 0
            while j < n and haystack[i + j] == needle[j]:
                j += 1
            if j == n:
                return i
                
        return -1
```
<!-- slide -->
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int m = haystack.length();
        int n = needle.length();
        
        if (n > m) {
            return -1;
        }
        
        for (int i = 0; i <= m - n; i++) {
            int j = 0;
            while (j < n && haystack.charAt(i + j) == needle.charAt(j)) {
                j++;
            }
            if (j == n) {
                return i;
            }
        }
        
        return -1;
    }
}
```
<!-- slide -->
```cpp
#include <string>

class Solution {
public:
    int strStr(std::string haystack, std::string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int m = haystack.size();
        int n = needle.size();
        
        if (n > m) {
            return -1;
        }
        
        for (int i = 0; i <= m - n; i++) {
            int j = 0;
            while (j < n && haystack[i + j] == needle[j]) {
                j++;
            }
            if (j == n) {
                return i;
            }
        }
        
        return -1;
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === "") {
        return 0;
    }
    
    const m = haystack.length;
    const n = needle.length;
    
    if (n > m) {
        return -1;
    }
    
    for (let i = 0; i <= m - n; i++) {
        let j = 0;
        while (j < n && haystack[i + j] === needle[j]) {
            j++;
        }
        if (j === n) {
            return i;
        }
    }
    
    return -1;
};
```
````

### Explanation

1. **Handle empty needle case** (return 0)
2. **Check if needle is longer than haystack** (return -1 if true)
3. **Iterate through all possible starting positions** in haystack
4. **For each position, compare characters** with needle until match or mismatch
5. **Return the first matching position** or -1 if no match is found

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O((m - n + 1) * n) | In worst case (e.g., haystack = "aaaaa", needle = "aaa"), each position is checked and all characters are compared |
| **Space** | O(1) | No additional space is used |

---

## Approach 2: KMP Algorithm (Knuth-Morris-Pratt)

The KMP algorithm preprocesses the needle to create a **partial match table (failure function)** that allows efficient backtracking when a mismatch occurs. This reduces the time complexity to O(m + n).

### Key Concept - Partial Match Table

The partial match table for a string `s` of length `n` is an array `lps` (longest prefix suffix) where `lps[i]` is the length of the longest proper prefix of `s[0..i]` which is also a suffix.

### Implementation

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
            
        m, n = len(haystack), len(needle)
        
        if n > m:
            return -1
            
        # Create LPS (Longest Prefix Suffix) array
        lps = [0] * n
        length = 0  # Length of the previous longest prefix suffix
        i = 1
        
        while i < n:
            if needle[i] == needle[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        
        # KMP search
        i = j = 0
        while i < m:
            if haystack[i] == needle[j]:
                i += 1
                j += 1
                
                if j == n:
                    return i - j
            else:
                if j != 0:
                    j = lps[j - 1]
                else:
                    i += 1
        
        return -1
```
<!-- slide -->
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int m = haystack.length();
        int n = needle.length();
        
        if (n > m) {
            return -1;
        }
        
        int[] lps = new int[n];
        int length = 0;
        int i = 1;
        
        while (i < n) {
            if (needle.charAt(i) == needle.charAt(length)) {
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
        
        int j = 0;
        i = 0;
        while (i < m) {
            if (haystack.charAt(i) == needle.charAt(j)) {
                i++;
                j++;
                
                if (j == n) {
                    return i - j;
                }
            } else {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return -1;
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <vector>

class Solution {
public:
    int strStr(std::string haystack, std::string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int m = haystack.size();
        int n = needle.size();
        
        if (n > m) {
            return -1;
        }
        
        std::vector<int> lps(n, 0);
        int length = 0;
        int i = 1;
        
        while (i < n) {
            if (needle[i] == needle[length]) {
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
        
        int j = 0;
        i = 0;
        while (i < m) {
            if (haystack[i] == needle[j]) {
                i++;
                j++;
                
                if (j == n) {
                    return i - j;
                }
            } else {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return -1;
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === "") {
        return 0;
    }
    
    const m = haystack.length;
    const n = needle.length;
    
    if (n > m) {
        return -1;
    }
    
    const lps = new Array(n).fill(0);
    let length = 0;
    let i = 1;
    
    while (i < n) {
        if (needle[i] === needle[length]) {
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
    
    let j = 0;
    i = 0;
    while (i < m) {
        if (haystack[i] === needle[j]) {
            i++;
            j++;
            
            if (j === n) {
                return i - j;
            }
        } else {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return -1;
};
```
````

### Explanation

1. **Create LPS array:** Preprocess the needle to determine the longest prefix suffix for each position
2. **KMP search:** Use the LPS array to efficiently backtrack the needle pointer when mismatches occur
3. **Avoid rechecking characters:** The LPS array tells us how much we can shift the needle without rechecking characters that are already known to match

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(m + n) | Preprocessing needle takes O(n), and searching takes O(m) |
| **Space** | O(n) | LPS array of size n is used |

---

## Approach 3: Rabin-Karp Algorithm (Rolling Hash)

The Rabin-Karp algorithm uses hashing to compare substrings in constant time. It computes the hash value of the needle and compares it with the hash values of all possible substrings of haystack of the same length.

### Key Concept - Rolling Hash

To avoid recalculating the hash value of each substring from scratch, we use a rolling hash technique where the hash value of the next substring is computed efficiently from the previous one.

### Implementation

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
            
        m, n = len(haystack), len(needle)
        
        if n > m:
            return -1
            
        # Base value for the rolling hash (26 for lowercase letters)
        base = 26
        # Modulus to prevent integer overflow
        mod = 10**9 + 7
        
        # Precompute base^(n-1) mod mod
        base_power = 1
        for _ in range(n - 1):
            base_power = (base_power * base) % mod
            
        # Compute needle's hash
        needle_hash = 0
        for char in needle:
            needle_hash = (needle_hash * base + (ord(char) - ord('a'))) % mod
            
        # Compute initial window hash for haystack
        window_hash = 0
        for i in range(n):
            window_hash = (window_hash * base + (ord(haystack[i]) - ord('a'))) % mod
            
        # Check if initial window matches
        if window_hash == needle_hash:
            # Verify character by character to avoid hash collision
            if haystack[:n] == needle:
                return 0
                
        # Slide the window through haystack
        for i in range(1, m - n + 1):
            # Remove leftmost character's contribution
            left_char = ord(haystack[i - 1]) - ord('a')
            window_hash = (window_hash - left_char * base_power) % mod
            
            # Add new right character's contribution
            right_char = ord(haystack[i + n - 1]) - ord('a')
            window_hash = (window_hash * base + right_char) % mod
            
            # Ensure hash is non-negative
            if window_hash < 0:
                window_hash += mod
                
            # Check if hash matches and verify characters
            if window_hash == needle_hash:
                if haystack[i:i + n] == needle:
                    return i
                    
        return -1
```
<!-- slide -->
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int m = haystack.length();
        int n = needle.length();
        
        if (n > m) {
            return -1;
        }
        
        int base = 26;
        long mod = 1000000007;
        
        long basePower = 1;
        for (int i = 0; i < n - 1; i++) {
            basePower = (basePower * base) % mod;
        }
        
        long needleHash = 0;
        for (char c : needle.toCharArray()) {
            needleHash = (needleHash * base + (c - 'a')) % mod;
        }
        
        long windowHash = 0;
        for (int i = 0; i < n; i++) {
            windowHash = (windowHash * base + (haystack.charAt(i) - 'a')) % mod;
        }
        
        if (windowHash == needleHash) {
            if (haystack.substring(0, n).equals(needle)) {
                return 0;
            }
        }
        
        for (int i = 1; i <= m - n; i++) {
            long leftChar = haystack.charAt(i - 1) - 'a';
            windowHash = (windowHash - leftChar * basePower) % mod;
            
            long rightChar = haystack.charAt(i + n - 1) - 'a';
            windowHash = (windowHash * base + rightChar) % mod;
            
            if (windowHash < 0) {
                windowHash += mod;
            }
            
            if (windowHash == needleHash) {
                if (haystack.substring(i, i + n).equals(needle)) {
                    return i;
                }
            }
        }
        
        return -1;
    }
}
```
<!-- slide -->
```cpp
#include <string>

class Solution {
public:
    int strStr(std::string haystack, std::string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int m = haystack.size();
        int n = needle.size();
        
        if (n > m) {
            return -1;
        }
        
        int base = 26;
        long long mod = 1000000007;
        
        long long basePower = 1;
        for (int i = 0; i < n - 1; i++) {
            basePower = (basePower * base) % mod;
        }
        
        long long needleHash = 0;
        for (char c : needle) {
            needleHash = (needleHash * base + (c - 'a')) % mod;
        }
        
        long long windowHash = 0;
        for (int i = 0; i < n; i++) {
            windowHash = (windowHash * base + (haystack[i] - 'a')) % mod;
        }
        
        if (windowHash == needleHash) {
            if (haystack.substr(0, n) == needle) {
                return 0;
            }
        }
        
        for (int i = 1; i <= m - n; i++) {
            long long leftChar = haystack[i - 1] - 'a';
            windowHash = (windowHash - leftChar * basePower) % mod;
            
            long long rightChar = haystack[i + n - 1] - 'a';
            windowHash = (windowHash * base + rightChar) % mod;
            
            if (windowHash < 0) {
                windowHash += mod;
            }
            
            if (windowHash == needleHash) {
                if (haystack.substr(i, n) == needle) {
                    return i;
                }
            }
        }
        
        return -1;
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === "") {
        return 0;
    }
    
    const m = haystack.length;
    const n = needle.length;
    
    if (n > m) {
        return -1;
    }
    
    const base = 26;
    const mod = 10**9 + 7;
    
    let basePower = 1;
    for (let i = 0; i < n - 1; i++) {
        basePower = (basePower * base) % mod;
    }
    
    let needleHash = 0;
    for (let char of needle) {
        needleHash = (needleHash * base + (char.charCodeAt(0) - 'a'.charCodeAt(0))) % mod;
    }
    
    let windowHash = 0;
    for (let i = 0; i < n; i++) {
        windowHash = (windowHash * base + (haystack.charCodeAt(i) - 'a'.charCodeAt(0))) % mod;
    }
    
    if (windowHash === needleHash) {
        if (haystack.slice(0, n) === needle) {
            return 0;
        }
    }
    
    for (let i = 1; i <= m - n; i++) {
        const leftChar = haystack.charCodeAt(i - 1) - 'a'.charCodeAt(0);
        windowHash = (windowHash - leftChar * basePower) % mod;
        
        const rightChar = haystack.charCodeAt(i + n - 1) - 'a'.charCodeAt(0);
        windowHash = (windowHash * base + rightChar) % mod;
        
        if (windowHash < 0) {
            windowHash += mod;
        }
        
        if (windowHash === needleHash) {
            if (haystack.slice(i, i + n) === needle) {
                return i;
            }
        }
    }
    
    return -1;
};
```
````

### Explanation

1. **Precompute powers of base:** Calculate `base^(n-1) % mod` for efficient hash updates
2. **Compute needle's hash:** Calculate the hash value of the entire needle
3. **Compute initial window hash:** Calculate hash for the first window of haystack
4. **Check for match:** Compare initial hash with needle's hash and verify characters to avoid collisions
5. **Slide the window:** For each subsequent window, compute new hash using rolling hash technique
6. **Verify matches:** For each hash match, verify characters to ensure it's not a collision

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(m + n) average case, O(m * n) worst case | In practice, it's very efficient, but worst case occurs when there are many hash collisions |
| **Space** | O(1) | No additional space proportional to input size |

---

## Approach 4: Built-in Methods

Many programming languages provide built-in string search methods that are optimized and easy to use.

### Implementation

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        return haystack.find(needle)
```
<!-- slide -->
```java
class Solution {
    public int strStr(String haystack, String needle) {
        return haystack.indexOf(needle);
    }
}
```
<!-- slide -->
```cpp
#include <string>

class Solution {
public:
    int strStr(std::string haystack, std::string needle) {
        size_t pos = haystack.find(needle);
        return pos != std::string::npos ? pos : -1;
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    return haystack.indexOf(needle);
};
```
````

### Explanation

This approach uses the built-in string search method provided by each language. These methods are typically optimized (often implementing algorithms like KMP or Boyer-Moore under the hood) and provide the simplest solution.

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(m + n) | Built-in methods are optimized for performance |
| **Space** | O(1) | No additional space is used |

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Brute Force** | O((m-n+1)*n) | O(1) | Simple, no preprocessing | Slow for large inputs |
| **KMP Algorithm** | O(m + n) | O(n) | Efficient, optimal | More complex to implement |
| **Rabin-Karp** | O(m + n) average | O(1) | Efficient, easy to implement | Hash collisions possible |
| **Built-in Methods** | O(m + n) | O(1) | Very simple, optimized | Less control over implementation |

**Recommendation:** Use built-in methods for code simplicity and performance. For understanding string matching algorithms, implement KMP or Rabin-Karp.

---

## Common Pitfalls

1. **Empty needle case:** LeetCode's problem statement historically returns 0 for an empty needle
2. **Needle longer than haystack:** Should return -1 immediately
3. **Hash collisions:** Rabin-Karp needs to verify matches to avoid collisions
4. **Case sensitivity:** The problem specifies lowercase letters, but solutions should be tested if case sensitivity changes
5. **Modulus overflow:** In Rabin-Karp, use large primes and 64-bit integers to reduce collision probability

---

## Related Problems

Here are some LeetCode problems that build on similar string matching concepts:

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [Implement strStr()](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | Easy | Same as this problem (Problem 28) |
| [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) | Easy | Check if string is repeated substring |
| [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) | Hard | Find longest prefix which is also suffix (similar to LPS array) |
| [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | Hard | Find all substrings containing all words |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) | Hard | Use KMP to find longest prefix palindrome |
| [Implement KMP Algorithm](https://leetcode.com/problems/implement-strstr/) | Medium | Variation of this problem |

---

## Video Tutorial Links

Here are some helpful video explanations:

- [LeetCode 28: Find the Index of the First Occurrence in a String](https://www.youtube.com/watch?v=Gjkhm1gYIMw) - Detailed walkthrough
- [KMP Algorithm Explained](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Comprehensive KMP tutorial
- [Rabin-Karp Algorithm](https://www.youtube.com/watch?v=H4VrKHVG5qI) - Rolling hash technique explained
- [String Matching Algorithms](https://www.youtube.com/watch?v=5i7oKodCRJo) - Comparison of brute force, KMP, and other methods
- [LeetCode 28 Solution in Java](https://www.youtube.com/watch?v=55ASiW3R8Bc) - Java-focused explanation

---

## Follow-up Questions

### Basic Understanding

1. **Why does the problem return 0 for an empty needle?**

   **Answer:** This is per LeetCode's historical behavior. An empty string is considered to be present at the beginning of any string.

2. **What if both haystack and needle are empty?**

   **Answer:** According to the problem constraints and examples, this case would return 0.

3. **How do you handle case sensitivity?**

   **Answer:** Convert both strings to the same case (all lowercase or all uppercase) before searching:
   ```python
   return haystack.lower().find(needle.lower())
   ```

---

### Algorithmic Extensions

4. **How would you find all occurrences of the needle in haystack?**

   **Answer:** Modify the KMP or Rabin-Karp algorithms to continue searching after finding a match. For KMP, after finding a match at index `i - j`, set `j = lps[j - 1]` to continue searching.

5. **How would you handle Unicode characters?**

   **Answer:** Adjust the base value in Rabin-Karp to handle a larger character set. For Unicode, a base of 256 or 65536 might be appropriate, but the modulus should also be increased.

6. **How would you implement a case-insensitive search?**

   **Answer:** Convert both strings to lowercase (or uppercase) before comparing, or adjust the character comparison to be case-insensitive.

---

### Performance and Optimization

7. **What is the fastest algorithm for string matching?**

   **Answer:** The Boyer-Moore algorithm is typically the fastest in practice for large inputs. It uses two heuristics (bad character and good suffix) to skip large portions of the haystack.

8. **How does the built-in `indexOf()` method work?**

   **Answer:** Most JavaScript engines (V8) and Java implementations use optimized algorithms like Boyer-Moore or KMP for efficient string matching.

9. **What is the space complexity of KMP?**

   **Answer:** O(n), where n is the length of the needle, for storing the LPS array.

---

### Edge Cases and Testing

10. **What edge cases should you test?**

    - Empty needle → returns 0
    - Needle longer than haystack → returns -1
    - Haystack equals needle → returns 0
    - Needle occurs at the end of haystack
    - Multiple occurrences of needle
    - All characters are the same (e.g., haystack = "aaaaa", needle = "aaa")

11. **How do you handle very large inputs (up to 5*10⁴ characters)?**

    **Answer:** Brute force would be too slow. Use KMP, Rabin-Karp, or built-in methods which are optimized for large inputs.

12. **What about overlapping occurrences?**

    **Answer:** For example, haystack = "aaaaa", needle = "aa" has overlapping occurrences at indices 0, 1, 2, 3. The solution should find the first occurrence (0).

---

### Real-World Applications

13. **Where is string matching used in real applications?**

    **Answer:** Text editors (find function), DNA sequencing (searching for patterns in genomes), web browsers (searching in web pages), and network security (intrusion detection systems).

14. **How is string matching used in search engines?**

    **Answer:** Search engines use string matching to find relevant documents containing the search query. Advanced techniques like fuzzy matching are also used.

15. **How would you implement a find and replace function?**

    **Answer:** Use string matching to find the needle, then replace it with the replacement string. Handle cases like overlapping matches and multiple occurrences.

---

## LeetCode Link

[Find the Index of the First Occurrence in a String - LeetCode 28](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)
