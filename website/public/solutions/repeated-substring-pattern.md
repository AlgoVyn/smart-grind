# Repeated Substring Pattern

## Problem Description

Given a string `s`, check if it can be constructed by repeating a substring of it. In other words, determine if `s` can be formed by concatenating one or more copies of some substring of `s`.

Formally, a string `s` has a repeated substring pattern if there exists a non-empty string `sub` such that `s = sub + sub + ... + sub` (k times), where k ≥ 2.

For example:
- `"abab"` can be formed by repeating `"ab"` (k=2), so it returns `true`
- `"abcabcabc"` can be formed by repeating `"abc"` (k=3), so it returns `true`
- `"aba"` cannot be formed by repeating any substring, so it returns `false`

This problem is about detecting whether a string has a periodic structure where the entire string is composed of multiple copies of a smaller substring.

---

## Examples

### Example 1

**Input:**
```python
s = "abab"
```

**Output:**
```python
true
```

**Explanation:** The string `"abab"` can be constructed by repeating the substring `"ab"` twice: `"ab" + "ab" = "abab"`.

---

### Example 2

**Input:**
```python
s = "abcabcabc"
```

**Output:**
```python
true
```

**Explanation:** The string `"abcabcabc"` can be constructed by repeating the substring `"abc"` three times: `"abc" + "abc" + "abc" = "abcabcabc"`.

---

### Example 3

**Input:**
```python
s = "aba"
```

**Output:**
```python
false
```

**Explanation:** The string `"aba"` cannot be constructed by repeating any substring. The possible substrings are `"a"`, `"ab"`, `"aba"`, and `"b"`. None of these can be repeated to form `"aba"`.

---

### Example 4

**Input:**
```python
s = "aaaaa"
```

**Output:**
```python
true
```

**Explanation:** The string `"aaaaa"` can be constructed by repeating the substring `"a"` five times: `"a" + "a" + "a" + "a" + "a" = "aaaaa"`.

---

### Example 5 (Edge Cases)

**Input:**
```python
s = "a"
```

**Output:**
```python
false
```

**Explanation:** A single character string cannot be formed by repeating a substring at least twice, so it returns `false`.

---

### Example 6

**Input:**
```python
s = "xyzxyz"
```

**Output:**
```python
true
```

**Explanation:** The string `"xyzxyz"` can be constructed by repeating the substring `"xyz"` twice: `"xyz" + "xyz" = "xyzxyz"`.

---

### Example 7

**Input:**
```python
s = "abcdabcdab"
```

**Output:**
```python
false
```

**Explanation:** The string `"abcdabcdab"` cannot be constructed by repeating a substring. The total length is 10, which is not divisible by any possible substring length that would form the complete string.

---

## Constraints

- `1 <= s.length <= 10^4`
- `s` consists of lowercase English letters ('a' to 'z')
- The input string contains only lowercase alphabetic characters

---

## Intuition

The key insight for this problem is understanding what makes a string have a repeated pattern:

1. **Length Divisibility**: If a string `s` of length `n` can be formed by repeating a substring of length `L`, then `n` must be divisible by `L`. This means possible substring lengths are only the proper divisors of `n` (excluding `n` itself).

2. **Periodic Structure**: A string with a repeated pattern has a periodic structure. The smallest repeating unit is called the "period" of the string.

3. **Border/Prefix-Suffix Matching**: A string that can be formed by repeating a substring will have a border (a prefix that is also a suffix) whose length is related to the repeating pattern.

The challenge is to efficiently detect this pattern without trying all possible substrings explicitly, which would be O(n²) in the worst case.

---

## Approach 1: Brute Force with Divisibility Check

This is the most straightforward approach. We try all possible substring lengths that divide the string length and check if repeating that substring forms the original string.

**Algorithm:**
1. Let `n` be the length of string `s`
2. For each possible substring length `L` from 1 to `n//2`:
   - If `n % L != 0`, skip (the substring wouldn't fill the string exactly)
   - Extract the candidate substring `sub = s[0:L]`
   - Check if `sub * (n // L) == s`
   - If yes, return `true`
3. If no valid substring is found, return `false`

**Why it works:** This approach directly implements the definition. If a string can be formed by repeating a substring, then that substring must be a prefix of the string, and its length must divide the total length.

### Implementation

````carousel
```python
class Solution:
    # Approach 1: Brute Force with Divisibility Check
    def repeatedSubstringPattern_brute(self, s: str) -> bool:
        """
        Time: O(n * sqrt(n)) worst case
        Space: O(1)
        """
        n = len(s)
        for i in range(1, n // 2 + 1):
            if n % i == 0:
                substring = s[:i]
                if substring * (n // i) == s:
                    return True
        return False
```
<!-- slide -->
```cpp
// Approach 1: Brute Force with Divisibility Check
bool repeatedSubstringPattern_brute(string s) {
    int n = s.length();
    for (int i = 1; i <= n / 2; i++) {
        if (n % i == 0) {
            string sub = s.substr(0, i);
            string repeated = "";
            for (int j = 0; j < n / i; j++) {
                repeated += sub;
            }
            if (repeated == s) {
                return true;
            }
        }
    }
    return false;
}
```
<!-- slide -->
```java
// Approach 1: Brute Force with Divisibility Check
public boolean repeatedSubstringPattern_brute(String s) {
    int n = s.length();
    for (int i = 1; i <= n / 2; i++) {
        if (n % i == 0) {
            String sub = s.substring(0, i);
            StringBuilder repeated = new StringBuilder();
            for (int j = 0; j < n / i; j++) {
                repeated.append(sub);
            }
            if (repeated.toString().equals(s)) {
                return true;
            }
        }
    }
    return false;
}
```
<!-- slide -->
```javascript
// Approach 1: Brute Force with Divisibility Check
repeatedSubstringPattern_brute(s) {
    const n = s.length;
    for (let i = 1; i <= Math.floor(n / 2); i++) {
        if (n % i === 0) {
            const sub = s.slice(0, i);
            const repeated = sub.repeat(n / i);
            if (repeated === s) {
                return true;
            }
        }
    }
    return false;
}
```
````

## Approach 2: Using KMP Algorithm (LPS Array)

This is an optimized approach using the Knuth-Morris-Pratt (KMP) algorithm. The key insight is that a string with a repeated pattern will have a proper prefix that is also a suffix, and this border length relates to the repeating pattern.

**Algorithm:**
1. Build the LPS (Longest Proper Prefix which is also Suffix) array for the string
2. Let `L = lps[n-1]` be the length of the longest proper prefix which is also a suffix
3. If `L > 0` and `n % (n - L) == 0`, then the string has a repeated pattern
4. Otherwise, it doesn't

**Why it works:** The LPS array tells us the longest border of the string. If the string has a repeated pattern, there will be a border whose length allows the remaining part to be repeated exactly to fill the string.

### Implementation

````carousel
```python
class Solution:
    # Approach 2: KMP (LPS Array)
    def repeatedSubstringPattern_kmp(self, s: str) -> bool:
        """
        Time: O(n)
        Space: O(n)
        """
        def build_lps(pattern: str) -> list:
            lps = [0] * len(pattern)
            length = 0  # length of the previous longest prefix suffix
            i = 1
            
            while i < len(pattern):
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
        
        n = len(s)
        if n <= 1:
            return False
        
        lps = build_lps(s)
        lps_length = lps[n - 1]
        
        # Check if there is a repeated pattern
        return lps_length > 0 and n % (n - lps_length) == 0
```
<!-- slide -->
```cpp
// Approach 2: KMP (LPS Array)
vector<int> buildLPS(string pattern) {
    int n = pattern.length();
    vector<int> lps(n, 0);
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
    return lps;
}

bool repeatedSubstringPattern_kmp(string s) {
    int n = s.length();
    if (n <= 1) return false;
    
    vector<int> lps = buildLPS(s);
    int lps_length = lps[n - 1];
    
    return lps_length > 0 && n % (n - lps_length) == 0;
}
```
<!-- slide -->
```java
// Approach 2: KMP (LPS Array)
private int[] buildLPS(String pattern) {
    int n = pattern.length();
    int[] lps = new int[n];
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
    return lps;
}

public boolean repeatedSubstringPattern_kmp(String s) {
    int n = s.length();
    if (n <= 1) return false;
    
    int[] lps = buildLPS(s);
    int lps_length = lps[n - 1];
    
    return lps_length > 0 && n % (n - lps_length) == 0;
}
```
<!-- slide -->
```javascript
// Approach 2: KMP (LPS Array)
buildLPS(pattern) {
    const n = pattern.length;
    const lps = new Array(n).fill(0);
    let length = 0;
    let i = 1;
    
    while (i < n) {
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

repeatedSubstringPattern_kmp(s) {
    const n = s.length;
    if (n <= 1) return false;
    
    const lps = this.buildLPS(s);
    const lps_length = lps[n - 1];
    
    return lps_length > 0 && n % (n - lps_length) === 0;
}
```
````

## Approach 3: Concatenation Trick

This is a clever observation that avoids explicit substring checking. If we concatenate the string with itself and look for the original string as a substring (excluding the first and last characters), we can determine if it has a repeated pattern.

**Algorithm:**
1. Create a new string `ss = s + s`
2. Remove the first and last characters of `ss` to get `ss[1:-1]`
3. Check if `s` exists as a substring in `ss[1:-1]`
4. If yes, return `true`; otherwise, return `false`

**Why it works:** If `s` can be formed by repeating a substring, then `s` appears somewhere in the middle of `s + s`. This is because the concatenated string contains all possible rotations of `s`, and the repeated pattern will cause `s` to appear offset within itself.

### Implementation

````carousel
```python
class Solution:
    # Approach 3: Concatenation Trick
    def repeatedSubstringPattern_concat(self, s: str) -> bool:
        """
        Time: O(n)
        Space: O(n)
        """
        ss = s + s
        # Remove first and last character to avoid trivial match
        return s in ss[1:-1]
```
<!-- slide -->
```cpp
// Approach 3: Concatenation Trick
bool repeatedSubstringPattern_concat(string s) {
    string ss = s + s;
    // Find s in ss excluding first and last character
    return ss.find(s, 1) != string::npos && 
           ss.find(s, 1) < ss.length() - 1;
}
```
<!-- slide -->
```java
// Approach 3: Concatenation Trick
public boolean repeatedSubstringPattern_concat(String s) {
    String ss = s + s;
    // Find s in ss excluding first and last character
    return ss.indexOf(s, 1) != -1 && ss.indexOf(s, 1) < ss.length() - 1;
}
```
<!-- slide -->
```javascript
// Approach 3: Concatenation Trick
repeatedSubstringPattern_concat(s) {
    const ss = s + s;
    // Check if s exists in ss excluding first and last character
    const inner = ss.slice(1, -1);
    return inner.includes(s);
}
```
````

## Approach 4: Mathematical Pattern Analysis

This approach uses the mathematical properties of repeated strings. If a string has period `p`, then for all indices `i`, `s[i] = s[i % p]`.

**Algorithm:**
1. Find the smallest period `p` of the string
2. Check if `p < n` (there is a proper period) and `n % p == 0` (the period divides the length)
3. Return `true` if both conditions are met

**How to find the smallest period:**
- The smallest period can be found using the formula: `p = n - lps[n-1]`
- If `p < n` and `n % p == 0`, then `p` is the period

**Why it works:** This approach directly finds the fundamental repeating unit of the string and verifies if it can construct the entire string.

### Implementation

````carousel
```python
class Solution:
    # Approach 4: Mathematical Period Analysis
    def repeatedSubstringPattern_math(self, s: str) -> bool:
        """
        Time: O(n)
        Space: O(n)
        """
        def build_lps(pattern: str) -> list:
            lps = [0] * len(pattern)
            length = 0
            i = 1
            
            while i < len(pattern):
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
        
        n = len(s)
        if n <= 1:
            return False
        
        lps = build_lps(s)
        period = n - lps[n - 1]
        
        # Check if we have a proper period that divides the length
        return period < n and n % period == 0
```
<!-- slide -->
```cpp
// Approach 4: Mathematical Period Analysis
bool repeatedSubstringPattern_math(string s) {
    int n = s.length();
    if (n <= 1) return false;
    
    vector<int> lps = buildLPS(s);
    int period = n - lps[n - 1];
    
    return period < n && n % period == 0;
}
```
<!-- slide -->
```java
// Approach 4: Mathematical Period Analysis
public boolean repeatedSubstringPattern_math(String s) {
    int n = s.length();
    if (n <= 1) return false;
    
    int[] lps = buildLPS(s);
    int period = n - lps[n - 1];
    
    return period < n && n % period == 0;
}
```
<!-- slide -->
```javascript
// Approach 4: Mathematical Period Analysis
repeatedSubstringPattern_math(s) {
    const n = s.length;
    if (n <= 1) return false;
    
    const lps = this.buildLPS(s);
    const period = n - lps[n - 1];
    
    return period < n && n % period === 0;
}
```
````

---

## Time and Space Complexity Analysis

### Approach 1: Brute Force with Divisibility Check

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n²) worst case | For each divisor i, we create a string of length n/i and concatenate it n/i times. In worst case (e.g., "aaaaa..."), we check O(n) divisors and each check is O(n). |
| **Space** | O(1) | Only uses a few integer variables and potentially the repeated string for comparison |

### Approach 2: KMP (LPS Array)

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Building the LPS array is O(n), and the final check is O(1) |
| **Space** | O(n) | The LPS array stores n integers |

### Approach 3: Concatenation Trick

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Creating the concatenated string is O(n), and the substring search (using efficient algorithms like KMP internally) is O(n) |
| **Space** | O(n) | The concatenated string has length 2n |

### Approach 4: Mathematical Period Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Building the LPS array is O(n), and the final check is O(1) |
| **Space** | O(n) | The LPS array stores n integers |

**Best Approach:** Approaches 2, 3, and 4 are all optimal with O(n) time complexity. Approach 2 (KMP) is often preferred as it's more explicit about the pattern matching logic. Approach 3 (Concatenation Trick) is the most concise and elegant solution.

---

## Related Problems

1. **[Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)** - KMP pattern matching algorithm
2. **[Implement strStr()](https://leetcode.com/problems/implement-strstr/)** - String searching problem
3. **[Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/)** - Find longest prefix which is also suffix
4. **[Count Binary Substrings](https://leetcode.com/problems/count-binary-substrings/)** - Count substrings with equal consecutive characters
5. **[String Compression](https://leetcode.com/problems/string-compression/)** - Compress string by counting consecutive repeats
6. **[GCD of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/)** - Find GCD of two strings
7. **[Check if a String Is a Prefix Sequence](https://leetcode.com/problems/check-if-a-string-is-a-prefix-sequence/)** - Check if string can be formed by concatenating array elements
8. **[Divisible String](https://leetcode.com/problems/check-if-string-is-divisible-by-multiples-of-previous/)** - Check if string can be split into equal parts

---

## Video Tutorials

1. **[NeetCode - Repeated Substring Pattern](https://www.youtube.com/watch?v=naf2y1wSp8w)** - Clear explanation with visual examples
2. **[KMP Algorithm Explained](https://www.youtube.com/watch?v=VWTj6X6L1p8)** - Understanding the KMP algorithm for pattern matching
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=6iODC0k0qX4)** - Official problem solution
4. **[Concatenation Trick Explained](https://www.youtube.com/watch?v=R8L2G4f5q6k)** - Understanding the s+s trick
5. **[String Pattern Detection](https://www.youtube.com/watch?v=6n44w4hZcDQ)** - Various approaches to string pattern problems
6. **[Period and Border in Strings](https://www.youtube.com/watch?v=ab4C7k9K9cQ)** - Understanding string periods and borders

---

## Follow-up Questions

### Performance and Complexity

1. **Which approach has the best practical performance?**
   - The concatenation trick (Approach 3) is often the fastest in practice because it relies on highly optimized string search algorithms (often KMP or similar) in the standard library. The KMP approach is close second and more explicit about the pattern matching logic.

2. **Can we achieve O(1) space complexity with O(n) time?**
   - Theoretically yes, by using a modified KMP approach that doesn't store the full LPS array but computes it on the fly. However, this is complex and the O(n) space solutions are generally preferred for clarity.

### Algorithmic Extensions

4. **How would you find the smallest repeating substring?**
   - Use the KMP approach to find the LPS array, then the period is `n - lps[n-1]`. The smallest repeating substring is `s[0:period]`.

5. **How would you modify the solution to count the number of repetitions?**
   - Once you find the period `p`, the number of repetitions is `n / p`.

6. **What if we wanted to find ALL possible repeating patterns?**
   - You would need to check all divisors and verify which ones form valid patterns. This would be O(d * n) where d is the number of divisors.

7. **How would you handle Unicode strings with multi-byte characters?**
   - The algorithms work the same way as they operate on code points. However, you need to be careful with indexing and substring operations in languages where strings are UTF-16 encoded.

### Practical Applications

8. **What are real-world applications of this pattern?**
   - Data compression (finding repeated patterns)
   - DNA sequence analysis (finding repeated genetic patterns)
   - Text editors (auto-completion and pattern detection)
   - Network protocols (detecting repeated message patterns)
   - plagiarism detection (finding repeated text segments)

9. **How would you extend this to find approximate repeated patterns?**
   - You could use fuzzy matching or allow for some mismatches. This becomes a more complex problem similar to approximate string matching or the "Almost Repeated Substring" problem.

### Edge Cases and Testing

10. **What edge cases should be tested?**
    - Empty string (length 0) - though constraint says minimum 1
    - Single character (length 1) - should return false
    - Prime length strings (cannot have repeated pattern unless all chars same)
    - All identical characters ("aaaaa")
    - No repeated pattern ("abcd")
    - Multiple possible patterns ("abcabcabc" has "abc" and "abcabc")

11. **How would you verify correctness for random strings?**
    - You can generate random strings and their known patterns, then verify the solution correctly identifies them. For strings without patterns, you can verify by brute force.

---

## Summary

The **Repeated Substring Pattern** problem can be solved using multiple approaches:

- **Brute Force**: Simple but O(n²) time, tries all possible divisors
- **KMP (LPS Array)**: O(n) time, uses prefix-suffix matching
- **Concatenation Trick**: O(n) time, elegant solution using s + s
- **Mathematical Period**: O(n) time, directly finds the period

The key insights are:
1. The string length must be divisible by the substring length
2. The LPS array from KMP reveals the border which indicates periodicity
3. The concatenation trick leverages the fact that repeated strings appear in their own double

All optimal approaches achieve O(n) time complexity, with the concatenation trick being the most concise and often fastest in practice.

---

## References

- [LeetCode 459 - Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)
- Problem constraints and examples from LeetCode
- KMP Algorithm: Knuth, Morris, Pratt (1970)
- String period and border concepts from stringology

