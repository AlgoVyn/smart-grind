# Word Ladder II

## Problem Description

A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:

- Every adjacent pair of words differs by a single letter.
- Every `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.
- `sk == endWord`

Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return all the shortest transformation sequences from `beginWord` to `endWord`, or an empty list if no such sequence exists. Each sequence should be returned as a list of the words `[beginWord, s1, s2, ..., sk]`.

### Examples

**Example 1:**

**Input:**
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
```

**Output:**
```python
[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
```

**Explanation:** There are 2 shortest transformation sequences:
- `"hit" -> "hot" -> "dot" -> "dog" -> "cog"`
- `"hit" -> "hot" -> "lot" -> "log" -> "cog"`

**Example 2:**

**Input:**
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
```

**Output:**
```python
[]
```

**Explanation:** The endWord `"cog"` is not in `wordList`, therefore there is no valid transformation sequence.

### Constraints

- `1 <= beginWord.length <= 5`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 500`
- `wordList[i].length == beginWord.length`
- `beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters.
- `beginWord != endWord`
- All the words in `wordList` are unique.
- The sum of all shortest transformation sequences does not exceed `10^5`.

## Solution

```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return []
        
        queue = deque([beginWord])
        visited = set([beginWord])
        parent = defaultdict(list)
        found = False
        
        while queue and not found:
            level_size = len(queue)
            current_level = set()
            for _ in range(level_size):
                word = queue.popleft()
                for i in range(len(word)):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == word[i]:
                            continue
                        new_word = word[:i] + c + word[i+1:]
                        if new_word in wordSet:
                            if new_word not in visited:
                                current_level.add(new_word)
                                parent[new_word].append(word)
                                if new_word == endWord:
                                    found = True
                            elif new_word in current_level:
                                parent[new_word].append(word)
            visited.update(current_level)
            queue.extend(current_level)
        
        def build_paths(word, path):
            if word == beginWord:
                result.append(path[::-1])
                return
            for p in parent[word]:
                build_paths(p, path + [word])
        
        result = []
        if found:
            build_paths(endWord, [endWord])
        return result
```

## Explanation

Use BFS to find all words at the shortest distance from `beginWord`. Use a parent map to track predecessors for each word. Process level by level, and for each word, generate neighbors by changing one letter. If a neighbor is in `wordList` and not visited, add to current level and record parent. After BFS, use DFS to build all paths from `endWord` back to `beginWord` using the parent map.

### Time Complexity

- **O(n * 26 * l)**, where `n` is wordList size, `l` is word length, due to BFS and neighbor generation.

### Space Complexity

- **O(n * l)**, for queue, visited, and parent map.
