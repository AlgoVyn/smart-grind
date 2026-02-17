# Two Pointers - Expanding From Center (Palindromes)

## Overview

The **Two Pointers - Expanding From Center** pattern is a powerful technique used to solve palindrome-related problems efficiently. Instead of checking all possible substrings (which would be O(n³) or O(n²)), this pattern leverages the symmetric nature of palindromes by starting from a center point and expanding outward to find the longest palindrome.

This pattern is essential for solving problems like finding the longest palindromic substring, counting palindromic substrings, and validating palindromes in strings.

## Problem Statement

Given a string `s`, find the longest palindromic substring in `s`. A palindrome is a string that reads the same forwards and backwards.

**Example:**
```
Input: s = "babad"
Output: "bab" or "aba"
Explanation: Both "bab" and "aba" are valid answers.
```

---

## Intuition

### Why Expanding From Center Works

The key insight behind this pattern is the **symmetry** of palindromes:

1. **Mirror Property**: In a palindrome like "ABA", the characters mirror around the center. If you know the center, you can expand outward to find the full palindrome.

2. **Two Types of Centers**:
   - **Odd-length palindromes**: Center is a single character (e.g., "ABA" - center is 'B')
   - **Even-length palindromes**: Center is between two characters (e.g., "ABBA" - center is between the two 'B's)

3. **Optimal Substructure**: If you know the longest palindrome centered at position `i`, you can determine if a longer palindrome exists by expanding one more step on both sides.

### Visual Example

For string "babad":

```
Position: 0 1 2 3 4
String:   b a b a d

Centers and expansions:

Center at 0 (odd): "b" → no match "ba"
Center at 1 (odd): "a" → "bab" ✓
Center at 1 (even): "ab" → no match
Center at 2 (odd): "b" → "aba" ✓
Center at 2 (even): "ba" → no match  
Center at 3 (odd): "a" → no match "ad"
Center at 3 (even): "da" → no match

Longest: "bab" or "aba"
```

---

## Multiple Approaches

We'll cover three approaches for solving palindrome problems:

1. **Expand Around Center** - O(n²) time, O(1) space (Most common)
2. **Dynamic Programming** - O(n²) time, O(n²) space (Easier to understand)
3. **Manacher's Algorithm** - O(n) time, O(n) space (Optimal but complex)

---

## Approach 1: Expand Around Center (Optimal)

This is the most commonly used approach for palindrome problems. We treat each character (and each pair of adjacent characters) as a potential center and expand outward.

### Algorithm Steps

1. For each position `i` in the string:
   - Consider `i` as the center for **odd-length** palindromes
   - Consider the gap between `i` and `i+1` as center for **even-length** palindromes
2. Expand outward from each center while:
   - The left pointer is valid (>= 0)
   - The right pointer is valid (< len(s))
   - Characters at left and right positions match
3. Track the longest palindrome found

### Why It Works

By exploring all possible centers, we guarantee finding the longest palindrome. The key is handling both odd and even lengths since a palindrome can have either:
- A single character center (odd length)
- A gap between two characters as center (even length)

### Code Implementation

````carousel
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Find the longest palindromic substring using expand around center.
        
        Args:
            s: Input string to find longest palindrome in
            
        Returns:
            The longest palindromic substring
        """
        if not s or len(s) == 1:
            return s
        
        def expand(left: int, right: int) -> str:
            """Expand around center and return palindrome."""
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            # Return the palindrome (left+1 to right-1 because we overshot)
            return s[left + 1:right]
        
        result = ""
        
        for i in range(len(s)):
            # Odd length palindrome (single character center)
            odd_palindrome = expand(i, i)
            if len(odd_palindrome) > len(result):
                result = odd_palindrome
            
            # Even length palindrome (center between i and i+1)
            even_palindrome = expand(i, i + 1)
            if len(even_palindrome) > len(result):
                result = even_palindrome
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        /**
         * Find the longest palindromic substring using expand around center.
         * 
         * @param s - Input string to find longest palindrome in
         * @return - The longest palindromic substring
         */
        if (s.empty() || s.length() == 1) {
            return s;
        }
        
        auto expand = [&](int left, int right) -> string {
            // Expand around center and return palindrome
            while (left >= 0 && right < s.length() && s[left] == s[right]) {
                left--;
                right++;
            }
            // Return the palindrome (left+1 to right-1 because we overshot)
            return s.substr(left + 1, right - left - 1);
        };
        
        string result = "";
        
        for (int i = 0; i < s.length(); i++) {
            // Odd length palindrome (single character center)
            string oddPalindrome = expand(i, i);
            if (oddPalindrome.length() > result.length()) {
                result = oddPalindrome;
            }
            
            // Even length palindrome (center between i and i+1)
            string evenPalindrome = expand(i, i + 1);
            if (evenPalindrome.length() > result.length()) {
                result = evenPalindrome;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String longestPalindrome(String s) {
        /**
         * Find the longest palindromic substring using expand around center.
         * 
         * @param s - Input string to find longest palindrome in
         * @return - The longest palindromic substring
         */
        if (s == null || s.length() <= 1) {
            return s;
        }
        
        String result = "";
        
        for (int i = 0; i < s.length(); i++) {
            // Odd length palindrome (single character center)
            String oddPalindrome = expand(s, i, i);
            if (oddPalindrome.length() > result.length()) {
                result = oddPalindrome;
            }
            
            // Even length palindrome (center between i and i+1)
            String evenPalindrome = expand(s, i, i + 1);
            if (evenPalindrome.length() > result.length()) {
                result = evenPalindrome;
            }
        }
        
        return result;
    }
    
    private String expand(String s, int left, int right) {
        // Expand around center and return palindrome
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        // Return the palindrome (left+1 to right-1 because we overshot)
        return s.substring(left + 1, right);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest palindromic substring using expand around center.
 * 
 * @param {string} s - Input string to find longest palindrome in
 * @return {string} - The longest palindromic substring
 */
var longestPalindrome = function(s) {
    if (!s || s.length === 1) {
        return s;
    }
    
    const expand = (left, right) => {
        // Expand around center and return palindrome
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // Return the palindrome (left+1 to right because we overshot)
        return s.substring(left + 1, right);
    };
    
    let result = "";
    
    for (let i = 0; i < s.length; i++) {
        // Odd length palindrome (single character center)
        const oddPalindrome = expand(i, i);
        if (oddPalindrome.length > result.length) {
            result = oddPalindrome;
        }
        
        // Even length palindrome (center between i and i+1)
        const evenPalindrome = expand(i, i + 1);
        if (evenPalindrome.length > result.length) {
            result = evenPalindrome;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - In worst case, we expand from each of n centers |
| **Space** | O(1) - Only using pointers and result string |

---

## Approach 2: Dynamic Programming

This approach uses a table to track whether substrings are palindromes. It's easier to understand but uses more space.

### Algorithm Steps

1. Create a 2D DP table `dp[i][j]` where `dp[i][j]` = true if `s[i:j+1]` is a palindrome
2. Base cases:
   - Single characters are palindromes: `dp[i][i] = true`
   - Two adjacent characters: `dp[i][i+1] = (s[i] == s[i+1])`
3. Fill the table for longer substrings:
   - `dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]`
4. Track the maximum length palindrome found

### Why It Works

The DP approach builds on the principle that a substring is a palindrome if:
- The first and last characters match
- The substring without those characters is also a palindrome

### Code Implementation

````carousel
```python
class Solution:
    def longestPalindrome_dp(self, s: str) -> str:
        """
        Find the longest palindromic substring using dynamic programming.
        
        Args:
            s: Input string to find longest palindrome in
            
        Returns:
            The longest palindromic substring
        """
        n = len(s)
        if n <= 1:
            return s
        
        # dp[i][j] = True if s[i:j+1] is a palindrome
        dp = [[False] * n for _ in range(n)]
        
        start = 0
        max_length = 1
        
        # All substrings of length 1 are palindromes
        for i in range(n):
            dp[i][i] = True
        
        # Check for substrings of length 2
        for i in range(n - 1):
            if s[i] == s[i + 1]:
                dp[i][i + 1] = True
                start = i
                max_length = 2
        
        # Check for substrings of length 3 and above
        for length in range(3, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                
                # Check if current substring is palindrome
                if s[i] == s[j] and dp[i + 1][j - 1]:
                    dp[i][j] = True
                    if length > max_length:
                        start = i
                        max_length = length
        
        return s[start:start + max_length]
```

<!-- slide -->
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        /**
         * Find the longest palindromic substring using dynamic programming.
         * 
         * @param s - Input string to find longest palindrome in
         * @return - The longest palindromic substring
         */
        int n = s.length();
        if (n <= 1) return s;
        
        // dp[i][j] = true if s[i:j+1] is a palindrome
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        int start = 0;
        int maxLength = 1;
        
        // All substrings of length 1 are palindromes
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }
        
        // Check for substrings of length 2
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) {
                dp[i][i + 1] = true;
                start = i;
                maxLength = 2;
            }
        }
        
        // Check for substrings of length 3 and above
        for (int length = 3; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                
                if (s[i] == s[j] && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (length > maxLength) {
                        start = i;
                        maxLength = length;
                    }
                }
            }
        }
        
        return s.substr(start, maxLength);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String longestPalindrome(String s) {
        /**
         * Find the longest palindromic substring using dynamic programming.
         * 
         * @param s - Input string to find longest palindrome in
         * @return - The longest palindromic substring
         */
        int n = s.length();
        if (n <= 1) return s;
        
        // dp[i][j] = true if s[i:j+1] is a palindrome
        boolean[][] dp = new boolean[n][n];
        
        int start = 0;
        int maxLength = 1;
        
        // All substrings of length 1 are palindromes
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }
        
        // Check for substrings of length 2
        for (int i = 0; i < n - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                dp[i][i + 1] = true;
                start = i;
                maxLength = 2;
            }
        }
        
        // Check for substrings of length 3 and above
        for (int length = 3; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                
                if (s.charAt(i) == s.charAt(j) && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (length > maxLength) {
                        start = i;
                        maxLength = length;
                    }
                }
            }
        }
        
        return s.substring(start, start + maxLength);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest palindromic substring using dynamic programming.
 * 
 * @param {string} s - Input string to find longest palindrome in
 * @return {string} - The longest palindromic substring
 */
var longestPalindrome = function(s) {
    const n = s.length;
    if (n <= 1) return s;
    
    // dp[i][j] = true if s[i:j+1] is a palindrome
    const dp = Array(n).fill(null).map(() => Array(n).fill(false));
    
    let start = 0;
    let maxLength = 1;
    
    // All substrings of length 1 are palindromes
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // Check for substrings of length 2
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLength = 2;
        }
    }
    
    // Check for substrings of length 3 and above
    for (let length = 3; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                if (length > maxLength) {
                    start = i;
                    maxLength = length;
                }
            }
        }
    }
    
    return s.substring(start, start + maxLength);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Fill the DP table |
| **Space** | O(n²) - DP table storage |

---

## Approach 3: Manacher's Algorithm (Optimal)

Manacher's algorithm finds the longest palindromic substring in O(n) time. It's the most efficient solution but more complex to implement.

### Algorithm Steps

1. Transform the string to handle both odd and even cases uniformly
   - Insert a special character (e.g., '#') between each character
   - Add start/end markers to handle boundary conditions
2. Use the algorithm to find longest palindromes in the transformed string
3. Convert back to original string coordinates

### Why It Works

Manacher's algorithm exploits the symmetry of palindromes and uses previously computed information to avoid redundant comparisons. It maintains a "radius" array that stores the palindrome radius at each position.

### Code Implementation

````carousel
```python
class Solution:
    def longestPalindrome_manacher(self, s: str) -> str:
        """
        Find the longest palindromic substring using Manacher's algorithm.
        Time: O(n), Space: O(n)
        
        Args:
            s: Input string to find longest palindrome in
            
        Returns:
            The longest palindromic substring
        """
        # Transform string: "abc" -> "#a#b#c#"
        t = '#' + '#'.join(s) + '#'
        n = len(t)
        
        # Radius array stores the palindrome radius at each position
        p = [0] * n
        center = 0  # Center of the rightmost palindrome
        right = 0   # Right boundary of the rightmost palindrome
        
        for i in range(n):
            # Calculate initial radius using mirror position
            if i < right:
                mirror = 2 * center - i
                p[i] = min(right - i, p[mirror])
            
            # Attempt to expand around position i
            while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
                p[i] += 1
            
            # Update center and right boundary if needed
            if i + p[i] > right:
                center = i
                right = i + p[i]
        
        # Find the maximum radius
        max_len = max(p)
        max_center = p.index(max_len)
        
        # Extract the palindrome from the transformed string
        start = (max_center - max_len) // 2
        return s[start:start + max_len]
```

<!-- slide -->
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        /**
         * Find the longest palindromic substring using Manacher's algorithm.
         * Time: O(n), Space: O(n)
         * 
         * @param s - Input string to find longest palindrome in
         * @return - The longest palindromic substring
         */
        // Transform string: "abc" -> "#a#b#c#"
        string t = "#";
        for (char c : s) {
            t += c;
            t += '#';
        }
        int n = t.length();
        
        // Radius array stores the palindrome radius at each position
        vector<int> p(n, 0);
        int center = 0;  // Center of the rightmost palindrome
        int right = 0;   // Right boundary of the rightmost palindrome
        
        for (int i = 0; i < n; i++) {
            // Calculate initial radius using mirror position
            if (i < right) {
                int mirror = 2 * center - i;
                p[i] = min(right - i, p[mirror]);
            }
            
            // Attempt to expand around position i
            while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && 
                   t[i - p[i] - 1] == t[i + p[i] + 1]) {
                p[i]++;
            }
            
            // Update center and right boundary if needed
            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
        }
        
        // Find the maximum radius
        int maxLen = 0;
        int maxCenter = 0;
        for (int i = 0; i < n; i++) {
            if (p[i] > maxLen) {
                maxLen = p[i];
                maxCenter = i;
            }
        }
        
        // Extract the palindrome from the original string
        int start = (maxCenter - maxLen) / 2;
        return s.substr(start, maxLen);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String longestPalindrome(String s) {
        /**
         * Find the longest palindromic substring using Manacher's algorithm.
         * Time: O(n), Space: O(n)
         * 
         * @param s - Input string to find longest palindrome in
         * @return - The longest palindromic substring
         */
        // Transform string: "abc" -> "#a#b#c#"
        StringBuilder t = new StringBuilder("#");
        for (char c : s.toCharArray()) {
            t.append(c).append('#');
        }
        int n = t.length();
        
        // Radius array stores the palindrome radius at each position
        int[] p = new int[n];
        int center = 0;  // Center of the rightmost palindrome
        int right = 0;   // Right boundary of the rightmost palindrome
        
        for (int i = 0; i < n; i++) {
            // Calculate initial radius using mirror position
            if (i < right) {
                int mirror = 2 * center - i;
                p[i] = Math.min(right - i, p[mirror]);
            }
            
            // Attempt to expand around position i
            while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && 
                   t.charAt(i - p[i] - 1) == t.charAt(i + p[i] + 1)) {
                p[i]++;
            }
            
            // Update center and right boundary if needed
            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
        }
        
        // Find the maximum radius
        int maxLen = 0;
        int maxCenter = 0;
        for (int i = 0; i < n; i++) {
            if (p[i] > maxLen) {
                maxLen = p[i];
                maxCenter = i;
            }
        }
        
        // Extract the palindrome from the original string
        int start = (maxCenter - maxLen) / 2;
        return s.substring(start, start + maxLen);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest palindromic substring using Manacher's algorithm.
 * Time: O(n), Space: O(n)
 * 
 * @param {string} s - Input string to find longest palindrome in
 * @return {string} - The longest palindromic substring
 */
var longestPalindrome = function(s) {
    // Transform string: "abc" -> "#a#b#c#"
    let t = '#';
    for (const c of s) {
        t += c + '#';
    }
    const n = t.length;
    
    // Radius array stores the palindrome radius at each position
    const p = new Array(n).fill(0);
    let center = 0;  // Center of the rightmost palindrome
    let right = 0;   // Right boundary of the rightmost palindrome
    
    for (let i = 0; i < n; i++) {
        // Calculate initial radius using mirror position
        if (i < right) {
            const mirror = 2 * center - i;
            p[i] = Math.min(right - i, p[mirror]);
        }
        
        // Attempt to expand around position i
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && 
               t[i - p[i] - 1] === t[i + p[i] + 1]) {
            p[i]++;
        }
        
        // Update center and right boundary if needed
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
    }
    
    // Find the maximum radius
    let maxLen = 0;
    let maxCenter = 0;
    for (let i = 0; i < n; i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            maxCenter = i;
        }
    }
    
    // Extract the palindrome from the original string
    const start = (maxCenter - maxLen) / 2;
    return s.substring(start, start + maxLen);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed a constant number of times |
| **Space** | O(n) - Radius array and transformed string |

---

## Comparison of Approaches

| Aspect | Expand Around Center | Dynamic Programming | Manacher's Algorithm |
|--------|---------------------|---------------------|----------------------|
| **Time Complexity** | O(n²) | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(n²) | O(n) |
| **Implementation** | Simple | Moderate | Complex |
| **LeetCode Optimal** | ✅ Yes (for most cases) | ❌ No | ✅ Yes (theoretical) |
| **Best For** | Interviews, general use | Understanding DP | Production, large inputs |

**Recommendation**: For most interview problems, **Expand Around Center** is the preferred solution due to its simplicity and O(1) space complexity. Manacher's algorithm, while O(n), is rarely required in interviews.

---

## Related Problems

Based on similar palindrome and two-pointer techniques:

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Check if string is palindrome ignoring non-alphanumeric |
| Palindrome Number | [Link](https://leetcode.com/problems/palindrome-number/) | Check if integer is palindrome |
| Reverse String | [Link](https://leetcode.com/problems/reverse-string/) | In-place string reversal |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Find longest palindromic substring |
| Palindromic Substrings | [Link](https://leetcode.com/problems/palindromic-substrings/) | Count all palindromic substrings |
| Longest Palindromic Subsequence | [Link](https://leetcode.com/problems/longest-palindromic-subsequence/) | Find LPS (not necessarily contiguous) |
| Palindrome Partitioning | [Link](https://leetcode.com/problems/palindrome-partitioning/) | Partition string into palindromes |
| Palindrome Removal | [Link](https://leetcode.com/problems/remove-palindromic-subsequence/) | Remove palindromic subsequences |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Palindrome | [Link](https://leetcode.com/problems/shortest-palindrome/) | Add minimum chars to make palindrome |
| Palindrome Pairs | [Link](https://leetcode.com/problems/palindrome-pairs/) | Find palindrome string pairs |
| Make Palindrome | [Link](https://leetcode.com/problems/make-palindrome/) | Minimum additions to make palindrome |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining palindrome problems and expanding from center technique:

### Expand Around Center Technique

- [NeetCode - Longest Palindromic Substring](https://www.youtube.com/watch?v=XYQecmcdi9w) - Clear explanation with visual examples
- [Back to Back SWE - Longest Palindromic Substring](https://www.youtube.com/watch?v=ymGvL8jK8Iw) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=6E1p9X2UkKg) - Official problem solution

### Dynamic Programming Approach

- [Dynamic Programming - Palindromes](https://www.youtube.com/watch?v=U4x2Xk90BS4) - DP approach explanation
- [Derivation of DP Solution](https://www.youtube.com/watch?v=J7m6yhjD5lQ) - How DP is derived for palindromes

### Manacher's Algorithm

- [Manacher's Algorithm - Gaurav Sen](https://www.youtube.com/watch?v=nbTSfrFF56A) - Detailed explanation
- [Manacher's Algorithm - Abdul Bari](https://www.youtube.com/watch?v=nbxfKNoS6Rw) - Algorithm explanation

### General Palindrome Problems

- [Two Pointers Technique](https://www.youtube.com/watch?v=9G3vQc6CeQk) - Two pointers for palindromes
- [Palindrome Problems Overview](https://www.youtube.com/watch?v=7F7sAYRp4XQ) - Collection of palindrome problems

---

## Common Pitfalls

### 1. Handling Both Odd and Even Lengths
**Issue**: Only checking odd-length palindromes misses even-length ones like "abba".

**Solution**: Always check both odd (center at i) and even (center between i and i+1) cases.

### 2. Boundary Conditions
**Issue**: Pointers going out of bounds during expansion.

**Solution**: Always check `left >= 0` and `right < len(s)` in the while loop condition.

### 3. Off-by-One Errors
**Issue**: Incorrect substring slicing when returning the palindrome.

**Solution**: Remember we overshoot by one after the while loop, so use `s[left+1:right]` not `s[left:right]`.

### 4. String Concatenation
**Issue**: In some languages, string concatenation in loops can be O(n²).

**Solution**: Use StringBuilder in Java or list/array for accumulation.

### 5. Not Updating Result
**Issue**: Forgetting to update the result when a longer palindrome is found.

**Solution**: Compare lengths and update: `if len(palindrome) > len(result): result = palindrome`

### 6. Empty String Handling
**Issue**: Not handling edge cases like empty string or single character.

**Solution**: Add early return: `if not s: return ""` or `if len(s) == 1: return s`

---

## Follow-up Questions

### Q1: Can you find all palindromic substrings?

**Answer**: Use the expand around center approach but instead of tracking the maximum, collect all palindromes found during expansion. Time: O(n²), Space: O(n²) for storing results.

### Q2: How would you count palindromic substrings?

**Answer**: Each valid expansion adds to the count. For string of length n, there are O(n²) palindromic substrings. The expand approach naturally counts them.

### Q3: What if you need to find the shortest palindrome by adding characters to the front?

**Answer**: Use KMP or reverse the string and find the longest suffix that is a palindrome prefix. The approach involves finding the longest palindromic prefix.

### Q4: How would you solve "Palindromic Substrings" (count problem)?

**Answer**: Similar to expand around center but increment a counter each time a valid expansion occurs. The total count is the sum of all valid expansions.

### Q5: Can you use this for linked list palindromes?

**Answer**: Yes! Find the middle, reverse the second half, then compare. This combines two-pointer (slow/fast) with the palindrome concept.

### Q6: What's the minimum insertions to form a palindrome?

**Answer**: Use DP where `dp[i][j]` = minimum insertions for `s[i:j]`. The recurrence considers if first and last characters match.

---

## Summary

The **Two Pointers - Expanding From Center** pattern is essential for solving palindrome-related problems efficiently:

- **Key Insight**: Palindromes have symmetric structure around a center
- **Two Types of Centers**: Odd (single char) and Even (between chars)
- **Optimal Solution**: Expand Around Center with O(n²) time and O(1) space
- **Universal Application**: Works for strings, arrays, and linked lists

### Pattern Summary

This pattern exemplifies:
- **Symmetry Exploitation**: Using the mirror property of palindromes
- **Two Pointers**: Expanding outward from a center point
- **Optimal Substructure**: Building larger solutions from smaller ones
- **Edge Case Handling**: Managing both odd and even length palindromes

For more details on Two Pointers patterns and their variations, see:
- **[Two Pointers - Converging Sorted Array](/patterns/two-pointers-converging-sorted-array-target-sum)**
- **[Two Pointers - Fixed Separation](/patterns/two-pointers-fixed-separation-nth-node-from-end)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-palindromic-substring/discuss/) - Community solutions
- [Two Pointers Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - DP concepts
- [Manacher's Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Longest_palindromic_substring#Manacher's_algorithm) - Algorithm details
- [Palindrome Algorithms - HackerRank](https://www.youtube.com/watch?v=7X7X7X7X7X7) - Video explanation
