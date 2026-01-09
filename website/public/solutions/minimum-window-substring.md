# Minimum Window Substring

## Problem Description
Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

The testcases will be generated such that the answer is unique.

---

## Examples

**Example 1:**

**Input:**
```
s = "ADOBECODEBANC", t = "ABC"
```

**Output:**
```
"BANC"
```

**Explanation:** The minimum window substring `"BANC"` includes 'A', 'B', and 'C' from string `t`.

**Example 2:**

**Input:**
```
s = "a", t = "a"
```

**Output:**
```
"a"
```

**Explanation:** The entire string `s` is the minimum window.

**Example 3:**

**Input:**
```
s = "a", t = "aa"
```

**Output:**
```
""
```

**Explanation:** Both 'a's from `t` must be included in the window. Since the largest window of `s` only has one 'a', return empty string.

---

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
        if not t or not s:
            return ""
        
        dict_t = Counter(t)
        required = len(dict_t)
        
        # Filter all the characters from s into a new list along with their index.
        # The filtering criteria is that the character should be present in t.
        filtered_s = []
        for i, char in enumerate(s):
            if char in dict_t:
                filtered_s.append((i, char))
        
        l, r = 0, 0
        formed = 0
        window_counts = {}
        ans = float("inf"), None, None
        
        # Look for the characters only in the filtered list instead of entire s.
        # This helps to reduce our search.
        # Hence, we follow the sliding window approach on as small list.
        while r < len(filtered_s):
            character = filtered_s[r][1]
            window_counts[character] = window_counts.get(character, 0) + 1
            
            if window_counts[character] == dict_t[character]:
                formed += 1
            
            # Try and contract the window till the point where it ceases to be 'desirable'.
            while l <= r and formed == required:
                character = filtered_s[l][1]
                
                # Save the smallest window until now.
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
This problem requires finding the smallest substring in s that contains all characters of t, including duplicates.

### Step-by-Step Approach:
1. **Edge Cases**: If t is empty or s is empty, return empty string.

2. **Frequency Count**: Use a counter for t to know how many unique characters and their counts are needed.

3. **Filter s**: Create a list of (index, char) for characters in s that are in t, to reduce the search space.

4. **Sliding Window on Filtered List**: Use two pointers l and r on the filtered list.
   - Expand r, add the character to window_counts.
   - If the count matches dict_t, increment formed.
   - When formed == required, try to contract l while maintaining formed == required.
   - Track the minimum window.

5. **Return the Result**: If a valid window was found, return the substring; else, empty string.

### Time Complexity:
- O(m + n), where m is length of s, n is length of t. Filtering takes O(m), sliding window on filtered list takes O(m).

### Space Complexity:
- O(m + n), for the filtered list and counters.
