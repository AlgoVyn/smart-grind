# Repeated String Match

## Problem Description
[Link to problem](https://leetcode.com/problems/repeated-string-match/)

Given two strings a and b, return the minimum number of times you should repeat string a so that string b is a substring of it. If it is impossible for b​​​​​​ to be a substring of a after repeating it, return -1.
Notice: string "abc" repeated 0 times is "", repeated 1 time is "abc" and repeated 2 times is "abcabc".
 
Example 1:

Input: a = "abcd", b = "cdabcdab"
Output: 3
Explanation: We return 3 because by repeating a three times "abcdabcdabcd", b is a substring of it.

Example 2:

Input: a = "a", b = "aa"
Output: 2

 
Constraints:

1 <= a.length, b.length <= 104
a and b consist of lowercase English letters.


## Solution

```python
class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        if not a:
            return -1 if b else 0
        count = 1
        repeated = a
        while len(repeated) < len(b):
            repeated += a
            count += 1
        if b in repeated:
            return count
        repeated += a
        count += 1
        if b in repeated:
            return count
        return -1
```

## Explanation
Repeat string a until the repeated string is at least as long as b. Check if b is a substring. If not, repeat one more time and check again. If still not found, return -1. This covers cases where b starts near the end of one a and continues into the next.

**Time Complexity:** O((len(b)/len(a) + 1) * len(a)), dominated by string concatenation and substring check.

**Space Complexity:** O(len(b) + len(a)), for the repeated string.
