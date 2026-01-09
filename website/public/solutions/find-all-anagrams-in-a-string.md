# Find All Anagrams In A String

## Problem Description

Given two strings s and p, return an array of all the start indices of p's anagrams in s. You may return the answer in any order.

---

## Constraints

- 1 <= s.length, p.length <= 3 * 104
- s and p consist of lowercase English letters.

---

## Example 1

**Input:**
```python
s = "cbaebabacd", p = "abc"
```

**Output:**
```python
[0,6]
```

**Explanation:**
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".

---

## Example 2

**Input:**
```python
s = "abab", p = "ab"
```

**Output:**
```python
[0,1,2]
```

**Explanation:**
The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".

---

## Solution

```python
from typing import List

class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        if len(p) > len(s):
            return []
        
        p_count = [0] * 26
        s_count = [0] * 26
        
        for char in p:
            p_count[ord(char) - ord('a')] += 1
        
        for i in range(len(p)):
            s_count[ord(s[i]) - ord('a')] += 1
        
        result = []
        if s_count == p_count:
            result.append(0)
        
        for i in range(len(p), len(s)):
            s_count[ord(s[i]) - ord('a')] += 1
            s_count[ord(s[i - len(p)]) - ord('a')] -= 1
            if s_count == p_count:
                result.append(i - len(p) + 1)
        
        return result
```

---

## Explanation

We need to find all starting indices of substrings in s that are anagrams of p. An anagram means they have the same character frequencies. We use a sliding window approach with frequency counters.

### Step-by-Step Explanation:

1. **Create frequency map for p**: Use an array or counter to count occurrences of each character in p.

2. **Initialize window**: Use another frequency counter for the current window of size len(p) in s.

3. **Slide the window**: Start from index 0 to len(s) - len(p):
   - If the window's frequency matches p's frequency, add the start index to the result.
   - Move the window: decrement the count for the character leaving the window, increment for the entering character.

4. **Return the result list**.

### Time Complexity:

- O(n), where n is the length of s, as we perform constant-time operations for each character.

### Space Complexity:

- O(1), since we use fixed-size arrays (26 for lowercase letters).
