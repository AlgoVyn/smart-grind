# Sentence Similarity Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/sentence-similarity-ii/)

## Solution

```python
from typing import List

class Solution:
    def areSentencesSimilarTwo(self, sentence1: List[str], sentence2: List[str], similarPairs: List[List[str]]) -> bool:
        if len(sentence1) != len(sentence2):
            return False
        
        parent = {}
        
        def find(x):
            if x not in parent:
                parent[x] = x
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
        
        for a, b in similarPairs:
            union(a, b)
        
        for w1, w2 in zip(sentence1, sentence2):
            if find(w1) != find(w2):
                return False
        
        return True
```

## Explanation

This problem checks if two sentences are similar based on given word pairs, where similarity is transitive.

### Step-by-Step Approach:

1. **Length Check**: If sentences have different lengths, return false.

2. **Union-Find Setup**: Use a parent dictionary for disjoint sets.

3. **Find Function**: With path compression for efficiency.

4. **Union Function**: Merge sets if not already connected.

5. **Build Graph**: Union all similar pairs.

6. **Check Sentences**: For each word pair in sentences, check if they are in the same set using find.

7. **Return Result**: True if all pairs are similar, else false.

### Time Complexity:
- O(P * α(W) + N), where P is pairs, W is words, N is sentence length, α is inverse Ackermann (nearly constant).

### Space Complexity:
- O(W), for the parent dictionary.
