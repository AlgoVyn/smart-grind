## Word Ladder (Bidirectional BFS)

**Question:** Shortest transformation sequence length?

<!-- front -->

---

## Answer: Bidirectional BFS

### Solution
```python
from collections import deque

def ladderLength(beginWord, endWord, wordList):
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0
    
    beginSet = {beginWord}
    endSet = {endWord}
    visited = {beginWord, endWord}
    steps = 1
    
    while beginSet and endSet:
        # Always expand smaller set
        if len(beginSet) > len(endSet):
            beginSet, endSet = endSet, beginSet
        
        temp = set()
        
        for word in beginSet:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]
                    
                    if new_word in endSet:
                        return steps + 1
                    
                    if new_word in wordSet and new_word not in visited:
                        temp.add(new_word)
                        visited.add(new_word)
        
        beginSet = temp
        steps += 1
    
    return 0
```

### Visual: Bidirectional BFS
```
begin = "hit"
end = "cog"
dict = ["hot","dot","dog","lot","log","cog"]

Forward from "hit":
hit → hot

Backward from "cog":
cog → log → dog

Meeting: "dog" found!
Steps: hit→hot→dot→dog = 4 (or reverse)
```

### ⚠️ Tricky Parts

#### 1. Why Bidirectional?
```python
# Unidirectional BFS: O(b^d) where d = depth
# Bidirectional: O(b^(d/2)) twice = O(b^(d/2))

# With word length L and 26 letters:
# Reduces from ~26^6 to 2*26^3
```

#### 2. Word Transformation
```python
# Generate all one-letter variations
# For each position, try all 26 letters
# Skip if same letter or not in dictionary
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Unidirectional BFS | O(L × 26^d) | O(b^d) |
| Bidirectional BFS | O(L × 26^(d/2)) | O(b^(d/2)) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not checking endWord | Return 0 if not in set |
| Using visited in both | Track visited properly |
| Wrong expansion | Expand smaller set |

<!-- back -->
