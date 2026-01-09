# Take K of Each Character From Left and Right

## Problem Description

You are given a string `s` consisting of the characters 'a', 'b', and 'c' and a non-negative integer `k`. Each minute, you may take either the leftmost character of `s`, or the rightmost character of `s`.

Return the minimum number of minutes needed for you to take at least `k` of each character, or return `-1` if it is not possible to take `k` of each character.

**Example 1:**

Input: `s = "aabaaaacaabc"`, `k = 2`
Output: `8`

Explanation:
Take three characters from the left of `s`. You now have two 'a' characters, and one 'b' character.
Take five characters from the right of `s`. You now have four 'a' characters, two 'b' characters, and two 'c' characters.
A total of `3 + 5 = 8` minutes is needed.
It can be proven that `8` is the minimum number of minutes needed.

**Example 2:**

Input: `s = "a"`, `k = 1`
Output: `-1`

Explanation: It is not possible to take one 'b' or 'c' so return `-1`.

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of only the letters 'a', 'b', and 'c'.
- `0 <= k <= s.length`

## Solution

```python
from collections import Counter

class Solution:
    def takeCharacters(self, s: str, k: int) -> int:
        if k == 0:
            return 0

        total = Counter(s)
        if total['a'] < k or total['b'] < k or total['c'] < k:
            return -1

        n = len(s)
        left = 0
        min_len = n + 1
        window = Counter()

        for right in range(n):
            window[s[right]] += 1

            while (window['a'] > total['a'] - k or
                   window['b'] > total['b'] - k or
                   window['c'] > total['c'] - k):
                window[s[left]] -= 1
                left += 1

            if (window['a'] <= total['a'] - k and
                window['b'] <= total['b'] - k and
                window['c'] <= total['c'] - k):
                min_len = min(min_len, right - left + 1)

        if min_len == n + 1:
            return -1
        return n - min_len
```

## Explanation

This problem finds the minimum minutes to take at least `k` of each character 'a', 'b', 'c' by removing from ends, equivalent to finding the smallest middle substring where the remaining has >=k of each.

### Step-by-Step Approach:

1. **Edge Cases**: If `k=0`, return `0`. If any count `<k`, return `-1`.

2. **Sliding Window**: Find the smallest window where counts in window <= `total - k` for each char.

3. **Expand Right**: Add chars to window.

4. **Shrink Left**: While window has too many, move left.

5. **Update Min**: If valid, update `min_len`.

6. **Return**: `n - min_len`, or `-1` if no valid.

### Time Complexity:

- O(n), sliding window.

### Space Complexity:

- O(1), fixed counters.
