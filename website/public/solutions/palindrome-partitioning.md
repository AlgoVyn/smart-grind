# Palindrome Partitioning

## Problem Description

Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.

### Example 1

**Input:** `s = "aab"`  
**Output:** `[["a","a","b"],["aa","b"]]`

### Example 2

**Input:** `s = "a"`  
**Output:** `[["a"]]`

### Constraints

- `1 <= s.length <= 16`
- `s` contains only lowercase English letters.

---

## Solution

```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        def is_pal(sub):
            return sub == sub[::-1]
        
        def backtrack(start, path):
            if start == len(s):
                result.append(path[:])
                return
            for end in range(start + 1, len(s) + 1):
                if is_pal(s[start:end]):
                    path.append(s[start:end])
                    backtrack(end, path)
                    path.pop()
        
        result = []
        backtrack(0, [])
        return result
```

---

## Explanation

To find all possible palindrome partitions, use backtracking to try all ways to split the string into palindromic substrings.

### Step-by-step Approach

1. Define a helper to check if a substring is a palindrome.
2. Use backtracking: start from index 0, try all possible end positions where `s[start:end]` is palindrome, add to path, recurse on end, then backtrack.
3. When `start == len(s)`, add the path to result.

### Complexity Analysis

- **Time Complexity:** O(2^n) in worst case, as each position can be a cut or not, but with palindrome checks.
- **Space Complexity:** O(n) for recursion stack and path.
