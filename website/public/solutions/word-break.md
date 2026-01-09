# Word Break

## Problem Description
Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
Note that the same word in the dictionary may be reused multiple times in the segmentation.
 
Example 1:

Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".

Example 2:

Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.

Example 3:

Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false

 
Constraints:

1 <= s.length <= 300
1 <= wordDict.length <= 1000
1 <= wordDict[i].length <= 20
s and wordDict[i] consist of only lowercase English letters.
All the strings of wordDict are unique.
## Solution

```python
from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        word_set = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        return dp[n]
```

## Explanation
This problem can be solved using dynamic programming. We need to determine if the string `s` can be segmented into words from the dictionary `wordDict`.

### Step-by-Step Approach:
1. **Initialize Data Structures:**
   - Convert `wordDict` into a set for O(1) average-time lookups.
   - Create a boolean DP array `dp` of size `len(s) + 1`, where `dp[i]` represents whether the substring `s[0:i]` can be segmented into dictionary words. Initialize `dp[0] = True` because an empty string is always segmentable.

2. **Fill the DP Array:**
   - Iterate through each position `i` from 1 to `len(s)`.
   - For each `i`, check all possible previous positions `j` from 0 to `i-1`.
   - If `dp[j]` is `True` and the substring `s[j:i]` is in the word set, set `dp[i] = True` and break (no need to check further for this `i`).

3. **Return the Result:**
   - After filling the DP array, `dp[len(s)]` will indicate if the entire string can be segmented.

### Time Complexity:
- O(n^2), where n is the length of `s`, because for each of the n positions, we potentially check up to n substrings, and each substring check involves a set lookup which is O(1) on average.

### Space Complexity:
- O(n + m), where n is the length of `s` for the DP array, and m is the size of `wordDict` for the set.
