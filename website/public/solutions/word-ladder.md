# Word Ladder

## Problem Description

A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:

- Every adjacent pair of words differs by a single letter.
- Every `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.
- `sk == endWord`

Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.

### Examples

**Example 1:**

**Input:**
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
```

**Output:**
```python
5
```

**Explanation:** One shortest transformation sequence is `"hit" -> "hot" -> "dot" -> "dog" -> cog"`, which is 5 words long.

**Example 2:**

**Input:**
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
```

**Output:**
```python
0
```

**Explanation:** The endWord `"cog"` is not in `wordList`, therefore there is no valid transformation sequence.

### Constraints

- `1 <= beginWord.length <= 10`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 5000`
- `wordList[i].length == beginWord.length`
- `beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters.
- `beginWord != endWord`
- All the words in `wordList` are unique.

---

## Solution

```python
from typing import List
from collections import deque

def ladderLength(beginWord: str, endWord: str, wordList: List[str]) -> int:
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0

    queue = deque([(beginWord, 1)])
    visited = set([beginWord])

    while queue:
        word, level = queue.popleft()
        if word == endWord:
            return level

        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                if new_word in wordSet and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, level + 1))

    return 0
```

---

## Explanation

To find the shortest word ladder from `beginWord` to `endWord` using words in `wordList`, use BFS to explore transformations.

1. Convert `wordList` to a set for O(1) lookups.
2. If `endWord` not in `wordList`, return `0`.
3. Use a queue for BFS: store `(current_word, level)`.
4. Start with `beginWord` at level 1, mark as visited.
5. While queue not empty:
   - Dequeue word and level.
   - If word == endWord, return level.
   - Generate all possible words by changing one letter at each position.
   - If `new_word` in wordSet and not visited, mark visited and enqueue with `level+1`.
6. If no path, return `0`.

BFS ensures shortest path.

### Time Complexity

- **O(N * 26 * L)**, N words, L length, generate neighbors.

### Space Complexity

- **O(N)**, for queue and visited.
