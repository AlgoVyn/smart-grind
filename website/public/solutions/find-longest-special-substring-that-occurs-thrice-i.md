# Find Longest Special Substring That Occurs Thrice I

## Problem Description

You are given a string s that consists of lowercase English letters.
A string is called special if it is made up of only a single character. For example, the string "abc" is not special, whereas the strings "ddd", "zz", and "f" are special.
Return the length of the longest special substring of s which occurs at least thrice, or -1 if no special substring occurs at least thrice.
A substring is a contiguous non-empty sequence of characters within a string.

---

## Constraints

- 3 <= s.length <= 50
- s consists of only lowercase English letters.

---

## Example 1

**Input:**
```python
s = "aaaa"
```

**Output:**
```python
2
```

**Explanation:**
The longest special substring which occurs thrice is "aa": substrings "aaaa", "aaaa", and "aaaa".
It can be shown that the maximum length achievable is 2.

---

## Example 2

**Input:**
```python
s = "abcdef"
```

**Output:**
```python
-1
```

**Explanation:**
There exists no special substring which occurs at least thrice. Hence return -1.

---

## Example 3

**Input:**
```python
s = "abcaba"
```

**Output:**
```python
1
```

**Explanation:**
The longest special substring which occurs thrice is "a": substrings "abcaba", "abcaba", and "abcaba".
It can be shown that the maximum length achievable is 1.

---

## Solution

```python
from typing import List
from collections import defaultdict

class Solution:
    def maximumLength(self, s: str) -> int:
        runs = defaultdict(list)
        i = 0
        while i < len(s):
            j = i
            while j < len(s) and s[j] == s[i]:
                j += 1
            runs[s[i]].append(j - i)
            i = j
        
        ans = -1
        for char, lengths in runs.items():
            if len(lengths) >= 3:
                lengths.sort(reverse=True)
                ans = max(ans, lengths[2])
        return ans
```

---

## Explanation

A special substring is one consisting of the same character repeated. We need to find the longest such substring that appears at least three times in the string.

### Step-by-Step Explanation:

1. Group the string into runs of consecutive identical characters. For each character, collect the lengths of its runs in a dictionary.

2. For each character, if it has at least three runs:
   - Sort the run lengths in descending order.
   - The third largest run length is the maximum length for which there are at least three runs of that length or longer.
   - Update the answer with this value.

3. If no character has at least three runs, return -1.

4. Return the maximum answer found.

This approach works because for a given character, the possible lengths are determined by the run lengths, and we take the third longest run as the candidate.

### Time Complexity:

O(n log n), where n is the string length, due to sorting the run lengths for each character. Since there are at most 26 characters and n <= 50, it's efficient.

### Space Complexity:

O(n), for storing the run lengths.
