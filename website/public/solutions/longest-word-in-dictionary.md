# Longest Word In Dictionary

## Problem Description

Given an array of strings `words` representing an English Dictionary, return the longest word in `words` that can be built one character at a time by other words in `words`.

If there is more than one possible answer, return the longest word with the smallest lexicographical order. If there is no answer, return the empty string.

Note that the word should be built from left to right with each additional character being added to the end of a previous word.

## Examples

**Example 1:**

**Input:** `words = ["w","wo","wor","worl","world"]`

**Output:** `"world"`

**Explanation:** The word `"world"` can be built one character at a time by `"w"`, `"wo"`, `"wor"`, and `"worl"`.

**Example 2:**

**Input:** `words = ["a","banana","app","appl","ap","apply","apple"]`

**Output:** `"apple"`

**Explanation:** Both `"apply"` and `"apple"` can be built from other words in the dictionary. However, `"apple"` is lexicographically smaller than `"apply"`.

## Constraints

- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 30`
- `words[i]` consists of lowercase English letters.

## Solution

```python
from typing import List

class Solution:
    def longestWord(self, words: List[str]) -> str:
        word_set = set(words)
        words.sort(key=lambda x: (-len(x), x))
        for word in words:
            valid = True
            for i in range(1, len(word)):
                if word[:i] not in word_set:
                    valid = False
                    break
            if valid:
                return word
        return ""
```

## Explanation

This problem requires finding the longest word that can be built by adding one character at a time from other words in the dictionary.

1. Put all words in a set for `O(1)` lookup.
2. Sort the words by length descending, then lexicographical order ascending.
3. For each word in this order, check if all its prefixes (from `1` to `len-1`) are in the set.
4. Return the first valid word, or `""` if none.

## Complexity Analysis

- **Time Complexity:** `O(n log n)` for sorting, `O(n * L)` for checking prefixes, where `L=30`.
- **Space Complexity:** `O(n)`.
