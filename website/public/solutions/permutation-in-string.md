# Permutation In String

## Problem Description
Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.
In other words, return true if one of s1's permutations is the substring of s2.
 
Example 1:

Input: s1 = "ab", s2 = "eidbaooo"
Output: true
Explanation: s2 contains one permutation of s1 ("ba").

Example 2:

Input: s1 = "ab", s2 = "eidboaoo"
Output: false

 
Constraints:

1 <= s1.length, s2.length <= 104
s1 and s2 consist of lowercase English letters.
## Solution

```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        count1 = [0] * 26
        count2 = [0] * 26
        for c in s1:
            count1[ord(c) - ord('a')] += 1
        for i in range(len(s1)):
            count2[ord(s2[i]) - ord('a')] += 1
        if count1 == count2:
            return True
        for i in range(len(s1), len(s2)):
            count2[ord(s2[i - len(s1)]) - ord('a')] -= 1
            count2[ord(s2[i]) - ord('a')] += 1
            if count1 == count2:
                return True
        return False
```

## Explanation
Use a sliding window of length len(s1) on s2. Maintain frequency counts for s1 and the current window in s2. If counts match, return true. Slide the window, updating counts.

Time complexity: O(n), where n is len(s2). Space complexity: O(1).
