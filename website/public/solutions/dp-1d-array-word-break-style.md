# DP - 1D Array (Word Break Style)

## Overview

This pattern is used for problems involving string segmentation or matching against a dictionary, like word break. It's for determining if a string can be broken into valid words. Benefits include efficient checking of all possible breaks.

## Key Concepts

- dp[i]: Whether s[0..i-1] can be segmented.
- For each i, check if any word in dict matches s[j..i-1] and dp[j] is true.

## Template

```python
def word_break(s, word_dict):
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_dict:
                dp[i] = True
                break
    return dp[len(s)]
```

## Example Problems

1. Word Break: Determine if string can be segmented into dictionary words.
2. Word Break II: Return all possible segmentations.
3. Concatenated Words: Find words that can be formed by concatenating shorter words.

## Time and Space Complexity

- Time: O(n^2) in worst case, but optimized with set for dict.
- Space: O(n)

## Common Pitfalls

- Not using dp[0] = True.
- Forgetting to break after finding a match.
- Handling large dicts inefficiently.