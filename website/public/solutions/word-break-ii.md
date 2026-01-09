# Word Break II

## Problem Description

Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

### Examples

**Example 1:**

**Input:**
```
s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
```

**Output:**
```
["cats and dog","cat sand dog"]
```

**Example 2:**

**Input:**
```
s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]
```

**Output:**
```
["pine apple pen apple","pineapple pen apple","pine applepen apple"]
```

**Explanation:** Note that you are allowed to reuse a dictionary word.

**Example 3:**

**Input:**
```
s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
```

**Output:**
```
[]
```

### Constraints

- `1 <= s.length <= 20`
- `1 <= wordDict.length <= 1000`
- `1 <= wordDict[i].length <= 10`
- `s` and `wordDict[i]` consist of only lowercase English letters.
- All the strings of `wordDict` are unique.
- Input is generated in a way that the length of the answer doesn't exceed `10^5`.

## Solution

```python
from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> List[str]:
        wordSet = set(wordDict)
        memo = {}
        
        def backtrack(start: int) -> List[str]:
            if start in memo:
                return memo[start]
            if start == len(s):
                return [""]
            result = []
            for end in range(start + 1, len(s) + 1):
                word = s[start:end]
                if word in wordSet:
                    for suffix in backtrack(end):
                        if suffix:
                            result.append(word + " " + suffix)
                        else:
                            result.append(word)
            memo[start] = result
            return result
        
        return backtrack(0)
```

## Explanation

Use backtracking with memoization to generate all possible sentences. Convert `wordDict` to a set for fast lookup. The `backtrack` function starts from index `start`, tries all possible words ending at `end`, and recurses on the remaining string. Combine the word with the suffixes. Memoize the results for each start index to avoid recomputation.

### Time Complexity

- **O(n^2 * m)**, where `n` is string length, `m` is number of words, due to substring checks and combinations.

### Space Complexity

- **O(n^2)** for memo and recursion stack.
