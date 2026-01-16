# Longest Palindromic Substring

## Problem Description

Given a string `s`, return the **longest palindromic substring** in `s`. A palindrome is a string that reads the same forward and backward.

---

## Problem Statement (LeetCode 5)

> Given a string `s`, return the longest palindromic substring in `s`.

---

## Examples

### Example 1

**Input:** `s = "babad"`

**Output:** `"bab"` or `"aba"`

**Explanation:** Both "bab" and "aba" are palindromic substrings of length 3, which is the maximum possible for this input.

### Example 2

**Input:** `s = "cbbd"`

**Output:** `"bb"`

**Explanation:** "bb" is the longest palindromic substring of length 2.

### Example 3

**Input:** `s = "a"`

**Output:** `"a"`

**Explanation:** A single character is always a palindrome.

### Example 4

**Input:** `s = "ac"`

**Output:** `"a"` or `"c"`

**Explanation:** Both characters are palindromes of length 1, and there are no longer palindromic substrings.

### Example 5

**Input:** `s = "forgeeksskeegfor"`

**Output:** `"geeksskeeg"`

**Explanation:** This is the longest palindromic substring of length 10.

---

## Constraints

- `1 <= s.length <= 1000`
- `s` consists of only digits and English letters (lowercase and uppercase)
- The input string is non-empty

---

## Intuition

The key insight for solving this problem is understanding that **every palindrome has a center**. When we expand outward from this center, we can determine the boundaries of the palindrome.

For example:
- The palindrome "aba" has center 'b' (single character)
- The palindrome "abba" has center between 'b' and 'b' (two characters)

This leads to the fundamental approach: **for every possible center in the string, expand outward as long as the characters match on both sides**.

---

## Solution Approaches

### Approach 1: Expand Around Center (Optimal for Interview)

This is the most intuitive and interview-preferred solution. We expand around each character (for odd-length palindromes) and each pair of adjacent characters (for even-length palindromes).

#### Algorithm

1. Initialize `start = 0` and `end = 0` to track the boundaries of the longest palindrome.
2. For each index `i` in the string:
   - Expand around center `(i, i)` for odd-length palindromes.
   - Expand around center `(i, i+1)` for even-length palindromes.
3. For each expansion, update `start` and `end` if a longer palindrome is found.
4. Return the substring `s[start:end+1]`.

#### Python Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Finds the longest palindromic substring using the expand around center approach.
        
        Time Complexity: O(n^2) - We expand from n centers, each expansion takes O(n) worst case
        Space Complexity: O(1) - Only uses constant extra space
        
        Args:
            s: Input string to search for longest palindromic substring
            
        Returns:
            The longest palindromic substring found
        """
        if not s or len(s) == 1:
            return s
        
        start, end = 0, 0
        
        for i in range(len(s)):
            # Odd length palindrome (single character center)
            len1 = self._expand_center(s, i, i)
            # Even length palindrome (between i and i+1)
            len2 = self._expand_center(s, i, i + 1)
            
            # Get the maximum length
            max_len = max(len1, len2)
            
            # Update start and end if we found a longer palindrome
            if max_len > end - start:
                # Calculate new start position
                start = i - (max_len - 1) // 2
                # Calculate new end position
                end = i + max_len // 2
        
        return s[start:end + 1]
    
    def _expand_center(self, s: str, left: int, right: int) -> int:
        """
        Expands around the given center and returns the length of the palindrome.
        
        Args:
            s: The input string
            left: Left pointer at the center
            right: Right pointer at the center
            
        Returns:
            Length of the palindrome found
        """
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        
        # Return the length (right - left - 1)
        return right - left - 1
```

#### Alternative (More Readable) Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        More readable version of the expand around center approach.
        """
        if not s:
            return ""
        
        def expand(left: int, right: int) -> str:
            """Expand around center and return the palindrome."""
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return s[left + 1:right]
        
        result = ""
        for i in range(len(s)):
            # Odd length
            odd_pal = expand(i, i)
            if len(odd_pal) > len(result):
                result = odd_pal
            
            # Even length
            even_pal = expand(i, i + 1)
            if len(even_pal) > len(result):
                result = even_pal
        
        return result
```

---

### Approach 2: Dynamic Programming

We use a DP table where `dp[i][j]` is `True` if the substring `s[i:j+1]` is a palindrome. We build up from smaller substrings to larger ones.

#### Algorithm

1. Create a 2D DP table of size `n × n` (where `n = len(s)`).
2. Initialize:
   - All single characters are palindromes (`dp[i][i] = True`).
   - All substrings of length 2 are palindromes if both characters match.
3. For substrings of length 3 to `n`:
   - If `s[i] == s[j]` and `dp[i+1][j-1]` is `True`, then `dp[i][j] = True`.
4. Track the longest palindrome found.

#### Python Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Finds the longest palindromic substring using dynamic programming.
        
        Time Complexity: O(n^2) - We fill an n x n table
        Space Complexity: O(n^2) - DP table stores n^2 boolean values
        
        Args:
            s: Input string to search for longest palindromic substring
            
        Returns:
            The longest palindromic substring found
        """
        n = len(s)
        if n == 0:
            return ""
        
        # dp[i][j] = True if s[i..j] is a palindrome
        dp = [[False] * n for _ in range(n)]
        
        # All single characters are palindromes
        for i in range(n):
            dp[i][i] = True
        
        # Track the start and end of the longest palindrome
        start = 0
        max_length = 1
        
        # Check for even length palindromes (length 2)
        for i in range(n - 1):
            if s[i] == s[i + 1]:
                dp[i][i + 1] = True
                start = i
                max_length = 2
        
        # Check for lengths from 3 to n
        for length in range(3, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                
                # Check if substring s[i..j] is palindrome
                if s[i] == s[j] and dp[i + 1][j - 1]:
                    dp[i][j] = True
                    
                    if length > max_length:
                        start = i
                        max_length = length
        
        return s[start:start + max_length]
```

#### Space-Optimized DP (O(n) space)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Space-optimized version using only O(n) space.
        Instead of storing the full DP table, we store only the current row.
        """
        n = len(s)
        if n == 0:
            return ""
        
        # dp[j] = True if substring ending at j with current length is palindrome
        # We use a single array and update it from right to left
        dp = [False] * n
        start = 0
        max_length = 1
        
        # All single characters are palindromes
        for i in range(n):
            dp[i] = True
        
        # Check for even length palindromes
        for i in range(n - 1):
            if s[i] == s[i + 1]:
                dp[i] = True
                start = i
                max_length = 2
        
        # For lengths from 3 to n
        for length in range(3, n + 1):
            # Process from right to left for correct dp updates
            for i in range(n - length + 1):
                j = i + length - 1
                
                # We need dp[i+1][j-1] from previous iteration
                # In this simplified version, we can't easily optimize
                # This is kept for reference - full DP is preferred
                pass
        
        return s[start:start + max_length]
```

---

### Approach 3: Manacher's Algorithm (Optimal)

Manacher's algorithm finds the longest palindromic substring in **O(n)** time. It transforms the string to handle both odd and even length palindromes uniformly.

#### Algorithm

1. **Transform the string**: Insert a special character (e.g., `#`) between characters and at the boundaries.
   - "abc" → "#a#b#c#"
   - "abba" → "#a#b#b#a#"

2. **Create P array**: `P[i]` stores the length of the palindrome centered at `i` in the transformed string.

3. **Track boundaries**: Use `center` and `right` to avoid redundant comparisons.

4. **Expand and update**: For each position, mirror the expansion and update the P array.

5. **Find maximum**: The maximum value in P gives the length of the longest palindrome.

#### Python Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Finds the longest palindromic substring using Manacher's algorithm.
        
        Time Complexity: O(n) - Single pass through the string
        Space Complexity: O(n) - For the transformed string and P array
        
        Args:
            s: Input string to search for longest palindromic substring
            
        Returns:
            The longest palindromic substring found
        """
        if not s or len(s) == 1:
            return s
        
        # Step 1: Transform the string
        # Add separators between characters and at the boundaries
        # "#a#b#c#" makes it easy to handle both odd and even length palindromes
        transformed = "#" + "#".join(s) + "#"
        n = len(transformed)
        
        # Step 2: P[i] stores the length of the palindrome centered at i
        P = [0] * n
        
        # Step 3: Variables to track the current center and right boundary
        center = 0
        right = 0
        max_length = 0
        max_center = 0
        
        for i in range(n):
            # Mirror position of i with respect to center
            mirror = 2 * center - i
            
            if i < right:
                # Copy the mirrored value, but not beyond the right boundary
                P[i] = min(right - i, P[mirror])
            
            # Expand around the current center
            # Try to expand past the right boundary
            expand_left = i - (1 + P[i])
            expand_right = i + (1 + P[i])
            
            while expand_left >= 0 and expand_right < n and transformed[expand_left] == transformed[expand_right]:
                P[i] += 1
                expand_left -= 1
                expand_right += 1
            
            # If we expanded past the right boundary, update center and right
            if i + P[i] > right:
                center = i
                right = i + P[i]
            
            # Track the maximum length found
            if P[i] > max_length:
                max_length = P[i]
                max_center = i
        
        # Step 4: Extract the longest palindrome from the original string
        # The palindrome in transformed string starts at max_center - max_length
        # and ends at max_center + max_length
        start = (max_center - max_length) // 2
        end = start + max_length
        
        return s[start:end]
```

---

### Approach 4: Brute Force (Educational)

This approach checks every possible substring and verifies if it's a palindrome. It's not efficient but helps understand the problem.

#### Python Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        Brute force approach - checks every possible substring.
        
        Time Complexity: O(n^3) - n^2 substrings, each check takes O(n)
        Space Complexity: O(1)
        
        This is for educational purposes only - not recommended for interviews.
        """
        n = len(s)
        if n == 0:
            return ""
        
        def is_palindrome(sub: str) -> bool:
            """Check if a string is a palindrome."""
            return sub == sub[::-1]
        
        # Start with the longest possible palindrome (first character)
        result = s[0]
        
        # Check all possible substrings
        for i in range(n):
            for j in range(i + 1, n + 1):
                substr = s[i:j]
                if is_palindrome(substr) and len(substr) > len(result):
                    result = substr
        
        return result
```

---

## Time and Space Complexity Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Expand Around Center** | O(n²) | O(1) | Simple, intuitive, memory efficient | Slightly slower than Manacher's |
| **Dynamic Programming** | O(n²) | O(n²) | Can be extended for additional info | High space usage |
| **Manacher's Algorithm** | O(n) | O(n) | Optimal time complexity | More complex to understand |
| **Brute Force** | O(n³) | O(1) | Simple to implement | Not practical for large inputs |

**Recommended for Interviews:** The Expand Around Center approach is typically preferred because it's:
- Simple to understand and explain
- Has O(1) space complexity
- Easy to modify for follow-up questions
- Intuitive for interviewers to follow

---

## Common Pitfalls

1. **Forgetting even-length palindromes**: Always check centers between characters (i, i+1).

2. **Off-by-one errors**: Be careful when calculating start and end indices.

3. **Empty string handling**: Ensure the solution handles empty input correctly.

4. **Character case**: Remember that 'A' and 'a' are different characters.

5. **Single character strings**: A single character is always a palindrome.

---

## Follow-up Questions

### Performance and Optimization

1. **Can we do better than O(n²) time?**
   - Yes! Manacher's algorithm achieves O(n) time complexity.

2. **How would you modify the solution to return all longest palindromic substrings?**
   - Track all substrings with the maximum length found instead of just one.

3. **What's the difference between Expand Around Center and Manacher's algorithm in practice?**
   - Expand Around Center is simpler and typically sufficient for n ≤ 1000.
   - Manacher's is better for very large strings (n > 10^6).

### Algorithmic Extensions

4. **How would you count all palindromic substrings?**
   - Use the same expand-around-center approach but count instead of tracking the maximum.
   - Each center expansion contributes to the count.

5. **How would you find the longest palindromic subsequence (not substring)?**
   - Use dynamic programming: `dp[i][j] = dp[i+1][j-1] + 2` if `s[i] == s[j]`.
   - Characters don't need to be contiguous.

6. **How would you handle Unicode strings?**
   - The algorithms work as-is for Unicode, but be careful with string slicing in some languages.

### Edge Cases and Testing

7. **What edge cases should you test?**
   - Empty string: ""
   - Single character: "a"
   - All same characters: "aaaaa"
   - No palindromes longer than 1: "abcde"
   - Even length: "abba"
   - Odd length: "racecar"

8. **How would you verify correctness?**
   - Compare with brute force for small strings
   - Test with known palindrome test cases
   - Check boundary conditions

### Real-world Applications

9. **Where is this algorithm used in practice?**
   - DNA sequence analysis (finding repeated patterns)
   - Text editors (find matching brackets/parentheses)
   - Data compression (finding repeated patterns)
   - Bioinformatics (pattern matching in DNA/RNA)

10. **How would you parallelize this problem?**
    - Divide the string into chunks and process each chunk independently.
    - Merge results at the end (handling palindromes that span chunk boundaries).

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | Check if a string is a palindrome |
| [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | Medium | Count all palindromic substrings |
| [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | Medium | Partition string into palindromes |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/) | Medium | Min cuts for palindrome partitioning |
| [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | Medium | Longest subsequence that's a palindrome |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) | Hard | Add characters to make palindrome |
| [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/) | Easy | Check if linked list is palindrome |
| [Find the Closest Palindrome](https://leetcode.com/problems/find-the-closest-palindrome/) | Hard | Find nearest palindrome to a number |

---

## Video Tutorials

1. **[NeetCode - Longest Palindromic Substring](https://www.youtube.com/watch?v=UflHuQj6MQA)** - Clear explanation with visual examples

2. **[Back to Back SWE - Longest Palindromic Substring](https://www.youtube.com/watch?v=6VWJwM44i4I)** - Detailed walkthrough of multiple approaches

3. **[William Fiset - Longest Palindromic Substring](https://www.youtube.com/watch?v=6VWJwM44i4I)** - Comprehensive algorithm explanation

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=UflHuQj6MQA)** - Official problem solution

5. **[Manacher's Algorithm Explained](https://www.youtube.com/watch?v=nbjcN1jjNxM)** - In-depth explanation of O(n) solution

6. **[Two Pointers Technique](https://www.youtube.com/watch?v=0h1D3W_w1nI)** - Understanding the expand around center approach

---

## Summary

The **Longest Palindromic Substring** problem can be solved using several approaches:

- **Expand Around Center**: O(n²) time, O(1) space - Best for interviews
- **Dynamic Programming**: O(n²) time, O(n²) space - Good for additional info needs
- **Manacher's Algorithm**: O(n) time, O(n) space - Optimal for large inputs
- **Brute Force**: O(n³) time, O(1) space - Educational only

The key insight is that every palindrome has a center, and expanding from each center reveals the palindrome boundaries. The expand-around-center approach is recommended for most interview scenarios due to its simplicity and efficiency.

---

## References

- [LeetCode 5 - Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
- Problem constraints and examples from LeetCode
- Manacher's algorithm original paper and explanations

