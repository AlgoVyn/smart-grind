# KMP String Matching (Knuth-Morris-Pratt)

## Category
Advanced

## Description

The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that finds all occurrences of a pattern string within a text string in O(n + m) time, where n is the text length and m is the pattern length. It was discovered by Donald Knuth, James H. Morris, and Vaughan Pratt in 1977.

Unlike naive string matching which re-starts from the beginning of the pattern after each mismatch, KMP uses a pre-computed failure function (also called LPS array) to intelligently skip characters that have already been matched, ensuring no character is compared more than once.

---

## When to Use

Use the you need to solve KMP algorithm when problems involving:

- **Pattern Searching**: Finding all occurrences of a pattern within a text
- **String Matching**: Checking if a pattern exists in a larger string
- **Repeated Pattern Detection**: Identifying repeating substrings
- **Border Problems**: Finding proper prefixes that are also suffixes
- **Text Processing**: Large-scale text searching in editors, search engines
- **Bioinformatics**: DNA pattern matching in computational biology

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Best Use Case |
|-----------|-----------------|-------------------|---------------|
| **Naive** | O(n × m) | O(1) | Small strings, simple implementation |
| **KMP** | O(n + m) | O(m) | Large strings, guaranteed optimal |
| **Rabin-Karp** | O(n + m) avg | O(1) | Multiple patterns, hash-based filtering |
| **Z-Algorithm** | O(n + m) | O(n) | Similar to KMP, different preprocessing |

---

## Algorithm Explanation

### Core Concept

The KMP algorithm's key insight is that when a mismatch occurs, we can use information from the already-matched portion to determine where to resume matching, without backtracking in the text.

**Key Terminology**:
- **Text (T)**: The string to search in
- **Pattern (P)**: The string to search for
- **LPS Array**: Longest Proper Prefix which is also Suffix - stores the length of the longest proper prefix that is also a suffix for each position
- **Border**: A string that is both a proper prefix and a suffix of another string

### LPS Array Explanation

For pattern "ABABC", the LPS array is computed as follows:

```
Index:     0   1   2   3   4
Pattern:   A   B   A   B   C
LPS:       0   0   1   2   0
```

- `lps[0]` = 0 (no proper prefix that's also suffix for "A")
- `lps[1]` = 0 ("B" has no prefix=suffix)
- `lps[2]` = 1 ("AB" prefix matches suffix "AB")
- `lps[3]` = 2 ("AB" prefix matches suffix "AB")
- `lps[4]` = 0 ("C" has no prefix=suffix)

### Why KMP is Efficient

Consider searching for pattern "ABAB" in textABABAB "ABABAB":

1. **Naive approach** checks each position, wasting comparisons when partial matches fail
2. **KMP** uses the LPS array to skip unnecessary comparisons by knowing that after "ABAB" fails at the last character, we still have "AB" at the beginning that matches

This prevents the O(n × m) worst-case behavior and guarantees O(n + m) time complexity.

---

## Algorithm Steps

### Step 1: Build the LPS Array

```python
function computeLPS(pattern):
    m = length(pattern)
    lps = array of size m, initialized to 0
    length = 0  // length of previous longest prefix suffix
    i = 1
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]  // try shorter border
            else:
                lps[i] = 0
                i += 1
    
    return lps
```

### Step 2: Search Using KMP

```python
function kmpSearch(text, pattern):
    n = length(text)
    m = length(pattern)
    lps = computeLPS(pattern)
    
    i = 0  // index for text
    j = 0  // index for pattern
    result = []
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        
        if j == m:
            result.append(i - j)  // match found at position i-j
            j = lps[j - 1]  // continue searching for more matches
        else if i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]  // use LPS to skip characters
            else:
                i += 1  // move to next character in text
    
    return result
```

### Visual Walkthrough

**Example**: Find "ABABC" in "ABABDABABCDABABCABAB"

```python
Text:     A B A B D A B A C D A B A B C A B A B
Pattern:  A B A B C
          | | | | |
          0 1 2 3 4  ← Matched up to index 3

Mismatch at text[4]='D' vs pattern[4]='C'
Using lps[3]=2, shift pattern by 2 positions

Text:     A B A B D A B A C D A B A B C A B A B
Pattern:        A B A B C
                      | | | | |
                      Found at index 10!
```

---

## Implementation

### Template Code (All Languages)

````carousel
```python
# KMP Algorithm - Python Implementation
from typing import List

def compute_lps(pattern: str) -> List[int]:
    """
    Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
    
    Args:
        pattern: The pattern string to preprocess
        
    Returns:
        LPS array where lps[i] = length of longest proper prefix
        that is also suffix for pattern[0..i]
        
    Time: O(m) where m = pattern length
    Space: O(m)
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
    Find all occurrences of pattern in text using KMP algorithm.
    
    Args:
        text: The string to search in
        pattern: The substring to find
        
    Returns:
        List of starting indices where pattern occurs in text
        
    Time: O(n + m) where n = text length, m = pattern length
    Space: O(m) for LPS array
    """
    n = len(text)
    m = len(pattern)
    result = []
    
    # Edge cases
    if m == 0:
        return list(range(n + 1))
    if n == 0 or m > n:
        return []
    
    # Step 1: Preprocess pattern to build LPS array
    lps = compute_lps(pattern)
    
    # Step 2: Search for pattern in text
    i = 0  # index for text
    j = 0  # index for pattern
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        
        # Full pattern match found
        if j == m:
            result.append(i - j)
            j = lps[j - 1]  # Continue searching for more matches
        elif i < n and text[i] != pattern[j]:
            # Mismatch occurred
            if j != 0:
                j = lps[j - 1]  # Use LPS to skip characters
            else:
                i += 1  # Move to next character in text
    
    return result


# LeetCode 28: Implement strStr()
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        """Return the first index where needle is found in haystack, or -1."""
        matches = kmp_search(haystack, needle)
        return matches[0] if matches else -1


# Additional Utility: Check if pattern is repeated substring
def is_repeated_substring(s: str) -> bool:
    """Check if string s is made of repeated substring using KMP."""
    n = len(s)
    if n <= 1:
        return False
    
    lps = compute_lps(s)
    length = lps[n - 1]
    
    # String is repeated if n % (n - length) == 0
    return length > 0 and n % (n - length) == 0


# Example usage
if __name__ == "__main__":
    # Test 1: Basic pattern matching
    text = "ABABDABACDABABCABAB"
    pattern = "ABABCABAB"
    matches = kmp_search(text, pattern)
    print(f"Text: {text}")
    print(f"Pattern: {pattern}")
    print(f"Pattern found at indices: {matches}")  # Output: [10]
    
    # Test 2: Multiple occurrences
    text2 = "AAAAABAAABA"
    pattern2 = "AAAA"
    matches2 = kmp_search(text2, pattern2)
    print(f"\nText: {text2}")
    print(f"Pattern: {pattern2}")
    print(f"Pattern found at indices: {matches2}")  # Output: [0, 1, 2]
    
    # Test 3: LeetCode problem
    sol = Solution()
    print(f"\nLeetCode 28 Tests:")
    print(f"strStr('sadbutsad', 'sad') = {sol.strStr('sadbutsad', 'sad')}")  # 0
    print(f"strStr('leetcode', 'leeto') = {sol.strStr('leetcode', 'leeto')}")  # -1
    
    # Test 4: Repeated substring
    print(f"\nRepeated Substring Tests:")
    print(f"'abcabcabc' is repeated: {is_repeated_substring('abcabcabc')}")  # True
    print(f"'abcab' is repeated: {is_repeated_substring('abcab')}")  # False
```
<!-- slide -->
```cpp
// KMP Algorithm - C++ Implementation
#include <vector>
#include <string>
#include <iostream>
using namespace std;

/**
 * Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
 * 
 * Time: O(m) where m = pattern length
 * Space: O(m)
 */
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

/**
 * Find all occurrences of pattern in text using KMP algorithm.
 * 
 * Time: O(n + m)
 * Space: O(m)
 */
vector<int> kmpSearch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    vector<int> result;
    
    // Edge cases
    if (m == 0) {
        for (int i = 0; i <= n; i++) result.push_back(i);
        return result;
    }
    if (n == 0 || m > n) return result;
    
    // Preprocess pattern to build LPS array
    vector<int> lps = computeLPS(pattern);
    
    int i = 0;  // index for text
    int j = 0;  // index for pattern
    
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
        }
        
        // Full pattern match found
        if (j == m) {
            result.push_back(i - j);
            j = lps[j - 1];  // Continue searching
        } else if (i < n && text[i] != pattern[j]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}

// LeetCode 28: Implement strStr()
class Solution {
public:
    int strStr(string haystack, string needle) {
        vector<int> matches = kmpSearch(haystack, needle);
        return matches.empty() ? -1 : matches[0];
    }
};

// Check if string is repeated substring
bool isRepeatedSubstring(const string& s) {
    int n = s.length();
    if (n <= 1) return false;
    
    vector<int> lps = computeLPS(s);
    int length = lps[n - 1];
    
    return length > 0 && n % (n - length) == 0;
}

// Example usage
int main() {
    // Test 1: Basic pattern matching
    string text = "ABABDABACDABABCABAB";
    string pattern = "ABABCABAB";
    vector<int> matches = kmpSearch(text, pattern);
    
    cout << "Text: " << text << endl;
    cout << "Pattern: " << pattern << endl;
    cout << "Pattern found at indices: ";
    for (int idx : matches) cout << idx << " ";
    cout << endl;  // Output: 10
    
    // Test 2: Multiple occurrences
    string text2 = "AAAAABAAABA";
    string pattern2 = "AAAA";
    vector<int> matches2 = kmpSearch(text2, pattern2);
    cout << "\nText: " << text2 << endl;
    cout << "Pattern: " << pattern2 << endl;
    cout << "Pattern found at indices: ";
    for (int idx : matches2) cout << idx << " ";
    cout << endl;  // Output: 0 1 2
    
    // Test 3: LeetCode problem
    Solution sol;
    cout << "\nLeetCode 28 Tests:" << endl;
    cout << "strStr(\"sadbutsad\", \"sad\") = " << sol.strStr("sadbutsad", "sad") << endl;  // 0
    cout << "strStr(\"leetcode\", \"leeto\") = " << sol.strStr("leetcode", "leeto") << endl;  // -1
    
    // Test 4: Repeated substring
    cout << "\nRepeated Substring Tests:" << endl;
    cout << "\"abcabcabc\" is repeated: " << isRepeatedSubstring("abcabcabc") << endl;  // 1 (true)
    cout << "\"abcab\" is repeated: " << isRepeatedSubstring("abcab") << endl;  // 0 (false)
    
    return 0;
}
```
<!-- slide -->
```java
// KMP Algorithm - Java Implementation
import java.util.ArrayList;
import java.util.List;

public class KMPStringMatch {
    
    /**
     * Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
     * 
     * Time: O(m) where m = pattern length
     * Space: O(m)
     */
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
    
    /**
     * Find all occurrences of pattern in text using KMP algorithm.
     * 
     * Time: O(n + m)
     * Space: O(m)
     */
    public static List<Integer> kmpSearch(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        List<Integer> result = new ArrayList<>();
        
        // Edge cases
        if (m == 0) {
            for (int i = 0; i <= n; i++) result.add(i);
            return result;
        }
        if (n == 0 || m > n) return result;
        
        // Preprocess pattern to build LPS array
        int[] lps = computeLPS(pattern);
        
        int i = 0;  // index for text
        int j = 0;  // index for pattern
        
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }
            
            // Full pattern match found
            if (j == m) {
                result.add(i - j);
                j = lps[j - 1];  // Continue searching
            } else if (i < n && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return result;
    }
    
    // LeetCode 28: Implement strStr()
    static class Solution {
        public int strStr(String haystack, String needle) {
            List<Integer> matches = kmpSearch(haystack, needle);
            return matches.isEmpty() ? -1 : matches.get(0);
        }
    }
    
    // Check if string is repeated substring
    public static boolean isRepeatedSubstring(String s) {
        int n = s.length();
        if (n <= 1) return false;
        
        int[] lps = computeLPS(s);
        int length = lps[n - 1];
        
        return length > 0 && n % (n - length) == 0;
    }
    
    // Example usage
    public static void main(String[] args) {
        // Test 1: Basic pattern matching
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        List<Integer> matches = kmpSearch(text, pattern);
        
        System.out.println("Text: " + text);
        System.out.println("Pattern: " + pattern);
        System.out.println("Pattern found at indices: " + matches);  // [10]
        
        // Test 2: Multiple occurrences
        String text2 = "AAAAABAAABA";
        String pattern2 = "AAAA";
        List<Integer> matches2 = kmpSearch(text2, pattern2);
        System.out.println("\nText: " + text2);
        System.out.println("Pattern: " + pattern2);
        System.out.println("Pattern found at indices: " + matches2);  // [0, 1, 2]
        
        // Test 3: LeetCode problem
        Solution sol = new Solution();
        System.out.println("\nLeetCode 28 Tests:");
        System.out.println("strStr(\"sadbutsad\", \"sad\") = " + sol.strStr("sadbutsad", "sad"));  // 0
        System.out.println("strStr(\"leetcode\", \"leeto\") = " + sol.strStr("leetcode", "leeto"));  // -1
        
        // Test 4: Repeated substring
        System.out.println("\nRepeated Substring Tests:");
        System.out.println("\"abcabcabc\" is repeated: " + isRepeatedSubstring("abcabcabc"));  // true
        System.out.println("\"abcab\" is repeated: " + isRepeatedSubstring("abcab"));  // false
    }
}
```
<!-- slide -->
```javascript
// KMP Algorithm - JavaScript Implementation

/**
 * Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
 * @param {string} pattern - The pattern string to preprocess
 * @returns {number[]} LPS array
 * 
 * Time: O(m) where m = pattern length
 * Space: O(m)
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
 * 
 * Time: O(n + m)
 * Space: O(m)
 */
function kmpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const result = [];
    
    // Edge cases
    if (m === 0) {
        for (let i = 0; i <= n; i++) result.push(i);
        return result;
    }
    if (n === 0 || m > n) return result;
    
    // Preprocess pattern to build LPS array
    const lps = computeLPS(pattern);
    
    let i = 0;  // index for text
    let j = 0;  // index for pattern
    
    while (i < n) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }
        
        // Full pattern match found
        if (j === m) {
            result.push(i - j);
            j = lps[j - 1];  // Continue searching
        } else if (i < n && text[i] !== pattern[j]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}

/**
 * LeetCode 28: Implement strStr()
 * @param {string} haystack
 * @param {string} needle
 * @returns {number} First index of needle in haystack, or -1
 */
function strStr(haystack, needle) {
    const matches = kmpSearch(haystack, needle);
    return matches.length > 0 ? matches[0] : -1;
}

/**
 * Check if string is made of repeated substring using KMP.
 * @param {string} s - The string to check
 * @returns {boolean} True if s is repeated substring
 */
function isRepeatedSubstring(s) {
    const n = s.length;
    if (n <= 1) return false;
    
    const lps = computeLPS(s);
    const length = lps[n - 1];
    
    return length > 0 && n % (n - length) === 0;
}

// Example usage
// Test 1: Basic pattern matching
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
const matches = kmpSearch(text, pattern);

console.log(`Text: ${text}`);
console.log(`Pattern: ${pattern}`);
console.log(`Pattern found at indices: ${matches.join(', ')}`);  // 10

// Test 2: Multiple occurrences
const text2 = "AAAAABAAABA";
const pattern2 = "AAAA";
const matches2 = kmpSearch(text2, pattern2);
console.log(`\nText: ${text2}`);
console.log(`Pattern: ${pattern2}`);
console.log(`Pattern found at indices: ${matches2.join(', ')}`);  // 0, 1, 2

// Test 3: LeetCode problem
console.log(`\nLeetCode 28 Tests:`);
console.log(`strStr("sadbutsad", "sad") = ${strStr("sadbutsad", "sad")}`);  // 0
console.log(`strStr("leetcode", "leeto") = ${strStr("leetcode", "leeto")}`);  // -1

// Test 4: Repeated substring
console.log(`\nRepeated Substring Tests:`);
console.log(`"abcabcabc" is repeated: ${isRepeatedSubstring("abcabcabc")}`);  // true
console.log(`"abcab" is repeated: ${isRepeatedSubstring("abcab")}`);  // false
```
````

---

## Time Complexity Analysis

### Time Complexity

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Build LPS Array** | O(m) | Each character of pattern is processed once |
| **Search Phase** | O(n) | Each character of text is compared at most once |
| **Total** | **O(n + m)** | Linear time - guaranteed optimal |

### Space Complexity

| Data Structure | Space | Description |
|----------------|-------|-------------|
| **LPS Array** | O(m) | Stores prefix-suffix lengths |
| **Result List** | O(k) | Where k = number of matches |
| **Total** | **O(m)** | Auxiliary space only |

### Why O(n + m)?

The key insight is that:
- The `i` pointer in the text only moves forward (never backtracks)
- The `j` pointer in the pattern also only moves forward
- Each character of text is compared at most twice (once to match, possibly once to fail)
- Therefore, total comparisons ≤ 2n = O(n)

---

## Common Variations

### 1. Find First Occurrence Only

Instead of collecting all matches, return immediately when first match is found:

```python
def kmp_first_occurrence(text: str, pattern: str) -> int:
    n, m = len(text), len(pattern)
    if m == 0: return 0
    if n == 0 or m > n: return -1
    
    lps = compute_lps(pattern)
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                return i - j
        else:
            j = lps[j - 1] if j != 0 else 0
            if j == 0:
                i += 1
    
    return -1
```

### 2. Count Total Occurrences

```python
def kmp_count_occurrences(text: str, pattern: str) -> int:
    n, m = len(text), len(pattern)
    if m == 0: return n + 1
    if n == 0 or m > n: return 0
    
    lps = compute_lps(pattern)
    count = 0
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                count += 1
                j = lps[j - 1]
        else:
            j = lps[j - 1] if j != 0 else 0
            if j == 0:
                i += 1
    
    return count
```

### 3. Z-Algorithm Alternative

The Z-algorithm computes similar information but on a combined string:

```python
def z_algorithm(s: str) -> list[int]:
    """Compute Z-array: Z[i] = length of longest substring starting at i 
    that is also a prefix of s."""
    n = len(s)
    z = [0] * n
    l = r = 0
    
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        
        if i + z[i] - 1 > r:
            l = i
            r = i + z[i] - 1
    
    z[0] = n
    return z
```

### 4. Pattern Matching with Wildcards

KMP can be extended to handle wildcard characters:

```python
def kmp_with_wildcards(text: str, pattern: str) -> list[int]:
    """KMP with wildcard support: '?' matches any single character."""
    # Convert pattern to handle wildcards
    # This is a simplified version
    pass  # Implementation complexity varies
```

---

## Practice Problems

### Problem 1: Implement strStr()

**Problem:** [LeetCode 28](https://leetcode.com/problems/implement-strstr/)

**Description:** Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.

**How to Apply KMP:**
- Build LPS array for the needle pattern
- Search through haystack using the KMP algorithm
- Return first match index or -1 if no match

---

### Problem 2: Repeated Substring Pattern

**Problem:** [LeetCode 459](https://leetcode.com/problems/repeated-substring-pattern/)

**Description:** Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of it.

**How to Apply KMP:**
- Build LPS array for string s
- Check if `lps[n-1] > 0` and `n % (n - lps[n-1]) == 0`
- If true, string is made of repeated pattern of length `n - lps[n-1]`

---

### Problem 3: Repeated String Match

**Problem:** [LeetCode 686](https://leetcode.com/problems/repeated-string-match/)

**Description:** Given two strings `a` and `b`, return the minimum number of times `a` has to be repeated so that `b` is a substring of it.

**How to Apply KMP:**
- Concatenate a with itself (or more times) to create text
- Use KMP to search for pattern b in the concatenated string
- Find minimum repetitions needed

---

### Problem 4: Shortest Palindrome

**Problem:** [LeetCode 214](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Add minimum characters to the front of string s to make it a palindrome.

**How to Apply KMP:**
- Create string `s + '#' + reverse(s)`
- Build LPS array
- The last value of LPS gives the longest palindromic prefix
- Reverse remaining suffix and append to front

---

### Problem 5: Longest Prefix That Is Also Suffix

**Problem:** [GeeksforGeeks](https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1)

**Description:** Find the length of the longest prefix which is also a suffix in the given string.

**How to Apply KMP:**
- Build LPS array for the string
- The answer is `lps[n-1]` where n is string length

---

## Video Tutorial Links

### Fundamentals

- [KMP Algorithm - Abdul Bari](https://www.youtube.com/watch?v=4jY57Ehc14Y) - Comprehensive explanation with visualizations
- [KMP Algorithm Explained - CodeHelp](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Detailed tutorial with examples
- [KMP Algorithm - GeeksforGeeks](https://www.youtube.com/watch?v=Vg5mJK4moeE) - GFG explanation

### Practical Implementation

- [LeetCode 28 Solution - strStr](https://www.youtube.com/watch?v=BP7TqB1PlU0) - Complete walkthrough
- [KMP Pattern Matching - Nick White](https://www.youtube.com/watch?v=qMkyrr1cqEk) - Implementation guide
- [Repeated Substring Pattern - KMP Approach](https://www.youtube.com/watch?v=naf2y1wSp8w) - Problem solution

### Advanced Topics

- [Z-Algorithm vs KMP](https://www.youtube.com/watch?v=dgPabGzjT6w) - Comparison of string matching algorithms
- [String Matching Overview](https://www.youtube.com/watch?v=5i7oKodCRJo) - All methods compared

---

## Follow-up Questions

### Q1: What is the difference between KMP and Z-algorithm?

**Answer:** Both achieve O(n + m) time complexity:
- **KMP**: Computes LPS array on the pattern separately, then searches
- **Z-Algorithm**: Computes Z-array on the concatenated string (pattern + # + text)
- KMP is often preferred for pattern-only preprocessing; Z-algorithm is more intuitive for some problems

### Q2: Why is KMP better than naive string matching?

**Answer:** Naive approach can degrade to O(n × m) in worst case (e.g., "aaa...a" vs "aa...b"). KMP guarantees O(n + m) by using the LPS array to skip characters, ensuring no character in the text is compared more than once.

### Q3: Can KMP handle multiple patterns simultaneously?

**Answer:** For multiple patterns, consider:
- Building a trie of patterns and using KMP-like failure function (Aho-Corasick)
- Running KMP separately for each pattern (O(total pattern length + text length))
- Using Rabin-Karp for multiple patterns

### Q4: What is the space-time trade-off in KMP?

**Answer:** KMP trades O(m) space for O(n + m) time. The LPS array allows O(n) search time but requires O(m) auxiliary space. For memory-constrained environments, you could compute LPS on-the-fly (more complex implementation).

### Q5: How does KMP handle edge cases?

**Answer:** Key edge cases:
- Empty pattern: Return all indices (including position after last char)
- Pattern longer than text: Return empty/no match
- Single character pattern: Works normally
- All same characters: LPS array grows incrementally, search still O(n)

---

## Summary

The Knuth-Morris-Pratt (KMP) algorithm is a fundamental string matching algorithm that achieves optimal O(n + m) time complexity by preprocessing the pattern into an LPS (Longest Prefix Suffix) array. This preprocessing allows the algorithm to skip redundant character comparisons when mismatches occur.

**Key Takeaways**:

1. **LPS Array**: The heart of KMP - stores the longest proper prefix that is also a suffix for each position
2. **No Backtracking**: Text pointer never moves backward, ensuring linear time
3. **Preprocessing**: O(m) time to build LPS, then O(n) to search
4. **Space Trade-off**: O(m) auxiliary space for O(n + m) time guarantee
5. **Applications**: Beyond pattern matching, used in repeated substring detection, palindrome problems, and as a building block for more complex algorithms

**When to Use KMP**:
- Large text and pattern sizes
- Guaranteed linear time required
- Pattern is searched multiple times (preprocess once)
- Problems involving borders, prefixes, and suffixes

KMP is an essential algorithm for any programmer's toolkit and frequently appears in technical interviews at major tech companies.
