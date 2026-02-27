# Manacher's Algorithm

## Category
Advanced

## Description

Manacher's Algorithm is a linear-time algorithm used to find the longest palindromic substring in a given string. It solves this problem in O(n) time complexity, making it significantly more efficient than the naive O(n³) or dynamic programming O(n²) approaches.

The algorithm works by leveraging symmetry properties of palindromes and avoids redundant computations by utilizing previously computed information. It can find all palindromic substrings in linear time by transforming the string to handle both odd and even length palindromes uniformly.

---

## When to Use

Use Manacher's Algorithm when you need to solve problems involving:

- **Longest Palindromic Substring**: Finding the longest palindrome in a string
- **All Palindromic Substrings**: Enumerating all palindromes in a string
- **Palindromic Radius**: Finding the palindrome radius at each position
- **Counting Palindromes**: Counting the number of palindromic substrings
- **Center-based Analysis**: When you need to analyze palindromes centered at each position

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|-------------------|----------|
| **Manacher's Algorithm** | O(n) | O(n) | Longest palindrome, all palindromes |
| **Expand Around Center** | O(n²) | O(1) | Simple longest palindrome |
| **Dynamic Programming** | O(n²) | O(n²) | When you need all substrings |
| **Naive Approach** | O(n³) | O(1) | Never recommended |

---

## Algorithm Explanation

### Core Concept

Manacher's Algorithm works by maintaining a transformed string with special characters (like `#`) inserted between each character and at the boundaries. This transformation ensures that every palindrome has a uniform center, whether it's odd or even length.

The algorithm maintains:
1. **p[i]**: The radius of the palindrome centered at position `i` in the transformed string
2. **c**: The center of the rightmost palindrome found so far
3. **r**: The right boundary of that palindrome

### Transformed String

For a string "abcba", we transform it to "#a#b#c#b#a#" (length = 2n + 1)

This ensures:
- Every character is a potential center
- Odd and even palindromes are handled uniformly
- No index out of bounds issues at edges

### Visual Representation

For string "babad":

```
Original:    b  a  b  a  d
Transformed: #  b  #  a  #  b  #  a  #  d  #
Index:       0  1  2  3  4  5  6  7  8  9 10
```

Palindrome "bab" at original indices [0,2]:
- Center at transformed index 2
- Radius = 2 (extends to indices 0 and 4)

---

## Algorithm Steps

### Step 1: Transform the String

Insert a special character (e.g., `#`) between each character and at the beginning/end:

```python
def transform(s):
    result = '#'
    for c in s:
        result += c + '#'
    return result
```

### Step 2: Initialize Variables

- Create array `p` of size `n` (transformed length) initialized with zeros
- Set `c = 0` (center) and `r = 0` (right boundary)

### Step 3: Main Loop

For each position `i` from 0 to n-1:

1. **Find mirror position**: `mirror = 2*c - i`
2. **Initialize radius**: If `i < r`, use `min(p[mirror], r - i)`; otherwise, use 0
3. **Expand around center**: While valid, expand outward
4. **Update center**: If palindrome extends past `r`, update `c` and `r`
5. **Store result**: Save `p[i]`

### Step 4: Extract Longest Palindrome

Find the index with maximum `p[i]` and calculate the original substring.

---

## Implementation

### Template Code

`````carousel
```python
def manacher(s: str) -> list:
    """
    Manacher's Algorithm to find all palindromic substrings.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Args:
        s: Input string
        
    Returns:
        Array where p[i] represents the radius of palindrome centered at i
    """
    # Step 1: Transform the string
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    
    # Step 2: Initialize arrays
    p = [0] * n
    
    # Step 3: Main algorithm
    c = 0  # center of the rightmost palindrome
    r = 0  # right boundary of the rightmost palindrome
    
    for i in range(n):
        # Step 3a: Find mirror position
        mirror = 2 * c - i
        
        # Step 3b: Initialize radius
        if i < r:
            p[i] = min(p[mirror], r - i)
        
        # Step 3c: Expand around center
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        
        # Step 3d: Update center and right boundary
        if i + p[i] > r:
            c = i
            r = i + p[i]
    
    return p


def longest_palindrome(s: str) -> str:
    """
    Find the longest palindromic substring.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if not s:
        return ""
    
    p = manacher(s)
    t = '#' + '#'.join(s) + '#'
    
    # Find maximum radius
    max_len = max(p)
    center_idx = p.index(max_len)
    
    # Extract the palindrome
    start = (center_idx - max_len) // 2
    return s[start:start + max_len]


# Example usage
if __name__ == "__main__":
    test_cases = [
        "babad",
        "cbbd",
        "a",
        "ac",
        "racecar",
        "aaa"
    ]
    
    for s in test_cases:
        result = longest_palindrome(s)
        print(f"Input: '{s}' -> Longest Palindrome: '{result}'")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/**
 * Manacher's Algorithm to find all palindromic substrings.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * @param s Input string
 * @return Vector where p[i] represents the radius of palindrome centered at i
 */
vector<int> manacher(const string& s) {
    // Step 1: Transform the string
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }
    int n = t.length();
    
    // Step 2: Initialize arrays
    vector<int> p(n, 0);
    
    // Step 3: Main algorithm
    int c = 0;  // center
    int r = 0;  // right boundary
    
    for (int i = 0; i < n; i++) {
        // Step 3a: Find mirror position
        int mirror = 2 * c - i;
        
        // Step 3b: Initialize radius
        if (i < r) {
            p[i] = min(p[mirror], r - i);
        }
        
        // Step 3c: Expand around center
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && 
               t[i - p[i] - 1] == t[i + p[i] + 1]) {
            p[i]++;
        }
        
        // Step 3d: Update center and right boundary
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
    }
    
    return p;
}

/**
 * Find the longest palindromic substring.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
string longestPalindrome(const string& s) {
    if (s.empty()) return "";
    
    vector<int> p = manacher(s);
    
    // Find maximum radius
    int max_len = 0;
    int center_idx = 0;
    for (int i = 0; i < p.size(); i++) {
        if (p[i] > max_len) {
            max_len = p[i];
            center_idx = i;
        }
    }
    
    // Extract the palindrome
    int start = (center_idx - max_len) / 2;
    return s.substr(start, max_len);
}


int main() {
    vector<string> testCases = {"babad", "cbbd", "a", "ac", "racecar", "aaa"};
    
    for (const string& s : testCases) {
        cout << "Input: '" << s << "' -> Longest Palindrome: '" 
             << longestPalindrome(s) << "'" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
public class Manacher {
    
    /**
     * Manacher's Algorithm to find all palindromic substrings.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * 
     * @param s Input string
     * @return Array where p[i] represents the radius of palindrome centered at i
     */
    public static int[] manacher(String s) {
        // Step 1: Transform the string
        StringBuilder t = new StringBuilder("#");
        for (char c : s.toCharArray()) {
            t.append(c).append('#');
        }
        int n = t.length();
        
        // Step 2: Initialize arrays
        int[] p = new int[n];
        
        // Step 3: Main algorithm
        int c = 0;  // center
        int r = 0;  // right boundary
        
        for (int i = 0; i < n; i++) {
            // Step 3a: Find mirror position
            int mirror = 2 * c - i;
            
            // Step 3b: Initialize radius
            if (i < r) {
                p[i] = Math.min(p[mirror], r - i);
            }
            
            // Step 3c: Expand around center
            while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && 
                   t.charAt(i - p[i] - 1) == t.charAt(i + p[i] + 1)) {
                p[i]++;
            }
            
            // Step 3d: Update center and right boundary
            if (i + p[i] > r) {
                c = i;
                r = i + p[i];
            }
        }
        
        return p;
    }
    
    /**
     * Find the longest palindromic substring.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    public static String longestPalindrome(String s) {
        if (s == null || s.isEmpty()) {
            return "";
        }
        
        int[] p = manacher(s);
        
        // Find maximum radius
        int maxLen = 0;
        int centerIdx = 0;
        for (int i = 0; i < p.length; i++) {
            if (p[i] > maxLen) {
                maxLen = p[i];
                centerIdx = i;
            }
        }
        
        // Extract the palindrome
        int start = (centerIdx - maxLen) / 2;
        return s.substring(start, start + maxLen);
    }
    
    
    public static void main(String[] args) {
        String[] testCases = {"babad", "cbbd", "a", "ac", "racecar", "aaa"};
        
        for (String s : testCases) {
            System.out.println("Input: '" + s + "' -> Longest Palindrome: '" 
                    + longestPalindrome(s) + "'");
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Manacher's Algorithm to find all palindromic substrings.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * @param {string} s - Input string
 * @returns {number[]} Array where p[i] represents the radius of palindrome centered at i
 */
function manacher(s) {
    // Step 1: Transform the string
    const t = '#' + s.split('').join('#') + '#';
    const n = t.length;
    
    // Step 2: Initialize arrays
    const p = new Array(n).fill(0);
    
    // Step 3: Main algorithm
    let c = 0;  // center
    let r = 0;  // right boundary
    
    for (let i = 0; i < n; i++) {
        // Step 3a: Find mirror position
        const mirror = 2 * c - i;
        
        // Step 3b: Initialize radius
        if (i < r) {
            p[i] = Math.min(p[mirror], r - i);
        }
        
        // Step 3c: Expand around center
        while (i - p[i] - 1 >= 0 && 
               i + p[i] + 1 < n && 
               t[i - p[i] - 1] === t[i + p[i] + 1]) {
            p[i]++;
        }
        
        // Step 3d: Update center and right boundary
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
    }
    
    return p;
}

/**
 * Find the longest palindromic substring.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * @param {string} s - Input string
 * @returns {string} Longest palindromic substring
 */
function longestPalindrome(s) {
    if (!s) return "";
    
    const p = manacher(s);
    
    // Find maximum radius
    let maxLen = 0;
    let centerIdx = 0;
    for (let i = 0; i < p.length; i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIdx = i;
        }
    }
    
    // Extract the palindrome
    const start = Math.floor((centerIdx - maxLen) / 2);
    return s.slice(start, start + maxLen);
}


// Example usage
const testCases = ["babad", "cbbd", "a", "ac", "racecar", "aaa"];

testCases.forEach(s => {
    console.log(`Input: '${s}' -> Longest Palindrome: '${longestPalindrome(s)}'`);
});
```
`````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Transform String** | O(n) | Creating the transformed string |
| **Main Loop** | O(n) | Each character is processed once |
| **Expansion** | O(n) total | Overall linear, not quadratic |
| **Total** | **O(n)** | Linear time algorithm |

### Space Complexity

- **Transformed String**: O(n) - For the string with delimiters
- **Radius Array**: O(n) - For storing palindrome radii
- **Total**: O(n)

---

## Common Variations

### 1. Count All Palindromic Substrings

Count how many palindromic substrings exist in the string:

```python
def count_palindromes(s: str) -> int:
    """Count all palindromic substrings in O(n) time."""
    if not s:
        return 0
    
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n
    
    c = r = 0
    count = 0
    
    for i in range(n):
        if i < r:
            p[i] = min(p[2*c - i], r - i)
        
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        
        count += (p[i] + 1) // 2
        
        if i + p[i] > r:
            c = i
            r = i + p[i]
    
    return count
```

### 2. Longest Palindromic Substring with Start Index

Return both the palindrome and its starting position:

```python
def longest_palindrome_with_index(s: str) -> tuple:
    """Find longest palindrome and its starting index."""
    if not s:
        return ("", -1)
    
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n
    
    c = r = 0
    max_len = 0
    center = 0
    
    for i in range(n):
        if i < r:
            p[i] = min(p[2*c - i], r - i)
        
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        
        if p[i] > max_len:
            max_len = p[i]
            center = i
        
        if i + p[i] > r:
            c = i
            r = i + p[i]
    
    start = (center - max_len) // 2
    return (s[start:start + max_len], start)
```

### 3. Palindromic Prefix/Suffix Problems

Find the longest palindromic prefix or suffix:

```python
def longest_palindromic_prefix(s: str) -> str:
    """Find longest palindromic prefix using Manacher."""
    # Reverse string
    rev = s[::-1]
    # Concatenate with special character
    combined = s + '#' + rev
    # Use Manacher to find matching prefix
    p = manacher(combined)
    # The match ends at the middle of combined string
    center = len(s)
    max_len = p[center]
    return s[:max_len]
```

### 4. Minimum Character insertions for Palindrome

Find minimum insertions to make a string palindrome:

```python
def min_insertions_to_palindrome(s: str) -> int:
    """Minimum insertions to make string palindrome."""
    # Longest palindromic subsequence
    p = manacher(s)
    max_pal = max(p)
    return len(s) - max_pal
```

---

## Practice Problems

### Problem 1: Longest Palindromic Substring

**Problem:** [LeetCode 5](https://leetcode.com/problems/longest-palindromic-substring/)

**Description:** Given a string `s`, return the longest palindromic substring in `s`.

**How to Apply Manacher's Algorithm:**
- Use the template code to find the palindrome with maximum radius
- Extract the substring from the original string using the center and radius
- Time complexity: O(n)

---

### Problem 2: Palindromic Substrings

**Problem:** [LeetCode 647](https://leetcode.com/problems/palindromic-substrings/)

**Description:** Given a string `s`, return the number of palindromic substrings in `s`.

**How to Apply Manacher's Algorithm:**
- The radius array gives us information about palindromes at each position
- Each palindrome centered at `i` contributes `(p[i] + 1) // 2` palindromes
- Sum all contributions to get the answer in O(n)

---

### Problem 3: Longest Palindromic Subsequence

**Problem:** [LeetCode 516](https://leetcode.com/problems/longest-palindromic-subsequence/)

**Description:** Given a string `s`, return the length of the longest palindromic subsequence.

**How to Apply Manacher's Algorithm:**
- Note: Manacher finds substrings, not subsequences
- However, you can use it with string reverse to find LPS
- LPS = length of s - minimum insertions to make it palindrome

---

### Problem 4: Shortest Palindrome

**Problem:** [LeetCode 214](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Given a string `s`, you can add any number of characters in front of it to make it a palindrome. Return the shortest palindrome you can find.

**How to Apply Manacher's Algorithm:**
- Find the longest palindromic prefix in the string
- Reverse the remaining suffix and add it to the front
- Uses variation #3 (palindromic prefix)

---

### Problem 5: Palindrome Pairs

**Problem:** [LeetCode 336](https://leetcode.com/problems/palindrome-pairs/)

**Description:** Given a list of unique words, find all pairs of distinct indices `(i, j)` such that `words[i] + words[j]` is a palindrome.

**How to Apply Manacher's Algorithm:**
- Build a trie or hash map of reversed words
- For each word, find palindromic suffixes and pair with corresponding reversed words
- Manacher can help efficiently check palindrome property

---

## Video Tutorial Links

### Fundamentals

- [Manacher's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=4kT3AVK4GKA) - Comprehensive introduction
- [Manacher's Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=nbTSfrEfoE0) - Detailed explanation with visualizations
- [Longest Palindromic Substring (NeetCode)](https://www.youtube.com/watch?v=8jG1xI2kIdI) - LeetCode problem solution

### Advanced Topics

- [Palindromic Substrings (NeetCode)](https://www.youtube.com/watch?v=6kALZikXxLc) - Counting palindromes
- [Shortest Palindrome Problem](https://www.youtube.com/watch?v=vT7O0OmiNyM) - Using Manacher for palindrome pairs
- [Manacher's Algorithm - Practice](https://www.youtube.com/watch?v=6_1k2C2J1fQ) - Problem-solving strategies

### Comparison with Alternatives

- [Expand Around Center vs Manacher](https://www.youtube.com/watch?v=NVQt2P6NRtM) - When to use which approach

---

## Follow-up Questions

### Q1: Why do we use special characters in the transformation?

**Answer:** The transformation (adding `#` between characters and at boundaries) ensures that every palindrome has a single, well-defined center. Without it, even-length palindromes don't have a true center character. The transformation makes both odd and even length palindromes have a uniform representation.

### Q2: Can Manacher's Algorithm be used for circular strings?

**Answer:** Yes, by creating a doubled string (s + s) and applying Manacher with appropriate bounds. This is useful for problems like finding the longest palindromic substring in a circular string.

### Q3: How does the algorithm handle edge cases like empty strings or single characters?

**Answer:** The algorithm naturally handles these:
- Empty string: Returns empty result
- Single character: Returns that character as the palindrome
- All same characters: Returns the entire string

### Q4: What is the key insight behind Manacher's Algorithm's O(n) complexity?

**Answer:** The algorithm uses the symmetry property of palindromes. When we know a palindrome centered at `i`, we can infer information about palindromes at positions mirrored across the center. This allows us to skip redundant comparisons and only expand when necessary.

### Q5: Can Manacher's Algorithm be modified to find the longest palindromic substring of at least length k?

**Answer:** Yes, during the algorithm, you can maintain a queue or list of palindromes that meet the minimum length requirement. Alternatively, you can filter the results after running the algorithm.

---

## Summary

Manacher's Algorithm is an elegant linear-time solution for palindrome-related problems:

- **O(n) Time Complexity**: Much faster than O(n²) or O(n³) alternatives
- **O(n) Space Complexity**: Requires additional arrays for transformation and radii
- **Versatile**: Can be adapted for various palindrome problems
- **Key Insight**: Uses symmetry to avoid redundant comparisons

Key takeaways:
- Always transform the string with special characters
- Maintain center `c` and right boundary `r` for optimization
- Use mirror positions to skip unnecessary computations
- The radius array `p` contains valuable information for various queries
- Practice the template until it becomes second nature

This algorithm is essential for competitive programming and technical interviews, especially at major tech companies where string manipulation problems are common.

