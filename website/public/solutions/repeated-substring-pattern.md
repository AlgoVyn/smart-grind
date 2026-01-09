# Repeated Substring Pattern

## Problem Description
Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.
 
Example 1:

Input: s = "abab"
Output: true
Explanation: It is the substring "ab" twice.

Example 2:

Input: s = "aba"
Output: false

Example 3:

Input: s = "abcabcabcabc"
Output: true
Explanation: It is the substring "abc" four times or the substring "abcabc" twice.

 
Constraints:

1 <= s.length <= 104
s consists of lowercase English letters.
## Solution

```python
def repeatedSubstringPattern(s: str) -> bool:
    if not s:
        return False

    # Check if s is a substring of (s + s)[1:-1]
    ss = s + s
    return s in ss[1:-1]
```

## Explanation
To determine if a string s can be constructed by repeating a substring, we use a clever string manipulation trick.

1. Concatenate s with itself to get ss = s + s.
2. Check if s is a substring of ss[1:-1] (i.e., ss without the first and last characters).
3. If s consists of k repetitions of a substring t, then in ss, s will appear starting from positions that align with the repeated pattern, specifically within ss[1:-1].

This method works because the overlapping parts in ss[1:-1] will contain s if it's composed of repeated substrings.

**Time Complexity:** O(n), where n is the length of s, due to string operations.
**Space Complexity:** O(n), for storing the concatenated string.
