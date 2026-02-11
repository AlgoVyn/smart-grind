# Longest Palindromic Substring

## Problem Statement

Given a string `s`, find the **longest palindromic substring** in `s`. A palindrome is a string that reads the same forward and backward.

**Link to problem:** [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**Constraints:**
- `1 <= s.length <= 1000`
- `s` consists of only lowercase English letters

**Note:**
- A substring is a contiguous sequence of characters within a string
- If there are multiple longest palindromic substrings with the same length, return any one of them
- The empty string is trivially a palindrome, but per constraints, s has at least length 1
- This is one of the most classic string manipulation problems frequently asked in interviews
- Multiple solutions exist with different time/space trade-offs

---

## Examples

### Example 1

**Input:**
```
s = "babad"
```

**Output:**
```
"bab" OR "aba"
```

**Explanation:** Both "bab" and "aba" are palindromic substrings of length 3. Either is a valid answer.

---

### Example 2

**Input:**
```
s = "cbbd"
```

**Output:**
```
"bb"
```

**Explanation:** "bb" is the longest palindromic substring of length 2.

---

### Example 3

**Input:**
```
s = "a"
```

**Output:**
```
"a"
```

**Explanation:** A single character is trivially a palindrome.

---

### Example 4

**Input:**
```
s = "ac"
```

**Output:**
```
"a" OR "c"
```

**Explanation:** Both "a" and "c" are palindromic substrings of length 1.

---

### Example 5

**Input:**
```
s = "racecar"
```

**Output:**
```
"racecar"
```

**Explanation:** The entire string is a palindrome.

---

### Example 6

**Input:**
```
s = "aaaaa"
```

**Output:**
```
"aaaaa"
```

**Explanation:** All characters are the same, so the entire string is a palindrome.

---

### Example 7

**Input:**
```
s = "forgeeksskeegfor"
```

**Output:**
```
"geeksskeeg"
```

**Explanation:** "geeksskeeg" is the longest palindromic substring of length 10.

---

### Example 8

**Input:**
```
s = "abacdfgdcaba"
```

**Output:**
```
"aba"
```

**Explanation:** "aba" appears at both ends but is the longest palindrome in the string.

---

## Intuition

The Longest Palindromic Substring problem requires finding the longest contiguous sequence of characters that reads the same forwards and backwards. The key insight is understanding the structure of palindromes.

### Core Insight

A palindrome has a **center** from which it expands outward. There are two types of centers:
1. **Single character center** - For odd-length palindromes (e.g., "aba" has center 'b')
2. **Between two characters** - For even-length palindromes (e.g., "abba" has center between the two 'b's)

By expanding from each possible center, we can find all palindromic substrings and track the longest one.

### Key Observations

1. **Center Expansion**: Every palindrome has a center (single character or between two characters)
2. **Symmetry**: Palindreads the same in both directions, enabling efficient checking
3. **Brute Force O(n³)**: Check all substrings O(n²) and verify each O(n) - too slow
4. **Optimized O(n²)**: Expand from each center in O(n) time
5. **Optimal O(n)**: Manacher's algorithm uses clever preprocessing for linear time
6. **DP Alternative**: Use DP table to store palindrome information - O(n²) time, O(n²) space

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Expand Around Center** - O(n²) time, O(1) space - Most intuitive
2. **Dynamic Programming** - O(n²) time, O(n²) space - Classic DP approach
3. **Manacher's Algorithm** - O(n) time, O(n) space - Optimal solution

---

## Approach 1: Expand Around Center

This approach leverages the fact that every palindrome has a center. We expand around each possible center (n single-character centers and n-1 between-character centers) to find the longest palindrome.

### Algorithm Steps

1. Initialize variables to track the longest palindrome start index and length
2. For each index `i` from 0 to n-1:
   - Find the longest odd-length palindrome centered at `i`
   - Find the longest even-length palindrome centered between `i` and `i+1`
   - Update the longest palindrome if either is longer
3. Return the substring from the start index with the found length

### Code Implementation

````carousel
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Find the longest palindromic substring using center expansion.
        
        Args:
            s: Input string
            
        Returns:
            Longest palindromic substring
        """
        if not s or len(s) == 1:
            return s
        
        start, end = 0, 0
        
        def expandAroundCenter(left: int, right: int) -> (int, int):
            """
            Expand around the given center and return the bounds of the palindrome.
            
            Args:
                left: Left index of the center
                right: Right index of the center
                
            Returns:
                Tuple of (start, end) indices of the palindrome
            """
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return (left + 1, right - 1)
        
        for i in range(len(s)):
            # Odd length palindrome (single character center)
            left1, right1 = expandAroundCenter(i, i)
            # Even length palindrome (between i and i+1)
            left2, right2 = expandAroundCenter(i, i + 1)
            
            # Update longest palindrome
            if right1 - left1 > end - start:
                start, end = left1, right1
            if right2 - left2 > end - start:
                start, end = left2, right2
        
        return s[start:end + 1]
```

<!-- slide -->
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        /**
         * Find the longest palindromic substring using center expansion.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Longest palindromic substring
         */
        if (s.length() <= 1) {
            return s;
        }
        
        int start = 0, end = 0;
        
        auto expandAroundCenter = [&](int left, int right) -> pair<int, int> {
            /**
             * Expand around the given center and return the bounds of the palindrome.
             * 
             * Args:
             *     left: Left index of the center
             *     right: Right index of the center
             * 
             * Returns:
             *     Pair of (start, end) indices of the palindrome
             */
            while (left >= 0 && right < s.length() && s[left] == s[right]) {
                left--;
                right++;
            }
            return {left + 1, right - 1};
        };
        
        for (int i = 0; i < s.length(); i++) {
            // Odd length palindrome (single character center)
            auto [left1, right1] = expandAroundCenter(i, i);
            // Even length palindrome (between i and i+1)
            auto [left2, right2] = expandAroundCenter(i, i + 1);
            
            // Update longest palindrome
            if (right1 - left1 > end - start) {
                start = left1;
                end = right1;
            }
            if (right2 - left2 > end - start) {
                start = left2;
                end = right2;
            }
        }
        
        return s.substr(start, end - start + 1);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String longestPalindrome(String s) {
        /**
         * Find the longest palindromic substring using center expansion.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Longest palindromic substring
         */
        if (s.length() <= 1) {
            return s;
        }
        
        int start = 0, end = 0;
        
        for (int i = 0; i < s.length(); i++) {
            // Odd length palindrome (single character center)
            int[] odd = expandAroundCenter(s, i, i);
            // Even length palindrome (between i and i+1)
            int[] even = expandAroundCenter(s, i, i + 1);
            
            // Update longest palindrome
            if (odd[1] - odd[0] > end - start) {
                start = odd[0];
                end = odd[1];
            }
            if (even[1] - even[0] > end - start) {
                start = even[0];
                end = even[1];
            }
        }
        
        return s.substring(start, end + 1);
    }
    
    private int[] expandAroundCenter(String s, int left, int right) {
        /**
         * Expand around the given center and return the bounds of the palindrome.
         * 
         * Args:
         *     s: Input string
         *     left: Left index of the center
         *     right: Right index of the center
         * 
         * Returns:
         *     Array of [start, end] indices of the palindrome
         */
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return new int[]{left + 1, right - 1};
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest palindromic substring using center expansion.
 * 
 * @param {string} s - Input string
 * @return {string} - Longest palindromic substring
 */
var longestPalindrome = function(s) {
    if (s.length <= 1) {
        return s;
    }
    
    let start = 0, end = 0;
    
    const expandAroundCenter = (left, right) => {
        /**
         * Expand around the given center and return the bounds of the palindrome.
         * 
         * @param {number} left - Left index of the center
         * @param {number} right - Right index of the center
         * @return {number[]} - Array of [start, end] indices of the palindrome
         */
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return [left + 1, right - 1];
    };
    
    for (let i = 0; i < s.length; i++) {
        // Odd length palindrome (single character center)
        const odd = expandAroundCenter(i, i);
        // Even length palindrome (between i and i+1)
        const even = expandAroundCenter(i, i + 1);
        
        // Update longest palindrome
        if (odd[1] - odd[0] > end - start) {
            start = odd[0];
            end = odd[1];
        }
        if (even[1] - even[0] > end - start) {
            start = even[0];
            end = even[1];
        }
    }
    
    return s.slice(start, end + 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - For each of n centers, expansion takes O(n) in worst case |
| **Space** | O(1) - Only a few integer variables used |

---

## Approach 2: Dynamic Programming

This approach uses a DP table where `dp[i][j]` is true if the substring `s[i...j]` is a palindrome. We build the table from smaller substrings to larger ones.

### Algorithm Steps

1. Create a 2D DP table of size n × n, initialized to false
2. All substrings of length 1 are palindromes (dp[i][i] = true)
3. All substrings of length 2 are palindromes if both characters match
4. For lengths ≥ 3: dp[i][j] = (s[i] == s[j]) AND dp[i+1][j-1]
5. Track the longest palindrome found
6. Return the longest palindrome substring

### Code Implementation

````carousel
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Find the longest palindromic substring using dynamic programming.
        
        Args:
            s: Input string
            
        Returns:
            Longest palindromic substring
        """
        n = len(s)
        if n <= 1:
            return s
        
        # dp[i][j] will be True if s[i:j+1] is a palindrome
        dp = [[False] * n for _ in range(n)]
        
        # All substrings of length 1 are palindromes
        max_len = 1
        start = 0
        
        for i in range(n):
            dp[i][i] = True
        
        # Check for substrings of length 2
        for i in range(n - 1):
            if s[i] == s[i + 1]:
                dp[i][i + 1] = True
                start = i
                max_len = 2
        
        # Check for lengths >= 3
        for length in range(3, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                
                # Check if s[i] == s[j] and substring (i+1, j-1) is palindrome
                if s[i] == s[j] and dp[i + 1][j - 1]:
                    dp[i][j] = True
                    if length > max_len:
                        start = i
                        max_len = length
        
        return s[start:start + max_len]
```

<!-- slide -->
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        /**
         * Find the longest palindromic substring using dynamic programming.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Longest palindromic substring
         */
        int n = s.length();
        if (n <= 1) {
            return s;
        }
        
        // dp[i][j] will be True if s[i:j+1] is a palindrome
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        // All substrings of length 1 are palindromes
        int max_len = 1;
        int start = 0;
        
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }
        
        // Check for substrings of length 2
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) {
                dp[i][i + 1] = true;
                start = i;
                max_len = 2;
            }
        }
        
        // Check for lengths >= 3
        for (int length = 3; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                
                // Check if s[i] == s[j] and substring (i+1, j-1) is palindrome
                if (s[i] == s[j] && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (length > max_len) {
                        start = i;
                        max_len = length;
                    }
                }
            }
        }
        
        return s.substr(start, max_len);
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
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Longest palindromic substring
         */
        int n = s.length();
        if (n <= 1) {
            return s;
        }
        
        // dp[i][j] will be True if s[i:j+1] is a palindrome
        boolean[][] dp = new boolean[n][n];
        
        // All substrings of length 1 are palindromes
        int max_len = 1;
        int start = 0;
        
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }
        
        // Check for substrings of length 2
        for (int i = 0; i < n - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                dp[i][i + 1] = true;
                start = i;
                max_len = 2;
            }
        }
        
        // Check for lengths >= 3
        for (int length = 3; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                
                // Check if s[i] == s[j] and substring (i+1, j-1) is palindrome
                if (s.charAt(i) == s.charAt(j) && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (length > max_len) {
                        start = i;
                        max_len = length;
                    }
                }
            }
        }
        
        return s.substring(start, start + max_len);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest palindromic substring using dynamic programming.
 * 
 * @param {string} s - Input string
 * @return {string} - Longest palindromic substring
 */
var longestPalindrome = function(s) {
    const n = s.length;
    if (n <= 1) {
        return s;
    }
    
    // dp[i][j] will be True if s[i:j+1] is a palindrome
    const dp = Array(n).fill(null).map(() => Array(n).fill(false));
    
    // All substrings of length 1 are palindromes
    let max_len = 1;
    let start = 0;
    
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // Check for substrings of length 2
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            max_len = 2;
        }
    }
    
    // Check for lengths >= 3
    for (let length = 3; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            
            // Check if s[i] == s[j] and substring (i+1, j-1) is palindrome
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                if (length > max_len) {
                    start = i;
                    max_len = length;
                }
            }
        }
    }
    
    return s.slice(start, start + max_len);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - We fill an n×n table, each entry taking O(1) time |
| **Space** | O(n²) - The DP table requires n² boolean values |

---

## Approach 3: Manacher's Algorithm

Manacher's algorithm is an optimal O(n) solution that uses clever preprocessing to avoid handling even and odd palindromes separately.

### Algorithm Steps

1. Preprocess the string by inserting special characters (e.g., '#') between characters and at boundaries
2. Create an array `P` where `P[i]` stores the radius of the palindrome centered at `i`
3. Use two pointers `center` and `right` to track the current rightmost palindrome
4. For each position, use previously computed information to avoid redundant comparisons
5. Track the center and maximum radius of the longest palindrome
6. Convert the result back to the original string indices

### Code Implementation

````carousel
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Find the longest palindromic substring using Manacher's algorithm.
        
        Args:
            s: Input string
            
        Returns:
            Longest palindromic substring
        """
        # Preprocess the string to handle even and odd length palindromes uniformly
        # Insert special characters between characters and at boundaries
        # e.g., "abc" -> "^#a#b#c#$"
        processed = "^#" + "#".join(s) + "#$"
        
        n = len(processed)
        P = [0] * n  # P[i] = radius of palindrome centered at i
        center = 0
        right = 0
        
        for i in range(1, n - 1):
            # Calculate mirror position of i with respect to center
            mirror = 2 * center - i
            
            if i < right:
                P[i] = min(right - i, P[mirror])
            
            # Attempt to expand palindrome centered at i
            while processed[i + 1 + P[i]] == processed[i - 1 - P[i]]:
                P[i] += 1
            
            # If palindrome centered at i expands past right, update center and right
            if i + P[i] > right:
                center = i
                right = i + P[i]
        
        # Find the position of the maximum palindrome in P
        max_length = 0
        center_index = 0
        for i in range(1, n - 1):
            if P[i] > max_length:
                max_length = P[i]
                center_index = i
        
        # Calculate the start index in the original string
        # In processed string: center_index - P[center_index] gives start
        # Since we inserted '#' between characters, we need to divide by 2
        start = (center_index - max_length) // 2
        
        return s[start:start + max_length]
```

<!-- slide -->
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        /**
         * Find the longest palindromic substring using Manacher's algorithm.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Longest palindromic substring
         */
        // Preprocess the string to handle even and odd length palindromes uniformly
        string processed = "^#";
        for (char c : s) {
            processed += c;
            processed += "#";
        }
        
        int n = processed.length();
        vector<int> P(n, 0);
        int center = 0, right = 0;
        
        for (int i = 1; i < n - 1; i++) {
            // Calculate mirror position of i with respect to center
            int mirror = 2 * center - i;
            
            if (i < right) {
                P[i] = min(right - i, P[mirror]);
            }
            
            // Attempt to expand palindrome centered at i
            while (processed[i + 1 + P[i]] == processed[i - 1 - P[i]]) {
                P[i]++;
            }
            
            // If palindrome centered at i expands past right, update center and right
            if (i + P[i] > right) {
                center = i;
                right = i + P[i];
            }
        }
        
        // Find the position of the maximum palindrome in P
        int max_length = 0;
        int center_index = 0;
        for (int i = 1; i < n - 1; i++) {
            if (P[i] > max_length) {
                max_length = P[i];
                center_index = i;
            }
        }
        
        // Calculate the start index in the original string
        int start = (center_index - max_length) / 2;
        
        return s.substr(start, max_length);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String longestPalindrome(String s) {
        /**
         * Find the longest palindromic substring using Manacher's algorithm.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Longest palindromic substring
         */
        // Preprocess the string to handle even and odd length palindromes uniformly
        StringBuilder processed = new StringBuilder();
        processed.append("^#");
        for (int i = 0; i < s.length(); i++) {
            processed.append(s.charAt(i));
            processed.append("#");
        }
        
        String t = processed.toString();
        int n = t.length();
        int[] P = new int[n];
        int center = 0, right = 0;
        
        for (int i = 1; i < n - 1; i++) {
            // Calculate mirror position of i with respect to center
            int mirror = 2 * center - i;
            
            if (i < right) {
                P[i] = Math.min(right - i, P[mirror]);
            }
            
            // Attempt to expand palindrome centered at i
            while (t.charAt(i + 1 + P[i]) == t.charAt(i - 1 - P[i])) {
                P[i]++;
            }
            
            // If palindrome centered at i expands past right, update center and right
            if (i + P[i] > right) {
                center = i;
                right = i + P[i];
            }
        }
        
        // Find the position of the maximum palindrome in P
        int max_length = 0;
        int center_index = 0;
        for (int i = 1; i < n - 1; i++) {
            if (P[i] > max_length) {
                max_length = P[i];
                center_index = i;
            }
        }
        
        // Calculate the start index in the original string
        int start = (center_index - max_length) / 2;
        
        return s.substring(start, start + max_length);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest palindromic substring using Manacher's algorithm.
 * 
 * @param {string} s - Input string
 * @return {string} - Longest palindromic substring
 */
var longestPalindrome = function(s) {
    // Preprocess the string to handle even and odd length palindromes uniformly
    const processed = "^#" + s.split('').join('#') + "#$";
    
    const n = processed.length;
    const P = new Array(n).fill(0);
    let center = 0, right = 0;
    
    for (let i = 1; i < n - 1; i++) {
        // Calculate mirror position of i with respect to center
        const mirror = 2 * center - i;
        
        if (i < right) {
            P[i] = Math.min(right - i, P[mirror]);
        }
        
        // Attempt to expand palindrome centered at i
        while (processed[i + 1 + P[i]] === processed[i - 1 - P[i]]) {
            P[i]++;
        }
        
        // If palindrome centered at i expands past right, update center and right
        if (i + P[i] > right) {
            center = i;
            right = i + P[i];
        }
    }
    
    // Find the position of the maximum palindrome in P
    let max_length = 0;
    let center_index = 0;
    for (let i = 1; i < n - 1; i++) {
        if (P[i] > max_length) {
            max_length = P[i];
            center_index = i;
        }
    }
    
    // Calculate the start index in the original string
    const start = (center_index - max_length) / 2;
    
    return s.slice(start, start + max_length);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed a constant number of times |
| **Space** | O(n) - The preprocessed string and P array require O(n) space |

---

## Comparison of Approaches

| Aspect | Expand Around Center | Dynamic Programming | Manacher's Algorithm |
|--------|---------------------|---------------------|----------------------|
| **Time Complexity** | O(n²) | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(n²) | O(n) |
| **Implementation** | Simple | Moderate | Complex |
| **Code Readability** | High | Medium | Low |
| **Best For** | Interviews, simplicity | Learning DP concepts | Performance-critical |

**Where:**
- n = length of input string

---

## Why These Approaches Work

### Expand Around Center
Every palindrome has a center (single character or between two characters). By systematically expanding from each possible center, we explore all palindromic substrings. The key insight is that palindrome checking during expansion is O(1) per expansion (just two character comparisons), making this approach straightforward and efficient for most cases.

### Dynamic Programming
The DP approach builds solutions from smaller subproblems. A substring s[i:j] is a palindrome if:
1. The outer characters match (s[i] == s[j])
2. The inner substring s[i+1:j-1] is also a palindrome

By filling the DP table from shorter to longer substrings, we ensure that when we check s[i:j], we already know whether s[i+1:j-1] is a palindrome. This is classic optimal substructure.

### Manacher's Algorithm
Manacher's algorithm achieves O(n) time by avoiding redundant palindrome checks. The key insight is using the "palindrome radius" array P and the "right boundary" to skip comparisons we've already computed. When processing a position i within the current right boundary, we can use information from its mirror position to avoid unnecessary expansions.

---

## Related Problems

Based on similar themes (palindromes, string manipulation):

- **[Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)** - Count all palindromic substrings
- **[Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)** - Check if entire string is palindrome
- **[Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)** - Partition string into palindromic substrings
- **[Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)** - Add characters to make string palindrome
- **[Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)** - Find longest subsequence that's palindrome (not necessarily contiguous)
- **[Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/)** - Find all pairs of words that form palindromes

---

## Pattern Documentation

For a comprehensive guide on related patterns, including detailed explanations and templates in Python, C++, Java, and JavaScript, see:

- **[Two Pointers - String Reversal](../patterns/two-pointers-string-reversal.md)** - Two pointers technique for string problems
- **[Backtracking - Palindrome Partitioning](../patterns/backtracking-palindrome-partitioning.md)** - Using backtracking for palindrome problems

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Longest Palindromic Substring - Complete Explanation](https://www.youtube.com/watch?v=UflHuQ4ibWs) - Comprehensive explanation with multiple approaches
- [Manacher's Algorithm Explained](https://www.youtube.com/watch?v=nbFWI2l WWk) - Detailed Manacher's algorithm walkthrough
- [Dynamic Programming for Palindromes](https://www.youtube.com/watch?v=BaXXEBfnc2I) - DP approach explained
- [Expand Around Center - LeetCode Solution](https://www.youtube.com/watch?v=1XO8Ok8lG5k) - Center expansion method

---

## Followup Questions

### Q1: What if we need to find ALL longest palindromic substrings (not just one)?

**Answer:** Modify the algorithm to maintain a list of starting indices whenever a new maximum length is found. When a palindrome of the same maximum length is found, add its starting index to the list. Clear the list when a longer palindrome is found. Return all substrings from the collected indices.

---

### Q2: How would you modify the solution to find the shortest palindrome that can be formed by adding characters to the front?

**Answer:** This is the "Shortest Palindrome" problem. The solution involves:
1. Finding the longest palindrome starting from index 0
2. Reversing the remaining suffix and appending it to the front
3. Alternatively, use KMP (Knuth-Morris-Pratt) algorithm on the string + reverse + special + original

---

### Q3: Can this problem be solved using a suffix tree or suffix array?

**Answer:** Yes, suffix trees can find longest repeated substrings efficiently. For palindromes specifically, a suffix automaton or suffix array with LCP (Longest Common Prefix) can be used. However, these approaches are more complex and typically overkill for this problem. The O(n²) and O(n) solutions are more practical.

---

### Q4: How would you adapt the solution for Unicode strings?

**Answer:** The center expansion and DP approaches work with Unicode as long as:
1. String indexing is by character (Python 3 handles this, JavaScript handles UTF-16 code units)
2. Character comparison uses proper Unicode comparison (default in most languages)
3. For full Unicode support (including emoji and multi-byte characters), use a library or iterate by code points instead of code units

---

### Q5: What's the difference between Longest Palindromic Substring and Longest Palindromic Subsequence?

**Answer:** 
- **Substring**: Contiguous sequence of characters (must be adjacent in the original string)
- **Subsequence**: Not necessarily contiguous, can skip characters

For example, in "character":
- Longest palindromic substring: "carac" or similar contiguous sequence
- Longest palindromic subsequence: "carac" or could be "caraac" using non-contiguous positions

The algorithms are different: substring problems often use expand-around-center or Manacher, while subsequence problems typically use dynamic programming similar to Longest Common Subsequence.

---

### Q6: How would you test this solution comprehensively?

**Answer:** Test with various cases:
1. Single character: "a" → "a"
2. All same characters: "aaaa" → "aaaa"
3. All different characters: "abc" → "a" or "b" or "c"
4. Even length palindrome: "abba" → "abba"
5. Odd length palindrome: "aba" → "aba"
6. No palindrome longer than 1: "abc" → any single character
7. Nested palindromes: "abacdfgdcaba" → "aba"
8. Long string with no obvious pattern
9. Empty string (edge case, though constraints say minimum length 1)
10. String with special characters or numbers (if allowed)

---

### Q7: How would you find the longest palindromic substring that starts at index 0?

**Answer:** This is equivalent to finding the longest prefix of the string that is a palindrome. Simplify the center expansion:
1. Only expand from centers on the left half of the string
2. Or, for each index i, check if s[0:i+1] is a palindrome by comparing s[0] with s[i], s[1] with s[i-1], etc.
3. The first time we find a palindrome that reaches the start, that's our answer

---

### Q8: Can you solve this problem using a Trie or suffix automaton?

**Answer:** While theoretically possible using suffix trees or suffix automatons for finding repeated substrings, these data structures are:
1. Complex to implement correctly
2. Overkill for this specific problem
3. Not simpler than the O(n) Manacher's algorithm

Suffix automaton can be used by building it for the string and its reverse, then finding the longest common substring - essentially a variant of the LCS approach for palindromic subsequence.

---

### Q9: How would you handle very large strings (millions of characters)?

**Answer:** For extremely large strings:
1. **Manacher's O(n)** is the best choice for time complexity
2. Consider memory usage - Manacher's O(n) space might be an issue for billions of characters
3. For streaming/incremental input, center expansion is easier to adapt
4. Consider parallelization for the center expansion approach (different centers are independent)
5. For disk-based storage, consider I/O efficient algorithms

---

### Q10: What's the relationship between this problem and the Z-algorithm or KMP?

**Answer:** All three (Z-algorithm, KMP, and Manacher) are linear-time string algorithms:
- **Z-algorithm**: Finds longest common prefixes between a string and all its suffixes
- **KMP**: Efficient pattern matching using prefix function
- **Manacher**: Specialized for palindrome detection using similar preprocessing

The palindrome problem can be transformed into finding common prefixes between the string and its reverse, which can be solved using Z-algorithm or KMP in O(n) time.

---

### Q11: How would you find the count of all palindromic substrings?

**Answer:** Use the expand-around-center approach and count all palindromes found:
1. For each center, increment count for each successful expansion
2. Total count = sum of all expansions from all centers
3. Or use Manacher's algorithm: sum of all P[i] values gives the total count

For example, for "aaa":
- Center at 0: "a" (1), "aaa" (2) → 2 palindromes
- Center at 1: "a" (1), "aa" (2), "aaa" (3) → 3 palindromes
- Center between 0-1: "aa" (1) → 1 palindrome
- Total: 6 palindromic substrings

---

### Q12: How would you adapt this for a rolling hash solution?

**Answer:** Rolling hash can be used:
1. Compute forward hash and reverse hash for the string
2. For each possible substring length, check if it's a palindrome by comparing forward and reverse hashes
3. Use binary search on length to find the maximum palindrome length
4. Time: O(n log n) with O(n) preprocessing

This is useful when you need to check many substrings quickly, though Manacher's is still more efficient for this specific problem.

---

### Q13: What edge cases cause the algorithm to fail or behave unexpectedly?

**Answer:** Edge cases include:
1. **Empty string**: Though constraints say minimum length 1, add a check anyway
2. **Single character repeated**: "aaaaa" - even-length centers work correctly
3. **Unicode surrogate pairs**: JavaScript strings use UTF-16, may split emoji
4. **Very long strings**: Recursion depth issues with some implementations
5. **Memory limits**: DP O(n²) may cause memory issues for n > 10000
6. **All different characters**: Algorithm correctly returns single character

---

### Q14: How would you implement this in a memory-constrained environment?

**Answer:** For memory-constrained systems:
1. Use center expansion - only O(1) space
2. Avoid recursion to prevent stack overflow
3. Process string in chunks if it's too large to fit in memory
4. For Manacher's, you could potentially compute P values on-the-fly, though complex
5. Consider streaming approaches that don't require the entire string in memory

---

## Summary

The Longest Palindromic Substring problem is a classic string manipulation problem with multiple solution approaches:

**Key Takeaways:**
- **Center Expansion** (O(n²), O(1)) - Most intuitive and commonly used in interviews
- **Dynamic Programming** (O(n²), O(n²)) - Classic DP approach, good for learning
- **Manacher's Algorithm** (O(n), O(n)) - Optimal solution for performance

**Why Each Approach Works:**
- Center expansion leverages the natural symmetry of palindromes
- DP builds solutions from smaller palindromic substrings
- Manacher cleverly avoids redundant comparisons using the palindrome radius array

**When to Use Each:**
- **Interviews**: Center expansion - simple, readable, efficient enough
- **Large inputs**: Manacher's for O(n) performance
- **Learning DP**: Use the DP approach to understand optimal substructure

This problem demonstrates fundamental string manipulation techniques and is essential knowledge for coding interviews.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-palindromic-substring/discuss/) - Community solutions and explanations
- [Manacher's Algorithm Explanation](https://cp-algorithms.com/string/manacher.html) - Detailed CP-Algorithms guide
- [Dynamic Programming for Strings](https://www.geeksforgeeks.org/dynamic-programming/) - DP concepts
- [Palindrome Detection Techniques](https://www.hackerearth.com/practice/basic-programming/string-manipulation/basics-of-string-manipulation/tutorial/) - String manipulation fundamentals
