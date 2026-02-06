# Find the Index of the First Occurrence in a String

## Problem Description

Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

This is a classic string searching problem, also known as the **substring search** or **pattern matching** problem. It's commonly referred to as the `strStr()` function in C/C++ or `indexOf()` in Java/JavaScript.

### What is strStr()?

The `strStr()` function returns the starting index of the first occurrence of a substring (pattern) within another string (text). If the substring is not found, it typically returns `-1`. This is equivalent to:

- Python's [`str.find()`](https://docs.python.org/3/library/stdtypes.html#str.find)
- Java's [`String.indexOf()`](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html#indexOf-java.lang.String-)
- JavaScript's [`String.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)
- C++'s [`string.find()`](https://en.cppreference.com/w/cpp/string/basic_string/find)

### Example 1

**Input:** `haystack = "sadbutsad"`, `needle = "sad"`

**Output:** `0`

**Explanation:** The substring "sad" first appears at index 0 in "sadbutsad".

### Example 2

**Input:** `haystack = "leetcode"`, `needle = "leeto"`

**Output:** `-1`

**Explanation:** The substring "leeto" does not appear in "leetcode", so we return `-1`.

### Example 3

**Input:** `haystack = "mississippi"`, `needle = "issip"`

**Output:** `4`

**Explanation:** The substring "issip" first appears starting at index 4 in "mississippi".

### Example 4

**Input:** `haystack = "hello"`, `needle = "hello"`

**Output:** `0`

**Explanation:** The substring "hello" is identical to the haystack, so the first occurrence is at index 0.

### Example 5

**Input:** `haystack = "aaaaa"`, `needle = "bba"`

**Output:** `-1`

**Explanation:** The substring "bba" does not appear in "aaaaa", so we return `-1`.

### Constraints

- `1 <= haystack.length <= 10^4`
- `1 <= needle.length <= 10^4`
- `haystack` and `needle` consist of only lowercase English letters (`'a'` to `'z'`)

---

## Intuition

The problem asks us to find the first occurrence of a pattern (needle) within a text (haystack). At first glance, this seems straightforward - we could check every possible starting position in the haystack and see if the needle matches. However, this naive approach can be inefficient for large inputs.

### Key Observations

1. **Sliding Window Concept**: We can slide the needle over the haystack, checking each possible starting position.

2. **Early Termination**: If the needle is longer than the haystack, we can immediately return `-1`.

3. **Edge Cases**: If the needle is empty, we should return 0 (by convention).

4. **Optimization Opportunity**: The naive approach has O(m×n) complexity where m is haystack length and n is needle length. We can do better with advanced algorithms.

### Why Naive Approach Fails for Large Inputs

Consider a worst-case scenario:
- `haystack = "aaaaa...aaaa"` (10,000 'a' characters)
- `needle = "aaaab"` (4,000 'a' followed by 'b')

The naive approach would compare thousands of characters at each position, resulting in O(m×n) comparisons - approximately 40 million character comparisons, which is inefficient.

### Better Approaches

Several advanced algorithms achieve O(m+n) time complexity:

1. **KMP (Knuth-Morris-Pratt)**: Uses a "failure function" to skip unnecessary comparisons
2. **Rabin-Karp**: Uses rolling hash to quickly filter out non-matching positions
3. **Z-Algorithm**: Builds a Z-array to find pattern matches efficiently

---

## Approach 1: Brute Force (Sliding Window)

This is the most straightforward approach. We slide the needle over the haystack and check each possible starting position.

### Python Solution

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        
        h, n = len(haystack), len(needle)
        
        for i in range(h - n + 1):
            if haystack[i:i + n] == needle:
                return i
        
        return -1
```
<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        for (int i = 0; i <= h - n; i++) {
            if (haystack.substr(i, n) == needle) {
                return i;
            }
        }
        
        return -1;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        for (int i = 0; i <= h - n; i++) {
            if (haystack.substring(i, i + n).equals(needle)) {
                return i;
            }
        }
        
        return -1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    
    const h = haystack.length;
    const n = needle.length;
    
    for (let i = 0; i <= h - n; i++) {
        if (haystack.substring(i, i + n) === needle) {
            return i;
        }
    }
    
    return -1;
};
```
````

### Explanation

1. **Edge case check**: If needle is empty, return 0
2. **Calculate lengths**: Get the lengths of both strings
3. **Slide through haystack**: For each possible starting position `i` from 0 to `h - n`
4. **Check match**: Extract substring of length `n` and compare with needle
5. **Return index**: If match found, return the current index
6. **Return -1**: If no match found after checking all positions

### Optimization: Character-by-Character Comparison

Instead of using substring extraction (which creates a new string), we can compare character by character and exit early on mismatch:

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        
        h, n = len(haystack), len(needle)
        
        for i in range(h - n + 1):
            j = 0
            while j < n:
                if haystack[i + j] != needle[j]:
                    break
                j += 1
            else:
                return i
        
        return -1
```
<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        for (int i = 0; i <= h - n; i++) {
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
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        for (int i = 0; i <= h - n; i++) {
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
```javascript
var strStr = function(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    
    const h = haystack.length;
    const n = needle.length;
    
    for (let i = 0; i <= h - n; i++) {
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

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m × n) in worst case |
| **Space Complexity** | O(1) - only using a few variables |
| **Best Case** | O(m) when needle is found at position 0 |
| **Worst Case** | O(m × n) when needle is not found or found at the end |

The worst-case scenario occurs when:
- The needle is not present in the haystack, or
- The needle appears only at the very end, or
- Many characters match partially before mismatching

Example worst case: `haystack = "aaaaa...aaaa"`, `needle = "aaaab"`

---

## Approach 2: KMP (Knuth-Morris-Pratt) Algorithm

KMP is a classic string matching algorithm that achieves O(m + n) time complexity. It uses a **prefix function** (also called "failure function" or "LPS array") to avoid redundant comparisons.

### Key Insight

When a mismatch occurs, instead of going back to the beginning of the pattern, KMP uses the precomputed LPS array to know how many characters we can skip.

### What is LPS Array?

LPS (Longest Proper Prefix which is also Suffix) array stores for each position `i` the length of the longest proper prefix of the substring `pattern[0...i]` that is also a suffix of this substring.

### Python Solution

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        
        h, n = len(haystack), len(needle)
        
        # Build LPS (Longest Proper Prefix which is also Suffix) array
        lps = [0] * n
        length = 0  # length of the previous longest prefix suffix
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
        
        # Search for needle in haystack using KMP
        i = j = 0  # i for haystack, j for needle
        
        while i < h:
            if haystack[i] == needle[j]:
                i += 1
                j += 1
                if j == n:
                    return i - j  # Found match at index i - j
            else:
                if j != 0:
                    j = lps[j - 1]
                else:
                    i += 1
        
        return -1
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
using namespace std;

class Solution {
private:
    void buildLPS(const string& pattern, vector<int>& lps) {
        int n = pattern.length();
        int length = 0;
        int i = 1;
        
        while (i < n) {
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
    }
    
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        if (n > h) {
            return -1;
        }
        
        // Build LPS array
        vector<int> lps(n, 0);
        buildLPS(needle, lps);
        
        // KMP search
        int i = 0, j = 0;
        while (i < h) {
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
```java
class Solution {
    private void buildLPS(String pattern, int[] lps) {
        int n = pattern.length();
        int length = 0;
        int i = 1;
        
        while (i < n) {
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
    }
    
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        if (n > h) {
            return -1;
        }
        
        // Build LPS array
        int[] lps = new int[n];
        buildLPS(needle, lps);
        
        // KMP search
        int i = 0, j = 0;
        while (i < h) {
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
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    
    const h = haystack.length;
    const n = needle.length;
    
    if (n > h) {
        return -1;
    }
    
    // Build LPS array
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
    
    // KMP search
    let j = 0;
    i = 0;
    while (i < h) {
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

#### Step 1: Build LPS Array

The LPS array helps us avoid unnecessary comparisons by telling us how many characters we can skip after a mismatch.

For pattern "ABABCABAB":
```
Pattern:  A B A B C A B A B
Index:    0 1 2 3 4 5 6 7 8
LPS:      0 0 1 2 0 1 2 3 4
```

For position 8 (character 'B'), the longest proper prefix that is also suffix is "ABAB" (length 4).

#### Step 2: KMP Search

1. Initialize two pointers: `i` for haystack, `j` for needle
2. While both pointers are within bounds:
   - If characters match: advance both pointers
   - If full match found (`j == n`): return starting index (`i - j`)
   - If mismatch occurs:
     - If `j > 0`: use LPS to backtrack `j` to `lps[j-1]`
     - If `j == 0`: advance only `i`

### Step-by-Step Example

Let's search for `needle = "ABABCABAB"` in `haystack = "ABABDABACDABABCABAB"`:

```
haystack: A B A B D A B A C D A B A B C A B A B
needle:   A B A B C A B A B
           ↑
           i=0, j=0 (match)

haystack: A B A B D A B A C D A B A B C A B A B
needle:     A B A B C A B A B
             ↑
             i=1, j=1 (match)

haystack: A B A B D A B A C D A B A B C A B A B
needle:       A B A B C A B A B
               ↑
               i=2, j=2 (match)

haystack: A B A B D A B A C D A B A B C A B A B
needle:         A B A B C A B A B
                 ↑
                 i=3, j=3 (match)

haystack: A B A B D A B A C D A B A B C A B A B
needle:           A B A B C A B A B
                   ↑
                   i=4, j=4 (mismatch: D vs C)

LPS[3] = 2, so j = 2
Continue matching from j=2...
```

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n) - building LPS is O(n), searching is O(m) |
| **Space Complexity** | O(n) - for the LPS array |
| **Best Case** | O(m) when needle is found at position 0 or doesn't exist |

### Why KMP is Efficient

In the worst-case scenario like `haystack = "aaaaa...aaa"` and `needle = "aaab"`, the naive approach would perform m×n comparisons. KMP, with its LPS array, avoids re-comparing characters that are already known to match, reducing the time to O(m + n).

---

## Approach 3: Rabin-Karp Algorithm

Rabin-Karp uses **rolling hash** to efficiently compute hash values of substrings, allowing quick comparison of potentially matching windows.

### Key Insight

Instead of comparing each character of the needle with each window in the haystack, we first compute a hash value. If the hash matches, then we do a full character-by-character comparison (to avoid hash collisions).

### Rolling Hash Formula

```
hash(s[i...i+n-1]) = (s[i] * p^(n-1) + s[i+1] * p^(n-2) + ... + s[i+n-1] * p^0) mod M
```

Where:
- `p` is a prime base (typically 26 or 31 for lowercase letters)
- `M` is a large prime modulus

### Solution

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        
        h, n = len(haystack), len(needle)
        
        if n > h:
            return -1
        
        # Rolling hash parameters
        base = 26  # Base for alphabet size
        mod = 2**31 - 1  # Large prime modulus
        
        # Calculate hash of needle
        needle_hash = 0
        for char in needle:
            needle_hash = (needle_hash * base + (ord(char) - ord('a') + 1)) % mod
        
        # Calculate hash of first window of haystack
        window_hash = 0
        for i in range(n):
            window_hash = (window_hash * base + (ord(haystack[i]) - ord('a') + 1)) % mod
        
        # Pre-calculate base^(n-1) for rolling hash
        base_power = pow(base, n - 1, mod)
        
        # Slide through haystack
        for i in range(h - n + 1):
            if window_hash == needle_hash:
                if haystack[i:i + n] == needle:
                    return i
            
            # Calculate hash for next window
            if i < h - n:
                window_hash = (window_hash - (ord(haystack[i]) - ord('a') + 1) * base_power) % mod
                window_hash = (window_hash * base + (ord(haystack[i + n]) - ord('a') + 1)) % mod
                # Handle negative modulo
                if window_hash < 0:
                    window_hash += mod
        
        return -1
```
<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        if (n > h) {
            return -1;
        }
        
        // Rolling hash parameters
        const int base = 26;
        const long long mod = 2'147'483'647; // Large prime
        
        // Calculate hash of needle
        long long needle_hash = 0;
        for (char c : needle) {
            needle_hash = (needle_hash * base + (c - 'a' + 1)) % mod;
        }
        
        // Calculate hash of first window
        long long window_hash = 0;
        for (int i = 0; i < n; i++) {
            window_hash = (window_hash * base + (haystack[i] - 'a' + 1)) % mod;
        }
        
        // Pre-calculate base^(n-1)
        long long base_power = 1;
        for (int i = 1; i < n; i++) {
            base_power = (base_power * base) % mod;
        }
        
        // Slide through haystack
        for (int i = 0; i <= h - n; i++) {
            if (window_hash == needle_hash) {
                if (haystack.substr(i, n) == needle) {
                    return i;
                }
            }
            
            if (i < h - n) {
                window_hash = (window_hash - (haystack[i] - 'a' + 1) * base_power) % mod;
                if (window_hash < 0) window_hash += mod;
                window_hash = (window_hash * base + (haystack[i + n] - 'a' + 1)) % mod;
            }
        }
        
        return -1;
    }
};
```
<!-- slide -->
```java
class Solution {
    private static final int BASE = 26;
    private static final long MOD = 2_147_483_647L; // Large prime
    
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        if (n > h) {
            return -1;
        }
        
        // Calculate hash of needle
        long needleHash = 0;
        for (int i = 0; i < n; i++) {
            needleHash = (needleHash * BASE + (needle.charAt(i) - 'a' + 1)) % MOD;
        }
        
        // Calculate hash of first window
        long windowHash = 0;
        for (int i = 0; i < n; i++) {
            windowHash = (windowHash * BASE + (haystack.charAt(i) - 'a' + 1)) % MOD;
        }
        
        // Pre-calculate base^(n-1)
        long basePower = 1;
        for (int i = 1; i < n; i++) {
            basePower = (basePower * BASE) % MOD;
        }
        
        // Slide through haystack
        for (int i = 0; i <= h - n; i++) {
            if (windowHash == needleHash) {
                if (haystack.substring(i, i + n).equals(needle)) {
                    return i;
                }
            }
            
            if (i < h - n) {
                windowHash = (windowHash - (haystack.charAt(i) - 'a' + 1) * basePower) % MOD;
                if (windowHash < 0) windowHash += MOD;
                windowHash = (windowHash * BASE + (haystack.charAt(i + n) - 'a' + 1)) % MOD;
            }
        }
        
        return -1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    
    const h = haystack.length;
    const n = needle.length;
    
    if (n > h) {
        return -1;
    }
    
    const BASE = 26;
    const MOD = 2**31 - 1;
    
    // Calculate hash of needle
    let needleHash = 0;
    for (let i = 0; i < n; i++) {
        needleHash = (needleHash * BASE + (needle.charCodeAt(i) - 96)) % MOD;
    }
    
    // Calculate hash of first window
    let windowHash = 0;
    for (let i = 0; i < n; i++) {
        windowHash = (windowHash * BASE + (haystack.charCodeAt(i) - 96)) % MOD;
    }
    
    // Pre-calculate base^(n-1)
    let basePower = 1;
    for (let i = 1; i < n; i++) {
        basePower = (basePower * BASE) % MOD;
    }
    
    // Slide through haystack
    for (let i = 0; i <= h - n; i++) {
        if (windowHash === needleHash) {
            if (haystack.substring(i, i + n) === needle) {
                return i;
            }
        }
        
        if (i < h - n) {
            windowHash = (windowHash - (haystack.charCodeAt(i) - 96) * basePower) % MOD;
            if (windowHash < 0) windowHash += MOD;
            windowHash = (windowHash * BASE + (haystack.charCodeAt(i + n) - 96)) % MOD;
        }
    }
    
    return -1;
};
```
````

### Explanation

1. **Calculate pattern hash**: Compute the hash value of the needle string
2. **Calculate initial window hash**: Compute the hash of the first `n` characters of haystack
3. **Pre-calculate base power**: Compute base^(n-1) for rolling hash computation
4. **Slide through haystack**:
   - If hash values match, verify with actual string comparison (to handle collisions)
   - Roll the window forward using the formula:
     - Remove the leftmost character: `hash - left_char * base^(n-1)`
     - Multiply remaining hash by base: `hash * base`
     - Add new rightmost character: `+ right_char`
     - Take modulo

### Handling Hash Collisions

Different strings can have the same hash value (collision). Therefore, when hash values match, we must verify with an actual character-by-character comparison to ensure correctness.

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n) average case, O(m × n) worst case (many collisions) |
| **Space Complexity** | O(1) - only using a few variables |
| **Worst Case** | When many hash collisions occur |

The worst case is rare but can happen with adversarial inputs designed to cause collisions.

### Example Walkthrough

For `haystack = "ABABDABACDABABCABAB"` and `needle = "ABABCABAB"`:

```
Window 0: "ABABD" hash = H1
Window 1: "BABDA" hash = H2 (roll from H1)
Window 2: "ABDAB" hash = H3 (roll from H2)
...
Window 10: "ABABCABAB" hash matches! Verify: matches needle exactly → return 10
```

---

## Approach 4: Z-Algorithm

The Z-algorithm computes an array `Z` where `Z[i]` is the length of the longest substring starting at `i` that is also a prefix of the string. By concatenating `needle + "#" + haystack`, we can find all occurrences of the needle in the haystack.

### Key Insight

If we create a new string `S = needle + "#" + haystack`, then any position where `Z[i]` equals `len(needle)` indicates that the needle starts at that position in the haystack.

### Solution

````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        
        h, n = len(haystack), len(needle)
        
        if n > h:
            return -1
        
        # Create combined string: needle + "#" + haystack
        combined = needle + "#" + haystack
        l = len(combined)
        
        # Z-array initialization
        Z = [0] * l
        
        # Variables for Z-algorithm
        left = 0
        right = 0
        
        # Build Z-array
        for i in range(1, l):
            if i <= right:
                Z[i] = min(right - i + 1, Z[i - left])
            
            # Extend the match as far as possible
            while i + Z[i] < l and combined[Z[i]] == combined[i + Z[i]]:
                Z[i] += 1
            
            # Update [left, right] window
            if i + Z[i] - 1 > right:
                left = i
                right = i + Z[i] - 1
        
        # Find the first occurrence (position after needle + "#")
        for i in range(n + 1, l):
            if Z[i] == n:
                return i - (n + 1)
        
        return -1
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
using namespace std;

class Solution {
private:
    void buildZArray(const string& s, vector<int>& Z) {
        int n = s.length();
        int left = 0, right = 0;
        
        for (int i = 1; i < n; i++) {
            if (i <= right) {
                Z[i] = min(right - i + 1, Z[i - left]);
            }
            
            while (i + Z[i] < n && s[Z[i]] == s[i + Z[i]]) {
                Z[i]++;
            }
            
            if (i + Z[i] - 1 > right) {
                left = i;
                right = i + Z[i] - 1;
            }
        }
    }
    
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        if (n > h) {
            return -1;
        }
        
        // Create combined string: needle + "#" + haystack
        string combined = needle + "#" + haystack;
        vector<int> Z(combined.length(), 0);
        
        buildZArray(combined, Z);
        
        // Find the first occurrence
        for (int i = n + 1; i < combined.length(); i++) {
            if (Z[i] == n) {
                return i - (n + 1);
            }
        }
        
        return -1;
    }
};
```
<!-- slide -->
```java
class Solution {
    private void buildZArray(String s, int[] Z) {
        int n = s.length();
        int left = 0, right = 0;
        
        for (int i = 1; i < n; i++) {
            if (i <= right) {
                Z[i] = Math.min(right - i + 1, Z[i - left]);
            }
            
            while (i + Z[i] < n && s.charAt(Z[i]) == s.charAt(i + Z[i])) {
                Z[i]++;
            }
            
            if (i + Z[i] - 1 > right) {
                left = i;
                right = i + Z[i] - 1;
            }
        }
    }
    
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        
        int h = haystack.length();
        int n = needle.length();
        
        if (n > h) {
            return -1;
        }
        
        // Create combined string: needle + "#" + haystack
        String combined = needle + "#" + haystack;
        int[] Z = new int[combined.length()];
        
        buildZArray(combined, Z);
        
        // Find the first occurrence
        for (int i = n + 1; i < combined.length(); i++) {
            if (Z[i] == n) {
                return i - (n + 1);
            }
        }
        
        return -1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    
    const h = haystack.length;
    const n = needle.length;
    
    if (n > h) {
        return -1;
    }
    
    // Create combined string: needle + "#" + haystack
    const combined = needle + '#' + haystack;
    const Z = new Array(combined.length).fill(0);
    
    // Build Z-array
    let left = 0, right = 0;
    for (let i = 1; i < combined.length; i++) {
        if (i <= right) {
            Z[i] = Math.min(right - i + 1, Z[i - left]);
        }
        
        while (i + Z[i] < combined.length && combined[Z[i]] === combined[i + Z[i]]) {
            Z[i]++;
        }
        
        if (i + Z[i] - 1 > right) {
            left = i;
            right = i + Z[i] - 1;
        }
    }
    
    // Find the first occurrence
    for (let i = n + 1; i < combined.length; i++) {
        if (Z[i] === n) {
            return i - (n + 1);
        }
    }
    
    return -1;
};
```
````

### Explanation

#### Z-Array Construction

1. **Initialize** `Z[0] = 0` by definition
2. **Maintain** a `[left, right]` window representing the longest prefix match so far
3. **For each position `i`**:
   - If `i` is within the window, copy the value from the mirrored position
   - Try to extend the match as far as possible
   - Update the window if a longer match is found

#### Searching for Pattern

After building the Z-array for `needle + "#" + haystack`:
- Any position `i > n` (after the separator) where `Z[i] == n` means the needle starts at position `i - (n + 1)` in the haystack

### Example

For `needle = "ABABCABAB"` and `haystack = "ABABDABACDABABCABAB"`:

```
Combined: "ABABCABAB#ABABDABACDABABCABAB"
                   ↑ separator at position 10

Z-array values at positions 11+ show matches:
- Position 18: Z[18] = 9 (9 characters match "ABABCABAB")
- This means needle starts at 18 - 11 = 7 in the combined string
- In haystack: 7 - 10 = -3? Wait, calculation is wrong...

Correct calculation:
Position in combined = position in haystack + len(needle) + 1
So if Z[i] == n, the haystack position is i - (n + 1)
```

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n) - single pass through combined string |
| **Space Complexity** | O(m + n) - for the Z-array and combined string |
| **Best Case** | O(m + n) - always linear |

### Z-Algorithm vs KMP

Both KMP and Z-Algorithm achieve O(m + n) time complexity:
- **KMP**: Uses LPS array, then searches with it
- **Z-Algorithm**: Computes Z-array on combined string

The Z-algorithm is often simpler to implement but uses slightly more space.

---

## Approach 5: Built-in Functions

Most programming languages provide built-in functions for substring search.

### Solution
````carousel
```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        return haystack.find(needle)
```
<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        return haystack.find(needle);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        return haystack.indexOf(needle);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    return haystack.indexOf(needle);
};
```
````

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | Varies by implementation, typically O(m + n) |
| **Space Complexity** | O(1) - built-in, no extra space needed |

### Note

While built-in functions are convenient, the problem typically expects you to implement the algorithm yourself (especially in interviews). The built-in functions are usually implemented using efficient algorithms like Boyer-Moore or Two-Way algorithm.

---

## Complexity Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| **Brute Force** | O(m × n) | O(1) | Small inputs, simplicity |
| **KMP** | O(m + n) | O(n) | General purpose, guaranteed linear time |
| **Rabin-Karp** | O(m + n) average | O(1) | Multiple pattern search, hash-based filtering |
| **Z-Algorithm** | O(m + n) | O(m + n) | When Z-array is needed for other purposes |
| **Built-in** | Varies | O(1) | Production code, convenience |

Where:
- `m = len(haystack)`
- `n = len(needle)`

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[Implement strStr()](/solutions/find-the-index-of-the-first-occurrence-in-a-string.md)** | Easy | Find first occurrence of pattern in text (this problem) |
| **[Permutation in String](/solutions/permutation-in-string.md)** | Medium | Check if permutation of pattern exists in text |
| **[Repeated Substring Pattern](/solutions/repeated-substring-pattern.md)** | Easy | Check if string can be formed by repeating substring |
| **[Longest Common Prefix](/solutions/longest-common-prefix.md)** | Easy | Find longest common prefix among strings |
| **[Wildcard Matching](/solutions/wildcard-matching.md)** | Hard | Pattern matching with wildcards |
| **[Regular Expression Matching](/solutions/regular-expression-matching.md)** | Hard | Full regex matching |

### LeetCode Related Problems

1. **[28. Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)** - Easy (this problem)
2. **[796. Rotate String](https://leetcode.com/problems/rotate-string/)** - Easy
3. **[459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)** - Easy
4. **[567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)** - Medium
5. **[686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/)** - Medium
6. **[214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)** - Hard

---

## Followup Questions

### 1. How would you modify the algorithm to find all occurrences of the needle in the haystack?

To find all occurrences, instead of returning on the first match, you would continue searching after each match. For KMP, you would reset `j` to `lps[j-1]` after each full match instead of returning. This gives you all starting indices where the needle appears.

### 2. What if the needle can contain wildcards like '*' and '?'?

For wildcard matching, you would need a different algorithm like dynamic programming (DP) or recursive backtracking. The DP approach uses a 2D table where `dp[i][j]` indicates whether the first `i` characters of pattern match the first `j` characters of text. This is more complex but handles wildcards naturally.

### 3. How would you handle Unicode characters instead of ASCII?

For Unicode, the core algorithms remain the same, but you need to be careful with character encoding. The hash function in Rabin-Karp would need to use a larger base and modulus to avoid collisions. Python's built-in Unicode handling makes this easier. In Java/JavaScript, strings are typically UTF-16, so `charAt()` still works but you might need to handle surrogate pairs for characters outside the BMP.

### 4. Can you extend this to search for multiple patterns simultaneously?

Yes, this is called **multi-pattern string matching**. The Aho-Corasick algorithm builds a finite state machine from all patterns and can find all occurrences of all patterns in O(m + n + z) time where z is the total number of matches. Alternatively, the Rabin-Karp approach can be extended by computing hash values for all patterns and checking each window against all patterns.

### 5. What are the trade-offs between KMP and Z-algorithm?

KMP's main advantage is its O(n) auxiliary space (for the LPS array) while Z-algorithm needs O(n) for the Z-array. KMP might have better cache locality during the search phase. Z-algorithm is conceptually simpler and can be easier to implement correctly. Both have the same O(m+n) time complexity.

### 6. How would you optimize for the case where the needle appears multiple times consecutively?

For patterns like "aaa" in "aaaaa", you can optimize by using run-length encoding or by recognizing that when a match is found, the next possible match position can be calculated based on the LPS value at the end of the match. For "aaa" in "aaaaa", after finding a match at position 0, the next possible match must start at position 1 (not 2 as a naive approach might try).

### 7. What if the haystream is extremely large and cannot fit in memory?

For streaming data, you would need a streaming pattern matching algorithm. One approach is to use a finite automaton (like KMP's) that processes one character at a time while maintaining state. The memory usage would be O(n) for the pattern and O(1) for the state. You would output matches as they are found in the stream.

---

## Video Tutorials

1. **[Strstr - Implement strStr() - LeetCode 28 - Complete Solution](https://www.youtube.com/watch?v=BP7TqB1PlU0)** - Comprehensive walkthrough with multiple approaches
2. **[KMP Algorithm - Knuth Morris Pratt Pattern Searching](https://www.youtube.com/watch?v=4jY57Ehc13Q)** - Detailed KMP explanation
3. **[Rabin-Karp Algorithm Explained](https://www.youtube.com/watch?v=qQ8vU3M6Wao)** - Rolling hash explained
4. **[Z-Algorithm Tutorial](https://www.youtube.com/watch?v=CpZh4eV8xVE)** - Z-array construction explained

---

## Summary

The **Find the Index of the First Occurrence in a String** problem is a classic string matching challenge with multiple solution approaches:

### Key Takeaways

1. **Brute Force** is simple but inefficient for large inputs (O(m × n))
2. **KMP Algorithm** guarantees O(m + n) time using the LPS array
3. **Rabin-Karp** uses rolling hash for efficient filtering
4. **Z-Algorithm** builds a Z-array on the combined string
5. **Built-in functions** are convenient but you should know the underlying algorithms

### When to Use Which Approach

- **Small inputs**: Brute force is fine and simplest
- **General purpose**: KMP is reliable with guaranteed linear time
- **Multiple patterns**: Consider Rabin-Karp or Aho-Corasick
- **Production code**: Built-in functions are typically the best choice

### Important Edge Cases

- Empty needle: Return 0 (by convention)
- Needle longer than haystack: Return -1
- Empty haystack with non-empty needle: Return -1
- Needle equals haystack: Return 0
- All matching prefix except last character

The KMP algorithm is often the preferred choice for interviews because it demonstrates understanding of advanced string matching concepts while being relatively straightforward to implement correctly.
