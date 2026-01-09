# Find The Index Of The First Occurrence In A String

## Problem Description

Given two strings `needle` and `haystack`, return the index of the **first occurrence** of `needle` in `haystack`. Return `-1` if `needle` is not part of `haystack`.

### Examples

**Example 1:**

| Parameter | Value |
|-----------|-------|
| `haystack` | `"sadbutsad"` |
| `needle` | `"sad"` |
| **Output** | `0` |

**Explanation:** `"sad"` occurs at indices 0 and 6. The first occurrence is at index 0.

**Example 2:**

| Parameter | Value |
|-----------|-------|
| `haystack` | `"leetcode"` |
| `needle` | `"leeto"` |
| **Output** | `-1` |

**Explanation:** `"leeto"` does not occur in `"leetcode"`.

### Constraints

| Constraint | Description |
|------------|-------------|
| `haystack.length` | `1 <= haystack.length <= 10^4` |
| `needle.length` | `1 <= needle.length <= 10^4` |
| Characters | Lowercase English letters only |

## Solution

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        return haystack.find(needle)
```

### Approach

Use Python's built-in `find()` method:
- Returns the lowest index where substring is found
- Returns `-1` if substring is not found
- Handles edge cases (empty needle returns 0)

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n × m)` — Where `n` is haystack length, `m` is needle length. Python's implementation is highly optimized |
| **Space** | `O(1)` — Constant extra space |

### Alternative Implementations

| Method | Description |
|--------|-------------|
| **Knuth-Morris-Pratt (KMP)** | `O(n + m)` time, `O(m)` space for prefix table |
| **Rabin-Karp** | `O(n × m)` average, `O(1)` space |
| **Manual search** | `O(n × m)` time, `O(1)` space |

For typical use cases, Python's built-in `find()` is optimal and handles all edge cases correctly.

---
