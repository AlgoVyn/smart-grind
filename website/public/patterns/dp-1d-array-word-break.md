# DP - 1D Array (Word Break Style)

## Overview

The DP - 1D Array (Word Break Style) pattern is used to solve problems where you need to determine if a string can be broken into valid words from a dictionary or if similar segmentation is possible. This pattern handles string segmentation and related problems with overlapping subproblems.

## Key Concepts

- **Boolean DP Array**: dp[i] indicates if the substring s[0..i-1] can be segmented.
- **Substring Check**: For each position i, check if there exists a j < i where s[j..i-1] is a valid word and s[0..j-1] is segmentable.
- **Dictionary Lookup**: Use a set for O(1) lookups of valid words.
- **Bottom-up Approach**: Build solutions from smaller substrings.

## Template

```python
def word_break(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Base case: empty string is segmentable
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

## Example Problems

1. **Word Break (LeetCode 139)**: Check if a string can be segmented into dictionary words.
2. **Word Break II (LeetCode 140)**: Find all possible segmentations of a string.
3. **Concatenated Words (LeetCode 472)**: Find words that can be formed by concatenation of other words.
4. **Encode and Decode Strings (LeetCode 271)**: Related to string segmentation.

## Time and Space Complexity

- **Time Complexity**: O(n²), where n is the length of the string (checking all possible substrings).
- **Space Complexity**: O(n) for the DP array, plus O(m) for the word set.

## Common Pitfalls

- **Incorrect base case**: Failing to set dp[0] = True.
- **Not using a set for word lookup**: Using a list results in O(m) lookup time.
- **Overlapping subproblems**: Recursive approach without memoization is inefficient.
- **Forgetting to break early**: Continuing to check j values after finding a valid segmentation.
- **Not handling empty string or empty dictionary**: Trivial cases need special handling.
