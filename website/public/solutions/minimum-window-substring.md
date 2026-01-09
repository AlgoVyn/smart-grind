# Minimum Window Substring

## Problem Description

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

The testcases will be generated such that the answer is unique.

## Examples

### Example 1

**Input:**
```python
s = "ADOBECODEBANC", t = "ABC"
```

**Output:**
```python
"BANC"
```

**Explanation:**
The minimum window substring `"BANC"` includes 'A', 'B', and 'C' from string `t`.

### Example 2

**Input:**
```python
s = "a", t = "a"
```

**Output:**
```python
"a"
```

**Explanation:**
The entire string `s` is the minimum window.

### Example 3

**Input:**
```python
s = "a", t = "aa"
```

**Output:**
```python
""
```

**Explanation:**
Both 'a's from `t` must be included in the window. Since the largest window of `s` only has one 'a', return empty string.

## Constraints

- `m == s.length`
- `n == t.length`
- `1 <= m, n <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters

**Follow-up:** Could you find an algorithm that runs in O(m + n) time?

## Solution

```python
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        """
        Find minimum window in s containing all characters of t.
        
        Uses sliding window with character frequency counting.
        """
        if not t or not s:
            return ""
        
        dict_t = Counter(t)
        required = len(dict_t)
        
        # Filter s to only include characters present in t
        filtered_s = []
        for i, char in enumerate(s):
            if char in dict_t:
                filtered_s.append((i, char))
        
        l, r = 0, 0
        formed = 0
        window_counts = {}
        ans = float("inf"), None, None
        
        # Sliding window on filtered list
        while r < len(filtered_s):
            character = filtered_s[r][1]
            window_counts[character] = window_counts.get(character, 0) + 1
            
            if window_counts[character] == dict_t[character]:
                formed += 1
            
            # Contract window when all characters are present
            while l <= r and formed == required:
                character = filtered_s[l][1]
                
                # Save smallest window
                end = filtered_s[r][0]
                start = filtered_s[l][0]
                if end - start + 1 < ans[0]:
                    ans = (end - start + 1, start, end)
                
                window_counts[character] -= 1
                if window_counts[character] < dict_t[character]:
                    formed -= 1
                l += 1
            
            r += 1
        
        return "" if ans[0] == float("inf") else s[ans[1] : ans[2] + 1]
```

## Explanation

This problem requires finding the smallest substring in `s` that contains all characters of `t`, including duplicates.

### Algorithm Steps

1. **Frequency count**: Use a counter for `t` to know required character counts.

2. **Filter s**: Create a list of (index, char) for characters in `s` that are in `t`.

3. **Sliding window**: Use two pointers on the filtered list:
   - Expand right, add character to window
   - When all required characters are present, try to contract left
   - Track the minimum window

4. **Return result**: If valid window found, return substring; else, empty string.

## Complexity Analysis

- **Time Complexity:** O(m + n), where m is length of s and n is length of t
- **Space Complexity:** O(m + n), for the filtered list and counters
