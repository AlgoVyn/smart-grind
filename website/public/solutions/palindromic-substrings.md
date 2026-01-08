# Palindromic Substrings

## Problem Statement

Given a string s, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.

A substring is a contiguous sequence of characters within the string.

 
Example 1:

Input: s = "abc"
Output: 3
Explanation: Three palindromic strings: "a", "b", "c".

Example 2:

Input: s = "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

 
Constraints:

	1 <= s.length <= 1000
	s consists of lowercase English letters.

[Link to problem](https://leetcode.com/problems/palindromic-substrings/)

Given a string s, return the number of palindromic substrings in it.
A string is a palindrome when it reads the same backward as forward.
A substring is a contiguous sequence of characters within the string.
 
Example 1:

Input: s = "abc"
Output: 3
Explanation: Three palindromic strings: "a", "b", "c".

Example 2:

Input: s = "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

 
Constraints:

1 <= s.length <= 1000
s consists of lowercase English letters.

## Solution

```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        count = 0
        for i in range(len(s)):
            count += self.expandAroundCenter(s, i, i)
            count += self.expandAroundCenter(s, i, i + 1)
        return count

    def expandAroundCenter(self, s, left, right):
        count = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        return count
```

## Explanation
Similar to longest palindrome, count all palindromic substrings by expanding around centers. This is O(n^2) time.
