# Longest Repeating Character Replacement

## Problem Description
[Link to problem](https://leetcode.com/problems/longest-repeating-character-replacement/)

You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.
Return the length of the longest substring containing the same letter you can get after performing the above operations.
 
Example 1:

Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with two 'B's or vice versa.

Example 2:

Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
The substring "BBBB" has the longest repeating letters, which is 4.
There may exists other ways to achieve this answer too.
 
Constraints:

1 <= s.length <= 105
s consists of only uppercase English letters.
0 <= k <= s.length


## Solution

```python
from collections import Counter

class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        counter = Counter()
        left = 0
        max_len = 0
        for right in range(len(s)):
            counter[s[right]] += 1
            max_freq = max(counter.values())
            while right - left + 1 - max_freq > k:
                counter[s[left]] -= 1
                left += 1
            max_len = max(max_len, right - left + 1)
        return max_len
```

## Explanation
This problem can be solved using a sliding window approach. We maintain a window defined by two pointers, `left` and `right`, and use a counter to track the frequency of each character in the current window.

For each position `right`, we add the character `s[right]` to the counter and calculate the maximum frequency `max_freq` in the window. The number of changes needed to make all characters in the window the same is `right - left + 1 - max_freq`. If this exceeds `k`, we need to shrink the window from the left by moving `left` to the right and decrementing the count of `s[left]` until the condition is satisfied.

We update the maximum length `max_len` at each step with the current window size.

This ensures we find the longest substring where the number of changes required is at most `k`.

Time complexity: O(n), where n is the length of the string, as each character is processed a constant number of times.

Space complexity: O(1), since the counter only stores up to 26 characters (uppercase English letters).
