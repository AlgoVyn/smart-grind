# Valid Anagram

## Problem Description
[Link to problem](https://leetcode.com/problems/valid-anagram/)

Given two strings s and t, return true if t is an anagram of s, and false otherwise.
 
Example 1:

Input: s = "anagram", t = "nagaram"
Output: true

Example 2:

Input: s = "rat", t = "car"
Output: false

 
Constraints:

1 <= s.length, t.length <= 5 * 104
s and t consist of lowercase English letters.

 
Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?


## Solution

```python
from collections import Counter

def isAnagram(s, t):
    return Counter(s) == Counter(t)
```

## Explanation
This problem checks if two strings are anagrams, meaning they have the same characters with the same frequencies.

### Step-by-Step Approach:
1. **Count Frequencies:**
   - Use `Counter` to count the frequency of each character in string `s`.
   - Use `Counter` to count the frequency of each character in string `t`.

2. **Compare Counters:**
   - Return `True` if the two counters are equal, meaning the strings have identical character frequencies; otherwise, `False`.

### Time Complexity:
- O(n + m), where n and m are the lengths of `s` and `t`, respectively, as building the counters takes linear time.

### Space Complexity:
- O(min(n, m)), for storing the character counts in the counters. For lowercase English letters, it's effectively O(1) since there are only 26 possible characters.

For Unicode characters (follow-up), the time complexity remains O(n + m), but space complexity becomes O(min(n, m)) as the number of unique characters can be up to the string length.
