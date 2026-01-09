# Shortest Palindrome

## Problem Description
You are given a string s. You can convert s to a palindrome by adding characters in front of it.
Return the shortest palindrome you can find by performing this transformation.
 
Example 1:
Input: s = "aacecaaa"
Output: "aaacecaaa"
Example 2:
Input: s = "abcd"
Output: "dcbabcd"

 
Constraints:

0 <= s.length <= 5 * 104
s consists of lowercase English letters only.
## Solution

```python
class Solution:
    def shortestPalindrome(self, s: str) -> str:
        if not s:
            return s
        rev_s = s[::-1]
        temp = s + '#' + rev_s
        pi = [0] * len(temp)
        for i in range(1, len(temp)):
            j = pi[i-1]
            while j > 0 and temp[i] != temp[j]:
                j = pi[j-1]
            if temp[i] == temp[j]:
                j += 1
            pi[i] = j
        longest = pi[-1]
        to_add = rev_s[:len(s) - longest]
        return to_add + s
```

## Explanation

This problem requires making the shortest palindrome by adding characters in front of the string.

### Approach

Use KMP to find the longest prefix of s that is a palindrome when considering the reverse. Construct a temporary string s + '#' + reverse(s), compute the prefix table, and the last value gives the length of the longest palindromic prefix.

### Step-by-Step Explanation

1. **Reverse**: Get reverse of s.

2. **Temp String**: Create s + '#' + rev_s.

3. **Prefix Table**: Compute KMP prefix table for temp.

4. **Longest Prefix**: pi[-1] is the length of the longest prefix that matches suffix.

5. **Add Characters**: Add the reverse of the non-palindromic part to the front.

6. **Return**: The new string.

### Time Complexity

- O(n), where n is the length of s.

### Space Complexity

- O(n), for the temp string and prefix array.
