# Longest Substring Without Repeating Characters

## Problem Description
Given a string s, find the length of the longest substring without duplicate characters.
 
Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.

Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

 
Constraints:

0 <= s.length <= 5 * 104
s consists of English letters, digits, symbols and spaces.
## Solution

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_len = 0
        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_len = max(max_len, right - left + 1)
        return max_len
```

## Explanation
We use a sliding window approach with a set to track unique characters in the current window. Initialize left pointer at 0, and a set for characters.

For each right pointer from 0 to len(s)-1, while the character at right is already in the set, remove the character at left from the set and increment left. Then add the character at right to the set. Update the maximum length with the current window size.

This ensures the window always contains unique characters.

Time complexity: O(n), where n is the length of s, as each character is added and removed from the set at most once.

Space complexity: O(min(n, 128)), since the set can hold at most 128 unique ASCII characters, effectively O(1).
