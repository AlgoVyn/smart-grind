# Reorganize String

## Problem Description

Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same.

Return any possible rearrangement of `s` or return `""` if not possible.

### Example 1

**Input:**
```
s = "aab"
```

**Output:**
```
"aba"
```

### Example 2

**Input:**
```
s = "aaab"
```

**Output:**
```
""
```

### Constraints

- `1 <= s.length <= 500`
- `s` consists of lowercase English letters.

## Solution

```python
import heapq
from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        count = Counter(s)
        max_heap = [(-freq, char) for char, freq in count.items()]
        heapq.heapify(max_heap)
        result = []
        prev = None
        
        while max_heap:
            freq, char = heapq.heappop(max_heap)
            result.append(char)
            if prev:
                heapq.heappush(max_heap, prev)
            prev = (freq + 1, char) if freq + 1 < 0 else None
        
        if len(result) == len(s):
            return ''.join(result)
        else:
            return ""
```

## Explanation

This problem requires rearranging a string so no two adjacent characters are the same.

### Approach

Use a max-heap for character frequencies. Always pick the most frequent available character, skipping the last used if necessary.

### Step-by-Step Explanation

1. **Count Frequencies:** Use `Counter`.

2. **Max Heap:** Push negative freq and char.

3. **Build Result:** Pop from heap, append to result, push back previous if available.

4. **Check:** If result length == s length, return joined; else return `""`.

**Time Complexity:** O(n log 26), since heap operations are log 26.

**Space Complexity:** O(26), for heap and counter.
