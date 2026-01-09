# Longest Repeating Character Replacement

## Problem Description

You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

---

## Examples

### Example 1

**Input:**
```python
s = "ABAB", k = 2
```

**Output:**
```
4
```

**Explanation:** Replace the two 'A's with two 'B's (or vice versa) to get a substring of 4 identical characters.

### Example 2

**Input:**
```python
s = "AABABBA", k = 1
```

**Output:**
```
4
```

**Explanation:** Replace the one 'A' in the middle with 'B' to form "AABBBBA". The substring "BBBB" has length 4.

---

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of only uppercase English letters
- `0 <= k <= s.length`

---

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

---

## Explanation

This problem is solved using a **sliding window** approach.

### Key Insight

For a window `[left, right]`, the number of changes needed to make all characters the same is:

```
window_size - max_frequency
```

Where `max_frequency` is the count of the most frequent character in the window.

### Algorithm

1. Initialize `left` pointer and character counter
2. Expand the window by moving `right` from left to right:
   - Add `s[right]` to the counter
   - Calculate `max_freq` (most frequent character in current window)
   - If `window_size - max_freq > k`, shrink from the left until condition is satisfied
   - Update `max_len` with the current valid window size
3. Return `max_len`

### Why This Works

The sliding window maintains the maximum valid window size. When the window becomes invalid (needs more than `k` changes), we shrink it from the left until it's valid again.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each character is processed at most twice (once by right, once by left) |
| **Space** | `O(1)` — Counter stores at most 26 uppercase letters |
