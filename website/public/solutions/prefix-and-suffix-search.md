# Prefix And Suffix Search

## Problem Description
[Link to problem](https://leetcode.com/problems/prefix-and-suffix-search/)

Design a special dictionary that searches the words in it by a prefix and a suffix.
Implement the WordFilter class:

WordFilter(string[] words) Initializes the object with the words in the dictionary.
f(string pref, string suff) Returns the index of the word in the dictionary, which has the prefix pref and the suffix suff. If there is more than one valid index, return the largest of them. If there is no such word in the dictionary, return -1.

 
Example 1:

Input
["WordFilter", "f"]
[[["apple"]], ["a", "e"]]
Output
[null, 0]
Explanation
WordFilter wordFilter = new WordFilter(["apple"]);
wordFilter.f("a", "e"); // return 0, because the word at index 0 has prefix = "a" and suffix = "e".

 
Constraints:

1 <= words.length <= 104
1 <= words[i].length <= 7
1 <= pref.length, suff.length <= 7
words[i], pref and suff consist of lowercase English letters only.
At most 104 calls will be made to the function f.


## Solution

```python
class WordFilter:

    def __init__(self, words: List[str]):
        self.d = {}
        for i, word in enumerate(words):
            for j in range(len(word) + 1):
                for k in range(len(word) + 1):
                    self.d[word[:j] + '#' + word[k:]] = i

    def f(self, pref: str, suff: str) -> int:
        return self.d.get(pref + '#' + suff, -1)
```

## Explanation
In init, for each word, generate all prefix and suffix combinations separated by '#', store the index. Since dict overwrites, the last (largest) index is kept. Query is O(1) lookup.

Time complexity: Init O(sum len(word)^2), Query O(1). Space O(sum len(word)^2).
