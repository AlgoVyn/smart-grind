# Sentence Similarity II

## Problem Description

Given two sentences `sentence1` and `sentence2` (each is an array of strings), and a list of word pairs `similarPairs`, where similarity is transitive, determine if the two sentences are similar.

Two sentences are similar if:
1. They have the same length.
2. For each corresponding pair of words at the same position, the words are either identical or similar (directly or through transitivity).

### Examples

**Example 1:**
- Input: `sentence1 = ["great","acting","skills"], sentence2 = ["fine","drama","talent"], similarPairs = [["great","fine"],["acting","drama"],["skills","talent"]]`
- Output: `true`

**Example 2:**
- Input: `sentence1 = ["I","love","leetcode"], sentence2 = ["I","love","programming"], similarPairs = [["I","programming"]]`
- Output: `false`

### Constraints

- `1 <= sentence1.length, sentence2.length <= 100`
- `0 <= similarPairs.length <= 5000`
- All words consist of lowercase English letters

---

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

---

## Explanation

This problem checks if two sentences are similar based on given word pairs, where similarity is transitive.

### Approach

Use Union-Find (Disjoint Set Union) data structure to efficiently track and query word similarities.

### Algorithm Steps

1. **Length Check**: If sentences have different lengths, return `false`.
2. **Union-Find Setup**: Use a parent dictionary for disjoint sets.
3. **Find Function**: Implement with path compression for efficiency.
4. **Union Function**: Merge sets if words are not already connected.
5. **Build Graph**: Union all similar pairs.
6. **Check Sentences**: For each word pair in sentences, check if they are in the same set using `find`.
7. **Return Result**: `true` if all pairs are similar, else `false`.

### Time Complexity

- **O(P * α(W) + N)**, where P is the number of pairs, W is the number of unique words, and N is the sentence length. α is the inverse Ackermann function (nearly constant).

### Space Complexity

- **O(W)**, for the parent dictionary.
